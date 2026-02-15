import { z } from "zod";


export const addMemberSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const boardIdParamSchema = z.object({
    boardId: z.string().uuid("Invalid board ID"),
});

export const removeMemberParamSchema = z.object({
    userId: z.string().uuid("Invalid user ID"),
});

export const inviteTokenParamSchema = z.object({
    token: z.string().min(10, "Invalid invite token"),
});
