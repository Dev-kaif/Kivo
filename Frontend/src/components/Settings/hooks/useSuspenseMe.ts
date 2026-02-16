"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useSuspenseMe() {
    return useSuspenseQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
            const { data } = await api.get("/auth/me");
            return data;
        },
    });
}

export function useGetInfo() {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
            const { data } = await api.get("/auth/me");
            return data;
        },
    });
}
