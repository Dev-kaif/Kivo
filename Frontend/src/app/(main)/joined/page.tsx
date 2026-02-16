import { HydrateClient } from "@/lib/hydration";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import type { SearchParams } from "nuqs/server";
import { JoinedBoardsContainer, JoinedBoardsError, JoinedBoardsLoading } from "@/components/JoinedBoards/page/BoardPageComponents";
import { joinedBoardsParamLoader } from "@/components/JoinedBoards/server/paramLoader";
import { prefetchJoinedBoards } from "@/components/JoinedBoards/server/prefetch";
import { JoinedBoardsList } from "@/components/JoinedBoards/page/BoardsList";

type Props = {
    searchParams: Promise<SearchParams>;
};

export default async function page({ searchParams }: Props) {

    const params = await joinedBoardsParamLoader(searchParams);

    await prefetchJoinedBoards(params);

    return (
        <JoinedBoardsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<JoinedBoardsError />}>
                    <Suspense fallback={<JoinedBoardsLoading />}>
                        <JoinedBoardsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </JoinedBoardsContainer>
    );
}
