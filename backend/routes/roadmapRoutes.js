import express from 'express';
import { generateRoadmap, getRoadmap, updateRoadmapTopic } from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/generate', generateRoadmap);
router.get('/', getRoadmap);
router.post('/update', updateRoadmapTopic);

export default router;
