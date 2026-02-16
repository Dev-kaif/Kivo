"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.post("/auth/logout");
        },
        onSuccess: () => {
            queryClient.clear();
            router.push("/login");
            toast.success("Logged out");
        },
        onError: () => {
            toast.error("Failed to logout");
        },
    });

    return {
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
    };
}
