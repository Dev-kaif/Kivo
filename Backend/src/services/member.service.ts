import crypto from "crypto";
import { AppError } from "../utils/appError";
import db from "../lib/db";
import { logActivity } from "../utils/logActivity";
import { ActivityAction } from "../../generated/prisma/enums";
import { getIO } from "../websocket/socket";


export const generateInviteLink = async (
    userId: string,
    boardId: string
) => {

    const member = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId,
            },
        },
    });

    if (!member || member.role !== "ADMIN") {
        throw new AppError(
            "Only admins can generate invite links",
            403
        );
    }

    const now = new Date();

    const existingInvite = await db.boardInvite.findFirst({
        where: {
            boardId,
            expiresAt: {
                gt: now, // not expired
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (existingInvite) {
        return {
            inviteUrl: `${process.env.FRONTEND_URL}/join/${existingInvite.token}`,
            expiresAt: existingInvite.expiresAt,
        };
    }

    // Create new invite
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const invite = await db.boardInvite.create({
        data: {
            boardId,
            token,
            expiresAt,
            createdBy: userId,
        },
    });

    return {
        inviteUrl: `${process.env.FRONTEND_URL}/join/${invite.token}`,
        expiresAt: invite.expiresAt,
    };
};

export const joinBoardViaInvite = async (
    userId: string,
    token: string
) => {

    const invite = await db.boardInvite.findUnique({
        where: {
            token
        },
    });

    if (!invite) {
        throw new AppError("Invalid invite link", 400);
    }

    if (invite.expiresAt < new Date()) {
        throw new AppError("Invite link expired", 400);
    }

    // Prevent duplicate membership
    const existingMember = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId: invite.boardId,
                userId,
            },
        },
    });

    if (existingMember) {
        throw new AppError("Already a member", 400);
    }

    const membership = await db.boardMember.create({
        data: {
            boardId: invite.boardId,
            userId,
            role: "MEMBER",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                },
            },
        },
    });

    await logActivity({
        action: ActivityAction.MEMBER_ADDED,
        userId,
        boardId: invite.boardId,
        details: {
            method: "invite link",
            name: membership.user.name,
            email: membership.user.email
        },
    });

    getIO().to(invite.boardId).emit("member:added", membership);

    return membership;
};

export const revokeInvite = async (
    userId: string,
    inviteId: string
) => {

    const invite = await db.boardInvite.findUnique({
        where: {
            id: inviteId
        },
    });

    if (!invite) {
        throw new AppError("Invite not found", 404);
    }

    const member = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId: invite.boardId,
                userId,
            },
        },
    });

    if (!member || member.role !== "ADMIN") {
        throw new AppError("Only admins can revoke invite", 403);
    }

    await db.boardInvite.delete({
        where: {
            id: inviteId
        },
    });

    return { success: true };
};

export const addMemberByEmail = async (
    adminId: string,
    boardId: string,
    email: string
) => {

    const member = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId: adminId,
            },
        },
    });

    if (!member || member.role !== "ADMIN") {
        throw new AppError("Only admins can add members", 403);
    }

    const user = await db.user.findUnique({
        where: {
            email
        },
    });

    if (!user) {
        throw new AppError("User with this email does not exist", 404);
    }

    const existingMember = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId: user.id,
            },
        },
    });

    if (existingMember) {
        throw new AppError("User is already a member", 400);
    }

    const membership = await db.boardMember.create({
        data: {
            boardId,
            userId: user.id,
            role: "MEMBER",
        },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    await logActivity({
        action: ActivityAction.MEMBER_ADDED,
        userId: adminId,
        boardId,
        details: {
            method: "manual",
            name: membership.user.name,
            email: email,
        },
    });

    getIO().to(boardId).emit("member:added", membership);

    return membership;
};

export const removeMember = async (
    adminId: string,
    boardId: string,
    memberUserId: string
) => {

    const adminMember = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId: adminId,
            },
        },
    });

    if (!adminMember || adminMember.role !== "ADMIN") {
        throw new AppError("Only admins can remove members", 403);
    }

    if (adminId === memberUserId) {
        throw new AppError("Admin cannot remove themselves", 400);
    }

    const board = await db.board.findUnique({
        where: { id: boardId },
    });

    if (!board) {
        throw new AppError("Board not found", 404);
    }

    if (board.ownerId === memberUserId) {
        throw new AppError("Cannot remove board owner", 400);
    }

    const member = await db.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId: memberUserId,
            },
        },
        include: {
            user: true,
        },
    });

    if (!member) {
        throw new AppError("Member not found", 404);
    }

    await db.boardMember.delete({
        where: {
            boardId_userId: {
                boardId,
                userId: memberUserId,
            },
        },
    });

    await logActivity({
        action: ActivityAction.MEMBER_REMOVED,
        userId: adminId,
        boardId,
        details: {
            name: member.user.name,
            email: member.user.email,
        },
    });

    getIO().to(boardId).emit("member:removed", {
        userId: memberUserId,
    });

    return { success: true };
};
