import React from 'react';
import {
  LayoutDashboard,
  Map,
  BrainCircuit,
  FolderGit2,
  TrendingUp,
  MessageSquareCode,
  UserCheck
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'skills', label: 'Skills Assessment', icon: BrainCircuit },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'progress', label: 'Progress Tracking', icon: TrendingUp },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquareCode },
    { id: 'profile', label: 'Student Profile', icon: UserCheck }
  ];

  return (
    <aside className="w-64 bg-dark-bg/60 border-r border-gray-800 shrink-0 hidden md:block py-6 px-4 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-1.5">
        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow-indigo font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-hover'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Multi-Agent System Badge */}
      <div className="p-3.5 rounded-2xl glass-panel border border-brand-500/20 text-xs text-gray-400 space-y-1.5">
        <div className="flex items-center space-x-2 font-semibold text-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Multi-Agent Engine</span>
        </div>
        <p className="text-[11px] leading-relaxed text-gray-400">
          5 Autonomous AI Agents coordinating target career, skill gaps & adaptive roadmap.
        </p>
      </div>
    </aside>
  );
};
