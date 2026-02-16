import { Activity } from "@/lib/types";

export function formatActivityMessage(activity: Activity) {
    const boardTitle = activity.board?.title ?? "a board";
    const details = activity.details as any;

    switch (activity.action) {

        case "BOARD_CREATED":
            return `created board "${details?.title ?? boardTitle}"`;

        case "BOARD_UPDATED":
            return `renamed board from "${details?.from}" to "${details?.to}"`;

        case "BOARD_DELETED":
            return `deleted board "${details?.title ?? boardTitle}"`;


        case "LIST_CREATED":
            return `created list "${details?.title}" in "${boardTitle}"`;

        case "LIST_UPDATED":
            return `renamed list from "${details?.from}" to "${details?.to}"`;

        case "LIST_DELETED":
            return `deleted list "${details?.title}" from "${boardTitle}"`;


        case "TASK_CREATED":
            if (details?.assignees?.length) {
                return `created task "${details.title}" assigned to ${details.assignees.join(", ")}`;
            }
            return `created task "${details?.title ?? "Untitled"}"`;

        case "TASK_UPDATED":
            if (details?.changes?.length) {
                return `updated ${details.changes.join(", ")} on task "${details.title}"`;
            }
            return `updated task "${details?.title ?? "a task"}"`;

        case "TASK_MOVED":
            return `moved task "${details?.title}" from "${details?.fromList}" to "${details?.toList}"`;

        case "TASK_DELETED":
            return `deleted task "${details?.title}"`;


        case "MEMBER_ADDED":
            if (details?.method === "invite") {
                return `joined via invite (${details?.name})`;
            }
            return `added ${details?.name ?? details?.email ?? "a member"} to "${boardTitle}"`;

        case "MEMBER_REMOVED":
            return `removed ${details?.name ?? details?.email ?? "a member"} from "${boardTitle}"`;


        default: {
            const action = String(activity.action);
            return action.replaceAll("_", " ").toLowerCase();
        }

    }
}
