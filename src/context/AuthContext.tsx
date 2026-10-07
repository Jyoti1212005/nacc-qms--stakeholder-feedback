import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AuthUser, Role, NavigationPage, StakeholderRoleDefinition, RolePermissions } from '../types';

export interface DemoAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: Role;
  department: string;
  designation?: string;
  category?: 'LEADERSHIP_ADMIN' | 'FACULTY_STAFF' | 'STUDENTS' | 'EXTERNAL';
}

export const STAKEHOLDER_ROLE_DEFINITIONS: Record<Role, StakeholderRoleDefinition> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    title: 'Super Administrator / System Architect',
    category: 'Institutional Governance',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    description:
      'Chief Technology and System Administrator with unrestricted root access to formula weights, database configurations, audit trails, and multi-role tenant management.',
    naacCriteriaFocus: ['System-wide Framework & Accreditation Data Integrity'],
    defaultLandingPage: 'dashboard',
    allowedPages: [
      'dashboard',
      'admin',
      'iqac',
      'feedback',
      'closing-the-loop',
      'gaps',
      'action-plans',
      'evidence',
      'quality-indicators',
      'atr',
      'ai-analytics',
      'department',
      'reports',
      'audit-logs',
      'settings',
    ],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: true,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: true,
      canViewFeedbackAnalytics: true,
      canManageQualityGaps: true,
      canCreateActionPlans: true,
      canUploadEvidence: true,
      canVerifyEvidence: true,
      canGenerateReports: true,
      canAccessIQACCommand: true,
      canConfigureSettings: true,
      canViewAuditLogs: true,
      canAccessAdminPortal: true,
    },
  },
  IQAC_ADMIN: {
    role: 'IQAC_ADMIN',
    title: 'IQAC Coordinator & Director',
    category: 'Institutional Governance',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    description:
      'Internal Quality Assurance Cell executive responsible for institutional feedback orchestration, automated quality gap detection, CAPA compliance monitoring, evidence verification, and NAAC Action Taken Reports.',
    naacCriteriaFocus: [
      'Criterion 1: Curricular Aspects',
      'Criterion 2: Teaching-Learning & Evaluation',
      'Criterion 6: Governance, Leadership & Management',
      'Criterion 7: Institutional Values & Best Practices',
    ],
    defaultLandingPage: 'iqac',
    allowedPages: [
      'dashboard',
      'admin',
      'iqac',
      'feedback',
      'closing-the-loop',
      'gaps',
      'action-plans',
      'evidence',
      'quality-indicators',
      'atr',
      'ai-analytics',
      'department',
      'reports',
      'audit-logs',
      'settings',
    ],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: true,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: true,
      canViewFeedbackAnalytics: true,
      canManageQualityGaps: true,
      canCreateActionPlans: true,
      canUploadEvidence: true,
      canVerifyEvidence: true,
      canGenerateReports: true,
      canAccessIQACCommand: true,
      canConfigureSettings: true,
      canViewAuditLogs: true,
      canAccessAdminPortal: true,
    },
  },
  PRINCIPAL: {
    role: 'PRINCIPAL',
    title: 'Principal & Head of Institution',
    category: 'Institutional Governance',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description:
      'Executive leadership presiding over the Academic Council and Governing Body, approving institutional Action Taken Reports, reviewing criteria trends, and allocating resources for quality improvements.',
    naacCriteriaFocus: [
      'Institutional Quality Assurance',
      'Criterion 6: Governance & Financial Allocation',
      'Criterion 7: Institutional Distinctiveness',
    ],
    defaultLandingPage: 'dashboard',
    allowedPages: [
      'dashboard',
      'admin',
      'iqac',
      'feedback',
      'closing-the-loop',
      'gaps',
      'action-plans',
      'evidence',
      'quality-indicators',
      'atr',
      'ai-analytics',
      'department',
      'reports',
      'audit-logs',
    ],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: true,
      canSubmitFeedback: false,
      canCreateFeedbackSurveys: false,
      canViewFeedbackAnalytics: true,
      canManageQualityGaps: true,
      canCreateActionPlans: true,
      canUploadEvidence: true,
      canVerifyEvidence: true,
      canGenerateReports: true,
      canAccessIQACCommand: true,
      canConfigureSettings: false,
      canViewAuditLogs: true,
      canAccessAdminPortal: true,
    },
  },
  HOD: {
    role: 'HOD',
    title: 'Head of Department (HoD)',
    category: 'Internal Academic',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    description:
      'Academic department leader overseeing faculty curriculum delivery, outcome-based education assessments, Department Quality Cell initiatives, CAPA execution, and evidence compilation.',
    naacCriteriaFocus: [
      'Criterion 1: Curriculum Revision & Electives',
      'Criterion 2: Faculty Pedagogy & Attainment',
      'Criterion 3: Department Research & Grants',
    ],
    defaultLandingPage: 'department',
    allowedPages: [
      'dashboard',
      'department',
      'feedback',
      'closing-the-loop',
      'gaps',
      'action-plans',
      'evidence',
      'quality-indicators',
      'atr',
      'ai-analytics',
      'reports',
    ],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: true,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: false,
      canViewFeedbackAnalytics: true,
      canManageQualityGaps: true,
      canCreateActionPlans: true,
      canUploadEvidence: true,
      canVerifyEvidence: true,
      canGenerateReports: true,
      canAccessIQACCommand: false,
      canConfigureSettings: false,
      canViewAuditLogs: false,
    },
  },
  FACULTY: {
    role: 'FACULTY',
    title: 'Faculty / Teaching Staff',
    category: 'Internal Academic',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    description:
      'Academic professors, associate professors, and lecturers providing teaching-learning delivery, course outcome assessments, curriculum enhancement feedback, student mentoring, and research evidence.',
    naacCriteriaFocus: [
      'Criterion 1: Curriculum Autonomy & Design',
      'Criterion 2: ICT Pedagogy & Internal Assessment',
      'Criterion 3: Research, Publications & Seed Grants',
    ],
    defaultLandingPage: 'dashboard',
    allowedPages: [
      'dashboard',
      'feedback',
      'closing-the-loop',
      'action-plans',
      'evidence',
      'quality-indicators',
      'department',
      'ai-analytics',
    ],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: true,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: false,
      canViewFeedbackAnalytics: true,
      canManageQualityGaps: false,
      canCreateActionPlans: true,
      canUploadEvidence: true,
      canVerifyEvidence: false,
      canGenerateReports: false,
      canAccessIQACCommand: false,
      canConfigureSettings: false,
      canViewAuditLogs: false,
    },
  },
  STUDENT: {
    role: 'STUDENT',
    title: 'Student (Undergraduate / Postgraduate)',
    category: 'Internal Academic',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description:
      'Primary institutional stakeholders providing direct feedback on syllabus coverage, pedagogical effectiveness, lab infrastructure, continuous evaluation transparency, mentoring, and campus facilities.',
    naacCriteriaFocus: [
      'Criterion 1: Curriculum Flexibility & Industry Fit',
      'Criterion 2: Teaching-Learning & Student Satisfaction (SSS)',
      'Criterion 5: Mentoring & Student Support',
    ],
    defaultLandingPage: 'feedback',
    allowedPages: ['feedback', 'closing-the-loop', 'dashboard', 'quality-indicators'],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: false,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: false,
      canViewFeedbackAnalytics: false,
      canManageQualityGaps: false,
      canCreateActionPlans: false,
      canUploadEvidence: false,
      canVerifyEvidence: false,
      canGenerateReports: false,
      canAccessIQACCommand: false,
      canConfigureSettings: false,
      canViewAuditLogs: false,
    },
  },
  ALUMNI: {
    role: 'ALUMNI',
    title: 'Alumni Network Representative',
    category: 'External Community',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    description:
      'Graduates evaluating long-term relevance of the academic curriculum, career progression, industry preparedness, mentorship support, and industry-academia partnership opportunities.',
    naacCriteriaFocus: [
      'Criterion 1: Curriculum Modernity & Industry Relevance',
      'Criterion 5: Student Progression & Alumni Engagement',
    ],
    defaultLandingPage: 'feedback',
    allowedPages: ['feedback', 'closing-the-loop', 'dashboard', 'quality-indicators'],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: false,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: false,
      canViewFeedbackAnalytics: false,
      canManageQualityGaps: false,
      canCreateActionPlans: false,
      canUploadEvidence: false,
      canVerifyEvidence: false,
      canGenerateReports: false,
      canAccessIQACCommand: false,
      canConfigureSettings: false,
      canViewAuditLogs: false,
    },
  },
  EMPLOYER: {
    role: 'EMPLOYER',
    title: 'Employer & Industry Advisory Partner',
    category: 'External Community',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    description:
      'Corporate recruiters and industry partners appraising graduate technical competence, professional ethics, workplace communication, problem-solving abilities, and curriculum alignment with market demands.',
    naacCriteriaFocus: [
      'Criterion 1: Curriculum Employability & Skill Alignment',
      'Criterion 3: Industry Collaboration & Internships',
    ],
    defaultLandingPage: 'feedback',
    allowedPages: ['feedback', 'closing-the-loop', 'dashboard', 'quality-indicators'],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: false,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: false,
      canViewFeedbackAnalytics: false,
      canManageQualityGaps: false,
      canCreateActionPlans: false,
      canUploadEvidence: false,
      canVerifyEvidence: false,
      canGenerateReports: false,
      canAccessIQACCommand: false,
      canConfigureSettings: false,
      canViewAuditLogs: false,
    },
  },
  PARENT: {
    role: 'PARENT',
    title: 'Parent & Guardian Representative',
    category: 'External Community',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
    description:
      'Parents appraising student campus safety, mentoring accessibility, institutional communication of academic progress, holistic student welfare, hostel amenities, and overall institutional discipline.',
    naacCriteriaFocus: [
      'Criterion 2: Student Mentoring & Progress Communication',
      'Criterion 4: Campus Facilities, Safety & Infrastructure',
      'Criterion 5: Student Welfare & Discipline',
    ],
    defaultLandingPage: 'feedback',
    allowedPages: ['feedback', 'closing-the-loop', 'dashboard', 'quality-indicators'],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: false,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: false,
      canViewFeedbackAnalytics: false,
      canManageQualityGaps: false,
      canCreateActionPlans: false,
      canUploadEvidence: false,
      canVerifyEvidence: false,
      canGenerateReports: false,
      canAccessIQACCommand: false,
      canConfigureSettings: false,
      canViewAuditLogs: false,
    },
  },
  NON_TEACHING: {
    role: 'NON_TEACHING',
    title: 'Administrative & Non-Teaching Staff',
    category: 'Internal Administrative',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    description:
      'Administrative, accounts, library, examination, and office personnel evaluating campus ERP operations, administrative workflows, staff training, workplace amenities, and staff welfare measures.',
    naacCriteriaFocus: [
      'Criterion 4: Physical Infrastructure & Digital ERP',
      'Criterion 6: Administrative Governance, Welfare & Professional Development',
    ],
    defaultLandingPage: 'feedback',
    allowedPages: [
      'dashboard',
      'feedback',
      'closing-the-loop',
      'action-plans',
      'evidence',
      'quality-indicators',
    ],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: false,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: false,
      canViewFeedbackAnalytics: true,
      canManageQualityGaps: false,
      canCreateActionPlans: true,
      canUploadEvidence: true,
      canVerifyEvidence: false,
      canGenerateReports: false,
      canAccessIQACCommand: false,
      canConfigureSettings: false,
      canViewAuditLogs: false,
    },
  },
  TECHNICAL_STAFF: {
    role: 'TECHNICAL_STAFF',
    title: 'Technical & Laboratory Staff',
    category: 'Internal Administrative',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description:
      'Laboratory technicians, computer lab managers, and workshop superintendents ensuring equipment safety, calibration, PPE compliance, consumable availability, and student practical guidance.',
    naacCriteriaFocus: [
      'Criterion 4: Laboratory Infrastructure, Equipment & Safety Protocols',
      'Criterion 2: Practical Lab Learning Support',
    ],
    defaultLandingPage: 'feedback',
    allowedPages: [
      'dashboard',
      'feedback',
      'action-plans',
      'evidence',
      'quality-indicators',
    ],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: false,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: false,
      canViewFeedbackAnalytics: true,
      canManageQualityGaps: false,
      canCreateActionPlans: true,
      canUploadEvidence: true,
      canVerifyEvidence: false,
      canGenerateReports: false,
      canAccessIQACCommand: false,
      canConfigureSettings: false,
      canViewAuditLogs: false,
    },
  },
  EXTERNAL_STAKEHOLDER: {
    role: 'EXTERNAL_STAKEHOLDER',
    title: 'External Peer & Accreditation Reviewer',
    category: 'External Community',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    description:
      'External academic experts and accreditation auditors reviewing institutional self-study data, criterion benchmarks, feedback closure rates, and verifiable evidence portfolios.',
    naacCriteriaFocus: ['Comprehensive Institutional Quality Review (Criteria 1 - 7)'],
    defaultLandingPage: 'dashboard',
    allowedPages: ['dashboard', 'feedback', 'closing-the-loop', 'quality-indicators', 'reports', 'atr'],
    permissions: {
      canViewExecutiveDashboard: true,
      canViewDepartmentDashboard: false,
      canSubmitFeedback: true,
      canCreateFeedbackSurveys: false,
      canViewFeedbackAnalytics: true,
      canManageQualityGaps: false,
      canCreateActionPlans: false,
      canUploadEvidence: false,
      canVerifyEvidence: false,
      canGenerateReports: true,
      canAccessIQACCommand: false,
      canConfigureSettings: false,
      canViewAuditLogs: false,
    },
  },
};

