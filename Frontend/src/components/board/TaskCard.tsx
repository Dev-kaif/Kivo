'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    ChevronDown,
    ChevronUp,
    Calendar,
    Pencil,
    Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';
import { TaskModal } from './TaskModal';
import { useBoardMutations } from '@/components/hooks/useBoardMutations';
import { ConfirmDialog } from '../ui/confirmDailog';

interface TaskCardProps {
    task: Task;
    isOverlay?: boolean;
    boardId: string;
}

export function TaskCard({
    task,
    isOverlay,
    boardId,
}: TaskCardProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { deleteTask, isDeletingTask } = useBoardMutations(boardId);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: { type: 'Task', task },
        disabled: isOverlay,
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const priorityStyles: Record<string, string> = {
        HIGH: 'bg-red-50 text-red-600',
        MEDIUM: 'bg-orange-50 text-orange-600',
        LOW: 'bg-blue-50 text-blue-600',
        URGENT: 'bg-purple-50 text-purple-600',
    };

    const handleDeleteConfirm = async () => {
        await deleteTask(task.id);
        setDeleteOpen(false);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
            >
                <Card
                    className={cn(
                        'p-3 border-0 shadow-sm hover:shadow-md transition-all bg-white group relative cursor-grab active:cursor-grabbing',
                        isDragging && 'opacity-30',
                        isOverlay &&
                        'rotate-2 scale-105 shadow-xl ring-2 ring-blue-500/20 z-50'
                    )}
                >
                    <div className="space-y-2">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            {/* Title */}
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(!expanded);
                                }}
                                className="text-sm font-medium text-gray-800 leading-snug cursor-pointer"
                            >
                                {task.title}
                            </span>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                {/* Edit */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setModalOpen(true);
                                    }}
                                    className="text-gray-400 hover:text-gray-700 p-1"
                                >
                                    <Pencil size={14} />
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteOpen(true);
                                    }}
                                    disabled={isDeletingTask}
                                    className={cn(
                                        'p-1',
                                        isDeletingTask
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-400 hover:text-red-600'
                                    )}
                                >
                                    <Trash2 size={14} />
                                </button>

                                {/* Expand */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExpanded(!expanded);
                                    }}
                                    className="text-gray-400 hover:text-gray-700 p-1"
                                >
                                    {expanded ? (
                                        <ChevronUp size={14} />
                                    ) : (
                                        <ChevronDown size={14} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Priority */}
                        {task.priority && (
                            <Badge
                                className={cn(
                                    'text-[10px] px-1.5 h-5 font-normal border-0',
                                    priorityStyles[task.priority]
                                )}
                            >
                                {task.priority}
                            </Badge>
                        )}

                        {/* Assignees */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {task.assignees && task.assignees.length > 0 ? (
                                task.assignees.map((user) => (
                                    <Avatar
                                        key={user.id}
                                        className="h-6 w-6 text-[10px]"
                                    >
                                        <AvatarFallback>
                                            {user.name?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ))
                            ) : (
                                <span className="text-[11px] text-gray-400">
                                    Unassigned
                                </span>
                            )}
                        </div>

                        {/* Due Date */}
                        {task.dueDate && (
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                <Calendar size={12} />
                                {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                        )}

                        {/* Expanded Description */}
                        {expanded && task.description && (
                            <div className="text-xs text-gray-600 pt-2 border-t mt-2">
                                {task.description}
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Edit Modal */}
            <TaskModal
                boardId={boardId}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                task={task}
            />

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Task?"
                description="This action cannot be undone."
                confirmText="Delete"
                destructive
                loading={isDeletingTask}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
