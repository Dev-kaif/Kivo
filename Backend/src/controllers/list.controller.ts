import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as ListService from "../services/list.service";
import { z } from "zod";
import { AppError } from "../utils/appError";
import { createListSchema, listIdParamSchema, updateListSchema } from "../validators/list.schema";

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

export const deleteList = async (
    req: AuthRequest<{ listId: string }>,
    res: Response
) => {
    try {
        const { listId } = listIdParamSchema.parse(req.params);

        await ListService.deleteList(
            req.user!.userId,
            listId
        );

        return res.status(200).json({
            message: "List deleted successfully",
            listId,
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
            error: "Failed to delete list",
        });
    }
};

export const updateList = async (
    req: AuthRequest<{ listId: string }>,
    res: Response
) => {
    try {
        const { listId } = listIdParamSchema.parse(req.params);
        const { title: newTitle } = updateListSchema.parse(req.body);

        await ListService.renameList(
            req.user!.userId,
            listId,
            newTitle
        );

        return res.status(200).json({
            message: "List deleted successfully",
            listId,
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
            error: "Failed to delete list",
        });
    }
};
