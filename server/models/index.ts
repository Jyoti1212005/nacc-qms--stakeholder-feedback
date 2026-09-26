import mongoose, { Schema, Document } from 'mongoose';
import {
  Department,
  Programme,
  AcademicYear,
  User,
  Stakeholder,
  FeedbackForm,
  FeedbackResponse,
  QualityCategory,
  QualityIndicator,
  QualityGap,
  ActionPlan,
  EvidenceItem,
  AIInsightItem,
  NotificationItem,
  AuditLogItem,
  ReportItem,
  FeedbackCategory,
  RoleCategoryMapping,
  QuestionTemplate,
  ClosingTheLoopItem,
  PulseSurveySubmission,
} from '../types.ts';

// -------------------------------------------------------------
// Users
// -------------------------------------------------------------
const UserSchema = new Schema<User>({
  id: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true, index: true },
  departmentId: { type: String, index: true },
  programmeId: { type: String },
  phone: { type: String },
  avatarUrl: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

// -------------------------------------------------------------
// Departments
// -------------------------------------------------------------
const DepartmentSchema = new Schema<Department>({
  id: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  headOfDept: { type: String },
  email: { type: String },
  establishedYear: { type: Number, required: true },
});

// -------------------------------------------------------------
// Programmes
// -------------------------------------------------------------
const ProgrammeSchema = new Schema<Programme>({
  id: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  degreeLevel: { type: String, enum: ['UG', 'PG', 'Ph.D.'], required: true },
  departmentId: { type: String, required: true, index: true },
  durationYears: { type: Number, required: true },
});

// -------------------------------------------------------------
// Academic Years
// -------------------------------------------------------------
const AcademicYearSchema = new Schema<AcademicYear>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  isCurrent: { type: Boolean, default: false },
});

// -------------------------------------------------------------
// Stakeholders
// -------------------------------------------------------------
const StakeholderSchema = new Schema<Stakeholder>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, index: true },
  type: { type: String, required: true, index: true },
  identifier: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  departmentId: { type: String, index: true },
  programmeId: { type: String },
  batchYear: { type: String },
  organization: { type: String },
  designation: { type: String },
});

// -------------------------------------------------------------
// Feedback Question Schema (Nested)
// -------------------------------------------------------------
const FeedbackQuestionSchema = new Schema({
  id: { type: String, required: true },
  sectionId: { type: String, required: true },
  prompt: { type: String, required: true },
  promptHi: { type: String },
  questionType: { type: String, required: true },
  parameter: { type: String, required: true },
  parameterHi: { type: String },
  category: { type: String, required: true },
  isRequired: { type: Boolean, default: true },
  orderIndex: { type: Number, required: true },
  scaleMax: { type: Number },
  options: [{ type: String }],
  optionsHi: [{ type: String }],
  naacMetricRef: { type: String },
}, { _id: false });

// -------------------------------------------------------------
// Feedback Section Schema (Nested)
// -------------------------------------------------------------
const FeedbackSectionSchema = new Schema({
  id: { type: String, required: true },
  formId: { type: String, required: true },
  title: { type: String, required: true },
  titleHi: { type: String },
  description: { type: String },
  descriptionHi: { type: String },
  category: { type: String, required: true },
  orderIndex: { type: Number, required: true },
  questions: [FeedbackQuestionSchema],
}, { _id: false });

