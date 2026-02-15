import { useQuery } from "@tanstack/react-query";
import type {
    DashboardBoardsInput,
    PaginatedBoardsResponse,
    Activity,
} from "@/lib/types";
import { dashboardClientQueries } from "../ client/queries";

export function useDashboard(input?: DashboardBoardsInput) {
    const boardsQuery = useQuery<PaginatedBoardsResponse>(
        dashboardClientQueries.recentBoards(input)
    );

    const activityQuery = useQuery<Activity[]>(
        dashboardClientQueries.recentActivity()
    );

    return {
        boards: boardsQuery.data?.items ?? [],
        activities: activityQuery.data ?? [],
        isLoading: boardsQuery.isLoading || activityQuery.isLoading,
    };
}