import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  BookOpen,
  Sparkles,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ReportItem } from '../types';
import { NaacBookletReportGenerator } from '../components/NaacBookletReportGenerator';
import { AiAtrReportModal } from '../components/AiAtrReportModal';

export const ReportsPage: React.FC = () => {
  const { selectedAcademicYear, showToast } = useApp();
  const { hasRole } = useAuth();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showNaacBookletModal, setShowNaacBookletModal] = useState(false);
  const [showAiAtrModal, setShowAiAtrModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('STAKEHOLDER_FEEDBACK');
  const [reportTitle, setReportTitle] = useState('');
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadReports = () => {
    setIsLoading(true);
    fetch('/api/reports')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReports(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadReports();
  }, [selectedAcademicYear]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: selectedReportType,
          title: reportTitle || `Institutional ${selectedReportType.replace(/_/g, ' ')} Report (AY ${selectedAcademicYear})`,
          academicYearId: selectedAcademicYear,
        }),
      });

      if (res.ok) {
        showToast('Official accreditation report generated!', 'success');
        setShowGenerateModal(false);
        setReportTitle('');
        loadReports();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        showToast('Report officially approved and archived for statutory audit!', 'success');
        loadReports();
        if (previewReport && previewReport.id === id) {
          setPreviewReport({ ...previewReport, isApproved: true, approvedBy: 'Dr. K. S. Krishnamurthy (Principal)' });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const reportTypes = [
    { type: 'STAKEHOLDER_FEEDBACK', label: 'Consolidated Stakeholder Feedback Audit' },
    { type: 'STUDENT_FEEDBACK', label: 'Student Course & Curriculum Evaluation Report' },
    { type: 'FACULTY_FEEDBACK', label: 'Faculty Pedagogical & Infrastructure Appraisal' },
    { type: 'ALUMNI_FEEDBACK', label: 'Alumni Curriculum Relevance & Graduate Outcomes' },
    { type: 'EMPLOYER_FEEDBACK', label: 'Employer Industry-Readiness Survey' },
    { type: 'IQAC_ANNUAL', label: 'IQAC Annual Institutional Quality Assurance Report' },
    { type: 'ATR', label: 'Official Action Taken Report (ATR)' },
    { type: 'CAPA', label: 'CAPA Quality Remediation Portfolio' },
    { type: 'EVIDENCE_INDEX', label: 'Documentary Evidence & Audit Trail Index' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded uppercase">
              NAAC-Ready Documentation
            </span>
            <span className="text-xs text-slate-400">• Institutional Quality Archives</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Report Generation & Statutory Archive
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate formal, print-ready quality reports with aggregated analytics, verified CAPA actions, and administrative sign-offs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAiAtrModal(true)}
            className="px-4 py-2 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Action Taken Report (Criterion 1.4)</span>
          </button>

          <button
            onClick={() => setShowNaacBookletModal(true)}
            className="px-4 py-2 bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] border border-[#ff7a50] rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
          >
            <BookOpen className="w-4 h-4 text-[#ff7a50]" />
            <span>Generate NAAC Evidence Report (Booklet)</span>
          </button>

          {hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured NAAC Evidence Report Card (Booklet Edition) */}
      <div className="bg-linear-to-r from-[#0a192f] via-[#132c52] to-[#0a192f] rounded-2xl p-5 sm:p-6 text-white border-2 border-[#fed7aa] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ff7a50] text-[#0a192f]">
                Statutory NAAC Format
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#fed7aa]">
                IKGPTU-QMS Booklet Edition (27 Pages)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>NAAC Stakeholder Feedback & Evidence Report</span>
              <Sparkles className="w-5 h-5 text-[#ffa07a]" />
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Complete institutional accreditation booklet with Cover Page, Table of Contents, Executive Summary, Institutional Profile, Stakeholder Response Distribution, Feedback Summary, Question-wise Analysis, Department Ratings, and Action Taken Report (ATR).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowNaacBookletModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#ff7a50] hover:bg-[#ffa07a] text-[#0a192f] font-black text-xs transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Open & Generate Full Report</span>
            </button>
          </div>
        </div>

        {/* 6 Page Preview Pills */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-[10px]">
          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
            <span className="font-bold text-[#fed7aa] block">Page 1</span>
            <span className="text-slate-300">Cover & Logos</span>
          </div>
          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
            <span className="font-bold text-[#fed7aa] block">Page 2</span>
            <span className="text-slate-300">Table of Contents</span>
          </div>
          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
            <span className="font-bold text-[#fed7aa] block">Page 3</span>
            <span className="text-slate-300">Exec Summary</span>
          </div>
          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
            <span className="font-bold text-[#fed7aa] block">Page 4</span>
            <span className="text-slate-300">Profile & Infra</span>
          </div>
          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
            <span className="font-bold text-[#fed7aa] block">Page 5</span>
            <span className="text-slate-300">Stakeholder Donut</span>
          </div>
          <div className="bg-white/10 p-2 rounded-lg border border-white/10">
            <span className="font-bold text-[#fed7aa] block">Page 16</span>
            <span className="text-[#ffa07a] font-bold">Action Taken (ATR)</span>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {rep.reportType}
                </span>
                {rep.isApproved ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Approved</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Draft
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{rep.title}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Generated by: {rep.generatedBy}</p>

              {/* Summary Metrics */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Responses:</span>
                  <span className="font-bold text-slate-800">{rep.summaryData.totalResponses || 780}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Satisfaction:</span>
                  <span className="font-bold text-amber-600">{rep.summaryData.averageSatisfaction || 4.14} ★</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quality Index:</span>
                  <span className="font-bold text-blue-700">{rep.summaryData.qualityIndex || 84.6} / 100</span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {new Date(rep.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewReport(rep)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Report</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Compile Official Quality Report</h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Report Instrument</label>
                <select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold"
                >
                  {reportTypes.map((rt) => (
                    <option key={rt.type} value={rt.type}>
                      {rt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Custom Title (Optional)</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Leave empty for institutional default title..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold">
                  Compile & Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Full Report Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {previewReport.reportType}
              </span>
              <button onClick={() => setPreviewReport(null)} className="text-slate-400 hover:text-slate-600 text-xs">
                ✕
              </button>
            </div>

            {/* Printable Document View */}
            <div className="my-4 flex-1 overflow-y-auto p-6 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-6">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h2 className="text-base font-extrabold uppercase text-slate-900">
                  Apex Institute of Technology & Management
                </h2>
                <p className="text-[11px] text-slate-600 font-medium">Autonomous Higher Education Institution • Accredited by NAAC</p>
                <h3 className="text-sm font-bold text-blue-900 mt-2">{previewReport.title}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Academic Year 2026-27 • Internal Quality Assurance Cell</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">1. Executive Quality Summary</h4>
                <p className="text-slate-700 leading-relaxed">
                  This report encapsulates comprehensive feedback systematically gathered across active stakeholder tiers. The
                  resulting data has been processed by the IQAC to calculate the composite Institutional Quality Improvement
                  Index, flag deficiencies, monitor corrective/preventive actions, and archive documentary proofs.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Total Submissions</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {previewReport.summaryData.totalResponses || 780}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Average Satisfaction</span>
                  <span className="text-base font-extrabold text-amber-600">
                    {previewReport.summaryData.averageSatisfaction || 4.14} / 5.0
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Quality Index</span>
                  <span className="text-base font-extrabold text-blue-700">
                    {previewReport.summaryData.qualityIndex || 84.6} / 100
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">2. Institutional Signatures & Verification</h4>
                <div className="grid grid-cols-2 gap-8 pt-6 text-center">
                  <div>
                    <div className="h-8 border-b border-dashed border-slate-400 max-w-40 mx-auto" />
                    <p className="font-bold text-slate-800 mt-2">{previewReport.generatedBy}</p>
                    <p className="text-[10px] text-slate-500">Director, IQAC</p>
                  </div>
                  <div>
                    <div className="h-8 border-b border-dashed border-slate-400 max-w-40 mx-auto" />
                    <p className="font-bold text-slate-800 mt-2">
                      {previewReport.approvedBy || 'Dr. K. S. Krishnamurthy'}
                    </p>
                    <p className="text-[10px] text-slate-500">Principal & Head of Institution</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
              </div>

              {!previewReport.isApproved && hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
                <button
                  onClick={() => handleApprove(previewReport.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Seal Report</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAAC Booklet Multi-Page Evidence Report Generator */}
      <NaacBookletReportGenerator
        isOpen={showNaacBookletModal}
        onClose={() => setShowNaacBookletModal(false)}
        initialAcademicYear={selectedAcademicYear || '2024 - 2025'}
      />

      {/* AI Action Taken Report (ATR) Generator Modal (Criterion 1.4 Compliant) */}
      <AiAtrReportModal
        isOpen={showAiAtrModal}
        onClose={() => {
          setShowAiAtrModal(false);
          loadReports();
        }}
        preselectedAcademicYear={selectedAcademicYear || 'ay-5'}
      />
    </div>
  );
};
