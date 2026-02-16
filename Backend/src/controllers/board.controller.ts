import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as BoardService from "../services/board.service";
import {
    createBoardSchema,
    updateBoardSchema,
    idParamSchema,
} from "../validators/board.schema";
import { AppError } from "../utils/appError";
import { z } from "zod";
import { getBoardsQuerySchema } from "../validators/pagination.schema";

// Create Board
export const createBoard = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const body = createBoardSchema.parse(req.body);

        const board = await BoardService.createBoard(
            req.user!.userId,
            body
        );

        return res.status(201).json(board);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        console.log(error)

        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get single Board
export const getBoard = async (
    req: AuthRequest<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = idParamSchema.parse(req.params);

        const board = await BoardService.getBoardById(
            req.user!.userId,
            id
        );

        return res.json(board);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

// Get paginated Boards
export const getBoards = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const query = getBoardsQuerySchema.parse(req.query);

        const result = await BoardService.getPaginatedBoards(
            req.user!.userId,
            query
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
            error: 'Failed to fetch boards',
        });
    }
};


// update Board
export const updateBoard = async (
    req: AuthRequest<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = idParamSchema.parse(req.params);

        const body = updateBoardSchema.parse(req.body);

        const updated = await BoardService.updateBoard(
            req.user!.userId,
            id,
            body
        );

        return res.json(updated);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        return res.status(500).json({
            error: "Failed to update board",
        });
    }
};


// Delete Board
export const deleteBoard = async (
    req: AuthRequest<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = idParamSchema.parse(req.params);

        await BoardService.deleteBoard(
            req.user!.userId,
            id
        );

        return res.status(204).send();

    } catch (error: any) {
        if (error.message === "Access denied") {
            return res.status(403).json({ error: "Access denied" });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        return res.status(500).json({
            error: "Failed to delete board",
        });
    }
};


export const getBoardName = async (
    req: AuthRequest<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = idParamSchema.parse(req.params);

        const board = await BoardService.getBoardNameById(
            req.user!.userId,
            id
        );

        return res.json(board);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export const getBoardMembers = async (
    req: AuthRequest<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = idParamSchema.parse(req.params);

        const members = await BoardService.getBoardMembers(
            req.user!.userId,
            id
        );

        return res.json(members);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
