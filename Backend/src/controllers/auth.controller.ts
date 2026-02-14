import { Request, Response } from 'express';
import { z } from 'zod';
import { signUp, login } from '../services/auth.service.js';
import { signUpSchema, loginSchema } from '../validators/auth.schema.js';
import { AppError } from '../utils/appError.js';

export const signUpController = async (req: Request, res: Response) => {
    try {
        const validatedData = signUpSchema.parse(req.body);

        const result = await signUp(validatedData);

        res.status(201).json(result);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof AppError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};


export const loginController = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const result = await login(validatedData);

        res.status(200).json(result);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof AppError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};