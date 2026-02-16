"use client";

import {
    EmptyView,
    EntityList,
} from "@/components/Generic/entityComponents";

import { Board } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreVerticalIcon,
    PencilIcon,
    TrashIcon,
    CheckIcon,
    XIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSuspenseJoinedBoards } from "../hooks/useJoinedBoards";
import { useJoinedBoardMutations } from "../hooks/useJoinedBoardMutations";

export const JoinedBoardsList = () => {
    const boards = useSuspenseJoinedBoards();

    return (
        <EntityList
            items={boards.data.items}
            getKey={(board: Board) => board.id}
            emptyView={
                <EmptyView message="You haven't Joined any boards yet." />
            }
            renderItem={(board: Board) => (
                <BoardItem board={board} />
            )}
        />
    );
};

const BoardItem = ({ board }: { board: Board }) => {
    const { renameBoard, deleteBoard, isDeleting, isRenaming } = useJoinedBoardMutations();

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(board.title);

    const handleRename = async () => {
        if (!title.trim() || title === board.title) {
            setIsEditing(false);
            return;
        }

        await renameBoard({
            boardId: board.id,
            title,
        });

        setIsEditing(false);
    };

    const handleDelete = async () => {
        await deleteBoard(board.id);
    };

    return (
        <Card
            className={cn(
                "px-5 py-4 shadow-none transition-all duration-200",
                "hover:shadow-sm hover:border-primary/30 hover:bg-muted/30",
                "rounded-xl"
            )}
        >
            <div className="flex items-center justify-between">
                {/* Left */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {board.title.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex flex-col flex-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    autoFocus
                                    className="h-8 text-sm w-52"
                                    onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        handleRename()
                                    }
                                />

                                <CheckIcon
                                    className="size-4 cursor-pointer text-green-600"
                                    onClick={handleRename}
                                />

                                <XIcon
                                    className="size-4 cursor-pointer text-muted-foreground"
                                    onClick={() => {
                                        setTitle(board.title);
                                        setIsEditing(false);
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={`/boards/${board.id}`}
                                    className="text-sm font-medium"
                                >
                                    {board.title}
                                </Link>

                                <span className="text-xs text-muted-foreground">
                                    {board._count?.members ?? 0} members
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Updated{" "}
                        {formatDistanceToNow(
                            new Date(board.updatedAt),
                            { addSuffix: true }
                        )}
                    </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded-md hover:bg-muted"
                            >
                                <MoreVerticalIcon className="size-4" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenuItem
                                onClick={() => setIsEditing(true)}
                            >
                                <PencilIcon className="size-4 mr-2" />
                                Rename
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-red-600 focus:text-red-600"
                            >
                                <TrashIcon className="size-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    );
};
