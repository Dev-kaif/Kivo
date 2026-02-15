import { prefetch } from "@/lib/hydration";
import { dashboardQueries } from "./queries";
import { DashboardBoardsInput } from "@/lib/types";

export async function prefetchDashboard(input: DashboardBoardsInput) {
    const boardInput = {
        pageSize: 3,
        search: input.search,
        type: input.type,
    };

    await Promise.all([
        prefetch(dashboardQueries.recentBoards(boardInput)),
        prefetch(dashboardQueries.recentActivity()),
    ]);
}
