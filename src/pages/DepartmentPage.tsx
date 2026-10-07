import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Star,
  AlertTriangle,
  CheckSquare,
  FileCheck2,
  ArrowRight,
  UserCheck,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const DepartmentPage: React.FC = () => {
  const { selectedAcademicYear, departments, setActivePage } = useApp();
  const { currentUser } = useAuth();

  // If user is HoD, default to their department
  const initialDept = currentUser?.departmentId || 'dept-1';
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDept);
  const [deptData, setDeptData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/departments/${selectedDeptId}/dashboard?academicYearId=${selectedAcademicYear}`)
      .then((r) => r.json())
      .then((data) => setDeptData(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [selectedDeptId, selectedAcademicYear]);

  const dept = deptData?.department;
  const stats = deptData?.stats;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-100 text-cyan-800 rounded uppercase">
              Academic Unit
            </span>
            <span className="text-xs text-slate-400">• Departmental Quality Cockpit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {dept?.name || 'Department Quality Command'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Head of Department: <strong className="text-slate-800">{dept?.headOfDept}</strong> • Estd. {dept?.establishedYear}
          </p>
        </div>

        {/* Department Switcher (only for Admins) */}
        {!currentUser?.departmentId && (
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              aria-label="Select department"
              className="min-h-[44px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Branch Courses & Degree Programmes Offered */}
      {deptData?.programmes && deptData.programmes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#c2410c] flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4 text-[#ff7a50]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Branch Courses & Programmes Offered</h2>
                <p className="text-xs text-slate-500">Degree curriculum tracks administered by {dept?.name}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#c2410c]">
              {deptData.programmes.length} Active Branch Course{deptData.programmes.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deptData.programmes.map((prog: any) => (
              <div
                key={prog.id}
                className="p-3.5 rounded-xl border border-orange-100 bg-[#fffaf5] flex items-start space-x-3 transition-all hover:border-[#fed7aa]"
              >
                <div className="p-2 rounded-lg bg-white border border-[#fed7aa] text-[#c2410c] shrink-0 font-mono text-xs font-black shadow-xs">
                  {prog.code}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-[#0a192f] text-xs">{prog.name}</h4>
                  <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {prog.degreeLevel}
                    </span>
                    <span>•</span>
                    <span className="font-medium">{prog.durationYears} Years Duration</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Feedback Responses</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.responsesCount || 0}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Students & Faculty</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Average Satisfaction</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <p className="text-2xl font-extrabold text-amber-600">
              {stats?.averageSatisfaction ? stats.averageSatisfaction.toFixed(2) : '4.15'}
            </p>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">Institutional benchmark: 4.2</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Active Quality Gaps</span>
          <p className="text-2xl font-extrabold text-red-600 mt-1">{stats?.activeGaps || 0}</p>
          <button onClick={() => setActivePage('gaps')} className="text-[10px] font-bold text-red-700 hover:underline mt-1 block">
            View Gaps &rarr;
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Open CAPA Plans</span>
          <p className="text-2xl font-extrabold text-purple-700 mt-1">{stats?.openActions || 0}</p>
          <span className="text-[10px] text-purple-800 font-semibold mt-1 block">
            {stats?.closedActions || 0} Actions Closed
          </span>
        </div>
      </div>

      {/* Action Plans specific to Department */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Department CAPA Assignments</h2>
            <p className="text-xs text-slate-500">Corrective actions assigned to {dept?.code} for quality closure</p>
          </div>
          <button
            onClick={() => setActivePage('action-plans')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>All CAPAs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {deptData?.actionPlans?.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No active action plans assigned to this department.</p>
        ) : (
          <div className="space-y-3">
            {deptData?.actionPlans?.map((a: any) => (
              <div
                key={a.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-purple-700">{a.code}</span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                      {a.status}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 mt-1">{a.issue}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    <strong>Action:</strong> {a.correctiveAction}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Due Date</span>
                    <span className="font-bold text-slate-700">{a.dueDate}</span>
                  </div>
                  <button
                    onClick={() => setActivePage('action-plans')}
                    className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Department Evidence */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Archived Department Evidence</h2>
            <p className="text-xs text-slate-500">Documentary compliance records verified for this unit</p>
          </div>
          <button
            onClick={() => setActivePage('evidence')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>Evidence Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {deptData?.evidence?.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No documentary evidence uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {deptData?.evidence?.map((e: any) => (
              <div key={e.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {e.code}
                </span>
                <h4 className="font-bold text-slate-800 line-clamp-1">{e.title}</h4>
                <p className="text-[11px] text-slate-500">{e.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
