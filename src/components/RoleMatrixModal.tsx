import React, { useState } from 'react';
import { X, ShieldCheck, Check, Lock, ChevronRight, Layers, Users, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role, StakeholderRoleDefinition, NavigationPage } from '../types';

interface RoleMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: Role;
}

export const RoleMatrixModal: React.FC<RoleMatrixModalProps> = ({ isOpen, onClose, initialRole }) => {
  const { allRoleDefinitions, demoAccounts, demoLogin, currentRoleDefinition } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole || currentRoleDefinition.role);

  React.useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const currentDef = allRoleDefinitions.find((r) => r.role === selectedRole) || allRoleDefinitions[0];

  const allModules: { id: NavigationPage; label: string; desc: string }[] = [
    { id: 'dashboard', label: 'Institutional Dashboard', desc: 'Overview of satisfaction indices and indicators' },
    { id: 'feedback', label: 'Stakeholder Feedback Surveys', desc: 'Take surveys, submit appraisals, feedback forms' },
    { id: 'quality-indicators', label: 'Quality Indicators (7 Criteria)', desc: 'NAAC criteria breakdown and benchmarks' },
    { id: 'department', label: 'Department Command', desc: 'Departmental trends, faculty allocations, course outcomes' },
    { id: 'gaps', label: 'Quality Gap Analysis', desc: 'Automated gap triggers, priority escalation matrix' },
    { id: 'action-plans', label: 'CAPA & Action Plans', desc: 'Root cause analysis, assignees, milestones' },
    { id: 'evidence', label: 'Evidence Repository', desc: 'Verifiable audit documents, MoUs, purchase orders' },
    { id: 'atr', label: 'Action Taken Reports (ATR)', desc: 'Before/after verified score delta reports' },
    { id: 'ai-analytics', label: 'Qualitative Sentiment Analytics', desc: 'Thematic feedback clustering and sentiment summaries' },
    { id: 'iqac', label: 'IQAC Command Center', desc: 'Accreditation cycle orchestration and index thresholds' },
    { id: 'reports', label: 'Report Generation', desc: 'Export executive PDFs, Excel sheets, compliance logs' },
    { id: 'audit-logs', label: 'Audit Trail', desc: 'Immutable user activity, IP logs, change tracking' },
    { id: 'settings', label: 'Formula & System Weights', desc: 'Configure index component weights and RBAC rules' },
  ];

  const correspondingDemo = demoAccounts.find((a) => a.role === selectedRole);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white tracking-tight">
                  Stakeholder Role Matrix & Routing Governance
                </h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-semibold border border-blue-400/30">
                  NAAC RBAC 2026
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Formal definitions, NAAC criteria scopes, and granular routing permissions across modules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Role Selector List */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto space-y-1 shrink-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
              Select Stakeholder Role
            </p>
            {allRoleDefinitions.map((def) => {
              const isSelected = selectedRole === def.role;
              return (
                <button
                  key={def.role}
                  onClick={() => setSelectedRole(def.role)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate font-semibold">{def.title.split('(')[0]}</p>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${isSelected ? 'text-blue-300' : 'text-slate-500'}`}>
                      {def.category}
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Definition & Permissions Table */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {/* Role Header Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border mb-1.5 ${currentDef.badgeColor}`}>
                    {currentDef.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{currentDef.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {currentDef.description}
                  </p>
                </div>
                {correspondingDemo && (
                  <button
                    onClick={() => {
                      demoLogin(correspondingDemo.email);
                      onClose();
                    }}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Sign In As Persona</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* NAAC Criteria Focus */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Accreditation Focus Scope:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {currentDef.naacCriteriaFocus.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[11px] font-medium bg-white text-slate-800 border border-slate-200 rounded-md shadow-2xs"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Granular Module Routing Permissions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Module Routing & Access Permissions
                </h5>
                <span className="text-[11px] font-semibold text-blue-600">
                  {currentDef.allowedPages.length} of {allModules.length} Authorized
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {allModules.map((mod) => {
                  const isAllowed = currentDef.allowedPages.includes(mod.id);
                  const isDefault = currentDef.defaultLandingPage === mod.id;

                  return (
                    <div
                      key={mod.id}
                      className={`p-3 text-xs flex items-center justify-between transition-colors ${
                        isAllowed ? 'bg-white' : 'bg-slate-50/70 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${isAllowed ? 'text-slate-900' : 'text-slate-400'}`}>
                            {mod.label}
                          </span>
                          {isDefault && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              Default Landing View
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{mod.desc}</p>
                      </div>

                      <div className="shrink-0 ml-3">
                        {isAllowed ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>Permitted</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
                            <Lock className="w-3 h-3" />
                            <span>Restricted</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Role changes are enforced immediately via client-side Auth Context & session bearer headers.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
