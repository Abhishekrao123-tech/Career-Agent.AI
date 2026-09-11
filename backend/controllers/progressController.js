import Progress from '../models/Progress.js';
import Roadmap from '../models/Roadmap.js';

export const getProgress = async (req, res, next) => {
  try {
    const progressList = await Progress.find({ userId: req.user.id });
    const roadmap = await Roadmap.findOne({ userId: req.user.id });

    // Calculate metrics
    let totalItems = progressList.length;
    let completedCount = progressList.filter((p) => p.status === 'Completed').length;
    let inProgressCount = progressList.filter((p) => p.status === 'In Progress').length;
    let notStartedCount = progressList.filter((p) => p.status === 'Not Started').length;

    // Calculate roadmap phase topic completions
    let totalTopics = 0;
    let completedTopics = 0;
    if (roadmap && roadmap.phases) {
      roadmap.phases.forEach((p) => {
        p.topics.forEach((t) => {
          totalTopics++;
          if (t.status === 'Completed') completedTopics++;
        });
      });
    }

    const overallPercentage = totalTopics > 0
      ? Math.round((completedTopics / totalTopics) * 100)
      : totalItems > 0
        ? Math.round((completedCount / totalItems) * 100)
        : 0;

    res.json({
      overallPercentage,
      totalItems: totalTopics || totalItems,
      completedCount: completedTopics || completedCount,
      inProgressCount,
      notStartedCount,
      skills: progressList
    });
  } catch (err) {
    next(err);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { skillName, status, progressPercentage } = req.body;

    if (!skillName || !status) {
      return res.status(400).json({ message: 'skillName and status are required.' });
    }

    let progress = await Progress.findOne({ userId: req.user.id, skillName });

    if (!progress) {
      progress = new Progress({ userId: req.user.id, skillName });
    }

    progress.status = status;
    progress.progressPercentage =
      progressPercentage !== undefined
        ? progressPercentage
        : status === 'Completed'
          ? 100
          : status === 'In Progress'
            ? 50
            : 0;

    if (status === 'Completed') {
      progress.completedAt = new Date();
    }

    await progress.save();

    res.json(progress);
  } catch (err) {
    next(err);
  }
};
