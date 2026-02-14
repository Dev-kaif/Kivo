import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import boardRoutes from './routes/board.routes';
import listRoutes from './routes/list.routes';
import taskRoutes from './routes/task.routes';
import { apiLimiter } from './middleware/rateLimit.middleware';

const app = express();

app.use(helmet());
app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

export default app;