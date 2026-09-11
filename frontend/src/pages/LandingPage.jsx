import React from 'react';
import { Compass, Sparkles, BrainCircuit, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

export const LandingPage = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Top Header */}
      <header className="h-20 border-b border-gray-800/80 px-6 lg:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-brand-accent p-0.5 shadow-glow-indigo">
            <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-brand-accent animate-spin-slow" />
            </div>
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            Career<span className="text-gradient">Agent.AI</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onLogin}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-glow-indigo transition-all transform hover:scale-105"
          >
            Get Started Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-brand-500/30 text-xs font-semibold text-brand-accent">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>Autonomous Multi-Agent AI System for College Students</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Your Personal AI Agent for <br />
            <span className="text-gradient">Career Roadmap & Skill Mastery</span>
          </h1>

          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Not just a chatbot — an intelligent system of 5 specialized AI agents working together to analyze your skills, identify gaps, build adaptive roadmaps, and recommend real projects tailored to your schedule.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-accent text-white font-bold text-base shadow-glow-indigo hover:shadow-glow-cyan transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <span>Build My Career Roadmap</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="glass-card rounded-3xl p-8 border border-gray-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-accent">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Multi-Agent Intelligence</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Manager Agent coordinates Career, Skill Gap, Roadmap, and Project Agents to synthesize a realistic, conflict-free learning plan.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-gray-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Adaptive Learning Updates</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your roadmap isn't static. Mark topics as completed, and the system dynamically re-optimizes future recommendations.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-gray-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Daily Study Session</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              One-click "What Should I Learn Today?" breaks your available study hours into actionable time-bucketed tasks with full rationale.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-6 text-center text-xs text-gray-500">
        AI Career Roadmap Agent System • Built for College Students
      </footer>
    </div>
  );
};
