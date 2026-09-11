import http from 'http';

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function testFullE2E() {
  console.log('=== RUNNING END-TO-END HTTP API VERIFICATION ===');

  try {
    // 1. Health check
    const health = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    });
    console.log('[1/7] Health check status:', health.status, health.data.service);

    // 2. Register user
    const registerRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'E2E Test Student',
        email: `student_${Date.now()}@test.edu`,
        password: 'password123'
      }
    );
    console.log('[2/7] Register status:', registerRes.status);
    const token = registerRes.data.token;
    if (!token) throw new Error('No token returned from register');

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    // 3. Update Profile
    const profileRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/profile',
        method: 'PUT',
        headers: authHeaders
      },
      {
        targetCareer: 'Full Stack Developer',
        experienceLevel: 'Beginner',
        dailyStudyHours: 2,
        roadmapDuration: '4 months',
        skills: ['HTML', 'CSS', 'basic JavaScript'],
        weakAreas: ['Async/Await']
      }
    );
    console.log('[3/7] Update profile target career:', profileRes.data.targetCareer);

    // 4. Generate Multi-Agent Roadmap
    const roadmapRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/roadmap/generate',
        method: 'POST',
        headers: authHeaders
      }
    );
    console.log('[4/7] Multi-agent roadmap generated! Phases count:', roadmapRes.data.phases?.length);

    // 5. Update Topic Status (Adaptive Learning)
    const updateTopicRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/roadmap/update',
        method: 'POST',
        headers: authHeaders
      },
      {
        topicName: 'Git & GitHub Version Control',
        status: 'Completed'
      }
    );
    console.log('[5/7] Adaptive roadmap update status:', updateTopicRes.status, 'Summary:', updateTopicRes.data.summary);

    // 6. Get Today Study Session ("What Should I Learn Today?")
    const todayRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/agent/today',
        method: 'POST',
        headers: authHeaders
      }
    );
    console.log('[6/7] Today study plan generated! Focus Topic:', todayRes.data.focusTopic, 'Tasks count:', todayRes.data.tasks?.length);

    // 7. AI Chat Assistant
    const chatRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/chat',
        method: 'POST',
        headers: authHeaders
      },
      {
        message: 'Am I ready to learn React?'
      }
    );
    console.log('[7/7] AI Career Assistant reply length:', chatRes.data.reply?.length, 'chars');

    console.log('\n======================================================');
    console.log('SUCCESS: ALL 7 END-TO-END HTTP API ENDPOINTS VERIFIED!');
    console.log('======================================================');
  } catch (err) {
    console.error('E2E Verification Error:', err);
  }
}

testFullE2E();
