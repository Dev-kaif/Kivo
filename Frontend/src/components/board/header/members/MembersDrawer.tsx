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
import { TrashIcon } from "lucide-react";
import {
    useBoardMembers,
    useGetBoardMembers,
} from "../../hooks/useBoardMembers";
import { useSuspenseMe } from "@/components/Settings/hooks/useSuspenseMe";

interface Props {
    boardId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
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

    const { data: currentUser } = useSuspenseMe();

    const currentUserId = currentUser?.id;

    const {
        removeMember,
        isRemoving,
    } = useBoardMembers(boardId);

    // 🔥 Find myself inside members list
    const me = members.find(
        (m: any) => m.user.id === currentUserId
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
                        <LoadingView message="Loading members" />
                    ) : members.length === 0 ? (
                        <EmptyView message="No members found" />
                    ) : (
                        <div className="space-y-4">
                            {members.map((member: any) => {
                                const isSelf =
                                    member.user.id === currentUserId;

                                return (
                                    <div
                                        key={member.user.id}
                                        className="flex items-center justify-between border-b pb-3 last:border-0"
                                    >
                                        <div>
                                            <div className="text-sm font-medium">
                                                {member.user.name}
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                {member.user.email}
                                            </div>

                                            <div className="text-[11px] text-muted-foreground">
                                                {member.role === "ADMIN"
                                                    ? "Admin"
                                                    : "Member"}
                                            </div>
                                        </div>

                                        {/* ✅ Only show remove if I am admin and not removing myself */}
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
                                                <TrashIcon className="h-4 w-4 text-red-500" />
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
