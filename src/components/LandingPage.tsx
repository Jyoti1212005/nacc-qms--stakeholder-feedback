import React, { useState, useEffect } from 'react';
import {
  Award,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  FileCheck2,
  TrendingUp,
  BrainCircuit,
  Lock,
  ChevronDown,
  Layers,
  HelpCircle,
  LogIn,
  GraduationCap,
  Briefcase,
  Wrench,
  HeartHandshake,
  Building,
  UserCheck,
  Send,
  Star,
  Shield,
  UserPlus,
  Mail,
  KeyRound,
  RefreshCw,
  AlertCircle,
  Check,
  Calendar,
  Clock,
  FileDown,
  QrCode,
  Activity,
  FileText,
  Info,
  Globe,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StakeholderType, FeedbackAnswer, Role } from '../types';
import { ThreeDTiltCard } from './ThreeDTiltCard';
import { ThreeDQualityOrbit } from './ThreeDQualityOrbit';
import { RoleMatrixModal } from './RoleMatrixModal';
import { PublicAtrPortalModal } from './PublicAtrPortalModal';
import { ExportNaacAtrSsrModal } from './ExportNaacAtrSsrModal';
import { CollegeWebsiteImporterModal } from './CollegeWebsiteImporterModal';

// Official Google Multicolored SVG Logo
const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.37 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.25C.45 8.19 0 9.99 0 12s.45 3.81 1.25 5.4l4.03-3.13z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.63 1.25 6.6l4.03 3.13c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const LandingPage: React.FC = () => {
  const {
    demoAccounts,
    demoLogin,
    login,
    register,
    allRoleDefinitions,
    sendOtp,
    verifyOtp,
    otpLogin,
    googleLogin,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [showRoleMatrix, setShowRoleMatrix] = useState(false);
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<Role | undefined>(undefined);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [showPublicAtrModal, setShowPublicAtrModal] = useState(false);
  const [showExportSsrModal, setShowExportSsrModal] = useState(false);
  const [landingAcademicYear, setLandingAcademicYear] = useState('ay-4');
  const [roleFilterTab, setRoleFilterTab] = useState<'ALL' | 'STUDENTS' | 'FACULTY_STAFF' | 'LEADERSHIP_ADMIN' | 'EXTERNAL'>('ALL');
  const [showAllPersonas, setShowAllPersonas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Login Mode: 'password' or 'otp'
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpMsg, setLoginOtpMsg] = useState('');
  const [loginDevOtp, setLoginDevOtp] = useState('');
  const [isSendingLoginOtp, setIsSendingLoginOtp] = useState(false);

  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>('STUDENT');
  const [regDept, setRegDept] = useState('dept-1');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regStep, setRegStep] = useState<1 | 2>(1);

  // Registration OTP State (Strict Verification)
  const [regOtp, setRegOtp] = useState('');
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpVerified, setRegOtpVerified] = useState(false);
  const [regOtpMsg, setRegOtpMsg] = useState('');
  const [regDevOtp, setRegDevOtp] = useState('');
  const [isSendingRegOtp, setIsSendingRegOtp] = useState(false);
  const [isVerifyingRegOtp, setIsVerifyingRegOtp] = useState(false);

  // Google Sign-In Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleModalEmail, setGoogleModalEmail] = useState('');
  const [googleModalName, setGoogleModalName] = useState('');
  const [googleModalRole, setGoogleModalRole] = useState<Role>('STUDENT');
  const [googleModalDept, setGoogleModalDept] = useState('dept-1');
  const [googleError, setGoogleError] = useState('');
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Quick Survey Modal State (Direct Feedback Submission without login)
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<StakeholderType>('STUDENT');
  const [selectedSurveyId, setSelectedSurveyId] = useState('form-1');
  const [surveyDept, setSurveyDept] = useState('dept-1');
  const [surveyAnonymous, setSurveyAnonymous] = useState(true);
  const [surveyRatings, setSurveyRatings] = useState<Record<string, number>>({ q1: 5, q2: 4, q3: 5 });
  const [surveyComments, setSurveyComments] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // Helper to pick existing registered user
  const handlePickExistingUser = (targetEmail: string) => {
    const acc = demoAccounts.find((a) => a.email.toLowerCase() === targetEmail.toLowerCase());
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.password);
      setLoginError('');
    }
  };

  const cleanEmailInput = email.trim().toLowerCase();
  const matchedUser = demoAccounts.find((a) => a.email.toLowerCase() === cleanEmailInput);
  const isEmailProvided = cleanEmailInput.length > 0;
  const isEmailExisting = !!matchedUser;

  // Initialize Google Identity Services if client ID configured
  useEffect(() => {
    const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response.credential) {
              setIsSubmitting(true);
              const res = await googleLogin({ credential: response.credential });
              setIsSubmitting(false);
              if (!res.success) {
                setLoginError(res.error || 'Google login failed.');
              }
            }
          },
        });
      } catch (e) {
        console.warn('Google Identity Services init notice:', e);
      }
    }
  }, [googleLogin]);

  // Standard Login (Password)
  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim() || !password) {
      setLoginError('Kripya institutional email aur password dono enter karein.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (!result.success) {
      setLoginError(result.error || 'Login failed. Sahi credentials enter karein.');
    }
  };

  // Request OTP for Login
  const handleSendLoginOtp = async () => {
    if (!email.trim()) {
      setLoginError('Please enter your registered email address.');
      return;
    }
    setLoginError('');
    setIsSendingLoginOtp(true);
    const res = await sendOtp(email.trim(), 'LOGIN');
    setIsSendingLoginOtp(false);

    if (!res.success) {
      setLoginError(res.error || 'Failed to dispatch verification code.');
    } else {
      setLoginOtpSent(true);
      setLoginOtpMsg(res.message || 'Verification code sent to your email.');
      if (res.devOtp) setLoginDevOtp(res.devOtp);
    }
  };

  // Submit OTP for Login
  const handleOtpLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim() || !loginOtp.trim()) {
      setLoginError('Please enter both your email address and 6-digit OTP code.');
      return;
    }

    setIsSubmitting(true);
    const result = await otpLogin(email.trim(), loginOtp.trim());
    setIsSubmitting(false);

    if (!result.success) {
      setLoginError(result.error || 'Invalid or expired OTP code.');
    }
  };

  // Send Verification OTP for Registration (Real Email & MX check)
  const handleSendRegOtp = async () => {
    if (!regEmail.trim()) {
      setRegError('Please enter a valid official email address.');
      return;
    }
    setRegError('');
    setRegSuccess('');
    setIsSendingRegOtp(true);
    const res = await sendOtp(regEmail.trim(), 'REGISTER');
    setIsSendingRegOtp(false);

    if (!res.success) {
      setRegError(res.error || 'Failed to dispatch verification code.');
    } else {
      setRegOtpSent(true);
      setRegOtpMsg(res.message || 'Verification code sent to your email.');
      if (res.devOtp) setRegDevOtp(res.devOtp);
    }
  };

  // Verify Registration OTP
  const handleVerifyRegOtp = async () => {
    if (!regOtp.trim() || regOtp.trim().length < 6) {
      setRegError('Please enter the complete 6-digit verification code.');
      return;
    }
    setRegError('');
    setIsVerifyingRegOtp(true);
    const res = await verifyOtp(regEmail.trim(), regOtp.trim());
    setIsVerifyingRegOtp(false);

    if (!res.success) {
      setRegError(res.error || 'Invalid or expired verification code.');
    } else {
      setRegOtpVerified(true);
      setRegStep(2);
      setRegSuccess('Email address verified successfully. Please complete your profile.');
    }
  };

  // Submit Final Registration (Enforces verified OTP)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Full Name, Official Email, and Password are required.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role: regRole,
      departmentId: regDept,
      otp: regOtp ? regOtp.trim() : undefined,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setRegError(result.error || 'Registration failed. Please try again.');
    } else {
      setRegSuccess('Registration successful! Redirecting to institutional portal...');
    }
  };

  // Trigger Google Sign-In
  const handleGoogleClick = () => {
    const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt();
        return;
      } catch (err) {
        console.warn('GIS prompt fallback:', err);
      }
    }
    // Open Google Identity modal
    setGoogleModalEmail('');
    setGoogleModalName('');
    setGoogleError('');
    setShowGoogleModal(true);
  };

  // Submit Google Identity verification
  const handleGoogleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError('');

    if (!googleModalEmail.trim()) {
      setGoogleError('Please enter your Google account email (Gmail or Google Workspace).');
      return;
    }

    setIsGoogleSubmitting(true);
    const result = await googleLogin({
      googleProfile: {
        email: googleModalEmail.trim().toLowerCase(),
        name: googleModalName.trim() || googleModalEmail.split('@')[0],
      },
      role: googleModalRole,
      departmentId: googleModalDept,
    });
    setIsGoogleSubmitting(false);

    if (!result.success) {
      setGoogleError(result.error || 'Google identity verification could not be completed.');
    } else {
      setShowGoogleModal(false);
      setShowLoginModal(false);
    }
  };

  const handleQuickSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const answers: FeedbackAnswer[] = [
        { questionId: 'q-1-1', scoreValue: surveyRatings.q1 || 5 },
        { questionId: 'q-1-2', scoreValue: surveyRatings.q2 || 4 },
        { questionId: 'q-1-3', scoreValue: surveyRatings.q3 || 5 },
      ];
      if (surveyComments) {
        answers.push({ questionId: 'q-text', scoreValue: 5, textValue: surveyComments });
      }

      await fetch('/api/feedback/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: selectedSurveyId,
          academicYearId: 'ay-5',
          departmentId: surveyDept,
          isAnonymous: surveyAnonymous,
          stakeholderType: selectedStakeholder,
          answers,
        }),
      });
      setSurveySubmitted(true);
    } catch (err) {
      console.error('Feedback submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cycleSteps = [
    { title: 'Stakeholder Feedback', desc: 'Curriculum, Teaching, Staff & Labs', icon: '📝' },
    { title: 'Data Validation & NLP', desc: 'Sentiment & parameter clustering', icon: '🔍' },
    { title: 'Quality Gap Detection', desc: 'Automatic delta vs institutional benchmarks', icon: '⚠️' },
    { title: 'CAPA Action Plan', desc: 'Root causes, HoD accountability, target dates', icon: '📋' },
    { title: 'Evidence Repository', desc: 'MoUs, purchase bills, logs & photos', icon: '📁' },
    { title: 'IQAC Verification', desc: 'Before/after score remeasurement', icon: '✅' },
    { title: 'ATR & NAAC Audit', desc: 'Action Taken Reports ready for assessors', icon: '📊' },
  ];

  const stakeholderCategories = [
    {
      id: 'STUDENT',
      name: 'Students (UG / PG)',
      icon: GraduationCap,
      color: 'bg-[#0a192f] text-[#ffa07a]',
      badge: 'Criteria 1 & 2',
      forms: [
        { id: 'form-1', name: 'Curriculum & Teaching-Learning Feedback 2026-27' },
        { id: 'form-6', name: 'Campus Facilities, Labs & Wi-Fi Survey' },
        { id: 'form-8', name: 'Student Mentoring & Support Services Evaluation' },
        { id: 'form-10', name: 'Institutional Graduate Exit Survey' },
      ],
      desc: 'Evaluate curricular depth, pedagogy effectiveness, lab access, continuous internal assessment, and mentorship.',
    },
    {
      id: 'FACULTY',
      name: 'Teachers & Faculty',
      icon: Briefcase,
      color: 'bg-[#1e3a8a] text-white',
      badge: 'Academic Staff',
      forms: [
        { id: 'form-2', name: 'Faculty Curriculum Design & Academic Autonomy 2026-27' },
        { id: 'form-14', name: 'Faculty Governance, Workload Equity & Research Seed Grant Survey' },
      ],
      desc: 'Provide faculty insights on curriculum flexibility, modern syllabi, research infrastructure, and academic freedom.',
    },
    {
      id: 'NON_TEACHING',
      name: 'Administrative Staff',
      icon: Building,
      color: 'bg-[#ff7a50] text-white',
      badge: 'Admin & Office',
      forms: [
        { id: 'form-11', name: 'Non-Teaching Staff Administrative Operations & ERP Survey' },
        { id: 'form-12', name: 'Staff Welfare, Medical Benefits & Workplace Amenities' },
      ],
      desc: 'Appraise campus administrative workflows, digital ERP efficiency, staff welfare, grievances, and workplace ergonomics.',
    },
    {
      id: 'TECHNICAL_STAFF',
      name: 'Technical & Lab Staff',
      icon: Wrench,
      color: 'bg-[#0f2444] text-[#fed7aa]',
      badge: 'Laboratories',
      forms: [
        { id: 'form-13', name: 'Technical & Lab Staff Safety Protocols, PPE & First-Aid Survey' },
      ],
      desc: 'Rate lab equipment calibration, safety gear, hazardous chemical storage, licensing, and student practical assistance.',
    },
    {
      id: 'ALUMNI',
      name: 'Alumni Network',
      icon: Award,
      color: 'bg-[#0a192f] text-white',
      badge: 'Graduates & Leaders',
      forms: [
        { id: 'form-4', name: 'Alumni Institutional Impact & Career Progression Survey' },
      ],
      desc: 'Assess the long-term utility of education, industry preparation, alumni mentorship, and curriculum modernity.',
    },
    {
      id: 'EMPLOYER',
      name: 'Employers & Industry',
      icon: Briefcase,
      color: 'bg-[#ea580c] text-white',
      badge: 'Recruiters & Partners',
      forms: [
        { id: 'form-3', name: 'Employer & Industry Advisory Feedback 2026-27' },
      ],
      desc: 'Provide industry insights on graduate technical competence, professional communication, and readiness for modern tooling.',
    },
    {
      id: 'PARENT',
      name: 'Parents & Guardians',
      icon: HeartHandshake,
      color: 'bg-[#334155] text-white',
      badge: 'Campus Stakeholders',
      forms: [
        { id: 'form-7', name: 'Parent / Guardian Feedback on Campus Ecosystem' },
      ],
      desc: 'Provide perspectives on campus safety, student discipline, mentoring clarity, and academic progress communication.',
    },
  ];

  const faqs = [
    {
      q: 'Does this platform cover all stakeholder groups (Students, Teachers, Administrative Staff, Technical Staff)?',
      a: 'Yes. NAAC-QMS is built specifically to address Criteria 1, 2, 4, and 6 by systematically collecting feedback from Students (UG/PG), Teachers and all Faculty members, Non-Teaching Administrative personnel, Technical/Laboratory staff, Alumni, Employers, and Parents.',
    },
    {
      q: 'Can stakeholders submit feedback anonymously?',
      a: 'Yes. Every survey provides an explicit Anonymous Confidentiality Mode. When selected, no personally identifiable information (PII), email, or user token is attached to the response.',
    },
    {
      q: 'How does the system ensure closed-loop Quality Improvement for NAAC?',
      a: 'Feedback scores below predefined targets automatically trigger Quality Gaps. The IQAC and Department HoDs then formulate Corrective & Preventive Action (CAPA) plans with assigned owners and evidence uploads. Once remeasured and verified, quantitative score deltas are compiled into audit-ready Action Taken Reports (ATRs).',
    },
    {
      q: 'Does the application calculate an official NAAC accreditation grade or CGPA?',
      a: 'No. In full accordance with accreditation governance, NAAC-QMS calculates an internal "Institutional Quality Improvement Index" to benchmark progress. It never claims to award or substitute for official NAAC peer-team evaluation.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white overflow-x-hidden w-full font-sans">
      {/* Top Header - Executive Slate Bar */}
      <header className="border-b border-slate-800 bg-slate-900/95 text-white sticky top-0 z-40 px-3 sm:px-6 py-3 flex items-center justify-between shadow-xs backdrop-blur-md">
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 border border-blue-500/40 flex items-center justify-center text-white font-bold shadow-xs shrink-0">
            <Award className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white truncate">IKGPTU NAAC-QMS</span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 rounded-md border border-blue-400/30 shrink-0">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>NAAC Accredited (Grade 'B')</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-normal hidden md:block truncate">
              I.K. Gujral Punjab Technical University Jalandhar • Continuous Quality Management (ptu.ac.in)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          {/* Academic Year Dropdown in Navbar (Default: AY 2025–26) */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-[#0f2444] border border-[#234573] rounded-xl px-2.5 py-1.5 text-xs text-blue-100 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#ffa07a]" />
            <span className="text-[#fed7aa] font-bold">AY:</span>
            <select
              value={landingAcademicYear}
              onChange={(e) => setLandingAcademicYear(e.target.value)}
              aria-label="Select Academic Year"
              className="bg-transparent font-extrabold text-white focus:outline-hidden cursor-pointer"
            >
              <option value="ay-4" className="bg-[#0a192f] text-white">AY 2025–26 (Current)</option>
              <option value="ay-5" className="bg-[#0a192f] text-white">AY 2026–27</option>
              <option value="ay-3" className="bg-[#0a192f] text-white">AY 2024–25</option>
              <option value="ay-2" className="bg-[#0a192f] text-white">AY 2023–24</option>
            </select>
          </div>

          {/* IKGPTU Website Data & Profile Trigger */}
          <button
            onClick={() => setShowCollegeModal(true)}
            id="btn-header-college-profile"
            className="px-2.5 sm:px-3 py-2 min-h-[44px] text-xs font-bold bg-[#0d223f] hover:bg-[#15345d] text-blue-200 hover:text-white rounded-xl border border-blue-400/30 transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm shrink-0"
            title="View IKGPTU Official Profile Crawled from https://ptu.ac.in/"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline">IKGPTU Profile (ptu.ac.in)</span>
            <span className="sm:hidden">PTU</span>
          </button>

          {/* Export NAAC ATR / SSR (PDF) Utility Trigger */}
          <button
            onClick={() => setShowExportSsrModal(true)}
            id="btn-header-export-ssr"
            className="px-2.5 sm:px-3 py-2 min-h-[44px] text-xs font-bold bg-[#14325a] hover:bg-[#1b4175] text-[#fed7aa] hover:text-white rounded-xl border border-amber-400/30 transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
            title="Export NAAC Metric 1.4.2 ATR / SSR Document (PDF Format)"
          >
            <FileDown className="w-3.5 h-3.5 text-[#ffa07a] shrink-0" />
            <span className="hidden xl:inline">Export NAAC ATR / SSR</span>
            <span className="xl:hidden">Export SSR</span>
          </button>

          <button
            onClick={() => setShowPublicAtrModal(true)}
            className="px-2.5 sm:px-3 py-2 min-h-[44px] text-xs font-bold bg-[#0f2444] hover:bg-[#16335a] text-blue-100 hover:text-white rounded-xl border border-blue-400/30 transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
            title="NAAC Mandatory Disclosure: Action Taken Report (Metric 1.4.2)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#ffa07a] shrink-0" />
            <span className="hidden md:inline">Public ATR</span>
            <span className="md:hidden">ATR</span>
          </button>

          <button
            onClick={() => {
              setSurveySubmitted(false);
              setShowSurveyModal(true);
            }}
            className="px-2.5 sm:px-3 py-2 min-h-[44px] text-xs font-bold bg-[#0f2444] hover:bg-[#16335a] text-[#ffebd9] hover:text-white rounded-xl border border-[#2a4d7d] transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-[#ffa07a] shrink-0" />
            <span className="hidden xs:inline">Quick Feedback</span>
            <span className="xs:hidden">Feedback</span>
          </button>

          <button
            onClick={() => {
              setAuthModalTab('register');
              setShowLoginModal(true);
            }}
            id="btn-header-register"
            className="px-2.5 sm:px-3.5 py-2 min-h-[44px] text-xs font-bold bg-[#fff0e6] hover:bg-[#ffe2cc] text-[#c2410c] rounded-xl border border-[#fed7aa] shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#ff7a50] shrink-0" />
            <span className="hidden sm:inline">Register</span>
            <span className="sm:hidden">Join</span>
          </button>

          <button
            onClick={() => {
              setAuthModalTab('login');
              setShowLoginModal(true);
            }}
            id="btn-header-login"
            className="px-3 sm:px-4 py-2 min-h-[44px] text-xs font-bold bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-white rounded-xl shadow-md shadow-orange-950/20 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Institutional Login</span>
            <span className="sm:hidden">Login</span>
          </button>
        </div>
      </header>

      {/* Hero Section with Clean Architectural Precision */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center overflow-hidden w-full">
        {/* Subtle dot grid overlay */}
        <div className="absolute inset-0 bg-grid-subtle opacity-40 -z-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-radial from-blue-500/10 via-indigo-500/5 to-transparent blur-2xl pointer-events-none -z-10" />

        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5 sm:mb-6 max-w-full">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="truncate">Higher Education Quality Assurance & Accreditation Framework</span>
          </div>

          <button
            onClick={() => setShowExportSsrModal(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium transition-all shadow-2xs cursor-pointer group"
          >
            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Export NAAC ATR / SSR (PDF) • Metric 1.4.2 →</span>
          </button>

          <button
            onClick={() => setShowPublicAtrModal(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium transition-all shadow-2xs cursor-pointer group"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Public Disclosure Portal & QR Seal →</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] max-w-4xl mx-auto">
          Multi-Stakeholder Feedback &{' '}
          <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-slate-900 bg-clip-text text-transparent">
            Continuous Quality Improvement.
          </span>
        </h1>

        <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
          An institutional intelligence platform designed for Indian Higher Education Institutions to collect structured feedback from <strong className="text-slate-900 font-semibold">Students</strong>, <strong className="text-slate-900 font-semibold">Faculty</strong>, <strong className="text-slate-900 font-semibold">Alumni</strong>, <strong className="text-slate-900 font-semibold">Employers</strong>, <strong className="text-slate-900 font-semibold">Parents</strong>, and <strong className="text-slate-900 font-semibold">Administrative Staff</strong>, pinpoint quality gaps, implement CAPA action plans, and publish statutory NAAC Action Taken Reports.
        </p>

        {/* Primary CTA Pair */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto">
          <button
            onClick={() => demoLogin('iqac@naac-qms.edu')}
            id="btn-hero-explore-iqac"
            className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm shadow-blue-600/25 transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
          >
            <span>Explore IQAC Dashboard</span>
            <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a
            href="#stakeholder-perspectives"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('stakeholder-perspectives')?.scrollIntoView({ behavior: 'smooth' });
            }}
            id="btn-hero-submit-feedback"
            className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer group"
          >
            <Send className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
            <span>Submit Stakeholder Feedback</span>
          </a>
        </div>

        {/* Stakeholder Category Action Grid in 3D Tilt Cards */}
        <div id="stakeholder-perspectives" className="mt-10 sm:mt-14 max-w-5xl mx-auto w-full scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="text-left">
              <span className="text-[11px] font-extrabold text-[#c2410c] uppercase tracking-wider">Comprehensive Feedback System</span>
              <h2 className="text-base sm:text-xl font-bold text-[#0a192f]">Choose Your Stakeholder Perspective</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRoleMatrix(true)}
                className="flex items-center space-x-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold text-[#0a192f] bg-[#fff0e6] hover:bg-[#fed7aa] border border-[#fed7aa] transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#ff7a50]" />
                <span>View Role Matrix</span>
              </button>
              <button
                onClick={() => {
                  setSurveySubmitted(false);
                  setShowSurveyModal(true);
                }}
                className="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] flex items-center space-x-1 cursor-pointer min-h-[44px] px-2"
              >
                <span>Launch Survey Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
            {stakeholderCategories.slice(0, 4).map((cat) => {
              const Icon = cat.icon;
              return (
                <ThreeDTiltCard key={cat.id} maxTilt={10} scale={1.02}>
                  <div className="bg-white rounded-2xl p-4 border border-[#eddcd2] hover:border-[#ff7a50] shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 rounded-xl ${cat.color} flex items-center justify-center shadow-sm shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] shrink-0">
                          {cat.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0a192f] group-hover:text-[#ea580c] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-3">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-[#f3e8e0] flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-500">
                        {cat.forms.length} Active Survey{cat.forms.length > 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedStakeholder(cat.id as StakeholderType);
                          setSelectedSurveyId(cat.forms[0]?.id || 'form-1');
                          setSurveySubmitted(false);
                          setShowSurveyModal(true);
                        }}
                        className="px-3 py-2 min-h-[44px] text-[11px] font-bold text-white bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center"
                      >
                        Give Feedback
                      </button>
                    </div>
                  </div>
                </ThreeDTiltCard>
              );
            })}
          </div>

          {/* Secondary row for Alumni, Employer, Parents in 3D Tilt Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left mt-3.5">
            {stakeholderCategories.slice(4).map((cat) => {
              const Icon = cat.icon;
              return (
                <ThreeDTiltCard key={cat.id} maxTilt={8} scale={1.02}>
                  <div className="bg-white rounded-2xl p-3.5 border border-[#eddcd2] hover:border-[#ff7a50] shadow-xs hover:shadow-md transition-all flex items-center justify-between h-full">
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#0a192f] truncate">{cat.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{cat.badge}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStakeholder(cat.id as StakeholderType);
                        setSelectedSurveyId(cat.forms[0]?.id || 'form-1');
                        setSurveySubmitted(false);
                        setShowSurveyModal(true);
                      }}
                      className="px-3 py-2 min-h-[44px] text-[11px] font-bold text-[#0a192f] bg-[#fff0e6] hover:bg-[#ffe5d4] border border-[#fed7aa] rounded-xl transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                    >
                      Feedback
                    </button>
                  </div>
                </ThreeDTiltCard>
              );
            })}
          </div>
        </div>

        {/* Interactive 3D Quality Orbit Matrix Section */}
        <div className="mt-10 sm:mt-14 max-w-5xl mx-auto w-full">
          <ThreeDQualityOrbit />
        </div>

        {/* Quick Demo Personas - Instant Login in Clean Enterprise Box */}
        <div className="mt-10 sm:mt-14 bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 max-w-5xl mx-auto shadow-xs w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
            <div className="text-left">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <span>One-Click Role Switcher (IKGPTU Staff, Faculty & Stakeholders)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore NAAC-QMS directly through authenticated university staff, HoDs, teaching faculty, and institutional leaders:
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRoleMatrix(true)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-2 min-h-[38px] rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Role Definitions</span>
              </button>
              <span className="self-start sm:self-auto text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                {demoAccounts.length} Verified Roles
              </span>
            </div>
          </div>

          {/* Quick Tab Filters: [All | Students | Faculty & Staff | Leadership / Admin | External (Alumni/Employers)] */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-4 pb-1 overflow-x-auto no-scrollbar border-b border-slate-200">
            {[
              { id: 'ALL' as const, label: 'All', count: demoAccounts.length },
              {
                id: 'STUDENTS' as const,
                label: 'Students',
                count: demoAccounts.filter((a) => (a.category ? a.category === 'STUDENTS' : a.role === 'STUDENT')).length,
              },
              {
                id: 'FACULTY_STAFF' as const,
                label: 'Faculty & Staff',
                count: demoAccounts.filter((a) =>
                  a.category ? a.category === 'FACULTY_STAFF' : ['FACULTY', 'NON_TEACHING', 'TECHNICAL_STAFF'].includes(a.role)
                ).length,
              },
              {
                id: 'LEADERSHIP_ADMIN' as const,
                label: 'Leadership / Admin',
                count: demoAccounts.filter((a) =>
                  a.category
                    ? a.category === 'LEADERSHIP_ADMIN'
                    : ['SUPER_ADMIN', 'IQAC_ADMIN', 'PRINCIPAL', 'HOD'].includes(a.role)
                ).length,
              },
              {
                id: 'EXTERNAL' as const,
                label: 'External (Alumni/Employers)',
                count: demoAccounts.filter((a) =>
                  a.category ? a.category === 'EXTERNAL' : ['ALUMNI', 'EMPLOYER', 'PARENT'].includes(a.role)
                ).length,
              },
            ].map((tab) => {
              const isActive = roleFilterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setRoleFilterTab(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 border min-h-[36px] ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Persona Cards Grid with Compact View & View More */}
          {(() => {
            const filteredPersonas = demoAccounts.filter((acc) => {
              if (roleFilterTab === 'ALL') return true;
              const cat =
                acc.category ||
                (acc.role === 'STUDENT'
                  ? 'STUDENTS'
                  : ['FACULTY', 'NON_TEACHING', 'TECHNICAL_STAFF'].includes(acc.role)
                  ? 'FACULTY_STAFF'
                  : ['SUPER_ADMIN', 'IQAC_ADMIN', 'PRINCIPAL', 'HOD'].includes(acc.role)
                  ? 'LEADERSHIP_ADMIN'
                  : 'EXTERNAL');
              return cat === roleFilterTab;
            });

            const visiblePersonas = showAllPersonas ? filteredPersonas : filteredPersonas.slice(0, 4);

            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-5 text-left">
                  {visiblePersonas.map((acc) => {
                    const isStaff = acc.role === 'NON_TEACHING' || acc.role === 'TECHNICAL_STAFF';
                    const isFaculty = acc.role === 'FACULTY';
                    const isStudent = acc.role === 'STUDENT';
                    const isAdmin = acc.role === 'SUPER_ADMIN' || acc.role === 'IQAC_ADMIN' || acc.role === 'PRINCIPAL';
                    const isHod = acc.role === 'HOD';

                    let badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
                    if (isStaff) badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
                    if (isFaculty) badgeStyle = 'bg-sky-50 text-sky-700 border-sky-200';
                    if (isStudent) badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    if (isAdmin) badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
                    if (isHod) badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';

                    return (
                      <div
                        key={acc.id}
                        className="p-3.5 min-h-[44px] rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 text-left transition-all group flex flex-col justify-between shadow-2xs hover:shadow-xs relative"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-tight ${badgeStyle}`}>
                              {acc.role.replace('_', ' ')}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoleForMatrix(acc.role);
                                setShowRoleMatrix(true);
                              }}
                              title={`View ${acc.role.replace('_', ' ')} permissions & responsibilities`}
                              className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 min-h-[32px]">
                            {acc.fullName}
                          </h3>
                          <p className="text-[11px] font-medium text-slate-600 line-clamp-2 min-h-[28px] mt-0.5">
                            {acc.designation || acc.role.replace('_', ' ')}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{acc.department}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => demoLogin(acc.email)}
                          className="text-[11px] text-blue-600 font-semibold mt-3 flex items-center justify-between w-full pt-2 border-t border-slate-100 group-hover:border-blue-100 cursor-pointer"
                        >
                          <span className="group-hover:underline">Sign in as {acc.role.replace('_', ' ')}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Compact View More / Show Less Action Bar */}
                <div className="pt-5 flex flex-wrap items-center justify-center gap-2.5">
                  {filteredPersonas.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowAllPersonas(!showAllPersonas)}
                      id="btn-toggle-view-more-personas"
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer group"
                    >
                      <span>
                        {showAllPersonas
                          ? 'Show Fewer Personas ↑'
                          : `View More Roles & Personas (${filteredPersonas.length - 4} more) ↓`}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRoleForMatrix(undefined);
                      setShowRoleMatrix(true);
                    }}
                    id="btn-role-governance-details"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 transition-all shadow-2xs cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    <span>Role Governance Matrix & Future Scope (View More Details) →</span>
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Quality Improvement Cycle Diagram */}
      <section className="py-12 sm:py-16 bg-[#fffbf8] border-y border-[#eddcd2] px-4 sm:px-6 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold text-[#c2410c] uppercase tracking-wider">Closed-Loop Quality Governance</span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0a192f] mt-1">
              Continuous Quality Improvement Cycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Transforming raw stakeholder responses into actionable gap detection, root cause analysis, evidence-backed CAPA, and verifiable NAAC documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {cycleSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white hover:bg-[#fffaf5] rounded-2xl p-4 border border-[#eddcd2] hover:border-[#ff7a50] text-center relative flex flex-col items-center justify-between transition-all shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#fff0e6] border border-[#fed7aa] flex items-center justify-center text-lg mb-3 shadow-inner">
                  {step.icon}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#c2410c] block mb-1">STAGE {idx + 1}</span>
                  <h3 className="text-xs font-bold text-[#0a192f] leading-tight">{step.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Architecture Cards */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#c2410c] uppercase tracking-wider">Accreditation Preparedness</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mt-1">
            Built for 2026 Higher Education Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#eddcd2] hover:border-[#ff7a50] shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#fff0e6] text-[#c2410c] flex items-center justify-center mb-4 font-bold border border-[#fed7aa]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#0a192f]">Multi-Stakeholder Feedback Engine</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Targeted feedback instruments for Students, Faculty, Non-Teaching Staff, Technical Lab Staff, Alumni, and Employers. Supports Likert scales, NPS, star ratings, and anonymous mode.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#eddcd2] hover:border-[#ff7a50] shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#fff0e6] text-[#c2410c] flex items-center justify-center mb-4 font-bold border border-[#fed7aa]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#0a192f]">Quality Gap Analysis & CAPA</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Auto-flags quality indicators falling below target thresholds (&lt; 4.0/5). HoDs formulate root-cause analyses and corrective/preventive plans with accountability milestones.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#eddcd2] hover:border-[#ff7a50] shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#fff0e6] text-[#c2410c] flex items-center justify-center mb-4 font-bold border border-[#fed7aa]">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#0a192f]">Evidence Repository & Auditing</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Upload and index documentary proof (MoUs, hardware invoices, attendance registers, photo evidence) mapped to specific CAPAs and criteria with IQAC verification.
            </p>
          </div>
        </div>
      </section>

      {/* CAPA Status & Milestone Timeline Tracking Showcase */}
      <section className="py-14 sm:py-18 bg-[#fffaf5] border-y border-[#eddcd2] px-4 sm:px-6 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#fff0e6] border border-[#fed7aa] text-[#c2410c] text-xs font-bold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ff7a50]" />
                <span>NAAC Metric 1.4.2 Quality Remediation Engine</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#0a192f] tracking-tight">
                Live CAPA Status & Milestone Timeline Tracking
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Every identified quality gap initiates a closed-loop Corrective & Preventive Action Plan with multi-stage verification, documentary evidence, and post-remediation score remeasurement.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-bold text-slate-500 bg-white border border-[#fed7aa] px-3 py-1.5 rounded-xl shadow-2xs">
                Active CAPA Pipeline: <strong className="text-[#0a192f]">12 Total</strong>
              </span>
              <button
                onClick={() => demoLogin('iqac@naac-qms.edu')}
                className="text-xs font-bold bg-[#0a192f] hover:bg-[#132c52] text-white px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
              >
                <span>Manage in IQAC Portal &rarr;</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[
              {
                code: 'CAPA-2025-001',
                department: 'Computer Science & Engineering',
                issue: 'High-Performance Computing Cluster Inadequacy for Deep Learning Lab',
                rootCause: 'Surge in AI specialization enrollment outpaced physical GPU workstation capacity.',
                correctiveAction: 'Procured 4x NVIDIA A100 GPU compute servers and upgraded gigabit lab backbone.',
                assignedTo: 'Dr. Monika Sachdeva (HoD CSE)',
                statusLabel: 'Resolved / Closed',
                badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                dotColor: 'bg-emerald-500',
                stepIndex: 3,
                beforeScore: 3.20,
                afterScore: 4.65,
                dueDate: '2025-11-30',
                evidence: 'PO-GPU-2025-88 & Lab Log Register',
              },
              {
                code: 'CAPA-2025-004',
                department: 'Mechanical Engineering',
                issue: 'Industrial Automation & CNC Lab Simulator Software Upgrade Needed',
                rootCause: 'Legacy proprietary software licenses expired; modern curriculum requires Industry 4.0 PLC.',
                correctiveAction: 'Installed 60 seats of modern CAD/CAM software and Siemens Mechatronics training rigs.',
                assignedTo: 'Dr. Neel Kanth Grover (HoD Mechanical)',
                statusLabel: 'Pending Verification',
                badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
                dotColor: 'bg-amber-500',
                stepIndex: 2,
                beforeScore: 3.40,
                afterScore: 4.40,
                dueDate: '2026-02-15',
                evidence: 'Vendor Invoice & DQC Inspection Certificate',
              },
              {
                code: 'CAPA-2025-007',
                department: 'Management Studies (MBA)',
                issue: 'Industry Case-Study Pedagogy & Harvard Business Publishing Access Request',
                rootCause: 'Course material lacked real-time emerging market case studies in FinTech & Supply Chain.',
                correctiveAction: 'Subscribed to Harvard Business School Publishing institutional case database.',
                assignedTo: 'Dr. Harmeen Soch (HoD MBA)',
                statusLabel: 'In Review',
                badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
                dotColor: 'bg-blue-500',
                stepIndex: 1,
                beforeScore: 3.65,
                afterScore: 4.50,
                dueDate: '2026-03-30',
                evidence: 'HBSP Invoice & Library Access Logs',
              },
            ].map((capa, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#eddcd2] hover:border-[#ff7a50] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-black text-[#0a192f] px-2 py-0.5 bg-[#fff0e6] border border-[#fed7aa] rounded">
                      {capa.code}
                    </span>
                    <span className={`inline-flex items-center space-x-1.5 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${capa.badgeColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${capa.dotColor}`} />
                      <span>{capa.statusLabel}</span>
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#0a192f] mt-1 line-clamp-2 leading-snug">
                    {capa.issue}
                  </h3>

                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-2 pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">{capa.department}</span>
                    <span>•</span>
                    <span className="text-slate-500">{capa.assignedTo}</span>
                  </div>

                  {/* Visual Milestone Timeline Indicator */}
                  <div className="my-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2 text-[10px]">
                      <span className="font-bold text-slate-600 uppercase tracking-wider">Milestone Timeline</span>
                      <span className="font-extrabold text-[#c2410c]">
                        {capa.stepIndex === 3 ? 'Stage 4/4: Fully Resolved' : capa.stepIndex === 2 ? 'Stage 3/4: Verification' : 'Stage 2/4: In Review'}
                      </span>
                    </div>

                    <div className="relative flex items-center justify-between px-1 pt-1 pb-1">
                      <div className="absolute top-3.5 left-4 right-4 h-1 bg-slate-200 z-0" />
                      <div
                        className="absolute top-3.5 left-4 h-1 bg-[#c2410c] z-0 transition-all duration-300"
                        style={{
                          width: capa.stepIndex === 3 ? 'calc(100% - 32px)' : capa.stepIndex === 2 ? '66%' : '33%',
                        }}
                      />

                      {[
                        { label: 'Identified' },
                        { label: 'In Review' },
                        { label: 'Verification' },
                        { label: 'Resolved' },
                      ].map((step, sIdx) => {
                        const isPast = sIdx <= capa.stepIndex;
                        const isCurrent = sIdx === capa.stepIndex;
                        return (
                          <div key={sIdx} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${
                                isPast
                                  ? 'bg-[#0a192f] text-white border-[#0a192f]'
                                  : 'bg-white text-slate-400 border-slate-300'
                              } ${isCurrent ? 'ring-2 ring-orange-300 scale-110' : ''}`}
                            >
                              {isPast ? '✓' : sIdx + 1}
                            </div>
                            <span className={`text-[9px] mt-1 font-semibold ${isCurrent ? 'text-[#0a192f] font-bold' : 'text-slate-500'}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Impact Score Metric */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#fffaf5] border border-[#fed7aa] rounded-xl text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Baseline Metric</span>
                      <span className="text-xs font-mono font-bold text-slate-700">{capa.beforeScore.toFixed(2)} / 5.0</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 font-semibold block">Post-CAPA Score</span>
                      <span className="text-xs font-mono font-black text-emerald-700">
                        {capa.afterScore.toFixed(2)} / 5.0 <span className="text-[10px] text-emerald-600">(+{(capa.afterScore - capa.beforeScore).toFixed(2)})</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate pr-2">Evidence: <strong className="text-slate-700">{capa.evidence}</strong></span>
                  <span className="text-[#c2410c] font-bold shrink-0">Due: {capa.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightweight Tamper-Proof Audit Trail Section */}
      <section className="py-14 sm:py-18 bg-white border-b border-[#eddcd2] px-4 sm:px-6 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold text-[#c2410c] uppercase tracking-wider">Accreditation Data Integrity</span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0a192f] mt-1">
              Tamper-Proof Read-Only Institutional Audit Trail
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Every action across stakeholder feedback, quality gaps, CAPA workflows, and evidence verification is cryptographically logged and sealed for NAAC peer-team scrutiny.
            </p>
          </div>

          <div className="bg-[#fffaf5] rounded-2xl border border-[#eddcd2] shadow-sm overflow-hidden">
            <div className="p-3.5 sm:p-4 bg-[#0a192f] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b3456]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-white">
                  Cryptographically Hashed Institutional Ledger (SHA-256)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-blue-200">
                <ShieldCheck className="w-4 h-4 text-[#ffa07a]" />
                <span>Verification State: <strong className="text-emerald-400 font-bold">Tamper-Proof & Immutable</strong></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8ede6] text-[#0a192f] font-bold border-b border-[#fed7aa]">
                  <tr>
                    <th className="p-3 sm:p-3.5">Date & Time</th>
                    <th className="p-3 sm:p-3.5">Action</th>
                    <th className="p-3 sm:p-3.5">Stakeholder Role</th>
                    <th className="p-3 sm:p-3.5 max-w-xs">Description</th>
                    <th className="p-3 sm:p-3.5">Status</th>
                    <th className="p-3 sm:p-3.5 font-mono">Verification Hash / Seal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3e8e0] bg-white">
                  {[
                    {
                      id: 'aud-101',
                      date: '2026-03-28 14:32:10 IST',
                      action: 'VERIFY_EVIDENCE',
                      actionBadge: 'bg-blue-100 text-blue-800 border-blue-200',
                      role: 'IQAC Director (Prof. Rajiv Chauhan)',
                      desc: 'Verified & sealed documentary proof for CAPA-2025-001 (GPU Lab Upgrade) under Metric 1.4.2.',
                      status: 'Verified',
                      hash: '0x8f2a41d9e72b...4a12',
                    },
                    {
                      id: 'aud-102',
                      date: '2026-03-27 11:15:45 IST',
                      action: 'RATIFY_CAPA',
                      actionBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                      role: 'Vice-Chancellor (Prof. Dr. Susheel Mittal)',
                      desc: 'Approved closure of Action Plan CAPA-2025-001 after post-remediation score jump (3.20 -> 4.65).',
                      status: 'Verified',
                      hash: '0xd41c09ab31f8...9b73',
                    },
                    {
                      id: 'aud-103',
                      date: '2026-03-26 16:40:22 IST',
                      action: 'FORMULATE_CAPA',
                      actionBadge: 'bg-purple-100 text-purple-800 border-purple-200',
                      role: 'HoD Mechanical (Dr. Neel Kanth Grover)',
                      desc: 'Formulated Corrective & Preventive Action Plan for CNC & Automation Lab modernization.',
                      status: 'Verified',
                      hash: '0x7e31b64cf012...88df',
                    },
                    {
                      id: 'aud-104',
                      date: '2026-03-25 09:12:08 IST',
                      action: 'DISPATCH_SURVEY',
                      actionBadge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                      role: 'Super Admin (Dr. Suresh Chandra)',
                      desc: 'Published institutional Stakeholder Feedback Form for AY 2025–26 (B.Tech, MBA, MCA).',
                      status: 'Verified',
                      hash: '0x3a992bc510e1...c031',
                    },
                    {
                      id: 'aud-105',
                      date: '2026-03-24 18:05:33 IST',
                      action: 'SUBMIT_FEEDBACK',
                      actionBadge: 'bg-amber-100 text-amber-800 border-amber-200',
                      role: 'Student (UG B.Tech CSE, Sem 7)',
                      desc: 'Cryptographically encrypted and logged anonymous course exit appraisal response.',
                      status: 'Verified',
                      hash: '0x1c885fa2093e...f4a7',
                    },
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-[#fffaf5] transition-colors">
                      <td className="p-3 sm:p-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {row.date}
                      </td>
                      <td className="p-3 sm:p-3.5 whitespace-nowrap">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${row.actionBadge}`}>
                          {row.action.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 sm:p-3.5 font-bold text-[#0a192f] whitespace-nowrap">
                        {row.role}
                      </td>
                      <td className="p-3 sm:p-3.5 text-slate-600 max-w-xs truncate">
                        {row.desc}
                      </td>
                      <td className="p-3 sm:p-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{row.status}</span>
                        </span>
                      </td>
                      <td className="p-3 sm:p-3.5 whitespace-nowrap">
                        <span className="font-mono text-[11px] text-[#c2410c] bg-[#fff0e6] border border-[#fed7aa] px-2 py-0.5 rounded font-bold">
                          {row.hash}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Export NAAC ATR / SSR (PDF) Official Banner */}
      <section className="py-12 sm:py-16 bg-linear-to-r from-[#0a192f] via-[#102a4e] to-[#0a192f] text-white px-4 sm:px-6 w-full border-b border-[#1b3456]">
        <div className="max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 bg-linear-to-br from-[#0f2444] to-[#081528] border-2 border-[#3b5e8c] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 max-w-xl text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ffa07a]/20 border border-[#ffa07a]/40 text-[#fed7aa] text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5 text-[#ffa07a]" />
              <span>Accreditation Ready Export Document</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Export NAAC Action Taken Report (ATR) / SSR (PDF)
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-2 leading-relaxed">
              Generate a printable, audit-ready NAAC Metric 1.4.2 document complete with institutional header, watermark, 4-criteria quality index matrix, CAPA score jumps, cryptographic QR seal, and dual statutory signatures.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-blue-300">
              <span className="bg-[#14325a] px-2.5 py-1 rounded-lg border border-blue-400/30">Criterion 1: Curricular Aspects</span>
              <span className="bg-[#14325a] px-2.5 py-1 rounded-lg border border-blue-400/30">Criterion 2: Pedagogy</span>
              <span className="bg-[#14325a] px-2.5 py-1 rounded-lg border border-blue-400/30">Criterion 4: Infrastructure</span>
              <span className="bg-[#14325a] px-2.5 py-1 rounded-lg border border-blue-400/30">Criterion 6: Governance</span>
            </div>
          </div>

          <div className="relative z-10 shrink-0 text-center flex flex-col items-center">
            <button
              onClick={() => setShowExportSsrModal(true)}
              id="btn-banner-export-ssr"
              className="px-6 py-3.5 min-h-[50px] bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-950/40 hover:scale-105 transition-all flex items-center space-x-2.5 cursor-pointer border border-[#fed7aa]/50"
            >
              <FileDown className="w-4 h-4 shrink-0" />
              <span>Export NAAC ATR / SSR (PDF)</span>
            </button>
            <span className="text-[11px] text-blue-300 mt-2">
              Academic Year: <strong>{landingAcademicYear === 'ay-4' ? 'AY 2025–26' : 'AY 2026–27'}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 bg-[#fffbf8] border-t border-[#eddcd2] px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#c2410c] uppercase tracking-wider">Quality Operations</span>
            <h2 className="text-2xl font-extrabold text-[#0a192f] mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#eddcd2] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0a192f] hover:text-[#ea580c] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#ff7a50] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-600 border-t border-[#f5e8df] bg-[#fffaf5] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer in Deep Navy Blue */}
      <footer className="mt-auto border-t border-[#1b3456] bg-[#0a192f] py-8 px-6 text-center text-xs text-blue-200">
        <div className="flex items-center justify-center space-x-2 font-bold text-white mb-1">
          <Award className="w-4 h-4 text-[#ffa07a]" />
          <span>NAAC-QMS • Autonomous Higher Education Quality Management System</span>
        </div>
        <p className="text-[11px] text-blue-300/80">
          Continuous Stakeholder Assurance: Students, Teachers & Faculty, Administrative Staff, Technical Staff, Alumni & Employers
        </p>
      </footer>

      {/* Interactive Quick Feedback Modal for ANY Stakeholder */}
      {showSurveyModal && (
        <div className="fixed inset-0 z-50 bg-[#0a192f]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-7 shadow-2xl border border-[#fed7aa] max-h-[92vh] overflow-y-auto text-[#0b1a30] my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3e8e0]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] flex items-center justify-center font-bold shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0a192f]">Stakeholder Quality Appraisal</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">Submit your authentic institutional feedback</p>
                </div>
              </div>
              <button
                onClick={() => setShowSurveyModal(false)}
                aria-label="Close survey modal"
                className="text-slate-400 hover:text-slate-700 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {surveySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-[#0a192f]">Feedback Recorded Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you for contributing to institutional quality assurance. Your responses have been incorporated into the real-time quality index telemetry.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setShowSurveyModal(false)}
                    className="px-5 py-2 bg-linear-to-r from-[#ff7a50] to-[#f97316] text-white text-xs font-bold rounded-xl hover:from-[#f0683d] hover:to-[#ea580c] shadow-md shadow-orange-950/20"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuickSurveySubmit} className="mt-4 space-y-4 text-xs">
                {/* 1. Stakeholder Type Selector */}
                <div>
                  <label className="block font-bold text-[#0a192f] mb-1.5">1. Select Your Stakeholder Role:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'STUDENT', label: '🎓 Student' },
                      { id: 'FACULTY', label: '👨‍🏫 Teacher / Faculty' },
                      { id: 'NON_TEACHING', label: '📋 Admin Staff' },
                      { id: 'TECHNICAL_STAFF', label: '🔬 Technical Staff' },
                      { id: 'ALUMNI', label: '🤝 Alumnus' },
                      { id: 'EMPLOYER', label: '🏢 Employer' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          const val = item.id as StakeholderType;
                          setSelectedStakeholder(val);
                          const cat = stakeholderCategories.find((c) => c.id === val);
                          if (cat && cat.forms[0]) setSelectedSurveyId(cat.forms[0].id);
                        }}
                        className={`p-2 rounded-xl text-left font-semibold border transition-all cursor-pointer ${
                          selectedStakeholder === item.id
                            ? 'bg-[#0a192f] text-white border-[#0a192f] shadow-md'
                            : 'bg-[#fffaf5] text-slate-700 border-[#fed7aa] hover:bg-[#fff0e6]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Target Survey Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#0a192f] mb-1">2. Target Survey:</label>
                    <select
                      value={selectedSurveyId}
                      onChange={(e) => setSelectedSurveyId(e.target.value)}
                      aria-label="Select Target Survey"
                      className="w-full p-2 bg-white border border-[#fed7aa] rounded-xl font-medium text-[#0a192f] focus:outline-hidden focus:border-[#ff7a50]"
                    >
                      {stakeholderCategories
                        .find((c) => c.id === selectedStakeholder)
                        ?.forms.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        )) || <option value="form-1">General Institutional Survey</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#0a192f] mb-1">Department / Branch Course:</label>
                    <select
                      value={surveyDept}
                      onChange={(e) => setSurveyDept(e.target.value)}
                      aria-label="Select Department or Branch Course"
                      className="w-full p-2 bg-white border border-[#fed7aa] rounded-xl font-medium text-[#0a192f] focus:outline-hidden focus:border-[#ff7a50]"
                    >
                      <option value="dept-1">B.Tech Computer Science</option>
                      <option value="dept-2">Mechanical Engineering</option>
                      <option value="dept-3">BCA (Bachelor of Computer Applications)</option>
                      <option value="dept-4">BBA (Bachelor of Business Administration)</option>
                      <option value="dept-5">B.Tech CSE (AI & ML)</option>
                    </select>
                  </div>
                </div>

                {/* Privacy Mode */}
                <div className="p-3 bg-[#fffaf5] rounded-xl border border-[#fed7aa] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-[#ff7a50]" />
                    <span className="font-semibold text-[#0a192f] text-[11px]">Confidentiality Setting:</span>
                  </div>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={surveyAnonymous}
                      onChange={(e) => setSurveyAnonymous(e.target.checked)}
                      className="rounded text-[#ff7a50] focus:ring-0"
                    />
                    <span className="font-bold text-[#c2410c] text-[11px]">Submit Anonymously</span>
                  </label>
                </div>

                {/* Rating Questions */}
                <div className="space-y-3 pt-2">
                  <p className="font-bold text-[#c2410c] uppercase tracking-wider text-[11px]">Evaluation Parameters (1 = Poor, 5 = Excellent):</p>
                  
                  <div className="p-3 bg-[#fffaf5] rounded-xl border border-[#fed7aa] space-y-2">
                    <p className="font-medium text-[#0a192f]">
                      Q1. Effectiveness and quality of academic delivery, syllabus, or administrative workflow:
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSurveyRatings({ ...surveyRatings, q1: val })}
                          className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
                            surveyRatings.q1 === val
                              ? 'bg-[#ff7a50] text-white shadow-xs'
                              : 'bg-white border border-[#fed7aa] text-slate-700 hover:bg-[#fff0e6]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[#fffaf5] rounded-xl border border-[#fed7aa] space-y-2">
                    <p className="font-medium text-[#0a192f]">
                      Q2. Adequacy of physical and digital infrastructure, computing resources, or lab equipment:
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSurveyRatings({ ...surveyRatings, q2: val })}
                          className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
                            surveyRatings.q2 === val
                              ? 'bg-[#ff7a50] text-white shadow-xs'
                              : 'bg-white border border-[#fed7aa] text-slate-700 hover:bg-[#fff0e6]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[#fffaf5] rounded-xl border border-[#fed7aa] space-y-2">
                    <p className="font-medium text-[#0a192f]">
                      Q3. Institutional responsiveness, welfare support, and grievance redressal:
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSurveyRatings({ ...surveyRatings, q3: val })}
                          className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
                            surveyRatings.q3 === val
                              ? 'bg-[#ff7a50] text-white shadow-xs'
                              : 'bg-white border border-[#fed7aa] text-slate-700 hover:bg-[#fff0e6]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#0a192f] mb-1">Qualitative Feedback / Suggestions (Optional):</label>
                    <textarea
                      value={surveyComments}
                      onChange={(e) => setSurveyComments(e.target.value)}
                      rows={2}
                      placeholder="Share constructive remarks or improvement suggestions..."
                      className="w-full p-2.5 bg-white border border-[#fed7aa] rounded-xl text-xs text-[#0a192f] placeholder:text-slate-400 focus:outline-hidden focus:border-[#ff7a50]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end space-x-2 border-t border-[#f3e8e0]">
                  <button
                    type="button"
                    onClick={() => setShowSurveyModal(false)}
                    className="px-4 py-2.5 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer border border-slate-200 flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 min-h-[44px] bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-white font-bold rounded-xl shadow-md shadow-orange-950/20 transition-all cursor-pointer flex items-center justify-center"
                  >
                    {isSubmitting ? 'Recording...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Institutional Authentication Modal (Login & Register) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-[#0a192f]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#fed7aa] rounded-3xl max-w-md sm:max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 text-[#0b1a30] my-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#f3e8e0]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] flex items-center justify-center font-bold shrink-0">
                  {authModalTab === 'register' ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0a192f]">
                    {authModalTab === 'register' ? 'Stakeholder Registration' : 'Institutional Authentication'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {authModalTab === 'register'
                      ? 'Verified institutional registration portal'
                      : 'Authorized institutional console security gateway'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                aria-label="Close auth modal"
                className="text-slate-400 hover:text-slate-700 min-w-[36px] min-h-[36px] flex items-center justify-center text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tab switchers: Sign In vs Register */}
            <div className="flex rounded-xl bg-slate-100 p-1 mt-4 mb-3">
              <button
                type="button"
                id="btn-tab-login"
                onClick={() => {
                  setAuthModalTab('login');
                  setRegError('');
                  setLoginError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  authModalTab === 'login'
                    ? 'bg-white text-[#0a192f] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                id="btn-tab-register"
                onClick={() => {
                  setAuthModalTab('register');
                  setRegError('');
                  setLoginError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                  authModalTab === 'register'
                    ? 'bg-white text-[#c2410c] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Account</span>
              </button>
            </div>

            {/* Error / Success Alerts */}
            {loginError && (
              <div className="mb-3 p-3 bg-red-50 border-2 border-red-300 text-red-800 text-xs rounded-xl font-medium shadow-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}
            {regError && (
              <div className="mb-3 p-3 bg-red-50 border-2 border-red-300 text-red-800 text-xs rounded-xl font-medium shadow-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}
            {regSuccess && (
              <div className="mb-3 p-3 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs rounded-xl font-medium shadow-xs flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{regSuccess}</span>
              </div>
            )}

            {authModalTab === 'login' ? (
              <div className="space-y-3">
                {/* Google One-Click Authentication Button */}
                <button
                  type="button"
                  id="btn-google-auth"
                  onClick={handleGoogleClick}
                  className="w-full min-h-[42px] bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs py-2 px-4 rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all cursor-pointer flex items-center justify-center space-x-2.5 group"
                >
                  <GoogleIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>Sign in with Google</span>
                </button>

                <div className="relative my-2 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Or Institutional Credentials
                  </span>
                </div>

                {/* Sub-modes: Password vs Email OTP */}
                <div className="flex border-b border-slate-150 pb-1 text-[11px] font-semibold space-x-3 text-slate-500">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('password');
                      setLoginError('');
                    }}
                    className={`pb-1 transition-all cursor-pointer ${
                      loginMode === 'password'
                        ? 'text-[#c2410c] border-b-2 border-[#ff7a50] font-bold'
                        : 'hover:text-slate-800'
                    }`}
                  >
                    Password Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('otp');
                      setLoginError('');
                    }}
                    className={`pb-1 transition-all cursor-pointer ${
                      loginMode === 'otp'
                        ? 'text-[#c2410c] border-b-2 border-[#ff7a50] font-bold'
                        : 'hover:text-slate-800'
                    }`}
                  >
                    Email OTP Sign In
                  </button>
                </div>

                {loginMode === 'password' ? (
                  <form onSubmit={handleCustomLogin} className="space-y-3">
                    {/* Quick-Pick Existing Registered ID Dropdown */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#0a192f] mb-1">
                        Select Demo / Registered Account:
                      </label>
                      <select
                        id="select-pick-user"
                        value={cleanEmailInput}
                        onChange={(e) => handlePickExistingUser(e.target.value)}
                        className="w-full bg-[#fffaf5] border border-[#fed7aa] rounded-xl px-2.5 py-1.5 min-h-[38px] text-xs font-semibold text-[#0a192f] focus:outline-hidden focus:border-[#ff7a50]"
                      >
                        <option value="">-- Choose an existing stakeholder account --</option>
                        {demoAccounts.map((acc) => (
                          <option key={acc.id} value={acc.email.toLowerCase()}>
                            {acc.fullName} ({acc.role.replace('_', ' ')}) — {acc.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Clickable Quick-Pick Chips */}
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {demoAccounts.slice(0, 4).map((acc) => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => handlePickExistingUser(acc.email)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              cleanEmailInput === acc.email.toLowerCase()
                                ? 'bg-[#ff7a50] text-white border-[#f97316] shadow-xs'
                                : 'bg-white text-slate-700 border-[#fed7aa] hover:bg-[#fff0e6] hover:text-[#c2410c]'
                            }`}
                          >
                            {acc.role.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
                      <input
                        type="email"
                        id="input-login-email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (loginError) setLoginError('');
                        }}
                        placeholder="e.g. iqac@naac-qms.edu"
                        required
                        className="w-full bg-white border border-[#fed7aa] rounded-xl px-3 py-2 min-h-[40px] text-xs text-[#0a192f] placeholder:text-slate-400 focus:outline-hidden focus:border-[#ff7a50]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                      <input
                        type="password"
                        id="input-login-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (loginError) setLoginError('');
                        }}
                        placeholder="••••••••"
                        required
                        className="w-full bg-white border border-[#fed7aa] rounded-xl px-3 py-2 min-h-[40px] text-xs text-[#0a192f] placeholder:text-slate-400 focus:outline-hidden focus:border-[#ff7a50]"
                      />
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        id="btn-login-submit"
                        disabled={isSubmitting}
                        className="w-full min-h-[42px] bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-orange-950/20 flex items-center justify-center space-x-1.5"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Login with Email OTP */
                  <form onSubmit={handleOtpLoginSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email ID</label>
                      <div className="flex space-x-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (loginError) setLoginError('');
                          }}
                          placeholder="Registered email address"
                          required
                          className="flex-1 bg-white border border-[#fed7aa] rounded-xl px-3 py-2 min-h-[40px] text-xs text-[#0a192f] focus:outline-hidden focus:border-[#ff7a50]"
                        />
                        <button
                          type="button"
                          onClick={handleSendLoginOtp}
                          disabled={isSendingLoginOtp || !email.trim()}
                          className="px-3 min-h-[40px] bg-[#fff0e6] hover:bg-[#fed7aa] text-[#c2410c] text-xs font-bold rounded-xl border border-[#fed7aa] disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                        >
                          {isSendingLoginOtp ? 'Sending...' : loginOtpSent ? 'Resend' : 'Send OTP'}
                        </button>
                      </div>
                    </div>

                    {loginOtpSent && (
                      <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs space-y-1">
                        <p className="font-semibold">{loginOtpMsg}</p>
                        {loginDevOtp && (
                          <div className="pt-1 flex items-center justify-between text-[11px]">
                            <span className="text-blue-700 font-mono">Dev Preview OTP: <strong>{loginDevOtp}</strong></span>
                            <button
                              type="button"
                              onClick={() => setLoginOtp(loginDevOtp)}
                              className="text-xs text-[#c2410c] underline font-bold cursor-pointer"
                            >
                              Auto-Fill
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {loginOtpSent && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 6-Digit Code</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={loginOtp}
                          onChange={(e) => setLoginOtp(e.target.value)}
                          placeholder="e.g. 123456"
                          required
                          className="w-full bg-white border border-[#fed7aa] rounded-xl px-3 py-2 min-h-[40px] text-center tracking-widest font-mono font-bold text-sm text-[#0a192f] focus:outline-hidden focus:border-[#ff7a50]"
                        />
                      </div>
                    )}

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting || !loginOtpSent}
                        className="w-full min-h-[42px] bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-orange-950/20 flex items-center justify-center space-x-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Verifying...' : 'Verify OTP & Sign In'}</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className="text-center pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('register');
                      setRegError('');
                      setLoginError('');
                    }}
                    className="text-xs font-semibold text-[#c2410c] hover:underline cursor-pointer"
                  >
                    Don't have an account? Register with Verified ID →
                  </button>
                </div>
              </div>
            ) : (
              /* Register Account Form - 2-Step Modern Wizard */
              <div className="space-y-4">
                {/* 2-Step Navigation Stepper Header */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      regStep === 1
                        ? 'bg-white text-[#c2410c] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      regOtpVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : regStep === 1
                        ? 'bg-[#ff7a50] text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {regOtpVerified ? '✓' : '1'}
                    </span>
                    <span>1. Verify Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!regEmail.trim()) {
                        setRegError('Please enter your email address first.');
                        return;
                      }
                      setRegError('');
                      setRegStep(2);
                    }}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      regStep === 2
                        ? 'bg-white text-[#c2410c] shadow-xs'
                        : regOtpVerified
                        ? 'text-emerald-700 hover:text-emerald-900'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      regStep === 2 ? 'bg-[#ff7a50] text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      2
                    </span>
                    <span>2. Profile Details</span>
                  </button>
                </div>

                {/* STEP 1: Email & Google Verification */}
                {regStep === 1 && (
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    {/* Google One-Click Quick Option */}
                    <button
                      type="button"
                      id="btn-google-auth-reg"
                      onClick={handleGoogleClick}
                      className="w-full min-h-[42px] bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs py-2 px-4 rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all cursor-pointer flex items-center justify-center space-x-2.5 group"
                    >
                      <GoogleIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                      <span>Continue with Google (Instant Verification)</span>
                    </button>

                    <div className="relative my-2 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Or verify official email
                      </span>
                    </div>

                    <div className="p-4 bg-[#fffaf5] border border-[#fed7aa] rounded-2xl space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-[#0a192f] flex items-center space-x-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#ff7a50]" />
                            <span>Institutional / Official Email</span>
                          </label>
                          {regOtpVerified ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-medium">Domain MX Checked</span>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <input
                            type="email"
                            id="input-register-email"
                            value={regEmail}
                            onChange={(e) => {
                              setRegEmail(e.target.value);
                              setRegOtpVerified(false);
                              setRegOtpSent(false);
                              if (regError) setRegError('');
                            }}
                            placeholder="yourname@institution.edu or gmail.com"
                            required
                            className="flex-1 bg-white border border-[#fed7aa] rounded-xl px-3 py-2 min-h-[40px] text-xs text-[#0a192f] placeholder:text-slate-400 focus:outline-hidden focus:border-[#ff7a50]"
                          />
                          <button
                            type="button"
                            id="btn-send-reg-otp"
                            onClick={handleSendRegOtp}
                            disabled={isSendingRegOtp || !regEmail.trim() || regOtpVerified}
                            className="px-3.5 min-h-[40px] text-xs font-bold rounded-xl bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-white border border-[#f97316] disabled:opacity-50 transition-all cursor-pointer shrink-0 flex items-center space-x-1 shadow-xs"
                          >
                            {isSendingRegOtp ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : regOtpVerified ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-700" />
                                <span>Verified</span>
                              </>
                            ) : regOtpSent ? (
                              <span>Resend</span>
                            ) : (
                              <span>Send Code</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 6-Digit OTP Field (shown once OTP sent) */}
                      {regOtpSent && !regOtpVerified && (
                        <div className="pt-3 border-t border-[#fed7aa]/80 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                              <KeyRound className="w-3.5 h-3.5 text-[#c2410c]" />
                              <span>Enter 6-Digit Verification Code:</span>
                            </label>
                            {regDevOtp && (
                              <button
                                type="button"
                                onClick={() => setRegOtp(regDevOtp)}
                                className="text-[10px] text-blue-700 font-bold underline cursor-pointer bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200"
                              >
                                Auto-fill: {regDevOtp}
                              </button>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            <input
                              type="text"
                              id="input-register-otp"
                              maxLength={6}
                              value={regOtp}
                              onChange={(e) => setRegOtp(e.target.value.replace(/[^0-9]/g, ''))}
                              placeholder="••••••"
                              className="flex-1 bg-white border border-[#fed7aa] rounded-xl px-3 py-2 min-h-[40px] text-center font-mono font-bold text-base tracking-widest text-[#0a192f] focus:outline-hidden focus:border-[#ff7a50]"
                            />
                            <button
                              type="button"
                              id="btn-verify-reg-otp"
                              onClick={handleVerifyRegOtp}
                              disabled={isVerifyingRegOtp || regOtp.length < 6}
                              className="px-4 min-h-[40px] text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 disabled:opacity-50 transition-all cursor-pointer shrink-0 flex items-center space-x-1 shadow-xs"
                            >
                              {isVerifyingRegOtp ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  <span>Verifying...</span>
                                </>
                              ) : (
                                <span>Verify & Proceed →</span>
                              )}
                            </button>
                          </div>

                          {regOtpMsg && (
                            <p className="text-[11px] text-emerald-700 font-medium">
                              📬 {regOtpMsg}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Option to proceed to Step 2 */}
                      <div className="pt-2 flex items-center justify-between">
                        {regOtpVerified ? (
                          <p className="text-xs text-emerald-800 font-bold flex items-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Email verified!</span>
                          </p>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">Or direct profile details:</span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (!regEmail.trim()) {
                              setRegError('Please enter your email address first.');
                              return;
                            }
                            setRegError('');
                            setRegStep(2);
                          }}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all shadow-xs ${
                            regOtpVerified
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-slate-800 hover:bg-slate-900 text-white'
                          }`}
                        >
                          {regOtpVerified ? 'Proceed to Step 2 →' : 'Fill Profile Details →'}
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthModalTab('login');
                          setRegError('');
                          setLoginError('');
                        }}
                        className="text-xs font-semibold text-[#c2410c] hover:underline cursor-pointer"
                      >
                        Already have an account? Sign in here →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Profile Details & Password */}
                {regStep === 2 && (
                  <form onSubmit={handleRegister} className="space-y-3 animate-in fade-in duration-150">
                    {/* Email Confirmation Badge */}
                    <div className={`flex items-center justify-between p-2.5 rounded-xl text-xs ${
                      regOtpVerified
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                        : 'bg-slate-50 border border-slate-200 text-slate-900'
                    }`}>
                      <div className="flex items-center space-x-2 truncate mr-2">
                        {regOtpVerified ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Mail className="w-4 h-4 text-[#ff7a50] shrink-0" />
                        )}
                        <span className="truncate">{regOtpVerified ? 'Verified Email:' : 'Email:'} <strong className="font-mono">{regEmail}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegStep(1)}
                        className="text-[11px] text-[#c2410c] font-bold hover:underline cursor-pointer shrink-0"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="input-register-name"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="e.g. Dr. Jyoti Kaur / Student Name"
                        required
                        className="w-full bg-white border border-[#fed7aa] rounded-xl px-3 py-2 min-h-[38px] text-xs text-[#0a192f] placeholder:text-slate-400 focus:outline-hidden focus:border-[#ff7a50]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
                      <input
                        type="password"
                        id="input-register-password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        required
                        minLength={6}
                        className="w-full bg-white border border-[#fed7aa] rounded-xl px-3 py-2 min-h-[38px] text-xs text-[#0a192f] placeholder:text-slate-400 focus:outline-hidden focus:border-[#ff7a50]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Stakeholder Role</label>
                        <select
                          id="select-register-role"
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value as Role)}
                          className="w-full bg-white border border-[#fed7aa] rounded-xl px-2.5 py-1.5 min-h-[38px] text-xs text-[#0a192f] focus:outline-hidden focus:border-[#ff7a50] font-medium"
                        >
                          <option value="STUDENT">Student (UG / PG)</option>
                          <option value="FACULTY">Faculty / Teacher</option>
                          <option value="ALUMNI">Alumni Graduate</option>
                          <option value="EMPLOYER">Employer / Industry Partner</option>
                          <option value="PARENT">Parent / Guardian</option>
                          <option value="NON_TEACHING">Administrative Staff</option>
                          <option value="TECHNICAL_STAFF">Technical / Lab Staff</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Branch</label>
                        <select
                          id="select-register-dept"
                          value={regDept}
                          onChange={(e) => setRegDept(e.target.value)}
                          className="w-full bg-white border border-[#fed7aa] rounded-xl px-2.5 py-1.5 min-h-[38px] text-xs text-[#0a192f] focus:outline-hidden focus:border-[#ff7a50] font-medium"
                        >
                          <option value="dept-1">B.Tech Computer Science</option>
                          <option value="dept-2">Mechanical Engineering</option>
                          <option value="dept-3">BCA (Computer Applications)</option>
                          <option value="dept-4">BBA (Business Administration)</option>
                          <option value="dept-5">B.Tech CSE (AI & ML)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-1.5 space-y-2">
                      <button
                        type="submit"
                        id="btn-register-submit"
                        disabled={isSubmitting}
                        className="w-full min-h-[42px] bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-orange-950/20 flex items-center justify-center space-x-1.5"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration & Enter Portal'}</span>
                      </button>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <button
                          type="button"
                          onClick={() => setRegStep(1)}
                          className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                        >
                          ← Back to Step 1
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthModalTab('login');
                            setRegError('');
                            setLoginError('');
                          }}
                          className="text-[#c2410c] font-semibold hover:underline cursor-pointer"
                        >
                          Sign in instead →
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Google Authentication Dialog Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-[#0a192f]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 text-[#0b1a30] my-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                  <GoogleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0a192f]">Google Identity Verification</h3>
                  <p className="text-[10px] text-slate-500">Real Google Account Authentication (OAuth 2.0)</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-700 min-w-[36px] min-h-[36px] flex items-center justify-center text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-3.5 p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
              <p className="font-bold mb-0.5">🔒 Verified Google Account Security:</p>
              <p>
                Only authenticated Google accounts (Gmail or Google Workspace) are permitted. Domain MX records are validated against active Google mail servers.
              </p>
            </div>

            {googleError && (
              <div className="mb-3 p-3 bg-red-50 border-2 border-red-300 text-red-800 text-xs rounded-xl font-medium shadow-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{googleError}</span>
              </div>
            )}

            <form onSubmit={handleGoogleIdentitySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Email Address (Gmail / Institutional)
                </label>
                <input
                  type="email"
                  value={googleModalEmail}
                  onChange={(e) => setGoogleModalEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 min-h-[40px] text-xs text-[#0a192f] placeholder:text-slate-400 focus:outline-hidden focus:border-[#4285F4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={googleModalName}
                  onChange={(e) => setGoogleModalName(e.target.value)}
                  placeholder="e.g. Prof. (Dr.) Susheel Mittal"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 min-h-[40px] text-xs text-[#0a192f] placeholder:text-slate-400 focus:outline-hidden focus:border-[#4285F4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stakeholder Role</label>
                  <select
                    value={googleModalRole}
                    onChange={(e) => setGoogleModalRole(e.target.value as Role)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 min-h-[40px] text-xs text-[#0a192f] focus:outline-hidden focus:border-[#4285F4] font-medium"
                  >
                    <option value="STUDENT">Student (UG / PG)</option>
                    <option value="FACULTY">Faculty / Teacher</option>
                    <option value="ALUMNI">Alumni Graduate</option>
                    <option value="EMPLOYER">Employer / Industry Partner</option>
                    <option value="PARENT">Parent / Guardian</option>
                    <option value="NON_TEACHING">Administrative Staff</option>
                    <option value="TECHNICAL_STAFF">Technical Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={googleModalDept}
                    onChange={(e) => setGoogleModalDept(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 min-h-[40px] text-xs text-[#0a192f] focus:outline-hidden focus:border-[#4285F4] font-medium"
                  >
                    <option value="dept-1">Computer Science & Engineering</option>
                    <option value="dept-2">Mechanical Engineering</option>
                    <option value="dept-3">Civil Engineering</option>
                    <option value="dept-4">MBA & Management Studies</option>
                    <option value="dept-5">Applied Sciences & Humanities</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGoogleSubmitting}
                  className="w-full min-h-[44px] bg-[#4285F4] hover:bg-[#3367d6] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
                >
                  <GoogleIcon className="w-4 h-4 filter brightness-200" />
                  <span>{isGoogleSubmitting ? 'Verifying Google Account...' : 'Verify & Enter with Google'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Role Matrix Modal */}
      <RoleMatrixModal
        isOpen={showRoleMatrix}
        initialRole={selectedRoleForMatrix}
        onClose={() => setShowRoleMatrix(false)}
      />

      {/* Public Action Taken Report (ATR) Portal Modal */}
      <PublicAtrPortalModal
        isOpen={showPublicAtrModal}
        onClose={() => setShowPublicAtrModal(false)}
      />

      {/* Export NAAC ATR / SSR (PDF) Official Modal */}
      <ExportNaacAtrSsrModal
        isOpen={showExportSsrModal}
        onClose={() => setShowExportSsrModal(false)}
        academicYear={landingAcademicYear === 'ay-4' ? 'AY 2025–26' : landingAcademicYear === 'ay-5' ? 'AY 2026–27' : 'AY 2025–26'}
      />

      {/* College Website Importer & Profile Modal */}
      <CollegeWebsiteImporterModal
        isOpen={showCollegeModal}
        onClose={() => setShowCollegeModal(false)}
      />
    </div>
  );
};
