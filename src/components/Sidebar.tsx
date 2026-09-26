import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Award,
  ClipboardList,
  AlertTriangle,
  CheckSquare,
  FileCheck2,
  Sliders,
  TrendingUp,
  BrainCircuit,
  Building2,
  FileText,
  ShieldAlert,
  Settings,
  Lock,
  ShieldCheck,
  ChevronRight,
  Info,
  User,
  IdCard,
  RotateCcw,
  X,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { NavigationPage } from '../types';
import { StakeholderProfile } from './StakeholderProfile';

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    isMobileNavOpen,
    setIsMobileNavOpen,
    selectedAcademicYear,
    setSelectedAcademicYear,
    academicYears,
  } = useApp();
  const { currentUser, currentRoleDefinition, canAccessPage } = useAuth();
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Institutional Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'admin',
      label: 'Admin Portal',
      icon: ShieldCheck,
      badge: 'Root',
      badgeColor: 'bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa]',
    },
    {
      id: 'iqac',
      label: 'IQAC Command Center',
      icon: Award,
      badge: 'Index 84.6',
      badgeColor: 'bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa]',
    },
    {
      id: 'feedback',
      label: 'Stakeholder Feedback',
      icon: ClipboardList,
      badge: '14 Forms',
      badgeColor: 'bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa]',
    },
    {
      id: 'closing-the-loop',
      label: 'Closing the Loop (ATR)',
      icon: RotateCcw,
      badge: 'Public Tracker',
      badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    },
    {
      id: 'gaps',
      label: 'Quality Gap Analysis',
      icon: AlertTriangle,
      badge: '5 Gaps',
      badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200',
    },
    {
      id: 'action-plans',
      label: 'CAPA & Action Plans',
      icon: CheckSquare,
      badge: '3 Active',
      badgeColor: 'bg-purple-50 text-purple-800 border border-purple-200',
    },
    {
      id: 'evidence',
      label: 'Evidence Repository',
      icon: FileCheck2,
    },
    {
      id: 'quality-indicators',
      label: 'Quality Indicators (7 Criteria)',
      icon: Sliders,
    },
    {
      id: 'atr',
      label: 'Action Taken Report (ATR)',
      icon: TrendingUp,
      badge: '+1.37 Δ',
      badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    },
    {
      id: 'ai-analytics',
      label: 'Qualitative Analytics',
      icon: BrainCircuit,
      badge: 'NLP',
      badgeColor: 'bg-blue-50 text-blue-800 border border-blue-200',
    },
    {
      id: 'department',
      label: 'Department Command',
      icon: Building2,
    },
    {
      id: 'reports',
      label: 'Report Generation',
      icon: FileText,
    },
    {
      id: 'audit-logs',
      label: 'Audit Trail',
      icon: ShieldAlert,
    },
    {
      id: 'settings',
      label: 'Settings & Weights',
      icon: Settings,
    },
  ];

  const handlePageSelect = (pageId: NavigationPage) => {
    setActivePage(pageId);
    if (isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Active Persona Header Box */}
      <div className="p-3 border-b border-[#eddcd2] bg-[#fffaf5] shrink-0">
        <motion.div
          whileHover={{ y: -2, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex items-center justify-between"
        >
          <div
            onClick={() => setShowProfileModal(true)}
            className="flex items-center space-x-2.5 cursor-pointer group py-1"
            title="Click to view 3D Stakeholder Credential"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0a192f] text-[#ffa07a] group-hover:bg-[#ff7a50] group-hover:text-white transition-colors flex items-center justify-center font-black text-xs shadow-xs shrink-0">
              {currentUser?.fullName.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-[#0a192f] group-hover:text-[#ff7a50] transition-colors truncate max-w-[130px]">
                {currentUser?.fullName || 'Stakeholder Guest'}
              </p>
              <p className="text-[10px] text-[#c2410c] font-bold truncate">
                {currentRoleDefinition.title.split('(')[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => setShowProfileModal(true)}
              title="Open 3D Stakeholder Profile Card"
              aria-label="View Stakeholder Profile"
              className="p-2 min-w-[36px] min-h-[36px] rounded-lg text-slate-400 hover:text-[#c2410c] hover:bg-[#fff0e6] transition-colors cursor-pointer flex items-center justify-center"
            >
              <IdCard className="w-4 h-4 text-[#ff7a50]" />
            </button>
            <button
              onClick={() => setShowRoleInfo(!showRoleInfo)}
              title="View Role Definition & Routing Permissions"
              aria-label="Toggle role info"
              className="p-2 min-w-[36px] min-h-[36px] rounded-lg text-slate-400 hover:text-[#c2410c] hover:bg-[#fff0e6] transition-colors cursor-pointer flex items-center justify-center"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Mobile Academic Year Selector inside Drawer */}
        {isMobile && (
          <div className="mt-2.5 pt-2 border-t border-[#f3e8e0] flex items-center justify-between text-xs text-slate-700 bg-white/60 p-2 rounded-xl border border-[#fed7aa]">
            <div className="flex items-center space-x-1.5 font-bold text-[#0a192f]">
              <Calendar className="w-3.5 h-3.5 text-[#ff7a50]" />
              <span>Academic Year:</span>
            </div>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              aria-label="Academic Year in drawer"
              className="bg-[#0a192f] text-white text-xs font-bold px-2 py-1 rounded-lg focus:outline-hidden cursor-pointer"
            >
              {academicYears.map((ay) => (
                <option key={ay.id} value={ay.id}>
                  {ay.name} {ay.isCurrent ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Expandable Role Permissions Drawer with smooth reveal */}
        <AnimatePresence>
          {showRoleInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="mt-2.5 pt-2.5 border-t border-[#f3e8e0] text-[11px]"
            >
              <span className={`inline-block px-2 py-0.5 text-[9px] font-black rounded border mb-1.5 ${currentRoleDefinition.badgeColor}`}>
                {currentRoleDefinition.category}
              </span>
              <p className="text-slate-600 leading-snug text-[10px]">
                {currentRoleDefinition.description}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>Authorized Modules:</span>
                <span className="text-[#c2410c]">{currentRoleDefinition.allowedPages.length} of 13</span>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="w-full mt-2.5 py-2 px-2 min-h-[40px] rounded-lg text-[10px] font-bold bg-white hover:bg-[#fff0e6] text-[#0a192f] border border-[#fed7aa] flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-2xs"
              >
                <IdCard className="w-3.5 h-3.5 text-[#ff7a50]" />
                <span>View 3D Stakeholder Card</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links with Floating Active Pill and Touch Target >= 44px */}
      <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold text-[#c2410c] uppercase tracking-wider flex items-center justify-between">
          <span>Continuous Quality Assurance</span>
        </div>

        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const isAllowed = canAccessPage(item.id);
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => handlePageSelect(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              className={`relative w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-colors group cursor-pointer ${
                isActive
                  ? 'text-white font-bold'
                  : isAllowed
                  ? 'text-slate-600 hover:text-[#0a192f]'
                  : 'text-slate-400 opacity-75'
              }`}
            >
              {/* Sliding Active Pill Background via Framer Motion layoutId */}
              {isActive && (
                <motion.div
                  layoutId={isMobile ? 'activeNavPillMobile' : 'activeNavPill'}
                  className="absolute inset-0 bg-[#0a192f] rounded-xl shadow-md shadow-[#0a192f]/20 border-l-4 border-l-[#ff7a50]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}

              {/* Foreground Content */}
              <div className="relative z-10 flex items-center space-x-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#ffa07a]'
                      : isAllowed
                      ? 'text-slate-400 group-hover:text-[#ff7a50]'
                      : 'text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="relative z-10 flex items-center space-x-1 shrink-0">
                {!isAllowed && (
                  <Lock className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500" />
                )}
                {item.badge && isAllowed && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold tracking-tight ${
                      isActive ? 'bg-white/20 text-[#fed7aa]' : item.badgeColor || 'bg-[#fff0e6] text-[#c2410c]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer Info Box: Soft Peach & Navy Card with 3D Tilt Hover */}
      <div className="p-3 border-t border-[#eddcd2] bg-[#fffcf9] shrink-0">
        <motion.div
          whileHover={{ y: -3, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-[#fffaf5] rounded-xl p-3 border border-[#fddbc7] shadow-xs cursor-default"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#c2410c] uppercase tracking-wider">NAAC Cycle 3</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
              On Track
            </span>
          </div>
          <p className="text-[11px] text-[#0a192f] mt-1.5 font-bold">Continuous Quality Loop</p>
          <div className="w-full bg-[#fed7aa]/50 h-1.5 rounded-full mt-2 overflow-hidden border border-[#fcd5be]">
            <div className="bg-linear-to-r from-[#ff7a50] to-[#f97316] h-full w-[84%]" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
            <span>Cycle Completeness</span>
            <span className="font-bold text-[#c2410c]">84%</span>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (>= 1024px) */}
      <aside className="w-64 bg-white text-[#0b1a30] shrink-0 hidden lg:flex flex-col border-r border-[#eddcd2] min-h-[calc(100vh-4rem)] shadow-xs">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Slide-In Navigation Drawer (< 1024px) */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-in Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-72 sm:w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 border-r border-[#eddcd2]"
            >
              {/* Drawer Top Header with Branding & Close */}
              <div className="h-16 bg-[#0a192f] px-4 flex items-center justify-between text-white border-b border-[#1b3456] shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#0f2d59] to-[#1e3a8a] border border-[#3b5e8c] flex items-center justify-center text-[#ff9d7a] font-bold text-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-white text-sm">NAAC-QMS Navigation</span>
                    <p className="text-[10px] text-blue-200">Quality Framework</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  aria-label="Close mobile menu"
                  className="p-2 min-w-[44px] min-h-[44px] rounded-xl hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto">
                {renderSidebarContent(true)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3D Stakeholder Profile Credential Modal */}
      <StakeholderProfile
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};
