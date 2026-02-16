import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { signUpSchema, loginSchema } from '../validators/auth.schema';
import db from '../lib/db';
import { JWT_SECRET } from '../config/env';
import { AppError } from '../utils/appError';

const SALT_ROUNDS = 10;

type SignUpInput = z.infer<typeof signUpSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export const signUp = async (input: SignUpInput) => {
    const existingUser = await db.user.findUnique({
        where: { email: input.email },
    });

    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await db.user.create({
        data: {
            email: input.email,
            name: input.name,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    });

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return { user, token };
};

export const login = async (input: LoginInput) => {
    const user = await db.user.findUnique({
        where: { email: input.email },
    });

    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(input.password, user.password);

    if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    // deconstruct user info
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
};


export const resetPassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string
) => {

    const user = await db.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isMatch) {
        throw new AppError("Current password is incorrect", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    return { message: "Password updated successfully" };
};

export const deleteAccount = async (
    userId: string,
    password: string
) => {

    const user = await db.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError("Password is incorrect", 400);
    }

    await db.user.delete({
        where: { id: userId },
    });

    return { message: "Account deleted successfully" };
};
