import { prefetch } from "@/lib/hydration";
import { joinedBoardsServerQueries } from "./queries";
import type { BoardsInput } from "@/lib/types";

export async function prefetchJoinedBoards(input: BoardsInput) {
    await prefetch(
        joinedBoardsServerQueries.list({
            page: input.page,
            pageSize: input.pageSize,
            search: input.search ?? "",
        })
    );
}
