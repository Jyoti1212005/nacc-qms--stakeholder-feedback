-- ==============================================================================
-- NAAC-QMS Institutional Quality Management System & Stakeholder Feedback Suite
-- Complete Supabase PostgreSQL Schema Script
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/sql
-- 2. Create a new query in the SQL Editor.
-- 3. Paste this entire script and click "Run".
-- 4. All tables, constraints, indexes, and RLS policies will be created.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Departments Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
    "id" TEXT PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "headOfDept" TEXT,
    "email" TEXT,
    "establishedYear" INTEGER NOT NULL DEFAULT 2000,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Programmes Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programmes (
    "id" TEXT PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "degreeLevel" TEXT NOT NULL DEFAULT 'UG',
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "durationYears" INTEGER NOT NULL DEFAULT 4,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Academic Years Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academic_years (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. Users Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "programmeId" TEXT REFERENCES public.programmes("id") ON DELETE SET NULL,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN DEFAULT false,
    "authProvider" TEXT DEFAULT 'local',
    "googleId" TEXT,
    "createdAt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Stakeholders Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stakeholders (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES public.users("id") ON DELETE SET NULL,
    "type" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "programmeId" TEXT REFERENCES public.programmes("id") ON DELETE SET NULL,
    "batchYear" TEXT,
    "organization" TEXT,
    "designation" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Quality Categories Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quality_categories (
    "id" TEXT PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "weight" NUMERIC NOT NULL DEFAULT 1.0,
    "description" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. Quality Indicators Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quality_indicators (
    "id" TEXT PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT REFERENCES public.quality_categories("id") ON DELETE CASCADE,
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "academicYearId" TEXT REFERENCES public.academic_years("id") ON DELETE CASCADE,
    "targetScore" NUMERIC NOT NULL,
    "actualScore" NUMERIC NOT NULL,
    "unit" TEXT NOT NULL,
    "dataSource" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "formula" TEXT,
    "status" TEXT NOT NULL DEFAULT 'GOOD',
    "updatedAt" TEXT NOT NULL,
    "hasAssignedCapa" BOOLEAN DEFAULT false,
    "assignedCapaId" TEXT,
    "assignedCapaCode" TEXT,
    "daysBelowTarget" INTEGER DEFAULT 0,
    "isEscalated" BOOLEAN DEFAULT false,
    "escalationLevel" TEXT DEFAULT 'NONE',
    "escalationRemarks" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. Feedback Categories Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback_categories (
    "id" TEXT PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "naacCriterion" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. Role Category Mappings Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.role_category_mappings (
    "id" TEXT PRIMARY KEY,
    "role" TEXT NOT NULL,
    "categoryId" TEXT REFERENCES public.feedback_categories("id") ON DELETE CASCADE,
    "categoryName" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "priorityOrder" INTEGER NOT NULL DEFAULT 1,
    "focusDescription" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. Question Templates Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.question_templates (
    "id" TEXT PRIMARY KEY,
    "categoryId" TEXT REFERENCES public.feedback_categories("id") ON DELETE CASCADE,
    "categoryName" TEXT,
    "applicableRoles" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "prompt" TEXT NOT NULL,
    "parameter" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "scaleMax" INTEGER DEFAULT 5,
    "options" JSONB DEFAULT '[]'::jsonb,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "naacMetricRef" TEXT,
    "tags" JSONB DEFAULT '[]'::jsonb,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. Feedback Forms Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback_forms (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleHi" TEXT,
    "code" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "descriptionHi" TEXT,
    "targetType" TEXT NOT NULL,
    "academicYearId" TEXT REFERENCES public.academic_years("id") ON DELETE CASCADE,
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "allowAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "instructions" TEXT,
    "instructionsHi" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "sections" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "responseCount" INTEGER NOT NULL DEFAULT 0,
    "averageScore" NUMERIC NOT NULL DEFAULT 0,
    "naacSubMetric" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. Feedback Responses Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback_responses (
    "id" TEXT PRIMARY KEY,
    "formId" TEXT REFERENCES public.feedback_forms("id") ON DELETE CASCADE,
    "academicYearId" TEXT REFERENCES public.academic_years("id") ON DELETE CASCADE,
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "programmeId" TEXT REFERENCES public.programmes("id") ON DELETE SET NULL,
    "stakeholderId" TEXT REFERENCES public.stakeholders("id") ON DELETE SET NULL,
    "userId" TEXT REFERENCES public.users("id") ON DELETE SET NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "stakeholderType" TEXT NOT NULL,
    "overallScore" NUMERIC NOT NULL DEFAULT 0,
    "sentimentScore" NUMERIC,
    "submittedAt" TEXT NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. Quality Gaps Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quality_gaps (
    "id" TEXT PRIMARY KEY,
    "parameter" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "indicatorId" TEXT,
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "academicYearId" TEXT REFERENCES public.academic_years("id") ON DELETE CASCADE,
    "currentScore" NUMERIC NOT NULL,
    "targetScore" NUMERIC NOT NULL,
    "gapValue" NUMERIC NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "responsesCount" INTEGER NOT NULL DEFAULT 0,
    "affectedGroups" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "suggestedAction" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DETECTED',
    "naacSubMetric" TEXT,
    "createdAt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. Action Plans (CAPA) Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.action_plans (
    "id" TEXT PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "gapId" TEXT REFERENCES public.quality_gaps("id") ON DELETE SET NULL,
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "issue" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "correctiveAction" TEXT NOT NULL,
    "preventiveAction" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assignedToId" TEXT NOT NULL,
    "assignedToName" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "verifiedById" TEXT,
    "verifiedByName" TEXT,
    "startDate" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "completedAt" TEXT,
    "expectedOutcome" TEXT NOT NULL,
    "actualOutcome" TEXT,
    "beforeScore" NUMERIC,
    "afterScore" NUMERIC,
    "closureRemarks" TEXT,
    "evidenceIds" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "naacSubMetric" TEXT,
    "stakeholderType" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. Closing The Loop (NAAC Criterion 1.4 / 2.7 / 6.5) Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.closing_the_loop (
    "id" TEXT PRIMARY KEY,
    "capaCode" TEXT NOT NULL,
    "gapCode" TEXT,
    "naacSubMetric" TEXT NOT NULL,
    "naacMetricLabel" TEXT NOT NULL,
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "departmentName" TEXT NOT NULL,
    "departmentCode" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "academicYearId" TEXT REFERENCES public.academic_years("id") ON DELETE CASCADE,
    "stakeholderType" TEXT NOT NULL,
    "stakeholderLabel" TEXT NOT NULL,
    "issueReported" TEXT NOT NULL,
    "verbatimFeedbackQuote" TEXT NOT NULL,
    "rootCauseAnalysis" TEXT NOT NULL,
    "interventionResolution" TEXT NOT NULL,
    "preventiveMeasure" TEXT NOT NULL,
    "responsibleLead" TEXT NOT NULL,
    "responsibleDesignation" TEXT NOT NULL,
    "baselineScore" NUMERIC NOT NULL,
    "remeasuredScore" NUMERIC NOT NULL,
    "satisfactionDelta" NUMERIC NOT NULL,
    "percentageImprovement" NUMERIC NOT NULL,
    "evidenceCode" TEXT NOT NULL,
    "evidenceTitle" TEXT NOT NULL,
    "evidenceProofType" TEXT NOT NULL,
    "evidenceFileUrl" TEXT,
    "evidenceVerifiedAt" TEXT NOT NULL,
    "loopStatus" TEXT NOT NULL DEFAULT 'VERIFIED_CLOSED',
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 16. Evidence Items Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evidence_items (
    "id" TEXT PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "category" TEXT NOT NULL,
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "academicYearId" TEXT REFERENCES public.academic_years("id") ON DELETE CASCADE,
    "actionPlanId" TEXT,
    "qualityIndicatorId" TEXT,
    "uploadedById" TEXT NOT NULL,
    "uploadedByName" TEXT NOT NULL,
    "verifiedById" TEXT,
    "verifiedByName" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "verificationNotes" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "tags" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "createdAt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 17. AI Insights Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_insights (
    "id" TEXT PRIMARY KEY,
    "academicYearId" TEXT REFERENCES public.academic_years("id") ON DELETE CASCADE,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "majorStrengths" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "majorConcerns" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "emergingTrends" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "suggestedCAPA" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "sentimentScore" NUMERIC NOT NULL DEFAULT 0,
    "sampleSize" INTEGER NOT NULL DEFAULT 0,
    "confidence" NUMERIC NOT NULL DEFAULT 0.85,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "reviewedBy" TEXT,
    "reviewedAt" TEXT,
    "createdAt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 18. Reports Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    "id" TEXT PRIMARY KEY,
    "reportType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "academicYearId" TEXT REFERENCES public.academic_years("id") ON DELETE CASCADE,
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "parameters" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "summaryData" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "generatedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 19. Notifications Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "linkUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 20. Audit Logs Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT,
    "userName" TEXT,
    "userRole" TEXT,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}'::jsonb,
    "createdAt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 21. Pulse Surveys Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pulse_surveys (
    "id" TEXT PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "quickFeedback" TEXT,
    "stakeholderType" TEXT NOT NULL,
    "departmentId" TEXT REFERENCES public.departments("id") ON DELETE SET NULL,
    "departmentName" TEXT,
    "submittedAt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- Indexes for High Performance Queries
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users("email");
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users("role");
CREATE INDEX IF NOT EXISTS idx_stakeholders_email ON public.stakeholders("email");
CREATE INDEX IF NOT EXISTS idx_stakeholders_dept ON public.stakeholders("departmentId");
CREATE INDEX IF NOT EXISTS idx_forms_status ON public.feedback_forms("status");
CREATE INDEX IF NOT EXISTS idx_forms_target ON public.feedback_forms("targetType");
CREATE INDEX IF NOT EXISTS idx_responses_form ON public.feedback_responses("formId");
CREATE INDEX IF NOT EXISTS idx_responses_stakeholder ON public.feedback_responses("stakeholderType");
CREATE INDEX IF NOT EXISTS idx_gaps_dept ON public.quality_gaps("departmentId");
CREATE INDEX IF NOT EXISTS idx_gaps_priority ON public.quality_gaps("priority");
CREATE INDEX IF NOT EXISTS idx_actions_dept ON public.action_plans("departmentId");
CREATE INDEX IF NOT EXISTS idx_actions_status ON public.action_plans("status");
CREATE INDEX IF NOT EXISTS idx_closing_dept ON public.closing_the_loop("departmentId");
CREATE INDEX IF NOT EXISTS idx_closing_metric ON public.closing_the_loop("naacSubMetric");
CREATE INDEX IF NOT EXISTS idx_evidence_dept ON public.evidence_items("departmentId");
CREATE INDEX IF NOT EXISTS idx_notifs_user ON public.notifications("userId");
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs("createdAt");

-- ------------------------------------------------------------------------------
-- Enable Row Level Security (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_category_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closing_the_loop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pulse_surveys ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Permissive Access Policies for Backend / Public Application
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'departments', 'programmes', 'academic_years', 'users', 'stakeholders',
        'quality_categories', 'quality_indicators', 'feedback_categories',
        'role_category_mappings', 'question_templates', 'feedback_forms',
        'feedback_responses', 'quality_gaps', 'action_plans', 'closing_the_loop',
        'evidence_items', 'ai_insights', 'reports', 'notifications', 'audit_logs',
        'pulse_surveys'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow full access for service and anon" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Allow full access for service and anon" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl);
    END LOOP;
END $$;
