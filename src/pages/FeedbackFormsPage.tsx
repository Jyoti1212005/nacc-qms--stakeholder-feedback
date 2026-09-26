import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Plus,
  Star,
  Users,
  Eye,
  Copy,
  Trash2,
  CheckCircle2,
  Lock,
  Calendar,
  Send,
  Sliders,
  FileEdit,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Briefcase,
  Wrench,
  HeartHandshake,
  Building2,
  Search,
  Sparkles,
  Layers,
  HelpCircle,
  Check,
  ChevronRight,
  RefreshCw,
  FolderKanban,
  FileCheck,
  ShieldCheck,
  BarChart3,
  Lightbulb,
  Table,
  CheckSquare,
  Square,
  Zap,
  Filter,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  FeedbackForm,
  QuestionType,
  StakeholderType,
  FeedbackCategory,
  RoleCategoryMapping,
  QuestionTemplate,
} from '../types';
import { ThreeDTiltCard } from '../components/ThreeDTiltCard';

// Stakeholder question bank specification: calibrated questions tailored to distinct tiers

export interface BankQuestion {
  prompt: string;
  parameter: string;
  questionType: QuestionType;
  isRequired: boolean;
  options?: string;
}

export interface BankSection {
  title: string;
  category: string;
  description: string;
  questions: BankQuestion[];
}

export interface StakeholderBankItem {
  type: StakeholderType;
  roleTitle: string;
  iconName: string;
  badge: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  defaultTitle: string;
  defaultDesc: string;
  sections: BankSection[];
}

