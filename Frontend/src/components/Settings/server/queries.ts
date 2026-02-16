import { queryOptions } from "@tanstack/react-query";
import { getServerApi } from "@/lib/server-api";

export const settingsServerQueries = {
    me: () =>
        queryOptions({
            queryKey: ["auth", "me"],
            queryFn: async () => {
                const api = await getServerApi();
                const { data } = await api.get("/auth/me");
                return data;
            },
        }),
};
