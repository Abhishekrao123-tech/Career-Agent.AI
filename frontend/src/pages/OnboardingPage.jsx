import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { Target, Clock, Calendar, Brain, Award, Sparkles, Check, Plus, Trash2 } from 'lucide-react';

export const OnboardingPage = ({ onComplete }) => {
  const { profile, saveProfile, triggerGenerateRoadmap } = useRoadmap();

  const [targetCareer, setTargetCareer] = useState(profile?.targetCareer || 'Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState(profile?.experienceLevel || 'Beginner');
  const [dailyStudyHours, setDailyStudyHours] = useState(profile?.dailyStudyHours || 2);
  const [roadmapDuration, setRoadmapDuration] = useState(profile?.roadmapDuration || '4 months');

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(
    profile?.skills?.length ? profile.skills : ['HTML', 'CSS', 'JavaScript']
  );

  const [weakInput, setWeakInput] = useState('');
  const [weakAreas, setWeakAreas] = useState(
    profile?.weakAreas?.length ? profile.weakAreas : ['Async Promises', 'Database Design']
  );

  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState(
    profile?.interests?.length ? profile.interests : ['Web Development', 'Open Source']
  );

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddWeak = () => {
    if (weakInput.trim() && !weakAreas.includes(weakInput.trim())) {
      setWeakAreas([...weakAreas, weakInput.trim()]);
      setWeakInput('');
    }
  };

  const handleRemoveWeak = (wToRemove) => {
    setWeakAreas(weakAreas.filter((w) => w !== wToRemove));
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (iToRemove) => {
    setInterests(interests.filter((i) => i !== iToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      await saveProfile({
        targetCareer,
        experienceLevel,
        dailyStudyHours: Number(dailyStudyHours),
        roadmapDuration,
        skills,
        weakAreas,
        interests
      });

      // Run multi-agent roadmap pipeline
      await triggerGenerateRoadmap();

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error('Error in onboarding assessment:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to generate roadmap. Please check backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const careerOptions = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Engineer',
    'Data Scientist / AI Engineer',
    'Mobile App Developer',
    'DevOps & Cloud Engineer'
  ];

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-8 flex items-center justify-center">
      <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 sm:p-10 border border-gray-800 space-y-8 shadow-glow-indigo">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-accent mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Student Assessment & Career Setup</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Student Profile & Goal Assessment</h2>
          <p className="text-xs text-gray-400 max-w-lg mx-auto">
            Input your current skills and target role. Our Manager Agent and specialized AI agents will build your customized adaptive roadmap.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Career Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-accent" />
              Target Career Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {careerOptions.map((role) => (
                <div
                  key={role}
                  onClick={() => setTargetCareer(role)}
                  className={`p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                    targetCareer === role
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 border-brand-400 text-white shadow-glow-indigo'
                      : 'bg-dark-bg/60 border-gray-800 text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <span>{role}</span>
                  {targetCareer === role && <Check className="w-4 h-4 text-cyan-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* Level, Daily Hours, Duration */}
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
                <option value="Beginner">Beginner (Starting fresh)</option>
                <option value="Intermediate">Intermediate (Some syntax/projects)</option>
                <option value="Advanced">Advanced (Looking to polish)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Daily Time Available
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
                Target Duration
              </label>
              <select
                value={roadmapDuration}
                onChange={(e) => setRoadmapDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-gray-700 text-xs text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="2 months">2 months (Intensive)</option>
                <option value="4 months">4 months (Standard semester)</option>
                <option value="6 months">6 months (Deep mastery)</option>
              </select>
            </div>
          </div>

          {/* Current Known Skills Tag Input */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-emerald-400" />
              Current Known Skills & Technologies
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Type skill (e.g. HTML, JavaScript, Python) and press Enter"
                className="flex-1 px-3.5 py-2 rounded-xl bg-dark-bg border border-gray-700 text-xs text-white focus:border-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center space-x-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Weak Areas Tag Input */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Weak Areas or Hard Topics
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={weakInput}
                onChange={(e) => setWeakInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddWeak())}
                placeholder="Type topic (e.g. Async Promises, SQL joins) and press Enter"
                className="flex-1 px-3.5 py-2 rounded-xl bg-dark-bg border border-gray-700 text-xs text-white focus:border-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddWeak}
                className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {weakAreas.map((w, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center space-x-1.5"
                >
                  <span>{w}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWeak(w)}
                    className="hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-accent hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-glow-indigo transition-all transform hover:scale-[1.01] flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Multi-Agent System Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span>Save Profile & Generate AI Roadmap</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
