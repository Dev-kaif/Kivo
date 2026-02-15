import { Router } from 'express';
import * as ActivityController from '../controllers/activity.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get("/recent", ActivityController.getRecentActivity);
router.get("/boards/:boardId", ActivityController.getBoardActivity);


export default router;