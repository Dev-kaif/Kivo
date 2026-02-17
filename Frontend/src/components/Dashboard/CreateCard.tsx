"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon, PlusIcon } from "lucide-react";
import api from "@/lib/api";

export const CreateBoardCard = () => {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!title.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/boards", { title });
            const board = res.data;

            router.push(`/boards/${board.id}`);
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to create board"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-xl border bg-card shadow-none min-h-60">
            <CardContent className="p-6 flex flex-col gap-4">

                {/* Header */}
                <div>
                    <h2 className="text-base font-semibold tracking-tight">
                        Create New Board
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Start organizing tasks and collaborating.
                    </p>
                </div>

                {/* Input */}
                <div className="flex flex-col gap-3 mt-2">
                    <Input
                        placeholder="Board title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleCreate()
                        }
                        disabled={loading}
                    />

                    {error && (
                        <p className="text-xs text-red-500">
                            {error}
                        </p>
                    )}
                </div>

                {/* Button */}
                <Button
                    onClick={handleCreate}
                    disabled={loading || !title.trim()}
                    className="h-10 w-full"
                >
                    {loading ? (
                        <>
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Create Board
                        </>
                    )}
                </Button>

            </CardContent>
        </Card>
    );
};

