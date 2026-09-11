import express from 'express';
import { chatWithAssistant } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/', chatWithAssistant);

export default router;
