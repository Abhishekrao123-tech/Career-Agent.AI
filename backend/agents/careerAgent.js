import { callGroqStructuredJSON } from '../services/groqService.js';

const CAREER_AGENT_SYSTEM_PROMPT = `You are a career-analysis AI agent for college students.
Analyze the student's target role and return the skills required for that career.
Organize skills by category and priority.
Do not generate a learning roadmap.
Return JSON only.

JSON Format:
{
  "targetCareer": "Career Name",
  "categories": [
    {
      "categoryName": "Frontend / Backend / Database / Tools / CS Foundations / Cloud & DevOps / Soft & Interview Skills",
      "skills": ["Skill1", "Skill2", "Skill3"]
    }
  ],
  "allRequiredSkills": ["Skill1", "Skill2", ...]
}`;

/**
 * Fallback static database of popular roles for offline mode or fallback
 */
const getFallbackCareerAnalysis = (targetCareer) => {
  const normalized = (targetCareer || 'Full Stack Developer').toLowerCase();

  if (normalized.includes('data') || normalized.includes('ml') || normalized.includes('ai')) {
    return {
      targetCareer: targetCareer || 'Data Scientist / AI Engineer',
      categories: [
        { categoryName: 'Programming Languages', skills: ['Python', 'SQL', 'R'] },
        { categoryName: 'Data Analysis & Math', skills: ['Pandas', 'NumPy', 'Statistics', 'Linear Algebra'] },
        { categoryName: 'Machine Learning', skills: ['Scikit-Learn', 'TensorFlow', 'PyTorch', 'Model Evaluation'] },
        { categoryName: 'Database & Big Data', skills: ['PostgreSQL', 'MongoDB', 'Apache Spark'] },
        { categoryName: 'Tools & Cloud', skills: ['Jupyter', 'Git', 'Docker', 'AWS S3'] }
      ],
      allRequiredSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Statistics', 'Scikit-Learn', 'TensorFlow', 'PostgreSQL', 'Git', 'Docker']
    };
  }

  if (normalized.includes('mobile') || normalized.includes('android') || normalized.includes('ios')) {
    return {
      targetCareer: targetCareer || 'Mobile App Developer',
      categories: [
        { categoryName: 'Languages', skills: ['JavaScript', 'TypeScript', 'Dart', 'Kotlin', 'Swift'] },
        { categoryName: 'Frameworks', skills: ['React Native', 'Flutter'] },
        { categoryName: 'Mobile Concepts', skills: ['State Management', 'REST APIs', 'Offline Storage', 'Push Notifications'] },
        { categoryName: 'Tools & Deployment', skills: ['Git', 'Android Studio', 'Xcode', 'App Store / Play Store Release'] }
      ],
      allRequiredSkills: ['JavaScript', 'TypeScript', 'React Native', 'REST APIs', 'State Management', 'Git', 'Offline Storage']
    };
  }

  // Default Full Stack Developer
  return {
    targetCareer: targetCareer || 'Full Stack Developer',
    categories: [
      { categoryName: 'Frontend', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'] },
      { categoryName: 'Backend', skills: ['Node.js', 'Express.js', 'REST APIs', 'Authentication'] },
      { categoryName: 'Database', skills: ['MongoDB', 'PostgreSQL', 'Mongoose'] },
      { categoryName: 'Tools & Deployment', skills: ['Git', 'GitHub', 'Postman', 'Docker', 'Vercel / Render'] },
      { categoryName: 'CS Foundations', skills: ['Data Structures', 'Algorithms', 'HTTP / Web Security'] }
    ],
    allRequiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'Git', 'Authentication']
  };
};

export const analyzeCareer = async (targetCareer, interests = []) => {
  const userPrompt = `Target Career: ${targetCareer}\nStudent Interests: ${interests.join(', ') || 'None specified'}\n\nAnalyze the required industry skills for this career role. Categorize them comprehensively.`;

  try {
    const result = await callGroqStructuredJSON(CAREER_AGENT_SYSTEM_PROMPT, userPrompt);
    if (result && result.allRequiredSkills && Array.isArray(result.allRequiredSkills)) {
      return result;
    }
    throw new Error('Invalid schema returned from Career Agent');
  } catch (err) {
    console.warn(`[CareerAgent] Using fallback heuristic analysis for target career '${targetCareer}': ${err.message}`);
    return getFallbackCareerAnalysis(targetCareer);
  }
};
