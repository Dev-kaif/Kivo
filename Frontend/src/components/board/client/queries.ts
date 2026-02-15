
"use client";

import { queryOptions } from "@tanstack/react-query";
import api from "@/lib/api";
import type { BoardsInput, PaginatedBoardsResponse } from "@/lib/types";

export const ownedBoardsClientQueries = {
    list: (input: BoardsInput) =>
        queryOptions<PaginatedBoardsResponse>({
            queryKey: [
                "boards",
                "owner",
                input.page,
                input.pageSize,
                input.search ?? "",
            ],
            queryFn: async () => {
                const { data } = await api.get("/boards", {
                    params: {
                        page: input.page,
                        pageSize: input.pageSize,
                        search: input.search,
                        type: "owner",
                    },
                });

                return data;
            },
        }),
};
