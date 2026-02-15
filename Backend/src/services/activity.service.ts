import { ActivityAction } from "../../generated/prisma/enums";
import db from "../lib/db";
import { AppError } from "../utils/appError";

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

export const getRecentActivity = async (
    userId: string,
    limit = 3
) => {
    return await db.activityLog.findMany({
        where: {
            board: {
                OR: [
                    { ownerId: userId },
                    {
                        members: {
                            some: { userId }
                        }
                    }
                ]
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            board: {
                select: {
                    id: true,
                    title: true,
                }
            },
            task: {
                select: {
                    id: true,
                    title: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
        take: limit,
    });
};

export const getBoardActivity = async (
    userId: string,
    boardId: string,
    page = 1,
    pageSize = 10
) => {

    // Verify access
    const member = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId,
            }
        }
    });

    if (!member) {
        throw new AppError("Access denied", 403);
    }

    const skip = (page - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
        db.activityLog.findMany({
            where: { boardId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                task: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
        }),
        db.activityLog.count({
            where: { boardId }
        })
    ]);

    return {
        items,
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
    };
};
