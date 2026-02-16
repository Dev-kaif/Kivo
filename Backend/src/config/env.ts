import "dotenv/config";

export const DATABASE_URL = process.env["DATABASE_URL"];
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const FRONTEND_URL = process.env.FRONTEND_URL as string;
