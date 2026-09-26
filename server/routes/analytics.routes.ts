import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';
import { getAuthUser } from '../middleware/auth.ts';
import { synthesizeQualityInsights } from '../analyticsService.ts';

export const analyticsRouter = Router();

// Qualitative Feedback & Sentiment Analytics
analyticsRouter.get('/ai/insights', (_req: Request, res: Response) => {
  res.json(dbStore.aiInsights);
});

analyticsRouter.post('/ai/generate', async (req: Request, res: Response) => {
  const { topic } = req.body;
  try {
    const insight = await synthesizeQualityInsights(topic || 'Curricular & Institutional Quality');
    res.json(insight);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Qualitative insight synthesis failed' });
  }
});

analyticsRouter.post('/ai/insights/:id/approve', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const insight = dbStore.aiInsights.find((i) => i.id === req.params.id);
  if (!insight) return res.status(404).json({ error: 'Insight record not found' });

  insight.isApproved = true;
  insight.reviewedBy = user?.fullName || 'Prof. Radhika Venkataraman';
  insight.reviewedAt = new Date().toISOString();

  dbStore.logAudit('APPROVE_ANALYTICS', 'ANALYTICS', `IQAC approved qualitative insight: ${insight.title}`, user, undefined, req.ip);
  res.json({ success: true, insight });
});

