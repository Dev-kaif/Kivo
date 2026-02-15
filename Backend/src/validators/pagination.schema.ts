import { z } from "zod";


export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 5,
    MAX_PAGE_SIZE: 100,
    MIN_PAGE_SIZE: 1
}

export const getBoardsQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(PAGINATION.DEFAULT_PAGE),

    pageSize: z.coerce
        .number()
        .int()
        .min(PAGINATION.MIN_PAGE_SIZE)
        .max(PAGINATION.MAX_PAGE_SIZE)
        .default(PAGINATION.DEFAULT_PAGE_SIZE),

    search: z.string().trim().optional().default(""),

    type: z
        .enum(["owner", "member", "all"])
        .default("all"),
});

export type GetBoardsInput = z.infer<typeof getBoardsQuerySchema>