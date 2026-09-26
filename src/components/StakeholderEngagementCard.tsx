import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  Users,
  Award,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { StakeholderRoleEngagement } from '../types';
import { ThreeDTiltCard } from './ThreeDTiltCard';
import { useApp } from '../context/AppContext';

interface StakeholderEngagementCardProps {
  data?: StakeholderRoleEngagement[];
  isLoading?: boolean;
}

// Fallback role engagement data using strictly the Navy-Blue and Peach palette
const DEFAULT_ROLE_ENGAGEMENT: StakeholderRoleEngagement[] = [
  {
    role: 'Students (UG/PG)',
    roleKey: 'STUDENT',
    category: 'Internal Academic',
    responsesCount: 495,
    targetResponses: 600,
    responseRate: 82.5,
    averageScore: 4.18,
    color: '#ff7a50', // Vibrant Peach / Coral
    status: 'High',
  },
  {
    role: 'Faculty Members',
    roleKey: 'FACULTY',
    category: 'Internal Academic',
    responsesCount: 112,
    targetResponses: 120,
    responseRate: 93.3,
    averageScore: 4.35,
    color: '#0a192f', // Deep Navy
    status: 'High',
  },
  {
    role: 'Alumni Network',
    roleKey: 'ALUMNI',
    category: 'External Community',
    responsesCount: 118,
    targetResponses: 150,
    responseRate: 78.7,
    averageScore: 4.05,
    color: '#132c52', // Royal Navy
    status: 'Moderate',
  },
  {
    role: 'Industry Employers',
    roleKey: 'EMPLOYER',
    category: 'External Community',
    responsesCount: 44,
    targetResponses: 50,
    responseRate: 88.0,
    averageScore: 4.25,
    color: '#ffa07a', // Warm Light Peach
    status: 'High',
  },
  {
    role: 'Parents & Guardians',
    roleKey: 'PARENT',
    category: 'External Community',
    responsesCount: 152,
    targetResponses: 200,
    responseRate: 76.0,
    averageScore: 4.12,
    color: '#1e3a5f', // Slate Navy
    status: 'Moderate',
  },
  {
    role: 'Administrative Staff',
    roleKey: 'NON_TEACHING',
    category: 'Internal Administrative',
    responsesCount: 42,
    targetResponses: 50,
    responseRate: 84.0,
    averageScore: 4.28,
    color: '#fed7aa', // Creamsicle Soft Peach
    status: 'High',
  },
  {
    role: 'Technical & Lab Staff',
    roleKey: 'TECHNICAL_STAFF',
    category: 'Internal Administrative',
    responsesCount: 35,
    targetResponses: 40,
    responseRate: 87.5,
    averageScore: 4.31,
    color: '#c2410c', // Deep Terracotta Peach
    status: 'High',
  },
];

