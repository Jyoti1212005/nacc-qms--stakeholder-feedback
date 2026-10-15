import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Calendar,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  ExternalLink,
  ClipboardList,
  User,
  IdCard,
  ShieldCheck,
  CheckSquare,
  Zap,
  Radio,
  ArrowRight,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { StakeholderProfile } from './StakeholderProfile';
import { PublicAtrPortalModal } from './PublicAtrPortalModal';
import { RoleMatrixModal } from './RoleMatrixModal';

export const Navbar: React.FC = () => {
  const { currentUser, logout, demoAccounts, demoLogin } = useAuth();
  const {
    selectedAcademicYear,
    setSelectedAcademicYear,
    academicYears,
    setIsSearchOpen,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    setActivePage,
    simulateNotificationEvent,
    latestRealtimeAlert,
    clearLatestRealtimeAlert,
    isPolling,
    isMobileNavOpen,
    toggleMobileNav,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showAllNavbarRoles, setShowAllNavbarRoles] = useState(false);
  const [showRoleMatrixNavbar, setShowRoleMatrixNavbar] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPublicAtrModal, setShowPublicAtrModal] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'action' | 'survey'>('all');
  const [isSimulating, setIsSimulating] = useState<string | null>(null);

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'IQAC_ADMIN':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'PRINCIPAL':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'FACULTY':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'STUDENT':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'NON_TEACHING':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'TECHNICAL_STAFF':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <header className="h-16 bg-[#0a192f] border-b border-[#1b3456] sticky top-0 z-30 px-3 sm:px-4 lg:px-6 flex items-center justify-between shadow-lg text-white">
      {/* Left: Hamburger (mobile/tablet < lg) & Branding & Academic Year Selector */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Animated Hamburger Button for < lg screens */}
        <button
          onClick={toggleMobileNav}
          aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="lg:hidden p-2 min-w-[44px] min-h-[44px] rounded-xl bg-[#0f2444] hover:bg-[#16335a] text-[#ffa07a] hover:text-white border border-[#234573] flex items-center justify-center transition-all cursor-pointer shadow-xs"
        >
          {isMobileNavOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#0f2d59] to-[#1e3a8a] border border-[#3b5e8c] flex items-center justify-center text-[#ff9d7a] shadow-md font-bold text-sm tracking-wider shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-white tracking-tight text-sm sm:text-base">NAAC-QMS</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-extrabold bg-[#fff0e6] text-[#c2410c] rounded border border-[#fed7aa]">
                QMS 2026
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-blue-200/80 font-medium hidden md:block">
              Stakeholder Feedback & Continuous Quality Assurance
            </p>
          </div>
        </div>

        {/* Academic Year Dropdown in Navy with Peach font accent */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-[#0f2444] border border-[#234573] rounded-xl px-2.5 py-1.5 text-xs text-blue-100 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#ffa07a]" />
          <span className="text-[#fed7aa] font-semibold">AY:</span>
          <select
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            aria-label="Select Academic Year"
            className="bg-transparent font-bold text-white focus:outline-hidden cursor-pointer"
          >
            {academicYears.map((ay) => (
              <option key={ay.id} value={ay.id} className="bg-[#0a192f] text-white">
                {ay.name} {ay.isCurrent ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Middle: Global Search bar trigger */}
      <div className="flex-1 max-w-md mx-3 lg:mx-4 hidden md:block">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs text-blue-100/80 bg-[#0d203b] hover:bg-[#122b4d] border border-[#234573] rounded-xl transition-colors cursor-pointer group shadow-inner"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-[#ffa07a] group-hover:text-white" />
            <span className="text-blue-200/70 truncate">Search surveys, indicators, CAPAs, evidence...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-[#071324] border border-[#234573] rounded text-[#fed7aa] font-mono shrink-0 ml-2">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick actions, Role Switcher, Notifications & Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5">
        {/* Mobile Search Button (< md) */}
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label="Open search dialog"
          className="md:hidden p-2 min-w-[44px] min-h-[44px] rounded-xl text-blue-200 hover:text-white hover:bg-[#0f2444] border border-transparent hover:border-[#234573] flex items-center justify-center transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#ffa07a]" />
        </button>

        <button
          onClick={() => setActivePage('admin')}
          className="hidden md:flex items-center space-x-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-[#0f2444] hover:bg-[#16335a] text-[#fed7aa] border border-[#ff7a50]/40 transition-all cursor-pointer shadow-xs hover:border-[#ff7a50]"
          title="Open Central Admin Portal & View All Form Results"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#ff7a50]" />
          <span>Admin Portal</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#ff7a50] text-[#0a192f]">
            14 Forms
          </span>
        </button>

        <button
          onClick={() => setShowPublicAtrModal(true)}
          className="hidden xl:flex items-center space-x-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-[#0d223f] hover:bg-[#15345d] text-[#ffa07a] border border-[#ff7a50]/40 transition-all cursor-pointer shadow-xs hover:border-[#ff7a50]"
          title="Open Public ATR Transparency Portal (NAAC Metric 1.4.2)"
        >
          <Award className="w-3.5 h-3.5 text-[#ff7a50]" />
          <span>Public ATR (1.4.2)</span>
        </button>

        <button
          onClick={() => setActivePage('feedback')}
          className="hidden lg:flex items-center space-x-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-white shadow-md shadow-orange-950/20 transition-all cursor-pointer"
          title="Take Stakeholder Survey"
        >
          <ClipboardList className="w-3.5 h-3.5 text-white" />
          <span>Surveys & Feedback</span>
        </button>

        {/* Quick Demo Switcher - Compact with View More */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDemoMenu(!showDemoMenu);
              setShowNotifMenu(false);
              setShowUserMenu(false);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-2 min-h-[44px] rounded-xl text-xs font-semibold bg-[#0f2444] hover:bg-[#16335a] text-slate-100 border border-slate-700/70 transition-colors cursor-pointer"
            title="Switch Demo Role"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline">Role Switcher</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {showDemoMenu && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Institutional Personas</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Quick switch active test identity:</p>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full">
                  {showAllNavbarRoles ? `${demoAccounts.length} Roles` : 'Top 5'}
                </span>
              </div>

              {/* Account list - compact top 5 or expanded */}
              <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-50">
                {(showAllNavbarRoles ? demoAccounts : demoAccounts.slice(0, 5)).map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      demoLogin(acc.email);
                      setShowDemoMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 min-h-[40px] text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      currentUser?.email === acc.email ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-800'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold truncate text-xs">{acc.fullName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{acc.department}</p>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border shrink-0 ${getRoleBadgeColor(acc.role)}`}>
                      {acc.role.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dropdown Action Bar: View More Personas & View Governance Matrix */}
              <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/60 flex flex-col space-y-1.5 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowAllNavbarRoles(!showAllNavbarRoles)}
                  className="w-full text-center py-1.5 px-2 rounded-lg text-[11px] font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  {showAllNavbarRoles ? 'Show Fewer Personas ↑' : `View More Personas (${demoAccounts.length - 5} more) ↓`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleMatrixNavbar(true);
                    setShowDemoMenu(false);
                  }}
                  className="w-full text-center py-1.5 px-2 rounded-lg text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer flex items-center justify-center space-x-1"
                >
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>Role Governance & Matrix Details →</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown with Pulsing Peach Dot */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowDemoMenu(false);
              setShowUserMenu(false);
              if (latestRealtimeAlert) {
                clearLatestRealtimeAlert();
              }
            }}
            aria-label="Notifications"
            className={`relative p-2 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              showNotifMenu
                ? 'bg-[#16335a] text-white shadow-inner'
                : 'text-blue-200 hover:text-white hover:bg-[#0f2444]'
            }`}
            title="Notifications & Real-time Alerts"
          >
            <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-[#fed7aa]' : ''}`} />

            {/* Pulsing Peach Notification Dot */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7a50] opacity-80 pointer-events-none" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-linear-to-br from-[#ff7a50] to-[#f97316] border-2 border-[#0a192f] text-[9px] font-black text-[#0a192f] items-center justify-center shadow-md shadow-orange-500/50">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-104 bg-white rounded-2xl shadow-2xl border-2 border-[#fed7aa] py-2.5 z-50 text-[#0b1a30] animate-in fade-in zoom-in-95 duration-100">
              {/* Header */}
              <div className="px-4 py-2 border-b border-[#f3e8e0] bg-[#fffaf5] rounded-t-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-black text-[#0a192f] uppercase tracking-wider">
                      Real-time Alerts & Notifications
                    </h4>
                    {/* Live polling indicator */}
                    <span className="flex items-center space-x-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live (4s)</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''} • Instant sync active
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-[#c2410c] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Quick Simulation Bar for Testing Live Polling & Alerting */}
              <div className="px-3.5 py-2 bg-[#fff2eb] border-b border-[#fed7aa]/60 flex items-center justify-between text-xs">
                <span className="text-[10px] font-extrabold text-[#9a3412] uppercase tracking-wider flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-[#ff7a50]" />
                  <span>Test Real-Time Alert:</span>
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    disabled={!!isSimulating}
                    onClick={async () => {
                      setIsSimulating('action');
                      await simulateNotificationEvent('ACTION_ASSIGNED');
                      setIsSimulating(null);
                    }}
                    className="px-2 py-1 rounded-lg bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] font-black text-[10px] transition-all flex items-center space-x-1 shadow-2xs cursor-pointer"
                    title="Simulate action plan assignment to active user"
                  >
                    <CheckSquare className="w-3 h-3 text-[#ff7a50]" />
                    <span>Assign CAPA</span>
                  </button>

                  <button
                    disabled={!!isSimulating}
                    onClick={async () => {
                      setIsSimulating('survey');
                      await simulateNotificationEvent('SURVEY_PUBLISHED');
                      setIsSimulating(null);
                    }}
                    className="px-2 py-1 rounded-lg bg-[#ff7a50] hover:bg-[#ea580c] text-[#0a192f] font-black text-[10px] transition-all flex items-center space-x-1 shadow-2xs cursor-pointer"
                    title="Simulate publishing of a new institutional survey"
                  >
                    <ClipboardList className="w-3 h-3 text-[#0a192f]" />
                    <span>Publish Survey</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center space-x-1 bg-slate-50/70 text-[11px]">
                {[
                  { id: 'all', label: `All (${notifications.length})` },
                  { id: 'unread', label: `Unread (${unreadCount})` },
                  { id: 'action', label: 'Action Plans' },
                  { id: 'survey', label: 'Surveys' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setNotifFilter(tab.id as any)}
                    className={`px-2.5 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                      notifFilter === tab.id
                        ? 'bg-[#0a192f] text-[#ffa07a]'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#f5ece5]">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 px-4">
                    <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">No notifications at present.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Use the test buttons above to simulate incoming alerts.
                    </p>
                  </div>
                ) : (
                  notifications
                    .filter((n) => {
                      if (notifFilter === 'unread') return !n.isRead;
                      if (notifFilter === 'action')
                        return (
                          n.type === 'ACTION_ASSIGNED' ||
                          n.title.toLowerCase().includes('action') ||
                          n.title.toLowerCase().includes('capa')
                        );
                      if (notifFilter === 'survey')
                        return (
                          n.type === 'SURVEY_PUBLISHED' ||
                          n.title.toLowerCase().includes('survey')
                        );
                      return true;
                    })
                    .map((n) => {
                      const isActionPlan =
                        n.type === 'ACTION_ASSIGNED' ||
                        n.title.toLowerCase().includes('action') ||
                        n.title.toLowerCase().includes('capa');
                      const isSurvey =
                        n.type === 'SURVEY_PUBLISHED' ||
                        n.title.toLowerCase().includes('survey');

                      return (
                        <div
                          key={n.id}
                          className={`p-3 text-xs transition-colors hover:bg-[#fff8f2] ${
                            !n.isRead ? 'bg-[#fff7f0] border-l-3 border-[#ff7a50]' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-2.5">
                            {/* Icon badge */}
                            <div
                              className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold mt-0.5 shadow-2xs ${
                                isActionPlan
                                  ? 'bg-[#0a192f] text-[#ff7a50]'
                                  : isSurvey
                                  ? 'bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa]'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {isActionPlan ? (
                                <CheckSquare className="w-4 h-4" />
                              ) : isSurvey ? (
                                <ClipboardList className="w-4 h-4" />
                              ) : (
                                <Bell className="w-4 h-4" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                                    isActionPlan
                                      ? 'bg-purple-100 text-purple-800'
                                      : isSurvey
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {isActionPlan
                                    ? 'Action Plan Assigned'
                                    : isSurvey
                                    ? 'Survey Published'
                                    : 'System Alert'}
                                </span>

                                {!n.isRead && (
                                  <button
                                    onClick={() => markAsRead(n.id)}
                                    className="text-[10px] text-[#ff7a50] font-black hover:underline cursor-pointer"
                                  >
                                    Mark Read
                                  </button>
                                )}
                              </div>

                              <p className="font-extrabold text-[#0a192f] text-xs mt-1 leading-snug">
                                {n.title}
                              </p>
                              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                                {n.message}
                              </p>

                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/80">
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {new Date(n.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>

                                {isActionPlan && (
                                  <button
                                    onClick={() => {
                                      markAsRead(n.id);
                                      setShowNotifMenu(false);
                                      setActivePage('action-plans');
                                    }}
                                    className="text-[10px] font-extrabold text-[#0a192f] hover:text-[#ff7a50] flex items-center space-x-1 cursor-pointer"
                                  >
                                    <span>View Action Plan</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}

                                {isSurvey && (
                                  <button
                                    onClick={() => {
                                      markAsRead(n.id);
                                      setShowNotifMenu(false);
                                      setActivePage('feedback');
                                    }}
                                    className="text-[10px] font-extrabold text-[#c2410c] hover:underline flex items-center space-x-1 cursor-pointer"
                                  >
                                    <span>Open Survey Form</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowDemoMenu(false);
              setShowNotifMenu(false);
            }}
            className="flex items-center space-x-1.5 sm:space-x-2 pl-2 pr-1.5 py-1.5 min-h-[44px] rounded-xl hover:bg-[#0f2444] transition-colors cursor-pointer"
          >
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
              alt={currentUser?.fullName}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#ff9d7a] shrink-0"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-white truncate max-w-32 leading-tight">
                {currentUser?.fullName}
              </p>
              <span className="text-[10px] font-semibold text-[#fed7aa] uppercase tracking-wider">
                {currentUser?.role.replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#fed7aa] shrink-0" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-[#fed7aa] py-1.5 z-50 text-[#0b1a30] animate-in fade-in duration-100">
              <div className="px-3.5 py-2.5 border-b border-[#f3e8e0] bg-[#fffaf5] rounded-t-2xl">
                <p className="text-xs font-bold text-[#0b1a30]">{currentUser?.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <span className={`inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold rounded border ${getRoleBadgeColor(currentUser?.role)}`}>
                  {currentUser?.role.replace('_', ' ')}
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setActivePage('admin');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 min-h-[44px] text-xs font-bold text-[#c2410c] hover:bg-[#fff5ee] flex items-center space-x-2.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#ff7a50] shrink-0" />
                  <span>Admin Portal & Form Results</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 min-h-[44px] text-xs text-slate-700 hover:bg-[#fff5ee] hover:text-[#c2410c] flex items-center space-x-2.5 cursor-pointer"
                >
                  <IdCard className="w-4 h-4 text-[#ff7a50] shrink-0" />
                  <span>Stakeholder Credential</span>
                </button>
                <button
                  onClick={() => {
                    setShowPublicAtrModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 min-h-[44px] text-xs text-slate-700 hover:bg-[#fff5ee] hover:text-[#c2410c] flex items-center space-x-2.5 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-[#ff7a50] shrink-0" />
                  <span>Public ATR Portal (1.4.2)</span>
                </button>
                <button
                  onClick={() => {
                    setActivePage('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 min-h-[44px] text-xs text-slate-700 hover:bg-[#fff5ee] hover:text-[#c2410c] flex items-center space-x-2.5 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-[#ff7a50] shrink-0" />
                  <span>System Settings</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 min-h-[44px] text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Direct 1-Click Sign Out Button */}
        <button
          onClick={logout}
          id="btn-navbar-logout"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 min-h-[40px] rounded-xl text-xs font-bold bg-[#14325a] hover:bg-rose-900/60 text-blue-200 hover:text-rose-200 border border-blue-400/30 hover:border-rose-400/40 transition-all cursor-pointer shadow-xs shrink-0"
          title="Sign out of current account"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      {/* 3D Stakeholder Profile Modal */}
      <StakeholderProfile
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Public Action Taken Report (ATR) Portal Modal */}
      <PublicAtrPortalModal
        isOpen={showPublicAtrModal}
        onClose={() => setShowPublicAtrModal(false)}
      />

      {/* Role Matrix Modal */}
      <RoleMatrixModal
        isOpen={showRoleMatrixNavbar}
        onClose={() => setShowRoleMatrixNavbar(false)}
      />
    </header>
  );
};
