"use client";

import { ResetPasswordCard, ProfileCard } from "./SettingsComponents";

export const SettingsContent = () => {
    return (
        <div className="space-y-8 w-full max-w-3xl mx-auto px-4 sm:px-8">
            <ProfileCard />
            <ResetPasswordCard />
        </div>
    );
};