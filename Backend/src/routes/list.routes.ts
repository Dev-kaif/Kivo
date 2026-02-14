import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as ListController from '../controllers/list.controller';

const router = Router();

router.use(authenticate);

router.post('/', ListController.createList);
router.delete('/:listId', ListController.deleteList);

export default router;