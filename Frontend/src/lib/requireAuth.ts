import { redirect } from "next/navigation";
import { getServerApi } from "@/lib/server-api";

export async function requireAuth() {
    try {
        const api = await getServerApi();
        const { data } = await api.get("/auth/me");
        return data; // return user if needed
    } catch {
        redirect("/login");
    }
}
