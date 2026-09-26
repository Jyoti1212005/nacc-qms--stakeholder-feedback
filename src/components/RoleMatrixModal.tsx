import React, { useState } from 'react';
import { X, ShieldCheck, Check, Lock, ChevronRight, Layers, Users, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role, StakeholderRoleDefinition, NavigationPage } from '../types';

interface RoleMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleMatrixModal: React.FC<RoleMatrixModalProps> = ({ isOpen, onClose }) => {
  const { allRoleDefinitions, demoAccounts, demoLogin, currentRoleDefinition } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>(currentRoleDefinition.role);

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
    <div className="fixed inset-0 z-50 bg-[#0a192f]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#fed7aa] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a192f] text-white flex items-center justify-between border-b border-[#1b3456]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff7a50] text-white flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Stakeholder Role Matrix & Routing Permissions
                </h3>
                <span className="text-[10px] bg-[#fff0e6] text-[#c2410c] px-2 py-0.5 rounded font-extrabold border border-[#fed7aa]">
                  NAAC RBAC 2026
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Formal definitions, NAAC criteria scopes, and granular routing permissions across modules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Role Selector List */}
          <div className="w-full md:w-72 bg-[#fffaf5] border-r border-[#eddcd2] p-3 overflow-y-auto space-y-1.5 shrink-0">
            <p className="text-[10px] font-extrabold text-[#c2410c] uppercase tracking-wider px-2 py-1">
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
                      ? 'bg-[#0a192f] text-white font-bold shadow-md shadow-[#0a192f]/20'
                      : 'hover:bg-[#fff0e6] text-slate-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate font-semibold">{def.title.split('(')[0]}</p>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${isSelected ? 'text-[#ffa07a]' : 'text-slate-500'}`}>
                      {def.category}
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#ffa07a]' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Definition & Permissions Table */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {/* Role Header Banner */}
            <div className="p-4 rounded-2xl bg-[#fffaf5] border border-[#fed7aa] mb-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-black border mb-1.5 ${currentDef.badgeColor}`}>
                    {currentDef.category}
                  </span>
                  <h4 className="text-lg font-black text-[#0a192f]">{currentDef.title}</h4>
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
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-[#ff7a50] hover:bg-[#ea580c] text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Test Persona</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* NAAC Criteria Focus */}
              <div className="mt-3 pt-3 border-t border-[#f3e8e0]">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Accreditation Focus Scope:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {currentDef.naacCriteriaFocus.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[11px] font-bold bg-white text-[#0a192f] border border-[#fed7aa] rounded-md shadow-2xs"
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
                <h5 className="text-xs font-extrabold text-[#0a192f] uppercase tracking-wider">
                  Module Routing & Access Permissions
                </h5>
                <span className="text-[11px] font-bold text-[#c2410c]">
                  {currentDef.allowedPages.length} of {allModules.length} Authorized
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {allModules.map((mod) => {
                  const isAllowed = currentDef.allowedPages.includes(mod.id);
                  const isDefault = currentDef.defaultLandingPage === mod.id;

                  return (
                    <div
                      key={mod.id}
                      className={`p-3 text-xs flex items-center justify-between transition-colors ${
                        isAllowed ? 'bg-white' : 'bg-slate-50/60 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${isAllowed ? 'text-[#0a192f]' : 'text-slate-400'}`}>
                            {mod.label}
                          </span>
                          {isDefault && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa]">
                              Default Landing View
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{mod.desc}</p>
                      </div>

                      <div className="shrink-0 ml-3">
                        {isAllowed ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                            <Check className="w-3 h-3" />
                            <span>Permitted</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
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
        <div className="px-6 py-3 bg-[#fffaf5] border-t border-[#eddcd2] flex items-center justify-between text-xs text-slate-500">
          <span>Role changes are enforced immediately via client-side Auth Context & session bearer headers.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#0a192f] text-white hover:bg-[#152e52] font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
