import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useBoardStore } from '@/components/store/useBoardStore';
import { List, Task } from '@/lib/types';

export function useBoardMutations(boardId: string) {
    const { addList, addTask, updateTask, setLists, lists } = useBoardStore();
    const queryClient = useQueryClient()

    const createListMutation = useMutation({
        mutationFn: async (title: string) => {
            const { data } = await api.post<List>('/lists', {
                boardId,
                title,
            });
            return data;
        },
        onSuccess: (newList) => {
            addList(newList);
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
        },
    });

    const deleteListMutation = useMutation({
        mutationFn: async (listId: string) => {
            await api.delete(`/lists/${listId}`);
            return listId;
        },
        onSuccess: (listId) => {
            setLists(lists.filter((l) => l.id !== listId));
        },
    });

    const createTaskMutation = useMutation({
        mutationFn: async ({
            listId,
            title,
            description,
            priority,
            dueDate,
            assigneeIds
        }: {
            listId: string;
            title: string;
            description?: string;
            priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
            dueDate?: Date;
            assigneeIds?: string[];
        }) => {
            const { data } = await api.post<Task>('/tasks', {
                listId,
                title,
                description,
                priority,
                dueDate,
                assigneeIds
            });
            return data;
        },
        onSuccess: (newTask) => {
            addTask(newTask);
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: async ({
            taskId,
            updates,
        }: {
            taskId: string;
            updates: {
                title?: string;
                description?: string;
                priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
                dueDate?: Date;
                assigneeIds?: string[];
            };
        }) => {
            const { data } = await api.put<Task>(`/tasks/${taskId}`, updates);
            return data;
        },
        onSuccess: (updatedTask) => {
            updateTask(updatedTask);
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
                    tasks: l.tasks.filter((t) => t.id !== taskId),
                }))
            );
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
            })
        },
        onError: (error) => {
            console.error("Move failed", error);
        },
    });

    return {
        // List
        createList: createListMutation.mutateAsync,
        renameList: renameListMutation.mutateAsync,
        deleteList: deleteListMutation.mutateAsync,

        // Task
        createTask: createTaskMutation.mutateAsync,
        updateTask: updateTaskMutation.mutateAsync,
        deleteTask: deleteTaskMutation.mutateAsync,
        moveTask: moveTaskMutation.mutateAsync,

        // Loading States
        isCreatingList: createListMutation.isPending,
        isRenamingList: renameListMutation.isPending,
        isDeletingList: deleteListMutation.isPending,

        isCreatingTask: createTaskMutation.isPending,
        isUpdatingTask: updateTaskMutation.isPending,
        isDeletingTask: deleteTaskMutation.isPending,
        isMovingTask: moveTaskMutation.isPending,
    };
}
