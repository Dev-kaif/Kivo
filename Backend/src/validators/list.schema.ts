import { z } from "zod";

export const createListSchema = z.object({
    boardId: z.string().uuid("Invalid board ID"),
    title: z.string().min(1, "Title is required"),
});

export const updateListSchema = z.object({
    title: z.string().min(1, "Title is required"),
});

export const listIdParamSchema = z.object({
    listId: z.string().uuid("Invalid task ID"),
});