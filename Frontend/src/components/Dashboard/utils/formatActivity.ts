import { Activity } from "@/lib/types";

export function formatActivityMessage(activity: Activity) {
    const boardTitle = activity.board?.title ?? "a board";
    const details = activity.details as any;

    switch (activity.action) {

        case "BOARD_CREATED":
            return `created board "${boardTitle}"`;

        case "BOARD_UPDATED":
            return `updated board "${boardTitle}"`;

        case "BOARD_DELETED":
            return `deleted board "${boardTitle}"`;


        case "TASK_CREATED":
            return `created task "${details?.title ?? "Untitled"}" in "${boardTitle}"`;

        case "TASK_UPDATED":
            return `updated task "${details?.title ?? "a task"}" in "${boardTitle}"`;

        case "TASK_MOVED":
            return `moved task "${details?.title ?? "a task"}" in "${boardTitle}"`;

        case "TASK_DELETED":
            return `deleted task "${details?.title ?? "a task"}" from "${boardTitle}"`;


        case "LIST_CREATED":
            return `created list "${details?.title ?? "Untitled"}" in "${boardTitle}"`;

        case "LIST_UPDATED":
            return `updated list "${details?.title ?? "a list"}" in "${boardTitle}"`;

        case "LIST_DELETED":
            return `deleted list "${details?.title ?? "a list"}" from "${boardTitle}"`;


        case "MEMBER_ADDED":
            return `added ${details?.memberName ?? "a member"} to "${boardTitle}"`;

        case "MEMBER_REMOVED":
            return `removed ${details?.memberName ?? "a member"} from "${boardTitle}"`;

    }
}
