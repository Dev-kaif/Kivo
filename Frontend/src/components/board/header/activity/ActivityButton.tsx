"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HistoryIcon } from "lucide-react";
import { ActivityDrawer } from "./ActivityDrawer";

interface Props {
    boardId: string;
}

export function ActivityButton({ boardId }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(true)}
            >
                <HistoryIcon className="h-4 w-4 mr-2" />
                Activity
            </Button>

            <ActivityDrawer
                boardId={boardId}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
}
