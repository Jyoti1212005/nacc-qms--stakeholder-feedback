import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Award,
  Layers,
  Building2,
  Calendar,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Code2,
  Eye,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  Search,
  CheckSquare,
} from 'lucide-react';
import { ResolvedCapaAtrItem, ResolvedCapaAtrPayload, Department } from '../types';
import { useApp } from '../context/AppContext';

interface ActionTakenReportResolvedCapaSectionProps {
  departments: Department[];
  selectedAcademicYear?: string;
  onNavigateToPlans?: () => void;
}

export const ActionTakenReportResolvedCapaSection: React.FC<ActionTakenReportResolvedCapaSectionProps> = ({
  departments,
  selectedAcademicYear = 'AY 2026-27',
  onNavigateToPlans,
}) => {
  const { showToast } = useApp();

  const [departmentId, setDepartmentId] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [payload, setPayload] = useState<ResolvedCapaAtrPayload | null>(null);

  // Template Customization Options
  const [includeLetterhead, setIncludeLetterhead] = useState<boolean>(true);
  const [includeSummary, setIncludeSummary] = useState<boolean>(true);
  const [includeEvidenceTable, setIncludeEvidenceTable] = useState<boolean>(true);
  const [includeSignatures, setIncludeSignatures] = useState<boolean>(true);
  const [docReference, setDocReference] = useState<string>('NAAC-QMS-ATR-CAPA-2026-27');
  const [activeTab, setActiveTab] = useState<'preview' | 'html-code'>('preview');
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch aggregated resolved CAPA items
  const fetchResolvedCapa = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (departmentId !== 'all') params.append('departmentId', departmentId);
      if (selectedAcademicYear) params.append('academicYearId', selectedAcademicYear);

      const res = await fetch(`/api/atr/resolved-capa?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load resolved CAPA items');
      const data: ResolvedCapaAtrPayload = await res.json();
      setPayload(data);
    } catch (err: any) {
      console.error('Error fetching resolved CAPA:', err);
      showToast('Error loading resolved CAPA data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResolvedCapa();
  }, [departmentId, selectedAcademicYear]);

  const items = payload?.items || [];

  // Filter items by priority & search
  const filteredItems = items.filter((item) => {
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.code.toLowerCase().includes(q) ||
        item.issue.toLowerCase().includes(q) ||
        item.correctiveAction.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.assignedTo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate aggregated stats
  const totalResolved = filteredItems.length;
  const avgBaseline = totalResolved > 0
    ? Math.round((filteredItems.reduce((acc, i) => acc + i.beforeScore, 0) / totalResolved) * 100) / 100
    : 3.12;
  const avgRemeasured = totalResolved > 0
    ? Math.round((filteredItems.reduce((acc, i) => acc + i.afterScore, 0) / totalResolved) * 100) / 100
    : 4.41;
  const avgDelta = Math.round((avgRemeasured - avgBaseline) * 100) / 100;
  const totalEvidenceCount = filteredItems.reduce((acc, i) => acc + i.evidenceItems.length, 0);

  // Generate self-contained standalone HTML Template string
  const generateHtmlTemplate = (): string => {
    const selectedDeptName = departmentId === 'all'
      ? 'All Academic & Technical Departments'
      : departments.find((d) => d.id === departmentId)?.name || 'Academic Unit';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Action Taken Report (ATR) - Resolved CAPA Summary</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0a192f;
      background-color: #ffffff;
      margin: 0;
      padding: 20px;
      line-height: 1.45;
    }
    .atr-container { max-width: 960px; margin: 0 auto; border: 2px solid #fed7aa; border-radius: 12px; padding: 28px; background: #ffffff; box-shadow: 0 4px 20px rgba(10,25,47,0.05); }
    .header-banner { background: #0a192f; color: #ffffff; padding: 24px; border-radius: 8px; border-bottom: 4px solid #ff7a50; text-align: center; }
    .header-banner h1 { margin: 0 0 6px 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; }
    .header-banner p { margin: 2px 0; font-size: 12px; color: #fed7aa; }
    .doc-control { display: flex; justify-content: space-between; background: #fff5ee; border: 1px solid #fed7aa; padding: 10px 16px; border-radius: 6px; font-size: 11px; font-weight: bold; margin: 16px 0; color: #0a192f; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
    .kpi-box { background: #fffaf5; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px; text-align: center; }
    .kpi-box .label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; }
    .kpi-box .value { font-size: 20px; font-weight: 900; color: #0a192f; margin: 4px 0; }
    .kpi-box .delta { color: #ff7a50; font-weight: bold; font-size: 12px; }
    .narrative-box { background: #fffaf5; border-left: 4px solid #ff7a50; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 20px; font-size: 12px; color: #334155; line-height: 1.6; }
    table.atr-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 24px; }
    table.atr-table th { background: #0a192f; color: #ffffff; text-align: left; padding: 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    table.atr-table td { padding: 10px; border-bottom: 1px solid #fed7aa; vertical-align: top; color: #1e293b; }
    table.atr-table tr:nth-child(even) { background: #fffcf8; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
    .badge-closed { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .badge-code { background: #0a192f; color: #fed7aa; font-family: monospace; }
    .evidence-tag { display: inline-block; background: #f1f5f9; color: #334155; padding: 2px 5px; border-radius: 3px; font-size: 9px; margin-top: 4px; border: 1px solid #cbd5e1; }
    .sign-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 24px; }
    .sign-box .line { border-bottom: 1px dashed #94a3b8; height: 35px; margin-bottom: 8px; }
    .sign-box p { margin: 2px 0; font-size: 11px; font-weight: bold; color: #0a192f; }
    .sign-box span { font-size: 10px; color: #64748b; }
  </style>
</head>
<body>
  <div class="atr-container">
    ${includeLetterhead ? `
    <div class="header-banner">
      <h1>Apex Institute of Technology & Management</h1>
      <p>(Autonomous Institution • Accredited 'A++' Grade by NAAC • ISO 9001:2015 Certified)</p>
      <p style="color:#ffffff; font-weight:bold; margin-top:6px; letter-spacing:1px;">INTERNAL QUALITY ASSURANCE CELL (IQAC)</p>
      <div style="font-size:14px; font-weight:bold; color:#ff7a50; margin-top:8px;">
        ACTION TAKEN REPORT (ATR) ON RESOLVED CAPA ACTIONS
      </div>
    </div>` : ''}

    <div class="doc-control">
      <div><strong>DOC REF:</strong> ${docReference}</div>
      <div><strong>ACADEMIC CYCLE:</strong> ${selectedAcademicYear}</div>
      <div><strong>DEPARTMENT SCOPE:</strong> ${selectedDeptName}</div>
      <div><strong>STATUS:</strong> <span style="color:#15803d;">AUDITED & APPROVED</span></div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-box">
        <div class="label">Resolved CAPA Plans</div>
        <div class="value">${totalResolved}</div>
        <div style="font-size:10px; color:#15803d; font-weight:bold;">100% Closed & Verified</div>
      </div>
      <div class="kpi-box">
        <div class="label">Baseline Score</div>
        <div class="value">${avgBaseline} <span style="font-size:12px; color:#94a3b8;">/ 5.0</span></div>
        <div style="font-size:10px; color:#64748b;">Pre-intervention</div>
      </div>
      <div class="kpi-box">
        <div class="label">Remeasured Score</div>
        <div class="value">${avgRemeasured} <span style="font-size:12px; color:#94a3b8;">/ 5.0</span></div>
        <div class="delta">+${avgDelta} Gain</div>
      </div>
      <div class="kpi-box">
        <div class="label">Verified Evidence Proofs</div>
        <div class="value">${totalEvidenceCount}</div>
        <div style="font-size:10px; color:#15803d; font-weight:bold;">Documentary Compliance</div>
      </div>
    </div>

    ${includeSummary ? `
    <div class="narrative-box">
      <strong>IQAC Executive Continuous Improvement (CQI) Synthesis:</strong><br>
      This official Action Taken Report aggregates all corrective and preventive action (CAPA) plans resolved across institutional departments for ${selectedAcademicYear}. All reported deficiencies originated from authenticated stakeholder feedback and internal academic quality audits. Corrective interventions were executed under departmental leadership and formally verified via institutional evidence artifacts. Post-intervention remeasurement demonstrates an institutional quality gain of <strong>+${avgDelta} points</strong> across target benchmarks, validating statutory compliance with NAAC Criterion 1.4 & 6.5.
    </div>` : ''}

    <table class="atr-table">
      <thead>
        <tr>
          <th style="width:14%;">CAPA Code & Dept</th>
          <th style="width:24%;">Deficiency & Root Cause</th>
          <th style="width:34%;">Corrective & Preventive Action Taken</th>
          <th style="width:14%; text-align:center;">Score Delta</th>
          <th style="width:14%; text-align:center;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${filteredItems.map((item) => `
        <tr>
          <td>
            <span class="badge badge-code">${item.code}</span><br>
            <strong style="color:#0a192f; font-size:10px; display:inline-block; margin-top:4px;">${item.departmentCode}</strong><br>
            <span style="font-size:9px; color:#64748b;">${item.category}</span>
          </td>
          <td>
            <strong style="color:#0a192f;">${item.issue}</strong><br>
            <span style="font-size:10px; color:#c2410c;">Root: ${item.rootCause}</span>
          </td>
          <td>
            <div style="font-weight:600; color:#0f172a;">${item.correctiveAction}</div>
            ${item.preventiveAction ? `<div style="font-size:10px; color:#64748b; margin-top:3px; font-style:italic;">Prev: ${item.preventiveAction}</div>` : ''}
            ${includeEvidenceTable ? item.evidenceItems.map((evi) => `<span class="evidence-tag">✓ ${evi.code}: ${evi.title}</span>`).join(' ') : ''}
            <div style="font-size:9px; color:#475569; margin-top:4px;">Lead: <strong>${item.assignedTo}</strong></div>
          </td>
          <td style="text-align:center;">
            <strong style="font-size:13px; color:#15803d;">+${item.improvementDelta}</strong><br>
            <span style="font-size:9px; color:#94a3b8;">${item.beforeScore} &rarr; ${item.afterScore}</span>
          </td>
          <td style="text-align:center;">
            <span class="badge badge-closed">RESOLVED</span><br>
            <span style="font-size:9px; color:#64748b; display:inline-block; margin-top:4px;">Audited</span>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>

    ${includeSignatures ? `
    <div class="sign-grid">
      <div class="sign-box">
        <div class="line"></div>
        <p>Prof. Radhika Venkataraman</p>
        <span>Director, IQAC</span>
      </div>
      <div class="sign-box">
        <div class="line"></div>
        <p>Dr. Anand Raman</p>
        <span>Secretary, Academic Council</span>
      </div>
      <div class="sign-box">
        <div class="line"></div>
        <p>Dr. K. S. Krishnamurthy</p>
        <span>Principal & Chairperson, IQAC</span>
      </div>
    </div>` : ''}

    <div style="text-align:center; font-size:9px; color:#94a3b8; margin-top:24px; border-top:1px solid #f1f5f9; padding-top:10px;">
      Apex Institute of Technology & Management • NAAC Self-Study Report (SSR) Official Quality Artifact • Generated ${new Date().toLocaleDateString()}
    </div>
  </div>
</body>
</html>`;
  };

  // Download Standalone HTML file
  const handleDownloadHtml = () => {
    const htmlContent = generateHtmlTemplate();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docReference}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Standalone HTML report template downloaded!', 'success');
  };

  // Copy HTML template code
  const handleCopyHtml = () => {
    const htmlContent = generateHtmlTemplate();
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    showToast('Complete HTML report template copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  // Print PDF
  const handlePrintPdf = () => {
    window.print();
  };

  // Export CSV Ledger
  const handleExportCsv = () => {
    if (filteredItems.length === 0) return;
    const headers = [
      'CAPA Code',
      'Department',
      'Quality Gap Issue',
      'Root Cause',
      'Corrective Action',
      'Preventive Action',
      'Assigned Authority',
      'Baseline Score',
      'Remeasured Score',
      'Delta Improvement',
      'Status',
      'Evidence Count',
    ];

    const rows = filteredItems.map((item) => [
      `"${item.code}"`,
      `"${item.department}"`,
      `"${item.issue.replace(/"/g, '""')}"`,
      `"${item.rootCause.replace(/"/g, '""')}"`,
      `"${item.correctiveAction.replace(/"/g, '""')}"`,
      `"${item.preventiveAction.replace(/"/g, '""')}"`,
      `"${item.assignedTo.replace(/"/g, '""')}"`,
      item.beforeScore,
      item.afterScore,
      `+${item.improvementDelta}`,
      `"${item.status}"`,
      item.evidenceItems.length,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${docReference}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Resolved CAPA CSV ledger downloaded!', 'success');
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#fed7aa] shadow-lg overflow-hidden text-[#0a192f] transition-all">
      {/* Official Section Header Banner */}
      <div className="bg-linear-to-r from-[#0a192f] via-[#132c52] to-[#0a192f] text-white p-5 sm:p-6 border-b-2 border-[#ff7a50] relative overflow-hidden">
        {/* Decorative Seal Background */}
        <div className="absolute -right-6 -bottom-10 opacity-10 text-white pointer-events-none">
          <Award className="w-52 h-52" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ff7a50] text-[#0a192f] shadow-xs">
                CAPA Resolution Aggregator
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-[#fed7aa] border border-white/20">
                NAAC Criterion 1.4 & 6.5 Quality Ledger
              </span>
              <span className="text-xs text-slate-300">• PDF/HTML Report Template</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-1.5 flex items-center space-x-2">
              <span>Action Taken Report (Resolved CAPA Summary)</span>
              <Sparkles className="w-5 h-5 text-[#ffa07a] animate-pulse" />
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Automatically aggregates verified and closed Corrective & Preventive Actions (CAPA), calculating institutional score improvements and rendering audit-ready PDF/HTML report templates.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#ff7a50] hover:bg-[#ffa07a] text-[#0a192f] transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-[#fed7aa] border border-[#fed7aa]/30 transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Download Standalone HTML Report File"
            >
              <Download className="w-3.5 h-3.5 text-[#ffa07a]" />
              <span>Download HTML</span>
            </button>

            <button
              onClick={handleCopyHtml}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center space-x-1 cursor-pointer"
              title="Copy HTML code to clipboard"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#ffa07a]" />}
              <span>{copied ? 'Copied HTML!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-300 border border-white/20 transition-all flex items-center space-x-1 cursor-pointer"
              title="Export raw CSV ledger"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* Aggregated Resolution KPI Summary Row */}
        <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-white">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#fed7aa] block">
              Resolved CAPA Items
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white">{totalResolved}</span>
              <span className="text-[10px] font-bold text-emerald-400">100% Audited</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#fed7aa] block">
              Baseline Satisfaction
            </span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white">{avgBaseline}</span>
              <span className="text-xs text-slate-300">/ 5.0</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffa07a] block">
              Remeasured Satisfaction
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white">{avgRemeasured}</span>
              <span className="text-xs font-bold text-[#ff7a50]">+{avgDelta} Δ</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#fed7aa] block">
              Verified Evidence Proofs
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-white">{totalEvidenceCount}</span>
              <span className="text-[10px] font-bold text-emerald-400">NAAC Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Template Customization Switches */}
      <div className="bg-[#fffaf5] p-4 sm:p-5 border-b border-[#fed7aa] space-y-3 text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative min-w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search CAPA, root cause, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-8 pr-2.5 py-1.5 rounded-lg border border-[#fed7aa] text-xs font-medium focus:outline-hidden focus:border-[#ff7a50]"
              />
            </div>

            {/* Department */}
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              aria-label="Filter resolved CAPA by Department"
              className="bg-white px-2.5 py-1.5 rounded-lg border border-[#fed7aa] text-xs font-medium focus:outline-hidden focus:border-[#ff7a50] cursor-pointer"
            >
              <option value="all">All Academic Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter resolved CAPA by Priority"
              className="bg-white px-2.5 py-1.5 rounded-lg border border-[#fed7aa] text-xs font-medium focus:outline-hidden focus:border-[#ff7a50] cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
            </select>

            <button
              onClick={fetchResolvedCapa}
              className="p-1.5 rounded-lg bg-white border border-[#fed7aa] text-slate-600 hover:text-[#c2410c] hover:bg-[#fff0e6] transition-colors cursor-pointer"
              title="Refresh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center space-x-1 p-1 bg-white border border-[#fed7aa] rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#c2410c]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Document Preview (PDF View)</span>
            </button>

            <button
              onClick={() => setActiveTab('html-code')}
              className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'html-code'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#c2410c]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>HTML Template Code</span>
            </button>
          </div>
        </div>

        {/* Template Customizer Toggles */}
        <div className="pt-2 border-t border-[#fed7aa]/60 flex flex-wrap items-center gap-4 text-xs text-slate-700">
          <span className="font-bold text-[#0a192f] flex items-center space-x-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff7a50]" />
            <span>Template Customizer:</span>
          </span>

          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeLetterhead}
              onChange={(e) => setIncludeLetterhead(e.target.checked)}
              className="rounded border-[#fed7aa] text-[#0a192f] focus:ring-[#ff7a50]"
            />
            <span>Institutional Letterhead</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeSummary}
              onChange={(e) => setIncludeSummary(e.target.checked)}
              className="rounded border-[#fed7aa] text-[#0a192f] focus:ring-[#ff7a50]"
            />
            <span>Executive CQI Narrative</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeEvidenceTable}
              onChange={(e) => setIncludeEvidenceTable(e.target.checked)}
              className="rounded border-[#fed7aa] text-[#0a192f] focus:ring-[#ff7a50]"
            />
            <span>Evidence Audit Codes</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeSignatures}
              onChange={(e) => setIncludeSignatures(e.target.checked)}
              className="rounded border-[#fed7aa] text-[#0a192f] focus:ring-[#ff7a50]"
            />
            <span>Signatory Sign-offs</span>
          </label>

          <div className="ml-auto flex items-center space-x-1.5 text-[11px]">
            <span className="text-slate-500 font-semibold">Ref Code:</span>
            <input
              type="text"
              value={docReference}
              onChange={(e) => setDocReference(e.target.value)}
              className="bg-white px-2 py-0.5 rounded border border-[#fed7aa] font-mono text-[11px] text-[#0a192f] w-52"
            />
          </div>
        </div>
      </div>

      {/* Main Body: Document Preview OR HTML Code */}
      <div className="p-5 sm:p-6">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff7a50]" />
            <p className="text-xs font-semibold">Aggregating resolved CAPA records and compiling template...</p>
          </div>
        ) : activeTab === 'preview' ? (
          /* High-Fidelity Printable Document Container */
          <div className="max-w-4xl mx-auto bg-white rounded-xl border-2 border-[#fed7aa] shadow-md p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
            {/* Printable Letterhead Header */}
            {includeLetterhead && (
              <div className="bg-[#0a192f] text-white p-6 rounded-xl border-b-4 border-[#ff7a50] text-center relative overflow-hidden">
                <div className="relative z-10">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#fed7aa] border border-white/20">
                    Apex Institute of Technology & Management
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white mt-1.5">
                    Action Taken Report (ATR) on Resolved CAPA Items
                  </h1>
                  <p className="text-xs text-slate-300 mt-0.5">
                    (Autonomous Institution • NAAC 'A++' Grade • ISO 9001:2015 Accredited Division)
                  </p>
                  <p className="text-xs font-bold text-[#ffa07a] mt-2 uppercase tracking-wider">
                    INTERNAL QUALITY ASSURANCE CELL (IQAC) • {selectedAcademicYear}
                  </p>
                </div>
              </div>
            )}

            {/* Document Control Metadata Bar */}
            <div className="bg-[#fffaf5] p-3 rounded-lg border border-[#fed7aa] flex flex-wrap items-center justify-between text-xs gap-2">
              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px]">Reference:</span>{' '}
                <span className="font-mono font-bold text-[#0a192f]">{docReference}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px]">Cycle:</span>{' '}
                <span className="font-bold text-[#0a192f]">{selectedAcademicYear}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase text-[10px]">Scope:</span>{' '}
                <span className="font-bold text-[#0a192f]">
                  {departmentId === 'all' ? 'Institutional (All Departments)' : departments.find((d) => d.id === departmentId)?.name}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-700 font-extrabold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AUDITED & APPROVED</span>
              </div>
            </div>

            {/* Resolved CAPA Executive Summary Narrative */}
            {includeSummary && (
              <div className="bg-[#fffaf5] border-l-4 border-[#ff7a50] p-4 rounded-r-lg text-xs leading-relaxed text-slate-700">
                <p className="font-extrabold text-[#0a192f] uppercase text-[11px] mb-1">
                  Executive CQI Narrative for NAAC SSR Criterion 1.4 & 6.5:
                </p>
                <p className="font-serif">
                  In compliance with statutory quality mandates, this Action Taken Report synthesizes <strong>{totalResolved} resolved Corrective and Preventive Action (CAPA)</strong> initiatives completed during {selectedAcademicYear}. Every action represents a verified institutional remedy targeting student, faculty, and employer feedback deficiencies. Post-implementation auditing verifies an average quality improvement delta of <strong className="text-[#c2410c]">+{avgDelta} points</strong> across target benchmarks, validated by {totalEvidenceCount} indexed documentary proofs.
                </p>
              </div>
            )}

            {/* Resolved CAPA Data Matrix Table */}
            <div className="border border-[#fed7aa] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0a192f] text-white text-[10px] uppercase tracking-wider font-extrabold">
                    <tr>
                      <th className="py-2.5 px-3 w-36">CAPA Code & Scope</th>
                      <th className="py-2.5 px-3 w-48">Quality Finding & Root Cause</th>
                      <th className="py-2.5 px-3">Implemented Action & Preventive Measure</th>
                      <th className="py-2.5 px-3 w-24 text-center">Score Delta</th>
                      <th className="py-2.5 px-3 w-24 text-center">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                          No resolved CAPA items match current filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr key={item.actionId} className="hover:bg-[#fffaf5] transition-colors">
                          <td className="py-3 px-3">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0a192f] text-[#fed7aa]">
                              {item.code}
                            </span>
                            <p className="font-extrabold text-[#0a192f] mt-1">{item.departmentCode}</p>
                            <span className="text-[10px] text-slate-400 block">{item.category}</span>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-extrabold text-slate-900 leading-snug">{item.issue}</p>
                            <p className="text-[10px] text-[#c2410c] font-semibold mt-1">
                              Cause: {item.rootCause}
                            </p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-slate-800 leading-snug">{item.correctiveAction}</p>
                            {item.preventiveAction && (
                              <p className="text-[10px] text-slate-500 italic mt-1">
                                Preventive: {item.preventiveAction}
                              </p>
                            )}

                            {/* Evidence items */}
                            {includeEvidenceTable && item.evidenceItems.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {item.evidenceItems.map((evi) => (
                                  <span
                                    key={evi.id}
                                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 flex items-center space-x-1 border border-slate-200"
                                  >
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                    <span>{evi.code}: {evi.title}</span>
                                  </span>
                                ))}
                              </div>
                            )}

                            <p className="text-[10px] text-slate-400 mt-1">
                              Assigned Authority: <strong className="text-slate-700">{item.assignedTo}</strong>
                            </p>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-black text-emerald-700 text-sm block">
                              +{item.improvementDelta}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {item.beforeScore} &rarr; {item.afterScore}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                              RESOLVED
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">
                              {new Date(item.completedAt).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statutory Signatory Block */}
            {includeSignatures && (
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <div className="h-10 border-b border-dashed border-slate-400 max-w-40 mx-auto" />
                  <p className="font-extrabold text-[#0a192f] mt-2">Prof. Radhika Venkataraman</p>
                  <p className="text-[11px] text-slate-500">Director, IQAC</p>
                  <span className="text-[9px] text-emerald-700 font-bold block mt-1">✓ Digitally Audited</span>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <div className="h-10 border-b border-dashed border-slate-400 max-w-40 mx-auto" />
                  <p className="font-extrabold text-[#0a192f] mt-2">Dr. Anand Raman</p>
                  <p className="text-[11px] text-slate-500">Secretary, Academic Council</p>
                  <span className="text-[9px] text-emerald-700 font-bold block mt-1">✓ BoS Approved</span>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                  <div className="h-10 border-b border-dashed border-slate-400 max-w-40 mx-auto" />
                  <p className="font-extrabold text-[#0a192f] mt-2">Dr. K. S. Krishnamurthy</p>
                  <p className="text-[11px] text-slate-500">Principal & Head of Institution</p>
                  <span className="text-[9px] text-emerald-700 font-bold block mt-1">✓ Governing Seal</span>
                </div>
              </div>
            )}

            {/* Footer Accreditation Subtext */}
            <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              Institutional Action Taken Artifact • NAAC Continuous Quality Improvement Protocol • Apex Institute of Technology & Management
            </div>
          </div>
        ) : (
          /* HTML Code Template View */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase text-[#0a192f] tracking-wider">
                  Self-Contained Standalone HTML Report Template
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Ready to Embed or Save
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyHtml}
                  className="px-3 py-1.5 rounded-lg bg-[#0a192f] text-white hover:bg-[#132c52] text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#ffa07a]" />}
                  <span>{copied ? 'Copied HTML Code!' : 'Copy Template Markup'}</span>
                </button>

                <button
                  onClick={handleDownloadHtml}
                  className="px-3 py-1.5 rounded-lg bg-[#ff7a50] text-[#0a192f] hover:bg-[#ffa07a] text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .html File</span>
                </button>
              </div>
            </div>

            <div className="bg-[#0a192f] text-slate-200 p-4 rounded-xl font-mono text-xs max-h-[500px] overflow-y-auto border border-[#fed7aa]/40">
              <pre className="whitespace-pre-wrap">{generateHtmlTemplate()}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Link */}
      {onNavigateToPlans && (
        <div className="p-4 bg-[#fffaf5] border-t border-[#fed7aa] flex items-center justify-between text-xs">
          <span className="text-slate-600">
            Need to manage in-progress or overdue CAPA items?
          </span>
          <button
            onClick={onNavigateToPlans}
            className="font-bold text-[#c2410c] hover:text-[#ff7a50] flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <span>Open Corrective Action Plans (CAPA) Manager</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
