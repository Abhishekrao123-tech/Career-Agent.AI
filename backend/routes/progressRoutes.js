import express from 'express';
import { getProgress, updateProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getProgress);
router.post('/update', updateProgress);

export default router;
