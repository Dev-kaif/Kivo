'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import api from '@/lib/api';
import { Task } from '@/lib/types';
import { useBoardMutations } from '@/components/board/hooks/useBoardMutations';

interface BoardMember {
    user: {
        id: string;
        name: string;
        email: string;
    };
    role: string;
}

interface TaskModalProps {
    boardId: string;
    open: boolean;
    onClose: () => void;
    listId?: string;
    task?: Task | null;
}

export function TaskModal({
    boardId,
    open,
    onClose,
    listId,
    task,
}: TaskModalProps) {
    const isEditMode = !!task;

    const {
        createTask,
        updateTask,
        isCreatingTask,
        isUpdatingTask,
    } = useBoardMutations(boardId);

    const isLoading = isCreatingTask || isUpdatingTask;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] =
        useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
    const [dueDate, setDueDate] = useState<string | undefined>();

    const [members, setMembers] = useState<BoardMember[]>([]);
    const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);

    useEffect(() => {
        if (!open) return;

        let mounted = true;

        const fetchMembers = async () => {
            try {
                const res = await api.get(`/boards/${boardId}/members`);
                if (mounted) setMembers(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMembers();

        return () => {
            mounted = false;
        };
    }, [boardId, open]);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority || 'MEDIUM');
            setDueDate(task.dueDate?.slice(0, 10));
            setSelectedAssigneeIds(task.assignees?.map(a => a.id) || []);
        } else {
            resetForm();
        }
    }, [task, open]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setDueDate(undefined);
        setSelectedAssigneeIds([]);
    };

    const toggleAssignee = (userId: string) => {
        setSelectedAssigneeIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;

        try {
            if (isEditMode && task) {
                await updateTask({
                    taskId: task.id,
                    updates: {
                        title,
                        description,
                        priority,
                        dueDate: dueDate ? new Date(dueDate) : undefined,
                        assigneeIds: selectedAssigneeIds,
                    },
                });
            } else {
                if (!listId) return;

                await createTask({
                    listId,
                    title,
                    description,
                    priority,
                    dueDate: dueDate ? new Date(dueDate) : undefined,
                    assigneeIds: selectedAssigneeIds,
                });
            }

            resetForm();
            onClose();
        } catch (error) {
            console.error('Task save failed', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !isLoading && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? 'Edit Task' : 'Create Task'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">

                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="text-sm font-medium">Priority</label>
                        <select
                            value={priority}
                            onChange={e =>
                                setPriority(e.target.value as any)
                            }
                            disabled={isLoading}
                            className="w-full border rounded-md p-2 text-sm"
                        >
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                            <option value="URGENT">URGENT</option>
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="text-sm font-medium">Due Date</label>
                        <Input
                            type="date"
                            value={dueDate || ''}
                            onChange={e => setDueDate(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Assignees */}
                    <div>
                        <label className="text-sm font-medium">Assignees</label>

                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                            {members.length === 0 && (
                                <p className="text-xs text-gray-400">
                                    No members found
                                </p>
                            )}

                            {members.map(({ user }) => (
                                <label
                                    key={user.id}
                                    className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                    <Checkbox
                                        checked={selectedAssigneeIds.includes(user.id)}
                                        onCheckedChange={() => toggleAssignee(user.id)}
                                        disabled={isLoading}
                                    />
                                    <span>{user.name}</span>
                                    <span className="text-xs text-gray-400">
                                        ({user.email})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? isEditMode
                                ? 'Updating...'
                                : 'Creating...'
                            : isEditMode
                                ? 'Update'
                                : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
