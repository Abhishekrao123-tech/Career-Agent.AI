import dotenv from 'dotenv';
import { generateStudentCareerPlan, generateTodayStudySession } from '../agents/managerAgent.js';

dotenv.config();

async function runTest() {
  console.log('=== TESTING MULTI-AGENT PIPELINE ===');
  
  const dummyProfile = {
    targetCareer: 'Full Stack Developer',
    experienceLevel: 'Beginner',
    dailyStudyHours: 2,
    roadmapDuration: '4 months',
    interests: ['Web Development', 'Open Source'],
    skills: ['HTML', 'CSS', 'basic JavaScript'],
    weakAreas: ['Async JavaScript', 'Database normalization']
  };

  try {
    const result = await generateStudentCareerPlan(dummyProfile);
    console.log('\n--- MULTI-AGENT PIPELINE SUCCESS ---');
    console.log('Target Career:', result.targetCareer);
    console.log('Summary:', result.summary);
    console.log('Phases count:', result.phases?.length);
    console.log('Project recommendations count:', result.projectRecommendations?.length);
    console.log('Known skills:', result.skillGaps?.known);
    console.log('Missing skills:', result.skillGaps?.missing);

    console.log('\n--- TESTING TODAY STUDY SESSION AGENT ---');
    const todayPlan = await generateTodayStudySession(dummyProfile, { phases: result.phases });
    console.log('Focus Topic:', todayPlan.focusTopic);
    console.log('Tasks count:', todayPlan.tasks?.length);
    console.log('Rationale:', todayPlan.rationale);

    console.log('\nALL BACKEND AGENT TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('AGENT TEST ERROR:', err);
  }
}

runTest();
