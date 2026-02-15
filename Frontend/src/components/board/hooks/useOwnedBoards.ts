"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ownedBoardsClientQueries } from "../client/queries";
import { useOwnedBoardsParams } from "./useBoardParams";

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
