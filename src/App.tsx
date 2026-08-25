import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { ProfileModal } from './components/ProfileModal';
import { InviteModal } from './components/InviteModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { UserProfile, Project } from './types';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AIDreamTeamPage } from './pages/AIDreamTeamPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ProfilePage } from './pages/ProfilePage';

import './index.css';

function MainApp() {
  const { isAuthenticated } = useApp();

  // Simple client-side router
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || window.location.pathname || '/';
  });

  // Global Modals State
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [inviteCandidate, setInviteCandidate] = useState<UserProfile | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Sync hash routing for seamless GitHub Pages & Vercel deployment
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matching
  const renderCurrentPage = () => {
    // 1. Projects AI Team Lab: /projects/:id/ai-team
    if (currentPath.startsWith('/projects/') && currentPath.endsWith('/ai-team')) {
      const parts = currentPath.split('/');
      const projId = parts[2];
      return (
        <AIDreamTeamPage
          projectId={projId}
          navigate={navigate}
          openProfileModal={(p) => setSelectedProfile(p)}
          openInviteModal={(p) => setInviteCandidate(p)}
        />
      );
    }

    // 2. Project Workspace: /workspace/:projectId
    if (currentPath.startsWith('/workspace/')) {
      const projId = currentPath.replace('/workspace/', '');
      return (
        <WorkspacePage
          projectId={projId}
          navigate={navigate}
          openProfileModal={(p) => setSelectedProfile(p)}
        />
      );
    }

    // 3. Project Detail: /projects/:id
    if (currentPath.startsWith('/projects/') && currentPath !== '/projects') {
      const projId = currentPath.replace('/projects/', '');
      return (
        <ProjectDetailPage
          projectId={projId}
          navigate={navigate}
          openProfileModal={(p) => setSelectedProfile(p)}
        />
      );
    }

    // 4. Exact Route Mappings
    switch (currentPath) {
      case '/auth':
        return <AuthPage navigate={navigate} />;
      case '/onboarding':
        return <OnboardingPage navigate={navigate} />;
      case '/dashboard':
        return (
          <DashboardPage
            navigate={navigate}
            openProfileModal={(p) => setSelectedProfile(p)}
          />
        );
      case '/community':
        return (
          <CommunityPage
            openProfileModal={(p) => setSelectedProfile(p)}
            openInviteModal={(p) => setInviteCandidate(p)}
          />
        );
      case '/projects':
        return (
          <ProjectsPage
            navigate={navigate}
            openCreateModal={() => setIsCreateProjectOpen(true)}
          />
        );
      case '/profile':
        return <ProfilePage navigate={navigate} />;
      case '/':
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Navigation */}
      <Navbar currentRoute={currentPath} navigate={navigate} />

      {/* Main Page Area */}
      <main style={{ flex: 1 }}>
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ProfileModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onInvite={(p) => {
          setSelectedProfile(null);
          setInviteCandidate(p);
        }}
      />

      <InviteModal
        candidate={inviteCandidate}
        onClose={() => setInviteCandidate(null)}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreated={(newProj) => navigate(`/projects/${newProj.id}`)}
      />

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
