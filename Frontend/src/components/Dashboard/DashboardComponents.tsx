
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EmptyView, ErrorView, LoadingView } from "../Generic/entityComponents";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "@/lib/types";
import { formatActivityMessage } from "./utils/formatActivity";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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

    return (
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
                    {recentBoards.map((board) => (
                        <Link
                            key={board.id}
                            href={`/boards/${board.id}`}
                        >
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

                                        {/* Avatar */}
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                            {board.title.slice(0, 2).toUpperCase()}
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {board.title}
                                            </span>

                                            <span className="text-xs text-muted-foreground">
                                                Owner: {board.owner.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
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
            <CardContent className="p-6 space-y-5 min-h-55">

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

