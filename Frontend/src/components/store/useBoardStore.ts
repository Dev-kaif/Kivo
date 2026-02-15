import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { List, Task } from '@/lib/types';

// Helper Functions (Moved from Component)
function moveBetweenLists(
    lists: List[],
    activeId: string,
    fromListId: string,
    toListId: string,
    insertIndex: number,
    toIndex: number
): List[] {
    const task = lists.flatMap((l) => l.tasks).find((t) => t.id === activeId);
    if (!task) return lists;

    return lists.map((l) => {
        if (l.id === fromListId) {
            return { ...l, tasks: l.tasks.filter((t) => t.id !== activeId) };
        }
        if (l.id === toListId) {
            const base = l.tasks.filter((t) => t.id !== activeId);
            const next = [...base];
            next.splice(insertIndex, 0, { ...task, listId: toListId });
            return { ...l, tasks: next };
        }
        return l;
    });
}

interface BoardState {
    lists: List[];
    activeTask: Task | null;
    setLists: (lists: List[]) => void;
    setActiveTask: (task: Task | null) => void;
    addList: (list: List) => void;
    addTask: (task: Task) => void;
    moveTask: (activeId: string, fromListId: string, toListId: string, toIndex: number) => void;
    updateTask: (task: Task) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    lists: [],
    activeTask: null,

    setLists: (lists) => set({ lists }),

    setActiveTask: (task) => set({ activeTask: task }),

    addList: (list) => set((state) => {
        if (state.lists.some(l => l.id === list.id)) return state;
        return { lists: [...state.lists, { ...list, tasks: [] }] };
    }),

    addTask: (task) => set((state) => ({
        lists: state.lists.map(l => {
            if (l.id !== task.listId) return l;
            if (l.tasks.some(t => t.id === task.id)) return l; // Dedup
            return { ...l, tasks: [...l.tasks, task].sort((a, b) => a.position - b.position) };
        })
    })),

    updateTask: (updatedTask) =>
        set((state) => {
            const newLists = state.lists.map((list) => {

                // Remove task everywhere
                const filteredTasks = list.tasks.filter(
                    (t) => t.id !== updatedTask.id
                );

                // Add to correct list
                if (list.id === updatedTask.listId) {
                    return {
                        ...list,
                        tasks: [...filteredTasks, updatedTask].sort(
                            (a, b) => a.position - b.position
                        ),
                    };
                }

                return { ...list, tasks: filteredTasks };
            });

            return { lists: newLists };
        }),

    moveTask: (activeId, fromListId, toListId, toIndex) => set((state) => {
        let newLists = [...state.lists];

        if (fromListId === toListId) {
            newLists = newLists.map((l) => {
                if (l.id !== fromListId) return l;
                const fromIndex = l.tasks.findIndex((t) => t.id === activeId);
                if (fromIndex === -1) return l;
                return { ...l, tasks: arrayMove(l.tasks, fromIndex, toIndex) };
            });
        } else {
            newLists = moveBetweenLists(newLists, activeId, fromListId, toListId, toIndex, toIndex);
        }

        return { lists: newLists };
    }),
}));