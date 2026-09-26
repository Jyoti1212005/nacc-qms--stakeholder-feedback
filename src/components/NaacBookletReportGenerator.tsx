import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  Sparkles,
  Award,
  Users,
  Building2,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  BarChart3,
  PieChart as PieIcon,
  BookOpen,
  Image as ImageIcon,
  FolderArchive,
  Maximize2,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';

interface NaacBookletReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  initialAcademicYear?: string;
}

export const NaacBookletReportGenerator: React.FC<NaacBookletReportGeneratorProps> = ({
  isOpen,
  onClose,
  initialAcademicYear = '2024 - 2025',
}) => {
  const { showToast } = useApp();

  // Configuration options
  const [institutionName, setInstitutionName] = useState('I.K. Gujral Punjab Technical University');
  const [campusName, setCampusName] = useState('Amritsar Campus');
  const [systemCode, setSystemCode] = useState('IKGPTU-QMS');
  const [academicYear, setAcademicYear] = useState(initialAcademicYear);
  const [accreditationGrade, setAccreditationGrade] = useState('A++');
  const [reportDate, setReportDate] = useState('30 April 2025');
  const [activePageTab, setActivePageTab] = useState<number | 'all'>('all');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Data matching the user's reference report image
  const stakeholderDetailsData = [
    { type: 'Students', invited: 800, responded: 650, responseRate: '81.25%', share: 66, color: '#2563eb' },
    { type: 'Faculty', invited: 180, responded: 120, responseRate: '66.67%', share: 12, color: '#f97316' },
    { type: 'Alumni', invited: 200, responded: 150, responseRate: '75.00%', share: 15, color: '#10b981' },
    { type: 'Parents', invited: 100, responded: 72, responseRate: '72.00%', share: 7, color: '#ec4899' },
    { type: 'Employers', invited: 80, responded: 45, responseRate: '56.25%', share: 4, color: '#8b5cf6' },
    { type: 'Other Stakeholders', invited: 50, responded: 40, responseRate: '80.00%', share: 3, color: '#06b6d4' },
  ];

  const overallResponseRateChartData = [
    { name: 'Students', rate: 81.25, fill: '#3b82f6' },
    { name: 'Faculty', rate: 66.67, fill: '#f97316' },
    { name: 'Alumni', rate: 75.0, fill: '#10b981' },
    { name: 'Parents', rate: 72.0, fill: '#ec4899' },
    { name: 'Employers', rate: 56.25, fill: '#8b5cf6' },
    { name: 'Others', rate: 80.0, fill: '#06b6d4' },
  ];

  const questionWiseScores = [
    { parameter: 'Curriculum Relevance', score: 4.32 },
    { parameter: 'Teaching-Learning Process', score: 4.25 },
    { parameter: 'Lab / Classroom Infrastructure', score: 3.98 },
    { parameter: 'Student Support & Mentoring', score: 4.10 },
    { parameter: 'Governance & Management', score: 3.87 },
    { parameter: 'Overall Satisfaction', score: 4.12 },
  ];

  const departmentWiseData = [
    { dept: 'Computer Science & Engineering', code: 'CSE', score: 4.28, rate: '82%', fill: '#3b82f6' },
    { dept: 'Electronics & Communication Engg.', code: 'ECE', score: 4.15, rate: '76%', fill: '#10b981' },
    { dept: 'Mechanical Engineering', code: 'Mech', score: 3.98, rate: '71%', fill: '#f59e0b' },
    { dept: 'Civil Engineering', code: 'Civil', score: 3.92, rate: '68%', fill: '#8b5cf6' },
    { dept: 'Applied Sciences', code: 'Applied Sci', score: 4.05, rate: '74%', fill: '#6366f1' },
    { dept: 'Management Studies', code: 'Mgmt', score: 4.12, rate: '69%', fill: '#0ea5e9' },
  ];

  const atrTableData = [
    {
      issue: 'Need for more industry interaction (Students)',
      action: 'Organized industry visits & expert lectures',
      responsible: 'T&P Cell',
      targetDate: 'Dec 2024',
      status: 'Completed',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      issue: 'Improvement in computer labs (Infrastructure)',
      action: 'Upgraded systems and software',
      responsible: 'Dean (Infra)',
      targetDate: 'Jan 2025',
      status: 'Completed',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      issue: 'Research guidance and support (Faculty)',
      action: 'Research workshops conducted',
      responsible: 'Research Cell',
      targetDate: 'Mar 2025',
      status: 'In Progress',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      issue: 'More placement opportunities (Employers)',
      action: 'Strengthened MoUs with industry partners',
      responsible: 'T&P Cell',
      targetDate: 'Apr 2025',
      status: 'Planned',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStandaloneHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NAAC Evidence Report - ${institutionName}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0a192f; margin: 0; padding: 20px; background: #e2e8f0; }
    .booklet-page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto 20px auto; background: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.1); box-sizing: border-box; page-break-after: always; position: relative; }
    .page-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0a192f; padding-bottom: 8px; margin-bottom: 18px; }
    .page-footer { position: absolute; bottom: 12mm; left: 20mm; right: 20mm; display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 6px; font-size: 10px; color: #64748b; font-weight: bold; }
    .section-title { font-size: 18px; font-weight: 900; color: #0a192f; border-bottom: 3px solid #ff7a50; display: inline-block; padding-bottom: 3px; margin-bottom: 14px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 14px; }
    th { background: #0a192f; color: #ffffff; padding: 8px 10px; text-align: left; }
    td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; }
    .card { background: #fffaf5; border: 1px solid #fed7aa; border-radius: 8px; padding: 14px; margin-bottom: 14px; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-info { background: #dbeafe; color: #1e40af; }
  </style>
</head>
<body>
  <div class="booklet-page">
    <div style="text-align: center; padding-top: 40px;">
      <h2 style="font-size: 22px; color: #0a192f; margin: 0;">${institutionName}</h2>
      <h3 style="font-size: 15px; color: #ff7a50; margin: 5px 0;">${campusName}</h3>
      <p style="font-size: 11px; color: #64748b; letter-spacing: 2px;">KNOWLEDGE | INNOVATION | EXCELLENCE</p>
      <div style="margin: 30px 0; padding: 25px; border: 3px solid #0a192f; border-radius: 12px; background: #fffaf5;">
        <p style="font-size: 13px; font-weight: bold; color: #c2410c; margin: 0;">NAAC Stakeholder Feedback & Quality Management System</p>
        <h1 style="font-size: 28px; color: #0a192f; margin: 10px 0;">(${systemCode})</h1>
        <hr style="border: 0; border-top: 3px solid #ff7a50; width: 60%; margin: 15px auto;">
        <h2 style="font-size: 26px; color: #0a192f; margin: 10px 0;">NAAC Evidence Report</h2>
        <p style="font-size: 14px; font-weight: bold; color: #334155;">Academic Year: ${academicYear}</p>
        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">Collect • Analyse • Improve • Document</p>
      </div>
      <div style="margin-top: 50px; font-size: 12px;">
        <p><strong>Prepared by:</strong><br>IQAC, ${institutionName}, ${campusName}</p>
        <p><strong>Date:</strong> ${reportDate}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NAAC-Evidence-Report-${academicYear.replace(/\s+/g, '')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Standalone NAAC Evidence Report HTML downloaded!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-6xl bg-slate-100 rounded-3xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden border border-slate-300 print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Top Floating Control Bar (Hidden when printing) */}
        <div className="bg-[#0a192f] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#ff7a50] shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff7a50] text-[#0a192f] flex items-center justify-center font-black shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-white/20 text-[#fed7aa]">
                  Booklet Engine
                </span>
                <span className="text-xs text-slate-300">• Multi-Page NAAC Evidence Report</span>
              </div>
              <h2 className="text-base font-black text-white tracking-tight">
                {institutionName} ({systemCode})
              </h2>
            </div>
          </div>

          {/* Quick Page Jump Tabs */}
          <div className="hidden lg:flex items-center p-1 bg-white/10 rounded-xl border border-white/20 text-xs">
            <button
              onClick={() => setActivePageTab('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activePageTab === 'all' ? 'bg-[#ff7a50] text-[#0a192f]' : 'text-slate-300 hover:text-white'
              }`}
            >
              All Pages View
            </button>
            <button
              onClick={() => setActivePageTab(1)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePageTab === 1 ? 'bg-[#ff7a50] text-[#0a192f]' : 'text-slate-300 hover:text-white'
              }`}
            >
              Cover
            </button>
            <button
              onClick={() => setActivePageTab(2)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePageTab === 2 ? 'bg-[#ff7a50] text-[#0a192f]' : 'text-slate-300 hover:text-white'
              }`}
            >
              TOC
            </button>
            <button
              onClick={() => setActivePageTab(3)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePageTab === 3 ? 'bg-[#ff7a50] text-[#0a192f]' : 'text-slate-300 hover:text-white'
              }`}
            >
              1. Exec Summary
            </button>
            <button
              onClick={() => setActivePageTab(4)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePageTab === 4 ? 'bg-[#ff7a50] text-[#0a192f]' : 'text-slate-300 hover:text-white'
              }`}
            >
              2. Profile
            </button>
            <button
              onClick={() => setActivePageTab(5)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePageTab === 5 ? 'bg-[#ff7a50] text-[#0a192f]' : 'text-slate-300 hover:text-white'
              }`}
            >
              3. Stakeholders
            </button>
            <button
              onClick={() => setActivePageTab(6)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePageTab === 6 ? 'bg-[#ff7a50] text-[#0a192f]' : 'text-slate-300 hover:text-white'
              }`}
            >
              4. Collection
            </button>
            <button
              onClick={() => setActivePageTab(7)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePageTab === 7 ? 'bg-[#ff7a50] text-[#0a192f]' : 'text-slate-300 hover:text-white'
              }`}
            >
              5. Findings
            </button>
            <button
              onClick={() => setActivePageTab(8)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePageTab === 8 ? 'bg-[#ff7a50] text-[#0a192f]' : 'text-slate-300 hover:text-white'
              }`}
            >
              6. Depts
            </button>
            <button
              onClick={() => setActivePageTab(9)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePageTab === 9 ? 'bg-[#ff7a50] text-[#0a192f]' : 'text-slate-300 hover:text-white'
              }`}
            >
              8. ATR
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#ff7a50] hover:bg-[#ffa07a] text-[#0a192f] text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownloadStandaloneHtml}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#fed7aa] border border-white/20 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Download Standalone HTML"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download HTML</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close report generator"
              className="min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Close report generator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Bar (Customizable Title, Year, Campus) - Hidden in Print */}
        <div className="bg-[#fffaf5] px-5 py-2.5 border-b border-[#fed7aa] flex flex-wrap items-center gap-3 text-xs text-slate-700 print:hidden">
          <div className="flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff7a50]" />
            <span className="font-extrabold text-[#0a192f]">Report Settings:</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-slate-500 font-semibold">Institution:</span>
            <input
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className="bg-white px-2 py-1 rounded border border-[#fed7aa] font-bold text-[#0a192f] text-xs w-48"
            />
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-slate-500 font-semibold">Campus:</span>
            <input
              type="text"
              value={campusName}
              onChange={(e) => setCampusName(e.target.value)}
              className="bg-white px-2 py-1 rounded border border-[#fed7aa] font-bold text-[#0a192f] text-xs w-36"
            />
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-slate-500 font-semibold">Year:</span>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="bg-white px-2 py-1 rounded border border-[#fed7aa] font-bold text-[#0a192f] text-xs w-28"
            />
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-slate-500 font-semibold">Grade:</span>
            <input
              type="text"
              value={accreditationGrade}
              onChange={(e) => setAccreditationGrade(e.target.value)}
              className="bg-white px-2 py-1 rounded border border-[#fed7aa] font-black text-[#c2410c] text-xs w-16 text-center"
            />
          </div>

          <div className="ml-auto text-[11px] text-slate-500 font-semibold">
            Auto-formatted for standard <strong>A4 Portrait (210mm × 297mm)</strong>
          </div>
        </div>

        {/* Scrollable Report Content Area (Renders the exact 9-card visual layout from the image) */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-12 bg-slate-200/70 print:p-0 print:bg-white print:space-y-0">

          {/* ============================================================== */}
          {/* PAGE 1: COVER PAGE                                             */}
          {/* ============================================================== */}
          {(activePageTab === 'all' || activePageTab === 1) && (
            <div className="bg-white mx-auto w-full max-w-[820px] min-h-[1080px] p-10 sm:p-14 rounded-2xl shadow-xl flex flex-col justify-between border-2 border-[#fed7aa] relative overflow-hidden print:border-none print:shadow-none print:p-12 print:rounded-none print:page-break-after-always">
              {/* Subtle top background wave */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-[#fed7aa]/30 via-[#ff7a50]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Cover Header */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-[#0a192f] pb-5">
                  {/* Left Institutional Crest */}
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-full bg-linear-to-tr from-[#0a192f] via-[#132c52] to-[#c2410c] p-0.5 shadow-md flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center p-1">
                        <Award className="w-5 h-5 text-[#c2410c]" />
                        <span className="text-[7px] font-black tracking-tighter text-[#0a192f] leading-none uppercase">
                          ESTD 2013
                        </span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#0a192f] tracking-tight leading-tight">
                        {institutionName}
                      </h2>
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#c2410c]">
                        {campusName}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">
                        Knowledge | Innovation | Excellence
                      </p>
                    </div>
                  </div>

                  {/* Right NAAC Grade Crest */}
                  <div className="w-14 h-14 rounded-full bg-linear-to-b from-[#ff7a50] to-[#c2410c] p-1 shadow-md flex flex-col items-center justify-center text-center text-white">
                    <span className="text-sm font-black leading-none">{accreditationGrade}</span>
                    <span className="text-[8px] font-extrabold uppercase tracking-tighter mt-0.5">NAAC</span>
                    <span className="text-[6px] font-medium opacity-90 leading-none">Accredited</span>
                  </div>
                </div>

                {/* Central Title Block */}
                <div className="mt-16 text-center space-y-6">
                  <div className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] shadow-xs">
                    Quality Assurance Protocol
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black text-[#0a192f] tracking-tight leading-snug">
                    NAAC <br />
                    Stakeholder Feedback <br />
                    & Quality Management System <br />
                    <span className="text-[#c2410c]">({systemCode})</span>
                  </h1>

                  <div className="w-32 h-1 bg-[#ff7a50] mx-auto rounded-full" />

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] tracking-tight">
                    NAAC Evidence Report
                  </h2>

                  <div className="inline-block bg-[#0a192f] text-[#ffa07a] font-mono text-sm font-extrabold px-5 py-2 rounded-xl shadow-md border border-[#fed7aa]/30">
                    Academic Year: {academicYear}
                  </div>

                  <p className="text-sm font-bold text-slate-600 tracking-wider">
                    Collect • Analyse • Improve • Document
                  </p>
                </div>
              </div>

              {/* Cover Footer */}
              <div className="pt-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Prepared by:
                  </span>
                  <p className="font-extrabold text-[#0a192f] text-sm">
                    IQAC, {institutionName} {campusName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Internal Quality Assurance Cell • Accreditation Secretariat
                  </p>
                </div>

                <div className="text-center sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Submission Date:
                  </span>
                  <p className="font-mono font-bold text-[#0a192f] text-sm">
                    {reportDate}
                  </p>
                </div>
              </div>

              {/* Decorative Bottom Graphic Curve */}
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-linear-to-tr from-[#0a192f] to-[#132c52] rounded-full opacity-10 pointer-events-none" />
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 2: TABLE OF CONTENTS                                      */}
          {/* ============================================================== */}
          {(activePageTab === 'all' || activePageTab === 2) && (
            <div className="bg-white mx-auto w-full max-w-[820px] min-h-[1080px] p-10 sm:p-14 rounded-2xl shadow-xl flex flex-col justify-between border-2 border-[#fed7aa] print:border-none print:shadow-none print:p-12 print:rounded-none print:page-break-after-always">
              <div>
                {/* Standard Page Header */}
                <div className="flex items-center justify-between border-b pb-2 mb-6 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#0a192f]">{institutionName}, {campusName}</span>
                  </div>
                  <span className="font-black text-[#c2410c] uppercase text-[10px]">NAAC {accreditationGrade}</span>
                </div>

                {/* Section Title Banner */}
                <div className="bg-[#0a192f] text-white px-5 py-3 rounded-xl border-l-4 border-[#ff7a50] mb-6">
                  <h2 className="text-base font-black uppercase tracking-wider">
                    Table of Contents
                  </h2>
                </div>

                {/* TOC Table */}
                <div className="border border-[#fed7aa] rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0a192f] text-white text-[10px] uppercase font-black">
                      <tr>
                        <th className="py-2.5 px-4 w-16 text-center">Sr. No.</th>
                        <th className="py-2.5 px-4">Section Name & Domain</th>
                        <th className="py-2.5 px-4 w-24 text-right">Page No.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {[
                        { sr: 1, name: 'Executive Summary', page: 3 },
                        { sr: 2, name: 'Institutional Profile', page: 4 },
                        { sr: 3, name: 'Stakeholder Details', page: 5 },
                        { sr: 4, name: 'Feedback Collection Summary', page: 6 },
                        { sr: 5, name: 'Analysis & Key Findings', page: 8 },
                        { sr: 6, name: 'Department-wise Analysis', page: 12 },
                        { sr: 7, name: 'Programme-wise Analysis', page: 14 },
                        { sr: 8, name: 'Action Taken Report (ATR)', page: 16 },
                        { sr: 9, name: 'Supporting Evidence', page: 18 },
                        { sr: 10, name: 'NAAC Evidence Repository', page: 22 },
                        { sr: 11, name: 'Conclusion & Recommendations', page: 26 },
                        { sr: 12, name: 'Annexures', page: 27 },
                      ].map((item) => (
                        <tr key={item.sr} className="hover:bg-[#fffaf5] transition-colors">
                          <td className="py-2.5 px-4 text-center font-bold text-slate-400">
                            {item.sr}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-[#0a192f]">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-[#c2410c]">
                            {item.page}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Standard Page Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>{systemCode} | NAAC Evidence Report ({academicYear})</span>
                <span>Page 2 of 27</span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 3: 1. EXECUTIVE SUMMARY                                   */}
          {/* ============================================================== */}
          {(activePageTab === 'all' || activePageTab === 3) && (
            <div className="bg-white mx-auto w-full max-w-[820px] min-h-[1080px] p-10 sm:p-14 rounded-2xl shadow-xl flex flex-col justify-between border-2 border-[#fed7aa] print:border-none print:shadow-none print:p-12 print:rounded-none print:page-break-after-always">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-2 mb-6 text-xs text-slate-600">
                  <span className="font-bold text-[#0a192f]">{institutionName}, {campusName}</span>
                  <span className="font-black text-[#c2410c] uppercase text-[10px]">NAAC {accreditationGrade}</span>
                </div>

                <div className="bg-[#0a192f] text-white px-5 py-3 rounded-xl border-l-4 border-[#ff7a50] mb-6">
                  <h2 className="text-base font-black uppercase tracking-wider">
                    1. Executive Summary
                  </h2>
                </div>

                {/* Narrative Description */}
                <div className="space-y-4 text-xs leading-relaxed text-slate-700 font-serif">
                  <p>
                    This report presents the consolidated analysis of stakeholder feedback collected through the <strong>{systemCode} (NAAC Stakeholder Feedback & Quality Management System)</strong> for the academic year <strong>{academicYear}</strong>. The feedback was gathered from students, faculty, alumni, parents, employers and other stakeholders to assess various aspects of the institution, including curriculum, teaching-learning, infrastructure, research, governance and overall academic environment.
                  </p>
                  <p>
                    The report includes key findings, graphical analysis, department-wise and programme-wise comparisons, action taken reports (ATR), supporting evidence and the NAAC evidence repository, ensuring a complete and transparent quality assurance process.
                  </p>
                </div>

                {/* Key Highlights Box Matching the exact visual in user photo */}
                <div className="mt-8 bg-[#fffaf5] border-2 border-[#fed7aa] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-[#0a192f] uppercase tracking-wider border-b border-[#fed7aa] pb-2">
                    Key Highlights
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-[#fed7aa]/50">
                      <div className="flex items-center space-x-2.5">
                        <Users className="w-4 h-4 text-[#ff7a50]" />
                        <span className="font-bold text-slate-700">Total Stakeholders Invited</span>
                      </div>
                      <span className="font-mono font-black text-slate-900">: 1,250</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#fed7aa]/50">
                      <div className="flex items-center space-x-2.5">
                        <FileText className="w-4 h-4 text-[#ff7a50]" />
                        <span className="font-bold text-slate-700">Total Responses Received</span>
                      </div>
                      <span className="font-mono font-black text-slate-900">: 987</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#fed7aa]/50">
                      <div className="flex items-center space-x-2.5">
                        <BarChart3 className="w-4 h-4 text-[#ff7a50]" />
                        <span className="font-bold text-slate-700">Response Rate</span>
                      </div>
                      <span className="font-mono font-black text-[#c2410c]">: 78.96%</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-2.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-700">Overall Satisfaction Score</span>
                      </div>
                      <span className="font-mono font-black text-emerald-700">: 4.12 / 5.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Page Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>{systemCode} | NAAC Evidence Report ({academicYear})</span>
                <span>Page 3 of 27</span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 4: 2. INSTITUTIONAL PROFILE                               */}
          {/* ============================================================== */}
          {(activePageTab === 'all' || activePageTab === 4) && (
            <div className="bg-white mx-auto w-full max-w-[820px] min-h-[1080px] p-10 sm:p-14 rounded-2xl shadow-xl flex flex-col justify-between border-2 border-[#fed7aa] print:border-none print:shadow-none print:p-12 print:rounded-none print:page-break-after-always">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-6 text-xs text-slate-600">
                  <span className="font-bold text-[#0a192f]">{institutionName}, {campusName}</span>
                  <span className="font-black text-[#c2410c] uppercase text-[10px]">NAAC {accreditationGrade}</span>
                </div>

                <div className="bg-[#0a192f] text-white px-5 py-3 rounded-xl border-l-4 border-[#ff7a50] mb-6">
                  <h2 className="text-base font-black uppercase tracking-wider">
                    2. Institutional Profile
                  </h2>
                </div>

                {/* Profile Key-Value Table */}
                <div className="border border-[#fed7aa] rounded-xl overflow-hidden shadow-xs mb-6">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr className="hover:bg-[#fffaf5]">
                        <td className="py-2.5 px-4 font-bold text-slate-500 w-52 bg-slate-50/70">Name of the Institution</td>
                        <td className="py-2.5 px-4 font-extrabold text-[#0a192f]">{institutionName}</td>
                      </tr>
                      <tr className="hover:bg-[#fffaf5]">
                        <td className="py-2.5 px-4 font-bold text-slate-500 bg-slate-50/70">Campus</td>
                        <td className="py-2.5 px-4 font-bold text-[#0a192f]">{campusName}</td>
                      </tr>
                      <tr className="hover:bg-[#fffaf5]">
                        <td className="py-2.5 px-4 font-bold text-slate-500 bg-slate-50/70">Type</td>
                        <td className="py-2.5 px-4 font-bold text-[#0a192f]">State University / Autonomous Center</td>
                      </tr>
                      <tr className="hover:bg-[#fffaf5]">
                        <td className="py-2.5 px-4 font-bold text-slate-500 bg-slate-50/70">Accreditation</td>
                        <td className="py-2.5 px-4 font-bold text-[#c2410c]">NAAC ({accreditationGrade})</td>
                      </tr>
                      <tr className="hover:bg-[#fffaf5]">
                        <td className="py-2.5 px-4 font-bold text-slate-500 bg-slate-50/70">Year of Establishment</td>
                        <td className="py-2.5 px-4 font-bold text-[#0a192f]">2013</td>
                      </tr>
                      <tr className="hover:bg-[#fffaf5]">
                        <td className="py-2.5 px-4 font-bold text-slate-500 bg-slate-50/70">Courses Offered</td>
                        <td className="py-2.5 px-4 font-bold text-[#0a192f]">UG / PG / Ph.D.</td>
                      </tr>
                      <tr className="hover:bg-[#fffaf5]">
                        <td className="py-2.5 px-4 font-bold text-slate-500 bg-slate-50/70">Total Students</td>
                        <td className="py-2.5 px-4 font-bold text-[#0a192f]">5,200+</td>
                      </tr>
                      <tr className="hover:bg-[#fffaf5]">
                        <td className="py-2.5 px-4 font-bold text-slate-500 bg-slate-50/70">Total Faculty</td>
                        <td className="py-2.5 px-4 font-bold text-[#0a192f]">320+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Campus Architecture Illustration / Photo Frame */}
                <div className="bg-[#fffaf5] border-2 border-[#fed7aa] rounded-2xl p-4 text-center">
                  <div className="w-full h-48 rounded-xl bg-linear-to-tr from-[#0a192f] via-[#132c52] to-[#1e3a5f] flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner">
                    <Building2 className="w-16 h-16 text-[#ffa07a] opacity-80 mb-2" />
                    <span className="font-extrabold text-sm tracking-wide text-[#fed7aa]">
                      {institutionName} — {campusName}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      Academic, Innovation & Research Infrastructure Complex
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">
                    {institutionName} Amritsar Campus
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>{systemCode} | NAAC Evidence Report ({academicYear})</span>
                <span>Page 4 of 27</span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 5: 3. STAKEHOLDER DETAILS                                 */}
          {/* ============================================================== */}
          {(activePageTab === 'all' || activePageTab === 5) && (
            <div className="bg-white mx-auto w-full max-w-[820px] min-h-[1080px] p-10 sm:p-14 rounded-2xl shadow-xl flex flex-col justify-between border-2 border-[#fed7aa] print:border-none print:shadow-none print:p-12 print:rounded-none print:page-break-after-always">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-6 text-xs text-slate-600">
                  <span className="font-bold text-[#0a192f]">{institutionName}, {campusName}</span>
                  <span className="font-black text-[#c2410c] uppercase text-[10px]">NAAC {accreditationGrade}</span>
                </div>

                <div className="bg-[#0a192f] text-white px-5 py-3 rounded-xl border-l-4 border-[#ff7a50] mb-6">
                  <h2 className="text-base font-black uppercase tracking-wider">
                    3. Stakeholder Details
                  </h2>
                </div>

                {/* Stakeholder Details Table */}
                <div className="border border-[#fed7aa] rounded-xl overflow-hidden shadow-xs mb-6">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0a192f] text-white text-[10px] uppercase font-black">
                      <tr>
                        <th className="py-2.5 px-4">Stakeholder Type</th>
                        <th className="py-2.5 px-4 text-center">Invited</th>
                        <th className="py-2.5 px-4 text-center">Responded</th>
                        <th className="py-2.5 px-4 text-center">Response Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {stakeholderDetailsData.map((row) => (
                        <tr key={row.type} className="hover:bg-[#fffaf5] transition-colors">
                          <td className="py-2.5 px-4 font-extrabold text-[#0a192f]">{row.type}</td>
                          <td className="py-2.5 px-4 text-center font-bold text-slate-600">{row.invited}</td>
                          <td className="py-2.5 px-4 text-center font-bold text-[#0a192f]">{row.responded}</td>
                          <td className="py-2.5 px-4 text-center font-mono font-black text-[#c2410c]">{row.responseRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Donut Chart: Stakeholder-wise Response Distribution */}
                <div className="bg-[#fffaf5] border border-[#fed7aa] rounded-2xl p-5 shadow-xs">
                  <h3 className="text-xs font-black text-[#0a192f] uppercase tracking-wider text-center mb-2">
                    Stakeholder-wise Response Distribution
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-7 h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stakeholderDetailsData}
                            dataKey="share"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={2}
                          >
                            {stakeholderDetailsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="sm:col-span-5 space-y-1.5 text-[11px]">
                      {stakeholderDetailsData.map((stk) => (
                        <div key={stk.type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stk.color }} />
                            <span className="font-bold text-slate-700">{stk.type}</span>
                          </div>
                          <span className="font-mono font-black text-slate-900">({stk.share}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>{systemCode} | NAAC Evidence Report ({academicYear})</span>
                <span>Page 5 of 27</span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 6: 4. FEEDBACK COLLECTION SUMMARY                         */}
          {/* ============================================================== */}
          {(activePageTab === 'all' || activePageTab === 6) && (
            <div className="bg-white mx-auto w-full max-w-[820px] min-h-[1080px] p-10 sm:p-14 rounded-2xl shadow-xl flex flex-col justify-between border-2 border-[#fed7aa] print:border-none print:shadow-none print:p-12 print:rounded-none print:page-break-after-always">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-6 text-xs text-slate-600">
                  <span className="font-bold text-[#0a192f]">{institutionName}, {campusName}</span>
                  <span className="font-black text-[#c2410c] uppercase text-[10px]">NAAC {accreditationGrade}</span>
                </div>

                <div className="bg-[#0a192f] text-white px-5 py-3 rounded-xl border-l-4 border-[#ff7a50] mb-6">
                  <h2 className="text-base font-black uppercase tracking-wider">
                    4. Feedback Collection Summary
                  </h2>
                </div>

                {/* Overall Response Rate Bar Chart */}
                <div className="bg-[#fffaf5] border border-[#fed7aa] rounded-xl p-4 shadow-xs mb-6">
                  <h3 className="text-xs font-black text-[#0a192f] uppercase tracking-wider mb-2">
                    Overall Response Rate
                  </h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={overallResponseRateChartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                        <Tooltip formatter={(value: any) => [`${value}%`, 'Response Rate']} />
                        <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                          {overallResponseRateChartData.map((entry, index) => (
                            <Cell key={`bar-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Two Sub-Cards: Channels & Feedback Types */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Channels */}
                  <div className="bg-[#fffaf5] border border-[#fed7aa] rounded-xl p-4 space-y-2.5">
                    <h4 className="font-black text-[#0a192f] uppercase text-[11px] border-b border-[#fed7aa] pb-1.5">
                      Feedback Collection Channels
                    </h4>
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Web Portal (Login)</span>
                        <span className="font-mono font-black text-[#0a192f]">70%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Unique Link</span>
                        <span className="font-mono font-black text-[#0a192f]">15%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">QR Code</span>
                        <span className="font-mono font-black text-[#0a192f]">10%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Email Invitation</span>
                        <span className="font-mono font-black text-[#0a192f]">5%</span>
                      </div>
                    </div>
                  </div>

                  {/* Types */}
                  <div className="bg-[#fffaf5] border border-[#fed7aa] rounded-xl p-4 space-y-2.5">
                    <h4 className="font-black text-[#0a192f] uppercase text-[11px] border-b border-[#fed7aa] pb-1.5">
                      Feedback Types
                    </h4>
                    <div className="space-y-1.5 pt-1">
                      {[
                        'Curriculum & Academics',
                        'Teaching-Learning',
                        'Infrastructure',
                        'Student Support',
                        'Governance & Administration',
                        'Overall Feedback',
                      ].map((type) => (
                        <div key={type} className="flex items-center space-x-2 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-bold">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>{systemCode} | NAAC Evidence Report ({academicYear})</span>
                <span>Page 6 of 27</span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 7: 5. ANALYSIS & KEY FINDINGS                             */}
          {/* ============================================================== */}
          {(activePageTab === 'all' || activePageTab === 7) && (
            <div className="bg-white mx-auto w-full max-w-[820px] min-h-[1080px] p-10 sm:p-14 rounded-2xl shadow-xl flex flex-col justify-between border-2 border-[#fed7aa] print:border-none print:shadow-none print:p-12 print:rounded-none print:page-break-after-always">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-6 text-xs text-slate-600">
                  <span className="font-bold text-[#0a192f]">{institutionName}, {campusName}</span>
                  <span className="font-black text-[#c2410c] uppercase text-[10px]">NAAC {accreditationGrade}</span>
                </div>

                <div className="bg-[#0a192f] text-white px-5 py-3 rounded-xl border-l-4 border-[#ff7a50] mb-6">
                  <h2 className="text-base font-black uppercase tracking-wider">
                    5. Analysis & Key Findings
                  </h2>
                </div>

                {/* 5.1 Question-wise Analysis */}
                <div className="bg-[#fffaf5] border border-[#fed7aa] rounded-xl p-4 shadow-xs mb-6">
                  <h3 className="text-xs font-black text-[#0a192f] uppercase tracking-wider mb-2">
                    5.1 Question-wise Analysis
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={questionWiseScores}
                        margin={{ top: 10, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="parameter" tick={{ fontSize: 9, fontWeight: 700 }} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#2563eb" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center text-[10px] text-slate-400 font-bold mt-1">
                    Average Score (out of 5)
                  </p>
                </div>

                {/* Sentiment Breakdown Badges matching user image */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#fffaf5] border-2 border-emerald-300 rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-1 shadow-xs">
                    <span className="text-2xl">😊</span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Positive Feedback
                    </span>
                    <span className="text-3xl font-black text-emerald-700">76%</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Responses</span>
                  </div>

                  <div className="bg-[#fffaf5] border-2 border-amber-300 rounded-2xl p-5 text-center flex flex-col items-center justify-center space-y-1 shadow-xs">
                    <span className="text-2xl">💬</span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Suggestions / Improvement Areas
                    </span>
                    <span className="text-3xl font-black text-amber-700">24%</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Responses</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>{systemCode} | NAAC Evidence Report ({academicYear})</span>
                <span>Page 8 of 27</span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 8: 6. DEPARTMENT-WISE ANALYSIS                            */}
          {/* ============================================================== */}
          {(activePageTab === 'all' || activePageTab === 8) && (
            <div className="bg-white mx-auto w-full max-w-[820px] min-h-[1080px] p-10 sm:p-14 rounded-2xl shadow-xl flex flex-col justify-between border-2 border-[#fed7aa] print:border-none print:shadow-none print:p-12 print:rounded-none print:page-break-after-always">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-6 text-xs text-slate-600">
                  <span className="font-bold text-[#0a192f]">{institutionName}, {campusName}</span>
                  <span className="font-black text-[#c2410c] uppercase text-[10px]">NAAC {accreditationGrade}</span>
                </div>

                <div className="bg-[#0a192f] text-white px-5 py-3 rounded-xl border-l-4 border-[#ff7a50] mb-6">
                  <h2 className="text-base font-black uppercase tracking-wider">
                    6. Department-wise Analysis
                  </h2>
                </div>

                {/* Table */}
                <div className="border border-[#fed7aa] rounded-xl overflow-hidden shadow-xs mb-6">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0a192f] text-white text-[10px] uppercase font-black">
                      <tr>
                        <th className="py-2.5 px-4">Department</th>
                        <th className="py-2.5 px-4 text-center">Average Score</th>
                        <th className="py-2.5 px-4 text-center">Response Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {departmentWiseData.map((d) => (
                        <tr key={d.code} className="hover:bg-[#fffaf5] transition-colors">
                          <td className="py-2.5 px-4 font-extrabold text-[#0a192f]">{d.dept}</td>
                          <td className="py-2.5 px-4 text-center font-bold text-slate-800">{d.score}</td>
                          <td className="py-2.5 px-4 text-center font-mono font-black text-[#c2410c]">{d.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Department-wise Bar Chart */}
                <div className="bg-[#fffaf5] border border-[#fed7aa] rounded-xl p-4 shadow-xs">
                  <h3 className="text-xs font-black text-[#0a192f] uppercase tracking-wider mb-2">
                    Department-wise Average Score
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentWiseData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="code" tick={{ fontSize: 10, fontWeight: 700 }} />
                        <YAxis domain={[3.0, 5.0]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                          {departmentWiseData.map((entry, index) => (
                            <Cell key={`dept-bar-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>{systemCode} | NAAC Evidence Report ({academicYear})</span>
                <span>Page 12 of 27</span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* PAGE 9: 8. ACTION TAKEN REPORT (ATR)                           */}
          {/* ============================================================== */}
          {(activePageTab === 'all' || activePageTab === 9) && (
            <div className="bg-white mx-auto w-full max-w-[820px] min-h-[1080px] p-10 sm:p-14 rounded-2xl shadow-xl flex flex-col justify-between border-2 border-[#fed7aa] print:border-none print:shadow-none print:p-12 print:rounded-none print:page-break-after-always">
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-6 text-xs text-slate-600">
                  <span className="font-bold text-[#0a192f]">{institutionName}, {campusName}</span>
                  <span className="font-black text-[#c2410c] uppercase text-[10px]">NAAC {accreditationGrade}</span>
                </div>

                <div className="bg-[#0a192f] text-white px-5 py-3 rounded-xl border-l-4 border-[#ff7a50] mb-6">
                  <h2 className="text-base font-black uppercase tracking-wider">
                    8. Action Taken Report (ATR)
                  </h2>
                </div>

                {/* ATR Table matching user image */}
                <div className="border border-[#fed7aa] rounded-xl overflow-hidden shadow-xs mb-6">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0a192f] text-white text-[10px] uppercase font-black">
                      <tr>
                        <th className="py-2.5 px-3 w-44">Observation / Issue</th>
                        <th className="py-2.5 px-3">Action Taken</th>
                        <th className="py-2.5 px-3 w-24">Responsible</th>
                        <th className="py-2.5 px-3 w-20 text-center">Target Date</th>
                        <th className="py-2.5 px-3 w-24 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {atrTableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#fffaf5] transition-colors">
                          <td className="py-3 px-3 font-extrabold text-[#0a192f] leading-snug">
                            {row.issue}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700 leading-snug">
                            {row.action}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-600 text-[11px]">
                            {row.responsible}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500">
                            {row.targetDate}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${row.badgeColor}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Evidence Documents Strip matching bottom of page 16 in user image */}
                <div className="bg-[#fffaf5] border border-[#fed7aa] rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black text-[#0a192f] uppercase tracking-wider">
                    Evidence Documents
                  </h3>
                  <div className="flex flex-wrap items-center justify-around gap-4 text-center pt-1">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#fed7aa] flex items-center justify-center shadow-xs">
                        <FileText className="w-5 h-5 text-[#c2410c]" />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#0a192f]">Circulars</span>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#fed7aa] flex items-center justify-center shadow-xs">
                        <ImageIcon className="w-5 h-5 text-[#3b82f6]" />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#0a192f]">Photographs</span>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#fed7aa] flex items-center justify-center shadow-xs">
                        <BookOpen className="w-5 h-5 text-[#10b981]" />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#0a192f]">Meeting Minutes</span>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#fed7aa] flex items-center justify-center shadow-xs">
                        <Award className="w-5 h-5 text-[#8b5cf6]" />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#0a192f]">Reports</span>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#fed7aa] flex items-center justify-center shadow-xs">
                        <Calendar className="w-5 h-5 text-[#f59e0b]" />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#0a192f]">Timetables</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>{systemCode} | NAAC Evidence Report ({academicYear})</span>
                <span>Page 16 of 27</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