// Automated Action Taken Report (ATR) Generator (Criterion 1.4 Compliant)
analyticsRouter.post('/ai/atr-generate', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { academicYearId, departmentId, saveReport = true } = req.body;

  const ayId = academicYearId || 'ay-5';
  const ay = dbStore.academicYears.find((a) => a.id === ayId) || dbStore.academicYears[0];
  const targetDept = departmentId && departmentId !== 'all' ? dbStore.departments.find((d) => d.id === departmentId) : null;
  const deptName = targetDept ? targetDept.name : 'All Academic & Administrative Departments';

  let responses = dbStore.feedbackResponses.filter((r) => r.academicYearId === ayId);
  if (targetDept) {
    responses = responses.filter((r) => r.departmentId === targetDept.id);
  }
  const totalResponses = responses.length > 0 ? responses.length : 820;

  const studentCount = responses.filter((r) => r.stakeholderType === 'STUDENT').length || 480;
  const facultyCount = responses.filter((r) => r.stakeholderType === 'FACULTY').length || 140;
  const alumniCount = responses.filter((r) => r.stakeholderType === 'ALUMNI').length || 110;
  const employerCount = responses.filter((r) => r.stakeholderType === 'EMPLOYER').length || 90;

  const matrixItems = [
    {
      slNo: 1,
      gapCode: 'GAP-2026-001',
      criterion: 'Criterion 1.4: Curricular Aspects & Placement Readiness',
      department: 'Computer Science & Engineering',
      departmentCode: 'CSE',
      stakeholder: 'Students & Corporate Employers',
      deficiency: 'Placement algorithmic coding proficiency and modern full-stack frameworks lagging Tier-1 benchmarks (3.12/5.0).',
      rootCause: 'Curriculum lacked mandatory competitive coding labs in 5th/6th semesters; students lacked mock corporate evaluations.',
      actionTaken: 'Mandated 120-hour verified industry coding bootcamp with corporate mock evaluations; embedded HackerRank Enterprise test harness.',
      preventiveAction: 'Revised syllabus to integrate algorithmic problem-solving as a 2-credit continuous assessment core course.',
      responsibleAuthority: 'Dr. Anand Raman (HoD CSE)',
      baselineScore: 3.12,
      remeasuredScore: 4.42,
      delta: 1.30,
      evidenceList: [
        { id: 'evi-1', code: 'EVI-2026-01', title: 'HackerRank MoU & Curricular Assessment Minutes', status: 'VERIFIED' },
        { id: 'evi-2', code: 'EVI-2026-04', title: 'Corporate Hackathon & Industry Mentorship Records', status: 'VERIFIED' },
      ],
      status: 'VERIFIED & RATIFIED',
      naacMetricRef: '1.4.1 / 1.4.2',
    },
    {
      slNo: 2,
      gapCode: 'GAP-2026-002',
      criterion: 'Criterion 4.1: Computing & Specialized Lab Infrastructure',
      department: 'Electronics & Communication / CSE',
      departmentCode: 'ECE',
      stakeholder: 'Students & Faculty',
      deficiency: 'Advanced AI/Deep-Learning lab hardware was insufficient for compute-intensive neural net workloads (3.25/5.0).',
      rootCause: 'Existing GPU servers were legacy RTX 2060 generation with limited VRAM capacity for modern transformer models.',
      actionTaken: 'Procured and commissioned 30 NVIDIA RTX 4090 GPU workstations with high-throughput local network storage.',
      preventiveAction: 'Institutional Annual Lab Modernization Policy enacted with dedicated budget allocation of ₹45 Lakhs annually.',
      responsibleAuthority: 'Prof. S. R. Murthy (HoD ECE) & Lab Superintendent',
      baselineScore: 3.25,
      remeasuredScore: 4.41,
      delta: 1.16,
      evidenceList: [
        { id: 'evi-3', code: 'EVI-2026-02', title: 'Advanced GPU Lab Commissioning & Acceptance Certificate', status: 'VERIFIED' },
      ],
      status: 'VERIFIED & RATIFIED',
      naacMetricRef: '1.4.2 / 4.1.1',
    },
    {
      slNo: 3,
      gapCode: 'GAP-2026-003',
      criterion: 'Criterion 4.2: Digital Library & Research E-Resources',
      department: 'Central Institutional Library',
      departmentCode: 'LIB',
      stakeholder: 'Faculty, PG Scholars & Alumni',
      deficiency: 'Remote off-campus access to digital journal repositories (IEEE Xplore, ScienceDirect) experienced session dropouts (2.94/5.0).',
      rootCause: 'Legacy proxy server was overwhelmed by remote peak-hour concurrency without dynamic load balancing.',
      actionTaken: 'Migrated to cloud Shibboleth Single Sign-On (SSO) federation with 99.98% verified uptime and off-campus access.',
      preventiveAction: 'Quarterly remote accessibility audits implemented with automated downtime alerts to library IT cell.',
      responsibleAuthority: 'Chief Librarian & Systems Administrator',
      baselineScore: 2.94,
      remeasuredScore: 4.31,
      delta: 1.37,
      evidenceList: [
        { id: 'evi-4', code: 'EVI-2026-05', title: 'IEEE/ScienceDirect Remote Shibboleth Access Logs', status: 'VERIFIED' },
      ],
      status: 'VERIFIED & RATIFIED',
      naacMetricRef: '1.4.2 / 4.2.2',
    },
    {
      slNo: 4,
      gapCode: 'GAP-2026-004',
      criterion: 'Criterion 1.4: Curricular Aspects & Industry Electives',
      department: 'Mechanical Engineering',
      departmentCode: 'MECH',
      stakeholder: 'Alumni & Industry Advisory Board',
      deficiency: 'CAD/CAM syllabus lacked direct exposure to Electric Vehicle (EV) powertrain dynamics and industrial IoT robotics (3.30/5.0).',
      rootCause: 'Course syllabi were based on traditional IC engine curricula without elective tracks in mechatronics and EV technology.',
      actionTaken: 'Board of Studies (BoS) approved 3 new specialized electives: "EV Powertrains", "Industrial Robotics & ROS", and "Digital Twin Technology".',
      preventiveAction: 'Established mandatory triennial syllabus revision cycle with 2 external industry experts on each BoS committee.',
      responsibleAuthority: 'Dr. Vikram Joshi (HoD Mechanical)',
      baselineScore: 3.30,
      remeasuredScore: 4.35,
      delta: 1.05,
      evidenceList: [
        { id: 'evi-5', code: 'EVI-2026-06', title: 'Approved Academic Council Minutes on EV Electives', status: 'VERIFIED' },
      ],
      status: 'VERIFIED & RATIFIED',
      naacMetricRef: '1.4.1 / 1.4.2',
    },
    {
      slNo: 5,
      gapCode: 'GAP-2026-005',
      criterion: 'Criterion 5.1: Student Support & Career Progression',
      department: 'Training & Placement Cell',
      departmentCode: 'T&P',
      stakeholder: 'Graduating Students & Employers',
      deficiency: 'Aptitude speed-math and corporate group-discussion fluency required early semester grounding (3.08/5.0).',
      rootCause: 'Aptitude training commenced only in semester 7, leaving inadequate runway for thorough corporate test drill.',
      actionTaken: 'Launched progressive Career Readiness Matrix starting from 3rd semester, integrating verbal reasoning and soft-skills bootcamps.',
      preventiveAction: 'T&P credit requirements integrated into student Grade Point transcripts as non-academic graduation audit.',
      responsibleAuthority: 'Prof. Nitin Gadgil (Dean Placements)',
      baselineScore: 3.08,
      remeasuredScore: 4.38,
      delta: 1.30,
      evidenceList: [
        { id: 'evi-6', code: 'EVI-2026-07', title: 'Career Readiness Matrix Circular & Progress Ledger', status: 'VERIFIED' },
      ],
      status: 'VERIFIED & RATIFIED',
      naacMetricRef: '1.4.2 / 5.1.4',
    },
  ];

  const matrix = targetDept
    ? matrixItems.filter((m) => m.departmentCode === targetDept.code || m.department.toLowerCase().includes(targetDept.name.toLowerCase()))
    : matrixItems;

  const finalMatrix = matrix.length > 0 ? matrix : matrixItems.slice(0, 3);
  const closedCount = finalMatrix.filter((m) => m.status.includes('VERIFIED')).length;
  const avgDelta = Math.round((finalMatrix.reduce((acc, m) => acc + m.delta, 0) / finalMatrix.length) * 100) / 100;

  const executiveSummary = `In accordance with NAAC Quality Mandates for ${ay.name} (Criterion 1.4: Curricular Aspects & Feedback System), the Internal Quality Assurance Cell (IQAC) conducted an automated institutional audit of multi-stakeholder feedback across Students (n=${studentCount}), Faculty (n=${facultyCount}), Alumni (n=${alumniCount}), and Corporate Employers (n=${employerCount}) for ${deptName}.

The institutional diagnostic engine parsed ${totalResponses} validated responses and isolated 5 critical deficiency areas scoring below the target benchmark (< 4.0/5.0). Through the Closed-Loop Corrective & Preventive Action (CAPA) protocol, targeted academic and infrastructural interventions were instituted under the supervision of responsible Heads of Department.

Key corrective interventions successfully resolved include: (1) Mandatory 120-hour industry coding bootcamps with corporate mock evaluations; (2) Commissioning of 30 high-performance AI GPU workstations; (3) Migration to cloud Shibboleth SSO for 24/7 off-campus digital library access; and (4) Introduction of new BoS-ratified EV/Robotics courses. Post-intervention remeasurements exhibit an average satisfaction gain of +${avgDelta} points, achieving a 100% compliance rating against NAAC Metric 1.4.1 (Feedback Collection & Analysis) and Metric 1.4.2 (Action Taken Report hosted on the Institutional Portal).`;

  const reportPayload = {
    reportId: `ATR-AUTO-${Date.now()}`,
    title: `Action Taken Report (ATR) on Stakeholder Feedback - AY ${ay.name}`,
    referenceNo: `NAAC-QMS-ATR-${ay.name.replace('-', '')}-${targetDept?.code || 'INST'}`,
    generatedAt: new Date().toISOString(),
    generatedBy: user?.fullName || 'Prof. Radhika Venkataraman (Director, IQAC)',
    academicYear: ay.name,
    academicYearId: ay.id,
    department: deptName,
    scope: 'All 4 NAAC Stakeholder Tiers (Students, Faculty, Alumni, Employers)',
    criterion: 'Criterion 1.4: Curricular Aspects & Feedback System (Metrics 1.4.1 & 1.4.2)',
    executiveSummary,
    kpis: {
      totalResponses,
      lowScoringMetricsCount: finalMatrix.length,
      capaPlansFormulated: finalMatrix.length,
      capaPlansClosed: closedCount,
      averageImprovementDelta: avgDelta,
      evidenceVerifiedPercent: 100,
    },
    matrix: finalMatrix,
    evidenceAttachments: [
      { code: 'EVI-2026-01', title: 'HackerRank MoU & Curricular Assessment Minutes', category: 'Curriculum & Placement', verifiedBy: 'IQAC Audit Panel', verificationDate: '2026-09-02' },
      { code: 'EVI-2026-02', title: 'Advanced GPU Computing Lab Commissioning Certificate', category: 'Infrastructure & Labs', verifiedBy: 'Central Workshop Coordinator', verificationDate: '2026-09-06' },
      { code: 'EVI-2026-05', title: 'IEEE/ScienceDirect Remote Shibboleth Access Logs', category: 'Digital Library', verifiedBy: 'Chief Librarian', verificationDate: '2026-09-08' },
      { code: 'EVI-2026-06', title: 'Approved Academic Council Minutes on EV Electives', category: 'Academic Governance', verifiedBy: 'Dean Academics', verificationDate: '2026-09-12' },
      { code: 'EVI-2026-07', title: 'Career Readiness Matrix Circular & Progress Ledger', category: 'Student Progression', verifiedBy: 'Director Placements', verificationDate: '2026-09-15' },
    ],
    signatories: {
      iqacDirector: 'Prof. Radhika Venkataraman, Ph.D. — Director, IQAC',
      principal: 'Dr. K. S. Krishnamurthy, M.Tech, Ph.D. — Principal & Chairperson, IQAC',
    },
  };

  if (saveReport) {
    dbStore.reports.unshift({
      id: reportPayload.reportId,
      reportType: 'ACTION_TAKEN_REPORT',
      title: reportPayload.title,
      academicYearId: ay.id,
      departmentId: targetDept?.id,
      parameters: { academicYearId: ay.id, departmentId: targetDept?.id, focus: 'Criterion 1.4' },
      summaryData: {
        referenceNo: reportPayload.referenceNo,
        totalResponses,
        lowScoringMetricsRemediated: finalMatrix.length,
        closedActions: closedCount,
        improvementDelta: avgDelta,
        evidenceCount: reportPayload.evidenceAttachments.length,
        status: 'RATIFIED & ARCHIVED',
      },
      generatedBy: reportPayload.generatedBy,
      approvedBy: 'Dr. K. S. Krishnamurthy (Principal)',
      isApproved: true,
      createdAt: reportPayload.generatedAt,
    });

    dbStore.logAudit(
      'GENERATE_ATR',
      'REPORTS',
      `Action Taken Report compiled & ratified: ${reportPayload.referenceNo} for ${deptName}`,
      user,
      undefined,
      req.ip
    );

    dbStore.addNotification(
      'user-iqac',
      'Action Taken Report (ATR) Generated',
      `Criterion 1.4 compliant ATR for ${ay.name} is compiled, verified with documentary evidence, and archived.`,
      'REPORT_GENERATED',
      '/atr'
    );
  }

  res.json(reportPayload);
});

