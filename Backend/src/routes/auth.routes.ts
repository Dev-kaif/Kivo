import { Router } from 'express';
import { deleteAccountController, getUserInfoController, loginController, logoutController, resetPasswordController, signUpController, updateUserController } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimit.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get("/me", authenticate, getUserInfoController);

router.use(authLimiter);

router.post('/signup', signUpController);
router.post('/login', loginController);

router.post("/reset-password", authenticate, resetPasswordController);
router.put("/delete-account", authenticate, deleteAccountController);

router.put("/rename", authenticate, updateUserController);
router.post("/logout", authenticate, logoutController);


export default router;