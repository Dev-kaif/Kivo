import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as BoardController from '../controllers/board.controller';

const router = Router();

router.use(authenticate);

router.post('/', BoardController.createBoard);
router.get('/', BoardController.getBoards);
router.get('/:id', BoardController.getBoard);
router.put('/:id', BoardController.updateBoard);
router.delete('/:id', BoardController.deleteBoard);

export default router;

