import { z } from 'zod';


export const createBoardSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
});

export const updateBoardSchema = z.object({
    title: z.string().min(1).optional(),
});

export const idParamSchema = z.object({
    id: z.string().uuid(),
});
