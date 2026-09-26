import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  X,
  Layers,
  ArrowRight,
  Building,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';
import { AiAtrReportData } from '../types';
import { useApp } from '../context/AppContext';
import { QrCodeSvg } from './QrCodeSvg';
import { LiveQrVerificationModal } from './LiveQrVerificationModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedAcademicYear?: string;
  preselectedDepartmentId?: string;
}

export const AiAtrReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preselectedAcademicYear = 'ay-5',
  preselectedDepartmentId = 'all',
}) => {
  const { showToast, departments, academicYears } = useApp();
  const [selectedYear, setSelectedYear] = useState<string>(preselectedAcademicYear);
  const [selectedDept, setSelectedDept] = useState<string>(preselectedDepartmentId);
  const [report, setReport] = useState<AiAtrReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'matrix' | 'evidence'>('preview');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [showLiveQrModal, setShowLiveQrModal] = useState<boolean>(false);

  const printRef = useRef<HTMLDivElement>(null);

  const generationSteps = [
    'Synthesizing multi-stakeholder feedback (Students, Faculty, Alumni, Employers)...',
    'Auditing low-scoring metrics & deficiencies (< 4.0 / 5.0 threshold)...',
    'Correlating Closed Corrective & Preventive Action (CAPA) resolutions...',
    'Validating documentary evidence attachments and BoS / Academic Council approvals...',
    'Compiling NAAC Criterion 1.4 (Metrics 1.4.1 & 1.4.2) compliance documentation...',
  ];

  const generateReport = async (save = true) => {
    setIsGenerating(true);
    setGenerationStep(0);

    // Step simulation for high-impact responsive feedback
    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const res = await fetch('/api/ai/atr-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academicYearId: selectedYear,
          departmentId: selectedDept,
          saveReport: save,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate report');
      const data: AiAtrReportData = await res.json();
      clearInterval(interval);
      setReport(data);
      showToast('Action Taken Report generated & verified against NAAC Criterion 1.4!', 'success');
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      showToast('Error generating Action Taken Report: ' + (err.message || 'Server error'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report) {
      generateReport(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const downloadHtmlReport = () => {
    if (!report) return;
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${report.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #1e293b; padding: 40px; background: #fff; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
    .inst-name { font-size: 20px; font-weight: 800; color: #0a192f; text-transform: uppercase; letter-spacing: 0.5px; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 12px; background: #e0f2fe; color: #0369a1; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 8px; }
    .doc-title { font-size: 18px; font-weight: 800; margin-top: 16px; color: #0f172a; }
    .meta-box { display: flex; justify-content: space-between; font-size: 12px; color: #475569; background: #f8fafc; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px; }
    .section-title { font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; border-left: 4px solid #2563eb; padding-left: 10px; margin: 24px 0 12px 0; }
    .summary-text { font-size: 13px; color: #334155; line-height: 1.6; text-align: justify; margin-bottom: 24px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .kpi-card { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; text-align: center; }
    .kpi-val { font-size: 20px; font-weight: 800; color: #0a192f; }
    .kpi-lbl { font-size: 11px; color: #64748b; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
    th { background: #f1f5f9; font-weight: 700; color: #0f172a; }
    .delta-badge { color: #15803d; font-weight: 800; background: #dcfce7; padding: 2px 6px; border-radius: 4px; }
    .sign-section { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 20px; }
    .sign-block { width: 45%; text-align: center; border-top: 1px solid #94a3b8; padding-top: 8px; font-size: 12px; font-weight: 700; color: #0f172a; }
  </style>
</head>
<body>
  <div class="header">
    <div class="inst-name">APEX INSTITUTE OF TECHNOLOGY & MANAGEMENT (AUTONOMOUS)</div>
    <div class="subtitle">Approved by AICTE • Affiliated to State Technological University • NAAC Accredited 'A+' Grade</div>
    <div class="badge">INTERNAL QUALITY ASSURANCE CELL (IQAC)</div>
    <div class="doc-title">${report.title}</div>
  </div>

  <div class="meta-box">
    <div><strong>Reference:</strong> ${report.referenceNo}</div>
    <div><strong>Academic Year:</strong> ${report.academicYear}</div>
    <div><strong>Date of Conclave:</strong> ${new Date(report.generatedAt).toLocaleDateString()}</div>
    <div><strong>Criterion Focus:</strong> NAAC 1.4.1 & 1.4.2</div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-val">${report.kpis.totalResponses}</div>
      <div class="kpi-lbl">Feedback Responses</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">${report.kpis.lowScoringMetricsCount}</div>
      <div class="kpi-lbl">Sub-4.0 Deficiencies</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">${report.kpis.capaPlansClosed} / ${report.kpis.capaPlansFormulated}</div>
      <div class="kpi-lbl">CAPA Actions Closed</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">+${report.kpis.averageImprovementDelta}★</div>
      <div class="kpi-lbl">Mean Satisfaction Δ</div>
    </div>
  </div>

  <div class="section-title">1. Executive Summary & Statutory Context</div>
  <div class="summary-text">${report.executiveSummary.replace(/\n/g, '<br><br>')}</div>

  <div class="section-title">2. Department-Wise Corrective Actions & Evidence Matrix</div>
  <table>
    <thead>
      <tr>
        <th style="width: 5%;">#</th>
        <th style="width: 15%;">Department</th>
        <th style="width: 25%;">Identified Deficiency (<4.0)</th>
        <th style="width: 30%;">Corrective & Preventive Action Implemented</th>
        <th style="width: 12%;">Score Δ</th>
        <th style="width: 13%;">Evidence Code</th>
      </tr>
    </thead>
    <tbody>
      ${report.matrix
        .map(
          (m) => `
        <tr>
          <td>${m.slNo}</td>
          <td><strong>${m.departmentCode}</strong><br><span style="font-size: 10px; color: #64748b;">${m.stakeholder}</span></td>
          <td><strong>${m.deficiency}</strong><br><span style="font-size: 11px; color: #64748b;">Cause: ${m.rootCause}</span></td>
          <td>${m.actionTaken}<br><strong style="font-size: 10px; color: #0369a1;">Preventive:</strong> <span style="font-size: 11px;">${m.preventiveAction}</span></td>
          <td>${m.baselineScore} → ${m.remeasuredScore}<br><span class="delta-badge">+${m.delta.toFixed(2)}</span></td>
          <td>${m.evidenceList.map((e) => `<span style="font-family: monospace; font-size: 11px;">${e.code}</span>`).join('<br>')}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="section-title">3. Statutory Verification & Public Disclosure Compliance</div>
  <p style="font-size: 12px; color: #475569; line-height: 1.5;">
    This Action Taken Report has been verified by the Internal Quality Assurance Cell (IQAC), ratified by the Academic Council, and placed in the public domain on the institutional website in statutory compliance with NAAC Criterion 1.4 (Sub-metric 1.4.2).
  </p>

  <div class="sign-section">
    <div class="sign-block">
      <div>Prof. Radhika Venkataraman, Ph.D.</div>
      <div style="font-size: 11px; font-weight: 500; color: #64748b;">Director, IQAC</div>
    </div>
    <div class="sign-block">
      <div>Dr. K. S. Krishnamurthy, M.Tech, Ph.D.</div>
      <div style="font-size: 11px; font-weight: 500; color: #64748b;">Principal & Chairperson, IQAC</div>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.referenceNo}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Formatted HTML Report exported successfully!', 'success');
  };

  const downloadCsv = () => {
    if (!report) return;
    const headers = [
      'Sl No',
      'Department',
      'Department Code',
      'Stakeholder Tier',
      'Criterion',
      'Identified Deficiency',
      'Root Cause',
      'Corrective Action Implemented',
      'Preventive Action / SOP',
      'Responsible Authority',
      'Baseline Score (<4.0)',
      'Remeasured Score',
      'Satisfaction Delta (+Δ)',
      'Verified Evidence Code',
      'NAAC Compliance Metric',
    ];

    const rows = report.matrix.map((m) => [
      m.slNo,
      `"${m.department}"`,
      m.departmentCode,
      `"${m.stakeholder}"`,
      `"${m.criterion}"`,
      `"${m.deficiency.replace(/"/g, '""')}"`,
      `"${m.rootCause.replace(/"/g, '""')}"`,
      `"${m.actionTaken.replace(/"/g, '""')}"`,
      `"${m.preventiveAction.replace(/"/g, '""')}"`,
      `"${m.responsibleAuthority}"`,
      m.baselineScore,
      m.remeasuredScore,
      `+${m.delta.toFixed(2)}`,
      `"${m.evidenceList.map((e) => e.code).join(', ')}"`,
      m.naacMetricRef,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.referenceNo}-Matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('NAAC Criterion 1.4 CSV Matrix exported successfully!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#0a192f] px-5 py-4 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  NAAC Criterion 1.4 Compliant
                </span>
                <span className="text-xs text-slate-400">• Metric 1.4.1 & 1.4.2</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
                Action Taken Report (ATR) Generator
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter / Scope Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <span className="font-semibold text-slate-500">Academic Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.name} {ay.isCurrent ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <span className="font-semibold text-slate-500">Department Scope:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Departments (Institutional)</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => generateReport(true)}
              disabled={isGenerating}
              className="px-3.5 py-1.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGenerating ? 'Synthesizing...' : 'Regenerate ATR'}</span>
            </button>
          </div>

          {/* Tab switches */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                activeTab === 'preview' ? 'bg-[#0a192f] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Official Document
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                activeTab === 'matrix' ? 'bg-[#0a192f] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolution Matrix ({report?.matrix.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                activeTab === 'evidence' ? 'bg-[#0a192f] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Evidence Attachments ({report?.evidenceAttachments.length || 0})
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-100/70">
          {isGenerating ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center max-w-lg mx-auto my-12 shadow-md">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 animate-bounce">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Synthesizing NAAC Criterion 1.4 Action Taken Report
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Parsing stakeholder feedback datasets, matching deficiencies (&lt; 4.0), and compiling verified CAPA evidence.
              </p>

              {/* Progress step */}
              <div className="mt-6 p-3 bg-blue-50/80 rounded-xl border border-blue-200/60 text-xs font-semibold text-blue-900 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" />
                <span>{generationSteps[generationStep]}</span>
              </div>
            </div>
          ) : !report ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-sm">Click "Generate ATR" to compile report.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Stakeholder Responses</span>
                  <span className="text-xl font-black text-slate-900 mt-0.5 block">{report.kpis.totalResponses}</span>
                  <span className="text-[10px] text-blue-600 font-semibold">Students, Faculty, Alumni, Employers</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sub-4.0 Deficiencies</span>
                  <span className="text-xl font-black text-red-600 mt-0.5 block">{report.kpis.lowScoringMetricsCount}</span>
                  <span className="text-[10px] text-slate-500 font-medium">Scoring below 4.0/5.0</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">CAPA Actions Closed</span>
                  <span className="text-xl font-black text-emerald-600 mt-0.5 block">
                    {report.kpis.capaPlansClosed} / {report.kpis.capaPlansFormulated}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">100% Remediated</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Mean Score Delta</span>
                  <span className="text-xl font-black text-indigo-600 mt-0.5 block">+{report.kpis.averageImprovementDelta}★</span>
                  <span className="text-[10px] text-indigo-700 font-semibold">Post-Intervention Remeasured</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">NAAC 1.4 Status</span>
                  <span className="text-xs font-black text-emerald-700 mt-1 block px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                    AUDITED & RATIFIED
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">100% Documentary Evidence</span>
                </div>
              </div>

              {/* View 1: Official Printable Document */}
              {activeTab === 'preview' && (
                <div
                  ref={printRef}
                  className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-md space-y-6 text-slate-900 print:p-0 print:border-none print:shadow-none"
                >
                  {/* Institutional Letterhead Header */}
                  <div className="border-b-2 border-slate-900 pb-5 text-center">
                    <div className="flex items-center justify-center space-x-2 text-xs font-black text-blue-900 uppercase tracking-widest mb-1">
                      <Building className="w-4 h-4 text-blue-600 inline" />
                      <span>Internal Quality Assurance Cell (IQAC)</span>
                    </div>
                    <h1 className="text-lg sm:text-2xl font-black text-[#0a192f] tracking-tight uppercase">
                      Apex Institute of Technology & Management (Autonomous)
                    </h1>
                    <p className="text-xs text-slate-600 mt-1">
                      Approved by AICTE • Affiliated to State Technological University • NAAC Accredited with 'A+' Grade (Cycle 3)
                    </p>
                    <div className="mt-3 inline-block px-3 py-1 bg-slate-900 text-white text-xs font-extrabold rounded-md uppercase tracking-wider">
                      {report.title}
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px]">DOCUMENT REF NO</span>
                      <span className="font-mono font-bold text-slate-900">{report.referenceNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px]">ACADEMIC YEAR</span>
                      <span className="font-bold text-slate-900">{report.academicYear}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px]">IQAC CONCLAVE DATE</span>
                      <span className="font-bold text-slate-900">{new Date(report.generatedAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px]">STATUTORY CRITERION</span>
                      <span className="font-bold text-blue-700">NAAC Criterion 1.4</span>
                    </div>
                  </div>

                  {/* Section 1: Executive Summary */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5 border-l-3 border-blue-600 pl-2">
                      <span>1. Executive Summary & Statutory Context</span>
                    </h3>
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2.5">
                      {report.executiveSummary.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Department-Wise Corrective Actions & Resolution Matrix */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5 border-l-3 border-blue-600 pl-2">
                        <span>2. Department-Wise Corrective Actions & Post-Intervention Remeasurements</span>
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Evaluated across 5 Critical Deficiencies (&lt; 4.0)
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold">
                            <th className="py-2.5 px-3 w-10 text-center">#</th>
                            <th className="py-2.5 px-3 w-36">Department</th>
                            <th className="py-2.5 px-3">Identified Deficiency (&lt;4.0) &amp; Root Cause</th>
                            <th className="py-2.5 px-3">Corrective &amp; Preventive Action</th>
                            <th className="py-2.5 px-3 w-28 text-center">Score Delta</th>
                            <th className="py-2.5 px-3 w-28">Evidence</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {report.matrix.map((m) => (
                            <tr key={m.slNo} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-center text-slate-500">{m.slNo}</td>
                              <td className="py-3 px-3 align-top">
                                <span className="font-extrabold text-blue-900 block">{m.departmentCode}</span>
                                <span className="text-[10px] text-slate-500 block">{m.department}</span>
                                <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 mt-1 inline-block">
                                  {m.stakeholder}
                                </span>
                              </td>
                              <td className="py-3 px-3 align-top">
                                <p className="font-bold text-slate-900">{m.deficiency}</p>
                                <p className="text-[11px] text-slate-500 mt-1">
                                  <strong>Root Cause:</strong> {m.rootCause}
                                </p>
                              </td>
                              <td className="py-3 px-3 align-top">
                                <p className="text-slate-800 leading-snug">{m.actionTaken}</p>
                                <p className="text-[11px] text-blue-800 mt-1">
                                  <strong>Preventive Measure:</strong> {m.preventiveAction}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">Lead: {m.responsibleAuthority}</p>
                              </td>
                              <td className="py-3 px-3 text-center align-top whitespace-nowrap">
                                <span className="text-slate-400 font-mono text-[11px] block">
                                  {m.baselineScore} → {m.remeasuredScore}
                                </span>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  +{m.delta.toFixed(2)}★
                                </span>
                              </td>
                              <td className="py-3 px-3 align-top">
                                <div className="space-y-1">
                                  {m.evidenceList.map((e) => (
                                    <span
                                      key={e.id}
                                      className="font-mono text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 block truncate"
                                      title={e.title}
                                    >
                                      {e.code}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Statutory Signatories Section */}
                  <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center">
                    <div className="space-y-1">
                      <div className="h-10 flex items-end justify-center">
                        <span className="font-serif italic font-bold text-blue-900 text-sm">
                          Radhika Venkataraman
                        </span>
                      </div>
                      <div className="border-t border-slate-400 pt-1">
                        <p className="font-extrabold text-xs text-slate-900">{report.signatories.iqacDirector}</p>
                        <p className="text-[10px] text-slate-500">Internal Quality Assurance Cell</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="h-10 flex items-end justify-center">
                        <span className="font-serif italic font-bold text-indigo-900 text-sm">
                          K. S. Krishnamurthy
                        </span>
                      </div>
                      <div className="border-t border-slate-400 pt-1">
                        <p className="font-extrabold text-xs text-slate-900">{report.signatories.principal}</p>
                        <p className="text-[10px] text-slate-500">Head of Institution & Chairperson, IQAC</p>
                      </div>
                    </div>
                  </div>

                  {/* Institutional Public Portal Notice & Live QR Verification */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex items-center space-x-3.5">
                      <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs shrink-0">
                        <QrCodeSvg value={`https://apex.edu/verify/${report.referenceNo}`} size={70} />
                      </div>
                      <div className="text-left space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-black text-[9px] uppercase">
                            Metric 1.4.2 Verified
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">{report.referenceNo}</span>
                        </div>
                        <p className="font-bold text-slate-800 text-xs">Official Institutional Transparency Record</p>
                        <p className="text-[11px] text-slate-500">
                          Scan to verify Board of Studies minutes and post-intervention remeasurements.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowLiveQrModal(true)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer shrink-0"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live Verification Certificate</span>
                    </button>
                  </div>
                </div>
              )}

              {/* View 2: Detailed Resolution Matrix */}
              {activeTab === 'matrix' && (
                <div className="space-y-4">
                  {report.matrix.map((m) => (
                    <div
                      key={m.slNo}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {m.gapCode}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{m.department} ({m.departmentCode})</span>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {m.stakeholder}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-slate-500">
                            Baseline: <strong className="text-red-600">{m.baselineScore}</strong> → Remeasured: <strong className="text-emerald-700">{m.remeasuredScore}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            +{m.delta.toFixed(2)}★
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 space-y-1">
                          <span className="font-bold text-red-900 block">Identified Deficiency (&lt;4.0):</span>
                          <p className="text-red-950">{m.deficiency}</p>
                          <span className="font-bold text-red-900 block mt-2">Root Cause Analysis:</span>
                          <p className="text-slate-700">{m.rootCause}</p>
                        </div>

                        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                          <span className="font-bold text-emerald-900 block">Corrective Action Taken:</span>
                          <p className="text-emerald-950">{m.actionTaken}</p>
                          <span className="font-bold text-emerald-900 block mt-2">Preventive Action / SOP Policy:</span>
                          <p className="text-slate-700">{m.preventiveAction}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                        <div>
                          <strong>Assigned Lead:</strong> {m.responsibleAuthority}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-600">Documentary Evidence:</span>
                          {m.evidenceList.map((e) => (
                            <span key={e.id} className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                              {e.code}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 3: Evidence Attachments Drawer */}
              {activeTab === 'evidence' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Criterion 1.4 Documentary Evidence Repository
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Statutory audit records confirming tangible execution of corrective and preventive actions.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {report.evidenceAttachments.map((evi) => (
                      <div key={evi.code} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                {evi.code}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{evi.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Category: {evi.category} • Verified by: {evi.verifiedBy} on {evi.verificationDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-black border border-emerald-200">
                            100% VERIFIED
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>NAAC Sub-Metric 1.4.1 & 1.4.2 Audit Ready</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowLiveQrModal(true)}
              disabled={!report}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>Verify QR Seal</span>
            </button>

            <button
              onClick={downloadCsv}
              disabled={!report}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={downloadHtmlReport}
              disabled={!report}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download HTML</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={!report}
              className="px-4 py-2 bg-[#0a192f] hover:bg-[#132c52] text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-[#ff7a50]" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live QR Verification Seal Modal */}
      {report && (
        <LiveQrVerificationModal
          isOpen={showLiveQrModal}
          onClose={() => setShowLiveQrModal(false)}
          referenceNo={report.referenceNo}
          academicYear={report.academicYear}
          departmentName={report.department}
          averageDelta={report.kpis.averageImprovementDelta}
          totalGapsRemediated={report.kpis.capaPlansClosed}
        />
      )}
    </div>
  );
};