interface AuthContextType {
  currentUser: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  demoAccounts: DemoAccount[];
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (email: string) => Promise<boolean>;
  sendOtp: (
    email: string,
    purpose?: 'REGISTER' | 'LOGIN'
  ) => Promise<{ success: boolean; message?: string; devOtp?: string; emailSent?: boolean; error?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  otpLogin: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (params: {
    credential?: string;
    googleProfile?: { email: string; name: string; picture?: string; sub?: string };
    role?: Role;
    departmentId?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    fullName: string;
    email: string;
    password: string;
    role: Role;
    departmentId?: string;
    programmeId?: string;
    otp?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
  currentRoleDefinition: StakeholderRoleDefinition;
  getRoleDefinition: (role: Role) => StakeholderRoleDefinition;
  allRoleDefinitions: StakeholderRoleDefinition[];
  canAccessPage: (page: NavigationPage) => boolean;
  hasPermission: (permissionKey: keyof RolePermissions) => boolean;
  allowedPages: NavigationPage[];
  defaultLandingPage: NavigationPage;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('naac_qms_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);

  // Fetch demo accounts
  useEffect(() => {
    fetch('/api/auth/demo-users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDemoAccounts(data);
      })
      .catch((err) => console.warn('Could not load demo accounts:', err));
  }, []);

  // Check existing session
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session invalid');
        return res.json();
      })
      .then((data) => {
        setCurrentUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('naac_qms_token');
        setToken(null);
        setCurrentUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('naac_qms_token', data.token);
      return { success: true };
    } catch (e: any) {
      console.error('Login error:', e);
      return { success: false, error: e.message || 'Network error during login' };
    }
  };

  const demoLogin = async (email: string): Promise<boolean> => {
    const acc = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!acc) return false;
    const res = await login(acc.email, acc.password);
    return res.success;
  };

