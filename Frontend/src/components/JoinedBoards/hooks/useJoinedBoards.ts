"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useJoinedBoardsParams } from "./useBoardParams";
import { joinedBoardsClientQueries } from "../client/queries";

export function useSuspenseJoinedBoards() {
    const [params] = useJoinedBoardsParams();

    return useSuspenseQuery(
        joinedBoardsClientQueries.list({
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        })
    );
}

