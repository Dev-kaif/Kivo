import { HydrateClient } from "@/lib/hydration";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import type { SearchParams } from "nuqs/server";
import { prefetchOwnedBoards } from "@/components/OwnedBoards/server/prefetch";
import { ownedBoardsParamLoader } from "@/components/OwnedBoards/server/paramLoader";
import { OwnedBoardsContainer, OwnedBoardsError, OwnedBoardsLoading } from "@/components/OwnedBoards/page/BoardPageComponents";
import { OwnedBoardsList } from "@/components/OwnedBoards/page/BoardsList";
import { requireAuth } from "@/lib/requireAuth";

type Props = {
    searchParams: Promise<SearchParams>;
};

export default async function page({ searchParams }: Props) {

    await requireAuth();

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
