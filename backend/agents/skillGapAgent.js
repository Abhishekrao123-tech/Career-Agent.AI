import { callGroqStructuredJSON } from '../services/groqService.js';

const SKILL_GAP_SYSTEM_PROMPT = `You are a skill-gap analysis agent.
Compare the student's existing skills against required career skills.
Identify known, partial, missing, high-priority and low-priority skills.
Return structured JSON only.

JSON Format:
{
  "known": ["Skill1", "Skill2"],
  "partiallyKnown": ["Skill3"],
  "missing": ["Skill4", "Skill5", "Skill6"],
  "highPriority": ["Skill3", "Skill4"],
  "lowPriority": ["Skill5", "Skill6"],
  "gapSummary": "Brief overview of the student's current standing vs career goals."
}`;

/**
 * Fallback skill gap analyzer logic
 */
const getFallbackSkillGap = (studentSkills = [], requiredSkills = [], weakAreas = []) => {
  const normStudentSkills = studentSkills.map((s) => s.toLowerCase().trim());
  const normWeakAreas = weakAreas.map((w) => w.toLowerCase().trim());

  const known = [];
  const partiallyKnown = [];
  const missing = [];

  requiredSkills.forEach((reqSkill) => {
    const sLower = reqSkill.toLowerCase();
    const isKnown = normStudentSkills.some((st) => st === sLower || st.includes(sLower) || sLower.includes(st));
    const isWeak = normWeakAreas.some((wa) => wa === sLower || wa.includes(sLower) || sLower.includes(wa));

    if (isKnown && !isWeak) {
      known.push(reqSkill);
    } else if (isKnown && isWeak) {
      partiallyKnown.push(reqSkill);
    } else {
      missing.push(reqSkill);
    }
  });

  // High priority: partially known + missing core skills
  const highPriority = [...partiallyKnown, ...missing.slice(0, 4)];
  const lowPriority = missing.slice(4);

  return {
    known: known.length ? known : studentSkills.filter(s => Boolean(s)),
    partiallyKnown,
    missing: missing.length ? missing : ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git'],
    highPriority,
    lowPriority,
    gapSummary: `You have foundational knowledge in ${known.join(', ') || 'some basic skills'}, but need to master ${highPriority.join(', ')} to become job-ready.`
  };
};

export const analyzeSkillGap = async (studentSkills = [], requiredSkills = [], weakAreas = [], experienceLevel = 'Beginner') => {
  const userPrompt = `
Student Current Skills: ${studentSkills.join(', ') || 'None specified'}
Student Weak Areas: ${weakAreas.join(', ') || 'None specified'}
Student Experience Level: ${experienceLevel}
Career Required Skills: ${requiredSkills.join(', ')}

Perform a detailed skill gap evaluation.
`;

  try {
    const result = await callGroqStructuredJSON(SKILL_GAP_SYSTEM_PROMPT, userPrompt);
    if (result && Array.isArray(result.missing)) {
      return result;
    }
    throw new Error('Invalid schema returned from Skill Gap Agent');
  } catch (err) {
    console.warn(`[SkillGapAgent] Using fallback heuristic skill gap analysis: ${err.message}`);
    return getFallbackSkillGap(studentSkills, requiredSkills, weakAreas);
  }
};
