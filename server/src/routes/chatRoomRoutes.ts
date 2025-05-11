import { Router } from 'express';
import { chatRoomController } from '../controllers/chatRoomController';

const router = Router();

// Chat room routes
router.get('/', chatRoomController.getAllChatRooms);
router.get('/:id', chatRoomController.getChatRoom);
router.post('/', chatRoomController.createChatRoom);
router.delete('/:id', chatRoomController.deleteChatRoom);

export default router; 