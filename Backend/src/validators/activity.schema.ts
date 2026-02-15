import { z } from 'zod';

export const boardIdParamSchema = z.object({
    boardId: z.string().uuid("Invalid board ID"),
});

export const activityQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
});