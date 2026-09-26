import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Users,
  MessageSquareText,
  Percent,
  ClipboardCheck,
  Star,
  AlertOctagon,
  CheckCircle2,
  Clock,
  FileCheck,
  Award,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Layers,
  Shield,
  Eye,
  Sparkles,
  User,
  IdCard,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DashboardStats } from '../types';
import { ThreeDTiltCard } from '../components/ThreeDTiltCard';
import { ThreeDQualityOrbit } from '../components/ThreeDQualityOrbit';
import { RoleMatrixModal } from '../components/RoleMatrixModal';
import { StakeholderProfile } from '../components/StakeholderProfile';
import { StakeholderEngagementCard } from '../components/StakeholderEngagementCard';
import { ActionTakenAutoReportSection } from '../components/ActionTakenAutoReportSection';
import { NaacBookletReportGenerator } from '../components/NaacBookletReportGenerator';
import { AiAtrReportModal } from '../components/AiAtrReportModal';
import { Flame } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const DashboardPage: React.FC = () => {
  const { selectedAcademicYear, departments, setActivePage } = useApp();
  const { currentUser, currentRoleDefinition } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<any>(null);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [show3DOrbit, setShow3DOrbit] = useState<boolean>(true);
  const [showRoleMatrix, setShowRoleMatrix] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showNaacBookletModal, setShowNaacBookletModal] = useState<boolean>(false);
  const [showAiAtrModal, setShowAiAtrModal] = useState<boolean>(false);
  const [escalatedCount, setEscalatedCount] = useState<number>(0);

  const fetchData = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedAcademicYear) params.append('academicYearId', selectedAcademicYear);
    if (selectedDept !== 'all') params.append('departmentId', selectedDept);
    if (selectedStakeholder !== 'all') params.append('stakeholderType', selectedStakeholder);

    Promise.all([
      fetch(`/api/dashboard/stats?${params.toString()}`).then((r) => r.json()),
      fetch(`/api/dashboard/charts?${params.toString()}`).then((r) => r.json()),
      fetch('/api/quality-indicators/escalations').then((r) => r.json()).catch(() => ({ count: 0 })),
    ])
      .then(([sData, cData, escData]) => {
        setStats(sData);
        setCharts(cData);
        if (escData && typeof escData.count === 'number') {
          setEscalatedCount(escData.count);
        }
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedAcademicYear, selectedDept, selectedStakeholder]);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header with Filters */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs"
      >
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded uppercase">
              Cycle 3 • AY 2026-27
            </span>
            <span className="text-xs text-slate-400">• Institutional Quality Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Institutional Quality & Feedback Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry across stakeholder sentiment, quality indicators, gap detection, and CAPA outcomes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-500">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              aria-label="Filter by department"
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <span className="font-medium text-slate-500">Stakeholder:</span>
            <select
              value={selectedStakeholder}
              onChange={(e) => setSelectedStakeholder(e.target.value)}
              aria-label="Filter by stakeholder type"
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Stakeholders</option>
              <option value="STUDENT">Students (UG/PG)</option>
              <option value="FACULTY">Faculty & Teachers</option>
              <option value="NON_TEACHING">Administrative Staff</option>
              <option value="TECHNICAL_STAFF">Technical & Lab Staff</option>
              <option value="ALUMNI">Alumni</option>
              <option value="EMPLOYER">Employers</option>
              <option value="PARENT">Parents</option>
            </select>
          </div>

          <button
            onClick={() => setShowAiAtrModal(true)}
            className="px-3 py-1.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            title="Generate 1-click NAAC Criterion 1.4 Action Taken Report"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate Action Taken Report</span>
          </button>
        </div>
      </motion.div>

      {/* Automated Escalation Alert Watchdog Banner */}
      {escalatedCount > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-linear-to-r from-red-950 via-red-900 to-slate-900 border border-red-500/50 p-4 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/40 border border-red-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase">
                  Automated Escalation Watchdog
                </span>
                <span className="text-xs font-bold text-red-200">
                  {escalatedCount} Indicators &gt; 30 Days Below Target
                </span>
              </div>
              <p className="text-xs text-red-200/90 mt-0.5">
                Metrics scoring consistently below statutory quality thresholds without assigned CAPA plans have been escalated.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActivePage('quality-indicators')}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <span>Remediate in Indicators</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Stakeholder Role Perspective Ribbon */}
      <motion.div
        variants={itemVariants}
        className="bg-[#fffaf5] border border-[#fed7aa] p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#0a192f] text-[#ffa07a] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
            {currentUser?.fullName.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#0a192f]">
                Active Stakeholder Persona: <strong>{currentUser?.fullName}</strong>
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded border ${currentRoleDefinition.badgeColor}`}>
                {currentRoleDefinition.title}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {currentRoleDefinition.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowNaacBookletModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0a192f] text-[#fed7aa] border border-[#ff7a50] hover:bg-[#132c52] transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            title="Generate official NAAC Evidence Report Booklet"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#ff7a50]" />
            <span>NAAC Evidence Report</span>
          </button>
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0a192f] text-[#ffa07a] hover:bg-[#132c52] transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <IdCard className="w-3.5 h-3.5 text-[#ff7a50]" />
            <span>Profile Credential</span>
          </button>
          <button
            onClick={() => setShowRoleMatrix(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#0a192f] hover:bg-[#fff0e6] border border-[#fed7aa] transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#ff7a50]" />
            <span>Permissions ({currentRoleDefinition.allowedPages.length})</span>
          </button>
          <button
            onClick={() => setActivePage('feedback')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ff7a50] text-white hover:bg-[#ea580c] transition-colors shadow-xs cursor-pointer"
          >
            Feedback Portal &rarr;
          </button>
        </div>
      </motion.div>

      {/* 10 KPI Summary Cards with 3D Tilt and Peach Glare */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Stakeholders */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreeDTiltCard maxTilt={8} scale={1.03} className="h-full rounded-xl">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-[#fed7aa] transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Total Stakeholders</span>
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">
                  {stats ? stats.totalStakeholders : '...'}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">5 Active Tiers</span>
            </div>
          </ThreeDTiltCard>
        </motion.div>

        {/* Card 2: Total Responses */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreeDTiltCard maxTilt={8} scale={1.03} className="h-full rounded-xl">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-[#fed7aa] transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Feedback Submissions</span>
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                    <MessageSquareText className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">
                  {stats ? stats.totalResponses.toLocaleString() : '...'}
                </p>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">+18% vs prev cycle</span>
            </div>
          </ThreeDTiltCard>
        </motion.div>

        {/* Card 3: Response Rate */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreeDTiltCard maxTilt={8} scale={1.03} className="h-full rounded-xl">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-[#fed7aa] transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Response Rate</span>
                  <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">
                  {stats ? `${stats.responseRatePercent}%` : '...'}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Benchmark: &gt; 70%</span>
            </div>
          </ThreeDTiltCard>
        </motion.div>

        {/* Card 4: Active Surveys */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreeDTiltCard maxTilt={8} scale={1.03} className="h-full rounded-xl">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-[#fed7aa] transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Active Surveys</span>
                  <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">
                  {stats ? stats.activeSurveys : '...'}
                </p>
              </div>
              <span className="text-[10px] text-purple-600 font-medium mt-1 block">Live in Portal</span>
            </div>
          </ThreeDTiltCard>
        </motion.div>

        {/* Card 5: Average Satisfaction */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreeDTiltCard maxTilt={8} scale={1.03} className="h-full rounded-xl">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-[#fed7aa] transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Average Satisfaction</span>
                  <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                    <Star className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline space-x-1 mt-2">
                  <p className="text-2xl font-extrabold text-slate-900">
                    {stats ? stats.averageSatisfaction.toFixed(2) : '...'}
                  </p>
                  <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
                </div>
              </div>
              <span className="text-[10px] text-amber-600 font-semibold mt-1 block">Target: 4.20</span>
            </div>
          </ThreeDTiltCard>
        </motion.div>

        {/* Card 6: Critical Issues / Gaps */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreeDTiltCard maxTilt={8} scale={1.03} className="h-full rounded-xl">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-red-200 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Quality Gaps</span>
                  <div className="p-1.5 bg-red-50 rounded-lg text-red-600">
                    <AlertOctagon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-red-600 mt-2">
                  {stats ? stats.criticalGapsCount : '...'}
                </p>
              </div>
              <button
                onClick={() => setActivePage('gaps')}
                className="text-[10px] font-bold text-red-700 hover:underline mt-1 block text-left cursor-pointer"
              >
                Review Gaps &rarr;
              </button>
            </div>
          </ThreeDTiltCard>
        </motion.div>

        {/* Card 7: Open Action Items */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreeDTiltCard maxTilt={8} scale={1.03} className="h-full rounded-xl">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-200 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Open CAPA Plans</span>
                  <div className="p-1.5 bg-cyan-50 rounded-lg text-cyan-600">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-cyan-700 mt-2">
                  {stats ? stats.openActionItems : '...'}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">In Progress by HoDs</span>
            </div>
          </ThreeDTiltCard>
        </motion.div>

        {/* Card 8: Completed Action Items */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreeDTiltCard maxTilt={8} scale={1.03} className="h-full rounded-xl">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-200 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Closed Actions</span>
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-emerald-600 mt-2">
                  {stats ? stats.completedActionItems : '...'}
                </p>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Verified Improvements</span>
            </div>
          </ThreeDTiltCard>
        </motion.div>

        {/* Card 9: Pending Evidence */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreeDTiltCard maxTilt={8} scale={1.03} className="h-full rounded-xl">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-200 transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold">Pending Evidence</span>
                  <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600">
                    <FileCheck className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">
                  {stats ? stats.pendingEvidenceCount : '...'}
                </p>
              </div>
              <button
                onClick={() => setActivePage('evidence')}
                className="text-[10px] font-bold text-blue-600 hover:underline mt-1 block text-left cursor-pointer"
              >
                Audit Vault &rarr;
              </button>
            </div>
          </ThreeDTiltCard>
        </motion.div>

        {/* Card 10: Internal Institutional Quality Improvement Score */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreeDTiltCard maxTilt={8} scale={1.03} className="h-full rounded-xl">
            <div className="bg-linear-to-br from-[#0a192f] via-[#0f2444] to-[#132c52] p-4 rounded-xl text-white shadow-md border border-[#32527b] hover:border-[#ff7a50] transition-all h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#ffa07a]">Quality Index</span>
                  <Award className="w-4 h-4 text-[#ff7a50]" />
                </div>
                <div className="flex items-baseline space-x-1.5 mt-2">
                  <p className="text-2xl font-black text-white">
                    {stats ? stats.qualityImprovementIndex.toFixed(1) : '...'}
                  </p>
                  <span className="text-xs text-[#fed7aa] font-bold">/ 100</span>
                </div>
              </div>
              <div className="mt-1 flex items-center space-x-1.5">
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-[#ff7a50]/20 text-[#ffa07a] rounded border border-[#ff7a50]/30">
                  {stats?.qualityStatusLabel || 'GOOD'}
                </span>
                <span className="text-[9px] text-blue-200">Internal Metric</span>
              </div>
            </div>
          </ThreeDTiltCard>
        </motion.div>
      </div>

      {/* 3D Quality Orbit Visualization Widget */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl p-5 sm:p-6 border border-[#eddcd2] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f3e8e0] gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0a192f] text-[#ffa07a] flex items-center justify-center font-black shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-[#ff7a50]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-[#0a192f] tracking-tight">
                  Interactive 3D Quality Assurance Orbit
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#fff0e6] text-[#c2410c] rounded border border-[#fed7aa]">
                  7 NAAC Criteria
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time 3D spatial rotation mapping institutional benchmarks, stakeholder satisfaction, and continuous action plans.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShow3DOrbit(!show3DOrbit)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#fff0e6] text-[#c2410c] hover:bg-[#fed7aa] border border-[#fed7aa] transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{show3DOrbit ? 'Minimize 3D View' : 'Expand 3D View'}</span>
            </button>
            <button
              onClick={() => setShowRoleMatrix(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0a192f] text-white hover:bg-[#132c52] transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-[#ff7a50]" />
              <span>Role Permissions Matrix</span>
            </button>
          </div>
        </div>

        {show3DOrbit && (
          <div className="pt-4">
            <ThreeDQualityOrbit />
          </div>
        )}
      </motion.div>

      {/* Stakeholder Engagement Overview Card (Donut Chart with Navy/Peach palette) */}
      <motion.div variants={itemVariants}>
        <StakeholderEngagementCard
          data={charts?.stakeholderEngagementOverview}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Year-wise Quality Satisfaction Trend */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#fed7aa] transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Multi-Year Satisfaction & Feedback Trend</h2>
              <p className="text-xs text-slate-500 mt-0.5">Continuous improvement across 5 academic cycles</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded border border-blue-200">
              Target: 4.2 / 5.0
            </span>
          </div>
          <div className="h-64">
            {charts?.yearTrend ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.yearTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="academicYear" tick={{ fontSize: 11 }} />
                  <YAxis domain={[3.0, 5.0]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="averageSatisfaction"
                    name="Avg Satisfaction (1-5)"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target Benchmark (4.2)"
                    stroke="#94a3b8"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading trend...</div>
            )}
          </div>
        </motion.div>

        {/* Chart 2: Department-wise Satisfaction Benchmark */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#fed7aa] transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Department Performance Comparison</h2>
              <p className="text-xs text-slate-500 mt-0.5">Average score per department for current academic cycle</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Scale 1-5</span>
          </div>
          <div className="h-64">
            {charts?.deptData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.deptData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="code" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                  <Bar dataKey="averageSatisfaction" name="Satisfaction Score" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {charts.deptData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.averageSatisfaction < 3.5 ? '#ef4444' : entry.averageSatisfaction < 4.0 ? '#f59e0b' : '#3b82f6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading departments...</div>
            )}
          </div>
        </motion.div>

        {/* Chart 3: Quality Improvement Funnel */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#fed7aa] transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Continuous Quality Funnel</h2>
              <p className="text-xs text-slate-500 mt-0.5">Feedback &rarr; Gap &rarr; Action Plan &rarr; Evidence &rarr; Verified</p>
            </div>
            <button
              onClick={() => setActivePage('iqac')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>IQAC Cycle</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3 pt-2">
            {charts?.funnel ? (
              charts.funnel.map((step: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{step.stage}</span>
                    <span className="font-extrabold text-slate-900">{step.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: step.color,
                        width: `${Math.min(100, Math.max(15, (step.count / (charts.funnel[0]?.count || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 py-6 text-center">Loading funnel...</div>
            )}
          </div>
        </motion.div>

        {/* Chart 4: Stakeholder & Sentiment Distribution */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#fed7aa] transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Sentiment & Stakeholder Engagement</h2>
              <p className="text-xs text-slate-500 mt-0.5">Submissions distribution by stakeholder category</p>
            </div>
            <button
              onClick={() => setActivePage('ai-analytics')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Qualitative Analytics &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            <div className="h-48">
              {charts?.sentimentBreakdown ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.sentimentBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {charts.sentimentBreakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800 mb-2">Stakeholder Breakdown:</p>
              {charts?.stakeholderDistribution ? (
                charts.stakeholderDistribution.map((stk: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">{stk.type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800">{stk.count}</span>
                      <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                        ★ {stk.average}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">Loading breakdown...</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Taken Auto Report Generator Section */}
      <motion.div variants={itemVariants}>
        <ActionTakenAutoReportSection
          departments={departments}
          selectedAcademicYear={selectedAcademicYear}
        />
      </motion.div>

      {/* Role Matrix Modal */}
      <RoleMatrixModal
        isOpen={showRoleMatrix}
        onClose={() => setShowRoleMatrix(false)}
      />

      {/* 3D Stakeholder Profile Credential Modal */}
      <StakeholderProfile
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* NAAC Booklet Multi-Page Evidence Report Generator Modal */}
      <NaacBookletReportGenerator
        isOpen={showNaacBookletModal}
        onClose={() => setShowNaacBookletModal(false)}
        initialAcademicYear={selectedAcademicYear || '2024 - 2025'}
      />

      {/* AI Action Taken Report (ATR) Generator Modal */}
      <AiAtrReportModal
        isOpen={showAiAtrModal}
        onClose={() => {
          setShowAiAtrModal(false);
          fetchData();
        }}
        preselectedAcademicYear={selectedAcademicYear || 'ay-5'}
      />
    </motion.div>
  );
};
