import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as MemberService from "../services/member.service";
import { z } from "zod";
import { AppError } from "../utils/appError";
import {
    addMemberSchema,
    boardIdParamSchema,
    inviteTokenParamSchema,
    removeMemberParamSchema,
} from "../validators/member.schema";

export const addMember = async (
    req: AuthRequest<{ boardId: string }>,
    res: Response
) => {
    try {
        const { boardId } = boardIdParamSchema.parse(req.params);
        const { email } = addMemberSchema.parse(req.body);

        const member = await MemberService.addMemberByEmail(
            req.user!.userId,
            boardId,
            email
        );

        return res.status(201).json(member);

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: error.message,
            });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        console.error(error);
        return res.status(500).json({
            error: "Failed to add member",
        });
    }
};

export const removeMember = async (
    req: AuthRequest<{ boardId: string; userId: string }>,
    res: Response
) => {
    try {
        const { boardId } = boardIdParamSchema.parse(req.params);
        const { userId } = removeMemberParamSchema.parse(req.params);

        await MemberService.removeMember(
            req.user!.userId,
            boardId,
            userId
        );

        return res.status(200).json({
            message: "Member removed successfully",
            userId,
        });

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: error.message,
            });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        console.error(error);
        return res.status(500).json({
            error: "Failed to remove member",
        });
    }
};

export const generateInviteLink = async (
    req: AuthRequest<{ boardId: string }>,
    res: Response
) => {
    try {
        const { boardId } = boardIdParamSchema.parse(req.params);

        const invite = await MemberService.generateInviteLink(
            req.user!.userId,
            boardId
        );

        return res.status(201).json(invite);

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: error.message,
            });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        console.error(error);
        return res.status(500).json({
            error: "Failed to generate invite link",
        });
    }
};

export const joinViaInvite = async (
    req: AuthRequest<{ token: string }>,
    res: Response
) => {
    try {
        const { token } = inviteTokenParamSchema.parse(req.params);

        const membership = await MemberService.joinBoardViaInvite(
            req.user!.userId,
            token
        );

        return res.status(200).json(membership);

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: error.message,
            });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        console.error(error);
        return res.status(500).json({
            error: "Failed to join board",
        });
    }
};

