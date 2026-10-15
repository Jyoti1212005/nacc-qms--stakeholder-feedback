import {
  Department,
  Programme,
  AcademicYear,
  User,
  Stakeholder,
  FeedbackForm,
  FeedbackResponse,
  FeedbackCategory,
  RoleCategoryMapping,
  QuestionTemplate,
  DynamicSurveyGenerationRequest,
  FeedbackSection,
  FeedbackQuestion,
  QualityCategory,
  QualityIndicator,
  QualityGap,
  ActionPlan,
  EvidenceItem,
  AIInsightItem,
  NotificationItem,
  AuditLogItem,
  ReportItem,
  ClosingTheLoopItem,
} from './types.ts';
import {
  initialDepartments,
  initialProgrammes,
  initialAcademicYears,
  initialUsers,
  initialQualityCategories,
  initialQualityIndicators,
  initialFeedbackForms,
  initialQualityGaps,
  initialActionPlans,
  initialEvidenceItems,
  initialAIInsights,
  initialNotifications,
  initialAuditLogs,
  generateSeedStakeholders,
  generateSeedResponses,
} from './seedData.ts';
import {
  initialFeedbackCategories,
  initialRoleCategoryMappings,
  initialQuestionTemplates,
} from './formBuilderData.ts';
import {
  initialClosingTheLoopItems,
} from './closingTheLoopData.ts';
import { isSupabaseConnected } from './config/supabase.ts';
import {
  UserModel,
  DepartmentModel,
  ProgrammeModel,
  AcademicYearModel,
  StakeholderModel,
  FeedbackFormModel,
  FeedbackResponseModel,
  QualityCategoryModel,
  QualityIndicatorModel,
  QualityGapModel,
  ActionPlanModel,
  EvidenceModel,
  AIInsightModel,
  NotificationModel,
  AuditLogModel,
  ReportModel,
  ClosingTheLoopModel,
  FeedbackCategoryModel,
  RoleCategoryMappingModel,
  QuestionTemplateModel,
} from './models/index.ts';

class DatabaseStore {
  departments: Department[] = [];
  programmes: Programme[] = [];
  academicYears: AcademicYear[] = [];
  users: User[] = [];
  stakeholders: Stakeholder[] = [];
  feedbackForms: FeedbackForm[] = [];
  feedbackResponses: FeedbackResponse[] = [];
  qualityCategories: QualityCategory[] = [];
  qualityIndicators: QualityIndicator[] = [];
  qualityGaps: QualityGap[] = [];
  actionPlans: ActionPlan[] = [];
  evidenceItems: EvidenceItem[] = [];
  aiInsights: AIInsightItem[] = [];
  notifications: NotificationItem[] = [];
  auditLogs: AuditLogItem[] = [];
  reports: ReportItem[] = [];
  feedbackCategories: FeedbackCategory[] = [];
  roleCategoryMappings: RoleCategoryMapping[] = [];
  questionTemplates: QuestionTemplate[] = [];
  closingTheLoopItems: ClosingTheLoopItem[] = [];

  // Internal Quality Improvement Index Weights (Configurable)
  qualityWeights = {
    stakeholderSatisfaction: 0.30,
    responseRate: 0.15,
    actionClosureRate: 0.25,
    improvementDelta: 0.15,
    evidenceCompleteness: 0.15,
  };

  constructor() {
    this.seed();
  }

  // Sync latest data from Supabase into application store
  async syncFromSupabase() {
    if (!isSupabaseConnected()) return;

    try {
      console.log('[Supabase Sync] Loading latest data from Supabase into application store...');
      const [
        users,
        departments,
        programmes,
        academicYears,
        stakeholders,
        feedbackForms,
        feedbackResponses,
        qualityCategories,
        qualityIndicators,
        qualityGaps,
        actionPlans,
        closingTheLoopItems,
        evidenceItems,
        aiInsights,
        reports,
        notifications,
        auditLogs,
        feedbackCategories,
        roleCategoryMappings,
        questionTemplates,
      ] = await Promise.all([
        UserModel.find().lean(),
        DepartmentModel.find().lean(),
        ProgrammeModel.find().lean(),
        AcademicYearModel.find().lean(),
        StakeholderModel.find().lean(),
        FeedbackFormModel.find().lean(),
        FeedbackResponseModel.find().lean(),
        QualityCategoryModel.find().lean(),
        QualityIndicatorModel.find().lean(),
        QualityGapModel.find().lean(),
        ActionPlanModel.find().lean(),
        ClosingTheLoopModel.find().lean(),
        EvidenceModel.find().lean(),
        AIInsightModel.find().lean(),
        ReportModel.find().lean(),
        NotificationModel.find().lean(),
        AuditLogModel.find().lean(),
        FeedbackCategoryModel.find().lean(),
        RoleCategoryMappingModel.find().lean(),
        QuestionTemplateModel.find().lean(),
      ]);

      if (departments.length > 0) this.departments = departments as any;
      if (programmes.length > 0) this.programmes = programmes as any;
      if (academicYears.length > 0) this.academicYears = academicYears as any;
      if (stakeholders.length > 0) this.stakeholders = stakeholders as any;
      if (users.length > 0) {
        const cleanUsers = (users as any[]).filter(
          (u) =>
            !/^(jyoti|ghjhujk|hello|sourabh)/i.test(u.fullName) &&
            !u.email?.includes('test') &&
            !u.id?.startsWith('usr-179')
        );
        const userMap = new Map<string, User>();
        // Add dynamic/registered users first
        cleanUsers.forEach((u) => userMap.set(u.id, u));
        // Ensure institutional college staff, leadership, and student personas from initialUsers take precedence
        initialUsers.forEach((u) => {
          userMap.set(u.id, u);
          UserModel.findOneAndUpdate({ id: u.id }, { $set: u }).catch(() => {});
        });
        this.users = Array.from(userMap.values());
      } else {
        this.users = [...initialUsers];
        for (const u of initialUsers) {
          UserModel.findOneAndUpdate({ id: u.id }, { $set: u }).catch(() => {});
        }
      }
      if (feedbackForms.length > 0) this.feedbackForms = feedbackForms as any;
      if (feedbackResponses.length > 0) this.feedbackResponses = feedbackResponses as any;
      if (qualityCategories.length > 0) this.qualityCategories = qualityCategories as any;
      if (qualityIndicators.length > 0) this.qualityIndicators = qualityIndicators as any;
      if (qualityGaps.length > 0) this.qualityGaps = qualityGaps as any;
      if (actionPlans.length > 0) this.actionPlans = actionPlans as any;
      if (closingTheLoopItems.length > 0) this.closingTheLoopItems = closingTheLoopItems as any;
      if (evidenceItems.length > 0) this.evidenceItems = evidenceItems as any;
      if (aiInsights.length > 0) this.aiInsights = aiInsights as any;
      if (reports.length > 0) this.reports = reports as any;
      if (notifications.length > 0) this.notifications = notifications as any;
      if (auditLogs.length > 0) this.auditLogs = auditLogs as any;
      if (feedbackCategories.length > 0) this.feedbackCategories = feedbackCategories as any;
      if (roleCategoryMappings.length > 0) this.roleCategoryMappings = roleCategoryMappings as any;
      if (questionTemplates.length > 0) this.questionTemplates = questionTemplates as any;

      console.log(`[Supabase Sync] Synchronized ${users.length} users, ${feedbackForms.length} forms, ${feedbackResponses.length} responses.`);
    } catch (err: any) {
      console.error('[Supabase Sync] Error syncing data:', err.message);
    }
  }

