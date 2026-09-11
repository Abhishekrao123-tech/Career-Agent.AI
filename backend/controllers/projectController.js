import ProjectRecommendation from '../models/ProjectRecommendation.js';
import StudentProfile from '../models/StudentProfile.js';
import Roadmap from '../models/Roadmap.js';
import { recommendProjects } from '../agents/projectAgent.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await ProjectRecommendation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const generateProjects = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });
    const roadmap = await Roadmap.findOne({ userId: req.user.id });

    const knownSkills = roadmap?.skillGaps?.known || profile?.skills || [];
    const missingSkills = roadmap?.skillGaps?.missing || [];
    const currentPhase = roadmap?.phases?.[0]?.title || 'Foundations';

    const projectData = await recommendProjects(
      profile?.targetCareer || 'Full Stack Developer',
      knownSkills,
      missingSkills,
      currentPhase
    );

    // Save recommendations
    await ProjectRecommendation.deleteMany({ userId: req.user.id });
    const projectsToInsert = (projectData.recommendations || []).map((p) => ({
      userId: req.user.id,
      title: p.title,
      difficulty: p.difficulty || 'Intermediate',
      technologies: p.technologies || [],
      requiredSkills: p.requiredSkills || [],
      features: p.features || [],
      whyUseful: p.whyUseful || '',
      status: 'Recommended'
    }));

    const inserted = await ProjectRecommendation.insertMany(projectsToInsert);
    res.status(201).json(inserted);
  } catch (err) {
    next(err);
  }
};
