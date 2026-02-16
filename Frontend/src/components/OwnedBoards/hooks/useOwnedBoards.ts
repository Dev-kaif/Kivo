"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useOwnedBoardsParams } from "./useBoardParams";
import { ownedBoardsClientQueries } from "../client/queries";

export function useSuspenseOwnedBoards() {
    const [params] = useOwnedBoardsParams();

    return useSuspenseQuery(
        ownedBoardsClientQueries.list({
            page: params.page,
            pageSize: params.pageSize,
            search: params.search,
        })
    );
}

