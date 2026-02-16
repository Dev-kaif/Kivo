"use client";
import api from "@/lib/api";
import { Activity } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

type ActivityPage = {
    items: Activity[];
    nextCursor: string | null;
};

export function useBoardActivity(boardId: string) {
    return useInfiniteQuery<ActivityPage>({
        queryKey: ["board", boardId, "activity"],
        initialPageParam: null,
        queryFn: async ({ pageParam }) => {
            const { data } = await api.get(`/activity/boards/${boardId}`, {
                params: {
                    cursor: pageParam ?? undefined,
                    pageSize: 10,
                },
            });
            return data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });
}