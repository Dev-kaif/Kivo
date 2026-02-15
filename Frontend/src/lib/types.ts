export type Task = {
    id: string;
    title: string;
    position: number;
    listId: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
};

export type List = {
    id: string;
    title: string;
    position: number;
    tasks: Task[];
};