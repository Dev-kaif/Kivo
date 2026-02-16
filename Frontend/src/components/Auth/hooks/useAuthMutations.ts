"use client";

import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAuthMutations() {
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: async (input: {
            email: string;
            password: string;
        }) => {
            const { data } = await api.post("/auth/login", input);
            return data;
        },
        onSuccess: () => {
            toast.success("Welcome back!");
            router.push("/dashboard");
            router.refresh();
        },
        onError: (err: any) => {
            toast.error(
                err.response?.data?.error ||
                "Login failed"
            );
        },
    });

    const signUpMutation = useMutation({
        mutationFn: async (input: {
            name: string;
            email: string;
            password: string;
        }) => {
            const { data } = await api.post("/auth/signup", input);
            return data;
        },
        onSuccess: () => {
            toast.success("Account created!");
            router.push("/dashboard");
            router.refresh();
        },
        onError: (err: any) => {
            toast.error(
                err.response?.data?.error ||
                "Signup failed"
            );
        },
    });

    return {
        login: loginMutation.mutateAsync,
        signup: signUpMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        isSigningUp: signUpMutation.isPending,
    };
}
