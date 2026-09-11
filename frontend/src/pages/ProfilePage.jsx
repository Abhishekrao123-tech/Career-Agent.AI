import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { UserCheck, Target, Clock, Calendar, Award, Sparkles, Check } from 'lucide-react';

export const ProfilePage = () => {
  const { profile, saveProfile, triggerGenerateRoadmap, generatingRoadmap } = useRoadmap();

  const [targetCareer, setTargetCareer] = useState(profile?.targetCareer || 'Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState(profile?.experienceLevel || 'Beginner');
  const [dailyStudyHours, setDailyStudyHours] = useState(profile?.dailyStudyHours || 2);
  const [roadmapDuration, setRoadmapDuration] = useState(profile?.roadmapDuration || '4 months');

  const [savedMessage, setSavedMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveProfile({
        targetCareer,
        experienceLevel,
        dailyStudyHours: Number(dailyStudyHours),
        roadmapDuration
      });
      setSavedMessage('Profile saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      <div className="border-b border-gray-800 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-accent mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>Student Account Settings</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-brand-accent" />
          Student Profile Settings
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Update your target career goal, study hours budget, and experience level.
        </p>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 border border-gray-800 space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-accent" />
            Target Career Goal
          </label>
          <input
            type="text"
            value={targetCareer}
            onChange={(e) => setTargetCareer(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-gray-700 text-sm text-white focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-gray-700 text-xs text-white focus:border-brand-500 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Daily Study Hours
            </label>
            <select
              value={dailyStudyHours}
              onChange={(e) => setDailyStudyHours(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-gray-700 text-xs text-white focus:border-brand-500 focus:outline-none"
            >
              <option value={1}>1 hour / day</option>
              <option value={2}>2 hours / day</option>
              <option value={3}>3 hours / day</option>
              <option value={4}>4+ hours / day</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Roadmap Duration
            </label>
            <select
              value={roadmapDuration}
              onChange={(e) => setRoadmapDuration(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-gray-700 text-xs text-white focus:border-brand-500 focus:outline-none"
            >
              <option value="2 months">2 months</option>
              <option value="4 months">4 months</option>
              <option value="6 months">6 months</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-800">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-indigo transition-all"
          >
            Save Profile Settings
          </button>

          <button
            type="button"
            onClick={triggerGenerateRoadmap}
            disabled={generatingRoadmap}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-dark-bg border border-gray-700 hover:border-brand-500 text-brand-accent font-bold text-xs transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Re-Generate AI Roadmap Now</span>
          </button>
        </div>
      </form>
    </div>
  );
};
