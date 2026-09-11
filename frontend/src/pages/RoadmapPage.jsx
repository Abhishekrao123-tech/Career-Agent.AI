import React from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { RoadmapTimeline } from '../components/RoadmapTimeline';
import { Map, Sparkles, BrainCircuit, RefreshCw } from 'lucide-react';

export const RoadmapPage = () => {
  const { roadmap, toggleTopicStatus, generatingRoadmap, triggerGenerateRoadmap } = useRoadmap();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-accent mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Roadmap Agent Output</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Map className="w-8 h-8 text-brand-accent" />
            Personalized Career Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Click on any topic to update status between <span className="text-gray-300">Not Started</span>,{' '}
            <span className="text-brand-accent">In Progress</span>, and{' '}
            <span className="text-emerald-400">Completed</span>. The AI will dynamically recalculate future recommendations.
          </p>
        </div>

        <button
          onClick={triggerGenerateRoadmap}
          disabled={generatingRoadmap}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-glow-indigo transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${generatingRoadmap ? 'animate-spin' : ''}`} />
          <span>{generatingRoadmap ? 'Re-building Roadmap...' : 'Regenerate Roadmap'}</span>
        </button>
      </div>

      {roadmap?.summary && (
        <div className="p-4 rounded-2xl bg-brand-900/30 border border-brand-500/30 text-xs text-brand-accent font-medium leading-relaxed">
          <span className="font-bold text-white">Strategy Summary: </span>
          {roadmap.summary}
        </div>
      )}

      <RoadmapTimeline phases={roadmap?.phases || []} onToggleTopic={toggleTopicStatus} />
    </div>
  );
};
