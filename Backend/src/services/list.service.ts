import db from "../lib/db.js";
import { getIO } from "../websocket/socket";
import { AppError } from "../utils/appError";

export const createList = async (
    userId: string,
    boardId: string,
    title: string
) => {

    // Verify board exists & user is member
    const board = await db.board.findFirst({
        where: {
            id: boardId,
            members: {
                some: { userId }
            }
        },
        select: {
            id: true
        }
    });

    if (!board) {
        throw new AppError(
            "Board not found or access denied",
            403
        );
    }

    // Find last position
    const lastList = await db.list.findFirst({
        where: { boardId },
        orderBy: { position: "desc" },
    });

    const newPosition = lastList
        ? lastList.position + 65536
        : 65536;

    // Create list
    const list = await db.list.create({
        data: {
            title,
            boardId,
            position: newPosition,
        },
    });

    // Real-time broadcast
    getIO().to(boardId).emit("list:created", list);

    return list;
};

export const deleteList = async (
    userId: string,
    listId: string
) => {

    // Verify list exists & user is board member
    const list = await db.list.findFirst({
        where: {
            id: listId,
            board: {
                members: {
                    some: { userId }
                }
            }
        },
        include: {
            board: {
                select: { id: true }
            }
        }
    });

    if (!list) {
        throw new AppError(
            "List not found or access denied",
            404
        );
    }

    const member = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId: list.board.id,
                userId
            }
        }
    });

    if (!member || member.role !== "ADMIN") {
        throw new AppError("Only admins can delete lists", 403);
    }

    await db.list.delete({
        where: { id: listId }
    });

    getIO()
        .to(list.board.id)
        .emit("list:deleted", { listId });

    return list;
};