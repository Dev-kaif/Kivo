"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSettingsMutations() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const resetPasswordMutation = useMutation({
        mutationKey: ["auth", "reset-password"],
        mutationFn: async (input: {
            currentPassword: string;
            newPassword: string;
        }) => {
            const { data } = await api.post(
                "/auth/reset-password",
                input
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Password updated successfully");
        },
        onError: (err: any) => {
            toast.error(
                err.response?.data?.error || "Failed to reset password"
            );
        },
    });

    const deleteAccountMutation = useMutation({
        mutationKey: ["auth", "delete-account"],
        mutationFn: async (input: {
            password: string;
        }) => {
            const { data } = await api.put(
                "/auth/delete-account",
                input
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Account deleted");
            queryClient.clear();
            router.push("/login");
        },
        onError: (err: any) => {
            toast.error(
                err.response?.data?.error || "Failed to delete account"
            );
        },
    });

    const renameUserMutation = useMutation({
        mutationKey: ["auth", "rename"],
        mutationFn: async (input: {
            newName: string;
        }) => {
            const { data } = await api.put(
                "/auth/rename",
                input
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Renamed Successfully");
            queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        },
        onError: (err: any) => {
            toast.error(
                err.response?.data?.error || "Failed to Rename account"
            );
        },
    });

    return {
        resetPassword: resetPasswordMutation.mutateAsync,
        isResetting: resetPasswordMutation.isPending,

        updateProfile: renameUserMutation.mutateAsync,
        isUpdating: renameUserMutation.isPending,

        deleteAccount: deleteAccountMutation.mutateAsync,
        isDeleting: deleteAccountMutation.isPending,
    };
}
