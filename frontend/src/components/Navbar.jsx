import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRoadmap } from '../context/RoadmapContext';
import { Sparkles, Bot, LogOut, User as UserIcon, Calendar, Compass } from 'lucide-react';

export const Navbar = ({ onOpenTodayModal, onToggleChat, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const { profile } = useRoadmap();

  return (
    <header className="h-16 border-b border-gray-800 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-brand-accent p-0.5 shadow-glow-indigo">
          <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
            <Compass className="w-5 h-5 text-brand-accent animate-spin-slow" />
          </div>
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
            Career<span className="text-gradient">Agent.AI</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium hidden sm:block">
            {profile?.targetCareer ? `Target: ${profile.targetCareer}` : 'Multi-Agent Career Guidance System'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Today Study Plan Action Button */}
        <button
          onClick={onOpenTodayModal}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-glow-indigo transition-all transform hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span className="hidden xs:inline">What to Learn Today?</span>
          <span className="xs:hidden">Today</span>
        </button>

        {/* AI Assistant Chat Trigger */}
        <button
          onClick={onToggleChat}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-dark-card border border-gray-700 hover:border-brand-500 text-gray-200 text-xs sm:text-sm font-medium transition-all"
        >
          <Bot className="w-4 h-4 text-brand-accent" />
          <span className="hidden sm:inline">AI Mentor</span>
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-gray-800">
          <div
            onClick={() => setActiveTab('profile')}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity"
            title="Edit Profile"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
