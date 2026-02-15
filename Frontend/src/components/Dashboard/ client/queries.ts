import { queryOptions } from "@tanstack/react-query";
import type {
    DashboardBoardsInput,
    PaginatedBoardsResponse,
    Activity,
} from "@/lib/types";
import api from "@/lib/api";

export const dashboardClientQueries = {
    recentBoards: (input?: DashboardBoardsInput) =>
        queryOptions<PaginatedBoardsResponse>({
            queryKey: [
                "dashboard",
                "recentBoards",
                input?.search ?? "",
                input?.type ?? "all",
            ] as const,
            queryFn: async () => {

                const { data } = await api.get<PaginatedBoardsResponse>("/boards", {
                    params: {
                        page: 1,
                        pageSize: 3,
                        search: input?.search,
                        type: input?.type ?? "all",
                    },
                });

                return data;
            },
        }),

    recentActivity: () =>
        queryOptions<Activity[]>({
            queryKey: ["dashboard", "recentActivity"] as const,
            queryFn: async () => {
                const { data } = await api.get<Activity[]>("/activity/recent");
                return data;
            },
        }),
};
