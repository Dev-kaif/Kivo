"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function useBoardMembers(boardId: string) {

    const addMemberMutation = useMutation({
        mutationKey: ["board", boardId, "add-member"],
        mutationFn: async (input: { email: string }) => {
            const { data } = await api.post(
                `/members/${boardId}`,
                input
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Member added successfully");
        },
        onError: (err: any) => {
            toast.error(
                err?.response?.data?.error ||
                "Failed to add member"
            );
        },
    });

    const removeMemberMutation = useMutation({
        mutationKey: ["board", boardId, "remove-member"],
        mutationFn: async (userId: string) => {
            const { data } = await api.delete(
                `/members/${boardId}`,
                { params: { userId } }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Member removed");
        },
        onError: (err: any) => {
            toast.error(
                err?.response?.data?.error ||
                "Failed to remove member"
            );
        },
    });

    const generateInviteMutation = useMutation({
        mutationKey: ["board", boardId, "invite"],
        mutationFn: async () => {
            const { data } = await api.post(
                `/members/${boardId}/invite`
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Invite link generated");
        },
        onError: (err: any) => {
            toast.error(
                err?.response?.data?.error ||
                "Failed to generate invite link"
            );
        },
    });

    return {
        addMember: addMemberMutation.mutateAsync,
        removeMember: removeMemberMutation.mutateAsync,
        generateInvite: generateInviteMutation.mutateAsync,

        isAdding: addMemberMutation.isPending,
        isRemoving: removeMemberMutation.isPending,
        isGeneratingInvite: generateInviteMutation.isPending,
    };
}

export function useGetBoardName(boardId: string) {
    const getBoardName = useQuery({
        queryKey: ["name", boardId],
        queryFn: async () => {
            const { data } = await api.get(
                `/boards/name/${boardId}`
            );
            return data;
        }
    })

    return {
        BoardName: getBoardName.data,
        isGettingName: getBoardName.isLoading
    }
}