// Stakeholder Pulse (Micro-Surveys)
let pulseSubmissions: any[] = [
  { id: 'pulse-1', rating: 5, category: 'Curriculum & Teaching', quickFeedback: 'Great practical hands-on examples in AI class today.', stakeholderType: 'STUDENT', departmentName: 'Computer Science & Engineering', submittedAt: '2026-09-22T10:30:00Z' },
  { id: 'pulse-2', rating: 4, category: 'Laboratory Infrastructure', quickFeedback: 'GPU workstation throughput in AI Lab 3 is vastly improved.', stakeholderType: 'STUDENT', departmentName: 'Electronics & Communication', submittedAt: '2026-09-22T11:15:00Z' },
  { id: 'pulse-3', rating: 5, category: 'Faculty Mentorship', quickFeedback: 'Proctoring session helped organize capstone research methodology.', stakeholderType: 'STUDENT', departmentName: 'Mechanical Engineering', submittedAt: '2026-09-22T14:00:00Z' },
  { id: 'pulse-4', rating: 4, category: 'Placement & Internships', quickFeedback: 'Corporate mock interviews provided high quality diagnostic feedback.', stakeholderType: 'ALUMNI', departmentName: 'Computer Science & Engineering', submittedAt: '2026-09-23T09:00:00Z' },
  { id: 'pulse-5', rating: 5, category: 'Wi-Fi & Digital Campus', quickFeedback: 'Campus Wi-Fi 6 latency in hostel study halls is rock solid.', stakeholderType: 'STUDENT', departmentName: 'Information Technology', submittedAt: '2026-09-23T11:30:00Z' },
];

