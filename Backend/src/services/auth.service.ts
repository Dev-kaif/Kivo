import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { signUpSchema, loginSchema } from '../validators/auth.schema.js';
import db from '../lib/db.js';
import { JWT_SECRET } from '../config/env.js';
import { AppError } from '../utils/appError.js';

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

