import axios from 'axios';

const isProd = process.env.NODE_ENV === "production";

const baseURL = isProd
    ? "/api"
    : `http://localhost:8000/api`;


const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
