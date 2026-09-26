import React, { useState, useEffect } from 'react';
import {
  Award,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  Settings,
  Info,
  Layers,
  ArrowRight,
  Sparkles,
  Flame,
  AlertOctagon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { AiAtrReportModal } from '../components/AiAtrReportModal';

export const IqacCommandPage: React.FC = () => {
  const { selectedAcademicYear, setActivePage, showToast } = useApp();
  const { hasRole } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWeightsModal, setShowWeightsModal] = useState(false);
  const [showAiAtrModal, setShowAiAtrModal] = useState(false);
  const [escalatedCount, setEscalatedCount] = useState<number>(2);
  const [weights, setWeights] = useState({
    stakeholderSatisfaction: 0.3,
    responseRate: 0.15,
    actionClosureRate: 0.25,
    improvementDelta: 0.15,
    evidenceCompleteness: 0.15,
  });

  const loadData = () => {
    setIsLoading(true);
    fetch(`/api/iqac/overview?academicYearId=${selectedAcademicYear}`)
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        if (res.index?.weights) {
          setWeights(res.index.weights);
        }
      })
      .catch((err) => console.error('IQAC overview error:', err))
      .finally(() => setIsLoading(false));

    fetch('/api/quality-indicators/escalations')
      .then((r) => r.json())
      .then((res) => {
        if (typeof res.count === 'number') setEscalatedCount(res.count);
      })
      .catch((err) => console.error('Escalations error:', err));
  };

  useEffect(() => {
    loadData();
  }, [selectedAcademicYear]);

  const handleSaveWeights = async (e: React.FormEvent) => {
    e.preventDefault();
    const sum =
      Number(weights.stakeholderSatisfaction) +
      Number(weights.responseRate) +
      Number(weights.actionClosureRate) +
      Number(weights.improvementDelta) +
      Number(weights.evidenceCompleteness);

    if (Math.abs(sum - 1.0) > 0.01) {
      showToast(`The sum of weights must equal 1.00 (100%). Current sum: ${sum.toFixed(2)}`, 'error');
      return;
    }

    try {
      const res = await fetch('/api/iqac/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weights),
      });
      if (res.ok) {
        showToast('Quality Index weights updated and scores recalculated!', 'success');
        setShowWeightsModal(false);
        loadData();
      }
    } catch (e) {
      console.error('Error saving weights:', e);
    }
  };

  const index = data?.index;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Internal Quality Assurance Cell (IQAC)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Institutional Quality Assurance Command Center
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-2 leading-relaxed">
              Central cockpit monitoring the 7 NAAC accreditation criteria, calculating the composite Institutional Quality
              Improvement Index, supervising corrective & preventive action plans, and auditing documentary evidence.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowAiAtrModal(true)}
              className="px-4 py-2.5 bg-linear-to-r from-amber-400 to-[#ff7a50] hover:opacity-95 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer shadow-lg hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate Action Taken Report (Criterion 1.4)</span>
            </button>
          </div>
        </div>

        {/* Overdue Escalations Watchdog Alert */}
        {escalatedCount > 0 && (
          <div className="mt-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-red-200">
            <div className="flex items-center space-x-2.5">
              <Flame className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
              <span>
                <strong>Automated Escalation Watchdog:</strong> {escalatedCount} quality indicators have remained below target for &gt; 30 days without an assigned CAPA remediation plan.
              </span>
            </div>
            <button
              onClick={() => setActivePage('quality-indicators')}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>Remediate in Watchlist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Notice Disclaimer Banner */}
        <div className="mt-3 p-3 bg-blue-950/70 border border-blue-700/50 rounded-xl flex items-start space-x-2.5 text-xs text-blue-200">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Statutory Compliance Note:</strong> The <em>"Institutional Quality Improvement Index"</em> is an internal
            benchmarking metric computed to drive continuous institutional enhancement. It is neither an official NAAC grade nor
            a substitute for statutory peer-team assessment.
          </p>
        </div>
      </div>

      {/* Main Score & Component Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overall Quality Index Gauge Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Internal Indicator</span>
              {hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
                <button
                  onClick={() => setShowWeightsModal(true)}
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Weights</span>
                </button>
              )}
            </div>

            <div className="mt-4 text-center py-4">
              <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-8 border-blue-600/20 bg-blue-50/50 relative shadow-inner">
                <span className="text-4xl font-black text-blue-900 tracking-tight">
                  {index ? index.totalIndex.toFixed(1) : '...'}
                </span>
                <span className="text-xs font-bold text-slate-500">out of 100</span>
              </div>

              <div className="mt-4">
                <span className="px-3 py-1 text-xs font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  STATUS: {index?.statusLabel || 'GOOD'}
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  Institutional performance satisfies cycle benchmarks.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Active Gaps</span>
              <span className="font-extrabold text-red-600 text-sm">{index?.criticalGapsCount || 0}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Open Actions</span>
              <span className="font-extrabold text-indigo-600 text-sm">{index?.openActions || 0}</span>
            </div>
          </div>
        </div>

        {/* Middle & Right: Formula Components Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Quality Index Component Breakdown</h2>
              <p className="text-xs text-slate-500">Weighted criteria matrix driving the composite quality index</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Sum = 100%</span>
          </div>

          <div className="space-y-3.5">
            {/* Component 1: Stakeholder Satisfaction */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">1. Stakeholder Satisfaction Index</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded font-semibold">
                    Weight: {(weights.stakeholderSatisfaction * 100).toFixed(0)}%
                  </span>
                </div>
                <span className="font-extrabold text-slate-900">
                  {index?.components?.satisfactionScore || 82.8} / 100 ({index?.components?.averageSatisfactionOutOf5 || 4.14}★)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${index?.components?.satisfactionScore || 82}%` }}
                />
              </div>
            </div>

            {/* Component 2: Response Rate */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">2. Stakeholder Response Rate</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded font-semibold">
                    Weight: {(weights.responseRate * 100).toFixed(0)}%
                  </span>
                </div>
                <span className="font-extrabold text-slate-900">
                  {index?.components?.responseRatePercent || 78}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${index?.components?.responseRatePercent || 78}%` }}
                />
              </div>
            </div>

            {/* Component 3: Action Closure Rate */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">3. CAPA Action Closure Rate</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded font-semibold">
                    Weight: {(weights.actionClosureRate * 100).toFixed(0)}%
                  </span>
                </div>
                <span className="font-extrabold text-slate-900">
                  {index?.components?.actionClosureRatePercent || 80}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${index?.components?.actionClosureRatePercent || 80}%` }}
                />
              </div>
            </div>

            {/* Component 4: Improvement Delta */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">4. Remeasured Improvement Delta</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-700 rounded font-semibold">
                    Weight: {(weights.improvementDelta * 100).toFixed(0)}%
                  </span>
                </div>
                <span className="font-extrabold text-slate-900">
                  {index?.components?.improvementDeltaPercent || 75}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${index?.components?.improvementDeltaPercent || 75}%` }}
                />
              </div>
            </div>

            {/* Component 5: Evidence Completeness */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">5. Documentary Evidence Completeness</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-purple-100 text-purple-700 rounded font-semibold">
                    Weight: {(weights.evidenceCompleteness * 100).toFixed(0)}%
                  </span>
                </div>
                <span className="font-extrabold text-slate-900">
                  {index?.components?.evidenceCompletenessPercent || 85}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${index?.components?.evidenceCompletenessPercent || 85}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7 NAAC Criteria Performance Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">The 7 Higher Education Quality Criteria</h2>
            <p className="text-xs text-slate-500 mt-0.5">Continuous evaluation benchmarks aligned with institutional standards</p>
          </div>
          <button
            onClick={() => setActivePage('quality-indicators')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View All Indicators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.criteriaSummary?.map((cat: any) => (
            <div
              key={cat.categoryId}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3 cursor-pointer"
              onClick={() => setActivePage('quality-indicators')}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-blue-600">{cat.code}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-medium">
                  Weight: {cat.weight}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-800 leading-tight">{cat.name}</h3>
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                  <span>Achievement:</span>
                  <span className="font-bold text-slate-900">{cat.achievementPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${cat.achievementPercent}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-slate-500 block">
                {cat.indicatorsCount} active quality indicators
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weights Configuration Modal */}
      {showWeightsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Adjust Quality Index Weights</h3>
              </div>
              <button
                onClick={() => setShowWeightsModal(false)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-bold rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWeights} className="mt-4 space-y-3.5 text-xs">
              <p className="text-slate-500 text-[11px]">
                Define institutional priorities. The total sum of decimal weights must equal exactly 1.00 (100%).
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Stakeholder Satisfaction Weight (e.g. 0.30 = 30%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={weights.stakeholderSatisfaction}
                  onChange={(e) => setWeights({ ...weights, stakeholderSatisfaction: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Response Rate Weight (e.g. 0.15 = 15%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={weights.responseRate}
                  onChange={(e) => setWeights({ ...weights, responseRate: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Action Closure Rate Weight (e.g. 0.25 = 25%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={weights.actionClosureRate}
                  onChange={(e) => setWeights({ ...weights, actionClosureRate: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Improvement Delta Weight (e.g. 0.15 = 15%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={weights.improvementDelta}
                  onChange={(e) => setWeights({ ...weights, improvementDelta: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Evidence Completeness Weight (e.g. 0.15 = 15%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={weights.evidenceCompleteness}
                  onChange={(e) => setWeights({ ...weights, evidenceCompleteness: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWeightsModal(false)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-semibold cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold cursor-pointer flex items-center justify-center"
                >
                  Recalculate & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-Click AI ATR Modal (Criterion 1.4) */}
      <AiAtrReportModal
        isOpen={showAiAtrModal}
        onClose={() => {
          setShowAiAtrModal(false);
          loadData();
        }}
        preselectedAcademicYear={selectedAcademicYear || 'ay-5'}
      />
    </div>
  );
};
