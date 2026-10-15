import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  Clock,
  Check,
  X,
  AlertOctagon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { QualityIndicator } from '../types';

export const QualityIndicatorsPage: React.FC = () => {
  const { selectedAcademicYear, showToast, departments } = useApp();
  const { hasRole, currentUser } = useAuth();

  const [indicators, setIndicators] = useState<QualityIndicator[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Edit / Add modal state
  const [editingIndicator, setEditingIndicator] = useState<QualityIndicator | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    categoryId: 'cat-1',
    targetScore: 4.0,
    actualScore: 3.8,
    unit: 'Rating (1-5)',
    dataSource: 'Stakeholder Feedback Surveys',
    frequency: 'Annual',
    owner: 'IQAC Coordinator',
  });

  // Rapid CAPA Assignment Modal state
  const [rapidCapaIndicator, setRapidCapaIndicator] = useState<QualityIndicator | null>(null);
  const [rapidCapaData, setRapidCapaData] = useState({
    correctiveAction: '',
    preventiveAction: '',
    assignedToId: 'user-hod-cse',
    assignedToName: 'Dr. Monika Sachdeva (HoD CSE)',
  });
  const [isAssigningCapa, setIsAssigningCapa] = useState(false);

  const loadIndicators = () => {
    setIsLoading(true);
    fetch('/api/quality-indicators')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setIndicators(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadIndicators();
  }, [selectedAcademicYear]);

  // Check if indicator is escalated (> 30 days below target without assigned CAPA plan)
  const isIndicatorEscalated = (qi: QualityIndicator) => {
    return Boolean(
      qi.isEscalated ||
        (qi.actualScore < qi.targetScore && (qi.daysBelowTarget || 0) >= 30 && !qi.hasAssignedCapa)
    );
  };

  const escalatedIndicators = indicators.filter(isIndicatorEscalated);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIndicator) return;

    try {
      const res = await fetch(`/api/quality-indicators/${editingIndicator.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actualScore: Number(editingIndicator.actualScore),
          targetScore: Number(editingIndicator.targetScore),
          owner: editingIndicator.owner,
        }),
      });

      if (res.ok) {
        showToast('Quality Indicator updated!', 'success');
        setEditingIndicator(null);
        loadIndicators();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/quality-indicators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('New Quality Indicator registered!', 'success');
        setShowAddModal(false);
        loadIndicators();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenRapidCapa = (qi: QualityIndicator) => {
    setRapidCapaIndicator(qi);
    setRapidCapaData({
      correctiveAction: `Remediate ${qi.name} deficit through targeted departmental intervention and syllabus/infrastructure revision.`,
      preventiveAction: `Institute bi-weekly tracking checkpoints and incorporate progress metrics in monthly HoD review meetings.`,
      assignedToId: 'user-hod-cse',
      assignedToName: 'Dr. Monika Sachdeva (HoD CSE)',
    });
  };

  const handleAssignRapidCapa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rapidCapaIndicator) return;

    setIsAssigningCapa(true);
    try {
      const res = await fetch(`/api/quality-indicators/${rapidCapaIndicator.id}/assign-rapid-capa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rapidCapaData),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(
          `⚡ Rapid CAPA (${data.actionPlan?.code || 'CAPA'}) assigned to ${rapidCapaData.assignedToName}! Escalation resolved.`,
          'success'
        );
        setRapidCapaIndicator(null);
        loadIndicators();
      } else {
        throw new Error('Failed to assign CAPA');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error assigning CAPA: ' + (err.message || 'Server error'), 'error');
    } finally {
      setIsAssigningCapa(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All 7 Criteria' },
    ...(escalatedIndicators.length > 0
      ? [{ id: 'escalated', name: `🚨 Escalation Watchlist (${escalatedIndicators.length})` }]
      : []),
    { id: 'cat-1', name: 'Criterion 1: Curricular Aspects' },
    { id: 'cat-2', name: 'Criterion 2: Teaching-Learning' },
    { id: 'cat-3', name: 'Criterion 3: Research & Innovation' },
    { id: 'cat-4', name: 'Criterion 4: Infrastructure' },
    { id: 'cat-5', name: 'Criterion 5: Student Support' },
    { id: 'cat-6', name: 'Criterion 6: Governance' },
    { id: 'cat-7', name: 'Criterion 7: Institutional Values' },
  ];

  const filtered = indicators.filter((qi) => {
    if (selectedCat === 'all') return true;
    if (selectedCat === 'escalated') return isIndicatorEscalated(qi);
    return qi.categoryId === selectedCat;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'EXCELLENT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'GOOD':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'NEEDS_ATTENTION':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded uppercase">
              Accreditation Alignment
            </span>
            <span className="text-xs text-slate-400">• Institutional Quality Indicators</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Quality Indicators (The 7 NAAC Criteria)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Systematic measurement benchmarks categorized under the statutory 7 higher-education quality criteria with automated 30-day escalation watchdog.
          </p>
        </div>

        {hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Indicator</span>
          </button>
        )}
      </div>

      {/* Automated Escalation Alert Watchdog Banner */}
      {escalatedIndicators.length > 0 && (
        <div className="bg-linear-to-r from-red-950 via-red-900 to-slate-900 border border-red-500/50 p-4 sm:p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-400/50 flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-5 h-5 text-red-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
                    Automated Escalation Alert
                  </span>
                  <span className="text-xs font-bold text-red-200">
                    Threshold: &gt; 30 Days Below Target Without CAPA
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
                  {escalatedIndicators.length} Indicators Flagged for Mandatory CAPA Intervention
                </h3>
                <p className="text-xs text-red-200/80 mt-0.5 max-w-2xl">
                  Indicators scoring consistently below institutional benchmarks for more than 30 days without an assigned Corrective and Preventive Action plan are automatically escalated to the Principal and IQAC Director.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 shrink-0">
              <button
                onClick={() => setSelectedCat(selectedCat === 'escalated' ? 'all' : 'escalated')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>
                  {selectedCat === 'escalated' ? 'Show All Criteria' : `Isolate ${escalatedIndicators.length} Escalations`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Criteria Category Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              selectedCat === cat.id
                ? cat.id === 'escalated'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-[#0a192f] text-white shadow-xs'
                : cat.id === 'escalated'
                ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-bold'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((qi) => {
          const achievePercent = Math.min(100, Math.round((qi.actualScore / qi.targetScore) * 100));
          const isEscalated = isIndicatorEscalated(qi);

          return (
            <div
              key={qi.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isEscalated
                  ? 'border-red-300 ring-2 ring-red-500/20 bg-red-50/10 hover:border-red-400'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {qi.code}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {isEscalated && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-600 text-white flex items-center space-x-1 animate-pulse shadow-xs">
                        <Flame className="w-3 h-3" />
                        <span>ESCALATED (&gt;30d)</span>
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(qi.status)}`}>
                      {qi.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{qi.name}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{qi.description}</p>

                {/* Escalation Warning Box */}
                {isEscalated && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-extrabold text-red-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Below Target for {qi.daysBelowTarget || 35} Consecutive Days</span>
                    </div>
                    <p className="text-[11px] text-red-800 leading-tight">
                      No active CAPA plan assigned. Escalated to Principal and HoD for urgent remediation.
                    </p>
                  </div>
                )}

                {/* Score vs Target progress */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Actual Score:</span>
                    <span className="font-black text-slate-900 text-sm">
                      {qi.actualScore} / {qi.targetScore} ({qi.unit})
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        achievePercent >= 90
                          ? 'bg-emerald-600'
                          : achievePercent >= 75
                          ? 'bg-blue-600'
                          : isEscalated
                          ? 'bg-red-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${achievePercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Target: {qi.targetScore}</span>
                    <span className="font-bold text-slate-700">{achievePercent}% Achieved</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                  <p>
                    <strong>Source:</strong> {qi.dataSource}
                  </p>
                  <p>
                    <strong>Owner:</strong> {qi.owner}
                  </p>
                  {qi.hasAssignedCapa && (
                    <p className="text-emerald-700 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 inline" />
                      <span>Active CAPA: {qi.assignedCapaCode || 'Assigned'}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {isEscalated ? (
                  <button
                    onClick={() => handleOpenRapidCapa(qi)}
                    className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Assign Rapid CAPA</span>
                  </button>
                ) : (
                  hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
                    <div className="w-full flex justify-end">
                      <button
                        onClick={() => setEditingIndicator(qi)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Update Actual Score</span>
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rapid CAPA Assignment Modal */}
      {rapidCapaIndicator && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Assign Rapid CAPA Plan (Escalation Resolution)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Resolves 30-day escalation for {rapidCapaIndicator.code}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRapidCapaIndicator(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
              <p className="font-bold text-red-900">{rapidCapaIndicator.name}</p>
              <p className="text-red-700">
                Score: <strong>{rapidCapaIndicator.actualScore}</strong> vs Target: <strong>{rapidCapaIndicator.targetScore}</strong> ({rapidCapaIndicator.daysBelowTarget || 35} consecutive days unassigned)
              </p>
            </div>

            <form onSubmit={handleAssignRapidCapa} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Department Head / Lead</label>
                <select
                  value={rapidCapaData.assignedToName}
                  onChange={(e) =>
                    setRapidCapaData({
                      ...rapidCapaData,
                      assignedToName: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Dr. Monika Sachdeva (HoD CSE)">Dr. Monika Sachdeva (HoD Computer Science & Engineering)</option>
                  <option value="Dr. Neel Kanth Grover (HoD Mechanical)">Dr. Neel Kanth Grover (HoD Mechanical Engineering)</option>
                  <option value="Dr. Vikramjeet Singh (HoD MCA)">Dr. Vikramjeet Singh (HoD Computer Applications)</option>
                  <option value="Dr. Harmeen Soch (HoD Management)">Dr. Harmeen Soch (HoD Management Studies)</option>
                  <option value="Dr. Raman Kumar (Coordinator CSE AI&ML)">Dr. Raman Kumar (Coordinator AI & Data Science)</option>
                  <option value="Dr. Mrigender Singh Bedi (Director Placements)">Dr. Mrigender Singh Bedi (Director CR&P / Placements)</option>
                  <option value="Dr. Satwinder Singh (Library Officer)">Dr. Satwinder Singh (Central Knowledge Resource Centre)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Immediate Corrective Action</label>
                <textarea
                  rows={2}
                  value={rapidCapaData.correctiveAction}
                  onChange={(e) =>
                    setRapidCapaData({ ...rapidCapaData, correctiveAction: e.target.value })
                  }
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Long-term Preventive Measure / SOP</label>
                <textarea
                  rows={2}
                  value={rapidCapaData.preventiveAction}
                  onChange={(e) =>
                    setRapidCapaData({ ...rapidCapaData, preventiveAction: e.target.value })
                  }
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Target Resolution: 30 Days</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setRapidCapaIndicator(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAssigningCapa}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isAssigningCapa ? 'Assigning...' : 'Provision CAPA Plan'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Indicator Modal */}
      {editingIndicator && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">
              Update Indicator: {editingIndicator.code}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{editingIndicator.name}</p>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Actual Measured Score</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingIndicator.actualScore}
                  onChange={(e) =>
                    setEditingIndicator({
                      ...editingIndicator,
                      actualScore: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Score Benchmark</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingIndicator.targetScore}
                  onChange={(e) =>
                    setEditingIndicator({
                      ...editingIndicator,
                      targetScore: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Owner / Custodian</label>
                <input
                  type="text"
                  value={editingIndicator.owner}
                  onChange={(e) =>
                    setEditingIndicator({
                      ...editingIndicator,
                      owner: e.target.value,
                    })
                  }
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingIndicator(null)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer flex items-center justify-center"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Indicator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">Register New Quality Indicator</h3>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code (e.g. QI-1.3.1)</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="QI-1.1.2"
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Criterion</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="cat-1">Criterion 1: Curricular Aspects</option>
                    <option value="cat-2">Criterion 2: Teaching-Learning</option>
                    <option value="cat-3">Criterion 3: Research & Innovation</option>
                    <option value="cat-4">Criterion 4: Infrastructure</option>
                    <option value="cat-5">Criterion 5: Student Support</option>
                    <option value="cat-6">Criterion 6: Governance</option>
                    <option value="cat-7">Criterion 7: Institutional Values</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Indicator Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Percentage of faculty incorporating LMS and ICT tools"
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Score</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.targetScore}
                    onChange={(e) => setFormData({ ...formData, targetScore: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Actual Score</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.actualScore}
                    onChange={(e) => setFormData({ ...formData, actualScore: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer flex items-center justify-center"
                >
                  Save Indicator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
