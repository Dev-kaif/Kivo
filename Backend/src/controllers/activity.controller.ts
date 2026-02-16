import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as ActivityService from "../services/activity.service";
import { boardIdParamSchema } from "../validators/member.schema";
import { activityQuerySchema } from "../validators/activity.schema";
import { AppError } from "../utils/appError";
import z from "zod";

export const getRecentActivity = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const activities = await ActivityService.getRecentActivity(
            req.user!.userId
        );

        return res.json(activities);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to fetch activity",
        });
    }
};

export const getBoardActivity = async (
    req: AuthRequest<{ boardId: string }>,
    res: Response
) => {
    try {
        const { boardId } = boardIdParamSchema.parse(req.params);
        const { cursor, pageSize } = activityQuerySchema.parse(req.query);

        const result = await ActivityService.getBoardActivity(
            req.user!.userId,
            boardId,
            cursor,
            pageSize
        );

        return res.status(200).json(result);

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
            error: "Failed to fetch board activity",
        });
    }
};
