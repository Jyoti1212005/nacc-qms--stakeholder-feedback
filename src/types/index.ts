export type Role =
  | 'SUPER_ADMIN'
  | 'IQAC_ADMIN'
  | 'PRINCIPAL'
  | 'HOD'
  | 'FACULTY'
  | 'STUDENT'
  | 'ALUMNI'
  | 'EMPLOYER'
  | 'PARENT'
  | 'NON_TEACHING'
  | 'TECHNICAL_STAFF'
  | 'EXTERNAL_STAKEHOLDER';

export type StakeholderType =
  | 'STUDENT'
  | 'FACULTY'
  | 'NON_TEACHING'
  | 'TECHNICAL_STAFF'
  | 'ALUMNI'
  | 'EMPLOYER'
  | 'PARENT'
  | 'INDUSTRY_PARTNER'
  | 'ACADEMIC_EXPERT';

export type QuestionType =
  | 'LIKERT_SCALE'
  | 'RATING_STARS'
  | 'MULTIPLE_CHOICE'
  | 'SINGLE_CHOICE'
  | 'YES_NO'
  | 'TEXT_RESPONSE'
  | 'NUMERIC_SCORE'
  | 'NPS'
  | 'FILE_ATTACHMENT';

export type FormStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export type GapPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ActionStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'AWAITING_EVIDENCE'
  | 'UNDER_VERIFICATION'
  | 'COMPLETED'
  | 'REOPENED'
  | 'CLOSED';

export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'REQUIRES_UPDATE';

export type NavigationPage =
  | 'dashboard'
  | 'admin'
  | 'iqac'
  | 'feedback'
  | 'closing-the-loop'
  | 'gaps'
  | 'action-plans'
  | 'evidence'
  | 'quality-indicators'
  | 'atr'
  | 'ai-analytics'
  | 'department'
  | 'reports'
  | 'audit-logs'
  | 'settings';

export interface RolePermissions {
  canViewExecutiveDashboard: boolean;
  canViewDepartmentDashboard: boolean;
  canSubmitFeedback: boolean;
  canCreateFeedbackSurveys: boolean;
  canViewFeedbackAnalytics: boolean;
  canManageQualityGaps: boolean;
  canCreateActionPlans: boolean;
  canUploadEvidence: boolean;
  canVerifyEvidence: boolean;
  canGenerateReports: boolean;
  canAccessIQACCommand: boolean;
  canConfigureSettings: boolean;
  canViewAuditLogs: boolean;
  canAccessAdminPortal?: boolean;
}

export interface StakeholderRoleDefinition {
  role: Role;
  title: string;
  category: 'Internal Academic' | 'Internal Administrative' | 'External Community' | 'Institutional Governance';
  badgeColor: string;
  description: string;
  naacCriteriaFocus: string[];
  defaultLandingPage: NavigationPage;
  allowedPages: NavigationPage[];
  permissions: RolePermissions;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  departmentId?: string;
  programmeId?: string;
  avatarUrl?: string;
}

export interface StakeholderProfileData {
  id: string;
  fullName: string;
  role: Role;
  department: string;
  departmentCode?: string;
  departmentId?: string | null;
  joinDate: string;
  email: string;
  phone?: string;
  programme?: string | null;
  degreeLevel?: string | null;
  avatarUrl?: string;
  isActive: boolean;
  stats?: {
    assignedActions: number;
    feedbackSubmissions: number;
    tenureYears: number;
  };
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDept?: string;
  email?: string;
  establishedYear: number;
}