// -------------------------------------------------------------
// Feedback Forms
// -------------------------------------------------------------
const FeedbackFormSchema = new Schema<FeedbackForm>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  titleHi: { type: String },
  code: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  descriptionHi: { type: String },
  targetType: { type: String, required: true, index: true },
  academicYearId: { type: String, required: true, index: true },
  departmentId: { type: String, index: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'], default: 'DRAFT', index: true },
  allowAnonymous: { type: Boolean, default: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  instructions: { type: String },
  instructionsHi: { type: String },
  version: { type: Number, default: 1 },
  sections: [FeedbackSectionSchema],
  responseCount: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0.0 },
  naacSubMetric: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// -------------------------------------------------------------
// Feedback Responses
// -------------------------------------------------------------
const FeedbackAnswerSchema = new Schema({
  questionId: { type: String, required: true },
  scoreValue: { type: Number },
  textValue: { type: String },
  optionValues: [{ type: String }],
}, { _id: false });

const FeedbackResponseSchema = new Schema<FeedbackResponse>({
  id: { type: String, required: true, unique: true, index: true },
  formId: { type: String, required: true, index: true },
  academicYearId: { type: String, required: true, index: true },
  departmentId: { type: String, index: true },
  programmeId: { type: String },
  stakeholderId: { type: String, index: true },
  userId: { type: String, index: true },
  isAnonymous: { type: Boolean, default: false },
  stakeholderType: { type: String, required: true, index: true },
  overallScore: { type: Number, required: true },
  sentimentScore: { type: Number },
  submittedAt: { type: String, default: () => new Date().toISOString() },
  answers: [FeedbackAnswerSchema],
});

// -------------------------------------------------------------
// Quality Categories
// -------------------------------------------------------------
const QualityCategorySchema = new Schema<QualityCategory>({
  id: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  description: { type: String, required: true },
  orderIndex: { type: Number, required: true },
});

// -------------------------------------------------------------
// Quality Indicators
// -------------------------------------------------------------
const QualityIndicatorSchema = new Schema<QualityIndicator>({
  id: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: String, required: true, index: true },
  departmentId: { type: String, index: true },
  academicYearId: { type: String, required: true, index: true },
  targetScore: { type: Number, required: true },
  actualScore: { type: Number, required: true },
  unit: { type: String, required: true },
  dataSource: { type: String, required: true },
  frequency: { type: String, required: true },
  owner: { type: String, required: true },
  formula: { type: String },
  status: { type: String, enum: ['EXCELLENT', 'GOOD', 'NEEDS_ATTENTION', 'CRITICAL'], required: true },
  updatedAt: { type: String, default: () => new Date().toISOString() },
  hasAssignedCapa: { type: Boolean, default: false },
  assignedCapaId: { type: String },
  assignedCapaCode: { type: String },
  daysBelowTarget: { type: Number, default: 0 },
  isEscalated: { type: Boolean, default: false },
  escalationLevel: { type: String, enum: ['NONE', 'WARNING', 'CRITICAL_30_DAYS'], default: 'NONE' },
  escalationRemarks: { type: String },
});

