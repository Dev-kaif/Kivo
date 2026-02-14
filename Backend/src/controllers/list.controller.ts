import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as ListService from "../services/list.service";
import { z } from "zod";
import { AppError } from "../utils/appError";
import { createListSchema } from "../validators/task.schema";

export const createList = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { boardId, title } = createListSchema.parse(req.body);

        const list = await ListService.createList(
            req.user!.userId,
            boardId,
            title
        );

        return res.status(201).json(list);

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
            error: "Failed to create list",
        });
    }
};