export const STAKEHOLDER_QUESTION_BANK: Record<StakeholderType, StakeholderBankItem> = {
  STUDENT: {
    type: 'STUDENT',
    roleTitle: 'Students (UG / PG / Doctoral)',
    iconName: 'GraduationCap',
    badge: 'Curricular & Pedagogical Experience',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    accentText: 'text-blue-700',
    defaultTitle: 'Student Curriculum, Teaching-Learning & Campus Experience Feedback 2026-27',
    defaultDesc: 'Comprehensive assessment by enrolled students evaluating syllabus depth, laboratory hands-on learning, faculty pedagogical clarity, continuous internal assessment, and placement guidance.',
    sections: [
      {
        title: 'Section 1: Curriculum Relevance & Course Structure',
        category: 'Curricular Aspects (NAAC Criterion 1)',
        description: 'Assesses syllabus modernity, balance between theory and applied skills, and communication of Course Outcomes (COs).',
        questions: [
          {
            prompt: 'How relevant, modern, and aligned with contemporary industry standards is the current syllabus?',
            parameter: 'Curriculum Relevance',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Are the Course Outcomes (COs) and Program Outcomes (POs) clearly communicated at the start of semester?',
            parameter: 'Outcome-Based Education Clarity',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Availability and diversity of modern professional electives, emerging technology modules, and value-added certifications.',
            parameter: 'Elective Flexibility',
            questionType: 'RATING_STARS',
            isRequired: true,
          },
          {
            prompt: 'Balance between theoretical conceptual rigor and hands-on applied industry applications in courses.',
            parameter: 'Theory-Practical Balance',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 2: Faculty Pedagogical Delivery & Classroom Experience',
        category: 'Teaching-Learning and Evaluation (NAAC Criterion 2)',
        description: 'Measures faculty teaching effectiveness, interactive pedagogical methods, and digital LMS adoption.',
        questions: [
          {
            prompt: 'Effectiveness of faculty in explaining complex concepts with live demonstrations, case studies, and interactive discussions.',
            parameter: 'Teaching Quality',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Regularity and quality of LMS adoption: lecture slides, recorded sessions, digital assignments, and multimedia resources.',
            parameter: 'ICT & LMS Usage',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Faculty punctuality, adherence to syllabus completion schedules, and availability for academic doubt clearing.',
            parameter: 'Faculty Availability',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 3: Laboratory Facilities & Hands-on Coding Infrastructure',
        category: 'Infrastructure and Learning Resources (NAAC Criterion 4)',
        description: 'Audits physical laboratories, specialized software tools, and campus network infrastructure.',
        questions: [
          {
            prompt: 'Adequacy, working condition, and availability of computing systems, specialized software licenses, and lab apparatus.',
            parameter: 'Laboratory Readiness',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'High-speed campus Wi-Fi network coverage and reliability across classrooms, libraries, and laboratories.',
            parameter: 'Campus Internet',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 4: Continuous Internal Evaluation & Examination Fairness',
        category: 'Teaching-Learning and Evaluation (NAAC Criterion 2)',
        description: 'Reviews transparency, objectivity, and turnaround time of internal assessments and assignments.',
        questions: [
          {
            prompt: 'Fairness, transparency, and impartiality in continuous internal assessments, quizzes, and project evaluations.',
            parameter: 'Evaluation Fairness',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Timeliness of sharing internal test results, corrected answer sheets, and constructive guidance for improvement.',
            parameter: 'Assessment Feedback',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 5: Training, Career Mentorship & Student Welfare',
        category: 'Student Support and Progression (NAAC Criterion 5)',
        description: 'Evaluates placement training, proctorial mentoring, and student grievance support systems.',
        questions: [
          {
            prompt: 'Effectiveness of Training & Placement Cell in conducting pre-placement coding bootcamps, aptitude drills, and mock interviews.',
            parameter: 'Placement Preparedness',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Proctorial mentoring support: Faculty mentor guidance on academic hurdles, internships, and mental well-being.',
            parameter: 'Faculty Mentoring',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 6: Qualitative Student Reflection',
        category: 'Institutional Values & Stakeholder Voice (NAAC Criterion 7)',
        description: 'Open-ended suggestions and overall institutional recommendation score from the student perspective.',
        questions: [
          {
            prompt: 'What are the strongest academic or infrastructural highlights of your department?',
            parameter: 'Institutional Strengths',
            questionType: 'TEXT_RESPONSE',
            isRequired: false,
          },
          {
            prompt: 'What specific academic or facility enhancements do you urge the IQAC to implement next?',
            parameter: 'Student Suggestions',
            questionType: 'TEXT_RESPONSE',
            isRequired: false,
          },
          {
            prompt: 'How likely are you to recommend this institution to a friend or prospective student? (0 - 10)',
            parameter: 'Net Promoter Score',
            questionType: 'NPS',
            isRequired: true,
          },
        ],
      },
    ],
  },

  FACULTY: {
    type: 'FACULTY',
    roleTitle: 'Teachers & Faculty (Professors, Asso. & Asst. Profs)',
    iconName: 'BookOpen',
    badge: 'Academic Autonomy & Research Ecosystem',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    accentText: 'text-emerald-700',
    defaultTitle: 'Faculty Curriculum Design Autonomy, Research Ecosystem & Institutional Governance Survey 2026-27',
    defaultDesc: 'Comprehensive assessment by instructional faculty regarding syllabus update autonomy, Board of Studies (BOS) responsiveness, research seed grants, teaching workload equity, smart classroom ICT, and leadership transparency.',
    sections: [
      {
        title: 'Section 1: Curriculum Autonomy, BOS & Syllabus Modernization',
        category: 'Curricular Aspects (NAAC Criterion 1)',
        description: 'Gauges faculty academic freedom to design curricula, revise course outcomes, and participate in academic bodies.',
        questions: [
          {
            prompt: 'Academic autonomy to introduce innovative pedagogical practices, project-based coursework, and emerging technology electives.',
            parameter: 'Academic Autonomy',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Effectiveness of Board of Studies (BOS) and Academic Council in actively integrating faculty inputs into curriculum revisions.',
            parameter: 'BOS Responsiveness',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Adequacy of allotted lecture and tutorial contact hours to cover theoretical concepts and applied mini-projects.',
            parameter: 'Instructional Hours Balance',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 2: Research Facilities, Seed Funding & Scholarly Incentives',
        category: 'Research, Innovations and Extension (NAAC Criterion 3)',
        description: 'Assesses institutional research funding, publication awards, conference travel grants, and patent facilitation.',
        questions: [
          {
            prompt: 'Availability and sanctioning speed of institutional research seed funding grants for faculty investigators.',
            parameter: 'Research Seed Grants',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Attractiveness and prompt disbursement of publication incentive awards for high-impact Scopus/WoS indexed papers.',
            parameter: 'Publication Incentives',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Institutional financial sponsorship and duty leaves for presenting peer-reviewed papers at premier IEEE/ACM conferences.',
            parameter: 'Conference Travel Support',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Support provided by the IPR & Patent Cell for patent prior-art searches, application filing, and technology transfer.',
            parameter: 'IPR & Patent Support',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 3: Workload Balance & Smart Classroom Infrastructure',
        category: 'Teaching-Learning & Infrastructure (NAAC Criterion 2 & 4)',
        description: 'Evaluates balance in contact hours versus administrative duties and reliable maintenance of smart lecture halls.',
        questions: [
          {
            prompt: 'Fairness and equity in the allocation of teaching contact hours, administrative committee duties, and exam invigilation.',
            parameter: 'Faculty Workload Balance',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Reliability and prompt maintenance of smart interactive boards, multimedia projectors, and podium audio systems in lecture halls.',
            parameter: 'Classroom ICT Readiness',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Speed of procurement for specialized laboratory equipment, research consumables, and computational licenses.',
            parameter: 'Lab Procurement',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 4: Academic Governance, Leadership & IQAC Support',
        category: 'Governance, Leadership and Management (NAAC Criterion 6)',
        description: 'Measures IQAC guidance on accreditation, outcome-based education (OBE) course files, and department leadership support.',
        questions: [
          {
            prompt: 'Clarity and timeliness of IQAC guidance on NAAC/NBA documentation, course files, and Outcome-Based Education (OBE) mapping.',
            parameter: 'IQAC Accreditation Support',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Encouragement and financial sponsorship for attending National Faculty Development Programmes (FDPs) and pedagogical workshops.',
            parameter: 'FDP Sponsorship',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Openness, accessibility, and constructive mentorship received from Department Heads, Deans, and Principal.',
            parameter: 'Leadership Support',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 5: Qualitative Faculty Input & Institutional Suggestions',
        category: 'Institutional Values & Best Practices (NAAC Criterion 7)',
        description: 'Qualitative recommendations from faculty members to elevate university rankings and research productivity.',
        questions: [
          {
            prompt: 'What specific institutional reforms, workload rebalancing, or lab investments would significantly elevate your teaching and research output?',
            parameter: 'Faculty Recommendations',
            questionType: 'TEXT_RESPONSE',
            isRequired: false,
          },
        ],
      },
    ],
  },

  NON_TEACHING: {
    type: 'NON_TEACHING',
    roleTitle: 'Administrative & Non-Teaching Staff',
    iconName: 'ClipboardList',
    badge: 'Operations, ERP & Workplace Welfare',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    accentText: 'text-amber-700',
    defaultTitle: 'Non-Teaching Staff Administrative Operations, ERP Software & Workplace Climate Survey',
    defaultDesc: 'Annual audit by administrative officers, accountants, superintendents, and clerks on ERP automation, office ergonomics, inter-departmental SOPs, and employee welfare.',
    sections: [
      {
        title: 'Section 1: Administrative ERP, Software & Digital Office Automation',
        category: 'Governance, Leadership and Management (NAAC Criterion 6)',
        description: 'Assesses digital automation, institutional ERP performance, and paperless administrative workflows.',
        questions: [
          {
            prompt: 'User-friendliness, processing speed, and uptime of institutional ERP software for admissions, fee collection, and student records.',
            parameter: 'Administrative ERP Efficiency',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Adequacy and operational speed of high-speed desktop PCs, network scanners, and document digitizers in administrative branches.',
            parameter: 'Office IT Equipment',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 2: Office Infrastructure, Ergonomics & Physical Environment',
        category: 'Infrastructure and Learning Resources (NAAC Criterion 4)',
        description: 'Evaluates physical workplace comfort, climate control, and record archiving infrastructure.',
        questions: [
          {
            prompt: 'Adequacy of office infrastructure: ergonomic seating, air conditioning, document archiving racks, and drinking water facilities.',
            parameter: 'Office Infrastructure',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 3: Standard Operating Procedures (SOPs) & Coordination',
        category: 'Governance, Leadership and Management (NAAC Criterion 6)',
        description: 'Measures procedural clarity and cooperation between academic departments and admin divisions.',
        questions: [
          {
            prompt: 'Clarity of institutional standard operating procedures (SOPs) and mutual cooperation between academic departments and administrative offices.',
            parameter: 'Inter-departmental Coordination',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Reasonableness of administrative workload distribution and turnaround time expectations during peak admission and exam cycles.',
            parameter: 'Workload Balance',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 4: Staff Welfare, Healthcare & Grievance Redressal',
        category: 'Governance, Leadership and Management (NAAC Criterion 6)',
        description: 'Reviews medical cover, performance appraisal fairness, and grievance committee responsiveness.',
        questions: [
          {
            prompt: 'Adequacy of group medical insurance coverage, annual employee health check-up camps, and provident fund administration.',
            parameter: 'Staff Welfare & Insurance',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Fairness, transparency, and timeliness in conducting annual performance appraisals and merit promotion opportunities.',
            parameter: 'Appraisal & Career Growth',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Accessibility, confidentiality, and promptness of the Staff Grievance Redressal Committee in resolving workplace concerns.',
            parameter: 'Staff Grievance Redressal',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
    ],
  },

  TECHNICAL_STAFF: {
    type: 'TECHNICAL_STAFF',
    roleTitle: 'Technical & Laboratory Staff (Lab Instructors & System Admins)',
    iconName: 'Wrench',
    badge: 'Lab Safety & Equipment Maintenance',
    accentBg: 'bg-purple-50',
    accentBorder: 'border-purple-200',
    accentText: 'text-purple-700',
    defaultTitle: 'Technical & Laboratory Staff Safety Protocols & Equipment Maintenance Survey',
    defaultDesc: 'Rigorous appraisal by laboratory superintendents, system administrators, and workshop instructors on machine calibration, hazard containment, and technical upskilling.',
    sections: [
      {
        title: 'Section 1: Laboratory Safety & Emergency Preparedness Protocols',
        category: 'Infrastructure and Learning Resources (NAAC Criterion 4)',
        description: 'Reviews fire safety devices, chemical hazard handling, and electrical earthing inspections in labs.',
        questions: [
          {
            prompt: 'Adequacy of laboratory safety standards: Fire extinguishers, first-aid kits, chemical hazard containment, and earth leakage breakers.',
            parameter: 'Laboratory Safety & Protocols',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Regularity of fire safety drills, emergency evacuation signage, and periodic electrical insulation testing in machinery labs.',
            parameter: 'Safety Drills & Audits',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 2: Equipment Maintenance, Consumables & Calibration Budget',
        category: 'Infrastructure and Learning Resources (NAAC Criterion 4)',
        description: 'Examines speed of fund approvals for component spares, preventive servicing, and instrument calibration.',
        questions: [
          {
            prompt: 'Speed of budget sanctioning for laboratory consumables, replacement components, specialized tooling, and equipment calibration.',
            parameter: 'Equipment Maintenance & Spares',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 3: Technical Staff Professional Upskilling & Training',
        category: 'Governance, Leadership and Management (NAAC Criterion 6)',
        description: 'Evaluates hands-on technical training opportunities for staff on emerging technologies and tools.',
        questions: [
          {
            prompt: 'Institutional financial sponsorship for technical staff to attend skill-upgradation workshops on modern instruments, IoT, and cloud computing.',
            parameter: 'Technical Staff Upskilling',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
    ],
  },

  EMPLOYER: {
    type: 'EMPLOYER',
    roleTitle: 'Corporate Employers & Industry Advisory',
    iconName: 'Building2',
    badge: 'Industry Readiness & Skill Alignment',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    accentText: 'text-orange-700',
    defaultTitle: 'Employer & Industry Advisory Feedback 2026-27',
    defaultDesc: 'Assessment by corporate recruiters and industry partners regarding student competencies, soft skills, technical readiness, modern tooling, and professional work ethics.',
    sections: [
      {
        title: 'Section 1: Technical Aptitude & Core Engineering Competencies',
        category: 'Curricular Aspects (NAAC Criterion 1)',
        description: 'Evaluates algorithmic problem solving, coding proficiency, and modern frameworks knowledge.',
        questions: [
          {
            prompt: 'Foundational technical competence, algorithmic proficiency, and analytical problem-solving capability of campus recruits.',
            parameter: 'Technical Competence',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Hands-on familiarity with modern industry frameworks, cloud platforms (AWS/GCP), version control (Git), and DevOps pipelines.',
            parameter: 'Modern Tooling Familiarity',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 2: Professional Soft Skills, Team Dynamics & Communication',
        category: 'Student Support and Progression (NAAC Criterion 5)',
        description: 'Gauges business presentation skills, verbal clarity, and adaptability in multi-disciplinary teams.',
        questions: [
          {
            prompt: 'Clarity in business written and verbal communication, executive presentation readiness, and client-facing confidence.',
            parameter: 'Soft Skills & Communication',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Ability to work collaboratively in diverse, cross-functional agile teams and adapt quickly to shifting corporate project requirements.',
            parameter: 'Teamwork & Adaptability',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 3: Professional Ethics & Industry Alignment Suggestions',
        category: 'Institutional Values and Best Practices (NAAC Criterion 7)',
        description: 'Assesses corporate accountability and gathers recommendations for syllabus modifications.',
        questions: [
          {
            prompt: 'Workplace discipline, professional integrity, accountability, and adherence to corporate ethical standards.',
            parameter: 'Professional Ethics',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'What cutting-edge technical skills, industry certifications, or coursework should the college integrate into the curriculum?',
            parameter: 'Industry Curriculum Recommendations',
            questionType: 'TEXT_RESPONSE',
            isRequired: false,
          },
        ],
      },
    ],
  },

  ALUMNI: {
    type: 'ALUMNI',
    roleTitle: 'Alumni Network & Graduated Professionals',
    iconName: 'HeartHandshake',
    badge: 'Long-term Degree Value & Mentorship',
    accentBg: 'bg-cyan-50',
    accentBorder: 'border-cyan-200',
    accentText: 'text-cyan-700',
    defaultTitle: 'Alumni Institutional Impact & Career Progression Survey',
    defaultDesc: 'Long-term reflection on education quality, career progression assistance, and suggestions for curriculum updates from graduated alumni.',
    sections: [
      {
        title: 'Section 1: Long-term Career Impact & Degree Relevance',
        category: 'Curricular Aspects & Progression (NAAC Criterion 1 & 5)',
        description: 'Assesses whether the academic degree provided a solid launchpad for corporate advancement.',
        questions: [
          {
            prompt: 'How effectively did the institutional curriculum and practical labs prepare you for corporate technical challenges and long-term career growth?',
            parameter: 'Career Preparation',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Rigor of foundational engineering principles and problem-solving habits cultivated during your degree program.',
            parameter: 'Foundational Rigor',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 2: Alumni Engagement & Student Mentorship',
        category: 'Governance, Leadership and Management (NAAC Criterion 6)',
        description: 'Evaluates the vibrancy of alumni chapters and opportunities to mentor current students.',
        questions: [
          {
            prompt: 'Vibrancy and effectiveness of the Alumni Association in maintaining active regional chapters and professional networking opportunities.',
            parameter: 'Alumni Engagement',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Opportunities provided by the college for alumni to conduct guest lectures, mentor student capstone projects, and assist campus hiring.',
            parameter: 'Alumni Mentorship Outreach',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
    ],
  },

  PARENT: {
    type: 'PARENT',
    roleTitle: 'Parents & Guardians',
    iconName: 'Users',
    badge: 'Campus Safety & Holistic Growth',
    accentBg: 'bg-rose-50',
    accentBorder: 'border-rose-200',
    accentText: 'text-rose-700',
    defaultTitle: 'Parent / Guardian Feedback on Campus Ecosystem 2026-27',
    defaultDesc: 'Evaluation of student safety, anti-ragging discipline, hostel facilities, mentoring, and academic progress updates by parents and guardians.',
    sections: [
      {
        title: 'Section 1: Campus Safety, Anti-Ragging & Hostel Discipline',
        category: 'Institutional Values and Best Practices (NAAC Criterion 7)',
        description: 'Examines campus security protocols, residential hostel food quality, and disciplinary standards.',
        questions: [
          {
            prompt: 'Safety, security, and strict anti-ragging measures enforced across the college campus, academic blocks, and student hostels.',
            parameter: 'Campus Safety',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Cleanliness, hygienic food, and security discipline maintained in student residential hostels and campus dining areas.',
            parameter: 'Hostel Amenities',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
      {
        title: 'Section 2: Academic Progress Alerts & Faculty Mentor Communication',
        category: 'Governance & Student Support (NAAC Criterion 6 & 5)',
        description: 'Measures regularity of attendance updates, examination alerts, and proctor accessibility.',
        questions: [
          {
            prompt: 'Regularity, clarity, and promptness of college communication regarding your ward attendance, internal test marks, and fees.',
            parameter: 'Parent Communication',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Accessibility and constructive guidance provided by the assigned faculty proctor / mentor during parent-teacher interactions.',
            parameter: 'Mentor Accessibility',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
          {
            prompt: 'Overall holistic personality development and career readiness instilled in your ward relative to the educational fee paid.',
            parameter: 'Overall Institutional Value',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
    ],
  },

  INDUSTRY_PARTNER: {
    type: 'INDUSTRY_PARTNER',
    roleTitle: 'Industry Partners & MoU Collaborators',
    iconName: 'Briefcase',
    badge: 'MoU & Co-Innovation Impact',
    accentBg: 'bg-indigo-50',
    accentBorder: 'border-indigo-200',
    accentText: 'text-indigo-700',
    defaultTitle: 'Industry Partner Collaboration & Technology Transfer Survey 2026-27',
    defaultDesc: 'Feedback on industry-academia joint research projects, MoU execution efficiency, and internship talent conversion.',
    sections: [
      {
        title: 'Section 1: Joint Research & MoU Deliverables',
        category: 'Research, Innovations and Extension (NAAC Criterion 3)',
        description: 'Evaluates joint patent applications, technology transfer, and institutional responsiveness.',
        questions: [
          {
            prompt: 'Institutional speed and administrative agility in executing MoU commitments, joint patents, and consultancy contracts.',
            parameter: 'MoU Execution Agility',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
    ],
  },

  ACADEMIC_EXPERT: {
    type: 'ACADEMIC_EXPERT',
    roleTitle: 'Academic Experts & Peer Reviewers',
    iconName: 'GraduationCap',
    badge: 'Peer Review & Quality Audit',
    accentBg: 'bg-teal-50',
    accentBorder: 'border-teal-200',
    accentText: 'text-teal-700',
    defaultTitle: 'External Academic Peer Review & Quality Audit Survey',
    defaultDesc: 'Independent peer review of curriculum rigor, examination evaluation standards, and faculty research vitality.',
    sections: [
      {
        title: 'Section 1: Academic Rigor & Evaluation Integrity',
        category: 'Teaching-Learning and Evaluation (NAAC Criterion 2)',
        description: 'Independent evaluation of examination question paper quality and Blooms Taxonomy mapping.',
        questions: [
          {
            prompt: 'Degree of compliance with higher-order thinking (Blooms Taxonomy Levels 4-6) in semester question papers.',
            parameter: 'Blooms Taxonomy Compliance',
            questionType: 'LIKERT_SCALE',
            isRequired: true,
          },
        ],
      },
    ],
  },
};

// Category icon renderer helper

const renderCategoryIcon = (iconName: string, className = "w-4 h-4 text-[#ff7a50]") => {
  switch (iconName) {
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'ClipboardList':
      return <ClipboardList className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Sliders':
      return <Sliders className={className} />;
    default:
      return <FolderKanban className={className} />;
  }
};

// Bilingual translation dictionary (Hindi / English) for vernacular survey accessibility

const HINDI_TRANSLATION_MAP: Record<string, string> = {
  'How relevant, modern, and aligned with contemporary industry standards is the current syllabus?':
    'वर्तमान पाठ्यक्रम समकालीन उद्योग मानकों के साथ कितना प्रासंगिक, आधुनिक और संरेखित है?',
  'Are the Course Outcomes (COs) and Program Outcomes (POs) clearly communicated at the start of semester?':
    'क्या सेमेस्टर की शुरुआत में पाठ्यक्रम परिणाम (COs) और कार्यक्रम परिणाम (POs) स्पष्ट रूप से संप्रेषित किए गए हैं?',
  'Balance between theoretical conceptual rigor and hands-on applied industry applications in courses.':
    'पाठ्यक्रमों में सैद्धांतिक वैचारिक कठोरता और व्यावहारिक व्यावहारिक उद्योग अनुप्रयोगों के बीच संतुलन।',
  'Effectiveness of Training & Placement Cell in organizing pre-placement aptitude tests and industry technical mock interviews.':
    'प्लेसमेंट से पहले योग्यता परीक्षण और उद्योग तकनीकी मॉक साक्षात्कार आयोजित करने में प्रशिक्षण और प्लेसमेंट सेल की प्रभावशीलता।',
  'Accessibility of the Student Grievance Redressal Committee and speed of resolving submitted academic and hostel concerns.':
    'छात्र शिकायत निवारण समिति की सुलभता और प्रस्तुत शैक्षणिक व छात्रावास चिंताओं के समाधान की गति।',
  'Operational reliability of smart interactive boards, multimedia projectors, and high-speed campus Wi-Fi in lecture halls.':
    'व्याख्यान कक्षों में स्मार्ट इंटरैक्टिव बोर्ड, मल्टीमीडिया प्रोजेक्टर और उच्च गति वाले परिसर वाई-फाई की विश्वसनीयता।',
  'Freedom and administrative support provided to faculty members to introduce modern pedagogical methodologies, active learning, and case-study discussions.':
    'संकाय सदस्यों को आधुनिक शिक्षण पद्धतियों, सक्रिय शिक्षण और केस-स्टडी चर्चाओं को शुरू करने के लिए दी जाने वाली स्वतंत्रता और प्रशासनिक सहायता।',
  'Adequacy and disbursement speed of institutional faculty research seed grants, publication incentive rewards, and conference registration sponsorship.':
    'संस्थान के संकाय अनुसंधान बीज अनुदान, प्रकाशन प्रोत्साहन पुरस्कार और सम्मेलन पंजीकरण प्रायोजन की पर्याप्तता और वितरण की गति।',
  'Institutional financial sponsorship for technical staff to attend skill-upgradation workshops on modern instruments, IoT, and cloud computing.':
    'आधुनिक उपकरणों, IoT और क्लाउड कंप्यूटिंग पर कौशल-उन्नयन कार्यशालाओं में भाग लेने के लिए तकनीकी कर्मचारियों के लिए संस्थागत वित्तीय प्रायोजन।',
  'Foundational technical competence, algorithmic proficiency, and analytical problem-solving capability of campus recruits.':
    'परिसर में भर्ती हुए छात्रों की मूलभूत तकनीकी क्षमता, एल्गोरिदमिक दक्षता और विश्लेषणात्मक समस्या-समाधान क्षमता।',
  'Clarity in business written and verbal communication, executive presentation readiness, and client-facing confidence.':
    'व्यावसायिक लिखित और मौखिक संचार में स्पष्टता, कार्यकारी प्रस्तुति तत्परता और ग्राहकों के सामने आत्मविश्वास।',
  'Workplace discipline, professional integrity, accountability, and adherence to corporate ethical standards.':
    'कार्यस्थल अनुशासन, पेशेवर निष्ठा, जवाबदेही और कॉर्पोरेट नैतिक मानकों का पालन।',
  'Rate the modern infrastructure of computer labs and campus Wi-Fi.':
    'कंप्यूटर प्रयोगशालाओं और परिसर वाई-फाई के आधुनिक बुनियादी ढांचे का मूल्यांकन करें।',
  'Speed of budget sanctioning for laboratory consumables, replacement components, specialized tooling, and equipment calibration.':
    'प्रयोगशाला उपभोग्य सामग्रियों, प्रतिस्थापन घटकों, विशेष टूलींग और उपकरण अंशांकन के लिए बजट स्वीकृति की गति।'
};

// Main feedback forms and survey orchestration view

export const FeedbackFormsPage: React.FC = () => {
  const { selectedAcademicYear, showToast, triggerRefresh } = useApp();
  const { currentUser, hasPermission } = useAuth();

  const [activeTab, setActiveTab] = useState<'surveys' | 'dynamic-service' | 'question-bank' | 'builder'>('surveys');
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Role-Category Builder Service State
  const [dynCategories, setDynCategories] = useState<FeedbackCategory[]>([]);
  const [dynRoleMappings, setDynRoleMappings] = useState<
    (RoleCategoryMapping & { category?: FeedbackCategory; categoryName?: string; questionCount: number })[]
  >([]);
  const [dynTemplates, setDynTemplates] = useState<QuestionTemplate[]>([]);
  const [selectedDynamicRole, setSelectedDynamicRole] = useState<string>(
    currentUser?.role && ['FACULTY', 'STUDENT', 'NON_TEACHING', 'TECHNICAL_STAFF', 'EMPLOYER', 'ALUMNI', 'PARENT'].includes(currentUser.role)
      ? currentUser.role
      : 'FACULTY'
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [dynSurveyTitle, setDynSurveyTitle] = useState('');
  const [dynSurveyDesc, setDynSurveyDesc] = useState('');
  const [dynAllowAnonymous, setDynAllowAnonymous] = useState(true);
  const [dynAutoPublish, setDynAutoPublish] = useState(false);
  const [isGeneratingDyn, setIsGeneratingDyn] = useState(false);
  const [lastGeneratedResult, setLastGeneratedResult] = useState<{
    form: FeedbackForm;
    mappedCategories: any[];
    questionCount: number;
    role: string;
  } | null>(null);
  const [showDynSuccessModal, setShowDynSuccessModal] = useState(false);
  const [dynTemplateSearch, setDynTemplateSearch] = useState('');
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);
  const [showAddCustomTemplateModal, setShowAddCustomTemplateModal] = useState(false);
  const [customTemplateForm, setCustomTemplateForm] = useState({
    categoryId: 'cat-pedagogy',
    prompt: '',
    parameter: '',
    questionType: 'LIKERT_SCALE' as QuestionType,
    naacMetricRef: 'NAAC 2.3.1',
  });

  // Question Bank Tab State
  const [bankSelectedStakeholder, setBankSelectedStakeholder] = useState<StakeholderType>('STUDENT');
  const [bankSearchQuery, setBankSearchQuery] = useState('');

  // Survey Taking Modal State
  const [activeTakingForm, setActiveTakingForm] = useState<FeedbackForm | null>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [surveyLanguage, setSurveyLanguage] = useState<'en' | 'hi'>('en');

  // Form Builder State
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormCode, setNewFormCode] = useState('');
  const [newFormDesc, setNewFormDesc] = useState('');
  const [newFormTarget, setNewFormTarget] = useState<StakeholderType>('STUDENT');
  const [newFormAnonymous, setNewFormAnonymous] = useState(true);
  const [builderQuestions, setBuilderQuestions] = useState<
    { sectionTitle: string; prompt: string; parameter: string; questionType: QuestionType; isRequired: boolean; options: string }[]
  >([]);

  // Function to load questions for a given stakeholder into the Form Builder
  const loadStakeholderTemplateIntoBuilder = (target: StakeholderType) => {
    const bankItem = STAKEHOLDER_QUESTION_BANK[target] || STAKEHOLDER_QUESTION_BANK.STUDENT;
    setNewFormTarget(target);
    setNewFormTitle(bankItem.defaultTitle);
    setNewFormDesc(bankItem.defaultDesc);
    setNewFormCode(`FB-${target.slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`);

    const flattened: { sectionTitle: string; prompt: string; parameter: string; questionType: QuestionType; isRequired: boolean; options: string }[] = [];
    bankItem.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        flattened.push({
          sectionTitle: sec.title,
          prompt: q.prompt,
          parameter: q.parameter,
          questionType: q.questionType,
          isRequired: q.isRequired,
          options: q.options || '',
        });
      });
    });

    setBuilderQuestions(flattened);
    showToast(`Loaded ${flattened.length} role-specific questions for ${bankItem.roleTitle}!`, 'info');
  };

  // Initialize Form Builder with student questions on first mount
  useEffect(() => {
    if (builderQuestions.length === 0) {
      loadStakeholderTemplateIntoBuilder('STUDENT');
    }
  }, []);

  const loadForms = () => {
    setIsLoading(true);
    fetch(`/api/feedback/forms?academicYearId=${selectedAcademicYear}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setForms(data);
      })
      .catch((err) => console.error('Forms error:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadForms();
  }, [selectedAcademicYear]);

  // Load Dynamic Builder data (categories, role mappings, question templates)
  const loadDynamicBuilderData = async () => {
    try {
      const [catsRes, mapsRes, tplsRes] = await Promise.all([
        fetch('/api/feedback/dynamic-builder/categories'),
        fetch('/api/feedback/dynamic-builder/role-mappings'),
        fetch('/api/feedback/dynamic-builder/templates'),
      ]);
      if (catsRes.ok) {
        const cats = await catsRes.json();
        setDynCategories(cats);
      }
      if (mapsRes.ok) {
        const maps = await mapsRes.json();
        setDynRoleMappings(maps);
      }
      if (tplsRes.ok) {
        const tpls = await tplsRes.json();
        setDynTemplates(tpls);
      }
    } catch (e) {
      console.error('Failed to load dynamic builder data:', e);
    }
  };

  useEffect(() => {
    loadDynamicBuilderData();
  }, []);

  // Synchronize category selection and survey title/description when selectedDynamicRole changes
  useEffect(() => {
    const roleMappings = dynRoleMappings.filter((m) => m.role === selectedDynamicRole);
    const catIds = roleMappings.map((m) => m.categoryId);
    setSelectedCategoryIds(catIds);
    setExpandedCategoryIds(catIds);

    const roleName =
      selectedDynamicRole === 'FACULTY'
        ? 'Faculty Pedagogical Delivery & Autonomy'
        : selectedDynamicRole === 'STUDENT'
        ? 'Student Campus Infrastructure & Academic Experience'
        : selectedDynamicRole === 'NON_TEACHING'
        ? 'Administrative Operations, ERP & Staff Welfare'
        : selectedDynamicRole === 'TECHNICAL_STAFF'
        ? 'Technical Staff Laboratory Safety & Consumables Maintenance'
        : selectedDynamicRole === 'EMPLOYER'
        ? 'Corporate Employer Technical Competency & Ethics'
        : selectedDynamicRole === 'ALUMNI'
        ? 'Alumni Long-term Career Impact & Curriculum Relevance'
        : selectedDynamicRole === 'PARENT'
        ? 'Parent Institutional Safety, Ward Mentorship & Hostel Hygiene'
        : `${selectedDynamicRole} Stakeholder Quality`;

    const ayText = selectedAcademicYear === 'ay-5' ? '2026-27' : selectedAcademicYear;
    setDynSurveyTitle(`${roleName} Survey (${ayText})`);
    setDynSurveyDesc(
      `Calibrated multi-section questionnaire dynamically generated via the Role-to-Category Relationship Table for ${selectedDynamicRole}. Directly aligned with NAAC Criteria assessment.`
    );
  }, [selectedDynamicRole, dynRoleMappings, selectedAcademicYear]);

  // Generate Dynamic Survey via Relationship Table
  const handleGenerateDynamicSurvey = async () => {
    if (!selectedDynamicRole) return;
    setIsGeneratingDyn(true);
    try {
      const res = await fetch('/api/feedback/dynamic-builder/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: selectedDynamicRole,
          selectedCategoryIds,
          academicYearId: selectedAcademicYear,
          title: dynSurveyTitle,
          description: dynSurveyDesc,
          allowAnonymous: dynAllowAnonymous,
          autoPublish: dynAutoPublish,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLastGeneratedResult(data);
        setShowDynSuccessModal(true);
        showToast(
          `Dynamic survey generated! (${data.questionCount} questions filtered across ${data.mappedCategories.length} categories)`,
          'success'
        );
        loadForms();
        triggerRefresh();
      } else {
        showToast('Failed to generate dynamic survey', 'error');
      }
    } catch (e) {
      console.error('Error generating dynamic survey:', e);
      showToast('Error generating dynamic survey', 'error');
    } finally {
      setIsGeneratingDyn(false);
    }
  };

  // Add Custom Template
  const handleCreateCustomTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTemplateForm.prompt || !customTemplateForm.parameter) return;

    try {
      const res = await fetch('/api/feedback/dynamic-builder/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: customTemplateForm.categoryId,
          applicableRoles: [selectedDynamicRole],
          prompt: customTemplateForm.prompt,
          parameter: customTemplateForm.parameter,
          questionType: customTemplateForm.questionType,
          naacMetricRef: customTemplateForm.naacMetricRef,
          isRequired: true,
        }),
      });
      if (res.ok) {
        showToast('New question template added to category bank!', 'success');
        setShowAddCustomTemplateModal(false);
        setCustomTemplateForm({
          categoryId: 'cat-pedagogy',
          prompt: '',
          parameter: '',
          questionType: 'LIKERT_SCALE',
          naacMetricRef: 'NAAC 2.3.1',
        });
        loadDynamicBuilderData();
      }
    } catch (err) {
      console.error('Failed to create template:', err);
    }
  };

  // Handle survey submission
  const handleSubmitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTakingForm) return;

    setIsSubmitting(true);
    const answersPayload: any[] = [];
    activeTakingForm.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        const val = answers[q.id];
        if (q.questionType === 'LIKERT_SCALE' || q.questionType === 'RATING_STARS' || q.questionType === 'NUMERIC_SCORE') {
          answersPayload.push({
            questionId: q.id,
            scoreValue: typeof val === 'number' ? val : 4,
          });
        } else if (q.questionType === 'TEXT_RESPONSE') {
          answersPayload.push({
            questionId: q.id,
            textValue: val || '',
          });
        } else if (q.questionType === 'NPS') {
          answersPayload.push({
            questionId: q.id,
            scoreValue: typeof val === 'number' ? (val / 2) : 4.5,
          });
        } else {
          answersPayload.push({
            questionId: q.id,
            optionValues: val ? [val] : ['Satisfactory'],
          });
        }
      });
    });

    try {
      const res = await fetch('/api/feedback/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: activeTakingForm.id,
          academicYearId: selectedAcademicYear,
          departmentId: currentUser?.departmentId || 'dept-1',
          isAnonymous,
          stakeholderType: activeTakingForm.targetType,
          userId: currentUser?.id,
          answers: answersPayload,
        }),
      });

      if (res.ok) {
        showToast('Feedback submitted successfully! Thank you for your contribution.', 'success');
        setActiveTakingForm(null);
        setAnswers({});
        loadForms();
        triggerRefresh();
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form Builder submit: Group questions by sectionTitle into proper sections
  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormTitle) return;

    // Group builderQuestions by sectionTitle
    const sectionsMap = new Map<string, typeof builderQuestions>();
    builderQuestions.forEach((q) => {
      const secName = q.sectionTitle.trim() || 'Section 1: General Quality Evaluation';
      if (!sectionsMap.has(secName)) {
        sectionsMap.set(secName, []);
      }
      sectionsMap.get(secName)!.push(q);
    });

    const sectionsPayload = Array.from(sectionsMap.entries()).map(([secTitle, qList], secIdx) => ({
      id: `sec-${Date.now()}-${secIdx + 1}`,
      title: secTitle,
      category: 'Curricular & Institutional Quality',
      orderIndex: secIdx + 1,
      questions: qList.map((q, qIdx) => ({
        id: `q-${Date.now()}-${secIdx}-${qIdx}`,
        prompt: q.prompt,
        parameter: q.parameter,
        questionType: q.questionType,
        category: 'Academic Quality',
        isRequired: q.isRequired,
        orderIndex: qIdx + 1,
        scaleMax: q.questionType === 'NPS' ? 10 : 5,
        options: q.options ? q.options.split(',').map((s) => s.trim()) : undefined,
      })),
    }));

    const payload = {
      title: newFormTitle,
      code: newFormCode || `FB-${newFormTarget.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      description: newFormDesc,
      targetType: newFormTarget,
      academicYearId: selectedAcademicYear,
      allowAnonymous: newFormAnonymous,
      sections: sectionsPayload,
    };

    try {
      const res = await fetch('/api/feedback/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast('New multi-section dynamic feedback form created successfully!', 'success');
        setActiveTab('surveys');
        loadForms();
      }
    } catch (err) {
      console.error('Failed to create form:', err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/forms/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        showToast('Form duplicated successfully!', 'success');
        loadForms();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/forms/${id}/publish`, { method: 'POST' });
      if (res.ok) {
        showToast('Form published and made active for stakeholders!', 'success');
        loadForms();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredForms = forms.filter((f) => (filterType === 'all' ? true : f.targetType === filterType));

  const getTargetLabel = (type: string) => {
    switch (type) {
      case 'STUDENT':
        return '🎓 Student Survey';
      case 'FACULTY':
        return '👨‍🏫 Teacher & Faculty Survey';
      case 'NON_TEACHING':
        return '📋 Admin Staff Survey';
      case 'TECHNICAL_STAFF':
        return '🔬 Technical Lab Staff Survey';
      case 'ALUMNI':
        return '🤝 Alumni Survey';
      case 'EMPLOYER':
        return '🏢 Employer Survey';
      case 'PARENT':
        return '👨‍👩‍👦 Parent Survey';
      default:
        return type;
    }
  };

  // Helper for stakeholder icon in tabs
  const renderStakeholderIcon = (type: StakeholderType, className: string = 'w-4 h-4') => {
    switch (type) {
      case 'STUDENT':
        return <GraduationCap className={className} />;
      case 'FACULTY':
        return <BookOpen className={className} />;
      case 'NON_TEACHING':
        return <ClipboardList className={className} />;
      case 'TECHNICAL_STAFF':
        return <Wrench className={className} />;
      case 'EMPLOYER':
        return <Building2 className={className} />;
      case 'ALUMNI':
        return <HeartHandshake className={className} />;
      case 'PARENT':
        return <Users className={className} />;
      default:
        return <HelpCircle className={className} />;
    }
  };

  // Computed questions for Question Bank filter
  const currentBankItem = STAKEHOLDER_QUESTION_BANK[bankSelectedStakeholder] || STAKEHOLDER_QUESTION_BANK.STUDENT;
  const filteredBankSections = currentBankItem.sections
    .map((sec) => {
      const matchedQuestions = sec.questions.filter(
        (q) =>
          !bankSearchQuery ||
          q.prompt.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
          q.parameter.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
          sec.title.toLowerCase().includes(bankSearchQuery.toLowerCase())
      );
      return {
        ...sec,
        questions: matchedQuestions,
      };
    })
    .filter((sec) => sec.questions.length > 0);

  // Total questions in bank for current stakeholder
  const totalQuestionsInBank = currentBankItem.sections.reduce((acc, s) => acc + s.questions.length, 0);

  return (
    <div className="space-y-6">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#0a192f] text-[#ff7a50] rounded uppercase tracking-wider">
              Feedback Engine
            </span>
            <span className="text-xs text-slate-400">• Role-Differentiated Surveys</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a192f] tracking-tight mt-1">
            Stakeholder Feedback & Survey Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-specific question sets for Students, Teachers & Faculty, Non-Teaching Staff, Technical Teams, Employers, Alumni, and Parents.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('surveys')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'surveys' ? 'bg-white text-[#0a192f] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Surveys ({forms.length})
          </button>

          <button
            onClick={() => setActiveTab('dynamic-service')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'dynamic-service'
                ? 'bg-gradient-to-r from-[#0a192f] to-[#1e3a8a] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#ff7a50]" />
            <span>Dynamic Form Builder</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'dynamic-service' ? 'bg-[#ff7a50] text-white' : 'bg-amber-100 text-amber-900'
            }`}>
              Role Mapping
            </span>
          </button>

          <button
            onClick={() => setActiveTab('question-bank')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'question-bank'
                ? 'bg-white text-[#0a192f] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-[#ff7a50]" />
            <span>Question Bank</span>
            <span className="text-[10px] bg-[#fff0e6] text-[#c2410c] px-1.5 py-0.2 rounded-full font-bold">
              By Section
            </span>
          </button>

          {hasPermission('canCreateFeedbackSurveys') && (
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'builder' ? 'bg-white text-[#0a192f] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-[#ff7a50]" />
              <span>Manual Builder</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE SURVEYS                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'surveys' && (
        <div className="space-y-4">
          {/* Dynamic Form Builder Service Quick Launcher Callout */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-blue-500/10 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-[#0a192f] to-[#1e3a8a] text-white rounded-xl shadow-xs shrink-0">
                <Zap className="w-5 h-5 text-[#ff7a50]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    Relational Form Engine
                  </span>
                  <span className="text-xs text-slate-500">
                    Logged-in Role: <strong className="text-[#0a192f]">{currentUser?.role || 'FACULTY'}</strong>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#0a192f] mt-0.5">
                  Dynamic Survey Generation via Role-to-Category Relationship Table
                </h3>
                <p className="text-xs text-slate-600">
                  System filters relevant question sets via a relationship table mapping roles to categories (pedagogy for Faculty, campus Wi-Fi & labs for Students).
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('dynamic-service')}
              className="px-4 py-2 bg-[#0a192f] hover:bg-[#132c52] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#ff7a50]" />
              <span>Open Dynamic Builder</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Multi-Stakeholder Banner */}
          <div className="bg-linear-to-r from-[#0a192f] via-[#132c52] to-[#1e3a8a] text-white rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#1e3a8a]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#ff7a50]/20 text-[#fed7aa] rounded uppercase tracking-wider border border-[#ff7a50]/40">
                  Role-Specific Question Sections
                </span>
                <span className="text-[11px] text-blue-200 font-medium">Calibrated for NAAC Criteria</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold mt-1">
                Differentiated Questionnaires for Students, Teachers, Staff & Employers
              </h2>
              <p className="text-xs text-blue-100 mt-0.5 max-w-2xl">
                Students evaluate pedagogical clarity & lab infrastructure; Teachers evaluate syllabus autonomy, seed grants & workload equity; Staff evaluate administrative ERP & safety protocols.
              </p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setActiveTab('question-bank')}
                className="text-xs font-bold bg-[#ff7a50] hover:bg-[#e0683f] text-[#0a192f] px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <FolderKanban className="w-4 h-4 text-[#0a192f]" />
                <span>Explore Question Bank</span>
              </button>
            </div>
          </div>

          {/* Stakeholder Category Filter Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Surveys' },
              { id: 'STUDENT', label: '🎓 Students' },
              { id: 'FACULTY', label: '👨‍🏫 Teachers & Faculty' },
              { id: 'NON_TEACHING', label: '📋 Admin Staff' },
              { id: 'TECHNICAL_STAFF', label: '🔬 Technical Staff' },
              { id: 'ALUMNI', label: '🤝 Alumni' },
              { id: 'EMPLOYER', label: '🏢 Employers' },
              { id: 'PARENT', label: '👨‍👩‍👦 Parents' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#0a192f] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-[#fff0e6] hover:text-[#c2410c]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map((form) => (
              <ThreeDTiltCard key={form.id} maxTilt={8} scale={1.02}>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#ff7a50] transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa]">
                          {getTargetLabel(form.targetType)}
                        </span>
                        {form.naacSubMetric && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            form.naacSubMetric === '2.7.1'
                              ? 'bg-purple-100 text-purple-900 border-purple-300'
                              : form.naacSubMetric === '1.4.1'
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            NAAC {form.naacSubMetric}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          form.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {form.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#0a192f] line-clamp-2">{form.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{form.description}</p>

                    {/* Section Count and Questions Preview */}
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                        <span className="flex items-center space-x-1">
                          <Layers className="w-3.5 h-3.5 text-[#ff7a50]" />
                          <span>{form.sections.length} Role-Specific Sections</span>
                        </span>
                        <span>
                          {form.sections.reduce((acc, s) => acc + s.questions.length, 0)} Questions
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Sections: {form.sections.map((s) => s.title.replace(/^Section \d+:\s*/, '')).join(' • ')}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{form.responseCount || 0} Responses</span>
                      </span>
                      <span className="flex items-center space-x-1 font-bold text-[#0a192f]">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{form.averageScore?.toFixed(2) || '0.00'}/5.0</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {hasPermission('canCreateFeedbackSurveys') && (
                        <button
                          onClick={() => handleDuplicate(form.id)}
                          title="Duplicate Survey Form"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {form.status === 'DRAFT' && hasPermission('canCreateFeedbackSurveys') && (
                        <button
                          onClick={() => handlePublish(form.id)}
                          title="Publish Survey"
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setActiveTakingForm(form);
                        setAnswers({});
                        setIsAnonymous(form.allowAnonymous);
                      }}
                      className="px-3 py-1.5 bg-[#0a192f] hover:bg-[#132c52] text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Take Survey</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#ff7a50]" />
                    </button>
                  </div>
                </div>
              </ThreeDTiltCard>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DYNAMIC FORM BUILDER SERVICE (ROLE-TO-CATEGORY RELATIONSHIP TABLE) */}
      {/* ========================================================================= */}
      {activeTab === 'dynamic-service' && (
        <div className="space-y-6">
          {/* Service Banner & Architecture Overview */}
          <div className="bg-gradient-to-r from-[#0a192f] via-[#132c52] to-[#1e3a8a] text-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#1e3a8a]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-[#ff7a50] text-[#0a192f] rounded-md uppercase tracking-wider shadow-xs">
                    ⚡ Relational Form Engine
                  </span>
                  <span className="text-xs text-blue-200">
                    NAAC Criteria Differentiated Mapping
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight">
                  Dynamic Form Builder Service: Role-to-Category Relationship Engine
                </h2>
                <p className="text-xs text-blue-100 max-w-3xl leading-relaxed">
                  Maps unique <strong>Question Templates</strong> based on the user's role (e.g. specific pedagogical questions for Faculty, campus infrastructure & Wi-Fi for Students, office ERP automation for Staff). When a survey is generated, the system queries the relational mapping matrix to filter and assemble relevant question sets into structured NAAC sections.
                </p>
              </div>

              {/* Quick Generation CTA from Banner */}
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15 flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Target Role Persona</div>
                  <div className="text-xs font-black text-white flex items-center sm:justify-end space-x-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{selectedDynamicRole}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateDynamicSurvey}
                  disabled={isGeneratingDyn || selectedCategoryIds.length === 0}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#ff7a50] hover:bg-[#e0683f] text-[#0a192f] text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingDyn ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Survey...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Generate Dynamic Survey</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Logged-in User Role Persona Detection Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a192f] to-[#1e3a8a] flex items-center justify-center text-white font-bold shadow-xs">
                  {currentUser?.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#0a192f]">
                      {currentUser?.fullName || 'Active Stakeholder'}
                    </span>
                    <span className="px-2 py-0.2 text-[10px] font-extrabold rounded-md bg-purple-100 text-purple-900 border border-purple-200">
                      Logged-in Role: {currentUser?.role || 'FACULTY'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {currentUser?.role === 'FACULTY' && '👨‍🏫 Pedagogical Innovation: Mapped to Curriculum Autonomy, Research Seed Grants, and Smart ICT.'}
                    {currentUser?.role === 'STUDENT' && '🎓 Student Satisfaction: Mapped to Campus Wi-Fi, Computer Lab Readiness, and Mentoring.'}
                    {currentUser?.role === 'NON_TEACHING' && '📋 Administrative Wing: Mapped to ERP Software Uptime, Office Infrastructure, and Staff Welfare.'}
                    {currentUser?.role === 'TECHNICAL_STAFF' && '🔬 Technical Division: Mapped to Machine Safety Protocols, Consumables Budget, and Upskilling.'}
                    {currentUser?.role === 'SUPER_ADMIN' && '🏛️ Institutional Architect: Full permission to simulate and generate surveys for any stakeholder tier.'}
                    {currentUser?.role === 'IQAC_ADMIN' && '📊 IQAC Coordinator: Oversees stakeholder relationship tables, criteria alignment, and survey publishing.'}
                    {!['FACULTY', 'STUDENT', 'NON_TEACHING', 'TECHNICAL_STAFF', 'SUPER_ADMIN', 'IQAC_ADMIN'].includes(currentUser?.role || '') &&
                      'Stakeholder Persona mapped via Institutional Quality Matrix.'}
                  </p>
                </div>
              </div>

              {currentUser?.role && ['FACULTY', 'STUDENT', 'NON_TEACHING', 'TECHNICAL_STAFF', 'EMPLOYER', 'ALUMNI', 'PARENT'].includes(currentUser.role) && (
                <button
                  type="button"
                  onClick={() => setSelectedDynamicRole(currentUser.role)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                    selectedDynamicRole === currentUser.role
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Use My Logged-in Role ({currentUser.role})</span>
                </button>
              )}
            </div>

            {/* Role Switcher Pills (Simulate / Generate for Any Stakeholder) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span>Select Target Stakeholder Role (Filters Relationship Table & Question Sets):</span>
                <span className="text-[#ff7a50]">Showing Mapped Categories for: <strong>{selectedDynamicRole}</strong></span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { role: 'FACULTY', label: 'Faculty & Teachers', icon: 'BookOpen', sample: 'Pedagogy & Autonomy' },
                  { role: 'STUDENT', label: 'Students (UG/PG)', icon: 'GraduationCap', sample: 'Wi-Fi & Lab Facilities' },
                  { role: 'NON_TEACHING', label: 'Admin Staff', icon: 'ClipboardList', sample: 'ERP, SOPs & Welfare' },
                  { role: 'TECHNICAL_STAFF', label: 'Tech & Lab Staff', icon: 'Wrench', sample: 'Safety & Spares' },
                  { role: 'EMPLOYER', label: 'Employers', icon: 'Briefcase', sample: 'Tech Competence & Ethics' },
                  { role: 'ALUMNI', label: 'Alumni', icon: 'HeartHandshake', sample: 'Career Impact & ROI' },
                  { role: 'PARENT', label: 'Parents', icon: 'Users', sample: 'Campus Safety & Alerts' },
                ].map((item) => {
                  const isSelected = selectedDynamicRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSelectedDynamicRole(item.role)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0a192f] text-white border-[#ff7a50] shadow-md ring-1 ring-[#ff7a50]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        {renderCategoryIcon(item.icon, `w-4 h-4 ${isSelected ? 'text-[#ff7a50]' : 'text-slate-500'}`)}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a50]"></span>}
                      </div>
                      <div className="text-xs font-bold truncate">{item.label}</div>
                      <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {item.sample}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Role-to-Category Relationship Table (Relational Matrix) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
              <div>
                <div className="flex items-center space-x-2">
                  <Table className="w-4 h-4 text-[#ff7a50]" />
                  <h3 className="text-sm font-extrabold text-[#0a192f]">
                    Role-to-Category Relationship Table (Relational Matrix)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filters unique feedback categories mapped specifically to <strong>{selectedDynamicRole}</strong> with rationale and NAAC Criteria alignment.
                </p>
              </div>

              {/* Bulk Toggle & Selection Summary */}
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const currentRoleMappings = dynRoleMappings.filter((m) => m.role === selectedDynamicRole);
                    if (selectedCategoryIds.length === currentRoleMappings.length) {
                      setSelectedCategoryIds([]);
                    } else {
                      setSelectedCategoryIds(currentRoleMappings.map((m) => m.categoryId));
                    }
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-[#0a192f] flex items-center space-x-1 cursor-pointer"
                >
                  {selectedCategoryIds.length === dynRoleMappings.filter((m) => m.role === selectedDynamicRole).length ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-[#ff7a50]" />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                      <span>Select All Mapped</span>
                    </>
                  )}
                </button>
                <span className="px-2.5 py-1 text-xs font-black bg-blue-50 text-blue-900 border border-blue-200 rounded-lg">
                  {selectedCategoryIds.length} Categories Active
                </span>
              </div>
            </div>

            {/* Relational Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3.5 pl-5 w-12 text-center">Include</th>
                    <th className="p-3.5 w-24">Priority</th>
                    <th className="p-3.5">Mapped Quality Category</th>
                    <th className="p-3.5">Role Focus & Rationale</th>
                    <th className="p-3.5 w-44">NAAC Criterion</th>
                    <th className="p-3.5 w-28 text-center">Templates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dynRoleMappings
                    .filter((m) => m.role === selectedDynamicRole)
                    .map((mapping) => {
                      const isIncluded = selectedCategoryIds.includes(mapping.categoryId);
                      const cat = dynCategories.find((c) => c.id === mapping.categoryId) || mapping.category;
                      const templatesForCat = dynTemplates.filter(
                        (t) => t.categoryId === mapping.categoryId && t.applicableRoles.includes(selectedDynamicRole as any)
                      );
                      const isExpanded = expandedCategoryIds.includes(mapping.categoryId);

                      return (
                        <tr
                          key={mapping.id}
                          className={`transition-colors ${
                            isIncluded ? 'bg-white hover:bg-blue-50/30' : 'bg-slate-50/50 opacity-60'
                          }`}
                        >
                          {/* Include Checkbox */}
                          <td className="p-3.5 pl-5 text-center">
                            <input
                              type="checkbox"
                              checked={isIncluded}
                              onChange={() => {
                                if (isIncluded) {
                                  setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== mapping.categoryId));
                                } else {
                                  setSelectedCategoryIds([...selectedCategoryIds, mapping.categoryId]);
                                }
                              }}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* Priority Badge */}
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                mapping.isPrimary
                                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {mapping.isPrimary ? `P${mapping.priorityOrder} Core` : `P${mapping.priorityOrder} Elective`}
                            </span>
                          </td>

                          {/* Category Name & Code */}
                          <td className="p-3.5">
                            <div className="flex items-center space-x-2.5">
                              <div className="p-1.5 bg-slate-100 rounded-lg text-[#ff7a50] shrink-0">
                                {renderCategoryIcon(cat?.iconName || 'BookOpen', 'w-4 h-4')}
                              </div>
                              <div>
                                <span className="font-bold text-[#0a192f] block">
                                  {cat?.name || mapping.categoryId}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {cat?.code || mapping.categoryId}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Focus Description & Rationale */}
                          <td className="p-3.5 max-w-md">
                            <div className="font-semibold text-slate-800 text-xs">
                              {mapping.focusDescription}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 italic">
                              "{mapping.rationale}"
                            </div>
                          </td>

                          {/* NAAC Criterion */}
                          <td className="p-3.5">
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md inline-block">
                              {cat?.naacCriterion || 'NAAC Criterion'}
                            </span>
                          </td>

                          {/* Templates Count & Accordion Toggle */}
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                if (isExpanded) {
                                  setExpandedCategoryIds(expandedCategoryIds.filter((id) => id !== mapping.categoryId));
                                } else {
                                  setExpandedCategoryIds([...expandedCategoryIds, mapping.categoryId]);
                                }
                              }}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#fff0e6] text-[#c2410c] hover:bg-[#fed7aa] transition-colors inline-flex items-center space-x-1 cursor-pointer"
                            >
                              <span>{templatesForCat.length} Qs</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Question Templates Live Filter Preview (Filtered via Relationship Table) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-900 rounded uppercase">
                    Live Question Sets
                  </span>
                  <span className="text-xs text-slate-400">Filtered for {selectedDynamicRole}</span>
                </div>
                <h3 className="text-base font-extrabold text-[#0a192f] mt-1">
                  Calibrated Question Templates for Included Categories
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  These question templates will be assembled into discrete sections upon survey generation.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Search template questions */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={dynTemplateSearch}
                    onChange={(e) => setDynTemplateSearch(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddCustomTemplateModal(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0a192f] text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-[#ff7a50]" />
                  <span>Add Template</span>
                </button>
              </div>
            </div>

            {/* Mapped Categories and their Questions */}
            <div className="space-y-4">
              {dynRoleMappings
                .filter((m) => m.role === selectedDynamicRole && selectedCategoryIds.includes(m.categoryId))
                .map((mapping, idx) => {
                  const cat = dynCategories.find((c) => c.id === mapping.categoryId) || mapping.category;
                  let templates = dynTemplates.filter(
                    (t) => t.categoryId === mapping.categoryId && t.applicableRoles.includes(selectedDynamicRole as any)
                  );
                  if (templates.length === 0) {
                    templates = dynTemplates.filter((t) => t.categoryId === mapping.categoryId);
                  }

                  if (dynTemplateSearch) {
                    templates = templates.filter(
                      (t) =>
                        t.prompt.toLowerCase().includes(dynTemplateSearch.toLowerCase()) ||
                        t.parameter.toLowerCase().includes(dynTemplateSearch.toLowerCase())
                    );
                  }

                  return (
                    <div key={mapping.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      {/* Section Header */}
                      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-6 h-6 rounded-lg bg-[#0a192f] text-white flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xs font-extrabold text-[#0a192f]">
                                Section {idx + 1}: {cat?.name}
                              </h4>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                                {cat?.naacCriterion}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{mapping.focusDescription}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-600 shrink-0">
                          {templates.length} Calibrated Questions
                        </span>
                      </div>

                      {/* Questions List */}
                      <div className="divide-y divide-slate-100 p-1">
                        {templates.map((qt, qIdx) => (
                          <div key={qt.id} className="p-3 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-bold text-slate-400">Q{qIdx + 1}.</span>
                                <span className="text-xs font-medium text-slate-800">{qt.prompt}</span>
                                {qt.isRequired && <span className="text-red-500 font-bold text-xs">*</span>}
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 pl-4">
                                <span className="text-[10px] font-bold px-2 py-0.2 bg-slate-100 text-slate-600 rounded">
                                  Parameter: {qt.parameter}
                                </span>
                                {qt.naacMetricRef && (
                                  <span className="text-[10px] font-bold px-2 py-0.2 bg-purple-50 text-purple-700 border border-purple-200 rounded">
                                    {qt.naacMetricRef}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                              {qt.questionType}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Dynamic Form Generation Control Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#ff7a50]" />
              <h3 className="text-sm font-extrabold text-[#0a192f]">
                Survey Packaging & Publication Parameters
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Generated Survey Title</label>
                <input
                  type="text"
                  value={dynSurveyTitle}
                  onChange={(e) => setDynSurveyTitle(e.target.value)}
                  placeholder="e.g. Faculty Pedagogical Delivery Survey"
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  disabled
                  value="Academic Year 2026-27 (Current Cycle)"
                  className="w-full p-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Survey Objective & Instructions</label>
              <textarea
                rows={2}
                value={dynSurveyDesc}
                onChange={(e) => setDynSurveyDesc(e.target.value)}
                placeholder="Institutional objective of this survey..."
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-xs text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dynAllowAnonymous}
                    onChange={(e) => setDynAllowAnonymous(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Allow Anonymous Responses</span>
                </label>

                {hasPermission('canCreateFeedbackSurveys') && (
                  <label className="flex items-center space-x-2 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dynAutoPublish}
                      onChange={(e) => setDynAutoPublish(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Publish Immediately (Make active for users)</span>
                  </label>
                )}
              </div>

              <button
                type="button"
                onClick={handleGenerateDynamicSurvey}
                disabled={isGeneratingDyn || selectedCategoryIds.length === 0}
                className="px-6 py-3 bg-[#0a192f] hover:bg-[#132c52] text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingDyn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#ff7a50]" />
                    <span>Querying Relationship Table & Assembling Survey...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#ff7a50]" />
                    <span>Generate Dynamic Survey for {selectedDynamicRole}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Differentiated Role Mapping Architecture Showcase */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-extrabold text-[#0a192f] uppercase tracking-wider">
                How the Relationship Table Enforces Differentiated Feedback (NAAC Assurance)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-blue-700 block">👨‍🏫 Faculty / Teachers Differentiated Focus</span>
                <p className="text-[11px] leading-relaxed">
                  Evaluates <em>Curriculum Autonomy</em>, Board of Studies turnaround, <em>Research Seed Grants</em>, Scopus incentives, and faculty workload equity. Never burdens faculty with irrelevant questions on hostel hygiene or student bus routes.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-emerald-700 block">🎓 Students Differentiated Focus</span>
                <p className="text-[11px] leading-relaxed">
                  Evaluates <em>Campus High-Speed Wi-Fi</em>, Computer Lab machine readiness, teaching clarity with live demonstrations, internal assessment transparency, and placement bootcamps.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {activeTab === 'question-bank' && (
        <div className="space-y-5">
          {/* Question Bank Header & Role Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#fff0e6] text-[#c2410c] rounded uppercase border border-[#fed7aa]">
                    Curated Question Bank
                  </span>
                  <span className="text-xs text-slate-400">Section-Differentiated Feedback Questions</span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#0a192f] mt-1">
                  Role-Calibrated Sections & Questions Catalog
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect the distinct sections and customized questions for each stakeholder group. Copy or send directly to the Form Builder.
                </p>
              </div>

              {/* Live Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={bankSearchQuery}
                  onChange={(e) => setBankSearchQuery(e.target.value)}
                  placeholder="Search questions or parameters..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                />
              </div>
            </div>

            {/* Stakeholder Category Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pt-2 pb-1 border-t border-slate-100">
              {(
                [
                  { type: 'STUDENT', label: '🎓 Students' },
                  { type: 'FACULTY', label: '👨‍🏫 Teachers & Faculty' },
                  { type: 'NON_TEACHING', label: '📋 Admin Staff' },
                  { type: 'TECHNICAL_STAFF', label: '🔬 Technical Staff' },
                  { type: 'EMPLOYER', label: '🏢 Employers' },
                  { type: 'ALUMNI', label: '🤝 Alumni' },
                  { type: 'PARENT', label: '👨‍👩‍👦 Parents' },
                ] as const
              ).map((role) => (
                <button
                  key={role.type}
                  onClick={() => setBankSelectedStakeholder(role.type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                    bankSelectedStakeholder === role.type
                      ? 'bg-[#0a192f] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-[#fff0e6] hover:text-[#c2410c]'
                  }`}
                >
                  <span>{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Stakeholder Summary Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0a192f] text-[#ff7a50] flex items-center justify-center shrink-0">
                {renderStakeholderIcon(currentBankItem.type, 'w-5 h-5')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-extrabold text-[#0a192f]">{currentBankItem.roleTitle}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa]">
                    {currentBankItem.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-3xl">{currentBankItem.defaultDesc}</p>
                <div className="flex items-center space-x-4 text-xs font-bold text-slate-600 mt-2">
                  <span>{currentBankItem.sections.length} Form Sections</span>
                  <span>•</span>
                  <span>{totalQuestionsInBank} Calibrated Questions</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                loadStakeholderTemplateIntoBuilder(currentBankItem.type);
                setActiveTab('builder');
              }}
              className="px-4 py-2 bg-[#ff7a50] hover:bg-[#e0683f] text-[#0a192f] rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0a192f]" />
              <span>Use in Form Builder</span>
            </button>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {filteredBankSections.map((sec, sIdx) => (
              <div
                key={sec.title}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#ff7a50] transition-colors"
              >
                {/* Section Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#0a192f] text-white rounded uppercase">
                        Section {sIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-blue-900">{sec.category}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-[#0a192f] mt-1">{sec.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{sec.description}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 self-start sm:self-auto shrink-0">
                    {sec.questions.length} Questions
                  </span>
                </div>

                {/* Questions Grid */}
                <div className="p-4 divide-y divide-slate-100">
                  {sec.questions.map((q, qIdx) => (
                    <div
                      key={q.prompt}
                      className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-[#0a192f]">Q{qIdx + 1}.</span>
                          <span className="text-xs font-bold text-slate-800">{q.prompt}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-[#fff0e6] text-[#c2410c] rounded border border-[#fed7aa]">
                            Parameter: {q.parameter}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                            {q.questionType.replace('_', ' ')}
                          </span>
                          {q.isRequired && (
                            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(q.prompt);
                          showToast('Question prompt copied to clipboard!', 'info');
                        }}
                        title="Copy question text"
                        className="p-1.5 text-slate-400 hover:text-[#0a192f] hover:bg-slate-100 rounded-lg transition-colors shrink-0 self-start cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredBankSections.length === 0 && (
              <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                No questions found matching your search query "{bankSearchQuery}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DYNAMIC FORM BUILDER                                              */}
      {/* ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#0a192f] text-[#ff7a50] rounded uppercase">
                Section & Question Builder
              </span>
              <span className="text-xs text-slate-400">• Institutional Quality Assured</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0a192f] mt-1">
              Dynamic Multi-Section Feedback Instrument Builder
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any stakeholder tier below to instantly load their customized question sections, or modify question parameters as needed.
            </p>
          </div>

          {/* Quick 1-Click Role Question Loaders */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <span className="text-xs font-extrabold text-[#0a192f] block">
              ⚡ Quick Template Switcher (Pre-load role-specific question sets):
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { type: 'STUDENT' as StakeholderType, label: '🎓 Student Questions (6 Sec, 16 Qs)' },
                { type: 'FACULTY' as StakeholderType, label: '👨‍🏫 Teacher Questions (5 Sec, 14 Qs)' },
                { type: 'NON_TEACHING' as StakeholderType, label: '📋 Admin Staff Questions (4 Sec, 8 Qs)' },
                { type: 'TECHNICAL_STAFF' as StakeholderType, label: '🔬 Tech Staff Questions (3 Sec, 4 Qs)' },
                { type: 'EMPLOYER' as StakeholderType, label: '🏢 Employer Questions (3 Sec, 6 Qs)' },
                { type: 'ALUMNI' as StakeholderType, label: '🤝 Alumni Questions (2 Sec, 4 Qs)' },
                { type: 'PARENT' as StakeholderType, label: '👨‍👩‍👦 Parent Questions (2 Sec, 5 Qs)' },
              ].map((btn) => (
                <button
                  key={btn.type}
                  type="button"
                  onClick={() => loadStakeholderTemplateIntoBuilder(btn.type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    newFormTarget === btn.type
                      ? 'bg-[#0a192f] text-[#ff7a50] shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-[#fff0e6] hover:text-[#c2410c]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateForm} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Form Title</label>
                <input
                  type="text"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  placeholder="e.g. Student Evaluation on Curricular Aspects & Mentoring"
                  required
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Stakeholder Tier</label>
                <select
                  value={newFormTarget}
                  onChange={(e) => {
                    const target = e.target.value as StakeholderType;
                    loadStakeholderTemplateIntoBuilder(target);
                  }}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                >
                  <option value="STUDENT">Students (UG / PG / Doctoral)</option>
                  <option value="FACULTY">Teachers & Faculty (All Ranks)</option>
                  <option value="NON_TEACHING">Administrative & Non-Teaching Staff</option>
                  <option value="TECHNICAL_STAFF">Technical & Laboratory Staff</option>
                  <option value="ALUMNI">Alumni Network</option>
                  <option value="EMPLOYER">Corporate Employers</option>
                  <option value="PARENT">Parents / Guardians</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description & Objective</label>
              <textarea
                value={newFormDesc}
                onChange={(e) => setNewFormDesc(e.target.value)}
                placeholder="Institutional objective of this quality survey..."
                rows={2}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anon"
                checked={newFormAnonymous}
                onChange={(e) => setNewFormAnonymous(e.target.checked)}
                className="rounded text-blue-600"
              />
              <label htmlFor="anon" className="text-xs text-slate-700 font-semibold cursor-pointer">
                Allow Anonymous Submission (Recommended for authentic, candid feedback)
              </label>
            </div>

            {/* Questions List */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-[#0a192f] uppercase tracking-wider">
                    Survey Questions & Section Assignments ({builderQuestions.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Questions will be automatically grouped into separate sections upon form generation.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setBuilderQuestions([
                      ...builderQuestions,
                      {
                        sectionTitle: 'Section: General Academic Quality',
                        prompt: 'Rate the efficiency of examination grievance redressal.',
                        parameter: 'Evaluation Process',
                        questionType: 'LIKERT_SCALE',
                        isRequired: true,
                        options: '',
                      },
                    ])
                  }
                  className="px-3 py-1.5 text-xs font-bold bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] rounded-xl hover:bg-[#fed7aa] cursor-pointer"
                >
                  + Add Custom Question
                </button>
              </div>

              <div className="space-y-3">
                {builderQuestions.map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-extrabold">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={q.sectionTitle}
                          onChange={(e) => {
                            const updated = [...builderQuestions];
                            updated[idx].sectionTitle = e.target.value;
                            setBuilderQuestions(updated);
                          }}
                          placeholder="Section Title (e.g. Section 1: Curriculum Relevance)"
                          className="p-1 px-2 bg-white text-xs border border-slate-200 rounded font-bold text-[#0a192f] w-72"
                        />
                      </div>
                      {builderQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setBuilderQuestions(builderQuestions.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={q.prompt}
                      onChange={(e) => {
                        const updated = [...builderQuestions];
                        updated[idx].prompt = e.target.value;
                        setBuilderQuestions(updated);
                      }}
                      placeholder="Question prompt..."
                      className="w-full p-2 bg-white text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">Quality Parameter Tag</span>
                        <input
                          type="text"
                          value={q.parameter}
                          onChange={(e) => {
                            const updated = [...builderQuestions];
                            updated[idx].parameter = e.target.value;
                            setBuilderQuestions(updated);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">Response Type</span>
                        <select
                          value={q.questionType}
                          onChange={(e) => {
                            const updated = [...builderQuestions];
                            updated[idx].questionType = e.target.value as any;
                            setBuilderQuestions(updated);
                          }}
                          className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                        >
                          <option value="LIKERT_SCALE">Likert Scale (1 - 5)</option>
                          <option value="RATING_STARS">Rating Stars (1 - 5)</option>
                          <option value="NPS">Net Promoter Score (0 - 10)</option>
                          <option value="TEXT_RESPONSE">Qualitative Feedback (Text)</option>
                          <option value="SINGLE_CHOICE">Single Choice</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0a192f] hover:bg-[#132c52] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4 text-[#ff7a50]" />
                <span>Save & Generate Multi-Section Form</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INTERACTIVE SURVEY TAKER (WITH SECTION ACCORDIONS)                */}
      {/* ========================================================================= */}
      {activeTakingForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 max-h-[94vh] flex flex-col my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0 gap-2">
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] shrink-0">
                    {getTargetLabel(activeTakingForm.targetType)}
                  </span>
                  {activeTakingForm.naacSubMetric && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 shrink-0">
                      NAAC Metric {activeTakingForm.naacSubMetric}
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0a192f] mt-1 truncate">
                  {surveyLanguage === 'hi' && activeTakingForm.titleHi ? activeTakingForm.titleHi : activeTakingForm.title}
                </h3>
                <span className="text-xs text-slate-400">
                  {activeTakingForm.sections.length} {surveyLanguage === 'hi' ? 'अनुभाग' : 'Sections'} •{' '}
                  {activeTakingForm.sections.reduce((acc, s) => acc + s.questions.length, 0)} {surveyLanguage === 'hi' ? 'कुल प्रश्न' : 'Total Questions'}
                </span>
              </div>

              {/* Language Switcher Toggle */}
              <div className="flex items-center space-x-2 shrink-0">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setSurveyLanguage('en')}
                    className={`min-h-[36px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                      surveyLanguage === 'en'
                        ? 'bg-[#0a192f] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#0a192f]'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setSurveyLanguage('hi')}
                    className={`min-h-[36px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                      surveyLanguage === 'hi'
                        ? 'bg-[#ff7a50] text-[#0a192f] shadow-xs'
                        : 'text-slate-600 hover:text-[#0a192f]'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>

                <button
                  onClick={() => setActiveTakingForm(null)}
                  aria-label="Close survey modal"
                  className="text-slate-400 hover:text-slate-600 min-w-[44px] min-h-[44px] rounded-xl hover:bg-slate-100 cursor-pointer flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Anonymous Toggle Bar */}
            <div className="my-3 p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="font-semibold text-blue-900">
                  {surveyLanguage === 'hi' ? 'गोपनीयता और अनामिकता मोड:' : 'Privacy & Confidentiality Mode:'}
                </span>
              </div>
              <label className="flex items-center space-x-1.5 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-bold text-blue-800 text-[11px] sm:text-xs">
                  {surveyLanguage === 'hi' ? 'गुमनाम रूप से जमा करें' : 'Submit Anonymously'}
                </span>
              </label>
            </div>

            {/* Questions Form Body */}
            <form onSubmit={handleSubmitSurvey} className="flex-1 overflow-y-auto pr-1 space-y-5 py-2">
              {activeTakingForm.sections.map((sec, sIdx) => (
                <div key={sec.id} className="space-y-4 bg-slate-50/80 p-3 sm:p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#ff7a50] tracking-wider block">
                        {surveyLanguage === 'hi' ? `अनुभाग ${sIdx + 1}` : `Section ${sIdx + 1} of ${activeTakingForm.sections.length}`}
                      </span>
                      <h4 className="text-xs font-extrabold text-[#0a192f] uppercase tracking-wider">
                        {sec.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-slate-600 rounded border border-slate-200">
                      {sec.questions.length} {surveyLanguage === 'hi' ? 'प्रश्न' : 'Qs'}
                    </span>
                  </div>

                  {sec.questions.map((q, qIdx) => {
                    const promptText =
                      surveyLanguage === 'hi'
                        ? (q as any).promptHi || HINDI_TRANSLATION_MAP[q.prompt] || `(हिन्दी) ${q.prompt}`
                        : q.prompt;

                    return (
                      <div key={q.id} className="p-3 sm:p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800 leading-relaxed">
                            {qIdx + 1}. {promptText}
                          </p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                            {q.parameter}
                          </span>
                        </div>

                        {/* Likert Scale 1 - 5 */}
                        {(q.questionType === 'LIKERT_SCALE' || q.questionType === 'RATING_STARS') && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-1">
                              <span>{surveyLanguage === 'hi' ? '१ (कमज़ोर / असहमत)' : '1 (Poor / Disagree)'}</span>
                              <span>{surveyLanguage === 'hi' ? '५ (उत्कृष्ट / सहमत)' : '5 (Excellent / Agree)'}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setAnswers({ ...answers, [q.id]: val })}
                                  className={`min-h-[44px] py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                                    answers[q.id] === val
                                      ? 'bg-[#0a192f] text-white shadow-md ring-2 ring-[#ff7a50]'
                                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-[#fff0e6] hover:text-[#c2410c]'
                                  }`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* NPS Scale 0 - 10 */}
                        {q.questionType === 'NPS' && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-1">
                              <span>{surveyLanguage === 'hi' ? '० (संभावना नहीं)' : '0 (Not Likely)'}</span>
                              <span>{surveyLanguage === 'hi' ? '१० (अत्यधिक)' : '10 (Extremely)'}</span>
                            </div>
                            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setAnswers({ ...answers, [q.id]: val })}
                                  className={`min-h-[38px] py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                                    answers[q.id] === val
                                      ? 'bg-[#0a192f] text-white shadow-md ring-2 ring-[#ff7a50]'
                                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Text Response */}
                        {q.questionType === 'TEXT_RESPONSE' && (
                          <textarea
                            rows={2}
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            placeholder={
                              surveyLanguage === 'hi'
                                ? 'कृपया अपने विचार या ठोस सुझाव यहाँ दर्ज करें...'
                                : 'Please provide your candid thoughts, qualitative suggestions or specifics...'
                            }
                            className="w-full p-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <span className="text-[11px] text-slate-500">
                  {surveyLanguage === 'hi'
                    ? 'प्रस्तुत डेटा संस्थागत गुणवत्ता आश्वासन उपनियमों के तहत सुरक्षित रखा जाता है।'
                    : 'Data submitted is processed under institutional quality assurance bylaws.'}
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[44px] px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting
                      ? surveyLanguage === 'hi' ? 'जमा हो रहा है...' : 'Submitting...'
                      : surveyLanguage === 'hi' ? 'प्रतिक्रिया जमा करें (Submit Feedback)' : 'Submit Official Feedback'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DYNAMIC SURVEY GENERATION SUCCESS MODAL                         */}
      {/* ========================================================================= */}
      {showDynSuccessModal && lastGeneratedResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-[#0a192f] via-[#132c52] to-[#1e3a8a] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ff7a50] text-[#0a192f] flex items-center justify-center font-black shadow-md">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/20 text-blue-100">
                      Dynamic Form Generated
                    </span>
                    <span className="text-xs text-[#ff7a50] font-mono">
                      {lastGeneratedResult.form.code}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    {lastGeneratedResult.form.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDynSuccessModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Relationship Matrix Successfully Filtered Question Sets!</span>
                </div>
                <p className="text-emerald-700 text-xs leading-relaxed">
                  The dynamic form builder matched <strong>{lastGeneratedResult.mappedCategories.length} quality categories</strong> specifically mapped to the <strong>{lastGeneratedResult.role}</strong> role, injecting <strong>{lastGeneratedResult.questionCount} calibrated questions</strong> across structured NAAC sections.
                </p>
              </div>

              {/* Generated Sections Preview */}
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-[#0a192f] uppercase tracking-wider">
                  Generated Survey Sections ({lastGeneratedResult.form.sections.length})
                </div>
                <div className="space-y-2">
                  {lastGeneratedResult.form.sections.map((sec, sIdx) => (
                    <div key={sec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0a192f]">{sec.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                          {sec.questions.length} Questions
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Questions: {sec.questions.map((q) => q.parameter).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500">
                Form is saved and ready for evaluation in active academic cycle.
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDynSuccessModal(false);
                    setActiveTab('surveys');
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  View in Active Surveys
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDynSuccessModal(false);
                    setActiveTakingForm(lastGeneratedResult.form);
                    setAnswers({});
                    setIsAnonymous(lastGeneratedResult.form.allowAnonymous);
                  }}
                  className="px-4 py-2 bg-[#0a192f] hover:bg-[#132c52] text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <span>Take Survey Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff7a50]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD CUSTOM TEMPLATE TO CATEGORY BANK                             */}
      {/* ========================================================================= */}
      {showAddCustomTemplateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-[#0a192f] to-[#1e3a8a] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-[#ff7a50]" />
                <h3 className="text-sm font-extrabold">Add New Question Template</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomTemplateModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomTemplate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Category</label>
                <select
                  value={customTemplateForm.categoryId}
                  onChange={(e) => setCustomTemplateForm({ ...customTemplateForm, categoryId: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                >
                  {dynCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Applicable Role</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedDynamicRole} (Inherited from active view)`}
                  className="w-full p-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Prompt / Statement</label>
                <textarea
                  rows={3}
                  required
                  value={customTemplateForm.prompt}
                  onChange={(e) => setCustomTemplateForm({ ...customTemplateForm, prompt: e.target.value })}
                  placeholder="e.g. Rate the institutional support provided for interdisciplinary laboratory research..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parameter Tag</label>
                  <input
                    type="text"
                    required
                    value={customTemplateForm.parameter}
                    onChange={(e) => setCustomTemplateForm({ ...customTemplateForm, parameter: e.target.value })}
                    placeholder="e.g. Research Support"
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NAAC Metric Ref</label>
                  <input
                    type="text"
                    value={customTemplateForm.naacMetricRef}
                    onChange={(e) => setCustomTemplateForm({ ...customTemplateForm, naacMetricRef: e.target.value })}
                    placeholder="e.g. NAAC 3.1.2"
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Response Scale</label>
                <select
                  value={customTemplateForm.questionType}
                  onChange={(e) =>
                    setCustomTemplateForm({ ...customTemplateForm, questionType: e.target.value as QuestionType })
                  }
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#ff7a50]"
                >
                  <option value="LIKERT_SCALE">Likert Scale (1 - 5 Points)</option>
                  <option value="NPS">Net Promoter Score (0 - 10 Points)</option>
                  <option value="RATING_STARS">Rating Stars (1 - 5 Stars)</option>
                  <option value="TEXT_RESPONSE">Open Qualitative Text</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomTemplateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0a192f] hover:bg-[#132c52] text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#ff7a50]" />
                  <span>Save Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
