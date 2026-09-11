import React from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import {
  Target,
  TrendingUp,
  Map,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  FolderGit2,
  ArrowRight,
  BrainCircuit
} from 'lucide-react';
import { SkillBadge } from '../components/SkillBadge';
import { ProjectCard } from '../components/ProjectCard';

export const DashboardPage = ({ setActiveTab, onOpenTodayModal }) => {
  const {
    profile,
    roadmap,
    progressStats,
    projects,
    generatingRoadmap,
    triggerGenerateRoadmap
  } = useRoadmap();

  const activePhase = roadmap?.phases?.find((p) => p.topics.some((t) => t.status !== 'Completed')) || roadmap?.phases?.[0];
  const overallPct = progressStats?.overallPercentage || 0;
  const topProject = projects?.[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900/60 via-indigo-900/40 to-dark-card border border-brand-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-glow-indigo">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-xs font-bold text-brand-accent">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Active Target Role</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {profile?.targetCareer || 'Full Stack Developer'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            {roadmap?.summary || 'Your adaptive roadmap has been calculated by the Multi-Agent System.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 z-10 shrink-0">
          <button
            onClick={onOpenTodayModal}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-glow-indigo transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>What to Learn Today?</span>
          </button>

          <button
            onClick={triggerGenerateRoadmap}
            disabled={generatingRoadmap}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-dark-bg border border-gray-700 hover:border-brand-500 text-gray-200 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2"
          >
            <BrainCircuit className={`w-4 h-4 text-brand-accent ${generatingRoadmap ? 'animate-spin' : ''}`} />
            <span>{generatingRoadmap ? 'Agents Working...' : 'Re-run AI Agents'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-brand-accent" />
          </div>
          <div className="text-3xl font-extrabold text-white">{overallPct}%</div>
          <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden border border-gray-800">
            <div
              className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Phase</span>
            <Map className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-extrabold text-white truncate">
            {activePhase?.title || 'Phase 1: Foundations'}
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {activePhase?.duration || 'Standard'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skills Known</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {roadmap?.skillGaps?.known?.length || profile?.skills?.length || 0}
          </div>
          <p className="text-xs text-gray-400">Mastered foundational tech</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skills Remaining</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            {roadmap?.skillGaps?.missing?.length || 0}
          </div>
          <p className="text-xs text-gray-400">Target missing career gaps</p>
        </div>
      </div>

      {/* Main Content Grid: Roadmap Phase Preview & Skill Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Phase Box */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-brand-accent" />
              Active Learning Phase
            </h3>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1"
            >
              <span>View Full Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activePhase ? (
            <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-accent">
                    Phase {activePhase.phase || 1}
                  </span>
                  <h4 className="text-xl font-bold text-white mt-1">{activePhase.title}</h4>
                </div>
                <span className="text-xs text-gray-400">{activePhase.duration}</span>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Phase Topics
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activePhase.topics?.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-dark-bg/60 border border-gray-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-gray-200">{topic.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          topic.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : topic.status === 'In Progress'
                            ? 'bg-brand-500/20 text-brand-accent'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {topic.status || 'Not Started'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-3xl text-center text-gray-400 text-sm">
              No active phase. Click "Re-run AI Agents" to generate your roadmap!
            </div>
          )}

          {/* Recommended Project Preview */}
          {topProject && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-emerald-400" />
                  Recommended Practice Project
                </h3>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <ProjectCard project={topProject} />
            </div>
          )}
        </div>

        {/* Sidebar Column: High Priority Skill Gaps */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              High Priority Skill Gaps
            </h3>
            <p className="text-xs text-gray-400">
              Target skills identified by Skill Gap Agent for {profile?.targetCareer}:
            </p>
            <div className="flex flex-wrap gap-2">
              {roadmap?.skillGaps?.highPriority?.map((sk, idx) => (
                <SkillBadge key={idx} name={sk} type="highPriority" priority={idx + 1} />
              )) || <p className="text-xs text-gray-500">None identified yet.</p>}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Already Mastered Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {roadmap?.skillGaps?.known?.map((sk, idx) => (
                <SkillBadge key={idx} name={sk} type="known" />
              )) || <p className="text-xs text-gray-500">No mastered skills recorded.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
