import { ActivityAction } from "../../generated/prisma/enums";
import db from "../lib/db";

export const logActivity = async ({
    action,
    userId,
    boardId,
    taskId,
    details,
}: {
    action: ActivityAction;
    userId: string;
    boardId: string;
    taskId?: string;
    details?: any;
}) => {
    await db.activityLog.create({
        data: {
            action,
            userId,
            boardId,
            taskId,
            details,
        },
    });
};
