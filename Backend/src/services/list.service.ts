import db from "../lib/db.js";
import { getIO } from "../websocket/socket";
import { AppError } from "../utils/appError";
import { logActivity } from "../utils/logActivity";
import { ActivityAction } from "../../generated/prisma/enums.js";

export const createList = async (
    userId: string,
    boardId: string,
    title: string
) => {
    const board = await db.board.findFirst({
        where: {
            id: boardId,
            members: {
                some: { userId },
            },
        },
        select: { id: true },
    });

    if (!board) {
        throw new AppError("Board not found or access denied", 403);
    }

    const lastList = await db.list.findFirst({
        where: { boardId },
        orderBy: { position: "desc" },
    });

    const newPosition = lastList
        ? lastList.position + 65536
        : 65536;

    const list = await db.list.create({
        data: {
            title,
            boardId,
            position: newPosition,
        },
    });

    await logActivity({
        action: ActivityAction.LIST_CREATED,
        userId,
        boardId,
        details: { title },
    });

    getIO().to(boardId).emit("list:created", list);

    return list;
};



export const deleteList = async (
    userId: string,
    listId: string
) => {
    const list = await db.list.findFirst({
        where: {
            id: listId,
            board: {
                members: {
                    some: { userId },
                },
            },
        },
        include: {
            board: { select: { id: true } },
        },
    });

    if (!list) {
        throw new AppError("List not found or access denied", 404);
    }

    const member = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId: list.board.id,
                userId,
            },
        },
    });

    if (!member || member.role !== "ADMIN") {
        throw new AppError("Only admins can delete lists", 403);
    }

    await logActivity({
        action: ActivityAction.LIST_DELETED,
        userId,
        boardId: list.board.id,
        details: {
            title: list.title,
        },
    });

    await db.list.delete({
        where: { id: listId },
    });

    getIO()
        .to(list.board.id)
        .emit("list:deleted", { listId });

    return list;
};

export const renameList = async (
    userId: string,
    listId: string,
    newTitle: string
) => {

    const list = await db.list.findFirst({
        where: {
            id: listId,
            board: {
                members: {
                    some: { userId },
                },
            },
        },
        include: {
            board: { select: { id: true } },
        },
    });

    if (!list) {
        throw new AppError("List not found or access denied", 404);
    }

    const updated = await db.list.update({
        where: { id: listId },
        data: { title: newTitle },
    });

    await logActivity({
        action: ActivityAction.LIST_UPDATED,
        userId,
        boardId: list.board.id,
        details: {
            from: list.title,
            to: newTitle,
        },
    });

    getIO()
        .to(list.board.id)
        .emit("list:updated", updated);

    return updated;
};
