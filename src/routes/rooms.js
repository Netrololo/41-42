import { Router } from 'express';
import * as messageController from '../controllers/messageController.js';
import authenticate from '../middleware/authenticate.js';
import { validate } from '../validators/auth.js';
import { createMessageSchema } from '../validators/message.js';

const router = Router();

router.get('/', roomController.getRooms);
router.get('/my', authenticate, roomController.getMyRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', authenticate, validate(createRoomSchema), roomController.createRoom);
router.delete('/:id', authenticate, roomController.deleteRoom);
// Экспорт роутера
export default router;