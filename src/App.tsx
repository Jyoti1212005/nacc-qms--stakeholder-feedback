import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { StakeholderPulseWidget } from './components/StakeholderPulseWidget';

import { RolePermissionGuard } from './components/RolePermissionGuard';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { IqacCommandPage } from './pages/IqacCommandPage';
import { FeedbackFormsPage } from './pages/FeedbackFormsPage';
import { ClosingTheLoopPage } from './pages/ClosingTheLoopPage';
import { GapAnalysisPage } from './pages/GapAnalysisPage';
import { ActionPlansPage } from './pages/ActionPlansPage';
import { EvidencePage } from './pages/EvidencePage';
import { QualityIndicatorsPage } from './pages/QualityIndicatorsPage';
import { AtrPage } from './pages/AtrPage';
import { AiAnalyticsPage } from './pages/AiAnalyticsPage';
import { DepartmentPage } from './pages/DepartmentPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, canAccessPage, currentRoleDefinition } = useAuth();
  const { activePage, toasts, removeToast } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 text-xs">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          <p className="font-medium text-slate-600 text-xs tracking-wide">Loading NAAC-QMS Suite...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const renderActivePage = () => {
    // RBAC Routing Permission Guard
    if (!canAccessPage(activePage)) {
      return <RolePermissionGuard attemptedPage={activePage} />;
    }

    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'admin':
        return <AdminPortalPage />;
      case 'iqac':
        return <IqacCommandPage />;
      case 'feedback':
        return <FeedbackFormsPage />;
      case 'closing-the-loop':
        return <ClosingTheLoopPage />;
      case 'gaps':
        return <GapAnalysisPage />;
      case 'action-plans':
        return <ActionPlansPage />;
      case 'evidence':
        return <EvidencePage />;
      case 'quality-indicators':
        return <QualityIndicatorsPage />;
      case 'atr':
        return <AtrPage />;
      case 'ai-analytics':
        return <AiAnalyticsPage />;
      case 'department':
        return <DepartmentPage />;
      case 'reports':
        return <ReportsPage />;
      case 'audit-logs':
        return <AuditLogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 overflow-x-hidden w-full font-sans">
      <Navbar />

      <div className="flex flex-1 w-full overflow-x-hidden min-w-0">
        <Sidebar />

        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(1px)' }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <GlobalSearchModal />

      {/* Floating Stakeholder Pulse (Micro-Surveys) Widget */}
      <StakeholderPulseWidget />

      {/* Toast Alerts Container */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 space-y-2 sm:max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center justify-between space-x-3 transition-all animate-in slide-in-from-bottom-2 ${
              t.type === 'error'
                ? 'bg-rose-950 text-rose-200 border-l-4 border-l-rose-500'
                : t.type === 'info'
                ? 'bg-[#0a192f] text-white border-l-4 border-l-[#ff7a50]'
                : 'bg-[#0a192f] text-white border-l-4 border-l-[#ffa07a]'
            }`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white/80 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