  const sendOtp = async (
    email: string,
    purpose: 'REGISTER' | 'LOGIN' = 'REGISTER'
  ): Promise<{ success: boolean; message?: string; devOtp?: string; emailSent?: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to send OTP.' };
      }
      return {
        success: true,
        message: data.message,
        devOtp: data.devOtp,
        emailSent: data.emailSent,
      };
    } catch (e: any) {
      console.error('sendOtp error:', e);
      const isFetchFailed = e.name === 'TypeError' || (e.message && e.message.toLowerCase().includes('fetch'));
      return {
        success: false,
        error: isFetchFailed
          ? 'Backend Server connect nahi ho pa raha hai (http://localhost:3000). Kripya confirm karein ki dev server live hai.'
          : (e.message || 'Network error while requesting OTP.'),
      };
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Invalid OTP code.' };
      }
      return { success: true };
    } catch (e: any) {
      console.error('verifyOtp error:', e);
      return { success: false, error: e.message || 'Network error while verifying OTP.' };
    }
  };

  const otpLogin = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/otp-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'OTP login failed.' };
      }
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('naac_qms_token', data.token);
      return { success: true };
    } catch (e: any) {
      console.error('otpLogin error:', e);
      return { success: false, error: e.message || 'Network error during OTP login.' };
    }
  };

  const googleLogin = async (params: {
    credential?: string;
    googleProfile?: { email: string; name: string; picture?: string; sub?: string };
    role?: Role;
    departmentId?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Google login failed.' };
      }
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('naac_qms_token', data.token);
      return { success: true };
    } catch (e: any) {
      console.error('googleLogin error:', e);
      return { success: false, error: e.message || 'Network error during Google authentication.' };
    }
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    password: string;
    role: Role;
    departmentId?: string;
    programmeId?: string;
    otp?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('naac_qms_token', data.token);
      return { success: true };
    } catch (e: any) {
      console.error('Registration error:', e);
      return { success: false, error: e.message || 'Network error during registration' };
    }
  };

  const logout = () => {
    localStorage.removeItem('naac_qms_token');
    setToken(null);
    setCurrentUser(null);
  };

  const hasRole = (roles: Role[]): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'SUPER_ADMIN') return true;
    return roles.includes(currentUser.role);
  };

  const getRoleDefinition = (role: Role): StakeholderRoleDefinition => {
    return STAKEHOLDER_ROLE_DEFINITIONS[role] || STAKEHOLDER_ROLE_DEFINITIONS.FACULTY;
  };

  const currentRoleDefinition = useMemo<StakeholderRoleDefinition>(() => {
    if (!currentUser) return STAKEHOLDER_ROLE_DEFINITIONS.STUDENT;
    return STAKEHOLDER_ROLE_DEFINITIONS[currentUser.role] || STAKEHOLDER_ROLE_DEFINITIONS.FACULTY;
  }, [currentUser]);

  const allRoleDefinitions = useMemo(() => {
    return Object.values(STAKEHOLDER_ROLE_DEFINITIONS);
  }, []);

  const canAccessPage = (page: NavigationPage): boolean => {
    if (page === 'closing-the-loop') return true; // Public 'Closing the Loop' tracker accessible to all stakeholders
    if (!currentUser) return page === 'dashboard' || page === 'feedback';
    if (currentUser.role === 'SUPER_ADMIN') return true;
    return currentRoleDefinition.allowedPages.includes(page);
  };

  const hasPermission = (permissionKey: keyof RolePermissions): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'SUPER_ADMIN') return true;
    return !!currentRoleDefinition.permissions[permissionKey];
  };

  const allowedPages = useMemo(() => {
    let pages: NavigationPage[] = [];
    if (!currentUser) {
      pages = ['dashboard', 'feedback', 'closing-the-loop'];
    } else if (currentUser.role === 'SUPER_ADMIN') {
      pages = [...STAKEHOLDER_ROLE_DEFINITIONS.SUPER_ADMIN.allowedPages];
    } else {
      pages = [...currentRoleDefinition.allowedPages];
    }
    if (!pages.includes('closing-the-loop')) {
      pages.push('closing-the-loop');
    }
    return pages;
  }, [currentUser, currentRoleDefinition]);

  const defaultLandingPage = useMemo(() => {
    if (!currentUser) return 'dashboard' as NavigationPage;
    return currentRoleDefinition.defaultLandingPage;
  }, [currentUser, currentRoleDefinition]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!currentUser,
        isLoading,
        demoAccounts,
        login,
        demoLogin,
        sendOtp,
        verifyOtp,
        otpLogin,
        googleLogin,
        register,
        logout,
        hasRole,
        currentRoleDefinition,
        getRoleDefinition,
        allRoleDefinitions,
        canAccessPage,
        hasPermission,
        allowedPages,
        defaultLandingPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
