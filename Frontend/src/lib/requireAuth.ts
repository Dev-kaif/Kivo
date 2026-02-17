import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerApi } from "@/lib/server-api";

export async function requireAuth() {
    const cookieStore = await cookies();

    try {
        const api = await getServerApi();
        const response = await api.get("/auth/me");

        return response.data;

    } catch (err: any) {
        console.log("Auth error:", err);
        redirect("/login");
    }
}
