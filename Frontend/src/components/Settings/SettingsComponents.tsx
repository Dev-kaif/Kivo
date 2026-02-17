"use client";

import {
    EntityHeader,
    ErrorView,
    LoadingView,
} from "@/components/Generic/entityComponents";
import { EntityContainer } from "@/components/Generic/entityComponents";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettingsMutations } from "./hooks/useSettingsMutations";
import { ConfirmDialog } from "@/components/ui/confirmDailog";
import { Separator } from "@/components/ui/separator";
import { useSuspenseMe } from "./hooks/useSuspenseMe";
import { useLogout } from "@/hooks/useLogout";

export const SettingsHeader = () => {
    return (
        <EntityHeader
            title="Settings"
            discription="Manage your account settings"
        />
    );
};

export const SettingsContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer header={<SettingsHeader />}>
            {children}
        </EntityContainer>
    );
};

export const ResetPasswordCard = () => {
    const { resetPassword, isResetting } = useSettingsMutations();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword) return;

        await resetPassword({ currentPassword, newPassword });

        setCurrentPassword("");
        setNewPassword("");
    };

    return (
        <Card className="shadow-none">
            <CardContent className="p-4 sm:p-6 space-y-4">
                <h2 className="text-base font-semibold">
                    Change Password
                </h2>

                <Input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(e.target.value)
                    }
                />

                <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(e.target.value)
                    }
                />

                <Button
                    onClick={handleSubmit}
                    disabled={
                        isResetting ||
                        !currentPassword ||
                        !newPassword
                    }
                    className="w-full sm:w-auto"
                >
                    {isResetting
                        ? "Updating..."
                        : "Update Password"}
                </Button>
            </CardContent>
        </Card>
    );
};

export const DeleteAccountCard = () => {
    const { deleteAccount, isDeleting } =
        useSettingsMutations();

    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        await deleteAccount({ password });
    };

    return (
        <>
            <Card className="shadow-none border-red-200">
                <CardContent className="p-4 sm:p-6 space-y-4">
                    <h2 className="text-base font-semibold text-red-600">
                        Danger Zone
                    </h2>

                    <p className="text-xs text-muted-foreground">
                        Deleting your account is permanent and cannot
                        be undone.
                    </p>

                    <Input
                        type="password"
                        placeholder="Confirm your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={!password.trim()}
                        onClick={() => setOpen(true)}
                        className="w-full sm:w-auto"
                    >
                        Delete Account
                    </Button>
                </CardContent>
            </Card>

            <ConfirmDialog
                open={open}
                onOpenChange={setOpen}
                title="Delete Account"
                description="Are you absolutely sure? This action cannot be undone."
                confirmText="Delete"
                destructive
                loading={isDeleting}
                onConfirm={handleDelete}
            />
        </>
    );
};

export const ProfileCard = () => {
    const { data: user } = useSuspenseMe();
    const { updateProfile, isUpdating } =
        useSettingsMutations();
    const { logout, isLoggingOut } = useLogout();

    const [name, setName] = useState(user.name);

    const hasChanged = name.trim() !== user.name;

    const handleSave = async () => {
        if (!hasChanged) return;
        await updateProfile({ newName: name });
    };

    return (
        <Card className="shadow-none">
            <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                <div>
                    <h2 className="text-lg font-semibold">
                        Profile
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Update your personal information.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-primary/20 flex items-center justify-center text-2xl sm:text-3xl font-semibold text-primary">
                            {user.name
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Name
                            </label>
                            <Input
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                value={user.email}
                                disabled
                            />
                            <p className="text-xs text-muted-foreground">
                                Email cannot be changed directly.
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-x-5">
                    <Button
                        variant="destructive"
                        onClick={() => logout()}
                        disabled={isLoggingOut}
                        className="w-full sm:w-auto"
                    >
                        {isLoggingOut
                            ? "Signing out..."
                            : "Logout"}
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={!hasChanged || isUpdating}
                        className="w-full sm:w-auto"
                    >
                        {isUpdating
                            ? "Saving..."
                            : "Save Changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export const SettingsLoading = () => {
    return <LoadingView message="Loading settings" />;
};

export const SettingsError = () => {
    return (
        <ErrorView message="Error loading settings" />
    );
};
