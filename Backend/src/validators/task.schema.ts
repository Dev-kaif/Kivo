import { z } from "zod";

export const createTaskBodySchema = z.object({
    listId: z.string().uuid("Invalid list ID"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    dueDate: z.coerce.date().optional(),
    assigneeIds: z.array(z.string().uuid()).optional(),
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

export const updateTaskBodySchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    dueDate: z.coerce.date().optional(),
    assigneeIds: z.array(z.string().uuid()).optional(),
});
