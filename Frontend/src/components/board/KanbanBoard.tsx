'use client';

import { useEffect, useRef, useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragOverEvent,
    closestCorners,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { BoardColumn } from './BoardColumn';
import { TaskCard } from './TaskCard';
import { useSocketStore } from '@/components/store/useSocketStore';
import { useBoardStore } from '@/components/store/useBoardStore';
import { useBoardMutations } from '@/components/board/hooks/useBoardMutations';
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
    if (targetIndex === tasks.length - 1)
        return tasks[targetIndex - 1].position + 65536;
    return (
        (tasks[targetIndex - 1].position +
            tasks[targetIndex + 1].position) /
        2
    );
}

export function KanbanBoard({
    boardId,
    initialLists,
}: KanbanBoardProps) {
    const {
        lists,
        setLists,
        activeTask,
        setActiveTask,
        moveTask,
        updateTask,
        addList,
        addTask,
    } = useBoardStore();

    const {
        createList,
        moveTask: moveTaskApi,
        isCreatingList,
    } = useBoardMutations(boardId);

    const [isMounted, setIsMounted] = useState(false);
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

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

        socket.on('task:moved', updateTask);
        socket.on('task:created', addTask);
        socket.on('list:created', addList);

        return () => {
            socket.off('task:moved', updateTask);
            socket.off('task:created', addTask);
            socket.off('list:created', addList);
        };
    }, [socket, boardId, updateTask, addTask, addList]);


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    // List Creation
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

        const fromList = lists.find((l) =>
            l.tasks.some((t) => t.id === task.id)
        );

        if (!fromList) return;

        dragState.current = {
            activeId: task.id,
            fromListId: fromList.id,
            toListId: fromList.id,
            toIndex: fromList.tasks.findIndex((t) => t.id === task.id),
        };
    };


    const onDragOver = (event: DragOverEvent) => {
        if (!dragState.current || !event.over) return;

        const overId = event.over.id as string;

        const overList = lists.find(
            (l) =>
                l.id === overId ||
                l.tasks.some((t) => t.id === overId)
        );

        if (!overList) return;

        const tasksWithoutActive = overList.tasks.filter(
            (t) => t.id !== dragState.current!.activeId
        );

        const overIndex = tasksWithoutActive.findIndex(
            (t) => t.id === overId
        );

        const insertIndex =
            overIndex >= 0 ? overIndex : tasksWithoutActive.length;

        dragState.current = {
            ...dragState.current,
            toListId: overList.id,
            toIndex: insertIndex,
        };
    };


    const onDragEnd = async () => {
        const current = dragState.current;
        setActiveTask(null);
        dragState.current = null;

        if (!current) return;

        const { activeId, fromListId, toListId, toIndex } =
            current;

        moveTask(activeId, fromListId, toListId, toIndex);

        const updatedLists = useBoardStore.getState().lists;
        const destList = updatedLists.find(
            (l) => l.id === toListId
        );
        if (!destList) return;

        const finalIndex = destList.tasks.findIndex(
            (t) => t.id === activeId
        );

        const newPosition = computePosition(
            destList.tasks,
            finalIndex
        );

        try {
            await moveTaskApi({
                taskId: activeId,
                newListId: toListId,
                newPosition,
            });
        } catch (error) {
            console.error('Move failed, reverting');
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
                            boardId={boardId}
                        />
                    ))}
                </SortableContext>

                {/* Add List Section */}
                <div className="min-w-80 w-80">
                    {!isAddingList ? (
                        <button
                            onClick={() => setIsAddingList(true)}
                            className="w-full h-12 rounded-xl border-2 border-dashed border-gray-200  text-gray-500 hover:border-gray-400 hover:text-gray-700  transition-colors flex items-center justify-center gap-2  text-sm font-medium bg-white"
                        >
                            <Plus className="h-4 w-4" />
                            Add Section
                        </button>
                    ) : (
                        <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
                            <Input
                                autoFocus
                                placeholder="Section title..."
                                value={newListTitle}
                                onChange={(e) => setNewListTitle(e.target.value)}
                                disabled={isCreatingList}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleAddListSubmit()
                                }
                                className="h-10"
                            />

                            <div className="flex gap-2">
                                <Button
                                    disabled={isCreatingList || !newListTitle.trim()}
                                    onClick={handleAddListSubmit}
                                    className="flex-1"
                                >
                                    {isCreatingList ? 'Adding...' : 'Add List'}
                                </Button>

                                <Button
                                    variant="outline"
                                    disabled={isCreatingList}
                                    onClick={() => {
                                        setIsAddingList(false);
                                        setNewListTitle('');
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>


            </div>

            {isMounted &&
                createPortal(
                    <DragOverlay>
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                                isOverlay
                                boardId={boardId}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>
    );
}
