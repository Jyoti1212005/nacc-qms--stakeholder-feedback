import React, { useState, useEffect } from 'react';
import { Settings, Sliders, ShieldCheck, Building2, Calendar, Award, CheckCircle2, User, IdCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { StakeholderProfile } from '../components/StakeholderProfile';

export const SettingsPage: React.FC = () => {
  const { showToast } = useApp();
  const { hasRole, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'config'>('profile');
  const [settings, setSettings] = useState<any>(null);
  const [weights, setWeights] = useState({
    stakeholderSatisfaction: 0.3,
    responseRate: 0.15,
    actionClosureRate: 0.25,
    improvementDelta: 0.15,
    evidenceCompleteness: 0.15,
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        if (data.weights) setWeights(data.weights);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSaveWeights = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/iqac/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weights),
      });
      if (res.ok) {
        showToast('Institutional Quality Index weights updated!', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 text-[10px] font-bold bg-[#fff0e6] text-[#c2410c] rounded uppercase border border-[#fed7aa]">
            Stakeholder & System Governance
          </span>
          <span className="text-xs text-slate-400">• Continuous Quality Framework</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight">
              {activeTab === 'profile' ? 'Active Stakeholder Profile Credential' : 'Settings & Institutional Configuration'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTab === 'profile'
                ? 'Interactive 3D credential identity card mapping institutional department, role permissions, and accreditation activity.'
                : 'Configure institutional parameters, accreditation cycle settings, and formula weights for the continuous quality improvement index.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-[#fffaf5] border border-[#fed7aa] rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#c2410c] hover:bg-[#fff0e6]'
              }`}
            >
              <IdCard className="w-3.5 h-3.5 text-[#ff7a50]" />
              <span>My 3D Credential</span>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-[#0a192f] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#c2410c] hover:bg-[#fff0e6]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#ff7a50]" />
              <span>Governance & Weights</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Embedded 3D Stakeholder Profile */}
      {activeTab === 'profile' && (
        <div className="animate-in fade-in duration-200">
          <StakeholderProfile variant="embedded" />
        </div>
      )}

      {/* Tab 2: Institutional Metadata & Weights */}
      {activeTab === 'config' && (
        <div className="space-y-6 animate-in fade-in duration-200">

      {/* Institutional Metadata Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Institutional Accreditation Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Institution Name</span>
            <span className="font-bold text-slate-800 text-sm block mt-0.5">
              {settings?.institutionName || 'Apex Institute of Technology & Management'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Accreditation Cycle</span>
            <span className="font-bold text-slate-800 text-sm block mt-0.5">
              {settings?.currentCycle || 'Cycle 3 (2022-2027)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Accreditation Grade</span>
            <span className="font-bold text-emerald-700 text-sm block mt-0.5">
              {settings?.accreditationStatus || 'A+ Grade (3.42 CGPA in Cycle 2)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-semibold">Current Academic Year</span>
            <span className="font-bold text-blue-700 text-sm block mt-0.5">
              {settings?.currentAcademicYear || '2026-27 (Active)'}
            </span>
          </div>
        </div>
      </div>

      {/* Quality Weights Editor Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Internal Quality Improvement Index Weights</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Total: 100%</span>
        </div>

        <p className="text-xs text-slate-500">
          Adjust the relative weightings allocated to stakeholder satisfaction, survey response rate, CAPA action closure rate, remeasured improvement deltas, and evidence completeness.
        </p>

        <form onSubmit={handleSaveWeights} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Stakeholder Satisfaction Weight ({((weights.stakeholderSatisfaction || 0.3) * 100).toFixed(0)}%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={weights.stakeholderSatisfaction}
                onChange={(e) => setWeights({ ...weights, stakeholderSatisfaction: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Response Rate Weight ({((weights.responseRate || 0.15) * 100).toFixed(0)}%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={weights.responseRate}
                onChange={(e) => setWeights({ ...weights, responseRate: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Action Closure Rate Weight ({((weights.actionClosureRate || 0.25) * 100).toFixed(0)}%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={weights.actionClosureRate}
                onChange={(e) => setWeights({ ...weights, actionClosureRate: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Improvement Delta Weight ({((weights.improvementDelta || 0.15) * 100).toFixed(0)}%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={weights.improvementDelta}
                onChange={(e) => setWeights({ ...weights, improvementDelta: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Evidence Completeness Weight ({((weights.evidenceCompleteness || 0.15) * 100).toFixed(0)}%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={weights.evidenceCompleteness}
                onChange={(e) => setWeights({ ...weights, evidenceCompleteness: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#0a192f] hover:bg-[#132c52] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                Save Weight Configurations
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
    )}
  </div>
);
};
