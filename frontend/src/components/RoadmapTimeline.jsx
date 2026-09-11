import React from 'react';
import { CheckCircle2, Circle, Clock, Target, Rocket, Award } from 'lucide-react';

export const RoadmapTimeline = ({ phases = [], onToggleTopic }) => {
  if (!phases || phases.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border border-gray-800 text-gray-400">
        No roadmap generated yet. Click "Generate Career Roadmap" to create your adaptive plan.
      </div>
    );
  }

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-indigo-500/40 before:to-gray-800">
      {phases.map((phaseItem, pIdx) => {
        const isPhaseComplete = phaseItem.topics.every((t) => t.status === 'Completed');
        const phaseCompletedCount = phaseItem.topics.filter((t) => t.status === 'Completed').length;
        const phaseTotal = phaseItem.topics.length;
        const pct = phaseTotal > 0 ? Math.round((phaseCompletedCount / phaseTotal) * 100) : 0;

        return (
          <div key={pIdx} className="relative pl-14 group">
            {/* Timeline Dot Icon */}
            <div
              className={`absolute left-0 top-1 w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                isPhaseComplete
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-glow-emerald'
                  : 'bg-dark-card border-brand-500/40 text-brand-accent shadow-glow-indigo'
              }`}
            >
              {isPhaseComplete ? (
                <Award className="w-6 h-6" />
              ) : (
                <span className="font-extrabold text-sm text-brand-accent">P{phaseItem.phase || pIdx + 1}</span>
              )}
            </div>

            {/* Phase Card Container */}
            <div className="glass-card rounded-2xl p-6 border border-gray-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-800/80 pb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-accent">
                      Phase {phaseItem.phase || pIdx + 1}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {phaseItem.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{phaseItem.title}</h3>
                </div>

                {/* Progress bar for phase */}
                <div className="w-full md:w-48 bg-dark-bg rounded-full h-2.5 border border-gray-800 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                  <div className="text-[10px] text-gray-400 text-right mt-1 font-semibold">
                    {phaseCompletedCount}/{phaseTotal} Topics ({pct}%)
                  </div>
                </div>
              </div>

              {/* Topics Grid with Interactive Toggle */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Topics to Master (Click to change status)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {phaseItem.topics.map((t, tIdx) => {
                    const status = t.status || 'Not Started';
                    return (
                      <div
                        key={tIdx}
                        onClick={() => {
                          const nextStatus =
                            status === 'Not Started'
                              ? 'In Progress'
                              : status === 'In Progress'
                              ? 'Completed'
                              : 'Not Started';
                          onToggleTopic(t.name, nextStatus);
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          status === 'Completed'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                            : status === 'In Progress'
                            ? 'bg-brand-500/10 border-brand-500/40 text-brand-accent hover:bg-brand-500/20'
                            : 'bg-dark-bg/60 border-gray-800 text-gray-300 hover:border-gray-700 hover:bg-dark-hover'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {status === 'Completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : status === 'In Progress' ? (
                            <Clock className="w-5 h-5 text-brand-accent animate-spin-slow shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-500 shrink-0" />
                          )}
                          <span className="font-medium text-sm">{t.name}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : status === 'In Progress'
                              ? 'bg-brand-500/20 text-brand-accent'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Goals & Practice Activities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                {phaseItem.learningGoals && phaseItem.learningGoals.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-dark-bg/40 border border-gray-800">
                    <span className="font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-brand-accent" />
                      Learning Goals
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-gray-400">
                      {phaseItem.learningGoals.map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {phaseItem.practiceActivities && phaseItem.practiceActivities.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-dark-bg/40 border border-gray-800">
                    <span className="font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                      <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                      Practice Activities
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-gray-400">
                      {phaseItem.practiceActivities.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {phaseItem.completionCriteria && (
                <div className="text-xs text-gray-400 bg-brand-500/5 border border-brand-500/20 p-2.5 rounded-xl">
                  <span className="font-bold text-gray-300">Phase Completion Criteria: </span>
                  {phaseItem.completionCriteria}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
