import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes';
import boardRoutes from './routes/board.routes';
import memberRoutes from './routes/member.routes';
import listRoutes from './routes/list.routes';
import taskRoutes from './routes/task.routes';
import activtyRoutes from './routes/activity.routes';

import { apiLimiter } from './middleware/rateLimit.middleware';
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from './config/env';


const app = express();

app.use(helmet());

app.use(cors({
    origin: `${FRONTEND_URL}`,
    credentials: true,
}));

app.use(express.json());

app.use(cookieParser());

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activity', activtyRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

export default app;