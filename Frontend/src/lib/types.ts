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

export interface GetBoardsInput {
    page: number;
    pageSize: number;
    search?: string;
    type?: 'owner' | 'member' | 'all';
}

export type DashboardBoardsInput = {
    search?: string;
    type?: "owner" | "member" | "all";
};

export interface BoardOwner {
    id: string;
    name: string;
    email: string;
}

export interface Board {
    id: string;
    title: string;
    ownerId: string;
    owner: BoardOwner;

    createdAt: string;
    updatedAt: string;

    _count: {
        members: number;
    };
}

export interface PaginatedBoardsResponse {
    items: Board[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}


export interface ActivityUser {
    id: string;
    name: string;
    email: string;
}

export interface ActivityBoard {
    id: string;
    title: string;
}

export interface ActivityTask {
    id: string;
    title: string;
}

export type ActivityAction =
    | "BOARD_CREATED"
    | "BOARD_UPDATED"
    | "BOARD_DELETED"
    | "TASK_CREATED"
    | "TASK_UPDATED"
    | "TASK_MOVED"
    | "TASK_DELETED"
    | "MEMBER_ADDED"
    | "MEMBER_REMOVED"
    | "LIST_CREATED"
    | "LIST_UPDATED"
    | "LIST_DELETED";


export interface Activity {
    id: string;
    action: ActivityAction;
    details?: Record<string, any> | null;

    user: ActivityUser;
    board: ActivityBoard;
    task?: ActivityTask | null;

    createdAt: string;
}
