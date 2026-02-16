import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useBoardStore } from "@/components/store/useBoardStore";
import { List, Task } from "@/lib/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

function getErrorMessage(error: unknown) {
    const err = error as AxiosError<{ error?: string }>;
    return err?.response?.data?.error || "Something went wrong";
}

type UpdateTaskInput = {
    title?: string;
    description?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: Date;
    assigneeIds?: string[];
};


export function useBoardMutations(boardId: string) {
    const { addList, addTask, updateTask, setLists, lists } =
        useBoardStore();
    const queryClient = useQueryClient();

    const createListMutation = useMutation({
        mutationFn: async (title: string) => {
            const { data } = await api.post<List>("/lists", {
                boardId,
                title,
            });
            return data;
        },
        onSuccess: (newList) => {
            addList(newList);
            toast.success("List created successfully");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const renameListMutation = useMutation({
        mutationFn: async ({
            listId,
            title,
        }: {
            listId: string;
            title: string;
        }) => {
            await api.put(`/lists/${listId}`, { title });
            return { listId, title };
        },
        onSuccess: ({ listId, title }) => {
            setLists(
                lists.map((l) =>
                    l.id === listId ? { ...l, title } : l
                )
            );
            toast.success("List renamed");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const deleteListMutation = useMutation({
        mutationFn: async (listId: string) => {
            await api.delete(`/lists/${listId}`);
            return listId;
        },
        onSuccess: (listId) => {
            setLists(lists.filter((l) => l.id !== listId));
            toast.success("List deleted");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const createTaskMutation = useMutation({
        mutationFn: async (input: {
            listId: string;
            title: string;
            description?: string;
            priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            dueDate?: Date;
            assigneeIds?: string[];
        }) => {
            const { data } = await api.post<Task>("/tasks", input);
            return data;
        },
        onSuccess: (newTask) => {
            addTask(newTask);
            toast.success("Task created");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: async ({
            taskId,
            updates,
        }: {
            taskId: string;
            updates: UpdateTaskInput;
        }) => {
            const { data } = await api.put<Task>(
                `/tasks/${taskId}`,
                updates
            );
            return data;
        },
        onSuccess: (updatedTask) => {
            updateTask(updatedTask);
            toast.success("Task updated");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: async (taskId: string) => {
            await api.delete(`/tasks/${taskId}`);
            return taskId;
        },
        onSuccess: (taskId) => {
            setLists(
                lists.map((l) => ({
                    ...l,
                    tasks: l.tasks.filter(
                        (t) => t.id !== taskId
                    ),
                }))
            );
            toast.success("Task deleted");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const moveTaskMutation = useMutation({
        mutationFn: async ({
            taskId,
            newListId,
            newPosition,
        }: {
            taskId: string;
            newListId: string;
            newPosition: number;
        }) => {
            const { data } = await api.put<Task>(
                `/tasks/${taskId}/move`,
                { newListId, newPosition }
            );
            return data;
        },
        onSuccess: (updatedTask) => {
            updateTask(updatedTask);

            queryClient.invalidateQueries({
                queryKey: ["board", boardId, "activity"],
            });

            // toast.success("Task moved");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    return {
        createList: createListMutation.mutateAsync,
        renameList: renameListMutation.mutateAsync,
        deleteList: deleteListMutation.mutateAsync,

        createTask: createTaskMutation.mutateAsync,
        updateTask: updateTaskMutation.mutateAsync,
        deleteTask: deleteTaskMutation.mutateAsync,
        moveTask: moveTaskMutation.mutateAsync,

        isCreatingList: createListMutation.isPending,
        isRenamingList: renameListMutation.isPending,
        isDeletingList: deleteListMutation.isPending,

        isCreatingTask: createTaskMutation.isPending,
        isUpdatingTask: updateTaskMutation.isPending,
        isDeletingTask: deleteTaskMutation.isPending,
        isMovingTask: moveTaskMutation.isPending,
    };
}
