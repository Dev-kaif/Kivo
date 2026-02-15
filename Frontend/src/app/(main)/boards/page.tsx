"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CreateBoardPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/boards", {
                title,
            });

            const board = res.data;

            // redirect to board page
            router.push(`/boards/${board.id}`);

        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create board");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <form
                onSubmit={handleCreate}
                className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow-sm"
            >
                <h1 className="text-xl font-semibold">Create New Board</h1>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                <input
                    type="text"
                    placeholder="Board title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-black py-2 text-white disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Board"}
                </button>
            </form>
        </div>
    );
}
