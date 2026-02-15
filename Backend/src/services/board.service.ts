import { z } from 'zod';
import { createBoardSchema, updateBoardSchema } from '../validators/board.schema';
import db from '../lib/db';
import { AppError } from "../utils/appError";
import { logActivity } from "../utils/logActivity";
import { ActivityAction } from "../../generated/prisma/enums";


type CreateBoardInput = z.infer<typeof createBoardSchema>;
type UpdateBoardInput = z.infer<typeof updateBoardSchema>;

export const createBoard = async (
    userId: string,
    input: CreateBoardInput
) => {
    // Create Board
    const board = await db.board.create({
        data: {
            title: input.title,
            ownerId: userId,
            members: {
                create: {
                    userId: userId,
                    role: "ADMIN",
                },
            },
        },
    });

    await logActivity({
        action: ActivityAction.BOARD_CREATED,
        userId,
        boardId: board.id,
        details: { title: board.title },
    });

    return board;
};

export const getUserBoards = async (userId: string) => {
    return await db.board.findMany({
        where: {
            OR: [
                { ownerId: userId },
                {
                    members: {
                        some: {
                            userId: userId
                        }
                    }
                },
            ],
        },
        include: {
            owner: {
                select: {
                    name: true,
                    email: true
                }
            },
            _count: {
                select: {
                    members: true
                }
            },
        },
        orderBy: {
            updatedAt: 'desc'
        },
    });
};

export const getBoardById = async (userId: string, boardId: string) => {

    const board = await db.board.findUnique({
        where: {
            id: boardId
        },
        include: {
            lists: {
                orderBy: {
                    position: 'asc'
                },
                include: {
                    tasks: {
                        orderBy: {
                            position: 'asc'
                        },
                        include: {
                            assignees: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            },
                            _count: {
                                select: {
                                    activities: true
                                }
                            },
                        },
                    },
                },
            },
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                },
            },
        },
    });

    if (!board) {
        throw new AppError("Board not found", 404);
    }

    // Check access
    const member = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId
            },
        },
    });

    if (!member) {
        throw new AppError("Access denied", 403);
    }

    return board;
};

export const updateBoard = async (userId: string, boardId: string, input: UpdateBoardInput) => {

    // Ensure user is an admin or owner
    const member = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId
            }
        },
    });


    if (!member) {
        throw new AppError("Access denied", 403);
    }

    if (member.role === "VIEWER") {
        throw new AppError("Permission denied", 403);
    }

    const existingBoard = await db.board.findUnique({
        where: { id: boardId },
    });

    if (!existingBoard) {
        throw new AppError("Board not found", 404);
    }

    const updated = await db.board.update({
        where: { id: boardId },
        data: input,
    });

    await logActivity({
        action: ActivityAction.BOARD_UPDATED,
        userId,
        boardId,
        details: {
            oldTitle: existingBoard.title,
            newTitle: input.title,
        },
    });

    return updated;
};

export const deleteBoard = async (userId: string, boardId: string) => {

    // Only the owner can delete
    const board = await db.board.findUnique({
        where: {
            id: boardId
        },
    });

    if (!board) {
        throw new AppError("Board not found", 404);
    }

    if (board.ownerId !== userId) {
        throw new AppError(
            "Only the owner can delete this board",
            403
        );
    }

    const deleted = await db.board.delete({
        where: {
            id: boardId
        },
    });

    await logActivity({
        action: ActivityAction.BOARD_DELETED,
        userId,
        boardId,
        details: { title: board.title },
    });

    return deleted
};
