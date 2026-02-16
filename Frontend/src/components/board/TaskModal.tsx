"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import { Task } from "@/lib/types";
import { useBoardMutations } from "@/components/board/hooks/useBoardMutations";
import { useGetBoardMembers } from "./hooks/useBoardMembers";

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

    const { members, isGettingMembers } = useGetBoardMembers(boardId);

    const isLoading = isCreatingTask || isUpdatingTask;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [priority, setPriority] =
        useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">(
            "MEDIUM"
        );

    const [dueDate, setDueDate] = useState<string>("");

    const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);

    const [search, setSearch] = useState("");

    const filteredMembers = members?.filter(({ user }: any) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );



    // Populate on edit
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || "");
            setPriority(task.priority || "MEDIUM");
            setDueDate(task.dueDate?.slice(0, 10) || "");
            setSelectedAssigneeIds(
                task.assignees?.map((a) => a.id) || []
            );
        } else {
            resetForm();
        }
    }, [task, open]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setDueDate("");
        setSelectedAssigneeIds([]);
    };

    const toggleAssignee = (userId: string) => {
        setSelectedAssigneeIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const isFormValid = useMemo(() => {
        return (
            title.trim().length > 0 &&
            priority &&
            dueDate.length > 0
        );
    }, [title, priority, dueDate]);

    const handleSubmit = async () => {
        if (!isFormValid) return;

        try {
            if (isEditMode && task) {
                await updateTask({
                    taskId: task.id,
                    updates: {
                        title,
                        description,
                        priority,
                        dueDate: new Date(dueDate),
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
                    dueDate: new Date(dueDate),
                    assigneeIds: selectedAssigneeIds,
                });
            }

            resetForm();
            onClose();
        } catch (error) {
            console.error("Task save failed", error);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(val) =>
                !isLoading && !val && onClose()
            }
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode
                            ? "Edit Task"
                            : "Create Task"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-2">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Title *
                        </label>
                        <Input
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            disabled={isLoading}
                            placeholder="Task title"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Description
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows={3}
                            disabled={isLoading}
                            placeholder="Optional description"
                        />
                    </div>

                    {/* Priority & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Priority *
                            </label>
                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(
                                        e.target
                                            .value as any
                                    )
                                }
                                disabled={isLoading}
                                className="w-full border rounded-md p-2 text-sm bg-background"
                            >
                                <option value="LOW">
                                    LOW
                                </option>
                                <option value="MEDIUM">
                                    MEDIUM
                                </option>
                                <option value="HIGH">
                                    HIGH
                                </option>
                                <option value="URGENT">
                                    URGENT
                                </option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Due Date *
                            </label>
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) =>
                                    setDueDate(
                                        e.target.value
                                    )
                                }
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Assignees */}
                    {/* Assignees */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Assignees
                        </label>

                        <div className="relative">
                            <Input
                                placeholder="Search members..."
                                disabled={isLoading || isGettingMembers}
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                            />

                            {search && filteredMembers.length > 0 && (
                                <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto border rounded-md bg-background shadow-md">
                                    {filteredMembers.map(({ user }: any) => (
                                        <div
                                            key={user.id}
                                            onClick={() => {
                                                toggleAssignee(user.id);
                                                setSearch("");
                                            }}
                                            className="px-3 py-2 text-sm hover:bg-muted cursor-pointer flex justify-between items-center"
                                        >
                                            <span>
                                                {user.name}
                                            </span>

                                            {selectedAssigneeIds.includes(user.id) && (
                                                <span className="text-xs text-primary">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Members */}
                        {selectedAssigneeIds.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {members
                                    ?.filter(({ user }: any) =>
                                        selectedAssigneeIds.includes(user.id)
                                    )
                                    .map(({ user }: any) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-md"
                                        >
                                            {user.name}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleAssignee(user.id)
                                                }
                                                className="text-primary/70 hover:text-primary"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        )}
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
                        disabled={
                            isLoading ||
                            !isFormValid
                        }
                    >
                        {isLoading
                            ? isEditMode
                                ? "Updating..."
                                : "Creating..."
                            : isEditMode
                                ? "Update"
                                : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
