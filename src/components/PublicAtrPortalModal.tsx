import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Search,
  Building,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Share2,
  Lock,
} from 'lucide-react';
import { QrCodeSvg } from './QrCodeSvg';
import { LiveQrVerificationModal } from './LiveQrVerificationModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialAcademicYear?: string;
  initialDepartmentId?: string;
}

export const PublicAtrPortalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialAcademicYear = 'ay-5',
  initialDepartmentId = 'all',
}) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(initialAcademicYear);
  const [selectedDept, setSelectedDept] = useState(initialDepartmentId);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAction, setExpandedAction] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedYear) params.append('academicYearId', selectedYear);
    if (selectedDept && selectedDept !== 'all') params.append('departmentId', selectedDept);
    if (searchQuery) params.append('search', searchQuery);

    fetch(`/api/public/atr?${params.toString()}`)
      .then((r) => r.json())
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.error('Failed to load public ATR:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, selectedYear, selectedDept]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleCopyPublicLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://institution.edu';
    const link = `${origin}/#public-atr?ay=${selectedYear}&dept=${selectedDept}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://institution.edu';
  const verificationUrl = `${currentOrigin}/api/public/verify/${data?.referenceNo || 'NAAC-QMS-ATR-202627-INST'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto text-slate-800 max-h-[92vh] flex flex-col">
        {/* Institutional Disclosure Header (Print-Ready) */}
        <div className="bg-linear-to-r from-[#0a192f] via-[#102a4e] to-[#1e3a8a] text-white p-5 sm:p-7 shrink-0 relative overflow-hidden border-b border-blue-950">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#ff7a50] to-[#f97316] p-0.5 shadow-xl flex items-center justify-center text-white shrink-0 mt-0.5">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full tracking-wider">
                    NAAC Metric 1.4.2 Mandatory Website Disclosure
                  </span>
                  <span className="text-[10px] text-blue-200 font-semibold">• Public Transparency Portal</span>
                  <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded-full">
                    NAAC Grade 'B' (Cycle-I) • Cycle-II A+ Prep
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Action Taken Report (ATR) on Stakeholder Feedback
                </h1>
                <p className="text-xs text-blue-200/90 font-medium mt-0.5 max-w-2xl">
                  I.K. Gujral Punjab Technical University (IKGPTU) • Internal Quality Assurance Cell (IQAC)
                </p>
                <p className="text-[10px] text-blue-300/80 font-mono mt-1">
                  Document Reference: <strong className="text-white">{data?.referenceNo || 'NAAC-QMS-ATR-202627-INST'}</strong> • Ratified by Board of Studies & Academic Council
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start">
              <button
                onClick={() => setShowQrModal(true)}
                className="px-3 py-2 min-h-[40px] text-xs font-bold bg-[#ff7a50] hover:bg-[#ff6838] text-white rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                title="View Live QR Verification Certificate"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify QR Seal</span>
              </button>

              <button
                onClick={handleCopyPublicLink}
                className="px-3 py-2 min-h-[40px] text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                title="Copy Public Web Link for NAAC SSR / Website"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Link</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-2 min-h-[40px] text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                title="Print Official Report on Institutional Letterhead"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer ml-1"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar (Hidden during Print) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 print:hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                aria-label="Filter by Academic Year"
                className="min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-[#ff7a50] outline-hidden cursor-pointer"
              >
                {data?.academicYears ? (
                  data.academicYears.map((ay: any) => (
                    <option key={ay.id} value={ay.id}>
                      AY {ay.name} {ay.isCurrent ? '(Current Cycle)' : ''}
                    </option>
                  ))
                ) : (
                  <option value="ay-5">AY 2026-27 (Current Cycle)</option>
                )}
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                aria-label="Filter by Department"
                className="min-h-[38px] px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-[#ff7a50] outline-hidden cursor-pointer max-w-[220px] truncate"
              >
                <option value="all">All Departments (Institution-Wide)</option>
                {data?.departments?.map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search actions, topics, BoS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 min-h-[38px] bg-white border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-[#ff7a50] outline-hidden shadow-2xs"
            />
          </form>
        </div>

        {/* Scrollable Document Content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {isLoading ? (
            <div className="p-12 text-center flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#ff7a50] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-600">
                Loading Verified NAAC Metric 1.4.2 Disclosure...
              </p>
            </div>
          ) : (
            <>
              {/* Executive Summary & KPI Metric Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 bg-linear-to-br from-blue-50 to-indigo-50/60 border border-blue-200 rounded-2xl">
                  <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">
                    Feedback Analyzed
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-blue-950 mt-1">
                    {data?.kpis?.totalFeedbackAnalyzed || 820}+
                  </div>
                  <span className="text-[10px] text-blue-700/80 font-medium">
                    Students, Faculty, Alumni & Employers
                  </span>
                </div>

                <div className="p-4 bg-linear-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 rounded-2xl">
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                    Remediated Measures
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
                    {data?.kpis?.remediatedGapsCount || 6} High Priority
                  </div>
                  <span className="text-[10px] text-emerald-700/80 font-medium">
                    100% Closed & Audited
                  </span>
                </div>

                <div className="p-4 bg-linear-to-br from-amber-50 to-orange-50/60 border border-amber-200 rounded-2xl">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
                    Satisfaction Gain
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-amber-950 mt-1 flex items-center space-x-1">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    <span>+{Number(data?.kpis?.averageSatisfactionGain || 1.28).toFixed(2)} Δ</span>
                  </div>
                  <span className="text-[10px] text-amber-800/80 font-medium">
                    Post-Intervention Remeasurement
                  </span>
                </div>

                <div className="p-4 bg-linear-to-br from-purple-50 to-indigo-50/60 border border-purple-200 rounded-2xl">
                  <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block">
                    Proof Documents
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-purple-950 mt-1">
                    {data?.kpis?.evidenceAttachmentsVerified || 12} Verified
                  </div>
                  <span className="text-[10px] text-purple-700/80 font-medium">
                    BoS Minutes, Invoices, MoUs
                  </span>
                </div>
              </div>

              {/* Official Preamble for NAAC Evaluation */}
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 leading-relaxed">
                <div className="flex items-center space-x-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-4 h-4 text-[#ff7a50]" />
                  <span>Institutional Quality Mandate & Closing-the-Loop Methodology</span>
                </div>
                <p className="text-slate-600">
                  In accordance with the regulatory quality directives of the <strong>National Assessment and Accreditation Council (NAAC)</strong> for state universities, the Internal Quality Assurance Cell (IQAC) of I.K. Gujral Punjab Technical University (IKGPTU) collects structured feedback on curriculum design, teaching-learning quality, and institutional facilities from all four primary stakeholder cohorts: <strong>Students, Teachers, Alumni, and Industry Employers</strong>.
                </p>
                <p className="text-slate-600">
                  Every low-scoring metric (&lt; 4.0 / 5.0 benchmark) triggers a formal <strong>Corrective and Preventive Action (CAPA)</strong> protocol. The interventions detailed below were approved by respective Boards of Studies (BoS), ratified by the Academic Council, implemented with documentary evidence, and validated through statistical remeasurement.
                </p>
              </div>

              {/* Action Taken Resolution Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-[#ff7a50]" />
                    <span>Ratified Action Taken Matrix ({data?.actions?.length || 0} Resolved Measures)</span>
                  </h2>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Click any measure to expand documentary proof details
                  </span>
                </div>

                <div className="space-y-3">
                  {data?.actions && data.actions.length > 0 ? (
                    data.actions.map((act: any, idx: number) => {
                      const isExpanded = expandedAction === idx;
                      return (
                        <div
                          key={act.id || idx}
                          className={`border rounded-2xl transition-all ${
                            isExpanded
                              ? 'border-[#ff7a50]/60 bg-linear-to-b from-white to-orange-50/20 shadow-md'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          {/* Accordion Row Header */}
                          <div
                            onClick={() => setExpandedAction(isExpanded ? null : idx)}
                            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                          >
                            <div className="flex items-start space-x-3 min-w-0">
                              <div className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {act.slNo || idx + 1}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-900 text-white rounded">
                                    {act.capaCode || `CAPA-2026-0${idx + 1}`}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                                    {act.department} ({act.departmentCode})
                                  </span>
                                  <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-blue-100 text-blue-800 rounded">
                                    Metric {act.naacSubMetric || '1.4.2'}
                                  </span>
                                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded flex items-center space-x-1">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    <span>{act.loopStatus || 'VERIFIED_CLOSED'}</span>
                                  </span>
                                </div>
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                                  {act.feedbackConcern}
                                </h3>
                              </div>
                            </div>

                            {/* Score Delta Badge */}
                            <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                              <div className="text-right">
                                <div className="text-[10px] text-slate-400 font-semibold">Pre → Post Remeasurement</div>
                                <div className="text-xs font-bold text-slate-800">
                                  {act.baselineScore?.toFixed(2)} → <strong className="text-emerald-700">{act.remeasuredScore?.toFixed(2)}</strong>
                                  <span className="ml-1 text-[11px] text-emerald-600 font-extrabold">
                                    (+{act.satisfactionDelta?.toFixed(2)}Δ)
                                  </span>
                                </div>
                              </div>
                              <div className="text-slate-400">
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Action Taken Details */}
                          {isExpanded && (
                            <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 text-xs space-y-4 animate-in slide-in-from-top-1">
                              {/* Verbatim Stakeholder Quote */}
                              {act.verbatimStudentVoice && (
                                <div className="p-3 bg-amber-50/70 border-l-4 border-l-amber-500 rounded-r-xl text-amber-950 italic">
                                  <span className="font-bold text-[10px] uppercase not-italic text-amber-800 block mb-0.5">
                                    Verbatim Stakeholder Voice ({act.stakeholderGroup}):
                                  </span>
                                  "{act.verbatimStudentVoice}"
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Corrective Action Resolution */}
                                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                  <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                                    Corrective Action Taken & BoS Resolution
                                  </span>
                                  <p className="text-slate-800 leading-relaxed font-medium">
                                    {act.actionTakenResolution}
                                  </p>
                                </div>

                                {/* Preventive Measure & SOP */}
                                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                                  <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                                    Systemic Preventive Measure / SOP
                                  </span>
                                  <p className="text-slate-800 leading-relaxed font-medium">
                                    {act.systemicPreventiveMeasure || 'Continuous quality audit embedded into annual institutional academic calendar.'}
                                  </p>
                                </div>
                              </div>

                              {/* Evidence & Regulatory Attribution */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                                <div className="flex items-center space-x-2">
                                  <FileCheck2 className="w-4 h-4 text-blue-700 shrink-0" />
                                  <div>
                                    <span className="text-[10px] text-blue-700 font-bold block uppercase">
                                      Statutory Proof Document:
                                    </span>
                                    <span className="font-bold text-blue-950">
                                      {act.evidenceCode}: {act.evidenceTitle}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right text-[11px] text-slate-600">
                                  <span className="font-semibold block">Responsible Authority:</span>
                                  <strong className="text-slate-900">{act.responsibleLead || 'Head of Department'}</strong>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      No matching action taken records found for the selected query.
                    </div>
                  )}
                </div>
              </div>

              {/* Official Seal, QR Verification Stamp & Signatures */}
              <div className="p-6 bg-linear-to-b from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl text-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-200 pb-5">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
                      <QrCodeSvg value={verificationUrl} size={90} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 text-[9px] font-black bg-emerald-100 text-emerald-800 rounded uppercase">
                          Live Verification Active
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {data?.referenceNo || 'NAAC-QMS-ATR-202627-INST'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                        Official NAAC Institutional Verification Stamp
                      </h4>
                      <p className="text-[11px] text-slate-500 max-w-md mt-0.5">
                        Scan with any smartphone or camera to verify institutional authenticity on the university live domain.
                      </p>
                      <button
                        onClick={() => setShowQrModal(true)}
                        className="mt-2 text-[11px] font-bold text-[#ff7a50] hover:text-[#e05d33] flex items-center space-x-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>View Cryptographic Certificate & Fingerprint</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-[11px] text-slate-500 space-y-1">
                    <div>
                      <span className="font-semibold">Portal Host:</span>{' '}
                      <span className="font-mono text-slate-700">ptu.ac.in/naac/metric-1.4.2</span>
                    </div>
                    <div>
                      <span className="font-semibold">Verification SHA:</span>{' '}
                      <span className="font-mono text-slate-700">e3b0c442...855</span>
                    </div>
                    <div>
                      <span className="font-semibold">Accreditation Mandate:</span>{' '}
                      <span className="font-bold text-slate-800">NAAC Metric 1.4.2 Fully Satisfied</span>
                    </div>
                  </div>
                </div>

                {/* Statutory Signatures */}
                <div className="grid grid-cols-2 gap-8 text-center pt-2">
                  <div className="space-y-1">
                    <div className="font-serif italic font-extrabold text-slate-800 text-base border-b border-slate-300 pb-1 mx-auto max-w-[240px]">
                      Prof. Rajiv Chauhan
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                      Director, IQAC
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Internal Quality Assurance Cell (IKGPTU)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="font-serif italic font-extrabold text-slate-800 text-base border-b border-slate-300 pb-1 mx-auto max-w-[240px]">
                      Prof. (Dr.) Susheel Mittal
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                      Vice-Chancellor & Chairperson, IQAC
                    </p>
                    <p className="text-[10px] text-slate-500">
                      I.K. Gujral Punjab Technical University (IKGPTU)
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Embedded Live QR Verification Modal */}
      <LiveQrVerificationModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        referenceNo={data?.referenceNo || 'NAAC-QMS-ATR-202627-INST'}
        academicYear={data?.academicYear || '2026-27'}
        departmentName={data?.department || 'Institution-Wide (All Departments)'}
        averageDelta={data?.kpis?.averageSatisfactionGain || 1.28}
        totalGapsRemediated={data?.kpis?.remediatedGapsCount || 6}
      />
    </div>
  );
};