// -------------------------------------------------------------
// Quality Gaps
// -------------------------------------------------------------
const QualityGapSchema = new Schema<QualityGap>({
  id: { type: String, required: true, unique: true, index: true },
  parameter: { type: String, required: true },
  category: { type: String, required: true },
  indicatorId: { type: String, index: true },
  departmentId: { type: String, index: true },
  academicYearId: { type: String, required: true, index: true },
  currentScore: { type: Number, required: true },
  targetScore: { type: Number, required: true },
  gapValue: { type: Number, required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  responsesCount: { type: Number, default: 0 },
  affectedGroups: [{ type: String }],
  suggestedAction: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['DETECTED', 'VERIFIED', 'CONVERTED_TO_ACTION', 'RESOLVED'], default: 'DETECTED' },
  naacSubMetric: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

// -------------------------------------------------------------
// Action Plans (CAPA)
// -------------------------------------------------------------
const ActionPlanSchema = new Schema<ActionPlan>({
  id: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, unique: true },
  gapId: { type: String, index: true },
  departmentId: { type: String, required: true, index: true },
  issue: { type: String, required: true },
  rootCause: { type: String, required: true },
  correctiveAction: { type: String, required: true },
  preventiveAction: { type: String, required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  status: {
    type: String,
    enum: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'AWAITING_EVIDENCE', 'UNDER_VERIFICATION', 'COMPLETED', 'REOPENED', 'CLOSED'],
    default: 'OPEN',
    index: true,
  },
  assignedToId: { type: String, required: true },
  assignedToName: { type: String, required: true },
  createdById: { type: String, required: true },
  createdByName: { type: String, required: true },
  verifiedById: { type: String },
  verifiedByName: { type: String },
  startDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  completedAt: { type: String },
  expectedOutcome: { type: String, required: true },
  actualOutcome: { type: String },
  beforeScore: { type: Number },
  afterScore: { type: Number },
  closureRemarks: { type: String },
  evidenceIds: [{ type: String }],
  naacSubMetric: { type: String },
  stakeholderType: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// -------------------------------------------------------------
// Closing The Loop Items
// -------------------------------------------------------------
const ClosingTheLoopSchema = new Schema<ClosingTheLoopItem>({
  id: { type: String, required: true, unique: true, index: true },
  capaCode: { type: String, required: true, index: true },
  gapCode: { type: String },
  naacSubMetric: { type: String, required: true },
  naacMetricLabel: { type: String, required: true },
  departmentId: { type: String, required: true, index: true },
  departmentName: { type: String, required: true },
  departmentCode: { type: String, required: true },
  academicYear: { type: String, required: true },
  academicYearId: { type: String, required: true, index: true },
  stakeholderType: { type: String, required: true },
  stakeholderLabel: { type: String, required: true },
  issueReported: { type: String, required: true },
  verbatimFeedbackQuote: { type: String, required: true },
  rootCauseAnalysis: { type: String, required: true },
  interventionResolution: { type: String, required: true },
  preventiveMeasure: { type: String, required: true },
  responsibleLead: { type: String, required: true },
  responsibleDesignation: { type: String, required: true },
  baselineScore: { type: Number, required: true },
  remeasuredScore: { type: Number, required: true },
  satisfactionDelta: { type: Number, required: true },
  percentageImprovement: { type: Number, required: true },
  evidenceCode: { type: String, required: true },
  evidenceTitle: { type: String, required: true },
  evidenceProofType: { type: String, required: true },
  evidenceFileUrl: { type: String },
  evidenceVerifiedAt: { type: String, required: true },
  loopStatus: { type: String, enum: ['VERIFIED_CLOSED', 'EVALUATION_STAGE'], default: 'VERIFIED_CLOSED' },
});

// -------------------------------------------------------------
// Evidence Items
// -------------------------------------------------------------
const EvidenceSchema = new Schema<EvidenceItem>({
  id: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['PDF', 'DOCX', 'XLSX', 'PPTX', 'PNG', 'CSV'], required: true },
  fileSize: { type: Number, required: true },
  category: { type: String, required: true },
  departmentId: { type: String, index: true },
  academicYearId: { type: String, required: true, index: true },
  actionPlanId: { type: String, index: true },
  qualityIndicatorId: { type: String },
  uploadedById: { type: String, required: true },
  uploadedByName: { type: String, required: true },
  verifiedById: { type: String },
  verifiedByName: { type: String },
  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'REQUIRES_UPDATE'], default: 'PENDING' },
  verificationNotes: { type: String },
  version: { type: Number, default: 1 },
  tags: [{ type: String }],
  createdAt: { type: String, default: () => new Date().toISOString() },
});

