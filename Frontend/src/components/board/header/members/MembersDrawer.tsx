"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    LoadingView,
    EmptyView,
} from "@/components/Generic/entityComponents";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrashIcon, Loader2 } from "lucide-react";
import {
    useBoardMembers,
    useGetBoardMembers,
} from "../../hooks/useBoardMembers";
import { useGetInfo, useSuspenseMe } from "@/components/Settings/hooks/useSuspenseMe";

interface Props {
    boardId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Member {
    role: "ADMIN" | "MEMBER";
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export function MembersDrawer({
    boardId,
    open,
    onOpenChange,
}: Props) {
    const {
        members = [],
        isGettingMembers: isLoading,
    } = useGetBoardMembers(boardId);

    const { data: currentUser } = useGetInfo();
    const currentUserId = currentUser?.id;

    const {
        removeMember,
        isRemoving,
    } = useBoardMembers(boardId);

    const me = members.find(
        (m: Member) => m.user.id === currentUserId
    );

    const amIAdmin = me?.role === "ADMIN";

    const handleRemove = async (userId: string) => {
        await removeMember(userId);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-96 p-0">
                <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle>Board Members</SheetTitle>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-60px)] px-6 py-4">
                    {isLoading ? (
                        <LoadingView message="Loading members..." />
                    ) : members.length === 0 ? (
                        <EmptyView message="No members found" />
                    ) : (
                        <div className="space-y-4">
                            {members.map((member: Member) => {
                                const isSelf =
                                    member.user.id === currentUserId;

                                const isAdmin =
                                    member.role === "ADMIN";

                                return (
                                    <div
                                        key={member.user.id}
                                        className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/40 transition"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    {member.user.name}
                                                </span>

                                                {isSelf && (
                                                    <Badge variant="secondary">
                                                        You
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                {member.user.email}
                                            </div>

                                            <div>
                                                <Badge
                                                    variant={
                                                        isAdmin
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                >
                                                    {isAdmin
                                                        ? "Admin"
                                                        : "Member"}
                                                </Badge>
                                            </div>
                                        </div>

                                        {amIAdmin && !isSelf && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleRemove(
                                                        member.user.id
                                                    )
                                                }
                                                disabled={isRemoving}
                                            >
                                                {isRemoving ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                                                ) : (
                                                    <TrashIcon className="h-4 w-4 text-red-500" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
