import Roadmap from '../models/Roadmap.js';
import StudentProfile from '../models/StudentProfile.js';
import ProjectRecommendation from '../models/ProjectRecommendation.js';
import Progress from '../models/Progress.js';
import { generateStudentCareerPlan, adaptRoadmapPlan } from '../agents/managerAgent.js';

export const generateRoadmap = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ message: 'Student profile not found. Please complete profile assessment first.' });
    }

    // Invoke Manager Agent pipeline
    const generatedData = await generateStudentCareerPlan(profile);

    // Save or update Roadmap in MongoDB
    let roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) {
      roadmap = new Roadmap({ userId: req.user.id });
    }

    roadmap.targetCareer = generatedData.targetCareer;
    roadmap.summary = generatedData.summary;
    roadmap.skillGaps = generatedData.skillGaps;
    roadmap.phases = generatedData.phases;
    roadmap.updatedAt = new Date();

    await roadmap.save();

    // Replace old project recommendations with new ones
    await ProjectRecommendation.deleteMany({ userId: req.user.id });
    if (generatedData.projectRecommendations && generatedData.projectRecommendations.length > 0) {
      const projectsToInsert = generatedData.projectRecommendations.map((p) => ({
        userId: req.user.id,
        title: p.title,
        difficulty: p.difficulty || 'Intermediate',
        technologies: p.technologies || [],
        requiredSkills: p.requiredSkills || [],
        features: p.features || [],
        whyUseful: p.whyUseful || '',
        status: 'Recommended'
      }));
      await ProjectRecommendation.insertMany(projectsToInsert);
    }

    // Seed progress entries for skills
    if (generatedData.skillGaps) {
      for (const skill of generatedData.skillGaps.known || []) {
        await Progress.findOneAndUpdate(
          { userId: req.user.id, skillName: skill },
          { status: 'Completed', progressPercentage: 100, completedAt: new Date() },
          { upsert: true }
        );
      }
      for (const skill of generatedData.skillGaps.partiallyKnown || []) {
        await Progress.findOneAndUpdate(
          { userId: req.user.id, skillName: skill },
          { status: 'In Progress', progressPercentage: 50 },
          { upsert: true }
        );
      }
      for (const skill of generatedData.skillGaps.missing || []) {
        await Progress.findOneAndUpdate(
          { userId: req.user.id, skillName: skill },
          { status: 'Not Started', progressPercentage: 0 },
          { upsert: true }
        );
      }
    }

    res.status(201).json(roadmap);
  } catch (err) {
    next(err);
  }
};

export const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap found. Generate your personalized roadmap first.' });
    }
    res.json(roadmap);
  } catch (err) {
    next(err);
  }
};

export const updateRoadmapTopic = async (req, res, next) => {
  try {
    const { topicName, status } = req.body;

    if (!topicName || !status) {
      return res.status(400).json({ message: 'topicName and status are required.' });
    }

    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap found.' });
    }

    // Trigger Manager Agent adaptive re-planning
    const adapted = await adaptRoadmapPlan(roadmap, topicName, status);

    roadmap.phases = adapted.phases;
    roadmap.summary = adapted.summary;
    roadmap.updatedAt = new Date();

    await roadmap.save();

    // Also update Progress model
    await Progress.findOneAndUpdate(
      { userId: req.user.id, skillName: topicName },
      {
        status,
        progressPercentage: status === 'Completed' ? 100 : status === 'In Progress' ? 50 : 0,
        completedAt: status === 'Completed' ? new Date() : null
      },
      { upsert: true }
    );

    res.json(roadmap);
  } catch (err) {
    next(err);
  }
};
