import { ActivityAction } from "../../generated/prisma/enums";
import db from "../lib/db";
import { AppError } from "../utils/appError";

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
    cursor?: string,
    pageSize = 10
) => {

    // Verify access
    const member = await db.boardMember.findUnique({
        where: {
            boardId_userId: { boardId, userId }
        }
    });

    if (!member) {
        throw new AppError("Access denied", 403);
    }

    const items = await db.activityLog.findMany({
        where: { boardId },
        include: {
            user: {
                select: { id: true, name: true }
            },
            task: {
                select: { id: true, title: true }
            }
        },
        orderBy: [
            { createdAt: "desc" },
            { id: "desc" }
        ],
        take: pageSize,
        ...(cursor && {
            skip: 1,
            cursor: { id: cursor }
        }),
    });

    const nextCursor =
        items.length === pageSize
            ? items[items.length - 1].id
            : null;

    return {
        items,
        nextCursor,
    };
};