export interface Programme {
  id: string;
  code: string;
  name: string;
  degreeLevel: 'UG' | 'PG' | 'Ph.D.';
  departmentId: string;
  durationYears: number;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface FeedbackQuestion {
  id: string;
  sectionId: string;
  prompt: string;
  promptHi?: string;
  questionType: QuestionType;
  parameter: string;
  parameterHi?: string;
  category: string;
  isRequired: boolean;
  orderIndex: number;
  scaleMax?: number;
  options?: string[];
  optionsHi?: string[];
  naacMetricRef?: string;
}

export interface FeedbackSection {
  id: string;
  formId: string;
  title: string;
  titleHi?: string;
  description?: string;
  descriptionHi?: string;
  category: string;
  orderIndex: number;
  questions: FeedbackQuestion[];
}

export interface FeedbackForm {
  id: string;
  title: string;
  titleHi?: string;
  code: string;
  description: string;
  descriptionHi?: string;
  targetType: StakeholderType;
  academicYearId: string;
  departmentId?: string;
  status: FormStatus;
  allowAnonymous: boolean;
  startDate: string;
  endDate: string;
  instructions?: string;
  instructionsHi?: string;
  version: number;
  sections: FeedbackSection[];
  responseCount: number;
  averageScore: number;
  naacSubMetric?: '1.4.1' | '1.4.2' | '2.7.1' | string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackAnswer {
  questionId: string;
  scoreValue?: number;
  textValue?: string;
  optionValues?: string[];
}

export interface FeedbackCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  naacCriterion: string;
  iconName: string;
}

export interface RoleCategoryMapping {
  id: string;
  role: Role | StakeholderType;
  categoryId: string;
  categoryName?: string;
  isPrimary: boolean;
  priorityOrder: number;
  focusDescription: string;
  rationale: string;
}

export interface QuestionTemplate {
  id: string;
  categoryId: string;
  categoryName?: string;
  applicableRoles: (Role | StakeholderType)[];
  prompt: string;
  parameter: string;
  questionType: QuestionType;
  scaleMax?: number;
  options?: string[];
  isRequired: boolean;
  naacMetricRef?: string;
  tags: string[];
}

export interface DynamicSurveyGenerationRequest {
  targetRole: Role | StakeholderType;
  selectedCategoryIds?: string[];
  academicYearId?: string;
  departmentId?: string;
  title?: string;
  code?: string;
  description?: string;
  allowAnonymous?: boolean;
  autoPublish?: boolean;
}

export interface FeedbackResponse {
  id: string;
  formId: string;
  academicYearId: string;
  departmentId?: string;
  programmeId?: string;
  stakeholderId?: string;
  userId?: string;
  isAnonymous: boolean;
  stakeholderType: StakeholderType;
  overallScore: number;
  sentimentScore?: number;
  submittedAt: string;
  answers: FeedbackAnswer[];
}

export interface QualityIndicator {
  id: string;
  code: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  categoryCode?: string;
  departmentId?: string;
  academicYearId: string;
  targetScore: number;
  actualScore: number;
  unit: string;
  dataSource: string;
  frequency: string;
  owner: string;
  formula?: string;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL';
  updatedAt: string;
  hasAssignedCapa?: boolean;
  assignedCapaId?: string;
  assignedCapaCode?: string;
  daysBelowTarget?: number;
  isEscalated?: boolean;
  escalationLevel?: 'NONE' | 'WARNING' | 'CRITICAL_30_DAYS';
  escalationRemarks?: string;
}

export interface PulseSurveySubmission {
  id: string;
  rating: number; // 1 to 5
  category: string;
  quickFeedback?: string;
  stakeholderType: StakeholderType;
  departmentId?: string;
  departmentName?: string;
  submittedAt: string;
}

export interface AiAtrReportItem {
  slNo: number;
  gapCode: string;
  criterion: string;
  department: string;
  departmentCode: string;
  stakeholder: string;
  deficiency: string;
  rootCause: string;
  actionTaken: string;
  preventiveAction: string;
  responsibleAuthority: string;
  baselineScore: number;
  remeasuredScore: number;
  delta: number;
  evidenceList: { id: string; code: string; title: string; status: string }[];
  status: string;
  naacMetricRef: string;
}

export interface AiAtrReportData {
  reportId: string;
  title: string;
  referenceNo: string;
  generatedAt: string;
  generatedBy: string;
  academicYear: string;
  academicYearId: string;
  department: string;
  scope: string;
  criterion: string;
  executiveSummary: string;
  kpis: {
    totalResponses: number;
    lowScoringMetricsCount: number;
    capaPlansFormulated: number;
    capaPlansClosed: number;
    averageImprovementDelta: number;
    evidenceVerifiedPercent: number;
  };
  matrix: AiAtrReportItem[];
  evidenceAttachments: {
    code: string;
    title: string;
    category: string;
    verifiedBy: string;
    verificationDate: string;
  }[];
  signatories: {
    iqacDirector: string;
    principal: string;
  };
}

export interface QualityGap {
  id: string;
  parameter: string;
  category: string;
  indicatorId?: string;
  departmentId?: string;
  academicYearId: string;
  currentScore: number;
  targetScore: number;
  gapValue: number;
  priority: GapPriority;
  responsesCount: number;
  affectedGroups: StakeholderType[];
  suggestedAction: string;
  isVerified: boolean;
  status: 'DETECTED' | 'VERIFIED' | 'CONVERTED_TO_ACTION' | 'RESOLVED';
  naacSubMetric?: '1.4.1' | '1.4.2' | '2.7.1' | string;
  createdAt: string;
}

export interface ActionPlan {
  id: string;
  code: string;
  gapId?: string;
  departmentId: string;
  issue: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  priority: GapPriority;
  status: ActionStatus;
  assignedToId: string;
  assignedToName: string;
  createdById: string;
  createdByName: string;
  verifiedById?: string;
  verifiedByName?: string;
  startDate: string;
  dueDate: string;
  completedAt?: string;
  expectedOutcome: string;
  actualOutcome?: string;
  beforeScore?: number;
  afterScore?: number;
  closureRemarks?: string;
  evidenceIds: string[];
  evidenceList?: EvidenceItem[];
  isOverdue?: boolean;
  naacSubMetric?: '1.4.1' | '1.4.2' | '2.7.1' | string;
  stakeholderType?: StakeholderType;
  createdAt: string;
  updatedAt: string;
}

export interface ClosingTheLoopItem {
  id: string;
  capaCode: string;
  gapCode?: string;
  naacSubMetric: '1.4.1' | '1.4.2' | '2.7.1' | string;
  naacMetricLabel: string;
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  academicYear: string;
  academicYearId: string;
  stakeholderType: StakeholderType;
  stakeholderLabel: string;
  issueReported: string;
  verbatimFeedbackQuote: string;
  rootCauseAnalysis: string;
  interventionResolution: string;
  preventiveMeasure: string;
  responsibleLead: string;
  responsibleDesignation: string;
  baselineScore: number;
  remeasuredScore: number;
  satisfactionDelta: number;
  percentageImprovement: number;
  evidenceCode: string;
  evidenceTitle: string;
  evidenceProofType: string;
  evidenceFileUrl?: string;
  evidenceVerifiedAt: string;
  loopStatus: 'VERIFIED_CLOSED' | 'EVALUATION_STAGE';
}

export interface EvidenceItem {
  id: string;
  code: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'PNG' | 'CSV';
  fileSize: number;
  category: string;
  departmentId?: string;
  academicYearId: string;
  actionPlanId?: string;
  qualityIndicatorId?: string;
  uploadedById: string;
  uploadedByName: string;
  verifiedById?: string;
  verifiedByName?: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  version: number;
  tags: string[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  action: string;
  module: string;
  description: string;
  ipAddress: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AIInsightItem {
  id: string;
  academicYearId: string;
  category: string;
  title: string;
  summary: string;
  majorStrengths: string[];
  majorConcerns: string[];
  emergingTrends: string[];
  suggestedCAPA: string[];
  sentimentScore: number;
  sampleSize: number;
  confidence: number;
  isApproved: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reportType: string;
  title: string;
  academicYearId: string;
  departmentId?: string;
  parameters: Record<string, any>;
  summaryData: Record<string, any>;
  generatedBy: string;
  approvedBy?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface StakeholderRoleEngagement {
  role: string;
  roleKey: string;
  category: string;
  responsesCount: number;
  targetResponses: number;
  responseRate: number; // e.g. 84.5%
  averageScore: number; // e.g. 4.15
  color: string;
  status: 'High' | 'Moderate' | 'Needs Follow-up';
}

export interface ActionTakenAutoReport {
  reportId: string;
  title: string;
  referenceNo: string;
  generatedAt: string;
  generatedBy: string;
  academicYear: string;
  academicYearId: string;
  department: string;
  departmentId?: string;
  scope: string;
  criterion: string;
  executiveSummary: string;
  kpis: {
    totalResponses: number;
    identifiedGaps: number;
    capaPlansFormulated: number;
    capaPlansClosed: number;
    averageImprovementDelta: number;
    evidenceVerifiedPercent: number;
  };
  matrix: {
    slNo: number;
    gapCode: string;
    criterion: string;
    stakeholder: string;
    deficiency: string;
    rootCause: string;
    actionTaken: string;
    preventiveAction?: string;
    responsibleAuthority: string;
    baselineScore: number;
    remeasuredScore: number;
    delta: number;
    evidenceList: { id: string; code: string; title: string; status: string }[];
    status: string;
  }[];
  signatories: {
    iqacDirector: string;
    principal: string;
  };
}

export interface ResolvedCapaAtrItem {
  actionId: string;
  code: string;
  gapCode: string;
  category: string;
  department: string;
  departmentCode: string;
  issue: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  assignedTo: string;
  priority: string;
  status: string;
  beforeScore: number;
  afterScore: number;
  improvementDelta: number;
  closureRemarks: string;
  completedAt: string;
  evidenceItems: {
    id: string;
    code: string;
    title: string;
    fileType?: string;
    verificationStatus: string;
  }[];
}

export interface ResolvedCapaAtrPayload {
  academicYear: string;
  totalResolved: number;
  averageDelta: number;
  evidenceVerificationRate: number;
  items: ResolvedCapaAtrItem[];
}

export interface DashboardStats {
  totalStakeholders: number;
  totalResponses: number;
  responseRatePercent: number;
  activeSurveys: number;
  averageSatisfaction: number;
  criticalGapsCount: number;
  openActionItems: number;
  completedActionItems: number;
  overdueActions: number;
  pendingEvidenceCount: number;
  qualityImprovementIndex: number;
  qualityStatusLabel: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL';
  indexComponents: {
    satisfactionScore: number;
    averageSatisfactionOutOf5: number;
    responseRatePercent: number;
    actionClosureRatePercent: number;
    improvementDeltaPercent: number;
    evidenceCompletenessPercent: number;
  };
  weights: {
    stakeholderSatisfaction: number;
    responseRate: number;
    actionClosureRate: number;
    improvementDelta: number;
    evidenceCompleteness: number;
  };
}
