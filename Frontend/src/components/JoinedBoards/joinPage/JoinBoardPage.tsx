"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Loader2Icon } from "lucide-react";

export default function JoinBoardPage() {

    const { token } = useParams<{ token: string }>();
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const joinBoard = async () => {
            try {
                const { data } = await api.post(
                    `/members/join/${token}`
                );

                const boardId = data.boardId;

                if (!boardId) {
                    throw new Error("Invalid response");
                }

                router.replace(`/boards/${boardId}`);
            } catch (err: any) {
                setError(
                    err?.response?.data?.error ||
                    "Invalid or expired invite link"
                );
            }
        };

        joinBoard();
    }, [token, router]);

    return (
        <div className="flex min-h-[90vh] items-center justify-center">
            {error ? (
                <div className="text-center space-y-3">
                    <h1 className="text-lg font-semibold">
                        Unable to Join
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {error}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-3">
                    <Loader2Icon className="h-6 w-6 animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Joining board...
                    </p>
                </div>
            )}
        </div>
    );
}
