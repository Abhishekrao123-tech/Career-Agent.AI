import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const registerApi = (data) => api.post('/auth/register', data);
export const loginApi = (data) => api.post('/auth/login', data);

// Profile API
export const getProfileApi = () => api.get('/profile');
export const updateProfileApi = (data) => api.put('/profile', data);

// Roadmap API
export const generateRoadmapApi = () => api.post('/roadmap/generate');
export const getRoadmapApi = () => api.get('/roadmap');
export const updateRoadmapTopicApi = (topicName, status) =>
  api.post('/roadmap/update', { topicName, status });

// Progress API
export const getProgressApi = () => api.get('/progress');
export const updateProgressApi = (skillName, status, progressPercentage) =>
  api.post('/progress/update', { skillName, status, progressPercentage });

// Projects API
export const getProjectsApi = () => api.get('/projects');
export const generateProjectsApi = () => api.post('/projects/recommend');

// Agent API
export const getTodayStudyPlanApi = () => api.post('/agent/today');

// Chat API
export const chatWithAssistantApi = (message, chatHistory = []) =>
  api.post('/chat', { message, chatHistory });

export default api;
