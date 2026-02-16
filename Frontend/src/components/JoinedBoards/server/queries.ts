import { queryOptions } from "@tanstack/react-query";
import { getServerApi } from "@/lib/server-api";
import type { BoardsInput, PaginatedBoardsResponse } from "@/lib/types";

export const joinedBoardsServerQueries = {
    list: (input: BoardsInput) =>
        queryOptions<PaginatedBoardsResponse>({
            queryKey: [
                "boards",
                "member",
                input.page,
                input.pageSize,
                input.search ?? "",
            ],
            queryFn: async () => {
                const api = await getServerApi();

                const { data } = await api.get("/boards", {
                    params: {
                        page: input.page,
                        pageSize: input.pageSize,
                        search: input.search,
                        type: "member",
                    },
                });

                return data;
            },
        }),
};
