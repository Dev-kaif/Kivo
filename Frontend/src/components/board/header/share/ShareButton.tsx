"use client";

import { Button } from "@/components/ui/button";
import { Share2Icon } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { SharePopoverContent } from "./SharePopover";

interface ShareButtonProps {
    boardId: string;
}

export function ShareButton({ boardId }: ShareButtonProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                    <Share2Icon className="h-4 w-4 mr-2" />
                    Share
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80">
                <SharePopoverContent boardId={boardId} />
            </PopoverContent>
        </Popover>
    );
}
