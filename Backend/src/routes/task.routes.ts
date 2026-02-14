import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as TaskController from '../controllers/task.controller';

const router = Router();

router.use(authenticate);

// Create a new task
router.post('/', TaskController.createTask);

// Move a task
router.put('/:taskId/move', TaskController.moveTask);

// Delete a task
router.delete('/:taskId', TaskController.deleteTask);

export default router;