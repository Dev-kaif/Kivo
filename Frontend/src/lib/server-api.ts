import { cookies } from 'next/headers';
import axios from 'axios';

export async function getServerApi() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const isProd = process.env.NODE_ENV === "production";

    const baseURL = isProd
        ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api`
        : "http://localhost:8000/api";

    return axios.create({
        baseURL,
        withCredentials: true,
        headers: {
            Cookie: cookieHeader,
        },
    });
}