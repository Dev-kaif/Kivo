import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as TaskService from "../services/task.service";
import {
    createTaskBodySchema,
    moveTaskBodySchema,
    taskIdParamSchema,
} from "../validators/task.schema";
import { z } from "zod";
import { AppError } from "../utils/appError";


// create task
export const createTask = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { listId, title } = createTaskBodySchema.parse(req.body);

        const task = await TaskService.createTask(
            req.user!.userId,
            listId,
            title
        );

        return res.status(201).json(task);

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        console.error(error);
        return res.status(500).json({
            error: "Failed to create task",
        });
    }
};


// move task
export const moveTask = async (
    req: AuthRequest<{ taskId: string }>,
    res: Response
) => {
    try {
        const { taskId } =
            taskIdParamSchema.parse(req.params);

        const { newListId, newPosition } =
            moveTaskBodySchema.parse(req.body);

        const task = await TaskService.moveTask(
            req.user!.userId,
            taskId,
            newListId,
            newPosition
        );

        return res.json(task);

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        console.error(error);
        return res.status(500).json({
            error: "Failed to move task",
        });
    }
};


// delete task
export const deleteTask = async (
    req: AuthRequest<{ taskId: string }>,
    res: Response
) => {
    try {
        const { taskId } =
            taskIdParamSchema.parse(req.params);

        const task = await TaskService.deleteTask(
            req.user!.userId,
            taskId
        );

        return res.status(200).json({
            message: "Task deleted successfully",
            taskId: task.id,
        });

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        console.error(error);
        return res.status(500).json({
            error: "Failed to delete task",
        });
    }
};
