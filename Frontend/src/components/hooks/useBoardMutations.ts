import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useBoardStore } from '@/components/store/useBoardStore';
import { List, Task } from '@/lib/types';


export function useBoardMutations(boardId: string) {
    const { addList, addTask, setLists, lists } = useBoardStore();

    // Create List
    const createListMutation = useMutation({
        mutationFn: async (title: string) => {
            const { data } = await api.post<List>('/lists', { boardId, title });
            return data;
        },
        onSuccess: (newList) => {
            addList(newList);
        },
    });

    // Create Task
    const createTaskMutation = useMutation({
        mutationFn: async ({ listId, title }: { listId: string; title: string }) => {
            const { data } = await api.post<Task>('/tasks', { listId, title });
            return data;
        },
        onSuccess: (newTask) => {
            addTask(newTask);
        },
    });

    // Move Task
    const moveTaskMutation = useMutation({
        mutationFn: async ({ taskId, newListId, newPosition }: { taskId: string; newListId: string; newPosition: number }) => {
            await api.put(`/tasks/${taskId}/move`, { newListId, newPosition });
        },
        onError: (error, variables, context) => {
            console.error("Move failed, reverting...", error);
        },
    });

    return {
        createList: createListMutation.mutateAsync,
        createTask: createTaskMutation.mutateAsync,
        moveTask: moveTaskMutation.mutateAsync,
    };
}