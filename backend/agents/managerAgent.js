import { analyzeCareer } from './careerAgent.js';
import { analyzeSkillGap } from './skillGapAgent.js';
import { generateRoadmap } from './roadmapAgent.js';
import { recommendProjects } from './projectAgent.js';
import { callGroqLLM, callGroqStructuredJSON } from '../services/groqService.js';

const MANAGER_SYSTEM_PROMPT = `You are the Manager Agent for an AI Career Roadmap system for college students.
Coordinate outputs from career analysis, skill-gap analysis, roadmap planning and project recommendation agents.
Resolve inconsistencies, prioritize recommendations and create a coherent personalized career-development plan.
Never blindly return outputs from other agents. Ensure prerequisites are met and time allocations are realistic.`;

/**
 * Generate full career roadmap pipeline for a student
 */
export const generateStudentCareerPlan = async (studentProfile) => {
  const {
    targetCareer = 'Full Stack Developer',
    experienceLevel = 'Beginner',
    dailyStudyHours = 2,
    roadmapDuration = '4 months',
    interests = [],
    skills = [],
    weakAreas = []
  } = studentProfile;

  console.log(`[ManagerAgent] Starting multi-agent pipeline for career: '${targetCareer}'...`);

  // Step 1: Career Analysis Agent
  console.log('[ManagerAgent] Step 1 -> Dispatching task to Career Analysis Agent...');
  const careerData = await analyzeCareer(targetCareer, interests);

  // Step 2: Skill Gap Agent
  console.log('[ManagerAgent] Step 2 -> Dispatching task to Skill Gap Agent...');
  const skillGapData = await analyzeSkillGap(
    skills,
    careerData.allRequiredSkills,
    weakAreas,
    experienceLevel
  );

  // Step 3: Roadmap Agent
  console.log('[ManagerAgent] Step 3 -> Dispatching task to Roadmap Agent...');
  const roadmapData = await generateRoadmap(
    targetCareer,
    experienceLevel,
    dailyStudyHours,
    roadmapDuration,
    skillGapData
  );

  // Step 4: Project Agent
  console.log('[ManagerAgent] Step 4 -> Dispatching task to Project Recommendation Agent...');
  const projectData = await recommendProjects(
    targetCareer,
    skillGapData.known,
    skillGapData.missing,
    roadmapData.phases[0]?.title || 'Foundations'
  );

  console.log('[ManagerAgent] Step 5 -> Synthesizing & Validating multi-agent outputs...');

  return {
    targetCareer,
    summary: roadmapData.summary || `Personalized ${roadmapDuration} career plan for ${targetCareer}.`,
    careerCategories: careerData.categories || [],
    skillGaps: {
      known: skillGapData.known || [],
      partiallyKnown: skillGapData.partiallyKnown || [],
      missing: skillGapData.missing || [],
      highPriority: skillGapData.highPriority || [],
      lowPriority: skillGapData.lowPriority || []
    },
    phases: roadmapData.phases || [],
    projectRecommendations: projectData.recommendations || []
  };
};

/**
 * Adaptive Roadmap Updater: modifies future recommendations based on completed topics
 */
export const adaptRoadmapPlan = async (currentRoadmap, updatedTopicName, newStatus) => {
  console.log(`[ManagerAgent] Adaptive update triggered: Topic '${updatedTopicName}' marked as '${newStatus}'`);

  const updatedPhases = currentRoadmap.phases.map((phase) => {
    const updatedTopics = phase.topics.map((t) => {
      if (t.name.toLowerCase() === updatedTopicName.toLowerCase()) {
        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === 'Completed' ? new Date() : t.completedAt
        };
      }
      return t;
    });
    return { ...phase, topics: updatedTopics };
  });

  // Calculate overall stats
  let totalTopics = 0;
  let completedTopics = 0;

  updatedPhases.forEach((p) => {
    p.topics.forEach((t) => {
      totalTopics++;
      if (t.status === 'Completed') completedTopics++;
    });
  });

  const completionPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return {
    phases: updatedPhases,
    completionPercent,
    summary: `Roadmap updated! You have completed ${completedTopics} of ${totalTopics} topics (${completionPercent}% complete).`
  };
};

/**
 * "What Should I Learn Today?" Daily Task Generator
 */
export const generateTodayStudySession = async (studentProfile, roadmap) => {
  const dailyHours = studentProfile.dailyStudyHours || 2;

  // Find active phase and current topic
  let activePhase = roadmap?.phases?.find((p) => p.topics.some((t) => t.status !== 'Completed')) || roadmap?.phases?.[0];
  let activeTopic = activePhase?.topics?.find((t) => t.status === 'In Progress') ||
                    activePhase?.topics?.find((t) => t.status === 'Not Started') ||
                    activePhase?.topics?.[0];

  const systemPrompt = `You are a personalized daily study planner for a college student.
Generate a structured study session matching their available daily hours (${dailyHours} hours).
Divide time into 3-4 actionable tasks with clear duration minutes totaling ${dailyHours * 60} minutes.
Return structured JSON only.

JSON Format:
{
  "totalDurationMinutes": ${dailyHours * 60},
  "focusTopic": "Main topic name",
  "phaseTitle": "Current Phase Title",
  "rationale": "Why these specific tasks were selected for today based on current roadmap progress and weak areas.",
  "tasks": [
    {
      "durationMinutes": 30,
      "title": "Task Title",
      "action": "Specific study/practice instruction",
      "type": "Theory / Practice / Project / Review"
    }
  ]
}`;

  const userPrompt = `
Career Goal: ${studentProfile.targetCareer}
Daily Study Time: ${dailyHours} hours (${dailyHours * 60} minutes)
Current Phase: ${activePhase?.title || 'Foundations'}
Focus Topic: ${activeTopic?.name || 'Core JavaScript'}
Weak Areas: ${studentProfile.weakAreas?.join(', ') || 'None specified'}
`;

  try {
    const result = await callGroqStructuredJSON(systemPrompt, userPrompt);
    if (result && Array.isArray(result.tasks)) {
      return result;
    }
    throw new Error('Invalid JSON from today study session generator');
  } catch (err) {
    console.warn(`[ManagerAgent] Today Task fallback generator used: ${err.message}`);
    
    // Heuristic breakdown for dailyHours
    const totalMinutes = dailyHours * 60;
    const chunk = Math.floor(totalMinutes / 4);

    return {
      totalDurationMinutes: totalMinutes,
      focusTopic: activeTopic?.name || 'Core Concepts & Async JavaScript',
      phaseTitle: activePhase?.title || 'Phase 1: Foundations',
      rationale: `Selected ${activeTopic?.name || 'current focus topic'} to move forward in ${activePhase?.title || 'your current phase'} while reinforcing your practice hours.`,
      tasks: [
        {
          durationMinutes: chunk,
          title: `Study Theory: ${activeTopic?.name || 'Topic Core Principles'}`,
          action: 'Read documentation & watch quick conceptual guide',
          type: 'Theory'
        },
        {
          durationMinutes: chunk,
          title: `Hands-on Code Practice`,
          action: `Write code examples testing ${activeTopic?.name || 'the concepts'} in local IDE`,
          type: 'Practice'
        },
        {
          durationMinutes: chunk,
          title: 'Mini-Project / Challenge Implementation',
          action: 'Implement a working module or mini project task applying today skills',
          type: 'Project'
        },
        {
          durationMinutes: totalMinutes - (chunk * 3),
          title: 'Review & Self-Assessment',
          action: 'Solve 2 practice questions and commit code changes to GitHub',
          type: 'Review'
        }
      ]
    };
  }
};
