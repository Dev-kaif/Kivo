import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cache } from 'react';
import {
    defaultShouldDehydrateQuery,
    QueryClient,
} from "@tanstack/react-query";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000,
            },
            dehydrate: {
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === "pending",
            },
            hydrate: {},
        },
    });
}

export const getQueryClient = cache(makeQueryClient);

export function HydrateClient(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {props.children}
        </HydrationBoundary>
    );
}

export function prefetch(queryOptions: { queryKey: unknown; queryFn?: unknown }) {
    const queryClient: QueryClient = getQueryClient();
    if ("initialPageParam" in queryOptions) {
        return queryClient.prefetchInfiniteQuery(queryOptions as any);
    }
    return queryClient.prefetchQuery(queryOptions as any);
}