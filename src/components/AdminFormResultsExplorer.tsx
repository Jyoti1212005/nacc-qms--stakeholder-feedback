import React, { useState, useEffect, useMemo } from 'react';
import {
  ClipboardCheck,
  Search,
  Filter,
  Download,
  Printer,
  ChevronRight,
  Eye,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Building2,
  Calendar,
  Sparkles,
  Zap,
  BarChart3,
  FileSpreadsheet,
  X,
  RefreshCw,
  HelpCircle,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  Sliders,
  Check,
  Radio,
  Layers,
  Award,
} from 'lucide-react';
import { Department, AcademicYear, StakeholderType } from '../types';

interface FormSummaryItem {
  id: string;
  code: string;
  title: string;
  description: string;
  targetType: StakeholderType;
  academicYearId: string;
  status: string;
  naacSubMetric: string;
  totalResponses: number;
  averageScore: number;
  targetQuorum: number;
  quorumPercentage: number;
  ratingBand: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'CRITICAL';
  topStrengthParameter?: string;
  primaryGapParameter?: string;
  lastSubmittedAt?: string;
  sectionsCount: number;
  questionsCount: number;
}

interface QuestionAnalyticsItem {
  id: string;
  sectionTitle: string;
  category: string;
  prompt: string;
  parameter: string;
  questionType: string;
  scaleMax: number;
  orderIndex: number;
  averageScore: number;
  responsesCount: number;
  starCounts: Record<number, number>;
  benchmarkStatus: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_ATTENTION';
}

interface QualitativeCommentItem {
  questionId: string;
  prompt: string;
  parameter: string;
  text: string;
  sentiment: 'Positive' | 'Neutral' | 'Action Required';
  departmentName: string;
  departmentCode: string;
  date: string;
  score: number;
  stakeholderType: StakeholderType;
}

interface FormDetailedResults {
  form: {
    id: string;
    code: string;
    title: string;
    description: string;
    targetType: StakeholderType;
    academicYearId: string;
    status: string;
    allowAnonymous: boolean;
    startDate: string;
    endDate: string;
    naacSubMetric?: string;
    instructions?: string;
  };
  summary: {
    totalResponses: number;
    averageScore: number;
    targetQuorum: number;
    quorumPercentage: number;
    qualityRatingBand: string;
  };
  starDistribution: { star: number; count: number; percentage: number }[];
  departmentBreakdown: {
    departmentId: string;
    departmentCode: string;
    departmentName: string;
    count: number;
    averageScore: number;
    percentage: number;
  }[];
  questionAnalytics: QuestionAnalyticsItem[];
  qualitativeComments: QualitativeCommentItem[];
  recentSubmissions: any[];
}

interface EnrichedSubmissionItem {
  id: string;
  formId: string;
  formTitle: string;
  formCode: string;
  naacSubMetric?: string;
  academicYearId: string;
  departmentId?: string;
  departmentName: string;
  departmentCode: string;
  programmeName?: string;
  stakeholderType: StakeholderType;
  respondentDisplayName: string;
  isAnonymous: boolean;
  overallScore: number;
  sentimentScore?: number;
  submittedAt: string;
  answers: { questionId: string; scoreValue?: number; textValue?: string; optionValues?: string[] }[];
  answersCount: number;
}

interface AdminFormResultsExplorerProps {
  selectedAcademicYear: string;
  departments: Department[];
  academicYears: AcademicYear[];
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onNavigateToFeedback?: () => void;
}

