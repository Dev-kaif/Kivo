import { Router } from 'express';
import { deleteAccountController, loginController, resetPasswordController, signUpController } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimit.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authLimiter);

router.post('/signup', signUpController);
router.post('/login', loginController);

router.post("/reset-password", authenticate, resetPasswordController);
router.delete("/delete-account", authenticate, deleteAccountController);


export default router;