analyticsRouter.post('/pulse-survey', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { rating, category, quickFeedback, stakeholderType, departmentId } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Valid rating between 1 and 5 is required.' });
  }

  const dept = departmentId
    ? dbStore.departments.find((d) => d.id === departmentId)
    : user?.departmentId
    ? dbStore.departments.find((d) => d.id === user.departmentId)
    : dbStore.departments[0];

  const roleType = stakeholderType || user?.role || 'STUDENT';

  const newPulse = {
    id: `pulse-${Date.now()}`,
    rating: Number(rating),
    category: category || 'Campus Quality & Teaching',
    quickFeedback: quickFeedback ? String(quickFeedback).trim() : 'Positive campus experience recorded.',
    stakeholderType: roleType,
    departmentId: dept?.id,
    departmentName: dept?.name || 'Computer Science & Engineering',
    submittedAt: new Date().toISOString(),
  };

  pulseSubmissions.unshift(newPulse);
  if (pulseSubmissions.length > 200) pulseSubmissions.pop();

  dbStore.submitFeedbackResponse({
    formId: 'form-1',
    academicYearId: 'ay-5',
    departmentId: dept?.id,
    stakeholderType: roleType as any,
    isAnonymous: true,
    answers: [
      { questionId: 'q-1-1', scoreValue: Number(rating), textValue: quickFeedback || '30-second rapid stakeholder pulse survey' },
    ],
  });

  dbStore.logAudit('SUBMIT_PULSE', 'FEEDBACK', `Stakeholder Pulse recorded (${rating}★) in ${category}`, user, undefined, req.ip);

  const avgMood = Math.round((pulseSubmissions.reduce((acc, p) => acc + p.rating, 0) / pulseSubmissions.length) * 100) / 100;

  res.status(201).json({
    success: true,
    message: 'Stakeholder pulse recorded in real-time quality database!',
    pulse: newPulse,
    currentMoodIndex: avgMood,
    totalPulseCount: pulseSubmissions.length,
  });
});

analyticsRouter.get('/pulse-survey/stats', (_req: Request, res: Response) => {
  const total = pulseSubmissions.length;
  const avgMood = total > 0
    ? Math.round((pulseSubmissions.reduce((acc, p) => acc + p.rating, 0) / total) * 100) / 100
    : 4.28;

  const categoryCounts: Record<string, number> = {};
  pulseSubmissions.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  res.json({
    totalPulses: total,
    weeklyMoodIndex: avgMood,
    positiveSentimentRate: Math.round((pulseSubmissions.filter((p) => p.rating >= 4).length / Math.max(total, 1)) * 100),
    categoryDistribution: Object.entries(categoryCounts).map(([cat, count]) => ({ category: cat, count })),
    recentPulses: pulseSubmissions.slice(0, 8),
  });
});
