import { z } from "zod";

export const createTaskBodySchema = z.object({
    listId: z.string().uuid("Invalid list ID"),
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be under 200 characters"),
});

export const taskIdParamSchema = z.object({
    taskId: z.string().uuid("Invalid task ID"),
});

export const moveTaskBodySchema = z.object({
    newListId: z.string().uuid("Invalid list ID"),
    newPosition: z
        .number()
        .finite("New position must be a valid number"),
});

export const createListSchema = z.object({
    boardId: z.string().uuid("Invalid board ID"),
    title: z.string().min(1, "Title is required"),
});
