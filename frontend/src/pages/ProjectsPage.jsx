import React from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { FolderGit2, Sparkles, RefreshCw } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';

export const ProjectsPage = () => {
  const { projects, profile } = useRoadmap();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Project Recommendation Agent</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <FolderGit2 className="w-8 h-8 text-emerald-400" />
            Recommended Practice Projects
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Projects dynamically matched to your current roadmap level for{' '}
            <span className="text-white font-semibold">{profile?.targetCareer || 'Full Stack Developer'}</span>.
          </p>
        </div>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard key={project._id || idx} project={project} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center glass-panel rounded-3xl border border-gray-800 text-gray-400">
          No project recommendations available yet. Generate your AI career roadmap to receive tailored projects!
        </div>
      )}
    </div>
  );
};
