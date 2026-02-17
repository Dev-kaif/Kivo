"use client"

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EmptyView, ErrorView, LoadingView } from "../Generic/entityComponents";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "@/lib/types";
import { formatActivityMessage } from "./utils/formatActivity";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
    CheckIcon,
    MoreVerticalIcon,
    PencilIcon,
    TrashIcon,
    XIcon,
} from "lucide-react";
import { useOwnedBoardMutations } from "../OwnedBoards/hooks/useOwnedBoardMutations";
import { ConfirmDialog } from "../ui/confirmDailog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardContainerProps {
    children: ReactNode;
    className?: string;
}

export const DashboardContainer = ({
    children,
    className,
}: DashboardContainerProps) => {
    return (
        <div className="p-6 md:px-10 md:py-8">
            <div
                className={cn(
                    "mx-auto max-w-7xl w-full flex flex-col gap-8",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
};

interface Board {
    id: string;
    title: string;
    ownerId: string;
    owner: {
        id: string;
        name: string;
    };
}

interface RecentBoardsListProps {
    boards: Board[];
    isLoading: boolean;
}

export const RecentBoardsList = ({
    boards,
    isLoading,
}: RecentBoardsListProps) => {
    const recentBoards = boards.slice(0, 3);

    const {
        renameBoard,
        deleteBoard,
        isDeleting,
        isRenaming,
    } = useOwnedBoardMutations();

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);
    const [selectedBoard, setSelectedBoard] =
        useState<Board | null>(null);

    const [editingBoardId, setEditingBoardId] =
        useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");

    const startRename = (board: Board) => {
        setEditingBoardId(board.id);
        setRenameValue(board.title);
    };

    const cancelRename = () => {
        setEditingBoardId(null);
        setRenameValue("");
    };

    const confirmRename = async (boardId: string) => {
        if (!renameValue.trim()) return;

        await renameBoard({
            boardId,
            title: renameValue.trim(),
        });

        cancelRename();
    };

    const handleDeleteClick = (board: Board) => {
        setSelectedBoard(board);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedBoard) return;

        await deleteBoard(selectedBoard.id);
        setDeleteDialogOpen(false);
        setSelectedBoard(null);
    };

    return (
        <>
            <div className="space-y-4">
                <h2 className="text-base font-semibold">
                    Recent Boards
                </h2>

                {isLoading ? (
                    <div className="min-h-32 flex items-center justify-center">
                        <LoadingView message="Loading boards" />
                    </div>
                ) : recentBoards.length === 0 ? (
                    <EmptyView message="No recent boards found." />
                ) : (
                    <div className="flex flex-col gap-3">
                        {recentBoards.map((board) => {
                            const isEditing =
                                editingBoardId === board.id;

                            return (
                                <Link
                                    key={board.id}
                                    href={`/boards/${board.id}`}
                                    onClick={(e) => {
                                        if (isEditing)
                                            e.preventDefault();
                                    }}
                                >
                                    <Card className="rounded-xl border bg-card shadow-none px-4 sm:px-5 py-4 transition-all duration-200 hover:bg-muted/30">
                                        <div className="flex items-start sm:items-center justify-between gap-3">

                                            {/* LEFT SECTION */}
                                            <div className="flex items-start gap-3 flex-1 min-w-0">

                                                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                                                    {board.title
                                                        .slice(0, 2)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="flex flex-col flex-1 min-w-0">
                                                    {isEditing ? (
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">

                                                            <Input
                                                                value={renameValue}
                                                                onChange={(e) =>
                                                                    setRenameValue(
                                                                        e.target.value
                                                                    )
                                                                }
                                                                onKeyDown={(e) => {
                                                                    if (
                                                                        e.key ===
                                                                        "Enter"
                                                                    )
                                                                        confirmRename(
                                                                            board.id
                                                                        );
                                                                    if (
                                                                        e.key ===
                                                                        "Escape"
                                                                    )
                                                                        cancelRename();
                                                                }}
                                                                autoFocus
                                                                className="h-8 text-sm w-full sm:w-54"
                                                            />

                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    disabled={
                                                                        isRenaming
                                                                    }
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        confirmRename(
                                                                            board.id
                                                                        );
                                                                    }}
                                                                >
                                                                    <CheckIcon className="size-4 text-green-600" />
                                                                </Button>

                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        cancelRename();
                                                                    }}
                                                                >
                                                                    <XIcon className="size-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="text-sm font-medium truncate">
                                                                {board.title}
                                                            </span>

                                                            <span className="text-xs text-muted-foreground truncate">
                                                                Owner:{" "}
                                                                {
                                                                    board.owner
                                                                        .name
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* RIGHT DROPDOWN */}
                                            {!isEditing && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            className="p-1 rounded-md hover:bg-muted shrink-0"
                                                        >
                                                            <MoreVerticalIcon className="size-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="end"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                startRename(
                                                                    board
                                                                )
                                                            }
                                                        >
                                                            <PencilIcon className="size-4 mr-2" />
                                                            Rename
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    board
                                                                )
                                                            }
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <TrashIcon className="size-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Board"
                description={`Are you sure you want to delete "${selectedBoard?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                destructive
                loading={isDeleting}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};





interface RecentActivityCardProps {
    activities: Activity[];
    isLoading: boolean;
}

export const RecentActivityCard = ({
    activities,
    isLoading,
}: RecentActivityCardProps) => {
    const recent = activities.slice(0, 5);

    return (
        <Card className="shadow-none">
            <CardContent className="p-6 space-y-5 min-h-60">
                <div>
                    <h2 className="text-base font-semibold tracking-tight">
                        Recent Activity
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Latest updates across your boards.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-28">
                        <LoadingView message="Loading activity" />
                    </div>
                ) : recent.length === 0 ? (
                    <EmptyView message="No recent activity yet." />
                ) : (
                    <div className="space-y-4">
                        {recent.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start justify-between gap-3 border-b last:border-0 pb-3 last:pb-0"
                            >
                                <div className="flex flex-col text-sm">
                                    <span className="font-medium">
                                        {activity.user?.name}
                                    </span>

                                    <span className="text-muted-foreground text-xs">
                                        {formatActivityMessage(activity)}
                                    </span>
                                </div>

                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {new Date(
                                        activity.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

            </CardContent>
        </Card>
    );
};



export const DashboardLoading = () => {
    return <LoadingView message='Loading Workflows' />;
};

export const DashboardError = () => {
    return <ErrorView message='Error loading Workflows' />;
};

