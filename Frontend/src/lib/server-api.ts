import { cookies } from 'next/headers';
import axios from 'axios';

export async function getServerApi() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    return axios.create({
        baseURL: 'http://localhost:8000/api',
        withCredentials: true,
        headers: {
            Cookie: cookieHeader,
        },
    });
}