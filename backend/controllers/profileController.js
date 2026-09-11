import StudentProfile from '../models/StudentProfile.js';

export const getProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = await StudentProfile.create({
        userId: req.user.id,
        targetCareer: 'Full Stack Developer',
        experienceLevel: 'Beginner',
        dailyStudyHours: 2,
        roadmapDuration: '4 months',
        skills: ['HTML', 'CSS', 'JavaScript'],
        weakAreas: []
      });
    }

    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {
      targetCareer,
      experienceLevel,
      dailyStudyHours,
      roadmapDuration,
      interests,
      skills,
      weakAreas
    } = req.body;

    let profile = await StudentProfile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = new StudentProfile({ userId: req.user.id });
    }

    if (targetCareer !== undefined) profile.targetCareer = targetCareer;
    if (experienceLevel !== undefined) profile.experienceLevel = experienceLevel;
    if (dailyStudyHours !== undefined) profile.dailyStudyHours = dailyStudyHours;
    if (roadmapDuration !== undefined) profile.roadmapDuration = roadmapDuration;
    if (interests !== undefined) profile.interests = interests;
    if (skills !== undefined) profile.skills = skills;
    if (weakAreas !== undefined) profile.weakAreas = weakAreas;

    await profile.save();

    res.json(profile);
  } catch (err) {
    next(err);
  }
};
