import { callGroqStructuredJSON } from '../services/groqService.js';

const PROJECT_AGENT_SYSTEM_PROMPT = `You are a project recommendation agent.
Recommend projects matching the student's current skill level and roadmap stage.
Never require technologies the student has not learned or started learning yet.
Provide a balanced mix of Beginner, Intermediate, and Advanced projects.
Return structured JSON only.

JSON Format:
{
  "recommendations": [
    {
      "title": "Project Title",
      "difficulty": "Beginner / Intermediate / Advanced",
      "technologies": ["HTML", "CSS", "JS"],
      "requiredSkills": ["Skill1", "Skill2"],
      "features": ["Feature 1", "Feature 2"],
      "whyUseful": "Why building this project strengthens their resume & understanding."
    }
  ]
}`;

const getFallbackProjects = (targetCareer, knownSkills = []) => {
  return {
    recommendations: [
      {
        title: 'Interactive Student Portfolio Website',
        difficulty: 'Beginner',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS'],
        requiredSkills: ['HTML', 'CSS', 'Basic JS'],
        features: [
          'Responsive design with dark/light mode toggle',
          'Interactive skills showcase and project gallery',
          'Contact form with client-side validation'
        ],
        whyUseful: 'Essential foundational project to showcase your work to recruiters and practice core DOM manipulation.'
      },
      {
        title: 'Real-Time Weather & Air Quality Dashboard',
        difficulty: 'Beginner',
        technologies: ['JavaScript', 'Fetch API', 'CSS Grid', 'OpenWeather API'],
        requiredSkills: ['JavaScript Promises', 'Fetch API', 'Async/Await'],
        features: [
          'Search weather by city name with geolocation auto-detect',
          '5-day detailed forecast cards',
          'Dynamic visual backgrounds based on weather conditions'
        ],
        whyUseful: 'Master async/await data fetching, API error handling, and JSON response rendering.'
      },
      {
        title: 'Full-Stack Student Expense Tracker',
        difficulty: 'Intermediate',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
        requiredSkills: ['React State', 'Express Routing', 'MongoDB Mongoose'],
        features: [
          'Category-wise expense breakdown with visual charts',
          'Monthly budget limit alerts',
          'REST API backend for storing and calculating analytics'
        ],
        whyUseful: 'Teaches end-to-end CRUD operations, state synchronization, and database persistence.'
      },
      {
        title: 'Secure User Authentication & Profile Portal',
        difficulty: 'Intermediate',
        technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'bcrypt'],
        requiredSkills: ['Node.js', 'Express Middleware', 'JWT Security'],
        features: [
          'User signup/login with password hashing',
          'JWT token verification middleware & cookie storage',
          'Protected user profile routes'
        ],
        whyUseful: 'Crucial for understanding web security, session persistence, and API middleware.'
      },
      {
        title: 'AI-Powered Career & Task Management Platform',
        difficulty: 'Advanced',
        technologies: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Groq / LLM API'],
        requiredSkills: ['React', 'Node.js', 'REST APIs', 'LLM Integration'],
        features: [
          'Multi-agent roadmap generator and daily scheduler',
          'Progress checkpoint tracking & adaptive re-planning',
          'Interactive AI assistant chat drawer'
        ],
        whyUseful: 'Stunning capstone project showcasing full-stack proficiency and modern AI agent engineering.'
      }
    ]
  };
};

export const recommendProjects = async (targetCareer, knownSkills = [], missingSkills = [], currentPhase = 'Foundations') => {
  const userPrompt = `
Target Career: ${targetCareer}
Currently Mastered/Known Skills: ${knownSkills.join(', ') || 'HTML, CSS, basic JavaScript'}
Missing/Learning Skills: ${missingSkills.join(', ')}
Current Roadmap Phase: ${currentPhase}

Recommend 4-5 practical projects ranging from Beginner to Advanced that match their trajectory.
`;

  try {
    const result = await callGroqStructuredJSON(PROJECT_AGENT_SYSTEM_PROMPT, userPrompt);
    if (result && Array.isArray(result.recommendations) && result.recommendations.length > 0) {
      return result;
    }
    throw new Error('Invalid schema returned from Project Agent');
  } catch (err) {
    console.warn(`[ProjectAgent] Using fallback heuristic project recommendations: ${err.message}`);
    return getFallbackProjects(targetCareer, knownSkills);
  }
};
