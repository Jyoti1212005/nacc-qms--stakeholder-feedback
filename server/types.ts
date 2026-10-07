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

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: Role;
  departmentId?: string;
  programmeId?: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  isEmailVerified?: boolean;
  authProvider?: 'local' | 'google';
  googleId?: string;
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

export interface Stakeholder {
  id: string;
  userId?: string;
  type: StakeholderType;
  identifier: string;
  fullName: string;
  email: string;
  phone?: string;
  departmentId?: string;
  programmeId?: string;
  batchYear?: string;
  organization?: string;
  designation?: string;
}

export interface FeedbackQuestion {
  id: string;
  sectionId: string;
  prompt: string;
  promptHi?: string;
  questionType: QuestionType;
  parameter: string; // e.g. "Curriculum Relevance", "Teaching Quality"
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

export interface QualityCategory {
  id: string;
  code: string; // e.g. "CRITERION_1"
  name: string;
  weight: number;
  description: string;
  orderIndex: number;
}

export interface QualityIndicator {
  id: string;
  code: string; // e.g. "QI-1.1.1"
  name: string;
  description: string;
  categoryId: string;
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
