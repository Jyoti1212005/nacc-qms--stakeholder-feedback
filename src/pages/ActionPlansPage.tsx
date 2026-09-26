import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Calendar,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Award,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ActionPlan, ActionStatus, EvidenceItem } from '../types';
import { ActionTakenReportResolvedCapaSection } from '../components/ActionTakenReportResolvedCapaSection';

export const ActionPlansPage: React.FC = () => {
  const { selectedAcademicYear, departments, showToast, setActivePage } = useApp();
  const { currentUser, hasRole } = useAuth();

  const [actions, setActions] = useState<ActionPlan[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAtrSection, setShowAtrSection] = useState(false);

  // Status Change Modal
  const [selectedAction, setSelectedAction] = useState<ActionPlan | null>(null);
  const [newStatus, setNewStatus] = useState<ActionStatus>('IN_PROGRESS');
  const [afterScore, setAfterScore] = useState<number | undefined>(undefined);
  const [closureRemarks, setClosureRemarks] = useState('');

  // Link Evidence Modal
  const [linkingAction, setLinkingAction] = useState<ActionPlan | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('');

  // Create CAPA Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createIssue, setCreateIssue] = useState('');
  const [createRootCause, setCreateRootCause] = useState('');
  const [createCorrective, setCreateCorrective] = useState('');
  const [createPreventive, setCreatePreventive] = useState('');
  const [createAssigned, setCreateAssigned] = useState('Dr. Anand Raman (HoD CSE)');
  const [createDueDate, setCreateDueDate] = useState(new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10));

  const loadData = () => {
    setIsLoading(true);
    Promise.all([
      fetch('/api/action-plans').then((r) => r.json()),
      fetch('/api/evidence').then((r) => r.json()),
    ])
      .then(([acts, evis]) => {
        if (Array.isArray(acts)) setActions(acts);
        if (Array.isArray(evis)) setEvidenceList(evis);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedAcademicYear]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    try {
      const res = await fetch(`/api/action-plans/${selectedAction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          afterScore: afterScore ? Number(afterScore) : selectedAction.afterScore,
          closureRemarks: closureRemarks || selectedAction.closureRemarks,
        }),
      });

      if (res.ok) {
        showToast(`CAPA ${selectedAction.code} updated to ${newStatus}!`, 'success');
        setSelectedAction(null);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLinkEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkingAction || !selectedEvidenceId) return;

    try {
      const res = await fetch(`/api/action-plans/${linkingAction.id}/link-evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evidenceId: selectedEvidenceId }),
      });

      if (res.ok) {
        showToast('Documentary evidence linked to CAPA!', 'success');
        setLinkingAction(null);
        setSelectedEvidenceId('');
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCapa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createIssue || !createCorrective) return;

    try {
      const res = await fetch('/api/action-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue: createIssue,
          rootCause: createRootCause,
          correctiveAction: createCorrective,
          preventiveAction: createPreventive,
          assignedToName: createAssigned,
          dueDate: createDueDate,
          departmentId: currentUser?.departmentId || 'dept-1',
          priority: 'HIGH',
        }),
      });

      if (res.ok) {
        showToast('New CAPA action plan created!', 'success');
        setShowCreateModal(false);
        setCreateIssue('');
        setCreateRootCause('');
        setCreateCorrective('');
        setCreatePreventive('');
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = actions.filter((a) => (filterStatus === 'all' ? true : a.status === filterStatus));

  const getStatusBadge = (st: ActionStatus) => {
    switch (st) {
      case 'CLOSED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'COMPLETED':
      case 'UNDER_VERIFICATION':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'AWAITING_EVIDENCE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded uppercase">
              CAPA Engine
            </span>
            <span className="text-xs text-slate-400">• Corrective & Preventive Action</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Action Plans & Quality Remediation (CAPA)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured remediation tracking with root-cause analysis, assigned owners, evidence attachments, and verified improvement remeasurement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAtrSection(!showAtrSection)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs border ${
              showAtrSection
                ? 'bg-[#0a192f] text-[#ffa07a] border-[#ff7a50]'
                : 'bg-white text-[#0a192f] border-[#fed7aa] hover:bg-[#fff0e6]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#ff7a50]" />
            <span>{showAtrSection ? 'Close ATR Report' : 'Action Taken Report (ATR)'}</span>
          </button>

          {hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create CAPA Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Taken Report (Resolved CAPA Summary) Section */}
      {showAtrSection && (
        <ActionTakenReportResolvedCapaSection
          departments={departments}
          selectedAcademicYear={selectedAcademicYear}
        />
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'ASSIGNED', 'IN_PROGRESS', 'AWAITING_EVIDENCE', 'UNDER_VERIFICATION', 'CLOSED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              filterStatus === st
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'all' ? 'All Plans' : st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Action Plans Cards */}
      <div className="space-y-4">
        {filtered.map((action) => (
          <div
            key={action.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-300 transition-all space-y-4"
          >
            {/* Header line */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-xs font-extrabold text-purple-700 px-2 py-0.5 bg-purple-50 rounded border border-purple-200">
                  {action.code}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(action.status)}`}>
                  {action.status.replace(/_/g, ' ')}
                </span>
                {action.isOverdue && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 animate-pulse">
                    OVERDUE
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <strong className="text-slate-700">{action.assignedToName}</strong>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: {action.dueDate}</span>
                </span>
              </div>
            </div>

            {/* Core Issue & Root Cause */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identified Quality Issue</span>
                <p className="font-semibold text-slate-900">{action.issue}</p>
                <p className="text-slate-600 text-[11px] pt-1">
                  <strong>Root Cause:</strong> {action.rootCause}
                </p>
              </div>

              <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remediation Protocol</span>
                <p className="text-slate-800">
                  <strong>Corrective Action:</strong> {action.correctiveAction}
                </p>
                <p className="text-slate-600 text-[11px] pt-1">
                  <strong>Preventive Action:</strong> {action.preventiveAction}
                </p>
              </div>
            </div>

            {/* Scores & Evidence Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
              {/* Score Delta */}
              <div className="flex items-center space-x-3">
                <div className="px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-[10px] text-amber-700 block font-semibold">Baseline Score</span>
                  <span className="font-black text-amber-900 text-xs">
                    {action.beforeScore ? `${action.beforeScore.toFixed(2)} ★` : 'N/A'}
                  </span>
                </div>
                <div className="px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block font-semibold">Remeasured Score</span>
                  <span className="font-black text-emerald-900 text-xs">
                    {action.afterScore ? `${action.afterScore.toFixed(2)} ★` : 'Pending Remeasurement'}
                  </span>
                </div>
                {action.beforeScore && action.afterScore && (
                  <div className="px-2.5 py-1 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-[10px] text-blue-700 block font-semibold">Improvement Delta</span>
                    <span className="font-black text-blue-900 text-xs font-mono">
                      +{(action.afterScore - action.beforeScore).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Linked Evidence Chips */}
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-semibold">Attached Evidence:</span>
                {action.evidenceList && action.evidenceList.length > 0 ? (
                  action.evidenceList.map((evi) => (
                    <span
                      key={evi.id}
                      onClick={() => setActivePage('evidence')}
                      className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 flex items-center space-x-1 cursor-pointer hover:bg-blue-100"
                    >
                      <Paperclip className="w-3 h-3" />
                      <span>{evi.code}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No documentary evidence attached</span>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Created by: {action.createdByName} • Cycle 2026-27
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLinkingAction(action)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach Evidence</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedAction(action);
                    setNewStatus(action.status);
                    setAfterScore(action.afterScore || 4.25);
                    setClosureRemarks(action.closureRemarks || '');
                  }}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Update Status / Verify
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Update Status / Closure Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Update CAPA Progress: {selectedAction.code}</h3>
              <button
                onClick={() => setSelectedAction(null)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-bold rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Action Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white font-semibold"
                >
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="AWAITING_EVIDENCE">AWAITING EVIDENCE</option>
                  <option value="UNDER_VERIFICATION">UNDER VERIFICATION</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CLOSED">CLOSED (IQAC Verified & Approved)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Remeasured Post-Intervention Score (1 - 5)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="5"
                  value={afterScore || ''}
                  onChange={(e) => setAfterScore(parseFloat(e.target.value))}
                  placeholder="e.g. 4.31"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Verification / Closure Remarks</label>
                <textarea
                  rows={2}
                  value={closureRemarks}
                  onChange={(e) => setClosureRemarks(e.target.value)}
                  placeholder="Verification summary and observations..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedAction(null)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold cursor-pointer flex items-center justify-center"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Evidence Modal */}
      {linkingAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Attach Documentary Evidence to {linkingAction.code}</h3>
              <button
                onClick={() => setLinkingAction(null)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-bold rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLinkEvidence} className="mt-4 space-y-3.5 text-xs">
              <p className="text-slate-500 text-[11px]">
                Select an archived document from the institutional repository to prove implementation of this corrective action.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Evidence Document</label>
                <select
                  value={selectedEvidenceId}
                  onChange={(e) => setSelectedEvidenceId(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white font-semibold"
                >
                  <option value="">-- Choose verified evidence item --</option>
                  {evidenceList.map((evi) => (
                    <option key={evi.id} value={evi.id}>
                      {evi.code} - {evi.title} ({evi.verificationStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setLinkingAction(null)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer flex items-center justify-center"
                >
                  Link Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New CAPA Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Initiate New CAPA Action Plan</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-bold rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCapa} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Deficiency / Issue Summary</label>
                <input
                  type="text"
                  value={createIssue}
                  onChange={(e) => setCreateIssue(e.target.value)}
                  placeholder="e.g. Inadequate high-performance compute resources in specialized labs"
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Root Cause Analysis</label>
                <textarea
                  rows={2}
                  value={createRootCause}
                  onChange={(e) => setCreateRootCause(e.target.value)}
                  placeholder="Underlying structural, procedural or resource bottleneck..."
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Corrective Action (Immediate Solution)</label>
                <textarea
                  rows={2}
                  value={createCorrective}
                  onChange={(e) => setCreateCorrective(e.target.value)}
                  placeholder="Direct remediation steps..."
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Preventive Action (Long-term Institutional Control)
                </label>
                <textarea
                  rows={2}
                  value={createPreventive}
                  onChange={(e) => setCreatePreventive(e.target.value)}
                  placeholder="Policy update, regular preventive maintenance, or recurring audit checkpoint..."
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned HoD / Leader</label>
                  <input
                    type="text"
                    value={createAssigned}
                    onChange={(e) => setCreateAssigned(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={createDueDate}
                    onChange={(e) => setCreateDueDate(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer flex items-center justify-center"
                >
                  Formulate CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
