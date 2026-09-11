import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoadmapProvider, useRoadmap } from './context/RoadmapContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TodayTaskModal } from './components/TodayTaskModal';
import { ChatDrawer } from './components/ChatDrawer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { SkillsPage } from './pages/SkillsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProgressPage } from './pages/ProgressPage';
import { AIChatPage } from './pages/AIChatPage';
import { ProfilePage } from './pages/ProfilePage';

const MainAppContent = () => {
  const { user, loading } = useAuth();
  const { roadmap, loadingProfile } = useRoadmap();

  const [authView, setAuthView] = useState('landing'); // 'landing' | 'login' | 'register' | 'onboarding' | 'dashboard'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTodayModalOpen, setIsTodayModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center space-y-4 flex-col text-white">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-400">Loading AI Career Roadmap System...</p>
      </div>
    );
  }

  // If not logged in, render auth views
  if (!user) {
    if (authView === 'login') {
      return (
        <LoginPage
          onSwitchToRegister={() => setAuthView('register')}
          onSuccess={() => setAuthView('dashboard')}
        />
      );
    }
    if (authView === 'register') {
      return (
        <RegisterPage
          onSwitchToLogin={() => setAuthView('login')}
          onSuccess={() => setAuthView('onboarding')}
        />
      );
    }
    return (
      <LandingPage
        onGetStarted={() => setAuthView('register')}
        onLogin={() => setAuthView('login')}
      />
    );
  }

  // If user has no roadmap generated yet or is in onboarding view
  if (authView === 'onboarding' || (!roadmap && activeTab === 'dashboard')) {
    return (
      <OnboardingPage
        onComplete={() => {
          setAuthView('dashboard');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col">
      <Navbar
        onOpenTodayModal={() => setIsTodayModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              setActiveTab={setActiveTab}
              onOpenTodayModal={() => setIsTodayModalOpen(true)}
            />
          )}
          {activeTab === 'roadmap' && <RoadmapPage />}
          {activeTab === 'skills' && <SkillsPage />}
          {activeTab === 'projects' && <ProjectsPage />}
          {activeTab === 'progress' && <ProgressPage />}
          {activeTab === 'chat' && <AIChatPage />}
          {activeTab === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* Today Study Session Modal */}
      <TodayTaskModal
        isOpen={isTodayModalOpen}
        onClose={() => setIsTodayModalOpen(false)}
      />

      {/* AI Assistant Side Chat Drawer */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RoadmapProvider>
        <MainAppContent />
      </RoadmapProvider>
    </AuthProvider>
  );
}
