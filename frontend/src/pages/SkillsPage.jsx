import React from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { BrainCircuit, CheckCircle2, AlertCircle, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { SkillBadge } from '../components/SkillBadge';

export const SkillsPage = () => {
  const { profile, roadmap, toggleTopicStatus } = useRoadmap();
  const gaps = roadmap?.skillGaps || {};

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-gray-800 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
          <span>Skill Gap Agent Diagnostics</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-purple-400" />
          Skill Gap & Category Analysis
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Detailed evaluation comparing your existing knowledge against required industry skills for{' '}
          <span className="text-white font-semibold">{profile?.targetCareer || 'Full Stack Developer'}</span>.
        </p>
      </div>

      {gaps.gapSummary && (
        <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
          <span className="font-bold text-white">Diagnostic Overview: </span>
          {gaps.gapSummary}
        </div>
      )}

      {/* Grid of Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High Priority Gaps */}
        <div className="glass-card rounded-3xl p-6 border border-purple-500/30 space-y-4 shadow-glow-indigo">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-400" />
              High Priority Skills to Learn
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
              {gaps.highPriority?.length || 0} Critical
            </span>
          </div>
          <p className="text-xs text-gray-400">
            These prerequisites must be mastered early in your learning plan:
          </p>
          <div className="flex flex-wrap gap-2">
            {gaps.highPriority?.map((sk, idx) => (
              <SkillBadge
                key={idx}
                name={sk}
                type="highPriority"
                priority={idx + 1}
                onClick={() => toggleTopicStatus(sk, 'In Progress')}
              />
            )) || <p className="text-xs text-gray-500">None</p>}
          </div>
        </div>

        {/* Mastered Skills */}
        <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Mastered & Known Skills
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              {gaps.known?.length || 0} Known
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Skills you already possess. The AI skips repeating these in basic phases:
          </p>
          <div className="flex flex-wrap gap-2">
            {gaps.known?.map((sk, idx) => (
              <SkillBadge key={idx} name={sk} type="known" />
            )) || <p className="text-xs text-gray-500">None</p>}
          </div>
        </div>

        {/* Partially Known */}
        <div className="glass-card rounded-3xl p-6 border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Partially Known / Review Skills
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
              {gaps.partiallyKnown?.length || 0} Partial
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {gaps.partiallyKnown?.map((sk, idx) => (
              <SkillBadge key={idx} name={sk} type="partiallyKnown" />
            )) || <p className="text-xs text-gray-500">No partial skills listed.</p>}
          </div>
        </div>

        {/* Low Priority / Secondary */}
        <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
              Secondary / Future Skill Gaps
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-400">
              {gaps.lowPriority?.length || 0} Secondary
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {gaps.lowPriority?.map((sk, idx) => (
              <SkillBadge key={idx} name={sk} type="lowPriority" />
            )) || <p className="text-xs text-gray-500">None</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
