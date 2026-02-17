import { cookies } from 'next/headers';
import axios from 'axios';

export async function getServerApi() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    return axios.create({
        baseURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api`,
        withCredentials: true,
        headers: {
            Cookie: cookieHeader,
        },
    });
}