import { Request, Response } from 'express';
import { z } from 'zod';
import { signUpSchema, loginSchema, resetPasswordSchema, deleteAccountSchema, updateUserSchema } from '../validators/auth.schema';
import { AppError } from '../utils/appError';
import * as AuthService from "../services/auth.service";
import { AuthRequest } from '../middleware/auth.middleware';

export const signUpController = async (req: Request, res: Response) => {
    try {
        const validatedData = signUpSchema.parse(req.body);

        const { user, token } = await AuthService.signUp(validatedData);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ user });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const { user, token } = await AuthService.login(validatedData);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ user });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const resetPasswordController = async (
    req: AuthRequest<{ id: string }>,
    res: Response
) => {
    try {
        const userId = req.user!.userId;

        const validatedData = resetPasswordSchema.parse(req.body);

        const result = await AuthService.resetPassword(
            userId,
            validatedData.currentPassword,
            validatedData.newPassword
        );

        return res.status(200).json(result);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteAccountController = async (
    req: AuthRequest<{ id: string }>,
    res: Response
) => {
    try {
        const userId = req.user!.userId;

        const validatedData = deleteAccountSchema.parse(req.body);

        const result = await AuthService.deleteAccount(
            userId,
            validatedData.password
        );

        // Clear cookie after deletion
        res.clearCookie("token");

        return res.status(200).json(result);
    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserInfoController = async (
    req: AuthRequest<{ id: string }>,
    res: Response
) => {
    try {
        const userId = req.user!.userId;

        const result = await AuthService.userInfo(
            userId,
        );

        return res.status(200).json(result);

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUserController = async (
    req: AuthRequest<{ id: string }>,
    res: Response
) => {
    try {
        const userId = req.user!.userId;
        const { newName } = updateUserSchema.parse(req.body);

        const result = await AuthService.renameUser(
            userId,
            newName
        );

        return res.status(200).json(result);

    } catch (error: any) {

        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.message });
        }

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logoutController = async (
    req: Request,
    res: Response
) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            message: "Logged out successfully",
        });
    } catch {
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};