// -------------------------------------------------------------
// AI Insights
// -------------------------------------------------------------
const AIInsightSchema = new Schema<AIInsightItem>({
  id: { type: String, required: true, unique: true, index: true },
  academicYearId: { type: String, required: true, index: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  majorStrengths: [{ type: String }],
  majorConcerns: [{ type: String }],
  emergingTrends: [{ type: String }],
  suggestedCAPA: [{ type: String }],
  sentimentScore: { type: Number, required: true },
  sampleSize: { type: Number, required: true },
  confidence: { type: Number, required: true },
  isApproved: { type: Boolean, default: false },
  reviewedBy: { type: String },
  reviewedAt: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

// -------------------------------------------------------------
// Pulse Survey Submissions
// -------------------------------------------------------------
const PulseSurveySchema = new Schema<PulseSurveySubmission>({
  id: { type: String, required: true, unique: true, index: true },
  rating: { type: Number, required: true },
  category: { type: String, required: true },
  quickFeedback: { type: String },
  stakeholderType: { type: String, required: true },
  departmentId: { type: String },
  departmentName: { type: String },
  submittedAt: { type: String, default: () => new Date().toISOString() },
});

// -------------------------------------------------------------
// Reports
// -------------------------------------------------------------
const ReportSchema = new Schema<ReportItem>({
  id: { type: String, required: true, unique: true, index: true },
  reportType: { type: String, required: true },
  title: { type: String, required: true },
  academicYearId: { type: String, required: true, index: true },
  departmentId: { type: String },
  parameters: { type: Schema.Types.Mixed, default: {} },
  summaryData: { type: Schema.Types.Mixed, default: {} },
  generatedBy: { type: String, required: true },
  approvedBy: { type: String },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

// -------------------------------------------------------------
// Notifications
// -------------------------------------------------------------
const NotificationSchema = new Schema<NotificationItem>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  linkUrl: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

// -------------------------------------------------------------
// Audit Logs
// -------------------------------------------------------------
const AuditLogSchema = new Schema<AuditLogItem>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String },
  userName: { type: String },
  userRole: { type: String },
  action: { type: String, required: true },
  module: { type: String, required: true },
  description: { type: String, required: true },
  ipAddress: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

// -------------------------------------------------------------
// Form Builder Metadata
// -------------------------------------------------------------
const FeedbackCategorySchema = new Schema<FeedbackCategory>({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  naacCriterion: { type: String, required: true },
  iconName: { type: String, required: true },
});

const RoleCategoryMappingSchema = new Schema<RoleCategoryMapping>({
  id: { type: String, required: true, unique: true },
  role: { type: String, required: true, index: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String },
  isPrimary: { type: Boolean, default: false },
  priorityOrder: { type: Number, required: true },
  focusDescription: { type: String, required: true },
  rationale: { type: String, required: true },
});

const QuestionTemplateSchema = new Schema<QuestionTemplate>({
  id: { type: String, required: true, unique: true },
  categoryId: { type: String, required: true, index: true },
  categoryName: { type: String },
  applicableRoles: [{ type: String }],
  prompt: { type: String, required: true },
  parameter: { type: String, required: true },
  questionType: { type: String, required: true },
  scaleMax: { type: Number },
  options: [{ type: String }],
  isRequired: { type: Boolean, default: true },
  naacMetricRef: { type: String },
  tags: [{ type: String }],
});

// -------------------------------------------------------------
// Model Exports
// -------------------------------------------------------------
export const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);
export const DepartmentModel = mongoose.models.Department || mongoose.model<Department>('Department', DepartmentSchema);
export const ProgrammeModel = mongoose.models.Programme || mongoose.model<Programme>('Programme', ProgrammeSchema);
export const AcademicYearModel = mongoose.models.AcademicYear || mongoose.model<AcademicYear>('AcademicYear', AcademicYearSchema);
export const StakeholderModel = mongoose.models.Stakeholder || mongoose.model<Stakeholder>('Stakeholder', StakeholderSchema);
export const FeedbackFormModel = mongoose.models.FeedbackForm || mongoose.model<FeedbackForm>('FeedbackForm', FeedbackFormSchema);
export const FeedbackResponseModel = mongoose.models.FeedbackResponse || mongoose.model<FeedbackResponse>('FeedbackResponse', FeedbackResponseSchema);
export const QualityCategoryModel = mongoose.models.QualityCategory || mongoose.model<QualityCategory>('QualityCategory', QualityCategorySchema);
export const QualityIndicatorModel = mongoose.models.QualityIndicator || mongoose.model<QualityIndicator>('QualityIndicator', QualityIndicatorSchema);
export const QualityGapModel = mongoose.models.QualityGap || mongoose.model<QualityGap>('QualityGap', QualityGapSchema);
export const ActionPlanModel = mongoose.models.ActionPlan || mongoose.model<ActionPlan>('ActionPlan', ActionPlanSchema);
export const ClosingTheLoopModel = mongoose.models.ClosingTheLoop || mongoose.model<ClosingTheLoopItem>('ClosingTheLoop', ClosingTheLoopSchema);
export const EvidenceModel = mongoose.models.Evidence || mongoose.model<EvidenceItem>('Evidence', EvidenceSchema);
export const AIInsightModel = mongoose.models.AIInsight || mongoose.model<AIInsightItem>('AIInsight', AIInsightSchema);
export const PulseSurveyModel = mongoose.models.PulseSurvey || mongoose.model<PulseSurveySubmission>('PulseSurvey', PulseSurveySchema);
export const ReportModel = mongoose.models.Report || mongoose.model<ReportItem>('Report', ReportSchema);
export const NotificationModel = mongoose.models.Notification || mongoose.model<NotificationItem>('Notification', NotificationSchema);
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model<AuditLogItem>('AuditLog', AuditLogSchema);
export const FeedbackCategoryModel = mongoose.models.FeedbackCategory || mongoose.model<FeedbackCategory>('FeedbackCategory', FeedbackCategorySchema);
export const RoleCategoryMappingModel = mongoose.models.RoleCategoryMapping || mongoose.model<RoleCategoryMapping>('RoleCategoryMapping', RoleCategoryMappingSchema);
export const QuestionTemplateModel = mongoose.models.QuestionTemplate || mongoose.model<QuestionTemplate>('QuestionTemplate', QuestionTemplateSchema);
