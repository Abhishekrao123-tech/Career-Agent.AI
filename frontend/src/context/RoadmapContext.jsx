import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getProfileApi,
  updateProfileApi,
  getRoadmapApi,
  generateRoadmapApi,
  updateRoadmapTopicApi,
  getProgressApi,
  getProjectsApi,
  getTodayStudyPlanApi
} from '../services/api';
import { useAuth } from './AuthContext';

const RoadmapContext = createContext();

export const RoadmapProvider = ({ children }) => {
  const { token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [progressStats, setProgressStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [todayPlan, setTodayPlan] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [loadingToday, setLoadingToday] = useState(false);

  // Fetch initial student data when logged in
  const refreshData = async () => {
    if (!token) return;
    setLoadingProfile(true);
    setLoadingRoadmap(true);

    try {
      const profRes = await getProfileApi();
      setProfile(profRes.data);

      try {
        const rmRes = await getRoadmapApi();
        setRoadmap(rmRes.data);
      } catch (err) {
        setRoadmap(null);
      }

      try {
        const progRes = await getProgressApi();
        setProgressStats(progRes.data);
      } catch (err) {
        console.warn('Could not fetch progress stats');
      }

      try {
        const projRes = await getProjectsApi();
        setProjects(projRes.data);
      } catch (err) {
        console.warn('Could not fetch project recommendations');
      }
    } catch (err) {
      console.error('Error fetching student context data:', err);
    } finally {
      setLoadingProfile(false);
      setLoadingRoadmap(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [token]);

  // Generate multi-agent roadmap
  const triggerGenerateRoadmap = async () => {
    setGeneratingRoadmap(true);
    try {
      const res = await generateRoadmapApi();
      setRoadmap(res.data);
      // Also refresh projects & progress
      const projRes = await getProjectsApi();
      setProjects(projRes.data);
      const progRes = await getProgressApi();
      setProgressStats(progRes.data);
      return res.data;
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  // Update profile
  const saveProfile = async (profileData) => {
    const res = await updateProfileApi(profileData);
    setProfile(res.data);
    return res.data;
  };

  // Adaptive roadmap topic status toggle
  const toggleTopicStatus = async (topicName, newStatus) => {
    const res = await updateRoadmapTopicApi(topicName, newStatus);
    setRoadmap(res.data);
    
    // Refresh stats
    try {
      const progRes = await getProgressApi();
      setProgressStats(progRes.data);
    } catch (e) {}
  };

  // Fetch "What Should I Learn Today?" plan
  const fetchTodayPlan = async () => {
    setLoadingToday(true);
    try {
      const res = await getTodayStudyPlanApi();
      setTodayPlan(res.data);
      return res.data;
    } finally {
      setLoadingToday(false);
    }
  };

  return (
    <RoadmapContext.Provider
      value={{
        profile,
        roadmap,
        progressStats,
        projects,
        todayPlan,
        loadingProfile,
        loadingRoadmap,
        generatingRoadmap,
        loadingToday,
        refreshData,
        saveProfile,
        triggerGenerateRoadmap,
        toggleTopicStatus,
        fetchTodayPlan
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => useContext(RoadmapContext);
