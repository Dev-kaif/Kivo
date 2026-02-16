"use client";

import { ResetPasswordCard, ProfileCard } from "./SettingsComponents";

export const SettingsContent = () => {
    return (
        <div className="space-y-8 w-full mx-auto px-8">
            <ProfileCard />
            <ResetPasswordCard />
        </div>
    );
};
