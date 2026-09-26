import React from 'react';
import { ShieldAlert, ArrowLeft, Users, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { NavigationPage } from '../types';
import { ThreeDTiltCard } from './ThreeDTiltCard';

interface RolePermissionGuardProps {
  attemptedPage: NavigationPage;
}

export const RolePermissionGuard: React.FC<RolePermissionGuardProps> = ({ attemptedPage }) => {
  const { currentUser, currentRoleDefinition, defaultLandingPage, demoAccounts, demoLogin } = useAuth();
  const { setActivePage } = useApp();

  const getPageTitle = (page: NavigationPage): string => {
    const titles: Record<NavigationPage, string> = {
      dashboard: 'Executive Institutional Dashboard',
      admin: 'Central Admin Portal & Root Mission Control',
      iqac: 'IQAC Executive Command Center',
      feedback: 'Stakeholder Feedback Surveys & Modules',
      'closing-the-loop': 'Public Closing the Loop Stakeholder Tracker',
      gaps: 'Continuous Quality Gap Matrix',
      'action-plans': 'CAPA Remediation & Action Plans',
      evidence: 'Institutional Verifiable Evidence Repository',
      'quality-indicators': '7 Criteria Quality Indicators',
      atr: 'NAAC Action Taken Report (ATR) Portal',
      'ai-analytics': 'AI Qualitative Synthesis Engine',
      department: 'Academic Department Command Center',
      reports: 'Official Institutional Report Generation',
      'audit-logs': 'Immutable Security & Audit Trail',
      settings: 'Quality Formula & System Weights Configuration',
    };
    return titles[page] || page;
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <ThreeDTiltCard maxTilt={8} scale={1.01}>
          <div className="bg-white rounded-3xl p-8 border-2 border-[#fed7aa] shadow-2xl overflow-hidden relative">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-[#0a192f] via-[#ff7a50] to-[#0a192f]" />

            <div className="flex items-start space-x-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#fff0e6] text-[#ff7a50] border border-[#fed7aa] flex items-center justify-center shrink-0 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-300">
                    Restricted Role Permission
                  </span>
                  <span className="text-xs text-slate-500 font-medium">RBAC Security Guard</span>
                </div>
                <h2 className="text-2xl font-black text-[#0a192f] mt-1 tracking-tight">
                  Access Restricted for Current Persona
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  You requested access to <strong className="text-[#0a192f]">{getPageTitle(attemptedPage)}</strong>, which requires elevated institutional authority under NAAC Quality Management protocols.
                </p>
              </div>
            </div>

            {/* Current Stakeholder Profile */}
            <div className="bg-[#fffaf5] p-5 rounded-2xl border border-[#fed7aa] mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#f3e8e0]">
                <div>
                  <span className="text-[10px] font-extrabold text-[#c2410c] uppercase tracking-wider">
                    Current Active Persona
                  </span>
                  <h4 className="text-sm font-black text-[#0a192f]">
                    {currentUser?.fullName || 'Stakeholder Guest'}
                  </h4>
                </div>
                <span className={`px-2.5 py-1 text-xs font-black rounded-lg border ${currentRoleDefinition.badgeColor}`}>
                  {currentRoleDefinition.title}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                {currentRoleDefinition.description}
              </p>

              {/* NAAC Focus */}
              <div className="mt-3 pt-3 border-t border-[#f3e8e0]">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Accreditation Focus Scope:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {currentRoleDefinition.naacCriteriaFocus.map((crit, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] font-bold bg-white text-[#0a192f] rounded border border-[#fed7aa]"
                    >
                      {crit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Permitted Modules for this Persona */}
            <div className="mb-6">
              <h5 className="text-xs font-bold text-[#0a192f] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Modules Authorized for {currentRoleDefinition.title}</span>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {currentRoleDefinition.allowedPages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setActivePage(page)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#fff0e6] hover:border-[#ff7a50] text-left transition-all cursor-pointer group"
                  >
                    <p className="text-xs font-bold text-[#0a192f] group-hover:text-[#ff7a50] capitalize">
                      {page.replace('-', ' ')}
                    </p>
                    <span className="text-[10px] text-slate-600 group-hover:text-[#c2410c]">Launch module &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fast Persona Switcher for Testing/Demo */}
            <div className="pt-4 border-t border-[#f3e8e0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                onClick={() => setActivePage(defaultLandingPage)}
                className="px-4 py-2.5 rounded-xl bg-[#0a192f] text-white hover:bg-[#132c52] text-xs font-black transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <ArrowLeft className="w-4 h-4 text-[#ff7a50]" />
                <span>Return to Authorized View</span>
              </button>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Quick switch:</span>
                <button
                  onClick={async () => {
                    await demoLogin('superadmin@naac-qms.edu');
                    setActivePage('admin');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-black bg-[#ff7a50] text-[#0a192f] hover:bg-[#f0683d] transition-all cursor-pointer shadow-xs"
                >
                  Super Admin
                </button>
                <button
                  onClick={() => demoLogin('iqac@naac-qms.edu')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#fff0e6] text-[#c2410c] hover:bg-[#fed7aa] border border-[#fed7aa] transition-colors cursor-pointer"
                >
                  IQAC Director
                </button>
                <button
                  onClick={() => demoLogin('principal@naac-qms.edu')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#fff0e6] text-[#c2410c] hover:bg-[#fed7aa] border border-[#fed7aa] transition-colors cursor-pointer"
                >
                  Principal
                </button>
              </div>
            </div>
          </div>
        </ThreeDTiltCard>
      </div>
    </div>
  );
};
