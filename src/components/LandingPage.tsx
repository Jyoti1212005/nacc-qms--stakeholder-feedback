import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StakeholderType, FeedbackAnswer } from '../types';
import { ThreeDTiltCard } from './ThreeDTiltCard';
import { ThreeDQualityOrbit } from './ThreeDQualityOrbit';
import { RoleMatrixModal } from './RoleMatrixModal';
import { PublicAtrPortalModal } from './PublicAtrPortalModal';

export const LandingPage: React.FC = () => {
  const { demoAccounts, demoLogin, login, allRoleDefinitions } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRoleMatrix, setShowRoleMatrix] = useState(false);
  const [showPublicAtrModal, setShowPublicAtrModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Quick Survey Modal State (Direct Feedback Submission without login)
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<StakeholderType>('STUDENT');
  const [selectedSurveyId, setSelectedSurveyId] = useState('form-1');
  const [surveyDept, setSurveyDept] = useState('dept-1');
  const [surveyAnonymous, setSurveyAnonymous] = useState(true);
  const [surveyRatings, setSurveyRatings] = useState<Record<string, number>>({ q1: 5, q2: 4, q3: 5 });
  const [surveyComments, setSurveyComments] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
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
    <div className="min-h-screen bg-linear-to-b from-white via-[#fffaf5] to-[#fff3ea] text-[#0b1a30] flex flex-col selection:bg-[#ff7a50] selection:text-white overflow-x-hidden w-full">
      {/* Top Header - Navy Blue Bar with White & Peach Accents */}
      <header className="border-b border-[#1b3456] bg-[#0a192f] text-white sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#0f2d59] to-[#1e3a8a] border border-[#3b5e8c] flex items-center justify-center text-[#ffa07a] font-bold shadow-md shrink-0">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-white truncate">NAAC-QMS</span>
              <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold bg-[#fff0e6] text-[#c2410c] rounded border border-[#fed7aa] shrink-0">
                QMS 2026
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-blue-200/80 font-medium hidden md:block truncate">
              Continuous Quality Management & Stakeholder Feedback System
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          <button
            onClick={() => setShowPublicAtrModal(true)}
            className="px-2.5 sm:px-3.5 py-2 min-h-[44px] text-xs font-bold bg-[#14325a] hover:bg-[#1b4175] text-blue-100 hover:text-white rounded-xl border border-blue-400/30 transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
            title="NAAC Mandatory Disclosure: Action Taken Report (Metric 1.4.2)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#ffa07a] shrink-0" />
            <span className="hidden md:inline">Public ATR (NAAC 1.4.2)</span>
            <span className="md:hidden">ATR 1.4.2</span>
          </button>
          <button
            onClick={() => {
              setSurveySubmitted(false);
              setShowSurveyModal(true);
            }}
            className="px-2.5 sm:px-3.5 py-2 min-h-[44px] text-xs font-bold bg-[#0f2444] hover:bg-[#16335a] text-[#ffebd9] hover:text-white rounded-xl border border-[#2a4d7d] transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-[#ffa07a] shrink-0" />
            <span className="hidden xs:inline">Quick Feedback</span>
            <span className="xs:hidden">Feedback</span>
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-3 sm:px-4 py-2 min-h-[44px] text-xs font-bold bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-white rounded-xl shadow-md shadow-orange-950/20 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Institutional Login</span>
            <span className="sm:hidden">Login</span>
          </button>
        </div>
      </header>

      {/* Hero Section with Animated 3D Floating Geometry */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 max-w-6xl mx-auto text-center overflow-hidden w-full">
        {/* Animated Background 3D Ambient Orbs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-linear-to-tr from-[#ff7a50]/15 to-[#fed7aa]/25 blur-3xl pointer-events-none animate-float-slow -z-10" />
        <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full bg-linear-to-br from-[#1e3a8a]/10 to-[#ffa07a]/15 blur-3xl pointer-events-none animate-float-reverse -z-10" />

        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4 sm:mb-6 max-w-full">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#fff0e6] border border-[#fed7aa] text-[#c2410c] text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-[#ff7a50] shrink-0" />
            <span className="truncate">Higher Education Quality Assurance & Accreditation Framework</span>
          </div>

          <button
            onClick={() => setShowPublicAtrModal(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all shadow-xs cursor-pointer group"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
            <span>NAAC Metric 1.4.2 Mandatory Website Disclosure • View Verified ATR & QR Seal →</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0a192f] leading-tight max-w-4xl mx-auto">
          Multi-Stakeholder Feedback &{' '}
          <span className="bg-linear-to-r from-[#0a192f] via-[#1e3a8a] to-[#ff7a50] bg-clip-text text-transparent">
            Continuous Quality Improvement.
          </span>
        </h1>

        <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
          A modern full-stack institutional platform designed for Indian Higher Education Institutions to collect structured feedback from <strong className="text-[#0a192f] font-semibold">Students</strong>, <strong className="text-[#0a192f] font-semibold">Teachers & Faculty</strong>, <strong className="text-[#0a192f] font-semibold">Alumni</strong>, <strong className="text-[#0a192f] font-semibold">Employers</strong>, <strong className="text-[#0a192f] font-semibold">Parents</strong>, <strong className="text-[#0a192f] font-semibold">Administrative Staff</strong>, and <strong className="text-[#0a192f] font-semibold">Technical Staff</strong>, pinpoint quality gaps, implement CAPA action plans, and build NAAC-ready Action Taken Reports.
        </p>

        {/* Stakeholder Category Action Grid in 3D Tilt Cards */}
        <div className="mt-8 sm:mt-12 max-w-5xl mx-auto w-full">
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

        {/* Quick Demo Personas - Instant Login in Crisp White Box */}
        <div className="mt-10 sm:mt-14 bg-white rounded-3xl p-4 sm:p-7 border border-[#eddcd2] max-w-5xl mx-auto shadow-xl w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f3e8e0] gap-2">
            <div className="text-left">
              <h2 className="text-sm sm:text-base font-extrabold text-[#0a192f] tracking-tight flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#ff7a50] shrink-0" />
                <span>One-Click Role Switcher (Pre-Seeded Institutional Personas)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any role to immediately sign in and experience the full-stack system from that perspective:
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRoleMatrix(true)}
                className="text-[11px] font-extrabold text-[#0a192f] bg-white hover:bg-[#fff0e6] border border-[#fed7aa] px-3 py-2 min-h-[44px] rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff7a50]" />
                <span>Role Definitions</span>
              </button>
              <span className="self-start sm:self-auto text-[11px] font-bold text-[#c2410c] bg-[#fff0e6] border border-[#fed7aa] px-2.5 py-1 rounded-full">
                {demoAccounts.length} Verified Roles
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-5 text-left">
            {demoAccounts.map((acc) => {
              const isStaff = acc.role === 'NON_TEACHING' || acc.role === 'TECHNICAL_STAFF';
              const isFaculty = acc.role === 'FACULTY';
              const isStudent = acc.role === 'STUDENT';
              const isAdmin = acc.role === 'SUPER_ADMIN' || acc.role === 'IQAC_ADMIN' || acc.role === 'PRINCIPAL';

              let badgeStyle = 'bg-blue-100 text-blue-900 border-blue-300';
              if (isStaff) badgeStyle = 'bg-orange-100 text-orange-900 border-orange-300';
              if (isFaculty) badgeStyle = 'bg-sky-100 text-sky-900 border-sky-300';
              if (isStudent) badgeStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300';
              if (isAdmin) badgeStyle = 'bg-purple-100 text-purple-900 border-purple-300';

              return (
                <button
                  key={acc.id}
                  onClick={() => demoLogin(acc.email)}
                  className="p-3.5 min-h-[44px] rounded-xl bg-[#fffaf5] hover:bg-[#fff0e6] border border-[#fed7aa] hover:border-[#ff7a50] text-left transition-all group flex flex-col justify-between cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-tight ${badgeStyle}`}>
                        {acc.role.replace('_', ' ')}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#ff7a50] group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                    <h3 className="text-xs font-bold text-[#0a192f] group-hover:text-[#c2410c] line-clamp-1">
                      {acc.fullName}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{acc.department}</p>
                  </div>
                  <span className="text-[10px] text-[#ea580c] font-semibold mt-3 flex items-center space-x-1">
                    <span>Sign in as {acc.role.replace('_', ' ')} &rarr;</span>
                  </span>
                </button>
              );
            })}
          </div>
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
                    <label className="block font-bold text-[#0a192f] mb-1">Department / Branch:</label>
                    <select
                      value={surveyDept}
                      onChange={(e) => setSurveyDept(e.target.value)}
                      aria-label="Select Department or Branch"
                      className="w-full p-2 bg-white border border-[#fed7aa] rounded-xl font-medium text-[#0a192f] focus:outline-hidden focus:border-[#ff7a50]"
                    >
                      <option value="dept-1">Computer Science & Engineering</option>
                      <option value="dept-2">Electronics & Communication</option>
                      <option value="dept-3">Mechanical Engineering</option>
                      <option value="dept-4">Management Studies (MBA)</option>
                      <option value="dept-5">Basic Sciences & Humanities</option>
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

      {/* Institutional Login Modal in White & Peach */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-[#0a192f]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#fed7aa] rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 text-[#0b1a30] my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#f3e8e0]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] flex items-center justify-center font-bold shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0a192f]">Institutional Authentication</h3>
                  <p className="text-[10px] text-slate-500">Sign in to your authorized institutional console</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                aria-label="Close login modal"
                className="text-slate-400 hover:text-slate-700 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomLogin} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. iqac@naac-qms.edu"
                  required
                  className="w-full bg-white border border-[#fed7aa] rounded-xl px-3 py-2.5 min-h-[44px] text-xs text-[#0a192f] placeholder:text-slate-400 focus:outline-hidden focus:border-[#ff7a50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-[#fed7aa] rounded-xl px-3 py-2.5 min-h-[44px] text-xs text-[#0a192f] placeholder:text-slate-400 focus:outline-hidden focus:border-[#ff7a50]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] bg-linear-to-r from-[#ff7a50] to-[#f97316] hover:from-[#f0683d] hover:to-[#ea580c] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-orange-950/20 flex items-center justify-center"
                >
                  {isSubmitting ? 'Verifying...' : 'Sign In to Portal'}
                </button>
              </div>

              <div className="p-3 bg-[#fffaf5] rounded-xl border border-[#fed7aa] text-[11px] text-slate-700 space-y-1">
                <p className="font-bold text-[#0a192f]">Pre-Configured Institutional Logins:</p>
                <p>• IQAC Coordinator: <code className="text-[#c2410c] font-bold">iqac@naac-qms.edu</code> / <code>Iqac@123</code></p>
                <p>• Admin Staff: <code className="text-[#c2410c] font-bold">staff.admin@naac-qms.edu</code> / <code>Staff@123</code></p>
                <p>• Teacher / Faculty: <code className="text-[#c2410c] font-bold">faculty.sharma@naac-qms.edu</code> / <code>Faculty@123</code></p>
                <p>• Student: <code className="text-[#c2410c] font-bold">student.arjun@naac-qms.edu</code> / <code>Student@123</code></p>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Role Matrix Modal */}
      <RoleMatrixModal
        isOpen={showRoleMatrix}
        onClose={() => setShowRoleMatrix(false)}
      />

      {/* Public Action Taken Report (ATR) Portal Modal */}
      <PublicAtrPortalModal
        isOpen={showPublicAtrModal}
        onClose={() => setShowPublicAtrModal(false)}
      />
    </div>
  );
};
