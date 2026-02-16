"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UsersIcon } from "lucide-react";
import { MembersDrawer } from "./MembersDrawer";

interface Props {
    boardId: string;
}

export function MembersButton({ boardId }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(true)}
            >
                <UsersIcon className="h-4 w-4 mr-2" />
                Members
            </Button>

            <MembersDrawer
                boardId={boardId}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
}
