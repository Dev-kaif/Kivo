'use client';

import { useState } from 'react';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    MoreHorizontal,
    Plus,
    Trash2,
    Pencil,
    Check,
    X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';

import { List } from '@/lib/types';
import { useBoardMutations } from '@/components/board/hooks/useBoardMutations';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/confirmDailog';

interface BoardColumnProps {
    list: List;
    boardId: string;
}

export function BoardColumn({ list, boardId }: BoardColumnProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(list.title);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const {
        renameList,
        deleteList,
        isRenamingList,
        isDeletingList,
        isCreatingTask
    } = useBoardMutations(boardId);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: list.id,
        data: { type: 'Column', list },
        disabled: isEditingTitle,
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const handleRename = async () => {
        if (!title.trim() || title === list.title) {
            setIsEditingTitle(false);
            return;
        }

        await renameList({ listId: list.id, title });
        setIsEditingTitle(false);
    };

    const handleDeleteConfirm = async () => {
        await deleteList(list.id);
        setDeleteOpen(false);
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    'flex h-full max-h-full min-w-75 w-75 flex-col rounded-2xl bg-gray-100/50 border border-gray-100 shadow-sm',
                    isDragging && 'opacity-50'
                )}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-4"
                    {...(!isEditingTitle ? attributes : {})}
                    {...(!isEditingTitle ? listeners : {})}
                >
                    <div className="flex items-center gap-2 flex-1">

                        {isEditingTitle ? (
                            <div className="flex items-center gap-2 w-full">
                                <Input
                                    autoFocus
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRename();
                                        if (e.key === 'Escape') {
                                            setTitle(list.title);
                                            setIsEditingTitle(false);
                                        }
                                    }}
                                    disabled={isRenamingList}
                                    className="h-8 text-sm font-semibold px-2"
                                />

                                <button
                                    onClick={handleRename}
                                    disabled={isRenamingList}
                                    className="p-1.5 rounded-md hover:bg-green-50 text-green-600 transition disabled:opacity-50"
                                >
                                    <Check size={16} />
                                </button>

                                <button
                                    onClick={() => {
                                        setTitle(list.title);
                                        setIsEditingTitle(false);
                                    }}
                                    disabled={isRenamingList}
                                    className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition disabled:opacity-50"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <h3
                                onDoubleClick={() => setIsEditingTitle(true)}
                                className="font-semibold text-gray-800 text-sm tracking-wide cursor-pointer hover:text-black transition-colors"
                            >
                                {list.title}
                            </h3>
                        )}


                        <span className="text-xs font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                            {list.tasks.length}
                        </span>
                    </div>

                    {/* 3-Dot Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                                className="h-8 w-8 text-gray-400 hover:text-gray-700"
                            >
                                <MoreHorizontal size={16} />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditingTitle(true);
                                }}
                            >
                                <Pencil size={14} className="mr-2" />
                                Rename
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteOpen(true);
                                }}
                                className="text-red-600"
                            >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Tasks */}
                <div className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto min-h-0">
                    <SortableContext items={list.tasks.map((t) => t.id)}>
                        {list.tasks.length === 0 && (
                            <div className="text-xs text-gray-400 text-center py-6">
                                No tasks yet
                            </div>
                        )}

                        {list.tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                boardId={boardId}
                            />
                        ))}
                    </SortableContext>
                </div>

                {/* Footer */}
                <div className="p-3">
                    <Button
                        variant="ghost"
                        disabled={isCreatingTask}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                        }}
                        className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-white/50"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {isCreatingTask ? 'Creating...' : 'Add Task'}
                    </Button>
                </div>
            </div>

            {/* Create Task Modal */}
            <TaskModal
                boardId={boardId}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                listId={list.id}
            />

            {/* Confirm Delete Modal */}
            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={`Delete "${list.title}"?`}
                description="This will permanently delete this list and all its tasks."
                confirmText="Delete"
                destructive
                loading={isDeletingList}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
