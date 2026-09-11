import { callGroqStructuredJSON } from '../services/groqService.js';

const ROADMAP_AGENT_SYSTEM_PROMPT = `You are a personalized learning-roadmap agent.
Build a realistic sequential roadmap based on the student's missing skills, existing knowledge, available study hours and target duration.
Respect prerequisite dependencies (do not place advanced frameworks before fundamentals).
Return structured JSON only.

JSON Format:
{
  "summary": "Brief executive summary of the customized roadmap strategy.",
  "phases": [
    {
      "phase": 1,
      "title": "Phase Title",
      "duration": "2 weeks",
      "topics": [
        { "name": "Topic Name", "status": "Not Started" }
      ],
      "learningGoals": ["Goal 1", "Goal 2"],
      "practiceActivities": ["Activity 1", "Activity 2"],
      "completionCriteria": "What defines completion of this phase"
    }
  ]
}`;

const getFallbackRoadmap = (targetCareer, skillGaps, dailyStudyHours, roadmapDuration) => {
  const missing = skillGaps.missing || ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git'];
  const highPriority = skillGaps.highPriority || ['JavaScript', 'Git', 'React'];

  return {
    summary: `Tailored ${roadmapDuration} roadmap at ${dailyStudyHours} hours/day focusing on mastering high priority gaps (${highPriority.slice(0, 3).join(', ')}) before advancing to backend integration.`,
    phases: [
      {
        phase: 1,
        title: 'Foundations & Modern JavaScript',
        duration: '3 weeks',
        topics: [
          { name: 'JavaScript Promises & Async/Await', status: 'Not Started' },
          { name: 'DOM Manipulation & Fetch API', status: 'Not Started' },
          { name: 'ES6 Modules & Array Methods', status: 'Not Started' },
          { name: 'Git & GitHub Version Control', status: 'Not Started' }
        ],
        learningGoals: [
          'Master asynchronous JavaScript workflow',
          'Learn basic Git commands and branching strategy'
        ],
        practiceActivities: [
          'Build an async Weather Dashboard using public APIs',
          'Push 3 repositories to GitHub with structured commits'
        ],
        completionCriteria: 'Able to fetch remote API data asynchronously and deploy modern JS page to GitHub Pages.'
      },
      {
        phase: 2,
        title: 'Frontend Mastery with React',
        duration: '4 weeks',
        topics: [
          { name: 'React Components & JSX', status: 'Not Started' },
          { name: 'State Management (useState & useEffect)', status: 'Not Started' },
          { name: 'Context API & Custom Hooks', status: 'Not Started' },
          { name: 'Tailwind CSS UI Design', status: 'Not Started' }
        ],
        learningGoals: [
          'Understand component architecture & lifecycle',
          'Design modern responsive interfaces using Tailwind CSS'
        ],
        practiceActivities: [
          'Build an Interactive Task Manager App',
          'Create a dynamic Student Expense Tracker with local storage'
        ],
        completionCriteria: 'Build a multi-component interactive React SPA with persistent data.'
      },
      {
        phase: 3,
        title: 'Backend Engineering & REST APIs',
        duration: '4 weeks',
        topics: [
          { name: 'Node.js Core Modules & Express.js', status: 'Not Started' },
          { name: 'RESTful API Architecture & Routing', status: 'Not Started' },
          { name: 'Middleware & Error Handling', status: 'Not Started' },
          { name: 'Postman API Testing', status: 'Not Started' }
        ],
        learningGoals: [
          'Construct robust Express web servers',
          'Implement modular routing and error logging middleware'
        ],
        practiceActivities: [
          'Develop a REST API for a Bookstore with CRUD operations',
          'Test all HTTP endpoints using Postman collection'
        ],
        completionCriteria: 'Express backend serving clean REST endpoints with validation.'
      },
      {
        phase: 4,
        title: 'Database & Security Authentication',
        duration: '3 weeks',
        topics: [
          { name: 'MongoDB Schema Design & Mongoose ORM', status: 'Not Started' },
          { name: 'JWT Authentication & Password Hashing', status: 'Not Started' },
          { name: 'Protected Routes & Authorization', status: 'Not Started' }
        ],
        learningGoals: [
          'Model relational and document database collections',
          'Secure API routes using JSON Web Tokens'
        ],
        practiceActivities: [
          'Implement User Auth System with Login, Registration, and JWT verification'
        ],
        completionCriteria: 'Full authentication pipeline connected to persistent MongoDB.'
      },
      {
        phase: 5,
        title: 'Full-Stack Integration & Deployment',
        duration: '2 weeks',
        topics: [
          { name: 'Connecting React Frontend to Node/Mongo Backend', status: 'Not Started' },
          { name: 'Environment Variables & CORS Setup', status: 'Not Started' },
          { name: 'Cloud Deployment (Vercel & Render)', status: 'Not Started' }
        ],
        learningGoals: [
          'Orchestrate client-server data flow end-to-end',
          'Deploy full-stack web application to production'
        ],
        practiceActivities: [
          'Deploy Full-Stack Portfolio Application live online with custom domain'
        ],
        completionCriteria: 'Live public application deployed on Vercel/Render with database integration.'
      }
    ]
  };
};

export const generateRoadmap = async (targetCareer, experienceLevel, dailyStudyHours, roadmapDuration, skillGaps) => {
  const userPrompt = `
Target Career: ${targetCareer}
Experience Level: ${experienceLevel}
Available Study Time: ${dailyStudyHours} hours/day
Preferred Duration: ${roadmapDuration}
Known Skills: ${skillGaps.known ? skillGaps.known.join(', ') : ''}
Partially Known: ${skillGaps.partiallyKnown ? skillGaps.partiallyKnown.join(', ') : ''}
Missing Skills (To Learn): ${skillGaps.missing ? skillGaps.missing.join(', ') : ''}
High Priority Skills: ${skillGaps.highPriority ? skillGaps.highPriority.join(', ') : ''}

Generate a realistic, ordered phase-by-phase learning roadmap.
Ensure prerequisite order (e.g. JavaScript before React, Node before Express).
`;

  try {
    const result = await callGroqStructuredJSON(ROADMAP_AGENT_SYSTEM_PROMPT, userPrompt);
    if (result && Array.isArray(result.phases) && result.phases.length > 0) {
      // Normalize topics format inside phases
      result.phases = result.phases.map((phase) => ({
        ...phase,
        topics: (phase.topics || []).map((topic) => {
          if (typeof topic === 'string') {
            return { name: topic, status: 'Not Started' };
          }
          return { name: topic.name || topic.title || 'Topic', status: topic.status || 'Not Started' };
        })
      }));
      return result;
    }
    throw new Error('Invalid schema returned from Roadmap Agent');
  } catch (err) {
    console.warn(`[RoadmapAgent] Using fallback heuristic roadmap generation: ${err.message}`);
    return getFallbackRoadmap(targetCareer, skillGaps, dailyStudyHours, roadmapDuration);
  }
};
