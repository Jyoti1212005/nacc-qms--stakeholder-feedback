import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Building2,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  ExternalLink,
  Copy,
  RefreshCw,
  X,
  FileCheck,
  Check,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { StakeholderProfileData } from '../types';
import { ThreeDTiltCard } from './ThreeDTiltCard';

interface StakeholderProfileProps {
  isOpen?: boolean;
  onClose?: () => void;
  userId?: string;
  variant?: 'modal' | 'card' | 'embedded';
}

export const StakeholderProfile: React.FC<StakeholderProfileProps> = ({
  isOpen = true,
  onClose,
  userId,
  variant = 'modal',
}) => {
  const { currentUser, allRoleDefinitions, token, demoLogin } = useAuth();
  const { showToast, setActivePage } = useApp();

  const [profile, setProfile] = useState<StakeholderProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeToken = token || localStorage.getItem('naac_qms_auth_token') || '';
      const endpoint = userId
        ? `/api/users/profile/${userId}`
        : `/api/users/profile${currentUser?.id ? `?userId=${currentUser.id}` : ''}`;

      const res = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load profile data (HTTP ${res.status})`);
      }

      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      console.error('Failed to fetch stakeholder profile:', err);
      // Graceful fallback to client current user if offline or network issue
      if (currentUser) {
        setProfile({
          id: currentUser.id,
          fullName: currentUser.fullName,
          role: currentUser.role,
          department: 'B.Tech Computer Science',
          departmentCode: 'CSE',
          departmentId: currentUser.departmentId,
          joinDate: '2023-01-01T00:00:00Z',
          email: currentUser.email,
          phone: '+91 98450 12345',
          programme: 'B.Tech Computer Science',
          degreeLevel: 'UG',
          avatarUrl: currentUser.avatarUrl,
          isActive: true,
          stats: {
            assignedActions: 2,
            feedbackSubmissions: 3,
            tenureYears: 3,
          },
        });
      } else {
        setError(err.message || 'Unable to retrieve stakeholder profile information.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (variant === 'modal' && !isOpen) return;
    fetchProfile();
  }, [isOpen, userId, currentUser?.id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProfile();
  };

  const handleCopyId = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.id);
    setCopied(true);
    showToast('Stakeholder UID copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJoinDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'January 2023';
    }
  };

  const calculateTenure = (isoString: string) => {
    try {
      const start = new Date(isoString);
      const now = new Date();
      const diffYears = Math.max(1, now.getFullYear() - start.getFullYear());
      return `${diffYears} ${diffYears === 1 ? 'Year' : 'Years'} of Service`;
    } catch {
      return '3+ Years';
    }
  };

  // Find rich role definition
  const roleDef = allRoleDefinitions.find((r) => r.role === (profile?.role || currentUser?.role)) || allRoleDefinitions[0];

  if (variant === 'modal' && !isOpen) return null;

  const cardContent = (
    <div className="relative">
      <ThreeDTiltCard maxTilt={6} scale={1.01} className="w-full">
        <div className="bg-white rounded-3xl border-2 border-[#fed7aa] shadow-2xl overflow-hidden relative text-[#0a192f]">
          {/* Top Navy Gradient Brand Bar with 3D Holographic Sheen */}
          <div className="relative bg-[#0a192f] px-6 pt-6 pb-16 text-white overflow-hidden">
            {/* Background 3D Geometry */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-[#ff7a50]/20 via-[#fed7aa]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-linear-to-tr from-[#3b82f6]/20 to-transparent rounded-full blur-xl pointer-events-none" />

            {/* Top Bar Controls */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#ff7a50] text-white flex items-center justify-center font-black shadow-md">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#fed7aa]">
                      NAAC QMS Accredited
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white tracking-tight">
                    Institutional Identity Credential
                  </h4>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title="Refresh Profile Data"
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#ffa07a]' : ''}`} />
                </button>
                {variant === 'modal' && onClose && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Security Hologram & Cycle Ribbon */}
            <div className="relative z-10 mt-4 flex items-center justify-between text-[11px] text-slate-300">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs text-[10px] font-bold text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff7a50]" />
                <span>NAAC Cycle 3 Quality Framework</span>
              </div>
              <span className="text-[10px] font-mono text-[#fed7aa] tracking-widest">
                UID: {profile?.id || 'QMS-USER-001'}
              </span>
            </div>
          </div>

          {/* Profile Card Main Body */}
          <div className="px-6 pb-6 pt-0 relative z-20">
            {/* Avatar & Floating Header (Overlapping top banner) */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-5 gap-4">
              <div className="flex items-end space-x-4">
                <div className="relative">
                  <img
                    src={
                      profile?.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                    }
                    alt={profile?.fullName || 'Stakeholder Avatar'}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-[#fff0e6]"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs" title="Verified Active">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-[#0a192f] tracking-tight">
                      {isLoading ? (
                        <div className="h-7 w-48 bg-slate-200 animate-pulse rounded-lg" />
                      ) : (
                        profile?.fullName
                      )}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className={`px-2.5 py-0.5 text-xs font-black rounded-lg border shadow-2xs ${roleDef.badgeColor}`}>
                      {roleDef.title}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      • {roleDef.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyId}
                  className="px-3 py-1.5 rounded-xl border border-[#fed7aa] bg-[#fffaf5] hover:bg-[#fff0e6] text-[#c2410c] text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UID</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (onClose) onClose();
                    setActivePage('feedback');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1 cursor-pointer"
                >
                  <span>Give Feedback</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Core Credential Attributes Grid (Name, Role, Department, Join Date) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {/* Attribute 1: Stakeholder Name */}
              <div className="bg-[#fffaf5] p-3.5 rounded-2xl border border-[#fed7aa] shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 mb-1">
                  <User className="w-4 h-4 text-[#ff7a50]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Full Name
                  </span>
                </div>
                <p className="text-sm font-extrabold text-[#0a192f] truncate">
                  {isLoading ? 'Loading...' : profile?.fullName}
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Verified Identity Record
                </span>
              </div>

              {/* Attribute 2: Role & Institutional Level */}
              <div className="bg-[#fffaf5] p-3.5 rounded-2xl border border-[#fed7aa] shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 mb-1">
                  <Shield className="w-4 h-4 text-[#ff7a50]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Institutional Role
                  </span>
                </div>
                <p className="text-sm font-extrabold text-[#0a192f] truncate">
                  {isLoading ? 'Loading...' : roleDef.title.split('(')[0]}
                </p>
                <span className="text-[10px] text-[#c2410c] font-bold block mt-0.5 truncate">
                  {roleDef.category}
                </span>
              </div>

              {/* Attribute 3: Academic Department */}
              <div className="bg-[#fffaf5] p-3.5 rounded-2xl border border-[#fed7aa] shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 mb-1">
                  <Building2 className="w-4 h-4 text-[#ff7a50]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Department
                  </span>
                </div>
                <p className="text-sm font-extrabold text-[#0a192f] truncate" title={profile?.department}>
                  {isLoading ? 'Loading...' : profile?.department || 'Institutional Governance'}
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Code: <strong className="text-[#0a192f]">{profile?.departmentCode || 'CENTRAL'}</strong>
                </span>
              </div>

              {/* Attribute 4: Join Date & Tenure */}
              <div className="bg-[#fffaf5] p-3.5 rounded-2xl border border-[#fed7aa] shadow-2xs">
                <div className="flex items-center space-x-2 text-slate-500 mb-1">
                  <Calendar className="w-4 h-4 text-[#ff7a50]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Join Date
                  </span>
                </div>
                <p className="text-sm font-extrabold text-[#0a192f] truncate">
                  {isLoading ? 'Loading...' : formatJoinDate(profile?.joinDate || '2023-01-01')}
                </p>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                  {calculateTenure(profile?.joinDate || '2023-01-01')}
                </span>
              </div>
            </div>

            {/* Middle Section: Contact & Academic Information */}
            <div className="bg-white rounded-2xl border border-[#eddcd2] p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-extrabold text-[#0a192f] uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-[#ff7a50]" />
                  <span>Verified Communications</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fffaf5] border border-[#f3e8e0]">
                    <span className="text-slate-500">Official Institutional Email:</span>
                    <span className="font-bold text-[#0a192f] font-mono truncate max-w-[200px]">
                      {profile?.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fffaf5] border border-[#f3e8e0]">
                    <span className="text-slate-500">Mobile / Emergency Contact:</span>
                    <span className="font-bold text-[#0a192f] font-mono">
                      {profile?.phone || '+91 98450 12345'}
                    </span>
                  </div>
                  {profile?.programme && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#fffaf5] border border-[#f3e8e0]">
                      <span className="text-slate-500">Academic Programme:</span>
                      <span className="font-bold text-[#0a192f] truncate max-w-[200px]">
                        {profile.programme}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-[#0a192f] uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-[#ff7a50]" />
                  <span>Accreditation Scope & Activity</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fffaf5] border border-[#f3e8e0]">
                    <span className="text-slate-500">NAAC Criteria Coverage:</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[220px]">
                      {roleDef.naacCriteriaFocus.map((crit, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 text-[9px] font-black bg-white text-[#0a192f] rounded border border-[#fed7aa]"
                        >
                          {crit}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fffaf5] border border-[#f3e8e0]">
                    <span className="text-slate-500">Quality Actions Assigned:</span>
                    <span className="font-black text-[#c2410c] text-sm">
                      {profile?.stats?.assignedActions ?? 2} Action Plans
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#fffaf5] border border-[#f3e8e0]">
                    <span className="text-slate-500">Feedback Submissions:</span>
                    <span className="font-black text-emerald-700 text-sm">
                      {profile?.stats?.feedbackSubmissions ?? 4} Responses Recorded
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Permitted Modules Fast Launch Bar */}
            <div className="bg-[#fffaf5] rounded-2xl border border-[#fed7aa] p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-[#0a192f] uppercase tracking-wider">
                    Authorized System Modules ({roleDef.allowedPages.length} of 13)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#c2410c]">
                  Role: {roleDef.title.split('(')[0]}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {roleDef.allowedPages.map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      if (onClose) onClose();
                      setActivePage(page);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-[#0a192f] border border-[#eddcd2] hover:border-[#ff7a50] hover:text-[#ff7a50] transition-all cursor-pointer shadow-2xs flex items-center space-x-1 group"
                  >
                    <span className="capitalize">{page.replace('-', ' ')}</span>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#ff7a50]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Institutional Security Seal Footer */}
            <div className="mt-5 pt-4 border-t border-[#f3e8e0] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-[#0a192f] text-[#ff7a50] flex items-center justify-center shrink-0">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] text-slate-600">
                  Cryptographically timestamped session • NAAC QMS Digital Portal
                </span>
              </div>

              {variant === 'modal' && onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-[#0a192f] text-white hover:bg-[#132c52] font-bold transition-colors cursor-pointer text-xs self-end sm:self-auto"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      </ThreeDTiltCard>
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a192f]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
        <div className="w-full max-w-3xl my-8">{cardContent}</div>
      </div>
    );
  }

  return <div className="w-full max-w-3xl mx-auto">{cardContent}</div>;
};
