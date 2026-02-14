import { z } from 'zod';
import { createBoardSchema, updateBoardSchema } from '../validators/board.schema.js';
import db from '../lib/db.js';

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

    await db.activityLog.create({
        data: {
            action: "BOARD_CREATED",
            userId: userId,
            boardId: board.id,
            details: {
                title: board.title,
            },
        },
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

    if (!board) return null;

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
        throw new Error('Access denied');
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

    if (!member || member.role === 'VIEWER') {
        throw new Error('Permission denied');
    }

    return await db.board.update({
        where: { id: boardId },
        data: input,
    });
};

export const deleteBoard = async (userId: string, boardId: string) => {

    // Only the owner can delete
    const board = await db.board.findUnique({
        where: {
            id: boardId
        },
    });

    if (!board || board.ownerId !== userId) {
        throw new Error('Only the owner can delete this board');
    }

    return await db.board.delete({
        where: {
            id: boardId
        },
    });
};
