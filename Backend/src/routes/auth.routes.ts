import { Router } from 'express';
import { loginController, signUpController } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/signup', authLimiter, signUpController);
router.post('/login', authLimiter, loginController);

export default router;