import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Filter, Clock, User, Globe, FileCode } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuditLogItem } from '../types';

export const AuditLogsPage: React.FC = () => {
  const { selectedAcademicYear } = useApp();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (filterModule !== 'all') params.append('module', filterModule);
    if (search) params.append('search', search);

    fetch(`/api/audit-logs?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, [filterModule, search, selectedAcademicYear]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
      case 'PUBLISH':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'VERIFY':
      case 'APPROVE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONVERT_CAPA':
        return 'bg-purple-100 text-purple-800 border-purple-200';
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
            <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-800 rounded uppercase">
              Compliance & Security
            </span>
            <span className="text-xs text-slate-400">• Institutional Audit Trail</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            System Audit Logs & Governance Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log tracking administrative decisions, feedback submissions, CAPA status updates, and evidence verification.
          </p>
        </div>

        {/* Total Events Counter */}
        <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Events Logged:</span>
          <strong className="text-slate-900">{logs.length}</strong>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit descriptions or usernames..."
            className="w-full min-h-[44px] pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            aria-label="Filter by system module"
            className="min-h-[44px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Modules</option>
            <option value="FEEDBACK">Feedback Engine</option>
            <option value="GAP_ANALYSIS">Gap Analysis</option>
            <option value="CAPA">CAPA Actions</option>
            <option value="EVIDENCE">Evidence Repository</option>
            <option value="INDICATORS">Quality Indicators</option>
            <option value="REPORTS">Reports</option>
            <option value="AUTH">Authentication</option>
            <option value="SETTINGS">Settings</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor / User</th>
                <th className="p-3.5">Module</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5 max-w-md">Description</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                        {log.userName ? log.userName[0] : 'S'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">{log.userName || 'System Automation'}</span>
                        <span className="text-[10px] text-slate-400">{log.userRole || 'SYSTEM'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {log.module}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getActionBadge(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 max-w-md text-slate-700 leading-relaxed font-medium">
                    {log.description}
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
