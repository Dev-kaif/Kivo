"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useOwnedBoardMutations() {
    const queryClient = useQueryClient();

    const renameBoard = useMutation({
        mutationFn: async ({
            boardId,
            title,
        }: {
            boardId: string;
            title: string;
        }) => {
            const { data } = await api.put(`/boards/${boardId}`, {
                title,
            });

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["boards", "owner"],
            });

            queryClient.invalidateQueries({
                queryKey: ["dashboard"],
            });
        },
    });

    const deleteBoard = useMutation({
        mutationFn: async (boardId: string) => {
            const { data } = await api.delete(
                `/boards/${boardId}`
            );

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["boards", "owner"],
            });

            queryClient.invalidateQueries({
                queryKey: ["dashboard"],
            });
        },
    });

    return {
        renameBoard: renameBoard.mutateAsync,
        deleteBoard: deleteBoard.mutateAsync,

        isRenaming: renameBoard.isPending,
        isDeleting: deleteBoard.isPending,
    };
}
