import express from 'express';
import { getTodayStudyPlan } from '../controllers/agentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/today', getTodayStudyPlan);

export default router;
