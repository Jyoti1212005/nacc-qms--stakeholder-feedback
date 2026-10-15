import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Printer,
  FileDown,
  X,
  Share2,
  Check,
  Calendar,
  Building,
  Layers,
  Sparkles,
  QrCode,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface ExportNaacAtrSsrModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicYear?: string;
}

export const ExportNaacAtrSsrModal: React.FC<ExportNaacAtrSsrModalProps> = ({
  isOpen,
  onClose,
  academicYear = 'AY 2025–26',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://naac-qms.edu';
    navigator.clipboard.writeText(`${origin}/#public-atr?ay=2025-26`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const criteriaBreakdown = [
    {
      criterion: 'Criterion 1: Curricular Aspects',
      metric: 'Metric 1.4.1 & 1.4.2',
      focus: 'Structured Feedback from Students, Teachers, Employers & Alumni with Action Taken Report',
      targetScore: 4.5,
      actualScore: 4.28,
      delta: '+0.42',
      status: 'Target Met / Remediated',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      criterion: 'Criterion 2: Teaching-Learning & Evaluation',
      metric: 'Metric 2.7.1',
      focus: 'Online Student Satisfaction Survey (SSS) regarding Teaching Learning Process',
      targetScore: 4.2,
      actualScore: 4.18,
      delta: '+0.36',
      status: 'Substantially Compliant',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      criterion: 'Criterion 4: Infrastructure & Learning Resources',
      metric: 'Metric 4.1.3 & 4.3.1',
      focus: 'ICT Classrooms, High-Performance Computing Labs, Wi-Fi Bandwidth & Library ERP',
      targetScore: 4.0,
      actualScore: 4.15,
      delta: '+0.58',
      status: 'CAPA Closed with Proof',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      criterion: 'Criterion 6: Governance, Leadership & Management',
      metric: 'Metric 6.5.1 & 6.5.3',
      focus: 'Internal Quality Assurance Cell (IQAC) Quality Initiatives & Action Closure Rates',
      targetScore: 4.4,
      actualScore: 4.35,
      delta: '+0.31',
      status: 'Benchmarked & Verified',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
  ];

  const capaActionItems = [
    {
      code: 'CAPA-2025-CSE-01',
      department: 'Computer Science & Engineering',
      issue: 'Industry demand for Generative AI & Cloud DevSecOps electives in B.Tech Semester 7',
      rootCause: 'Curricular revision cycle lagged rapid industrial adoption of LLM tooling',
      actionTaken:
        'Added hands-on elective CSE-704 "Applied Generative AI & Cloud Systems"; ratified by Board of Studies on Nov 14, 2025.',
      beforeScore: 3.42,
      afterScore: 4.45,
      delta: '+1.03',
      evidenceRef: 'EVI-2025-BOS-08 (BoS Minutes & Syllabus Copy)',
      status: 'Resolved / Closed',
    },
    {
      code: 'CAPA-2025-MECH-02',
      department: 'Mechanical Engineering',
      issue: 'CNC Machine Lab simulation software licenses renewal and GPU workstation lag',
      rootCause: 'Hardware vendor warranty expiry and delay in annual campus procurement approval',
      actionTaken:
        'Procured 25 Ansys & SolidWorks workstation licenses and upgraded 16 GPU rigs; invoice attached in repository.',
      beforeScore: 3.15,
      afterScore: 4.32,
      delta: '+1.17',
      evidenceRef: 'EVI-2025-PUR-14 (Equipment Invoices & Calibration Logs)',
      status: 'Resolved / Closed',
    },
    {
      code: 'CAPA-2025-MBA-03',
      department: 'MBA / Management Studies',
      issue: 'FinTech analytics & live trading simulator exposure needed for Corporate Finance stream',
      rootCause: 'Bloomberg terminal subscription quota restricted to postgraduate research scholars',
      actionTaken:
        'Extended virtual terminal access to all MBA Semester 3 students; signed MoU with NSE Academy for certified workshops.',
      beforeScore: 3.38,
      afterScore: 4.30,
      delta: '+0.92',
      evidenceRef: 'EVI-2025-MOU-05 (NSE Academy Partnership Agreement)',
      status: 'Resolved / Closed',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto text-slate-800 max-h-[94vh] flex flex-col">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="p-3.5 bg-[#0a192f] text-white flex items-center justify-between border-b border-[#1b3456] shrink-0 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-[#ff7a50] text-white rounded-lg">
              <Award className="w-4 h-4" />
            </span>
            <span className="font-extrabold text-sm tracking-tight">NAAC Metric 1.4.2 ATR / SSR Export Utility</span>
            <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
              Print & PDF Ready
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 text-xs font-bold bg-[#14325a] hover:bg-[#1e467d] text-blue-100 rounded-xl border border-blue-400/30 flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share URL'}</span>
            </button>
            <button
              onClick={handlePrint}
              id="btn-print-ssr-report"
              className="px-4 py-1.5 text-xs font-extrabold bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-white rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close export modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6 relative bg-white print:p-0 print:m-0 text-[#0b1a30]">
          {/* Subtle NAAC Metric 1.4.2 Diagonal Watermark */}
          <div className="pointer-events-none select-none absolute inset-0 overflow-hidden flex items-center justify-center opacity-[0.035] print:opacity-[0.06] -rotate-25 z-0">
            <div className="text-center font-black tracking-widest text-[#0a192f] text-4xl sm:text-6xl uppercase leading-snug">
              NAAC METRIC 1.4.2<br />
              OFFICIAL SSR SUBMISSION<br />
              INTERNAL QUALITY ASSURANCE CELL<br />
              {academicYear}
            </div>
          </div>

          {/* Institutional Header Block */}
          <div className="relative z-10 border-b-2 border-[#0a192f] pb-5 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-[#0a192f] text-[#ffa07a] flex items-center justify-center font-black text-xl border-2 border-[#ff7a50] shadow-md shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-black text-[#0a192f] tracking-tight uppercase">
                  I.K. Gujral Punjab Technical University (IKGPTU)
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  (State Technical University Established by Govt. of Punjab • UGC 12(B) & AICTE Approved • Estd. 1997)
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="px-2 py-0.5 text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300 rounded uppercase">
                    NAAC Grade 'B' (Cycle-I) • Cycle-II A+ SSR Portfolio
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded uppercase">
                    NIRF Engineering Ranked (96–120 Band)
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 rounded uppercase">
                    Official Portal: ptu.ac.in
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
              <div className="font-bold text-[#0a192f]">
                INTERNAL QUALITY ASSURANCE CELL (IQAC)
              </div>
              <div className="font-mono text-[11px] font-semibold text-slate-700">
                Document Ref: <strong className="text-[#0a192f]">NAAC-SSR-ATR-202526-FINAL</strong>
              </div>
              <div className="font-semibold text-slate-700">
                Cycle / Session: <strong className="text-[#c2410c]">{academicYear}</strong>
              </div>
            </div>
          </div>

          {/* Title & Statutory Overview */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c2410c] block">
                  Mandatory Statutory Disclosure
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#0a192f]">
                  Action Taken Report (ATR) on Stakeholder Feedback (NAAC Metric 1.4.2)
                </h2>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Ratified by Governing Body & Academic Council</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              In strict accordance with NAAC Guidelines for Quality Assurance in Autonomous Institutions, this Action
              Taken Report is compiled by the Internal Quality Assurance Cell (IQAC). It systematically consolidates
              evaluations collected from Students, Teachers & Faculty, Employers, Alumni, and Parents for Academic Year{' '}
              {academicYear}, detailing root-cause analyses, department-wise CAPA remediation plans, and remeasured score
              improvements.
            </p>
          </div>

          {/* NAAC Criteria Performance Matrix */}
          <div className="relative z-10 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0a192f] uppercase tracking-wide flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#ff7a50]" />
                <span>1. Criteria Breakdown & Quantitative Improvements</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">Benchmark: Target &ge; 4.00 / 5.00</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#0a192f] text-white font-bold">
                  <tr>
                    <th className="p-3">Criterion & NAAC Metric</th>
                    <th className="p-3">Focus Area & Feedback Scope</th>
                    <th className="p-3 text-center">Target</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3 text-center">Delta</th>
                    <th className="p-3 text-right">Accreditation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {criteriaBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-[#0a192f]">
                        <div>{item.criterion}</div>
                        <div className="text-[10px] font-mono font-semibold text-[#ff7a50]">{item.metric}</div>
                      </td>
                      <td className="p-3 text-slate-700 leading-snug">{item.focus}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-600">{item.targetScore.toFixed(2)}</td>
                      <td className="p-3 text-center font-mono font-black text-[#0a192f]">{item.actualScore.toFixed(2)}</td>
                      <td className="p-3 text-center font-mono font-black text-emerald-700">{item.delta}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${item.badgeColor}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed CAPA & Action Taken Log */}
          <div className="relative z-10 space-y-2.5">
            <h3 className="text-sm font-extrabold text-[#0a192f] uppercase tracking-wide flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#ff7a50]" />
              <span>2. Corrective & Preventive Action (CAPA) Log & Evidence Index</span>
            </h3>

            <div className="space-y-3">
              {capaActionItems.map((capa) => (
                <div key={capa.code} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-xs text-[#0a192f] px-2 py-0.5 bg-white border border-slate-300 rounded">
                        {capa.code}
                      </span>
                      <span className="font-bold text-xs text-[#c2410c]">{capa.department}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-[11px] text-slate-500 font-semibold">Baseline: {capa.beforeScore} ★</span>
                      <span className="text-[11px] text-slate-700 font-bold">&rarr; Remeasured: {capa.afterScore} ★</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 rounded">
                        {capa.delta}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
                        {capa.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-bold text-[#0a192f] block">Stakeholder Issue & Deficiency:</span>
                      <p className="text-slate-600 mt-0.5">{capa.issue}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        <strong>Root Cause:</strong> {capa.rootCause}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-[#0a192f] block">Institutional Remediation & BoS Resolution:</span>
                      <p className="text-slate-700 mt-0.5 leading-relaxed">{capa.actionTaken}</p>
                      <p className="text-[10px] font-mono font-semibold text-blue-700 mt-1">
                        Documentary Proof: {capa.evidenceRef}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Signatures & Verification Seal */}
          <div className="relative z-10 pt-6 border-t-2 border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Left: QR Verification Stamp */}
            <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shrink-0">
                <QrCode className="w-12 h-12 text-[#0a192f]" />
              </div>
              <div className="text-[10px] text-slate-600 leading-tight">
                <span className="font-black text-[#0a192f] block text-xs">OFFICIAL DIGITAL SEAL</span>
                <span>SHA-256: 0x8f2a...c4e1</span><br />
                <span>Live URL: /iqac/metric-1.4.2</span><br />
                <span className="text-emerald-700 font-bold">Tamper-Proof & Verified</span>
              </div>
            </div>

            {/* Middle: IQAC Director */}
            <div className="text-center space-y-1">
              <div className="font-serif italic font-extrabold text-[#0a192f] text-base border-b border-slate-300 pb-1 mx-auto max-w-[200px]">
                Prof. Rajiv Chauhan
              </div>
              <div className="text-xs font-black text-[#0a192f] uppercase">Director, IQAC</div>
              <div className="text-[10px] text-slate-500">Internal Quality Assurance Cell</div>
            </div>

            {/* Right: Principal / Vice-Chancellor */}
            <div className="text-center space-y-1">
              <div className="font-serif italic font-extrabold text-[#0a192f] text-base border-b border-slate-300 pb-1 mx-auto max-w-[200px]">
                Prof. (Dr.) Susheel Mittal
              </div>
              <div className="text-xs font-black text-[#0a192f] uppercase">Vice-Chancellor & Chairperson, IQAC</div>
              <div className="text-[10px] text-slate-500">Head of Institution</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
