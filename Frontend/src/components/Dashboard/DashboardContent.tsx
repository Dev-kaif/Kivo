"use client";

import { CreateBoardCard } from "./CreateCard";
import { RecentActivityCard, RecentBoardsList } from "./DashboardComponents";
import { useDashboard } from "./hooks/useDashboard";

export function DashboardContent() {
    const { boards, activities, isLoading } = useDashboard({
        type: "all",
    });

    return (
        <div className="space-y-5">

            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <CreateBoardCard />
                <RecentActivityCard
                    activities={activities}
                    isLoading={isLoading}
                />
            </div>

            <RecentBoardsList
                boards={boards}
                isLoading={isLoading}
            />

        </div>
    );
}
