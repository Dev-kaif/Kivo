'use client';
import { useEffect, useRef, useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    closestCorners,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { BoardColumn } from './BoardColumn';
import { TaskCard } from './TaskCard';
import { useSocketStore } from '@/components/store/useSocketStore';
import { useBoardStore } from '@/components/store/useBoardStore';
import { useBoardMutations } from '@/components/hooks/useBoardMutations';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { List, Task } from '@/lib/types';


interface KanbanBoardProps {
    boardId: string;
    initialLists: List[];
}

function computePosition(tasks: Task[], targetIndex: number): number {
    if (tasks.length <= 1) return 65536;
    if (targetIndex === 0) return tasks[1].position / 2;
    if (targetIndex === tasks.length - 1) return tasks[targetIndex - 1].position + 65536;
    return (tasks[targetIndex - 1].position + tasks[targetIndex + 1].position) / 2;
}

export function KanbanBoard({ boardId, initialLists }: KanbanBoardProps) {
    const { lists, setLists, activeTask, setActiveTask, moveTask, updateTask, addList, addTask } = useBoardStore();

    const { createList, moveTask: moveTaskApi } = useBoardMutations(boardId);

    const [isMounted, setIsMounted] = useState(false);
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

    // Refs for Drag Logic
    const dragState = useRef<{
        activeId: string;
        fromListId: string;
        toListId: string;
        toIndex: number;
    } | null>(null);

    const { socket } = useSocketStore();

    useEffect(() => {
        setIsMounted(true);
        setLists(initialLists);
    }, [initialLists, setLists]);

    // Socket Listeners
    useEffect(() => {
        if (!socket) return;
        socket.emit('joinBoard', boardId);

        const handleTaskMoved = (task: Task) => updateTask(task);
        const handleTaskCreated = (task: Task) => addTask(task);
        const handleListCreated = (list: List) => addList(list);

        socket.on('task:moved', handleTaskMoved);
        socket.on('task:created', handleTaskCreated);
        socket.on('list:created', handleListCreated);

        return () => {
            socket.off('task:moved', handleTaskMoved);
            socket.off('task:created', handleTaskCreated);
            socket.off('list:created', handleListCreated);
        };
    }, [socket, boardId, updateTask, addTask, addList]);

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleAddListSubmit = async () => {
        if (!newListTitle.trim()) return;
        try {
            await createList(newListTitle);
            setNewListTitle('');
            setIsAddingList(false);
        } catch (err) {
            console.error(err);
        }
    };

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type !== 'Task') return;
        const task = event.active.data.current.task as Task;
        setActiveTask(task);

        const fromList = lists.find((l) => l.tasks.some((t) => t.id === task.id));
        if (!fromList) return;

        dragState.current = {
            activeId: task.id,
            fromListId: fromList.id,
            toListId: fromList.id,
            toIndex: fromList.tasks.findIndex((t) => t.id === task.id),
        };
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || !dragState.current) return;

        const overId = over.id as string;
        const overList = lists.find(l => l.id === overId || l.tasks.some(t => t.id === overId));

        if (!overList) return;

        const overListTasks = overList.tasks.filter(t => t.id !== active.id);
        const overTaskIndex = overListTasks.findIndex(t => t.id === overId);

        let insertIndex: number;
        if (overTaskIndex >= 0) {
            const cursorBelow = active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height / 2;
            insertIndex = overTaskIndex + (cursorBelow ? 1 : 0);
        } else {
            insertIndex = overListTasks.length;
        }

        // Store this for onDragEnd
        dragState.current = {
            ...dragState.current,
            toListId: overList.id,
            toIndex: insertIndex,
        };
    };

    const onDragEnd = async (event: DragEndEvent) => {
        const currentDrag = dragState.current;
        setActiveTask(null);
        dragState.current = null;

        if (!currentDrag || !event.over) return;

        const { activeId, fromListId, toListId, toIndex } = currentDrag;

        moveTask(activeId, fromListId, toListId, toIndex);


        const updatedLists = useBoardStore.getState().lists;
        const destList = updatedLists.find(l => l.id === toListId);

        if (!destList) return;

        const finalIndex = destList.tasks.findIndex(t => t.id === activeId);
        const newPosition = computePosition(destList.tasks, finalIndex);

        try {
            await moveTaskApi({ taskId: activeId, newListId: toListId, newPosition });
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div className="flex h-full gap-4 overflow-x-auto p-6 bg-gray-50/50 items-start">
                <SortableContext items={lists.map((col) => col.id)}>
                    {lists.map((col) => (
                        <BoardColumn
                            key={col.id}
                            list={col}
                        />
                    ))}
                </SortableContext>

                <div className="min-w-75 w-75">
                    {!isAddingList ? (
                        <button
                            onClick={() => setIsAddingList(true)}
                            className="w-full h-12.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center font-medium bg-white/50"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Section
                        </button>
                    ) : (
                        <div className="bg-white p-3 rounded-xl border shadow-sm space-y-2">
                            <Input
                                autoFocus
                                placeholder="Section Title..."
                                value={newListTitle}
                                onChange={(e) => setNewListTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddListSubmit()}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleAddListSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">Add List</Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsAddingList(false)}><X className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isMounted && createPortal(
                <DragOverlay>
                    {activeTask && <TaskCard task={activeTask} isOverlay />}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}