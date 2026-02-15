import { HydrateClient } from "@/lib/hydration";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import type { SearchParams } from "nuqs/server";
import { prefetchOwnedBoards } from "@/components/board/server/prefetch";
import { ownedBoardsParamLoader } from "@/components/board/server/paramLoader";
import { OwnedBoardsContainer, OwnedBoardsError, OwnedBoardsLoading } from "@/components/board/page/BoardPageComponents";
import { OwnedBoardsList } from "@/components/board/page/BoardsList";

type Props = {
    searchParams: Promise<SearchParams>;
};

export default async function page({ searchParams }: Props) {

    const params = await ownedBoardsParamLoader(searchParams);

    await prefetchOwnedBoards(params);

    return (
        <OwnedBoardsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<OwnedBoardsError />}>
                    <Suspense fallback={<OwnedBoardsLoading />}>
                        <OwnedBoardsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </OwnedBoardsContainer>
    );
}
