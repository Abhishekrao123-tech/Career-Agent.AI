import React from 'react';
import { Code, CheckCircle, Lightbulb, Sparkles } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const { title, difficulty, technologies = [], requiredSkills = [], features = [], whyUseful } = project;

  const difficultyColors = {
    Beginner: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    Intermediate: 'bg-brand-500/10 border-brand-500/30 text-brand-accent',
    Advanced: 'bg-purple-500/10 border-purple-500/30 text-purple-300'
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-gray-800 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              difficultyColors[difficulty] || difficultyColors.Intermediate
            }`}
          >
            {difficulty}
          </span>
          <span className="text-xs text-gray-500 font-medium">Recommended Project</span>
        </div>

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-brand-accent" />
          {title}
        </h3>

        {whyUseful && (
          <p className="text-xs text-gray-300 bg-brand-500/5 border border-brand-500/10 p-3 rounded-xl flex gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{whyUseful}</span>
          </p>
        )}

        {/* Features to Build */}
        {features.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Key Features to Implement
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-300">
              {features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tech Stack Badges */}
      <div className="pt-3 border-t border-gray-800">
        <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Suggested Stack
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {technologies.map((tech, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-dark-bg border border-gray-700 text-gray-300 font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
