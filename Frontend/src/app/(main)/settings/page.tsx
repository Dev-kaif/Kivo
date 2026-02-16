import { HydrateClient } from "@/lib/hydration";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import { prefetchSettings } from "@/components/Settings/server/prefetch";
import { SettingsContainer, SettingsError, SettingsLoading } from "@/components/Settings/SettingsComponents";
import { SettingsContent } from "@/components/Settings/SettingsPage";
import { requireAuth } from "@/lib/requireAuth";


export default async function page() {
    await requireAuth();

    await prefetchSettings();

    return (
        <SettingsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<SettingsError />}>
                    <Suspense fallback={<SettingsLoading />}>
                        <SettingsContent />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </SettingsContainer>
    );
}

