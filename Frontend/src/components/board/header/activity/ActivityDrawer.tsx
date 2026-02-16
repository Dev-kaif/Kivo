"use client";
import { useCallback, useEffect, useRef } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingView, EmptyView } from "@/components/Generic/entityComponents";
import type { Activity } from "@/lib/types";
import { formatActivityMessage } from "@/components/Dashboard/utils/formatActivity";
import { useBoardActivity } from "./useBoardActivity";

interface Props {
    boardId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ActivityDrawer({ boardId, open, onOpenChange }: Props) {
    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useBoardActivity(boardId);

    const activities = data?.pages.flatMap((page) => page.items) ?? [];

    const hasNextPageRef = useRef(hasNextPage);
    const isFetchingRef = useRef(isFetchingNextPage);
    const fetchNextPageRef = useRef(fetchNextPage);
    const viewportRef = useRef<HTMLElement | null>(null);

    // Keep refs in sync on every render
    hasNextPageRef.current = hasNextPage;
    isFetchingRef.current = isFetchingNextPage;
    fetchNextPageRef.current = fetchNextPage;

    // Attach scroll listener once when the sheet opens —> never re-attach
    const scrollAreaRef = useCallback((node: HTMLDivElement | null) => {
        if (!node) return;

        const viewport = node.querySelector<HTMLElement>(
            "[data-radix-scroll-area-viewport]"
        );
        if (!viewport) return;

        viewportRef.current = viewport;

        let timeout: ReturnType<typeof setTimeout> | null = null;

        const handleScroll = () => {
            if (timeout) return; // debounce

            timeout = setTimeout(() => {
                timeout = null;
                const { scrollTop, scrollHeight, clientHeight } = viewport;
                const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

                if (
                    distanceFromBottom < 150 &&
                    hasNextPageRef.current &&
                    !isFetchingRef.current
                ) {
                    fetchNextPageRef.current();
                }
            }, 200);
        };

        viewport.addEventListener("scroll", handleScroll);
    }, []);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-95 p-0">
                <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle>Activity</SheetTitle>
                </SheetHeader>
                <div ref={scrollAreaRef}>
                    <ScrollArea className="h-[calc(100vh-60px)] px-6 py-4">
                        {isLoading ? (
                            <LoadingView message="Loading activity" />
                        ) : activities.length === 0 ? (
                            <EmptyView message="No activity yet." />
                        ) : (
                            <div className="space-y-4">
                                {activities.map((activity: Activity) => (
                                    <div
                                        key={activity.id}
                                        className="border-b pb-3 last:border-0"
                                    >
                                        <div className="text-sm font-medium">
                                            {activity.user?.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatActivityMessage(activity)}
                                        </div>
                                        <div className="text-[11px] text-muted-foreground mt-1">
                                            {new Date(activity.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                                <div className="py-2 text-center text-xs text-muted-foreground">
                                    {isFetchingNextPage
                                        ? "Loading more..."
                                        : hasNextPage
                                            ? "Scroll for more"
                                            : "You're all caught up"}
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    );
}