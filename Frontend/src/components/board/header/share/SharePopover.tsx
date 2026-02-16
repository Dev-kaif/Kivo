"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useBoardMembers } from "../../hooks/useBoardMembers";
import { Separator } from "@/components/ui/separator";
import { CopyIcon, LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
    boardId: string;
}

export function SharePopoverContent({ boardId }: Props) {
    const [email, setEmail] = useState("");
    const [inviteUrl, setInviteUrl] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);

    const {
        addMember,
        generateInvite,
        isAdding,
        isGeneratingInvite,
    } = useBoardMembers(boardId);

    // Add member
    const handleAdd = async () => {
        if (!email.trim()) return;

        await addMember({ email });
        setEmail("");
    };

    // Generate invite link
    const handleGenerateInvite = async () => {
        const res = await generateInvite();

        if (res?.inviteUrl) {
            setInviteUrl(res.inviteUrl);
            setExpiresAt(res.expiresAt);
        }
    };

    // Copy link
    const handleCopy = async () => {
        if (!inviteUrl) return;

        await navigator.clipboard.writeText(inviteUrl);
        toast.success("Invite link copied");
    };

    return (
        <div className="space-y-5">

            {/* Add Member */}
            <div className="space-y-3">
                <div>
                    <h3 className="text-sm font-medium">
                        Add Member
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Invite someone by email
                    </p>
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isAdding}
                    />
                    <Button
                        size="sm"
                        onClick={handleAdd}
                        disabled={isAdding || !email.trim()}
                    >
                        {isAdding ? "Adding..." : "Add"}
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Invite Link */}
            <div className="space-y-3">
                <div>
                    <h3 className="text-sm font-medium">
                        Invite Link
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Generate a shareable link
                    </p>
                </div>

                {!inviteUrl ? (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleGenerateInvite}
                        disabled={isGeneratingInvite}
                        className="w-full"
                    >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        {isGeneratingInvite
                            ? "Generating..."
                            : "Generate Link"}
                    </Button>
                ) : (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <Input value={inviteUrl} readOnly />
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCopy}
                            >
                                <CopyIcon className="h-4 w-4" />
                            </Button>
                        </div>

                        {expiresAt && (
                            <p className="text-xs text-muted-foreground">
                                Expires on{" "}
                                {new Date(expiresAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
