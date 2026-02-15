export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type Task = {
    id: string;
    title: string;
    description?: string | null;

    position: number;
    listId: string;

    priority: Priority;
    dueDate?: string | null;

    assignees?: {
        id: string;
        name: string;
        email?: string;
    }[];

    createdAt?: string;
    updatedAt?: string;
};

export type List = {
    id: string;
    title: string;
    position: number;
    tasks: Task[];
};