export const StakeholderEngagementCard: React.FC<StakeholderEngagementCardProps> = ({
  data,
  isLoading = false,
}) => {
  const { setActivePage } = useApp();
  const engagementList = data && data.length > 0 ? data : DEFAULT_ROLE_ENGAGEMENT;

  const [selectedRoleKey, setSelectedRoleKey] = useState<string | null>(null);

  // Compute aggregate stats
  const totalResponses = engagementList.reduce((acc, curr) => acc + curr.responsesCount, 0);
  const totalTarget = engagementList.reduce((acc, curr) => acc + curr.targetResponses, 0);
  const aggregateRate = totalTarget > 0 ? Math.round((totalResponses / totalTarget) * 1000) / 10 : 83.4;

  const activeItem = selectedRoleKey
    ? engagementList.find((item) => item.roleKey === selectedRoleKey) || engagementList[0]
    : engagementList[0];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item: StakeholderRoleEngagement = payload[0].payload;
      return (
        <div className="bg-[#0a192f] text-white p-3 rounded-xl border border-[#fed7aa] shadow-xl text-xs space-y-1 z-50">
          <div className="flex items-center space-x-1.5 pb-1 border-b border-white/10">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-extrabold text-[#fed7aa]">{item.role}</span>
          </div>
          <div className="flex justify-between space-x-4 pt-0.5">
            <span className="text-slate-300">Responses:</span>
            <span className="font-bold text-white">
              {item.responsesCount} / {item.targetResponses}
            </span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-slate-300">Response Rate:</span>
            <span className="font-bold text-[#ff7a50]">{item.responseRate}%</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-slate-300">Avg Satisfaction:</span>
            <span className="font-bold text-emerald-400">★ {item.averageScore} / 5</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ThreeDTiltCard maxTilt={5} scale={1.008} className="w-full h-full">
      <div className="bg-white rounded-2xl border-2 border-[#fed7aa] shadow-lg p-5 flex flex-col justify-between h-full relative overflow-hidden text-[#0a192f]">
        {/* Subtle Ambient Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-[#fed7aa]/20 via-[#ff7a50]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-[#0a192f] text-[#ff7a50] flex items-center justify-center shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.2 text-[9px] font-black uppercase tracking-wider bg-[#fff0e6] text-[#c2410c] rounded border border-[#fed7aa]">
                    Stakeholder Engagement Overview
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">• Response Rates</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0a192f] tracking-tight mt-0.5">
                  User Roles & Survey Participation
                </h3>
              </div>
            </div>

            <button
              onClick={() => setActivePage('feedback')}
              className="text-xs font-bold text-[#c2410c] hover:text-[#ff7a50] flex items-center space-x-1 cursor-pointer transition-colors bg-[#fffaf5] hover:bg-[#fff0e6] px-2.5 py-1 rounded-lg border border-[#fed7aa]"
            >
              <span>Feedback Forms</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Real-time participation rates across institutional stakeholder tiers measured against NAAC sample targets.
          </p>
        </div>

        {/* Main Content Area: Donut Chart + Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-4">
          {/* Donut Chart with Centered Metric (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full h-56 relative flex items-center justify-center">
              {isLoading ? (
                <div className="w-32 h-32 rounded-full border-4 border-slate-200 border-t-[#ff7a50] animate-spin" />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={engagementList}
                        dataKey="responseRate"
                        nameKey="role"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={3}
                        onClick={(entry: any) => {
                          const key = entry?.roleKey || entry?.payload?.roleKey;
                          if (key) setSelectedRoleKey(key === selectedRoleKey ? null : key);
                        }}
                        className="cursor-pointer focus:outline-hidden"
                      >
                        {engagementList.map((entry, index) => {
                          const isSelected = selectedRoleKey === entry.roleKey;
                          return (
                            <Cell
                              key={`role-cell-${index}`}
                              fill={entry.color}
                              stroke={isSelected ? '#fed7aa' : '#ffffff'}
                              strokeWidth={isSelected ? 3 : 1.5}
                              className="transition-all duration-200 hover:opacity-85"
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Donut Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-[#0a192f] tracking-tight">
                      {aggregateRate}%
                    </span>
                    <span className="text-[10px] font-extrabold uppercase text-[#c2410c] tracking-wider">
                      Avg Response
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">
                      {totalResponses.toLocaleString()} / {totalTarget.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Quick Palette Legend Bar */}
            <div className="flex flex-wrap justify-center items-center gap-1.5 mt-1">
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-[#0a192f]" />
                <span>Navy: Academic</span>
              </span>
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-[#ff7a50]" />
                <span>Peach: Student & External</span>
              </span>
            </div>
          </div>

          {/* Interactive Role Breakdown Cards (7 cols) */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 uppercase tracking-wider pb-1 border-b border-[#f3e8e0]">
              <span>Stakeholder Role</span>
              <div className="flex items-center space-x-4">
                <span>Responses</span>
                <span>Response Rate</span>
              </div>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {engagementList.map((item) => {
                const isSelected = selectedRoleKey === item.roleKey;
                return (
                  <div
                    key={item.roleKey}
                    onClick={() => setSelectedRoleKey(item.roleKey === selectedRoleKey ? null : item.roleKey)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-[#fff5ee] border-[#ff7a50] shadow-xs'
                        : 'bg-[#fffaf5] border-[#fed7aa]/60 hover:border-[#ff7a50] hover:bg-[#fff0e6]'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate pr-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="truncate">
                        <p className="font-extrabold text-[#0a192f] truncate">{item.role}</p>
                        <span className="text-[10px] text-slate-500 font-semibold">{item.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <span className="font-bold text-slate-800 text-[11px]">
                          {item.responsesCount} <span className="text-slate-400">/{item.targetResponses}</span>
                        </span>
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              backgroundColor: item.color,
                              width: `${Math.min(100, item.responseRate)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-14 text-right">
                        <span className="font-black text-[#0a192f] text-xs">
                          {item.responseRate}%
                        </span>
                        <span className="text-[9px] block text-emerald-600 font-bold">
                          ★ {item.averageScore}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Role Insight / Action Footer */}
        <div className="mt-2 pt-3 border-t border-[#f3e8e0] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 bg-[#fffaf5] -mx-5 -mb-5 p-3.5 rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: activeItem.color }}
            />
            <span className="font-bold text-[#0a192f]">
              {activeItem.role}:
            </span>
            <span className="text-slate-600">
              Achieved <strong className="text-[#c2410c]">{activeItem.responseRate}%</strong> response rate with <strong className="text-emerald-700">★ {activeItem.averageScore}</strong> quality satisfaction.
            </span>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-white border border-[#fed7aa] text-[#0a192f]">
              {activeItem.status === 'High' ? 'Target Met (≥80%)' : 'Survey In Progress'}
            </span>
          </div>
        </div>
      </div>
    </ThreeDTiltCard>
  );
};