  // Alias for backward compatibility
  async syncFromMongo() {
    return this.syncFromSupabase();
  }

  // Safe background persistence helper
  persistAsync(model: any, doc: any) {
    if (isSupabaseConnected() && doc && doc.id) {
      model.findOneAndUpdate({ id: doc.id }, { $set: doc }).catch((err: any) => {
        console.error(`[Supabase] Upsert error in ${model.tableName || 'table'}:`, err.message);
      });
    }
  }

  deleteAsync(model: any, id: string) {
    if (isSupabaseConnected() && id) {
      model.deleteOne({ id }).catch((err: any) => {
        console.error(`[Supabase] Delete error in ${model.tableName || 'table'}:`, err.message);
      });
    }
  }

  getDatabaseStatus() {
    return {
      connected: isSupabaseConnected(),
      provider: isSupabaseConnected() ? 'Supabase (PostgreSQL Cloud)' : 'In-Memory State Store (Fallback)',
      database: isSupabaseConnected() ? 'Supabase' : 'memory',
      status: isSupabaseConnected() ? 'ONLINE' : 'STANDALONE_FALLBACK',
      counts: {
        users: this.users.length,
        departments: this.departments.length,
        programmes: this.programmes.length,
        feedbackForms: this.feedbackForms.length,
        feedbackResponses: this.feedbackResponses.length,
        qualityIndicators: this.qualityIndicators.length,
        qualityGaps: this.qualityGaps.length,
        actionPlans: this.actionPlans.length,
        evidenceItems: this.evidenceItems.length,
        closingTheLoop: this.closingTheLoopItems.length,
        reports: this.reports.length,
        auditLogs: this.auditLogs.length,
      },
    };
  }

  private seed() {
    this.departments = [...initialDepartments];
    this.programmes = [...initialProgrammes];
    this.academicYears = [...initialAcademicYears];
    this.users = [...initialUsers];
    this.qualityCategories = [...initialQualityCategories];
    this.qualityIndicators = [...initialQualityIndicators];
    this.feedbackForms = JSON.parse(JSON.stringify(initialFeedbackForms));
    this.qualityGaps = [...initialQualityGaps];
    this.actionPlans = [...initialActionPlans];
    this.evidenceItems = [...initialEvidenceItems];
    this.aiInsights = [...initialAIInsights];
    this.notifications = [...initialNotifications];
    this.auditLogs = [...initialAuditLogs];
    this.feedbackCategories = JSON.parse(JSON.stringify(initialFeedbackCategories));
    this.roleCategoryMappings = JSON.parse(JSON.stringify(initialRoleCategoryMappings));
    this.questionTemplates = JSON.parse(JSON.stringify(initialQuestionTemplates));
    this.closingTheLoopItems = JSON.parse(JSON.stringify(initialClosingTheLoopItems));

    // Generate realistic stakeholders and 1000+ responses
    this.stakeholders = generateSeedStakeholders();
    this.feedbackResponses = generateSeedResponses(this.stakeholders);

    // Add initial Reports
    this.reports = [
      {
        id: 'rep-1',
        reportType: 'IQAC_ANNUAL',
        title: 'IQAC Annual Institutional Quality & Stakeholder Feedback Audit (AY 2026-27)',
        academicYearId: 'ay-5',
        parameters: { scope: 'Institutional', cycle: 'Cycle 3' },
        summaryData: { totalResponses: 780, averageSatisfaction: 4.14, qualityIndex: 84.6, openActions: 2, closedActions: 1 },
        generatedBy: 'Prof. Radhika Venkataraman (IQAC Director)',
        approvedBy: 'Dr. K. S. Krishnamurthy (Principal)',
        isApproved: true,
        createdAt: '2026-09-15T12:00:00Z',
      },
      {
        id: 'rep-2',
        reportType: 'ATR',
        title: 'Comprehensive Action Taken Report (ATR) on Stakeholder Feedback 2026',
        academicYearId: 'ay-5',
        parameters: { focusArea: 'Placement & Labs' },
        summaryData: { gapsAddressed: 3, verifiedDeltas: '+1.37 in Library, +1.16 in AI Labs', status: 'Approved' },
        generatedBy: 'Prof. Radhika Venkataraman (IQAC Director)',
        approvedBy: 'Governing Council',
        isApproved: true,
        createdAt: '2026-09-18T10:00:00Z',
      },
    ];
  }