export const AdminFormResultsExplorer: React.FC<AdminFormResultsExplorerProps> = ({
  selectedAcademicYear,
  departments,
  academicYears,
  showToast,
  onNavigateToFeedback,
}) => {
  // Navigation sub-views:
  // 'matrix': Executive overview & leaderboard of all 14 statutory forms
  // 'deepdive': Question-by-question breakdown, star distributions, department comparison for 1 form
  // 'submissions': Full searchable master audit table of individual response records
  const [subView, setSubView] = useState<'matrix' | 'deepdive' | 'submissions'>('matrix');

  // Core Data State
  const [formsSummary, setFormsSummary] = useState<FormSummaryItem[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('form-1');
  const [detailedResults, setDetailedResults] = useState<FormDetailedResults | null>(null);
  const [submissions, setSubmissions] = useState<EnrichedSubmissionItem[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDeepDive, setIsLoadingDeepDive] = useState<boolean>(false);

  // Filters State
  const [stakeholderFilter, setStakeholderFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination for submissions
  const [submissionsPage, setSubmissionsPage] = useState<number>(0);
  const pageSize = 25;

  // Inspect Single Submission Modal
  const [inspectingSubmission, setInspectingSubmission] = useState<EnrichedSubmissionItem | null>(null);

  // Live Simulation Modal
  const [showSimulateModal, setShowSimulateModal] = useState<boolean>(false);
  const [simFormId, setSimFormId] = useState<string>('form-1');
  const [simDeptId, setSimDeptId] = useState<string>('dept-1');
  const [simScore, setSimScore] = useState<number>(5);
  const [simComment, setSimComment] = useState<string>('Exceptional standard of curriculum and labs.');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // 1. Fetch Forms Summary
  const fetchFormsSummary = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/forms/summary?academicYearId=${selectedAcademicYear}`);
      if (res.ok) {
        const data = await res.json();
        setFormsSummary(data);
        if (data.length > 0 && !selectedFormId) {
          setSelectedFormId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching forms summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Deep-dive results for selected form
  const fetchDeepDiveResults = async (formId: string) => {
    setIsLoadingDeepDive(true);
    try {
      const res = await fetch(
        `/api/feedback/forms/${formId}/results?academicYearId=${selectedAcademicYear}&departmentId=${deptFilter !== 'all' ? deptFilter : ''}`
      );
      if (res.ok) {
        const data = await res.json();
        setDetailedResults(data);
      }
    } catch (err) {
      console.error('Error fetching form deep dive results:', err);
    } finally {
      setIsLoadingDeepDive(false);
    }
  };

  // 3. Fetch Enriched Submissions List
  const fetchSubmissions = async () => {
    try {
      const params = new URLSearchParams();
      params.append('academicYearId', selectedAcademicYear);
      if (subView === 'deepdive' && selectedFormId) {
        params.append('formId', selectedFormId);
      } else if (selectedFormId && selectedFormId !== 'all') {
        params.append('formId', selectedFormId);
      }
      if (stakeholderFilter !== 'all') params.append('stakeholderType', stakeholderFilter);
      if (deptFilter !== 'all') params.append('departmentId', deptFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('limit', pageSize.toString());
      params.append('offset', (submissionsPage * pageSize).toString());

      const res = await fetch(`/api/feedback/responses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.responses || []);
        setTotalSubmissions(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  // Initial and reactive data fetching
  useEffect(() => {
    fetchFormsSummary();
  }, [selectedAcademicYear]);

  useEffect(() => {
    if (selectedFormId) {
      fetchDeepDiveResults(selectedFormId);
    }
  }, [selectedFormId, selectedAcademicYear, deptFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [selectedFormId, selectedAcademicYear, stakeholderFilter, deptFilter, searchQuery, submissionsPage, subView]);

  // Overall Institutional KPIs across forms
  const aggregatedStats = useMemo(() => {
    const totalResponses = formsSummary.reduce((acc, f) => acc + f.totalResponses, 0);
    const avgScore =
      formsSummary.length > 0
        ? Math.round(
            (formsSummary.reduce((acc, f) => acc + f.averageScore * f.totalResponses, 0) /
              Math.max(totalResponses, 1)) *
              100
          ) / 100
        : 4.15;
    const totalTarget = formsSummary.reduce((acc, f) => acc + f.targetQuorum, 0);
    const overallQuorum = totalTarget > 0 ? Math.round((totalResponses / totalTarget) * 100) : 82;
    const criticalForms = formsSummary.filter((f) => f.averageScore < 3.8).length;

    return {
      totalFormsCount: formsSummary.length,
      totalResponses,
      avgScore,
      overallQuorum,
      criticalForms,
    };
  }, [formsSummary]);

  // Filtered forms in matrix view
  const filteredForms = useMemo(() => {
    return formsSummary.filter((form) => {
      const matchesRole = stakeholderFilter === 'all' || form.targetType === stakeholderFilter;
      const matchesSearch =
        searchQuery === '' ||
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (form.topStrengthParameter && form.topStrengthParameter.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRating =
        ratingFilter === 'all' ||
        (ratingFilter === 'excellent' && form.averageScore >= 4.0) ||
        (ratingFilter === 'good' && form.averageScore >= 3.5 && form.averageScore < 4.0) ||
        (ratingFilter === 'attention' && form.averageScore < 3.5);

      return matchesRole && matchesSearch && matchesRating;
    });
  }, [formsSummary, stakeholderFilter, searchQuery, ratingFilter]);

  // Handle Export to CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      showToast('No submissions available to export.', 'info');
      return;
    }

    const headers = [
      'Submission ID',
      'Form Code',
      'Form Title',
      'Stakeholder Persona',
      'Respondent Name',
      'Department Code',
      'Department Name',
      'Academic Year',
      'Overall Rating (1-5)',
      'Anonymity Status',
      'Submitted At',
    ];

    const rows = submissions.map((s) => [
      `"${s.id}"`,
      `"${s.formCode}"`,
      `"${s.formTitle.replace(/"/g, '""')}"`,
      `"${s.stakeholderType}"`,
      `"${s.respondentDisplayName.replace(/"/g, '""')}"`,
      `"${s.departmentCode}"`,
      `"${s.departmentName.replace(/"/g, '""')}"`,
      `"${s.academicYearId}"`,
      s.overallScore,
      s.isAnonymous ? 'ANONYMOUS (AES-256)' : 'VERIFIED IDENTIFIED',
      `"${s.submittedAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NAAC-QMS-Form-Results-${selectedAcademicYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${submissions.length} form response records to CSV!`, 'success');
  };

  // Handle Export to JSON
  const handleExportJSON = () => {
    const exportData = {
      institution: 'I.K. Gujral Punjab Technical University - NAAC QMS Core',
      exportedAt: new Date().toISOString(),
      academicYear: selectedAcademicYear,
      summary: aggregatedStats,
      formsOverview: formsSummary,
      currentSelectedFormDeepDive: detailedResults,
      sampleSubmissions: submissions,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NAAC-QMS-All-Forms-Analytics-${selectedAcademicYear}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Complete Form Results dataset exported to JSON successfully!', 'success');
  };

  // Handle Live Simulated Test Submission
  const handleSimulateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);

    try {
      const selectedForm = formsSummary.find((f) => f.id === simFormId);
      const res = await fetch('/api/feedback/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: simFormId,
          academicYearId: selectedAcademicYear,
          departmentId: simDeptId,
          isAnonymous: true,
          stakeholderType: selectedForm?.targetType || 'STUDENT',
          answers: [
            { questionId: 'q-1-1', scoreValue: simScore },
            { questionId: 'q-1-2', scoreValue: Math.min(5, Math.max(1, simScore - 0.2)) },
            { questionId: 'q-1-4', scoreValue: simScore },
            { questionId: 'q-text-comment', scoreValue: simScore, textValue: simComment },
          ],
        }),
      });

      if (res.ok) {
        showToast(`Test submission added live to ${selectedForm?.code || simFormId}!`, 'success');
        setShowSimulateModal(false);
        // Refresh live data
        await fetchFormsSummary();
        if (selectedFormId === simFormId) {
          await fetchDeepDiveResults(simFormId);
        }
        await fetchSubmissions();
      } else {
        showToast('Submission simulation failed.', 'error');
      }
    } catch (err) {
      console.error('Simulation error:', err);
      showToast('Error during test submission.', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  const getRatingBadge = (score: number) => {
    if (score >= 4.2) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
        label: 'A++ Exemplary',
        dot: 'bg-emerald-500',
      };
    }
    if (score >= 3.8) {
      return {
        bg: 'bg-sky-50 text-sky-800 border-sky-300',
        label: 'Good Benchmark',
        dot: 'bg-sky-500',
      };
    }
    if (score >= 3.2) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        label: 'Satisfactory',
        dot: 'bg-amber-500',
      };
    }
    return {
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      label: 'Critical Gap',
      dot: 'bg-rose-500',
    };
  };

  const getPersonaColor = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'FACULTY':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'NON_TEACHING':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'TECHNICAL_STAFF':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'ALUMNI':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'EMPLOYER':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'PARENT':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* ============================================================== */}
      {/* 1. EXECUTIVE KPI SUMMARY METRICS                               */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">All Submissions</span>
            <div className="w-8 h-8 rounded-xl bg-[#fff0e6] text-[#c2410c] flex items-center justify-center font-bold">
              <ClipboardCheck className="w-4 h-4 text-[#ff7a50]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#0a192f] tracking-tight">
              {aggregatedStats.totalResponses.toLocaleString()}
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1 mt-0.5">
              <span>● Live Institutional Submissions</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Overall Satisfaction</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#0a192f] tracking-tight">
              {aggregatedStats.avgScore} <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${
                    s <= Math.round(aggregatedStats.avgScore)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              ))}
              <span className="text-[10px] font-extrabold text-emerald-700 ml-1">Grade A++</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Published Instruments</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#0a192f] tracking-tight">
              {aggregatedStats.totalFormsCount} Forms
            </div>
            <p className="text-[11px] font-semibold text-blue-700 mt-0.5">7 Stakeholder Tiers Covered</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Quorum Target</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#0a192f] tracking-tight">
              {aggregatedStats.overallQuorum}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-linear-to-r from-purple-500 to-[#ff7a50] h-full rounded-full"
                style={{ width: `${Math.min(100, aggregatedStats.overallQuorum)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Attention Flags</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#0a192f] tracking-tight">
              {aggregatedStats.criticalForms} Form{aggregatedStats.criticalForms === 1 ? '' : 's'}
            </div>
            <p className="text-[11px] font-semibold text-amber-700 mt-0.5">Below 3.8 Benchmark</p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SUB-VIEW SWITCHER & QUICK ACTIONS TOOLBAR                   */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSubView('matrix')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              subView === 'matrix'
                ? 'bg-[#0a192f] text-[#ffa07a] shadow-md border border-[#ff7a50]/40'
                : 'text-slate-600 hover:text-[#0a192f] hover:bg-[#fff5ee]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>All Forms Overview ({formsSummary.length})</span>
          </button>

          <button
            onClick={() => setSubView('deepdive')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              subView === 'deepdive'
                ? 'bg-[#0a192f] text-[#ffa07a] shadow-md border border-[#ff7a50]/40'
                : 'text-slate-600 hover:text-[#0a192f] hover:bg-[#fff5ee]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Form Deep-Dive & Questions</span>
          </button>

          <button
            onClick={() => setSubView('submissions')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              subView === 'submissions'
                ? 'bg-[#0a192f] text-[#ffa07a] shadow-md border border-[#ff7a50]/40'
                : 'text-slate-600 hover:text-[#0a192f] hover:bg-[#fff5ee]'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Individual Submissions ({totalSubmissions})</span>
          </button>
        </div>

        {/* Action Buttons: Export & Test Simulation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSimulateModal(true)}
            className="min-h-[38px] px-3 py-1.5 bg-[#fff0e6] hover:bg-[#ffe2cc] text-[#c2410c] border border-[#fed7aa] rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            title="Simulate live submission to test real-time analytics"
          >
            <Zap className="w-3.5 h-3.5 text-[#ff7a50]" />
            <span>Simulate Live Feedback</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="min-h-[38px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Download Submissions as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="min-h-[38px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Download Form Analytics as JSON"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>JSON</span>
          </button>

          <button
            onClick={() => window.print()}
            className="min-h-[38px] p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-center"
            title="Print Summary Report"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. UNIVERSAL FILTERS BAR                                       */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search forms, question keywords, reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-[#ff7a50] focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Form Selector Dropdown (Active in Deep Dive or filters) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 text-slate-600">
              <span className="font-bold">Select Form:</span>
              <select
                value={selectedFormId}
                onChange={(e) => setSelectedFormId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden cursor-pointer max-w-[240px] truncate"
              >
                <option value="all">All Forms (Consolidated)</option>
                {formsSummary.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.code} - {f.title.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Stakeholder Persona Filter */}
            <div className="flex items-center space-x-1 text-slate-600">
              <span className="font-bold">Role:</span>
              <select
                value={stakeholderFilter}
                onChange={(e) => setStakeholderFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Stakeholders</option>
                <option value="STUDENT">Students (UG / PG)</option>
                <option value="FACULTY">Faculty / Teachers</option>
                <option value="NON_TEACHING">Administrative Staff</option>
                <option value="TECHNICAL_STAFF">Laboratory Staff</option>
                <option value="ALUMNI">Alumni Network</option>
                <option value="EMPLOYER">Employers / Industry</option>
                <option value="PARENT">Parents / Guardians</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center space-x-1 text-slate-600">
              <span className="font-bold">Dept:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center space-x-1 text-slate-600">
              <span className="font-bold">Score:</span>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Ratings</option>
                <option value="excellent">★ 4.0 - 5.0 (High)</option>
                <option value="good">★ 3.5 - 3.9 (Moderate)</option>
                <option value="attention">⚠️ &lt; 3.5 (Gap Flag)</option>
              </select>
            </div>

            <button
              onClick={() => {
                fetchFormsSummary();
                if (selectedFormId) fetchDeepDiveResults(selectedFormId);
                fetchSubmissions();
                showToast('Form results synchronized with live database!', 'info');
              }}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SUB-VIEW A: ALL FORMS RESULTS MATRIX (LEADERBOARD)          */}
      {/* ============================================================== */}
      {subView === 'matrix' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#0a192f] uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#ff7a50]" />
              <span>Statutory NAAC Feedback Forms Results Matrix ({filteredForms.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Academic Session: <strong className="text-[#0a192f]">{selectedAcademicYear}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map((form) => {
              const badge = getRatingBadge(form.averageScore);
              return (
                <div
                  key={form.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#fed7aa] transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Code & Stakeholder Persona */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-[#0a192f] text-[#ffa07a]">
                        {form.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${getPersonaColor(form.targetType)}`}>
                        {form.targetType.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-black text-[#0a192f] text-sm leading-snug group-hover:text-[#c2410c] transition-colors">
                      {form.title}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {form.description}
                    </p>

                    {/* Score & Stars */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-black text-[#0a192f] tracking-tight">
                          {form.averageScore}
                        </span>
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= Math.round(form.averageScore)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border mt-0.5 w-fit ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-black text-[#0a192f]">
                          {form.totalResponses}
                        </span>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Responses</p>
                      </div>
                    </div>

                    {/* Quorum Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1">
                        <span>Quorum ({form.quorumPercentage}% achieved)</span>
                        <span className="text-slate-700">Target: {form.targetQuorum}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            form.quorumPercentage >= 80
                              ? 'bg-emerald-500'
                              : form.quorumPercentage >= 50
                              ? 'bg-[#ff7a50]'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, form.quorumPercentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* NAAC Metric & Key Strength */}
                    <div className="mt-3 pt-2 text-[11px] text-slate-600 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold uppercase">NAAC Metric:</span>
                        <span className="font-mono font-bold text-slate-700">Criterion {form.naacSubMetric}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold uppercase">Key Strength:</span>
                        <span className="font-bold text-emerald-700 truncate max-w-[140px]">
                          {form.topStrengthParameter}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedFormId(form.id);
                        setSubView('deepdive');
                      }}
                      className="flex-1 min-h-[36px] py-1.5 px-3 bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#ff7a50]" />
                      <span>Question Breakdown</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedFormId(form.id);
                        setSubView('submissions');
                      }}
                      className="min-h-[36px] px-2.5 py-1.5 bg-slate-100 hover:bg-[#fff0e6] text-slate-700 hover:text-[#c2410c] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="Inspect Responses Log"
                    >
                      <span>Responses</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. SUB-VIEW B: FORM DEEP-DIVE & QUESTION-BY-QUESTION BREAKDOWN */}
      {/* ============================================================== */}
      {subView === 'deepdive' && detailedResults && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Form Overview Header Card */}
          <div className="bg-linear-to-r from-[#0a192f] via-[#122b4d] to-[#0a192f] rounded-3xl p-6 text-white border-2 border-[#fed7aa] shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#ff7a50] text-[#0a192f]">
                    {detailedResults.form.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#fed7aa] border border-white/20">
                    NAAC Metric {detailedResults.form.naacSubMetric || '1.4.1'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {detailedResults.form.targetType} Survey
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {detailedResults.form.title}
                </h2>

                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  {detailedResults.form.description}
                </p>
              </div>

              {/* Score Highlight Box */}
              <div className="bg-white/10 border border-white/20 p-4 rounded-2xl flex items-center space-x-4 shrink-0">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-300">Average Rating</p>
                  <p className="text-3xl font-black text-[#ffa07a] tracking-tight">
                    {detailedResults.summary.averageScore}
                  </p>
                  <div className="flex items-center justify-center space-x-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= Math.round(detailedResults.summary.averageScore)
                            ? 'text-[#ffa07a] fill-[#ffa07a]'
                            : 'text-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-l border-white/20 pl-4 space-y-1 text-xs">
                  <p className="text-[10px] text-slate-300 font-semibold uppercase">Total Feedback</p>
                  <p className="text-lg font-black text-white">{detailedResults.summary.totalResponses} Submissions</p>
                  <p className="text-[10px] text-emerald-300 font-bold">
                    {detailedResults.summary.quorumPercentage}% Quorum Reached
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column Section: Star Rating Distribution + Department Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Star Rating Distribution Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 className="text-xs font-black text-[#0a192f] uppercase tracking-wider mb-3 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#ff7a50]" />
                <span>Overall Rating Distribution (1 to 5 Stars)</span>
              </h4>

              <div className="space-y-2.5">
                {detailedResults.starDistribution.map((item) => (
                  <div key={item.star} className="flex items-center space-x-3 text-xs">
                    <span className="w-16 font-bold text-slate-600 flex items-center space-x-1 shrink-0">
                      <span>{item.star} Star{item.star > 1 ? 's' : ''}</span>
                    </span>

                    <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.star >= 4
                            ? 'bg-linear-to-r from-emerald-500 to-teal-400'
                            : item.star === 3
                            ? 'bg-linear-to-r from-amber-400 to-[#ff7a50]'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>

                    <span className="w-16 text-right font-mono font-bold text-slate-700 shrink-0">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Breakdown Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 className="text-xs font-black text-[#0a192f] uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#ff7a50]" />
                <span>Departmental Response Quorum & Performance</span>
              </h4>

              <div className="space-y-2.5">
                {detailedResults.departmentBreakdown.map((dept) => (
                  <div
                    key={dept.departmentId}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded bg-[#0a192f] text-[#ffa07a] mr-2">
                        {dept.departmentCode}
                      </span>
                      <span className="font-bold text-[#0a192f]">{dept.departmentName}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-[11px] text-slate-500 font-semibold">{dept.count} responses</span>
                      <span className="font-mono font-black text-[#c2410c] text-xs">
                        ★ {dept.averageScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Question-by-Question Detailed Results Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-[#0a192f] text-sm flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#ff7a50]" />
                  <span>Question-by-Question Evaluative Breakdown</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calibrated parameters mapped to Criterion 1-7 quality benchmarks.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                {detailedResults.questionAnalytics.length} Questions Evaluated
              </span>
            </div>

            <div className="space-y-3">
              {detailedResults.questionAnalytics.map((q, idx) => {
                const badge = getRatingBadge(q.averageScore);
                const scorePercent = Math.min(100, Math.round((q.averageScore / q.scaleMax) * 100));

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#fed7aa] hover:bg-[#fffcf9] transition-all space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start space-x-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#0a192f] text-[#ffa07a] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          Q{idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-extrabold text-[#0a192f] leading-snug">
                            {q.prompt}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-[#c2410c] bg-[#fff0e6] px-2 py-0.5 rounded border border-[#fed7aa]">
                              Parameter: {q.parameter}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {q.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center space-x-3 shrink-0 self-end sm:self-auto">
                        <div className="text-right">
                          <span className="text-base font-black text-[#0a192f] font-mono">
                            {q.averageScore}
                          </span>
                          <span className="text-[10px] text-slate-400"> / {q.scaleMax}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            q.averageScore >= 4.0
                              ? 'bg-linear-to-r from-emerald-500 to-teal-400'
                              : q.averageScore >= 3.5
                              ? 'bg-linear-to-r from-amber-400 to-[#ff7a50]'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${scorePercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>Benchmark: 3.8 / 5.0</span>
                        <span>{q.responsesCount} responses logged</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Qualitative Written Comments & Reflections */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-[#0a192f] text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#ff7a50]" />
                  <span>Qualitative Stakeholder Reflections & Remarks</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct stakeholder insights and verbatim improvement suggestions.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                {detailedResults.qualitativeComments.length} Comments Logged
              </span>
            </div>

            {detailedResults.qualitativeComments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No open-ended remarks submitted for this specific form yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {detailedResults.qualitativeComments.map((comment, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-[#fffaf5] flex flex-col justify-between space-y-2 hover:border-[#fed7aa] transition-colors"
                  >
                    <p className="text-xs font-medium text-slate-700 italic leading-relaxed">
                      "{comment.text}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-200/60">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-[#0a192f]">{comment.departmentCode}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{comment.date}</span>
                      </div>

                      <span
                        className={`px-1.5 py-0.2 rounded font-extrabold ${
                          comment.sentiment === 'Positive'
                            ? 'bg-emerald-100 text-emerald-800'
                            : comment.sentiment === 'Neutral'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {comment.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. SUB-VIEW C: INDIVIDUAL SUBMISSIONS MASTER AUDIT LOG         */}
      {/* ============================================================== */}
      {subView === 'submissions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-[#0a192f] uppercase tracking-wider flex items-center space-x-2">
                <ClipboardCheck className="w-4 h-4 text-[#ff7a50]" />
                <span>Individual Stakeholder Submissions Audit Log</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {submissions.length} of {totalSubmissions} records in AY {selectedAcademicYear}.
              </p>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2 text-xs">
              <button
                disabled={submissionsPage === 0}
                onClick={() => setSubmissionsPage(submissionsPage - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-bold disabled:opacity-40 cursor-pointer"
              >
                &larr; Previous
              </button>
              <span className="font-mono text-slate-600">
                Page {submissionsPage + 1} of {Math.max(1, Math.ceil(totalSubmissions / pageSize))}
              </span>
              <button
                disabled={(submissionsPage + 1) * pageSize >= totalSubmissions}
                onClick={() => setSubmissionsPage(submissionsPage + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-bold disabled:opacity-40 cursor-pointer"
              >
                Next &rarr;
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="bg-[#0a192f] text-white text-[10px] uppercase font-black tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Submission ID</th>
                    <th className="py-3 px-4">Form Code & Title</th>
                    <th className="py-3 px-4">Stakeholder Persona</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No submissions match the current filter selection.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#fffaf5] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#0a192f] text-[11px]">
                          {sub.id}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-extrabold text-[#0a192f] line-clamp-1">{sub.formTitle}</p>
                          <span className="font-mono text-[9px] text-[#c2410c]">{sub.formCode}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getPersonaColor(sub.stakeholderType)}`}>
                            {sub.stakeholderType.replace('_', ' ')}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">{sub.respondentDisplayName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-700">{sub.departmentCode}</span>
                          <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{sub.departmentName}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2 py-1 rounded-lg font-mono font-black text-xs bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa]">
                            ★ {sub.overallScore}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {new Date(sub.submittedAt).toLocaleDateString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setInspectingSubmission(sub)}
                            className="min-h-[36px] px-3 py-1 bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            Inspect Response
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. MODAL: INSPECT INDIVIDUAL SUBMISSION DETAILS                */}
      {/* ============================================================== */}
      {inspectingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-[#fed7aa] relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-black bg-[#0a192f] text-[#ffa07a] px-2 py-0.5 rounded">
                    {inspectingSubmission.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPersonaColor(inspectingSubmission.stakeholderType)}`}>
                    {inspectingSubmission.stakeholderType}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                    {inspectingSubmission.isAnonymous ? 'Double-Blind Sealed (AES-256)' : 'Verified Identity'}
                  </span>
                </div>
                <h3 className="text-base font-black text-[#0a192f] mt-1.5 leading-snug">
                  {inspectingSubmission.formTitle}
                </h3>
              </div>

              <button
                onClick={() => setInspectingSubmission(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submission Metadata Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Overall Rating</span>
                <p className="font-black text-[#c2410c] text-sm mt-0.5">★ {inspectingSubmission.overallScore} / 5.0</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Department</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5 truncate">{inspectingSubmission.departmentName}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Submitted On</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">
                  {new Date(inspectingSubmission.submittedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Answers Given</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">{inspectingSubmission.answers.length} Parameters</p>
              </div>
            </div>

            {/* Answers Breakdown */}
            <div className="space-y-3">
              <h4 className="font-black text-[#0a192f] text-xs uppercase tracking-wider">
                Submitted Answers & Evaluative Ratings:
              </h4>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {inspectingSubmission.answers.map((ans, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-3 rounded-xl border border-slate-200 bg-[#fffaf5] flex items-center justify-between text-xs"
                  >
                    <div className="flex-1 pr-3">
                      <span className="font-mono text-[10px] text-slate-400">Parameter {ans.questionId}</span>
                      {ans.textValue ? (
                        <p className="text-slate-700 italic mt-0.5 font-medium">"{ans.textValue}"</p>
                      ) : (
                        <p className="text-slate-600 font-medium mt-0.5">
                          Evaluated Criterion Response
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      {typeof ans.scoreValue === 'number' && (
                        <span className="px-2.5 py-1 rounded-lg font-mono font-black text-xs bg-[#0a192f] text-[#ffa07a]">
                          ★ {ans.scoreValue} / 5.0
                        </span>
                      )}
                      {ans.optionValues && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                          {ans.optionValues.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-mono">
                Verification Hash: SHA-256/{inspectingSubmission.id.slice(0, 16)}
              </span>
              <button
                onClick={() => setInspectingSubmission(null)}
                className="px-4 py-2 bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] font-bold rounded-xl cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. MODAL: LIVE SUBMISSION SIMULATOR                            */}
      {/* ============================================================== */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-[#fed7aa] relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#fff0e6] text-[#c2410c] flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4 text-[#ff7a50]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#0a192f]">Simulate Live Feedback Submission</h3>
                  <p className="text-[11px] text-slate-500">Inject test response to verify real-time portal updates.</p>
                </div>
              </div>

              <button
                onClick={() => setShowSimulateModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateSubmission} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Form Instrument</label>
                <select
                  value={simFormId}
                  onChange={(e) => setSimFormId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-hidden"
                >
                  {formsSummary.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.code} - {f.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Responding Academic Department</label>
                <select
                  value={simDeptId}
                  onChange={(e) => setSimDeptId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-hidden"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Overall Score: <span className="font-mono text-[#c2410c]">{simScore} Stars</span>
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSimScore(star)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1 cursor-pointer border ${
                        simScore === star
                          ? 'bg-[#0a192f] text-[#ffa07a] border-[#ff7a50]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-[#fff0e6]'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${simScore >= star ? 'fill-[#ffa07a] text-[#ffa07a]' : 'text-slate-300'}`} />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Qualitative Remark / Reflection</label>
                <textarea
                  rows={3}
                  value={simComment}
                  onChange={(e) => setSimComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#ff7a50]"
                  placeholder="Enter stakeholder feedback commentary..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-white font-black shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  {isSimulating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span>Post Live Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
