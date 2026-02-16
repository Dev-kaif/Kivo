import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,

    connect: () => {
        if (get().socket?.connected) return;

        const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
            withCredentials: true,
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            set({ isConnected: true });
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            set({ isConnected: false });
        });

        set({ socket });
    },

    disconnect: () => {
        get().socket?.disconnect();
        set({ socket: null, isConnected: false });
    },
}));