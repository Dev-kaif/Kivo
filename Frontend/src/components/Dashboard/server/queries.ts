import { getServerApi } from "@/lib/server-api";
import { DashboardBoardsInput } from "@/lib/types";
import { queryOptions } from "@tanstack/react-query";


export const dashboardQueries = {
    recentBoards: (input?: DashboardBoardsInput) =>
        queryOptions({
            queryKey: [
                "dashboard",
                "recentBoards",
                input?.search ?? "",
                input?.type ?? "all",
            ],
            queryFn: async () => {
                const api = await getServerApi();

                const { data } = await api.get("/boards", {
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
        queryOptions({
            queryKey: ["dashboard", "recentActivity"],
            queryFn: async () => {
                const api = await getServerApi();
                const { data } = await api.get("/activity/recent");
                return data;
            },
        }),
};
