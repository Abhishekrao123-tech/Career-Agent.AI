import StudentProfile from '../models/StudentProfile.js';
import Roadmap from '../models/Roadmap.js';
import { generateTodayStudySession } from '../agents/managerAgent.js';

export const getTodayStudyPlan = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });
    const roadmap = await Roadmap.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(400).json({ message: 'Profile not found. Please setup profile first.' });
    }

    const todaySession = await generateTodayStudySession(profile, roadmap);
    res.json(todaySession);
  } catch (err) {
    next(err);
  }
};
