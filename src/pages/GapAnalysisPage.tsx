import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Filter,
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { QualityGap } from '../types';

export const GapAnalysisPage: React.FC = () => {
  const { selectedAcademicYear, showToast, setActivePage } = useApp();
  const { hasRole } = useAuth();

  const [gaps, setGaps] = useState<QualityGap[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Convert to CAPA Modal state
  const [selectedGapForCapa, setSelectedGapForCapa] = useState<QualityGap | null>(null);
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  const [assignedToName, setAssignedToName] = useState('Dr. Anand Raman (HoD CSE)');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10));

  const loadGaps = () => {
    setIsLoading(true);
    fetch('/api/gaps')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setGaps(data);
      })
      .catch((err) => console.error('Gaps error:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadGaps();
  }, [selectedAcademicYear]);

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/gaps/${id}/verify`, { method: 'POST' });
      if (res.ok) {
        showToast('Quality gap verified by IQAC!', 'success');
        loadGaps();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvertToCapa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGapForCapa) return;

    try {
      const res = await fetch(`/api/gaps/${selectedGapForCapa.id}/convert-to-capa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rootCause,
          correctiveAction,
          preventiveAction,
          assignedToName,
          dueDate,
        }),
      });

      if (res.ok) {
        showToast('Quality gap successfully converted to CAPA action plan!', 'success');
        setSelectedGapForCapa(null);
        loadGaps();
        setActivePage('action-plans');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = gaps.filter((g) => {
    if (filterPriority !== 'all' && g.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && g.status !== filterStatus) return false;
    return true;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded uppercase">
              Gap Detection Engine
            </span>
            <span className="text-xs text-slate-400">• Automated Quality Thresholds</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Quality Gap Analysis & Threshold Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Parameters scoring below institutional targets are systematically detected, reviewed by IQAC, and converted into CAPA plans.
          </p>
        </div>

        {/* Priority & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            aria-label="Filter by priority"
            className="min-h-[44px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter by status"
            className="min-h-[44px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="DETECTED">Detected</option>
            <option value="IQAC_VERIFIED">IQAC Verified</option>
            <option value="CAPA_INITIATED">CAPA Initiated</option>
          </select>
        </div>
      </div>

      {/* Gaps Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((gap) => (
          <div
            key={gap.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1.5">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${getPriorityBadge(gap.priority)}`}>
                    {gap.priority} PRIORITY
                  </span>
                  {gap.naacSubMetric && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      gap.naacSubMetric === '2.7.1'
                        ? 'bg-purple-50 text-purple-900 border-purple-200'
                        : gap.naacSubMetric === '1.4.1'
                        ? 'bg-blue-50 text-blue-900 border-blue-200'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    }`}>
                      NAAC {gap.naacSubMetric}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    gap.status === 'CONVERTED_TO_ACTION'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : gap.status === 'VERIFIED'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {gap.status.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{gap.parameter}</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{gap.category}</p>

              {/* Metric Delta Comparison Box */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Current Score</span>
                  <span className="text-sm font-extrabold text-red-600">{gap.currentScore.toFixed(2)} ★</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Target Score</span>
                  <span className="text-sm font-extrabold text-slate-800">{gap.targetScore.toFixed(2)} ★</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Deficiency Delta</span>
                  <span className="text-sm font-extrabold text-red-600 font-mono">
                    {gap.gapValue > 0 ? `-${gap.gapValue}` : gap.gapValue}
                  </span>
                </div>
              </div>

              <div className="mt-3.5 space-y-1.5 text-xs">
                <p className="text-slate-700">
                  <strong className="text-slate-900">Suggested Intervention:</strong> {gap.suggestedAction}
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                  <span>Affected:</span>
                  {gap.affectedGroups.map((grp) => (
                    <span key={grp} className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">
                      {grp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              {gap.status === 'DETECTED' && hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
                <button
                  onClick={() => handleVerify(gap.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Verify Gap
                </button>
              )}

              {gap.status !== 'CONVERTED_TO_ACTION' ? (
                <button
                  onClick={() => {
                    setSelectedGapForCapa(gap);
                    setRootCause(`Stakeholder evaluation reflects deficiency in ${gap.parameter}.`);
                    setCorrectiveAction(gap.suggestedAction);
                    setPreventiveAction('Incorporate continuous feedback checkpoints and departmental monitoring.');
                  }}
                  className="ml-auto px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Formulate CAPA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="ml-auto text-xs font-bold text-purple-700 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Assigned to HoD</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Convert to CAPA Plan Modal */}
      {selectedGapForCapa && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  NEW CAPA ACTION PLAN
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Convert Gap to CAPA: {selectedGapForCapa.parameter}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGapForCapa(null)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-bold rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConvertToCapa} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Identified Root Cause</label>
                <textarea
                  rows={2}
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Corrective Action (Immediate Remedy)</label>
                <textarea
                  rows={2}
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Preventive Action (Systemic Safeguard to prevent recurrence)
                </label>
                <textarea
                  rows={2}
                  value={preventiveAction}
                  onChange={(e) => setPreventiveAction(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Assigned Responsible Person / HoD</label>
                  <input
                    type="text"
                    value={assignedToName}
                    onChange={(e) => setAssignedToName(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedGapForCapa(null)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer flex items-center justify-center"
                >
                  Create & Assign CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
