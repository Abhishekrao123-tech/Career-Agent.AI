import StudentProfile from '../models/StudentProfile.js';
import Roadmap from '../models/Roadmap.js';
import ProjectRecommendation from '../models/ProjectRecommendation.js';
import { callGroqLLM } from '../services/groqService.js';

export const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, chatHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message text is required.' });
    }

    const profile = await StudentProfile.findOne({ userId: req.user.id });
    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    const projects = await ProjectRecommendation.find({ userId: req.user.id });

    // Format recent chat history into prompt context
    const recentHistoryText = chatHistory
      .slice(-6)
      .map((m) => `${m.sender === 'user' ? 'Student' : 'Assistant'}: ${m.text}`)
      .join('\n');

    const contextInfo = `
[STUDENT CONTEXT]
Target Career: ${profile?.targetCareer || 'Full Stack Developer'}
Experience Level: ${profile?.experienceLevel || 'Beginner'}
Daily Study Hours: ${profile?.dailyStudyHours || 2} hours/day
Roadmap Duration: ${profile?.roadmapDuration || '4 months'}
Current Known Skills: ${profile?.skills?.join(', ') || 'HTML, CSS, JavaScript'}
Weak Areas: ${profile?.weakAreas?.join(', ') || 'None specified'}
Interests: ${profile?.interests?.join(', ') || 'None'}

[ACTIVE ROADMAP STATUS]
Missing Skills: ${roadmap?.skillGaps?.missing?.join(', ') || 'React, Node.js, Express, MongoDB'}
High Priority Skills: ${roadmap?.skillGaps?.highPriority?.join(', ') || 'JavaScript, React'}

[RECOMMENDED PROJECTS]
${projects.map((p) => `- ${p.title} (${p.difficulty})`).join('\n') || 'None'}

[RECENT CONVERSATION HISTORY]
${recentHistoryText}
`;

    const systemPrompt = `You are an expert, friendly AI Career Mentor for college students.
Use the student context and recent conversation history to provide direct, specific, and realistic answers to their questions.
Be honest about realistic learning timelines (e.g. explain that mastering technologies like React or Full-Stack takes weeks/months of dedicated practice, not 1 day).
Never promise guaranteed jobs or fake salaries.
Format your responses cleanly with clear section headers, bullet points, and clean bold terms. Keep layout easy to read.

${contextInfo}`;

    let reply = '';
    try {
      reply = await callGroqLLM(systemPrompt, message);
    } catch (err) {
      console.warn('[ChatController] Groq API fallback chat response:', err.message);

      const qLower = message.toLowerCase();

      // Intelligent context-aware dynamic fallback matching
      if (qLower.includes('stop') || qLower.includes('same') || qLower.includes('repeat') || qLower.includes('again')) {
        reply = `Got it! Let's pivot to something specific. As a target **${profile?.targetCareer || 'Full Stack Developer'}**, what specific area would you like to work on right now? You can ask me about:
• 🎯 **Missing Skills**: What skills am I currently missing?
• 🚀 **Projects**: Which project should I build next?
• ⏱️ **Schedule**: How should I plan my daily study time?`;
      } else if (qLower.includes('what to do') || qLower.includes('what next') || qLower.includes('next step') || qLower.includes('how to start') || qLower.includes('guide me')) {
        reply = `Here is your target action plan for your **${profile?.targetCareer || 'Full Stack Developer'}** path:
1. **Current Focus**: Master **${roadmap?.skillGaps?.highPriority?.[0] || 'React & JavaScript'}**.
2. **Daily Practice**: Spend **${profile?.dailyStudyHours || 2} hours/day** (1 hour learning concepts, 1 hour writing code).
3. **Hands-on Project**: Work on **${projects?.[0]?.title || 'Interactive Full-Stack Web App'}**.`;
      } else if (qLower.includes('hi') || qLower.includes('hello') || qLower.includes('hey') || qLower.includes('greetings')) {
        reply = `Hello! I'm your AI Career Assistant. Your current target role is **${profile?.targetCareer || 'Full Stack Developer'}** (${profile?.roadmapDuration || '4 months'} roadmap). How can I assist your study today?`;
      } else if (qLower.includes('1 day') || qLower.includes('one day') || qLower.includes('fast') || qLower.includes('how long') || qLower.includes('quick')) {
        reply = `Mastering **${roadmap?.skillGaps?.highPriority?.[0] || 'technologies like React'}** realistically takes 3 to 4 weeks of regular practice at ${profile?.dailyStudyHours || 2} hours per day. Consistent daily practice yields true project mastery!`;
      } else if (qLower.includes('missing') || qLower.includes('lacking') || qLower.includes('gap') || qLower.includes('skills')) {
        reply = `Based on your goal for **${profile?.targetCareer || 'Full Stack Developer'}**, your top missing skills to focus on are: **${roadmap?.skillGaps?.missing?.join(', ') || 'React, Node.js, Express, REST APIs'}**. Start with **${roadmap?.skillGaps?.highPriority?.[0] || 'React'}** first!`;
      } else if (qLower.includes('today') || qLower.includes('study') || qLower.includes('schedule')) {
        reply = `Based on your profile for **${profile?.targetCareer || 'Full Stack Developer'}**, today you should spend 1 hour studying **${roadmap?.skillGaps?.highPriority?.[0] || 'Core JavaScript'}** and 1 hour practicing code challenges or building project components!`;
      } else if (qLower.includes('ready') || qLower.includes('react')) {
        reply = `You are ready for React once you are comfortable with ES6 Arrow Functions, Array methods (.map, .filter), Async/Await, and Promises. Check off JavaScript fundamentals on your roadmap first!`;
      } else if (qLower.includes('project') || qLower.includes('build')) {
        reply = `I recommend starting with **${projects?.[0]?.title || 'Interactive Portfolio Website'}**. It directly reinforces your current skills before you tackle full-stack backend integration.`;
      } else {
        const fallbacks = [
          `Targeting **${profile?.targetCareer || 'Full Stack Developer'}**? Focus on mastering **${roadmap?.skillGaps?.highPriority?.[0] || 'React'}** next by practicing ${profile?.dailyStudyHours || 2} hours daily!`,
          `To reach your **${profile?.targetCareer || 'Full Stack Developer'}** goal within ${profile?.roadmapDuration || '4 months'}, try tackling **${projects?.[0]?.title || 'a full-stack project'}** while studying missing core concepts.`,
          `Your roadmap targets **${profile?.targetCareer || 'Full Stack Developer'}**. Need help with missing skills (**${roadmap?.skillGaps?.missing?.slice(0, 2).join(', ') || 'React, Node.js'}**), project ideas, or study scheduling?`
        ];
        reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }
    }

    res.json({ reply });
  } catch (err) {
    next(err);
  }
};
