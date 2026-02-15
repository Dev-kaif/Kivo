import { useState } from 'react';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskCard } from './TaskCard';
import { List } from '@/lib/types';
import { useBoardMutations } from '@/components/hooks/useBoardMutations';

interface BoardColumnProps {
    list: List;
}

export function BoardColumn({ list }: BoardColumnProps) {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const { createTask } = useBoardMutations('current-board-id');

    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id: list.id,
        data: { type: 'Column', list },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;
        try {
            await createTask({ listId: list.id, title: newTaskTitle });
            setNewTaskTitle('');
            setIsAddingTask(false);
        } catch (error) {
            console.error("Failed to add task", error);
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="flex h-full max-h-full min-w-75 w-75 flex-col rounded-2xl bg-gray-100/50 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-4" {...attributes} {...listeners}>
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{list.title}</h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">{list.tasks.length}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto min-h-0">
                <SortableContext items={list.tasks.map((t) => t.id)}>
                    {list.tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>

            <div className="p-3">
                {!isAddingTask ? (
                    <Button variant="ghost" onClick={() => setIsAddingTask(true)} className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-white/50">
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                ) : (
                    <div className="bg-white p-3 rounded-lg border shadow-sm animate-in fade-in zoom-in-95 duration-200">
                        <Input
                            autoFocus
                            placeholder="Task title..."
                            className="mb-2 h-8 text-sm"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                        />
                        <div className="flex gap-2 items-center">
                            <Button size="sm" onClick={handleAddTask} className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700">Add</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsAddingTask(false)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}