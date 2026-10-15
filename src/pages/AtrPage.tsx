import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Printer,
  Download,
  CheckCircle2,
  Paperclip,
  Award,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActionTakenAutoReportSection } from '../components/ActionTakenAutoReportSection';
import { ActionTakenReportResolvedCapaSection } from '../components/ActionTakenReportResolvedCapaSection';
import { NaacBookletReportGenerator } from '../components/NaacBookletReportGenerator';
import { AiAtrReportModal } from '../components/AiAtrReportModal';
import { PublicAtrPortalModal } from '../components/PublicAtrPortalModal';
import { LiveQrVerificationModal } from '../components/LiveQrVerificationModal';

export const AtrPage: React.FC = () => {
  const { selectedAcademicYear, departments, showToast, setActivePage } = useApp();
  const [atrItems, setAtrItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resolved-capa' | 'auto-generator' | 'raw-records'>('resolved-capa');
  const [showNaacBookletModal, setShowNaacBookletModal] = useState(false);
  const [showAiAtrModal, setShowAiAtrModal] = useState(false);
  const [showPublicAtrModal, setShowPublicAtrModal] = useState(false);
  const [showQrVerificationModal, setShowQrVerificationModal] = useState(false);

  const loadAtr = () => {
    setIsLoading(true);
    fetch('/api/atr')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAtrItems(data);
      })
      .catch((err) => console.error('ATR error:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadAtr();
  }, [selectedAcademicYear]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = [
      'CAPA Code',
      'Department',
      'Identified Deficiency',
      'Action Taken (Corrective & Preventive)',
      'Responsible Person',
      'Baseline Score',
      'Remeasured Score',
      'Improvement Delta',
      'Status',
    ];
    const rows = atrItems.map((item) => [
      `"${item.code}"`,
      `"${item.department}"`,
      `"${item.issue.replace(/"/g, '""')}"`,
      `"${item.actionTaken.replace(/"/g, '""')}"`,
      `"${item.responsiblePerson}"`,
      item.beforeScore || 'N/A',
      item.afterScore || 'N/A',
      item.improvementDelta ? `+${item.improvementDelta}` : 'N/A',
      item.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NAAC_QMS_ATR_${selectedAcademicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('ATR CSV exported successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded uppercase">
              Regulatory Audit Artifact
            </span>
            <span className="text-xs text-slate-400">• Continuous Quality Evidence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Action Taken Report (ATR) on Stakeholder Feedback
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official institutional report demonstrating verified implementation, post-intervention remeasurement deltas, and documentary proof for NAAC accreditation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tab selector */}
          <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1">
            <button
              onClick={() => setActiveTab('resolved-capa')}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'resolved-capa'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0a192f]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#ffa07a]" />
              <span>Resolved CAPA Report (PDF/HTML)</span>
            </button>
            <button
              onClick={() => setActiveTab('auto-generator')}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'auto-generator'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0a192f]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffa07a]" />
              <span>Auto-Report Generator</span>
            </button>
            <button
              onClick={() => setActiveTab('raw-records')}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'raw-records'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0a192f]'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#ff7a50]" />
              <span>Action Ledger ({atrItems.length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowAiAtrModal(true)}
            className="min-h-[44px] px-4 py-2 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            title="Generate verified Action Taken Report compliant with NAAC Criterion 1.4"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI ATR Generator (1.4.2)</span>
          </button>

          <button
            onClick={() => setShowPublicAtrModal(true)}
            className="min-h-[44px] px-3.5 py-2 bg-[#0a192f] hover:bg-[#152e50] text-[#ffa07a] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm border border-slate-700"
            title="View Public ATR Transparency Portal hosted on the college website"
          >
            <Award className="w-4 h-4 text-[#ff7a50]" />
            <span>🌐 Public ATR Portal (1.4.2)</span>
          </button>

          <button
            onClick={() => setShowQrVerificationModal(true)}
            className="min-h-[44px] px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
            title="View Live QR Verification Certificate and Cryptographic Seal"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>🛡️ Live QR Seal</span>
          </button>

          <button
            onClick={() => setShowNaacBookletModal(true)}
            className="min-h-[44px] px-3.5 py-2 bg-[#0a192f] hover:bg-[#132c52] text-[#fed7aa] border border-[#ff7a50] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
            title="Generate full 27-page NAAC Evidence Report Booklet"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#ff7a50]" />
            <span>NAAC Evidence Report (Booklet)</span>
          </button>

          <button
            onClick={() => {
              window.open('/api/export/naac-ssr-14', '_blank');
              showToast('NAAC Criterion 1.4 SSR Data Template exported!', 'success');
            }}
            className="min-h-[44px] px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            title="Export NAAC Criterion 1.4 SSR Data Template"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>SSR 1.4 CSV</span>
          </button>

          <button
            onClick={() => {
              window.open('/api/export/naac-ssr-27', '_blank');
              showToast('NAAC Criterion 2.7.1 SSS SSR Data Template exported!', 'success');
            }}
            className="min-h-[44px] px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            title="Export NAAC Criterion 2.7.1 Student Satisfaction Survey SSR Data Template"
          >
            <Download className="w-3.5 h-3.5 text-purple-700" />
            <span>SSS 2.7.1 CSV</span>
          </button>

          <button
            onClick={() => setActivePage('closing-the-loop')}
            className="min-h-[44px] px-3.5 py-2 bg-[#ff7a50] hover:bg-[#ff8a65] text-[#0a192f] rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            title="Open Public Closing the Loop Stakeholder Tracker"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Closing the Loop</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#0a192f] hover:bg-[#132c52] text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#ffa07a]" />
            <span>Print Official ATR</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Resolved CAPA Summary Report (PDF/HTML Template) */}
      {activeTab === 'resolved-capa' && (
        <ActionTakenReportResolvedCapaSection
          departments={departments}
          selectedAcademicYear={selectedAcademicYear}
          onNavigateToPlans={() => setActivePage('action-plans')}
        />
      )}

      {/* Tab 2: Automated ATR Report Generator */}
      {activeTab === 'auto-generator' && (
        <ActionTakenAutoReportSection
          departments={departments}
          selectedAcademicYear={selectedAcademicYear}
        />
      )}

      {/* Tab 3: Raw Action Items Table */}
      {activeTab === 'raw-records' && (
        <div className="space-y-6">
      {/* Printable Institutional Letterhead (visible in print mode) */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-xl font-extrabold uppercase tracking-wide">I.K. Gujral Punjab Technical University (IKGPTU)</h1>
        <p className="text-xs font-semibold">(State Technical University Established by Govt. of Punjab • NAAC Accredited)</p>
        <p className="text-xs mt-1">INTERNAL QUALITY ASSURANCE CELL (IQAC)</p>
        <h2 className="text-sm font-bold mt-2 uppercase underline">
          ACTION TAKEN REPORT (ATR) ON STAKEHOLDER FEEDBACK
        </h2>
      </div>

      {/* Main ATR Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Verified Quality Improvements ({atrItems.length} Actions Tracked)
          </span>
          <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Institutional Governance Verified</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">CAPA Code</th>
                <th className="p-3.5">NAAC Metric</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5 max-w-xs">Deficiency / Feedback Issue</th>
                <th className="p-3.5 max-w-sm">Action Taken (Corrective & Preventive)</th>
                <th className="p-3.5 text-center">Baseline</th>
                <th className="p-3.5 text-center">Remeasured</th>
                <th className="p-3.5 text-center">Delta (Δ)</th>
                <th className="p-3.5">Attached Evidence</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {atrItems.map((item) => (
                <tr key={item.actionId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-purple-700">{item.code}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      item.naacSubMetric === '2.7.1'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : item.naacSubMetric === '1.4.1'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {item.naacSubMetric ? `Metric ${item.naacSubMetric}` : 'Criterion 1.4'}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">{item.department}</td>
                  <td className="p-3.5 max-w-xs text-slate-700 font-medium leading-relaxed">{item.issue}</td>
                  <td className="p-3.5 max-w-sm text-slate-700 space-y-1">
                    <p className="font-semibold text-slate-900">{item.actionTaken}</p>
                    <p className="text-[11px] text-slate-500">
                      <strong>Safeguard:</strong> {item.preventiveAction}
                    </p>
                  </td>
                  <td className="p-3.5 text-center font-bold text-amber-700">{item.beforeScore ? `${item.beforeScore} ★` : '-'}</td>
                  <td className="p-3.5 text-center font-bold text-emerald-700">{item.afterScore ? `${item.afterScore} ★` : '-'}</td>
                  <td className="p-3.5 text-center">
                    {item.improvementDelta ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold font-mono text-[11px]">
                        +{item.improvementDelta}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">-</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-col space-y-1">
                      {item.evidenceList.map((e: any) => (
                        <span
                          key={e.id}
                          className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold border border-blue-200 flex items-center space-x-1"
                        >
                          <Paperclip className="w-2.5 h-2.5" />
                          <span>{e.code}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.status === 'CLOSED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Sign-off Footer */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-200 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs pt-4">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 max-w-44 mx-auto" />
              <p className="font-bold text-slate-800 mt-2">Prof. Rajiv Chauhan</p>
              <p className="text-[11px] text-slate-500 font-medium">Director, IQAC & Professor</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 max-w-44 mx-auto" />
              <p className="font-bold text-slate-800 mt-2">Dr. Navdeepak Sandhu</p>
              <p className="text-[11px] text-slate-500 font-medium">Registrar / Secretary, Academic Council</p>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="h-10 border-b border-dashed border-slate-400 max-w-44 mx-auto" />
              <p className="font-bold text-slate-800 mt-2">Prof. (Dr.) Susheel Mittal</p>
              <p className="text-[11px] text-slate-500 font-medium">Vice-Chancellor & Head of Institution</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-6">
            Institutional Quality Artifact • Generated via NAAC-QMS Autonomous Suite • Timestamp: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      </div>
      )}

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
          loadAtr();
        }}
        preselectedAcademicYear={selectedAcademicYear || 'ay-5'}
      />

      {/* Public Action Taken Report (ATR) Portal Modal */}
      <PublicAtrPortalModal
        isOpen={showPublicAtrModal}
        onClose={() => setShowPublicAtrModal(false)}
        initialAcademicYear={selectedAcademicYear || 'ay-5'}
      />

      {/* Live QR Verification Seal Modal */}
      <LiveQrVerificationModal
        isOpen={showQrVerificationModal}
        onClose={() => setShowQrVerificationModal(false)}
        academicYear={selectedAcademicYear === 'ay-5' ? '2026-27' : selectedAcademicYear}
      />
    </div>
  );
};
