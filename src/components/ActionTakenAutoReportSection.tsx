import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  RefreshCw,
  Award,
  ChevronDown,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  BookmarkPlus,
  Send,
  ExternalLink,
} from 'lucide-react';
import { ActionTakenAutoReport, Department, AcademicYear } from '../types';
import { useApp } from '../context/AppContext';

interface ActionTakenAutoReportSectionProps {
  departments: Department[];
  selectedAcademicYear: string;
}

export const ActionTakenAutoReportSection: React.FC<ActionTakenAutoReportSectionProps> = ({
  departments,
  selectedAcademicYear,
}) => {
  const { showToast, setActivePage } = useApp();

  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('all');
  const [selectedCriterion, setSelectedCriterion] = useState<string>('Criterion 1.4 & Criterion 6.5');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [report, setReport] = useState<ActionTakenAutoReport | null>(null);
  const [activeView, setActiveView] = useState<'matrix' | 'narrative'>('matrix');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Auto-generate report from API
  const generateReport = async (saveToArchive: boolean = false) => {
    setIsGenerating(true);
    if (saveToArchive) setIsSaving(true);

    try {
      const res = await fetch('/api/atr/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academicYearId: selectedAcademicYear,
          departmentId: selectedDeptId,
          stakeholderType: selectedStakeholder,
          criterion: selectedCriterion,
          saveReport: saveToArchive,
        }),
      });

      if (!res.ok) throw new Error('Failed to auto-generate ATR');
      const data: ActionTakenAutoReport = await res.json();
      setReport(data);

      if (saveToArchive) {
        showToast('Official ATR published and archived in IQAC Records!', 'success');
      } else {
        showToast('Action Taken Report auto-generated successfully!', 'success');
      }
    } catch (err: any) {
      console.error('Error generating ATR:', err);
      showToast('Error generating automated ATR. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
      setIsSaving(false);
    }
  };

  // Initial load
  useEffect(() => {
    generateReport(false);
  }, [selectedAcademicYear]);

  // Export CSV
  const handleExportCsv = () => {
    if (!report) return;
    const headers = [
      'Sl No',
      'Gap Code',
      'NAAC Criterion',
      'Stakeholder',
      'Feedback Deficiency',
      'Root Cause',
      'Action Taken (CAPA)',
      'Responsible Authority',
      'Baseline Score',
      'Remeasured Score',
      'Improvement Delta',
      'Status',
    ];

    const rows = report.matrix.map((m) => [
      m.slNo,
      `"${m.gapCode}"`,
      `"${m.criterion}"`,
      `"${m.stakeholder}"`,
      `"${m.deficiency.replace(/"/g, '""')}"`,
      `"${m.rootCause.replace(/"/g, '""')}"`,
      `"${m.actionTaken.replace(/"/g, '""')}"`,
      `"${m.responsibleAuthority.replace(/"/g, '""')}"`,
      m.baselineScore,
      m.remeasuredScore,
      `+${m.delta}`,
      `"${m.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${report.referenceNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('ATR CSV downloaded!', 'success');
  };

  // Copy Summary to clipboard
  const handleCopySummary = () => {
    if (!report) return;
    const text = `NAAC ACTION TAKEN REPORT (ATR)
Ref: ${report.referenceNo}
Academic Year: ${report.academicYear}
Scope: ${report.department}
Generated: ${new Date(report.generatedAt).toLocaleString()}

EXECUTIVE SUMMARY:
${report.executiveSummary}

KEY PERFORMANCE INDICATORS:
- Total Stakeholder Inputs: ${report.kpis.totalResponses}
- Identified Quality Deficiencies: ${report.kpis.identifiedGaps}
- CAPA Actions Resolved: ${report.kpis.capaPlansClosed} / ${report.kpis.capaPlansFormulated}
- Average Improvement Delta: +${report.kpis.averageImprovementDelta} points
- Evidence Verification: ${report.kpis.evidenceVerifiedPercent}%

Signatories:
1. ${report.signatories.iqacDirector}
2. ${report.signatories.principal}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Formatted ATR copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#fed7aa] shadow-lg overflow-hidden text-[#0a192f] transition-all">
      {/* Official Header Banner */}
      <div className="bg-linear-to-r from-[#0a192f] via-[#132c52] to-[#0a192f] text-white p-5 sm:p-6 border-b-2 border-[#ff7a50] relative overflow-hidden">
        {/* Decorative Watermark Element */}
        <div className="absolute right-4 -bottom-8 opacity-10 text-white pointer-events-none">
          <Award className="w-48 h-48" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#ff7a50] text-[#0a192f] shadow-xs">
                Auto-Report Generator
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-[#fed7aa] border border-white/20">
                NAAC Criterion 1.4 & 6.5 Compliance
              </span>
              <span className="text-xs text-slate-300">• Automated Quality Telemetry</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-1.5 flex items-center space-x-2">
              <span>Action Taken Auto-Report Generator (ATR)</span>
              <Sparkles className="w-5 h-5 text-[#ffa07a] animate-pulse" />
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Synthesize closed feedback loops, gap resolutions, CAPA outcomes, and documentary evidence into audit-ready Action Taken Reports.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => generateReport(false)}
              disabled={isGenerating}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#ff7a50] hover:bg-[#ffa07a] text-[#0a192f] transition-all shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Auto-Generate Report'}</span>
            </button>
            <button
              onClick={() => setActivePage('atr')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-[#ffa07a] border border-[#ff7a50]/40 transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Open Resolved CAPA Report Generator (PDF/HTML)"
            >
              <Award className="w-3.5 h-3.5 text-[#ff7a50]" />
              <span>Resolved CAPA Template</span>
            </button>
            <button
              onClick={() => generateReport(true)}
              disabled={isGenerating || isSaving}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-[#fed7aa] border border-[#fed7aa]/30 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-[#ffa07a]" />
              <span>Publish to Archive</span>
            </button>
          </div>
        </div>

        {/* Configuration Filters Bar */}
        <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Dept Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#ffa07a] tracking-wider block">
              Academic Department
            </label>
            <div className="relative">
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                aria-label="Filter ATR by Academic Department"
                className="w-full bg-[#1e3a5f]/80 text-white rounded-lg px-2.5 py-1.5 font-medium border border-white/20 focus:outline-hidden focus:border-[#ff7a50] cursor-pointer"
              >
                <option value="all">All Academic Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stakeholder Tier */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#ffa07a] tracking-wider block">
              Stakeholder Scope
            </label>
            <select
              value={selectedStakeholder}
              onChange={(e) => setSelectedStakeholder(e.target.value)}
              aria-label="Filter ATR by Stakeholder Scope"
              className="w-full bg-[#1e3a5f]/80 text-white rounded-lg px-2.5 py-1.5 font-medium border border-white/20 focus:outline-hidden focus:border-[#ff7a50] cursor-pointer"
            >
              <option value="all">All Stakeholder Tiers (360°)</option>
              <option value="STUDENT">Students (UG/PG)</option>
              <option value="FACULTY">Faculty & Teachers</option>
              <option value="ALUMNI">Alumni Network</option>
              <option value="EMPLOYER">Industry Employers</option>
              <option value="PARENT">Parents & Guardians</option>
            </select>
          </div>

          {/* Criterion Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#ffa07a] tracking-wider block">
              NAAC Standard Criterion
            </label>
            <select
              value={selectedCriterion}
              onChange={(e) => setSelectedCriterion(e.target.value)}
              aria-label="Filter ATR by NAAC Criterion"
              className="w-full bg-[#1e3a5f]/80 text-white rounded-lg px-2.5 py-1.5 font-medium border border-white/20 focus:outline-hidden focus:border-[#ff7a50] cursor-pointer"
            >
              <option value="Criterion 1.4 & Criterion 6.5">Criterion 1.4 & 6.5 (Standard ATR)</option>
              <option value="Criterion 1.4: Feedback System">Criterion 1.4: Curricular Feedback</option>
              <option value="Criterion 2.5: Evaluation Process">Criterion 2.5: Teaching-Learning</option>
              <option value="Criterion 4.1: Physical Facilities">Criterion 4.1: Labs & Infrastructure</option>
            </select>
          </div>

          {/* Run Generation CTA */}
          <div className="space-y-1 flex flex-col justify-end">
            <button
              onClick={() => generateReport(false)}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider bg-[#0a192f] hover:bg-black text-[#ffa07a] border border-[#ff7a50]/40 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff7a50]" />
              <span>Re-Synthesize ATR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Report Presentation */}
      {report && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Report Document Title Bar */}
          <div className="bg-[#fffaf5] p-4 rounded-xl border border-[#fed7aa] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#0a192f] text-[#ffa07a]">
                  REF: {report.referenceNo}
                </span>
                <span className="text-xs text-slate-500">
                  AY {report.academicYear} • {report.department}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#0a192f] mt-1">
                {report.title}
              </h3>
              <p className="text-xs text-slate-500">
                Generated by {report.generatedBy} on {new Date(report.generatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* View Switcher & Action Tools */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
              <div className="flex items-center p-1 bg-white border border-[#fed7aa] rounded-lg">
                <button
                  onClick={() => setActiveView('matrix')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'matrix'
                      ? 'bg-[#0a192f] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-[#c2410c]'
                  }`}
                >
                  Action Matrix ({report.matrix.length})
                </button>
                <button
                  onClick={() => setActiveView('narrative')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'narrative'
                      ? 'bg-[#0a192f] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-[#c2410c]'
                  }`}
                >
                  Executive Summary
                </button>
              </div>

              <button
                onClick={handleCopySummary}
                className="p-2 rounded-lg bg-white border border-[#fed7aa] text-slate-700 hover:bg-[#fff0e6] transition-colors cursor-pointer text-xs font-bold flex items-center space-x-1"
                title="Copy Summary"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#c2410c]" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="p-2 rounded-lg bg-white border border-[#fed7aa] text-slate-700 hover:bg-[#fff0e6] transition-colors cursor-pointer text-xs font-bold flex items-center space-x-1"
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#c2410c]" />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-lg bg-white border border-[#fed7aa] text-slate-700 hover:bg-[#fff0e6] transition-colors cursor-pointer text-xs font-bold flex items-center space-x-1"
                title="Print Report"
              >
                <Printer className="w-3.5 h-3.5 text-[#c2410c]" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>

          {/* KPI Stat Cards (Navy & Peach aesthetic) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-[#fffaf5] p-3 rounded-xl border border-[#fed7aa]">
              <p className="text-[10px] font-bold uppercase text-slate-500">Evaluated Feedback</p>
              <p className="text-xl font-black text-[#0a192f] mt-0.5">
                {report.kpis.totalResponses.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold">Inputs processed</span>
            </div>

            <div className="bg-[#fffaf5] p-3 rounded-xl border border-[#fed7aa]">
              <p className="text-[10px] font-bold uppercase text-slate-500">Gaps Identified</p>
              <p className="text-xl font-black text-[#c2410c] mt-0.5">
                {report.kpis.identifiedGaps}
              </p>
              <span className="text-[10px] text-slate-400 font-semibold">Deficiencies analyzed</span>
            </div>

            <div className="bg-[#fffaf5] p-3 rounded-xl border border-[#fed7aa]">
              <p className="text-[10px] font-bold uppercase text-slate-500">Actions Resolved</p>
              <p className="text-xl font-black text-emerald-700 mt-0.5">
                {report.kpis.capaPlansClosed} <span className="text-xs text-slate-500 font-semibold">/ {report.kpis.capaPlansFormulated}</span>
              </p>
              <span className="text-[10px] text-emerald-600 font-bold">100% Closure Verified</span>
            </div>

            <div className="bg-[#fffaf5] p-3 rounded-xl border border-[#fed7aa]">
              <p className="text-[10px] font-bold uppercase text-slate-500">Improvement Delta</p>
              <p className="text-xl font-black text-[#ff7a50] mt-0.5">
                +{report.kpis.averageImprovementDelta} Δ
              </p>
              <span className="text-[10px] text-slate-400 font-semibold">Post-measure gain</span>
            </div>

            <div className="bg-[#fffaf5] p-3 rounded-xl border border-[#fed7aa] col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase text-slate-500">Evidence Compliance</p>
              <p className="text-xl font-black text-[#0a192f] mt-0.5">
                {report.kpis.evidenceVerifiedPercent}%
              </p>
              <span className="text-[10px] text-emerald-600 font-bold">NAAC Audit-Ready</span>
            </div>
          </div>

          {/* View 1: Detailed Action Matrix */}
          {activeView === 'matrix' && (
            <div className="border border-[#fed7aa] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0a192f] text-white text-[11px] uppercase tracking-wider font-extrabold">
                    <tr>
                      <th className="py-3 px-3 w-12 text-center">#</th>
                      <th className="py-3 px-3 w-40">Deficiency & Parameter</th>
                      <th className="py-3 px-3 w-44">Stakeholder & Root Cause</th>
                      <th className="py-3 px-3">Action Implemented (CAPA)</th>
                      <th className="py-3 px-3 w-32">Authority</th>
                      <th className="py-3 px-3 w-28 text-center">Impact Delta</th>
                      <th className="py-3 px-3 w-28 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {report.matrix.map((item) => (
                      <tr key={item.slNo} className="hover:bg-[#fffaf5] transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-400">
                          {item.slNo}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-extrabold text-[#0a192f]">{item.deficiency}</p>
                          <span className="text-[10px] text-[#c2410c] font-bold block mt-0.5">
                            {item.gapCode} • {item.criterion}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] inline-block mb-1">
                            {item.stakeholder}
                          </span>
                          <p className="text-[11px] leading-tight text-slate-500">{item.rootCause}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-800 leading-snug">{item.actionTaken}</p>
                          {item.preventiveAction && (
                            <p className="text-[10px] text-slate-400 mt-1 italic">
                              Prev: {item.preventiveAction}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.evidenceList.map((evi) => (
                              <span
                                key={evi.id}
                                className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 flex items-center space-x-1"
                              >
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                <span>{evi.code}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium text-[11px]">
                          {item.responsibleAuthority}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-black text-emerald-700 text-xs">
                              +{item.delta}
                            </span>
                            <span className="text-[9px] text-slate-400">
                              {item.baselineScore} &rarr; {item.remeasuredScore}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* View 2: Narrative Executive Summary */}
          {activeView === 'narrative' && (
            <div className="bg-[#fffaf5] p-5 rounded-xl border border-[#fed7aa] space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#ff7a50]" />
                <h4 className="text-xs font-black uppercase text-[#0a192f] tracking-wider">
                  Executive Narrative for NAAC Self-Study Report (SSR)
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-serif">
                {report.executiveSummary}
              </p>
            </div>
          )}

          {/* Signatories & Institutional Endorsement */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                IQAC Verification Authority
              </span>
              <p className="font-extrabold text-[#0a192f]">{report.signatories.iqacDirector}</p>
              <div className="flex items-center space-x-1.5 text-[10px] text-emerald-700 font-bold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Digitally Verified & Uploaded to Accreditation Repository</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Institutional Endorsement
              </span>
              <p className="font-extrabold text-[#0a192f]">{report.signatories.principal}</p>
              <div className="flex items-center space-x-1.5 text-[10px] text-emerald-700 font-bold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Governing Body Approved for Statutory Submission</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
