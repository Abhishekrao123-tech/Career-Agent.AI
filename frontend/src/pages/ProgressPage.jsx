import React from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { TrendingUp, CheckCircle2, Award, Clock, Sparkles } from 'lucide-react';

export const ProgressPage = () => {
  const { progressStats, roadmap, toggleTopicStatus } = useRoadmap();
  const overallPct = progressStats?.overallPercentage || 0;

  // Flatten all topics across phases
  const allTopics = [];
  roadmap?.phases?.forEach((phase) => {
    phase.topics?.forEach((topic) => {
      allTopics.push({ ...topic, phaseTitle: phase.title, phaseNumber: phase.phase });
    });
  });

  const completedTopics = allTopics.filter((t) => t.status === 'Completed');
  const inProgressTopics = allTopics.filter((t) => t.status === 'In Progress');
  const notStartedTopics = allTopics.filter((t) => t.status !== 'Completed' && t.status !== 'In Progress');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-gray-800 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-accent mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>Real-time Learning Metrics</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-brand-accent" />
          Progress & Milestone Analytics
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Track your overall roadmap completion percentage, topic status, and milestone achievements.
        </p>
      </div>

      {/* Main Stats Card */}
      <div className="glass-card rounded-3xl p-8 border border-brand-500/30 space-y-6 shadow-glow-indigo">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall Roadmap Progress</span>
            <div className="text-5xl font-extrabold text-white mt-1">{overallPct}%</div>
          </div>
          <div className="flex items-center space-x-6 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">{completedTopics.length}</div>
              <div className="text-[11px] text-gray-400 font-medium">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-accent">{inProgressTopics.length}</div>
              <div className="text-[11px] text-gray-400 font-medium">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">{notStartedTopics.length}</div>
              <div className="text-[11px] text-gray-400 font-medium">Remaining</div>
            </div>
          </div>
        </div>

        <div className="w-full bg-dark-bg rounded-full h-4 border border-gray-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400 h-full transition-all duration-700 rounded-full"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* Topic Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          Topic Milestone Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allTopics.map((topic, idx) => (
            <div
              key={idx}
              onClick={() => {
                const nextStatus =
                  topic.status === 'Completed'
                    ? 'Not Started'
                    : topic.status === 'In Progress'
                    ? 'Completed'
                    : 'In Progress';
                toggleTopicStatus(topic.name, nextStatus);
              }}
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                topic.status === 'Completed'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : topic.status === 'In Progress'
                  ? 'bg-brand-500/10 border-brand-500/40 text-brand-accent'
                  : 'bg-dark-card border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                {topic.status === 'Completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-500 shrink-0" />
                )}
                <div>
                  <h4 className="font-bold text-sm text-white">{topic.name}</h4>
                  <p className="text-[11px] text-gray-400">Phase {topic.phaseNumber}: {topic.phaseTitle}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase ${
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
  );
};
