import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Building2,
  Calendar,
  Layers,
  Settings,
  Database,
  Download,
  Upload,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Award,
  Sparkles,
  Lock,
  Unlock,
  Eye,
  Sliders,
  Bell,
  Mail,
  Smartphone,
  BookOpen,
  ArrowRight,
  ChevronRight,
  X,
  ExternalLink,
  ClipboardCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Role, StakeholderType, Department } from '../types';
import { NaacBookletReportGenerator } from '../components/NaacBookletReportGenerator';
import { AdminFormResultsExplorer } from '../components/AdminFormResultsExplorer';

export const AdminPortalPage: React.FC = () => {
  const {
    selectedAcademicYear,
    setSelectedAcademicYear,
    academicYears,
    departments,
    showToast,
    setActivePage,
  } = useApp();

  const {
    currentUser,
    currentRoleDefinition,
    demoAccounts,
    demoLogin,
    hasRole,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'results' | 'vitals' | 'users' | 'surveys' | 'departments' | 'naac-weights' | 'security'
  >('results');

  // Search and filter in User IAM tab
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showNaacBookletModal, setShowNaacBookletModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('FACULTY');
  const [newUserDept, setNewUserDept] = useState('B.Tech Computer Science');

  // Accreditation weights state (Criterion 1 to 7)
  const [criteriaWeights, setCriteriaWeights] = useState([
    { criterion: 'Criterion 1: Curricular Aspects', code: 'C1', weight: 15, key: 'curriculum' },
    { criterion: 'Criterion 2: Teaching-Learning & Evaluation', code: 'C2', weight: 35, key: 'teaching' },
    { criterion: 'Criterion 3: Research, Innovations & Extension', code: 'C3', weight: 15, key: 'research' },
    { criterion: 'Criterion 4: Infrastructure & Learning Resources', code: 'C4', weight: 10, key: 'infra' },
    { criterion: 'Criterion 5: Student Support & Progression', code: 'C5', weight: 10, key: 'support' },
    { criterion: 'Criterion 6: Governance, Leadership & Management', code: 'C6', weight: 10, key: 'governance' },
    { criterion: 'Criterion 7: Institutional Values & Best Practices', code: 'C7', weight: 5, key: 'values' },
  ]);

  // System security settings
  const [doubleBlindAnonymity, setDoubleBlindAnonymity] = useState(true);
  const [evidenceTamperLock, setEvidenceTamperLock] = useState(true);
  const [twoFactorEnforcement, setTwoFactorEnforcement] = useState(false);
  const [autoReminderCadence, setAutoReminderCadence] = useState('Every 72 Hours');

  // Simulated live users list combining demoAccounts + extra mock registered stakeholders
  const [userList, setUserList] = useState([
    ...demoAccounts,
    {
      id: 'usr-ext-1',
      fullName: 'Dr. Gursharan Singh',
      email: 'gursharan.singh@ikgptu.ac.in',
      password: 'demo',
      role: 'PRINCIPAL' as Role,
      department: 'Academic Directorate',
    },
    {
      id: 'usr-ext-2',
      fullName: 'Amanpreet Kaur',
      email: 'amanpreet.cse@ikgptu.ac.in',
      password: 'demo',
      role: 'STUDENT' as Role,
      department: 'Computer Science & Engineering',
    },
    {
      id: 'usr-ext-3',
      fullName: 'Er. Harjit Singh Randhawa',
      email: 'harjit.alumni@tcs.com',
      password: 'demo',
      role: 'ALUMNI' as Role,
      department: 'Mechanical Engineering',
    },
    {
      id: 'usr-ext-4',
      fullName: 'Rajesh Mehra',
      email: 'rajesh.mehra@infosys.com',
      password: 'demo',
      role: 'EMPLOYER' as Role,
      department: 'Industry Relations Cell',
    },
    {
      id: 'usr-ext-5',
      fullName: 'Sukhwinder Singh',
      email: 'sukhwinder.parent@gmail.com',
      password: 'demo',
      role: 'PARENT' as Role,
      department: 'Parent-Teacher Association',
    },
  ]);

  const handleRefreshVitals = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Admin telemetry and audit logs synchronized successfully!', 'success');
    }, 600);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('Please provide a valid user name and email.', 'error');
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName: newUserName.trim(),
      email: newUserEmail.trim(),
      password: 'demo',
      role: newUserRole,
      department: newUserDept,
    };

    setUserList([newUser, ...userList]);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    showToast(`User ${newUser.fullName} provisioned with role ${newUser.role}!`, 'success');
  };

  const handleBroadcastReminder = () => {
    showToast(
      'Broadcast reminder dispatched to 263 pending stakeholders via Portal Notification & Email!',
      'success'
    );
  };

  const handleExportDatabaseJson = () => {
    const backupData = {
      institution: 'I.K. Gujral Punjab Technical University - Amritsar Campus',
      exportTimestamp: new Date().toISOString(),
      academicYear: selectedAcademicYear,
      systemVersion: 'NAAC-QMS Core v4.2',
      registeredUsersCount: userList.length,
      users: userList.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        department: u.department,
      })),
      criteriaWeights,
      securityPolicies: {
        doubleBlindAnonymity,
        evidenceTamperLock,
        twoFactorEnforcement,
        autoReminderCadence,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NAAC-QMS-Database-Backup-${selectedAcademicYear}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Encrypted JSON Database Backup downloaded successfully!', 'success');
  };

  // Filtered users for IAM table
  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole =
      selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const totalWeights = criteriaWeights.reduce((acc, c) => acc + c.weight, 0);

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* 1. ADMIN PORTAL HERO BANNER                                    */}
      {/* ============================================================== */}
      <div className="bg-linear-to-r from-[#0a192f] via-[#132c52] to-[#0a192f] rounded-3xl p-6 sm:p-8 text-white border-2 border-[#fed7aa] shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-[#ff7a50]/20 via-[#ffa07a]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ff7a50] text-[#0a192f] shadow-xs">
                Root Governance
              </span>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-white/10 text-[#fed7aa] border border-white/15">
                NAAC QMS Core Engine v4.2
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cluster Status: Healthy (99.98% SLA)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>Admin Portal & Mission Control</span>
              <ShieldCheck className="w-7 h-7 text-[#ffa07a]" />
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Centralized administrative headquarters for institutional IAM access, NAAC Criteria formula weighting, survey windows orchestration, audit log immutability, and statutory accreditation reporting.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowNaacBookletModal(true)}
              className="px-4 py-2.5 rounded-xl bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-[#0a192f] font-extrabold text-xs transition-all shadow-lg shadow-orange-950/20 flex items-center space-x-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#0a192f]" />
              <span>NAAC Evidence Booklet</span>
            </button>

            <button
              onClick={handleExportDatabaseJson}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#fed7aa] border border-[#fed7aa]/30 font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Download Full Database Backup"
            >
              <Download className="w-4 h-4" />
              <span>Backup (JSON)</span>
            </button>

            <button
              onClick={handleRefreshVitals}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/20 transition-all cursor-pointer"
              title="Sync Telemetry & Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#ff7a50]' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center space-x-3">
            <Users className="w-6 h-6 text-[#ffa07a] shrink-0" />
            <div>
              <p className="text-[10px] text-slate-300 font-bold uppercase">Total Stakeholders</p>
              <p className="text-base font-black text-white">{userList.length} Accounts</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-[#ffa07a] shrink-0" />
            <div>
              <p className="text-[10px] text-slate-300 font-bold uppercase">Active Session</p>
              <p className="text-base font-black text-[#fed7aa]">AY {selectedAcademicYear}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-300 font-bold uppercase">Response Quorum</p>
              <p className="text-base font-black text-emerald-300">78.96% Achieved</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center space-x-3">
            <Award className="w-6 h-6 text-[#ff7a50] shrink-0" />
            <div>
              <p className="text-[10px] text-slate-300 font-bold uppercase">Projected CGPA</p>
              <p className="text-base font-black text-[#ffa07a]">3.68 / 4.00 (A++)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. ADMIN PORTAL TAB SELECTOR NAVIGATION                        */}
      {/* ============================================================== */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        {[
          { id: 'results', label: 'All Form Results & Submissions', icon: ClipboardCheck, badge: '14 Forms' },
          { id: 'vitals', label: 'System Health & Vitals', icon: ActivityIcon },
          { id: 'users', label: 'User & Stakeholder IAM', icon: Users, badge: userList.length },
          { id: 'surveys', label: 'Feedback Campaigns & Windows', icon: Calendar },
          { id: 'departments', label: 'Department Registry', icon: Building2, badge: departments.length },
          { id: 'naac-weights', label: 'NAAC Criteria Weights', icon: Sliders },
          { id: 'security', label: 'Security & Audit Control', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                isActive
                  ? 'bg-[#0a192f] text-[#ffa07a] shadow-md border border-[#ff7a50]/40'
                  : 'text-slate-600 hover:text-[#0a192f] hover:bg-[#fff5ee]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff7a50]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-[#ff7a50] text-[#0a192f]' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 0: ALL FORM RESULTS & EVALUATIVE SUBMISSIONS EXPLORER      */}
      {/* ============================================================== */}
      {activeTab === 'results' && (
        <AdminFormResultsExplorer
          selectedAcademicYear={selectedAcademicYear}
          departments={departments}
          academicYears={academicYears}
          showToast={showToast}
          onNavigateToFeedback={() => setActivePage('feedback')}
        />
      )}

      {/* ============================================================== */}
      {/* TAB 1: SYSTEM HEALTH & MISSION CONTROL                         */}
      {/* ============================================================== */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          {/* 3 Operational Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    Survey Operations
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Live Active</span>
                  </span>
                </div>
                <h3 className="font-extrabold text-[#0a192f] text-sm">Feedback Campaigns</h3>
                <p className="text-xs text-slate-500 mt-1">
                  14 published statutory feedback forms currently collecting stakeholder inputs across all academic tiers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handleBroadcastReminder}
                  className="px-3 py-1.5 bg-[#fff0e6] hover:bg-[#ffe2cc] text-[#c2410c] border border-[#fed7aa] rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-[#ff7a50]" />
                  <span>Send Stakeholder Reminders</span>
                </button>
                <span className="text-xs font-mono font-bold text-slate-700">987 Responses</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    Quality Remediations
                  </span>
                  <span className="text-[10px] font-bold text-purple-600">CQI Active</span>
                </div>
                <h3 className="font-extrabold text-[#0a192f] text-sm">CAPA Compliance Status</h3>
                <p className="text-xs text-slate-500 mt-1">
                  18 total action items recorded. 12 resolved & verified by IQAC Director with documentary proofs.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActivePage('atr')}
                  className="px-3 py-1.5 bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#ff7a50]" />
                  <span>View Resolved ATR</span>
                </button>
                <span className="text-xs font-mono font-bold text-emerald-600">85.7% Solved</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    Statutory Submission
                  </span>
                  <span className="text-[10px] font-bold text-amber-600">NAAC Cycle 3</span>
                </div>
                <h3 className="font-extrabold text-[#0a192f] text-sm">Accreditation Evidence Audit</h3>
                <p className="text-xs text-slate-500 mt-1">
                  64 documentary artifacts uploaded, catalogued with Criterion 1-7 mapping, circulars, and geotagged lab photos.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActivePage('evidence')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#ff7a50]" />
                  <span>Evidence Repository</span>
                </button>
                <span className="text-xs font-mono font-bold text-slate-700">100% Verified</span>
              </div>
            </div>
          </div>

          {/* Institutional Telemetry Server Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-black text-[#0a192f] uppercase tracking-wider mb-3 flex items-center space-x-2">
              <Database className="w-4 h-4 text-[#ff7a50]" />
              <span>Core System Parameters & Cluster Telemetry</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-400 font-bold text-[10px] uppercase">Database Sync Engine</p>
                <p className="font-extrabold text-slate-800 text-sm mt-0.5">PostgreSQL / In-Memory JSON</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Synchronized 18s ago</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-400 font-bold text-[10px] uppercase">Double-Blind Anonymity</p>
                <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                  {doubleBlindAnonymity ? 'Active & Sealed' : 'Disabled'}
                </p>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">AES-256 Feedback Hashing</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-400 font-bold text-[10px] uppercase">API Gateway Latency</p>
                <p className="font-extrabold text-slate-800 text-sm mt-0.5">14ms Average</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Zero dropped requests</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-400 font-bold text-[10px] uppercase">NAAC Peer Visit Mode</p>
                <p className="font-extrabold text-[#c2410c] text-sm mt-0.5">Ready for Export</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">27-Page Booklet Generated</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: USER & STAKEHOLDER IAM CONSOLE                          */}
      {/* ============================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user, email, department..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 focus:outline-hidden focus:border-[#ff7a50]"
                />
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold">Role:</span>
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden"
                >
                  <option value="all">All Roles ({userList.length})</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                  <option value="IQAC_ADMIN">IQAC Coordinator</option>
                  <option value="PRINCIPAL">Principal / Head</option>
                  <option value="HOD">Head of Department (HoD)</option>
                  <option value="FACULTY">Faculty / Teachers</option>
                  <option value="STUDENT">Students</option>
                  <option value="ALUMNI">Alumni</option>
                  <option value="EMPLOYER">Employers</option>
                  <option value="PARENT">Parents</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-2 bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#ff7a50]" />
              <span>Add / Provision Stakeholder</span>
            </button>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-[#0a192f] text-white text-[10px] uppercase font-black tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Stakeholder Name</th>
                    <th className="py-3 px-4">Institutional Email</th>
                    <th className="py-3 px-4">Department / Unit</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#fffaf5] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#0a192f]">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-[#0a192f] text-[#ffa07a] flex items-center justify-center font-black text-[10px]">
                            {user.fullName.charAt(0)}
                          </div>
                          <span>{user.fullName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">{user.email}</td>
                      <td className="py-3 px-4 text-slate-600">{user.department}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa]">
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            demoLogin(user.email);
                            showToast(`Switched persona to ${user.fullName} (${user.role})!`, 'info');
                          }}
                          className="min-h-[36px] px-2.5 py-1 bg-slate-100 hover:bg-[#fff0e6] text-slate-700 hover:text-[#c2410c] rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          title="Impersonate & test this user's view"
                        >
                          Impersonate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: FEEDBACK SURVEY WINDOWS & CAMPAIGNS                     */}
      {/* ============================================================== */}
      {activeTab === 'surveys' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-[#0a192f] text-sm">
                  Active Survey Windows & Stakeholder Campaigns
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Control statutory feedback windows, quorum enforcement, and reminder cadences for AY {selectedAcademicYear}.
                </p>
              </div>

              <button
                onClick={handleBroadcastReminder}
                className="px-3 py-1.5 bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Mail className="w-3.5 h-3.5 text-[#ff7a50]" />
                <span>Dispatch Broadcast Reminders</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#fed7aa] bg-[#fffaf5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#0a192f] text-xs">
                    Curriculum & Course Feedback (Students)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Open • 81.25% Quorum
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Target: 800 enrolled undergraduate and postgraduate students. 650 responses collected.
                </p>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 text-[10px]">Cutoff Date: 30 May 2027</span>
                  <button
                    onClick={() => setActivePage('feedback')}
                    className="text-[#c2410c] font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Manage Questions</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#fed7aa] bg-[#fffaf5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#0a192f] text-xs">
                    Faculty Pedagogical & Research Appraisal
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Open • 66.67% Quorum
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Target: 180 teaching faculty. 120 appraisals filed with research publications mapping.
                </p>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 text-[10px]">Cutoff Date: 15 June 2027</span>
                  <button
                    onClick={() => setActivePage('feedback')}
                    className="text-[#c2410c] font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Manage Questions</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: DEPARTMENT REGISTRY                                     */}
      {/* ============================================================== */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-[#0a192f] text-sm">
                  Academic Departments & Entities Registry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage department heads, curriculum governance cells, and faculty quotas.
                </p>
              </div>

              <button
                onClick={() => setActivePage('department')}
                className="px-3.5 py-1.5 bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Building2 className="w-3.5 h-3.5 text-[#ff7a50]" />
                <span>Department Command Console</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'B.Tech Computer Science', code: 'CSE', branchCourse: 'B.Tech in Computer Science and Engineering', hod: 'Dr. Anand Raman', score: 4.28, faculty: 65, duration: '4 Years (UG)' },
                { name: 'Mechanical Engineering', code: 'MECH', branchCourse: 'B.Tech in Mechanical Engineering', hod: 'Dr. Rajesh Deshmukh', score: 4.12, faculty: 48, duration: '4 Years (UG)' },
                { name: 'BCA (Computer Applications)', code: 'BCA', branchCourse: 'Bachelor of Computer Applications (BCA)', hod: 'Dr. Meenakshi Sundaram', score: 4.20, faculty: 36, duration: '3 Years (UG)' },
                { name: 'BBA (Business Administration)', code: 'BBA', branchCourse: 'Bachelor of Business Administration (BBA)', hod: 'Dr. Sunita Kulkarni', score: 4.15, faculty: 32, duration: '3 Years (UG)' },
                { name: 'B.Tech CSE (AI & ML)', code: 'CSE-AIML', branchCourse: 'B.Tech CSE (Artificial Intelligence & ML)', hod: 'Dr. Vikramaditya Sen', score: 4.38, faculty: 44, duration: '4 Years (UG)' },
              ].map((dept) => (
                <div
                  key={dept.code}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-[#fed7aa] hover:bg-[#fffaf5] transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-[#0a192f] text-[#ffa07a]">
                      {dept.code}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-[#c2410c]">
                      ★ {dept.score} / 5.0
                    </span>
                  </div>
                  <h4 className="font-extrabold text-[#0a192f] text-xs leading-snug">{dept.name}</h4>
                  <div className="mt-2 p-2 rounded-lg bg-white border border-slate-200 text-[11px]">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Branch Course:</span>
                    <span className="font-semibold text-slate-800">{dept.branchCourse}</span>
                    <span className="text-[10px] text-[#c2410c] font-bold block mt-0.5">{dept.duration}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Head: {dept.hod}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{dept.faculty} Academic Faculty</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: NAAC CRITERIA WEIGHTS ENGINE                            */}
      {/* ============================================================== */}
      {activeTab === 'naac-weights' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="font-black text-[#0a192f] text-sm">
                  NAAC 7-Criteria Weightage & Scoring Formula Engine
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calibrate criteria contribution weights to institutional CGPA. Sum must equal 100%.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-600">Total Weight:</span>
                <span
                  className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg border ${
                    totalWeights === 100
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                  }`}
                >
                  {totalWeights}% {totalWeights === 100 ? '✓ Balanced' : '⚠️ Misaligned'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {criteriaWeights.map((c, idx) => (
                <div
                  key={c.code}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#fed7aa] transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-[#0a192f] text-xs">{c.criterion}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Code: {c.code}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={1}
                      value={c.weight}
                      onChange={(e) => {
                        const newWeights = [...criteriaWeights];
                        newWeights[idx].weight = Number(e.target.value);
                        setCriteriaWeights(newWeights);
                      }}
                      className="w-32 accent-[#ff7a50] cursor-pointer"
                    />
                    <span className="font-mono text-xs font-black text-[#0a192f] w-10 text-right">
                      {c.weight}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => showToast('NAAC Criteria weights recalibrated and saved for reporting!', 'success')}
                className="px-4 py-2 bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Save Accreditation Weights
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: SECURITY, BACKUP & AUDIT CONTROL                        */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-black text-[#0a192f] text-sm border-b pb-2">
              Statutory Security, Anonymity & Compliance Controls
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <h4 className="font-extrabold text-[#0a192f] text-xs">Double-Blind Stakeholder Anonymity</h4>
                  <p className="text-[11px] text-slate-500">
                    Strip student IDs and email traces from feedback rating vectors to ensure candid reviews.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDoubleBlindAnonymity(!doubleBlindAnonymity);
                    showToast(
                      `Double-blind anonymity ${!doubleBlindAnonymity ? 'Enabled' : 'Disabled'}!`,
                      'info'
                    );
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    doubleBlindAnonymity
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {doubleBlindAnonymity ? 'Enabled (Active)' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <h4 className="font-extrabold text-[#0a192f] text-xs">Evidence Immutability Lock</h4>
                  <p className="text-[11px] text-slate-500">
                    Lock documentary evidence proofs once verified by the IQAC Director against modification.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEvidenceTamperLock(!evidenceTamperLock);
                    showToast(
                      `Evidence tamper lock ${!evidenceTamperLock ? 'Engaged' : 'Disengaged'}!`,
                      'info'
                    );
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    evidenceTamperLock
                      ? 'bg-[#0a192f] text-[#ffa07a]'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {evidenceTamperLock ? 'Locked & Sealed' : 'Unlocked'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <h4 className="font-extrabold text-[#0a192f] text-xs">Audit Logs & Access Trails</h4>
                  <p className="text-[11px] text-slate-500">
                    Review statutory timestamp logs of all user logins, survey modifications, and report sign-offs.
                  </p>
                </div>
                <button
                  onClick={() => setActivePage('audit-logs')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  View Audit Trail &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / PROVISION STAKEHOLDER                             */}
      {/* ============================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-2 border-[#fed7aa] space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#0a192f] text-[#ffa07a] flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-black text-[#0a192f] text-sm">Provision Stakeholder Account</h3>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-700 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Harpreet Singh"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#ff7a50]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. harpreet.singh@ikgptu.ac.in"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#ff7a50]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stakeholder Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as Role)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#ff7a50] bg-white font-semibold cursor-pointer"
                >
                  <option value="SUPER_ADMIN">Super Administrator</option>
                  <option value="IQAC_ADMIN">IQAC Coordinator</option>
                  <option value="PRINCIPAL">Principal / Head</option>
                  <option value="HOD">Head of Department (HoD)</option>
                  <option value="FACULTY">Faculty / Teacher</option>
                  <option value="STUDENT">Student</option>
                  <option value="ALUMNI">Alumni</option>
                  <option value="EMPLOYER">Employer</option>
                  <option value="PARENT">Parent</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#ff7a50]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] font-bold shadow-xs cursor-pointer flex items-center justify-center"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NAAC Booklet Multi-Page Evidence Report Generator */}
      <NaacBookletReportGenerator
        isOpen={showNaacBookletModal}
        onClose={() => setShowNaacBookletModal(false)}
        initialAcademicYear={selectedAcademicYear || '2024 - 2025'}
      />
    </div>
  );
};

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
