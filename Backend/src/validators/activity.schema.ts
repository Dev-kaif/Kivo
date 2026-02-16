import { z } from 'zod';

export const boardIdParamSchema = z.object({
    boardId: z.string().uuid("Invalid board ID"),
});

export const activityQuerySchema = z.object({
    cursor: z.string().uuid().optional(),
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
});