  // Audit Logger
  logAudit(action: string, module: string, description: string, user?: User | null, metadata?: any, ip = '127.0.0.1') {
    const log: AuditLogItem = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user ? user.id : 'system',
      userName: user ? user.fullName : 'System Automation',
      userRole: user ? user.role : 'SYSTEM',
      action,
      module,
      description,
      ipAddress: ip,
      metadata,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 500) this.auditLogs.pop();
    this.persistAsync(AuditLogModel, log);
    return log;
  }

  // Notifications
  addNotification(userId: string, title: string, message: string, type: string, linkUrl?: string) {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      type,
      linkUrl,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    this.persistAsync(NotificationModel, notif);
    return notif;
  }

  // Quality Index Calculation
  calculateQualityIndex(ayId = 'ay-5', deptId?: string) {
    // 1. Average Satisfaction (0 - 100)
    let responses = this.feedbackResponses.filter((r) => r.academicYearId === ayId);
    if (deptId) {
      responses = responses.filter((r) => r.departmentId === deptId);
    }
    const avgScore = responses.length > 0
      ? responses.reduce((acc, r) => acc + r.overallScore, 0) / responses.length
      : 4.0;
    const satisfactionScore100 = (avgScore / 5.0) * 100;

    // 2. Response Rate (0 - 100)
    let relevantStakeholders = this.stakeholders;
    if (deptId) {
      relevantStakeholders = relevantStakeholders.filter((s) => s.departmentId === deptId);
    }
    const responseRate = Math.min(100, Math.round((responses.length / Math.max(relevantStakeholders.length, 1)) * 100));

    // 3. Action Closure Rate (0 - 100)
    let actions = this.actionPlans;
    if (deptId) {
      actions = actions.filter((a) => a.departmentId === deptId);
    }
    const closedCount = actions.filter((a) => a.status === 'CLOSED' || a.status === 'COMPLETED').length;
    const actionClosureRate = actions.length > 0 ? (closedCount / actions.length) * 100 : 80;

    // 4. Improvement Delta (0 - 100)
    // Compare closed actions with before & after scores
    const closedWithDeltas = actions.filter((a) => a.beforeScore && a.afterScore);
    const avgDelta = closedWithDeltas.length > 0
      ? closedWithDeltas.reduce((acc, a) => acc + ((a.afterScore! - a.beforeScore!) / a.beforeScore!), 0) / closedWithDeltas.length
      : 0.18; // default ~18% improvement
    const improvementScore = Math.min(100, Math.max(40, Math.round((avgDelta / 0.3) * 100)));

    // 5. Evidence Completeness (0 - 100)
    let evis = this.evidenceItems;
    if (deptId) {
      evis = evis.filter((e) => e.departmentId === deptId);
    }
    const verifiedEvis = evis.filter((e) => e.verificationStatus === 'VERIFIED').length;
    const evidenceScore = evis.length > 0 ? (verifiedEvis / evis.length) * 100 : 75;

    // Weighted composite
    const w = this.qualityWeights;
    const totalIndex = Math.round(
      (satisfactionScore100 * w.stakeholderSatisfaction +
        responseRate * w.responseRate +
        actionClosureRate * w.actionClosureRate +
        improvementScore * w.improvementDelta +
        evidenceScore * w.evidenceCompleteness) * 10
    ) / 10;

    // Status mapping (INTERNAL indicator, NOT NAAC grade)
    let statusLabel: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL' = 'GOOD';
    if (totalIndex >= 85) statusLabel = 'EXCELLENT';
    else if (totalIndex >= 70) statusLabel = 'GOOD';
    else if (totalIndex >= 55) statusLabel = 'NEEDS_ATTENTION';
    else statusLabel = 'CRITICAL';

    return {
      totalIndex,
      statusLabel,
      components: {
        satisfactionScore: Math.round(satisfactionScore100 * 10) / 10,
        averageSatisfactionOutOf5: Math.round(avgScore * 100) / 100,
        responseRatePercent: responseRate,
        actionClosureRatePercent: Math.round(actionClosureRate * 10) / 10,
        improvementDeltaPercent: Math.round(improvementScore * 10) / 10,
        evidenceCompletenessPercent: Math.round(evidenceScore * 10) / 10,
      },
      weights: this.qualityWeights,
      totalResponses: responses.length,
      activeSurveys: this.feedbackForms.filter((f) => f.status === 'PUBLISHED').length,
      openActions: actions.filter((a) => a.status !== 'CLOSED' && a.status !== 'COMPLETED').length,
      closedActions: closedCount,
      pendingEvidence: evis.filter((e) => e.verificationStatus === 'PENDING').length,
      criticalGapsCount: this.qualityGaps.filter((g) => g.priority === 'CRITICAL' || g.priority === 'HIGH').length,
    };
  }

  // Dashboard Aggregates
  getDashboardAnalytics(filter: { academicYearId?: string; departmentId?: string; stakeholderType?: string }) {
    let responses = this.feedbackResponses;
    if (filter.academicYearId) {
      responses = responses.filter((r) => r.academicYearId === filter.academicYearId);
    }
    if (filter.departmentId) {
      responses = responses.filter((r) => r.departmentId === filter.departmentId);
    }
    if (filter.stakeholderType) {
      responses = responses.filter((r) => r.stakeholderType === filter.stakeholderType);
    }

    // 1. Stakeholder-wise distribution
    const stakeholderCounts: Record<string, number> = {};
    const stakeholderScores: Record<string, { total: number; count: number }> = {};
    responses.forEach((r) => {
      stakeholderCounts[r.stakeholderType] = (stakeholderCounts[r.stakeholderType] || 0) + 1;
      if (!stakeholderScores[r.stakeholderType]) stakeholderScores[r.stakeholderType] = { total: 0, count: 0 };
      stakeholderScores[r.stakeholderType].total += r.overallScore;
      stakeholderScores[r.stakeholderType].count += 1;
    });

    const stakeholderDistribution = Object.keys(stakeholderCounts).map((type) => ({
      type,
      count: stakeholderCounts[type],
      average: Math.round((stakeholderScores[type].total / stakeholderScores[type].count) * 100) / 100,
    }));

    // Comprehensive Stakeholder Role Engagement Overview with Targets & Response Rates (Navy & Peach palette)
    const stakeholderRoleConfig: Record<string, { label: string; target: number; color: string; category: string }> = {
      STUDENT: { label: 'Students (UG/PG)', target: 600, color: '#ff7a50', category: 'Internal Academic' },
      FACULTY: { label: 'Faculty Members', target: 120, color: '#0a192f', category: 'Internal Academic' },
      ALUMNI: { label: 'Alumni Network', target: 150, color: '#132c52', category: 'External Community' },
      EMPLOYER: { label: 'Industry Employers', target: 50, color: '#ffa07a', category: 'External Community' },
      PARENT: { label: 'Parents & Guardians', target: 200, color: '#1e3a5f', category: 'External Community' },
      NON_TEACHING: { label: 'Administrative Staff', target: 50, color: '#fed7aa', category: 'Internal Administrative' },
      TECHNICAL_STAFF: { label: 'Technical Staff', target: 40, color: '#c2410c', category: 'Internal Administrative' },
    };

    const stakeholderEngagementOverview = Object.entries(stakeholderRoleConfig).map(([roleKey, meta]) => {
      const actualCount = stakeholderCounts[roleKey] !== undefined
        ? stakeholderCounts[roleKey]
        : (roleKey === 'STUDENT' ? 495 : roleKey === 'FACULTY' ? 112 : roleKey === 'ALUMNI' ? 118 : roleKey === 'EMPLOYER' ? 44 : roleKey === 'PARENT' ? 152 : roleKey === 'NON_TEACHING' ? 42 : 35);
      const target = meta.target;
      const responseRate = Math.min(100, Math.round((actualCount / target) * 1000) / 10);
      const avgScore = stakeholderScores[roleKey]?.count
        ? Math.round((stakeholderScores[roleKey].total / stakeholderScores[roleKey].count) * 100) / 100
        : (roleKey === 'STUDENT' ? 4.18 : roleKey === 'FACULTY' ? 4.35 : roleKey === 'ALUMNI' ? 4.05 : roleKey === 'EMPLOYER' ? 4.25 : 4.12);

      return {
        role: meta.label,
        roleKey,
        category: meta.category,
        responsesCount: actualCount,
        targetResponses: target,
        responseRate,
        averageScore: avgScore,
        color: meta.color,
        status: responseRate >= 80 ? 'High' : responseRate >= 65 ? 'Moderate' : 'Needs Follow-up',
      };
    });

    // 2. Department-wise satisfaction
    const deptData = this.departments.map((dept) => {
      const deptResponses = responses.filter((r) => r.departmentId === dept.id);
      const avg = deptResponses.length > 0
        ? Math.round((deptResponses.reduce((a, b) => a + b.overallScore, 0) / deptResponses.length) * 100) / 100
        : 4.0;
      return {
        departmentId: dept.id,
        code: dept.code,
        name: dept.name,
        averageSatisfaction: avg,
        responsesCount: deptResponses.length,
      };
    });

    // 3. Year-wise comparison trend
    const yearTrend = this.academicYears.map((ay) => {
      const ayResponses = this.feedbackResponses.filter((r) => r.academicYearId === ay.id);
      const avg = ayResponses.length > 0
        ? Math.round((ayResponses.reduce((a, b) => a + b.overallScore, 0) / ayResponses.length) * 100) / 100
        : 3.9 + (ay.name === '2026-27' ? 0.24 : 0);
      return {
        academicYear: ay.name,
        academicYearId: ay.id,
        averageSatisfaction: avg,
        responsesCount: ayResponses.length || (ay.name === '2026-27' ? 750 : ay.name === '2025-26' ? 580 : 420),
        target: 4.2,
      };
    });

    // 4. Parameter-wise performance
    const parameters = [
      { name: 'Curriculum Relevance', score: 4.15, target: 4.5, category: 'Curriculum' },
      { name: 'Teaching Effectiveness', score: 4.22, target: 4.3, category: 'Pedagogy' },
      { name: 'ICT & LMS Usage', score: 4.41, target: 4.5, category: 'Pedagogy' },
      { name: 'Lab Facilities', score: 3.42, target: 4.3, category: 'Infrastructure' },
      { name: 'Digital Library', score: 4.25, target: 4.4, category: 'Infrastructure' },
      { name: 'Placement Support', score: 3.08, target: 4.2, category: 'Student Support' },
      { name: 'Mentorship', score: 4.18, target: 4.0, category: 'Student Support' },
      { name: 'Campus Safety', score: 4.45, target: 4.5, category: 'Institutional Values' },
    ];

    // 5. Positive / Neutral / Negative sentiment breakdown
    let positive = 0;
    let neutral = 0;
    let negative = 0;
    responses.forEach((r) => {
      if (r.overallScore >= 4.0) positive++;
      else if (r.overallScore >= 3.0) neutral++;
      else negative++;
    });

    // 6. Funnel: Feedback -> Gap -> Action -> Verification -> Closure
    const funnel = [
      { stage: 'Feedback Responses', count: responses.length, color: '#3b82f6' },
      { stage: 'Identified Quality Gaps', count: this.qualityGaps.length, color: '#f59e0b' },
      { stage: 'CAPA Action Plans', count: this.actionPlans.length, color: '#8b5cf6' },
      { stage: 'Evidence Under Review', count: this.evidenceItems.filter((e) => e.verificationStatus === 'PENDING').length + 1, color: '#ec4899' },
      { stage: 'Verified Improvements', count: this.actionPlans.filter((a) => a.status === 'CLOSED').length + 1, color: '#10b981' },
    ];

    return {
      stakeholderDistribution,
      stakeholderEngagementOverview,
      deptData,
      yearTrend,
      parameters,
      sentimentBreakdown: [
        { name: 'Positive (≥ 4.0)', value: positive || 540, fill: '#10b981' },
        { name: 'Neutral (3.0 - 3.9)', value: neutral || 160, fill: '#f59e0b' },
        { name: 'Needs Attention (< 3.0)', value: negative || 50, fill: '#ef4444' },
      ],
      funnel,
    };
  }

  // Feedback Submission handler
  submitFeedbackResponse(data: {
    formId: string;
    academicYearId: string;
    departmentId?: string;
    programmeId?: string;
    stakeholderId?: string;
    userId?: string;
    isAnonymous: boolean;
    stakeholderType: any;
    answers: { questionId: string; scoreValue?: number; textValue?: string; optionValues?: string[] }[];
  }) {
    // Calculate average score
    const scoredAnswers = data.answers.filter((a) => typeof a.scoreValue === 'number');
    const overallScore = scoredAnswers.length > 0
      ? Math.round((scoredAnswers.reduce((acc, a) => acc + a.scoreValue!, 0) / scoredAnswers.length) * 10) / 10
      : 4.0;
    const sentimentScore = Math.round((overallScore - 3.0) / 2 * 100) / 100;

    const response: FeedbackResponse = {
      id: `resp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      formId: data.formId,
      academicYearId: data.academicYearId,
      departmentId: data.departmentId,
      programmeId: data.programmeId,
      stakeholderId: data.isAnonymous ? undefined : data.stakeholderId,
      userId: data.isAnonymous ? undefined : data.userId,
      isAnonymous: data.isAnonymous,
      stakeholderType: data.stakeholderType,
      overallScore,
      sentimentScore,
      submittedAt: new Date().toISOString(),
      answers: data.answers,
    };

    this.feedbackResponses.unshift(response);
    this.persistAsync(FeedbackResponseModel, response);

    // Update form response count & average
    const form = this.feedbackForms.find((f) => f.id === data.formId);
    if (form) {
      form.responseCount += 1;
      const formResponses = this.feedbackResponses.filter((r) => r.formId === form.id);
      const totalScore = formResponses.reduce((acc, r) => acc + r.overallScore, 0);
      form.averageScore = Math.round((totalScore / formResponses.length) * 100) / 100;
      this.persistAsync(FeedbackFormModel, form);
    }

    // Auto-detect if low score triggers a Quality Gap (< 3.0)
    if (overallScore < 3.0 && scoredAnswers.length > 0) {
      const lowScored = scoredAnswers.find((a) => (a.scoreValue || 5) < 3.0);
      if (lowScored) {
        // Look up question details
        let foundQuestion = null;
        for (const sec of form?.sections || []) {
          const q = sec.questions.find((x) => x.id === lowScored.questionId);
          if (q) {
            foundQuestion = q;
            break;
          }
        }
        if (foundQuestion) {
          const existingGap = this.qualityGaps.find((g) => g.parameter === foundQuestion.parameter && g.departmentId === data.departmentId);
          if (!existingGap) {
            const newGap: QualityGap = {
              id: `gap-${Date.now()}`,
              parameter: foundQuestion.parameter,
              category: foundQuestion.category || 'General Quality',
              departmentId: data.departmentId,
              academicYearId: data.academicYearId,
              currentScore: lowScored.scoreValue || 2.5,
              targetScore: 4.2,
              gapValue: Math.round(((lowScored.scoreValue || 2.5) - 4.2) * 100) / 100,
              priority: 'HIGH',
              responsesCount: 1,
              affectedGroups: [data.stakeholderType],
              suggestedAction: `Investigate low performance in ${foundQuestion.parameter} and formulate departmental CAPA.`,
              isVerified: false,
              status: 'DETECTED',
              createdAt: new Date().toISOString(),
            };
            this.qualityGaps.unshift(newGap);
            this.persistAsync(QualityGapModel, newGap);
            this.addNotification('user-iqac', 'New Quality Gap Detected', `Low score (${lowScored.scoreValue}/5) registered on ${foundQuestion.parameter}.`, 'GAP_DETECTED', '/gaps');
          }
        }
      }
    }

    this.logAudit('SUBMIT', 'FEEDBACK', `Submitted feedback for form ${form?.code || data.formId} (Anonymous: ${data.isAnonymous})`);
    return response;
  }
  // Dynamic form builder and role category mappings

  getRoleCategoryMappings(role?: string): (RoleCategoryMapping & { category?: FeedbackCategory; questionCount: number })[] {
    let mappings = this.roleCategoryMappings;
    if (role) {
      mappings = mappings.filter((m) => m.role === role);
    }
    return mappings.map((m) => {
      const cat = this.feedbackCategories.find((c) => c.id === m.categoryId);
      const qCount = this.questionTemplates.filter(
        (qt) => qt.categoryId === m.categoryId && (role ? qt.applicableRoles.includes(role as any) : true)
      ).length;
      return {
        ...m,
        category: cat,
        categoryName: cat?.name || m.categoryId,
        questionCount: qCount,
      };
    });
  }

  getQuestionTemplates(role?: string, categoryId?: string): QuestionTemplate[] {
    let templates = this.questionTemplates;
    if (role) {
      templates = templates.filter((qt) => qt.applicableRoles.includes(role as any));
    }
    if (categoryId) {
      templates = templates.filter((qt) => qt.categoryId === categoryId);
    }
    return templates.map((t) => {
      const cat = this.feedbackCategories.find((c) => c.id === t.categoryId);
      return {
        ...t,
        categoryName: cat?.name || t.categoryId,
      };
    });
  }

  generateDynamicSurveyByRole(
    req: DynamicSurveyGenerationRequest,
    user?: any
  ): {
    form: FeedbackForm;
    mappedCategories: (FeedbackCategory & { questionCount: number })[];
    questionCount: number;
  } {
    const targetRole = req.targetRole;
    // 1. Look up role-to-category mappings
    let roleMappings = this.roleCategoryMappings.filter((m) => m.role === targetRole);
    if (roleMappings.length === 0) {
      roleMappings = this.roleCategoryMappings.filter((m) =>
        m.role.toString().toLowerCase().includes(targetRole.toLowerCase())
      );
    }
    if (roleMappings.length === 0) {
      roleMappings = this.roleCategoryMappings.slice(0, 3);
    }

    // Sort by priority order
    roleMappings.sort((a, b) => a.priorityOrder - b.priorityOrder);

    // If specific categories selected, filter
    if (req.selectedCategoryIds && req.selectedCategoryIds.length > 0) {
      roleMappings = roleMappings.filter((m) => req.selectedCategoryIds!.includes(m.categoryId));
    }

    const sections: FeedbackSection[] = [];
    const mappedCategoriesInfo: (FeedbackCategory & { questionCount: number })[] = [];
    let totalQuestions = 0;
    const formId = `form-dyn-${Date.now()}`;

    roleMappings.forEach((mapping, secIdx) => {
      const cat = this.feedbackCategories.find((c) => c.id === mapping.categoryId);
      if (!cat) return;

      // Filter Question Templates for this role and category
      let templates = this.questionTemplates.filter(
        (qt) => qt.categoryId === cat.id && qt.applicableRoles.includes(targetRole as any)
      );

      if (templates.length === 0) {
        templates = this.questionTemplates.filter((qt) => qt.categoryId === cat.id);
      }

      if (templates.length > 0) {
        const secId = `sec-dyn-${Date.now()}-${secIdx + 1}`;
        const questions: FeedbackQuestion[] = templates.map((qt, qIdx) => ({
          id: `q-dyn-${Date.now()}-${secIdx + 1}-${qIdx + 1}`,
          sectionId: secId,
          prompt: qt.prompt,
          questionType: qt.questionType,
          parameter: qt.parameter,
          category: cat.name,
          isRequired: qt.isRequired,
          orderIndex: qIdx + 1,
          scaleMax: qt.scaleMax || 5,
          options: qt.options,
        }));

        sections.push({
          id: secId,
          formId,
          title: `Section ${secIdx + 1}: ${cat.name}`,
          description: `${mapping.focusDescription} (${cat.naacCriterion})`,
          category: cat.naacCriterion,
          orderIndex: secIdx + 1,
          questions,
        });

        totalQuestions += questions.length;
        mappedCategoriesInfo.push({
          ...cat,
          questionCount: questions.length,
        });
      }
    });

    const newForm: FeedbackForm = {
      id: formId,
      code: req.code || `FB-DYN-${targetRole.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: req.title || `${targetRole} Dynamic Quality & Pedagogical Survey (${req.academicYearId || '2026-27'})`,
      description:
        req.description ||
        `Role-tailored feedback survey generated dynamically via the Role-to-Category Relationship Table for ${targetRole}. Covers ${mappedCategoriesInfo.length} mapped quality categories across ${totalQuestions} calibrated questions.`,
      targetType: (['STUDENT', 'FACULTY', 'NON_TEACHING', 'TECHNICAL_STAFF', 'ALUMNI', 'EMPLOYER', 'PARENT', 'INDUSTRY_PARTNER', 'ACADEMIC_EXPERT'].includes(
        targetRole
      )
        ? targetRole
        : 'STUDENT') as any,
      academicYearId: req.academicYearId || 'ay-5',
      departmentId: req.departmentId || undefined,
      status: req.autoPublish ? 'PUBLISHED' : 'DRAFT',
      allowAnonymous: req.allowAnonymous !== false,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
      instructions: 'Please evaluate each mapped dimension objectively based on your direct operational experience.',
      version: 1,
      responseCount: 0,
      averageScore: 0,
      sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.feedbackForms.unshift(newForm);
    this.persistAsync(FeedbackFormModel, newForm);
    this.logAudit(
      'CREATE',
      'FEEDBACK',
      `Generated dynamic survey: ${newForm.title} for role ${targetRole} (${totalQuestions} questions across ${mappedCategoriesInfo.length} categories)`,
      user,
      undefined
    );

    return {
      form: newForm,
      mappedCategories: mappedCategoriesInfo,
      questionCount: totalQuestions,
    };
  }

  // Get paginated and filtered responses enriched with metadata
  getEnrichedResponses(filters: {
    formId?: string;
    stakeholderType?: string;
    academicYearId?: string;
    departmentId?: string;
    isAnonymous?: boolean;
    minScore?: number;
    maxScore?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let responses = this.feedbackResponses;

    if (filters.formId && filters.formId !== 'all') {
      responses = responses.filter((r) => r.formId === filters.formId);
    }
    if (filters.stakeholderType && filters.stakeholderType !== 'all') {
      responses = responses.filter((r) => r.stakeholderType === filters.stakeholderType);
    }
    if (filters.academicYearId && filters.academicYearId !== 'all') {
      responses = responses.filter((r) => r.academicYearId === filters.academicYearId);
    }
    if (filters.departmentId && filters.departmentId !== 'all') {
      responses = responses.filter((r) => r.departmentId === filters.departmentId);
    }
    if (typeof filters.isAnonymous === 'boolean') {
      responses = responses.filter((r) => r.isAnonymous === filters.isAnonymous);
    }
    if (typeof filters.minScore === 'number') {
      responses = responses.filter((r) => r.overallScore >= filters.minScore!);
    }
    if (typeof filters.maxScore === 'number') {
      responses = responses.filter((r) => r.overallScore <= filters.maxScore!);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      responses = responses.filter((r) => {
        const form = this.feedbackForms.find((f) => f.id === r.formId);
        const dept = this.departments.find((d) => d.id === r.departmentId);
        const matchesForm = form?.title.toLowerCase().includes(q) || form?.code.toLowerCase().includes(q);
        const matchesDept = dept?.name.toLowerCase().includes(q) || dept?.code.toLowerCase().includes(q);
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesTextAnswer = r.answers.some((a) => a.textValue?.toLowerCase().includes(q));
        return matchesForm || matchesDept || matchesId || matchesTextAnswer;
      });
    }

    const total = responses.length;
    const limit = Math.min(filters.limit || 50, 200);
    const offset = filters.offset || 0;
    const paginated = responses.slice(offset, offset + limit);

    const enriched = paginated.map((r) => {
      const form = this.feedbackForms.find((f) => f.id === r.formId);
      const dept = this.departments.find((d) => d.id === r.departmentId);
      const prog = this.programmes.find((p) => p.id === r.programmeId);
      const stakeholder = r.stakeholderId ? this.stakeholders.find((s) => s.id === r.stakeholderId) : undefined;
      const user = r.userId ? this.users.find((u) => u.id === r.userId) : undefined;

      return {
        ...r,
        formTitle: form?.title || r.formId,
        formCode: form?.code || '',
        naacSubMetric: form?.naacSubMetric,
        departmentName: dept?.name || 'General / Inter-departmental',
        departmentCode: dept?.code || 'INST',
        programmeName: prog?.name,
        respondentDisplayName: r.isAnonymous
          ? 'Anonymous Stakeholder (AES-256 Protected)'
          : (stakeholder?.fullName || user?.fullName || 'Verified Stakeholder'),
        answersCount: r.answers?.length || 0,
      };
    });

    return {
      total,
      limit,
      offset,
      responses: enriched,
    };
  }

  // Get deep-dive results and question-by-question analytics for a single form
  getFormResults(formId: string, academicYearId?: string, departmentId?: string) {
    const form = this.feedbackForms.find((f) => f.id === formId);
    if (!form) return null;

    let responses = this.feedbackResponses.filter((r) => r.formId === formId);
    if (academicYearId && academicYearId !== 'all') {
      responses = responses.filter((r) => r.academicYearId === academicYearId);
    }
    if (departmentId && departmentId !== 'all') {
      responses = responses.filter((r) => r.departmentId === departmentId);
    }

    const totalResponses = responses.length;
    const totalScore = responses.reduce((acc, r) => acc + r.overallScore, 0);
    const averageScore = totalResponses > 0 ? Math.round((totalScore / totalResponses) * 100) / 100 : form.averageScore;

    // Star distribution (1 to 5)
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    responses.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.overallScore))) as 1 | 2 | 3 | 4 | 5;
      starCounts[rounded] = (starCounts[rounded] || 0) + 1;
    });

    const starDistribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: starCounts[star as 1 | 2 | 3 | 4 | 5],
      percentage: totalResponses > 0 ? Math.round((starCounts[star as 1 | 2 | 3 | 4 | 5] / totalResponses) * 100) : 0,
    }));

    // Department breakdown
    const deptStats = this.departments.map((dept) => {
      const deptResponses = responses.filter((r) => r.departmentId === dept.id);
      const deptScoreSum = deptResponses.reduce((acc, r) => acc + r.overallScore, 0);
      const deptAvg = deptResponses.length > 0 ? Math.round((deptScoreSum / deptResponses.length) * 100) / 100 : 0;
      return {
        departmentId: dept.id,
        departmentCode: dept.code,
        departmentName: dept.name,
        count: deptResponses.length,
        averageScore: deptAvg,
        percentage: totalResponses > 0 ? Math.round((deptResponses.length / totalResponses) * 100) : 0,
      };
    });

    // Question-by-question breakdown
    const questionAnalytics: any[] = [];
    const textComments: any[] = [];

    (form.sections || []).forEach((sec) => {
      sec.questions.forEach((q) => {
        const qResponses: number[] = [];
        const qStarCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        responses.forEach((r) => {
          const ans = r.answers.find((a) => a.questionId === q.id);
          if (ans) {
            if (typeof ans.scoreValue === 'number') {
              qResponses.push(ans.scoreValue);
              const rounded = Math.min(5, Math.max(1, Math.round(ans.scoreValue)));
              qStarCounts[rounded] = (qStarCounts[rounded] || 0) + 1;
            }
            if (ans.textValue && ans.textValue.trim().length > 3) {
              const dept = this.departments.find((d) => d.id === r.departmentId);
              textComments.push({
                questionId: q.id,
                prompt: q.prompt,
                parameter: q.parameter,
                text: ans.textValue.trim(),
                sentiment: r.overallScore >= 4 ? 'Positive' : r.overallScore >= 3.2 ? 'Neutral' : 'Action Required',
                departmentName: dept?.name || 'Academic Branch',
                departmentCode: dept?.code || 'INST',
                date: r.submittedAt.slice(0, 10),
                score: r.overallScore,
                stakeholderType: r.stakeholderType,
              });
            }
          }
        });

        // Compute question average
        let qAverage = 0;
        if (qResponses.length > 0) {
          const sum = qResponses.reduce((a, b) => a + b, 0);
          qAverage = Math.round((sum / qResponses.length) * 100) / 100;
        } else {
          // Approximate with form average variance
          qAverage = Math.min(5.0, Math.max(2.5, Math.round((averageScore + ((q.orderIndex % 3) - 1) * 0.15) * 100) / 100));
        }

        const benchmarkStatus =
          qAverage >= 4.2
            ? 'EXCELLENT'
            : qAverage >= 3.8
            ? 'GOOD'
            : qAverage >= 3.2
            ? 'SATISFACTORY'
            : 'NEEDS_ATTENTION';

        questionAnalytics.push({
          id: q.id,
          sectionTitle: sec.title,
          category: q.category || sec.category,
          prompt: q.prompt,
          parameter: q.parameter,
          questionType: q.questionType,
          scaleMax: q.scaleMax || 5,
          orderIndex: q.orderIndex,
          averageScore: qAverage,
          responsesCount: qResponses.length || totalResponses,
          starCounts: qStarCounts,
          benchmarkStatus,
        });
      });
    });

    // Recent submissions for this form
    const recentSubmissions = responses.slice(0, 25).map((r) => {
      const dept = this.departments.find((d) => d.id === r.departmentId);
      const prog = this.programmes.find((p) => p.id === r.programmeId);
      return {
        id: r.id,
        submittedAt: r.submittedAt,
        departmentName: dept?.name || 'General',
        departmentCode: dept?.code || 'INST',
        programmeName: prog?.name,
        overallScore: r.overallScore,
        isAnonymous: r.isAnonymous,
        stakeholderType: r.stakeholderType,
        answers: r.answers,
      };
    });

    // Quorum Targets by stakeholder type
    const quorumTargets: Record<string, number> = {
      STUDENT: 400,
      FACULTY: 80,
      NON_TEACHING: 60,
      TECHNICAL_STAFF: 40,
      ALUMNI: 100,
      EMPLOYER: 50,
      PARENT: 120,
    };
    const targetQuorum = quorumTargets[form.targetType] || 100;
    const quorumPercentage = Math.min(100, Math.round((totalResponses / targetQuorum) * 100));

    return {
      form: {
        id: form.id,
        code: form.code,
        title: form.title,
        description: form.description,
        targetType: form.targetType,
        academicYearId: form.academicYearId,
        status: form.status,
        allowAnonymous: form.allowAnonymous,
        startDate: form.startDate,
        endDate: form.endDate,
        naacSubMetric: form.naacSubMetric,
        instructions: form.instructions,
      },
      summary: {
        totalResponses,
        averageScore,
        targetQuorum,
        quorumPercentage,
        qualityRatingBand: averageScore >= 4.0 ? 'EXCELLENT' : averageScore >= 3.5 ? 'GOOD' : 'NEEDS_ATTENTION',
      },
      starDistribution,
      departmentBreakdown: deptStats,
      questionAnalytics,
      qualitativeComments: textComments.slice(0, 40),
      recentSubmissions,
    };
  }

  // Get executive matrix summary for all forms
  getAllFormsSummary(academicYearId?: string, departmentId?: string) {
    const quorumTargets: Record<string, number> = {
      STUDENT: 400,
      FACULTY: 80,
      NON_TEACHING: 60,
      TECHNICAL_STAFF: 40,
      ALUMNI: 100,
      EMPLOYER: 50,
      PARENT: 120,
    };

    return this.feedbackForms.map((form) => {
      let responses = this.feedbackResponses.filter((r) => r.formId === form.id);
      if (academicYearId && academicYearId !== 'all') {
        responses = responses.filter((r) => r.academicYearId === academicYearId);
      }
      if (departmentId && departmentId !== 'all') {
        responses = responses.filter((r) => r.departmentId === departmentId);
      }

      const totalResponses = responses.length;
      const totalScore = responses.reduce((acc, r) => acc + r.overallScore, 0);
      const avgScore = totalResponses > 0 ? Math.round((totalScore / totalResponses) * 100) / 100 : form.averageScore;

      const targetQuorum = quorumTargets[form.targetType] || 100;
      const quorumPercentage = Math.min(100, Math.round((totalResponses / targetQuorum) * 100));

      const ratingBand =
        avgScore >= 4.2
          ? 'EXCELLENT'
          : avgScore >= 3.8
          ? 'GOOD'
          : avgScore >= 3.2
          ? 'SATISFACTORY'
          : 'CRITICAL';

      // Pick top question parameter and lowest question parameter
      const firstSection = form.sections?.[0];
      const topParameter = firstSection?.questions?.[0]?.parameter || 'General Quality';
      const gapParameter =
        avgScore < 3.8
          ? (form.sections?.[form.sections.length - 1]?.questions?.[0]?.parameter || 'Lab Facilities')
          : undefined;

      return {
        id: form.id,
        code: form.code,
        title: form.title,
        description: form.description,
        targetType: form.targetType,
        academicYearId: form.academicYearId,
        status: form.status,
        naacSubMetric: form.naacSubMetric || '1.4.1',
        totalResponses,
        averageScore: avgScore,
        targetQuorum,
        quorumPercentage,
        ratingBand,
        topStrengthParameter: topParameter,
        primaryGapParameter: gapParameter,
        lastSubmittedAt: responses[0]?.submittedAt || form.updatedAt,
        sectionsCount: form.sections?.length || 0,
        questionsCount: form.sections?.reduce((acc, s) => acc + s.questions.length, 0) || 0,
      };
    });
  }
}

export const dbStore = new DatabaseStore();
