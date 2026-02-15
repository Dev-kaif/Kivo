"use client";

import {
    EmptyView,
    EntityList,
} from "@/components/Generic/entityComponents";

import { useSuspenseOwnedBoards } from "../hooks/useOwnedBoards";
import { Board } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const OwnedBoardsList = () => {
    const boards = useSuspenseOwnedBoards();

    return (
        <EntityList
            items={boards.data.items}
            getKey={(board: Board) => board.id}
            emptyView={
                <EmptyView message="You haven't created any boards yet." />
            }
            renderItem={(board: Board) => (
                <Link href={`/boards/${board.id}`}>
                    <Card
                        className={cn(
                            "px-5 py-4 shadow-none transition-all duration-200",
                            "hover:shadow-sm hover:border-primary/30 hover:bg-muted/30",
                            "cursor-pointer rounded-xl"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            {/* Left */}
                            <div className="flex items-center gap-4">

                                {/* Board Avatar */}
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                    {board.title.slice(0, 2).toUpperCase()}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                        {board.title}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        {board._count?.members ?? 0} members
                                    </span>
                                </div>
                            </div>

                            {/* Right */}
                            <span className="text-xs text-muted-foreground">
                                Updated{" "}
                                {formatDistanceToNow(new Date(board.updatedAt), {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                    </Card>
                </Link>
            )}
        />
    );
};
