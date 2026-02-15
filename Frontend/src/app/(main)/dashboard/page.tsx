
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import type { SearchParams } from "nuqs/server";

import { HydrateClient } from "@/lib/hydration";
import { DashboardContainer, DashboardError, DashboardLoading } from "@/components/Dashboard/DashboardComponents";
import { prefetchDashboard } from "@/components/Dashboard/server/prefetchDashboard";
import { dashboardParamLoader } from "@/components/Dashboard/server/paramsLoader";
import { DashboardContent } from "@/components/Dashboard/DashboardContent";

type Props = {
    searchParams: Promise<SearchParams>;
};

async function Page({ searchParams }: Props) {

    const params = await dashboardParamLoader(searchParams);

    // Server prefetch
    await prefetchDashboard(params);

    return (
        <DashboardContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<DashboardError />}>
                    <Suspense fallback={<DashboardLoading />}>
                        <DashboardContent />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </DashboardContainer>
    );
}

export default Page;
