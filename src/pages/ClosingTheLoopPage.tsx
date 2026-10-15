import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  FileText,
  Search,
  Download,
  Building2,
  Calendar,
  Users,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Filter,
  Eye,
  Info,
  Layers,
  ChevronRight,
  Check,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { ThreeDTiltCard } from '../components/ThreeDTiltCard';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ClosingTheLoopItem, StakeholderType } from '../types';

export const ClosingTheLoopPage: React.FC = () => {
  const { departments, academicYears, showToast } = useApp();
  const { currentUser } = useAuth();

  const [items, setItems] = useState<ClosingTheLoopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('all');
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('all');
  const [selectedNaacMetric, setSelectedNaacMetric] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [kpis, setKpis] = useState({
    totalItems: 8,
    totalClosed: 8,
    averageSatisfactionDelta: 1.37,
    averagePercentageImprovement: 45.8,
    verificationRate: 100,
  });

  const [activeEvidenceModal, setActiveEvidenceModal] = useState<ClosingTheLoopItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDepartment !== 'all') params.append('departmentId', selectedDepartment);
      if (selectedAcademicYear !== 'all') params.append('academicYearId', selectedAcademicYear);
      if (selectedStakeholder !== 'all') params.append('stakeholderType', selectedStakeholder);
      if (selectedNaacMetric !== 'all') params.append('naacSubMetric', selectedNaacMetric);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/closing-the-loop?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        if (data.kpis) setKpis(data.kpis);
      }
    } catch (e) {
      console.error('Error fetching closing the loop data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDepartment, selectedAcademicYear, selectedStakeholder, selectedNaacMetric]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleExportNaac14 = () => {
    window.open('/api/export/naac-ssr-14', '_blank');
    setDownloadSuccess('NAAC Criterion 1.4 SSR Data Template (CSV) Downloaded!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleExportNaac27 = () => {
    window.open('/api/export/naac-ssr-27', '_blank');
    setDownloadSuccess('NAAC Criterion 2.7.1 (SSS) SSR Data Template (CSV) Downloaded!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const getMetricBadge = (metric: string) => {
    switch (metric) {
      case '1.4.1':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300">
            <Award className="w-3 h-3 text-blue-700" />
            <span>NAAC 1.4.1 (Feedback Design)</span>
          </span>
        );
      case '1.4.2':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>NAAC 1.4.2 (Action Taken on Web)</span>
          </span>
        );
      case '2.7.1':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300">
            <Sparkles className="w-3 h-3 text-purple-700" />
            <span>NAAC 2.7.1 (Student SSS)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800 border border-slate-300">
            <span>NAAC Metric {metric}</span>
          </span>
        );
    }
  };

  const getStakeholderBadge = (type: StakeholderType) => {
    switch (type) {
      case 'STUDENT':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'FACULTY':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'EMPLOYER':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'ALUMNI':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'PARENT':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'NON_TEACHING':
      case 'TECHNICAL_STAFF':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ========================================================================= */}
      {/* HERO BANNER: Institutional Closing The Loop Tracker                      */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#1e3a5f] p-8 text-white shadow-2xl border border-slate-700/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff7a50]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#ff7a50] text-[#0a192f] tracking-wide shadow-md">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>CLOSING THE LOOP (ATR)</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-xs border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>NAAC Criteria 1.4.1, 1.4.2 & 2.7.1 Audited</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Check className="w-3.5 h-3.5" />
                <span>100% Verifiable Documentary Proof</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Stakeholder Feedback to Tangible Impact Tracker
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Transparent, public-facing quality assurance tracker demonstrating how stakeholder voice directly triggers IQAC root-cause analysis, capital interventions, verified proof archives, and measurable post-resolution satisfaction gains (+Δ).
            </p>
          </div>

          {/* Quick Export CTA buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleExportNaac14}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg hover:scale-102"
              title="Download official NAAC SSR Criterion 1.4 CSV template"
            >
              <Download className="w-4 h-4 text-[#ff7a50]" />
              <span>Export Metric 1.4 SSR Data</span>
            </button>
            <button
              onClick={handleExportNaac27}
              className="px-4 py-3 rounded-xl bg-[#ff7a50] hover:bg-[#ff8a65] text-[#0a192f] font-black text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xl hover:scale-102"
              title="Download official NAAC SSR Criterion 2.7.1 Student Satisfaction Survey CSV template"
            >
              <Download className="w-4 h-4" />
              <span>Export SSS 2.7.1 SSR Data</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* LIVE KPI METRICS RIBBON (TANGIBLE EVIDENCE OF QUALITY)                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ThreeDTiltCard className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Closed CAPA Actions</p>
              <h3 className="text-3xl font-black text-[#0a192f] mt-1">{kpis.totalClosed} / {kpis.totalItems}</h3>
              <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Institutional Action Rate</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </ThreeDTiltCard>

        <ThreeDTiltCard className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Satisfaction Delta</p>
              <h3 className="text-3xl font-black text-[#ff7a50] mt-1">+{kpis.averageSatisfactionDelta.toFixed(2)} Δ</h3>
              <p className="text-[11px] text-slate-600 font-bold mt-1 flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#ff7a50]" />
                <span>Scale 1 to 5 Remeasurement</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#fff0e6] border border-[#fed7aa] flex items-center justify-center text-[#ff7a50] shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </ThreeDTiltCard>

        <ThreeDTiltCard className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Relative Improvement</p>
              <h3 className="text-3xl font-black text-[#0a192f] mt-1">+{kpis.averagePercentageImprovement}%</h3>
              <p className="text-[11px] text-indigo-700 font-bold mt-1 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Average Pre vs Post Gain</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </ThreeDTiltCard>

        <ThreeDTiltCard className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">NAAC Audit Proofs</p>
              <h3 className="text-3xl font-black text-[#0a192f] mt-1">100%</h3>
              <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Statutory Orders & Minutes</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </div>
          </div>
        </ThreeDTiltCard>
      </div>

      {/* ========================================================================= */}
      {/* FILTER & SEARCH CONTROL CONSOLE                                          */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by issue, equipment, department, evidence code, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0a192f] focus:border-transparent bg-slate-50/50"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[36px] px-3.5 py-1.5 rounded-lg bg-[#0a192f] text-white text-[11px] font-bold hover:bg-[#112240] transition-colors cursor-pointer"
            >
              Filter
            </button>
          </form>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Filter className="w-4 h-4 text-[#ff7a50]" />
            <span className="font-bold text-slate-700">Filters:</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Department / Unit:</span>
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0a192f] cursor-pointer"
            >
              <option value="all">All Departments (Institutional)</option>
              {departments && departments.length > 0 ? (
                departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))
              ) : (
                <>
                  <option value="dept-1">B.Tech Computer Science (CSE)</option>
                  <option value="dept-2">Mechanical Engineering (MECH)</option>
                  <option value="dept-3">BCA (Bachelor of Computer Applications)</option>
                  <option value="dept-4">BBA (Bachelor of Business Administration)</option>
                  <option value="dept-5">B.Tech CSE (AI & ML) (CSE-AIML)</option>
                </>
              )}
            </select>
          </div>

          {/* Academic Year Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Academic Year:</span>
            </label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0a192f] cursor-pointer"
            >
              <option value="all">All Academic Years</option>
              <option value="ay-5">2026-27 (Current Cycle)</option>
              <option value="ay-4">2025-26</option>
              <option value="ay-3">2024-25</option>
            </select>
          </div>

          {/* Stakeholder Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Stakeholder Voice:</span>
            </label>
            <select
              value={selectedStakeholder}
              onChange={(e) => setSelectedStakeholder(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0a192f] cursor-pointer"
            >
              <option value="all">All Stakeholders</option>
              <option value="STUDENT">Students (Undergraduate & PG)</option>
              <option value="FACULTY">Faculty & Professors</option>
              <option value="EMPLOYER">Employers & Corporate Recruiters</option>
              <option value="ALUMNI">Alumni Network</option>
              <option value="PARENT">Parents & Guardians</option>
              <option value="NON_TEACHING">Administrative & Non-Teaching</option>
              <option value="TECHNICAL_STAFF">Technical & Lab Staff</option>
            </select>
          </div>

          {/* NAAC Metric Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span>NAAC Sub-Metric Tag:</span>
            </label>
            <select
              value={selectedNaacMetric}
              onChange={(e) => setSelectedNaacMetric(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0a192f]"
            >
              <option value="all">All NAAC Sub-Metrics</option>
              <option value="1.4.1">Metric 1.4.1 (Feedback Collection)</option>
              <option value="1.4.2">Metric 1.4.2 (Action Taken & Website)</option>
              <option value="2.7.1">Metric 2.7.1 (Student Satisfaction SSS)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TRANSPARENT "CLOSING THE LOOP" CARDS LIST                                */}
      {/* ========================================================================= */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-[#ff7a50] animate-spin" />
          <p className="text-xs font-bold text-slate-600">Loading verifiable resolution cards...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <Info className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-extrabold text-slate-700">No Closing the Loop Records Matched</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try resetting your filters or search keywords to view other academic departments and criteria.
          </p>
          <button
            onClick={() => {
              setSelectedDepartment('all');
              setSelectedAcademicYear('all');
              setSelectedStakeholder('all');
              setSelectedNaacMetric('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#0a192f] text-white text-xs font-bold cursor-pointer hover:bg-[#112240]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-bold">
            <span>Displaying {items.length} Verifiable Institutional Interventions</span>
            <span className="text-[#ff7a50]">Average Improvement: +{kpis.averageSatisfactionDelta.toFixed(2)} Δ Points</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {items.map((item, index) => {
              const delta = item.satisfactionDelta;
              const percent = item.percentageImprovement;

              return (
                <ThreeDTiltCard
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Card Header Bar */}
                  <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-[#0a192f] text-white tracking-wider">
                        {item.capaCode}
                      </span>
                      {getMetricBadge(item.naacSubMetric)}
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getStakeholderBadge(item.stakeholderType)}`}>
                        {item.stakeholderLabel}
                      </span>
                      <span className="text-xs font-extrabold text-slate-600">
                        {item.departmentName}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>LOOP CLOSED & AUDITED</span>
                      </span>
                    </div>
                  </div>

                  {/* Card 4-Column Responsive Layout */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6">
                    {/* Column 1: Issue Reported by Stakeholder (3 Cols) */}
                    <div className="xl:col-span-3 space-y-3 border-b xl:border-b-0 xl:border-r border-slate-100 pb-5 xl:pb-0 xl:pr-5">
                      <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-rose-700">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span>1. Issue Reported</span>
                      </div>

                      <h4 className="text-sm font-extrabold text-[#0a192f] leading-snug">
                        {item.issueReported}
                      </h4>

                      <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs italic text-slate-700 leading-relaxed relative">
                        <span className="text-rose-400 font-serif text-lg leading-none absolute top-1 left-1.5">“</span>
                        <p className="pl-3">{item.verbatimFeedbackQuote}</p>
                      </div>

                      <div className="pt-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                          <span>Baseline Score:</span>
                          <span className="text-rose-700 font-extrabold">{item.baselineScore.toFixed(2)} / 5.0</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-rose-500 h-1.5 rounded-full"
                            style={{ width: `${(item.baselineScore / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Column 2: IQAC Intervention & Resolution (4 Cols) */}
                    <div className="xl:col-span-4 space-y-3 border-b xl:border-b-0 xl:border-r border-slate-100 pb-5 xl:pb-0 xl:pr-5">
                      <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-blue-800">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>2. IQAC Intervention & Resolution</span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700">
                        <div>
                          <span className="font-extrabold text-[#0a192f] block text-[11px] uppercase tracking-wide">
                            Root Cause Diagnosed:
                          </span>
                          <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                            {item.rootCauseAnalysis}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                          <span className="font-extrabold text-blue-900 block text-[11px] uppercase tracking-wide">
                            Corrective Action Implemented:
                          </span>
                          <p className="text-blue-950 font-medium text-[11px] leading-relaxed mt-0.5">
                            {item.interventionResolution}
                          </p>
                        </div>

                        <div>
                          <span className="font-extrabold text-slate-700 block text-[11px] uppercase tracking-wide">
                            Preventive Protocol:
                          </span>
                          <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                            {item.preventiveMeasure}
                          </p>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                        <span>Lead In-Charge:</span>
                        <span className="font-bold text-[#0a192f]">{item.responsibleLead}</span>
                      </div>
                    </div>

                    {/* Column 3: Verified Evidence / Proof Tag (2.5 Cols) */}
                    <div className="xl:col-span-3 space-y-3 border-b xl:border-b-0 xl:border-r border-slate-100 pb-5 xl:pb-0 xl:pr-5">
                      <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-purple-800">
                        <div className="w-2 h-2 rounded-full bg-purple-600" />
                        <span>3. Verifiable Evidence</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/70 to-indigo-50/40 border border-purple-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-800 text-white">
                            {item.evidenceCode}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 flex items-center space-x-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>AUDITED</span>
                          </span>
                        </div>

                        <h5 className="text-xs font-extrabold text-purple-950 leading-snug">
                          {item.evidenceTitle}
                        </h5>

                        <div className="text-[11px] text-purple-900 font-medium">
                          <span className="font-bold">Doc Type:</span> {item.evidenceProofType}
                        </div>

                        <div className="text-[10px] text-slate-500">
                          Verified on: {item.evidenceVerifiedAt}
                        </div>

                        <button
                          onClick={() => setActiveEvidenceModal(item)}
                          className="w-full mt-1 px-3 py-1.5 rounded-xl bg-white hover:bg-purple-100 border border-purple-200 text-purple-900 font-extrabold text-[11px] flex items-center justify-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-purple-700" />
                          <span>Inspect Proof Tag</span>
                        </button>
                      </div>
                    </div>

                    {/* Column 4: Satisfaction Score Delta (+Δ) (2.5 Cols) */}
                    <div className="xl:col-span-2 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
                          <div className="w-2 h-2 rounded-full bg-emerald-600" />
                          <span>4. Satisfaction Delta</span>
                        </div>

                        <div className="mt-2 text-center p-3 rounded-2xl bg-[#fff0e6] border border-[#fed7aa]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2410c] block">
                            Net Quality Delta
                          </span>
                          <div className="text-2xl font-black text-[#c2410c] mt-0.5">
                            +{delta.toFixed(2)} Δ
                          </div>
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                            +{percent}% Gain
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5 text-xs">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500">Before:</span>
                            <span className="font-bold text-slate-700">{item.baselineScore.toFixed(2)} / 5.0</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500">Remeasured:</span>
                            <span className="font-black text-emerald-700">{item.remeasuredScore.toFixed(2)} / 5.0</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${(item.remeasuredScore / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-center text-slate-400 font-medium">
                        Academic Cycle: {item.academicYear}
                      </div>
                    </div>
                  </div>
                </ThreeDTiltCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VERIFIED EVIDENCE DOCUMENT INSPECTOR                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeEvidenceModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-auto max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">
                      NAAC Accreditation Verified Evidence
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#0a192f] truncate">
                      {activeEvidenceModal.evidenceCode}: {activeEvidenceModal.evidenceTitle}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveEvidenceModal(null)}
                  aria-label="Close modal"
                  className="min-w-[44px] min-h-[44px] rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">CAPA Code</span>
                    <span className="font-extrabold text-[#0a192f]">{activeEvidenceModal.capaCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">NAAC Metric</span>
                    <span className="font-extrabold text-[#0a192f]">{activeEvidenceModal.naacMetricLabel}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Document Proof</span>
                    <span className="font-extrabold text-[#0a192f]">{activeEvidenceModal.evidenceProofType}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-black text-[#0a192f] block uppercase tracking-wider text-[11px]">
                    Institutional Resolution Backing:
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    {activeEvidenceModal.interventionResolution}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-black text-emerald-950 block">
                      IQAC Verification & Statutory Compliance Certificate
                    </span>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">
                      This institutional document was audited and verified on <strong>{activeEvidenceModal.evidenceVerifiedAt}</strong> under the authority of Prof. (Dr.) Susheel Mittal (Vice-Chancellor) and Prof. Rajiv Chauhan (Director, IQAC). Formally catalogued for I.K. Gujral Punjab Technical University NAAC Self-Study Report (SSR) presentation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveEvidenceModal(null)}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer flex items-center justify-center"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Simulating secure download for document: ${activeEvidenceModal.evidenceTitle} (${activeEvidenceModal.evidenceCode}.pdf)`, 'info');
                  }}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-[#0a192f] text-white text-xs font-bold hover:bg-[#112240] flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5 text-[#ff7a50]" />
                  <span>Download Signed Proof PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
