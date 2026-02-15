import { prefetch } from "@/lib/hydration";
import { ownedBoardsServerQueries } from "./queries";
import type { BoardsInput } from "@/lib/types";

export async function prefetchOwnedBoards(input: BoardsInput) {
    await prefetch(
        ownedBoardsServerQueries.list({
            page: input.page,
            pageSize: input.pageSize,
            search: input.search ?? "",
        })
    );
}
