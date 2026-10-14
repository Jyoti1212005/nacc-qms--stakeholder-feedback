# NAAC-QMS Database Schema & Data Dictionary

This document specifies the database schemas, entity relationships, constraints, and data dictionaries for the **NAAC Stakeholder Feedback & Quality Management System (NAAC-QMS)**.

> [!NOTE]
> **Supabase Cloud Database Integration**: The system is integrated with **Supabase (PostgreSQL Cloud)** using a resilient hybrid architecture with instant auto-seeding and in-memory fallback. See [`SUPABASE_GUIDE.md`](file:///c:/Users/HP/Downloads/naac-qms---stakeholder-feedback-&-quality-management-system/SUPABASE_GUIDE.md), SQL migration script in [`supabase_schema.sql`](file:///c:/Users/HP/Downloads/naac-qms---stakeholder-feedback-&-quality-management-system/supabase_schema.sql), and models in [`server/models/index.ts`](file:///c:/Users/HP/Downloads/naac-qms---stakeholder-feedback-&-quality-management-system/server/models/index.ts).

---

## 1. Entity-Relationship Model (ERD)

```
+------------------+         1:N         +-------------------+
|    Department    | <------------------ |       User        |
+------------------+                     +-------------------+
        ^                                          ^
        | 1:N                                      | 1:N (Author / Assignee)
+------------------+                     +-------------------+
|  FeedbackForm    |                     |    ActionPlan     | <-----+
+------------------+                     +-------------------+       |
        | 1:N                                      |                 | N:M
        v                                          v                 |
+------------------+                     +-------------------+       |
|   FormSection    |                     |   EvidenceItem    | ------+
+------------------+                     +-------------------+
        | 1:N                                      ^
        v                                          |
+------------------+         1:N                   |
|   FormQuestion   | <----------------+            |
+------------------+                  |            |
        ^                             |            |
        | 1:N                         |            |
+------------------+         1:N      |            |
|  ResponseAnswer  | <----------------+            |
+------------------+                               |
        ^                                          |
        | N:1                                      |
+------------------+         1:N                   |
| FeedbackResponse | ------------------------------+
+------------------+
```

---

## 2. Relational Schema Definitions

### Table: `users`
Stores user identities, institutional roles, credentials, and department affiliations.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | PK | Unique user identifier |
| `email` | VARCHAR(191) | UNIQUE, NOT NULL | Institutional email address |
| `name` | VARCHAR(191) | NOT NULL | Full name of user |
| `role` | ENUM | NOT NULL | `SUPER_ADMIN`, `IQAC_ADMIN`, `PRINCIPAL`, `HOD`, `FACULTY`, `STUDENT`, `ALUMNI`, `EMPLOYER`, `PARENT` |
| `departmentId` | VARCHAR(36) | FK, NULLABLE | References `departments.id` |
| `designation` | VARCHAR(191) | NULLABLE | Official designation (e.g. "Professor & Head") |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

---

### Table: `departments`
Academic departments and administrative units.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | PK | Unique department identifier |
| `code` | VARCHAR(20) | UNIQUE, NOT NULL | e.g. "CSE", "ECE", "MECH" |
| `name` | VARCHAR(191) | NOT NULL | e.g. "Department of Computer Science & Engineering" |
| `headOfDept` | VARCHAR(191) | NOT NULL | Name of department head |
| `establishedYear`| INT | NOT NULL | Year department was founded |

---

### Table: `feedback_forms`
Survey instruments configured for stakeholders.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | PK | Unique form identifier |
| `title` | VARCHAR(191) | NOT NULL | Form title |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Institutional form code (e.g. "FB-STUDENT-2026") |
| `description` | TEXT | NULLABLE | Contextual purpose of the evaluation |
| `targetType` | ENUM | NOT NULL | `STUDENT`, `FACULTY`, `ALUMNI`, `EMPLOYER`, `PARENT` |
| `status` | ENUM | DEFAULT 'DRAFT'| `DRAFT`, `PUBLISHED`, `CLOSED`, `ARCHIVED` |
| `allowAnonymous` | BOOLEAN | DEFAULT TRUE | Whether respondents can submit anonymously |
| `academicYearId` | VARCHAR(36) | FK, NOT NULL | References `academic_years.id` |
| `responseCount` | INT | DEFAULT 0 | Cached count of completed responses |
| `averageScore` | FLOAT | DEFAULT 0.0 | Cached average score on a 5.0 scale |

---

### Table: `form_questions`
Individual measurement parameters within survey sections.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | PK | Unique question identifier |
| `sectionId` | VARCHAR(36) | FK, NOT NULL | References `form_sections.id` |
| `prompt` | TEXT | NOT NULL | Question text presented to respondent |
| `parameter` | VARCHAR(191) | NOT NULL | Academic parameter tag (e.g. "Curriculum Relevance") |
| `questionType` | ENUM | NOT NULL | `LIKERT_SCALE`, `RATING_STARS`, `NPS`, `MULTIPLE_CHOICE`, `SINGLE_CHOICE`, `YES_NO`, `TEXT_RESPONSE`, `NUMERIC_SCORE`, `FILE_ATTACHMENT` |
| `scaleMax` | INT | DEFAULT 5 | Scale ceiling for numeric parameters |
| `isRequired` | BOOLEAN | DEFAULT TRUE | Mandatory field flag |
| `orderIndex` | INT | NOT NULL | Sequence order inside section |

---

### Table: `feedback_responses`
Submissions recorded from stakeholders.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | PK | Unique response identifier |
| `formId` | VARCHAR(36) | FK, NOT NULL | References `feedback_forms.id` |
| `academicYearId`| VARCHAR(36) | FK, NOT NULL | References `academic_years.id` |
| `departmentId` | VARCHAR(36) | FK, NULLABLE | References `departments.id` |
| `userId` | VARCHAR(36) | FK, NULLABLE | References `users.id` (NULL if anonymous) |
| `stakeholderType`| ENUM | NOT NULL | `STUDENT`, `FACULTY`, `ALUMNI`, etc. |
| `isAnonymous` | BOOLEAN | DEFAULT TRUE | Privacy preservation flag |
| `overallScore` | FLOAT | NOT NULL | Mean score for numeric items (out of 5.0) |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Submission timestamp |

---

### Table: `quality_gaps`
Identified deficiencies where parameters fail institutional targets.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | PK | Unique gap identifier |
| `parameter` | VARCHAR(191) | NOT NULL | Deficient parameter name |
| `category` | VARCHAR(191) | NOT NULL | Associated NAAC Criteria |
| `currentScore` | FLOAT | NOT NULL | Measured satisfaction score |
| `targetScore` | FLOAT | NOT NULL | Institutional benchmark score |
| `gapValue` | FLOAT | NOT NULL | Variance delta |
| `priority` | ENUM | NOT NULL | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `status` | ENUM | DEFAULT 'DETECTED' | `DETECTED`, `VERIFIED`, `CONVERTED_TO_ACTION`, `RESOLVED` |
| `suggestedAction`| TEXT | NOT NULL | Recommended intervention |
| `actionPlanId` | VARCHAR(36) | FK, NULLABLE | References `action_plans.id` once converted |

---

### Table: `action_plans` (CAPA)
Structured corrective and preventive remediation plans.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | PK | Unique CAPA identifier |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | e.g. "CAPA-2026-001" |
| `gapId` | VARCHAR(36) | FK, NULLABLE | References originating `quality_gaps.id` |
| `departmentId` | VARCHAR(36) | FK, NOT NULL | References responsible department |
| `issue` | TEXT | NOT NULL | Problem statement |
| `rootCause` | TEXT | NOT NULL | Root-cause analysis |
| `correctiveAction`| TEXT | NOT NULL | Direct remedial steps |
| `preventiveAction`| TEXT | NOT NULL | Systemic prevention safeguards |
| `assignedToName` | VARCHAR(191) | NOT NULL | Responsible HoD or faculty lead |
| `status` | ENUM | DEFAULT 'ASSIGNED' | `ASSIGNED`, `IN_PROGRESS`, `AWAITING_EVIDENCE`, `UNDER_VERIFICATION`, `COMPLETED`, `CLOSED` |
| `dueDate` | DATE | NOT NULL | Target completion date |
| `beforeScore` | FLOAT | NULLABLE | Pre-intervention baseline score |
| `afterScore` | FLOAT | NULLABLE | Post-intervention remeasured score |
| `closureRemarks` | TEXT | NULLABLE | IQAC auditor remarks upon sign-off |

---

### Table: `evidence_items`
Documentary proof linking actions to regulatory standards.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | PK | Unique evidence identifier |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | e.g. "EVI-2026-01" |
| `title` | VARCHAR(191) | NOT NULL | Document title |
| `description` | TEXT | NULLABLE | Evidentiary purpose |
| `fileType` | ENUM | NOT NULL | `PDF`, `DOCX`, `XLSX`, `IMAGE` |
| `category` | VARCHAR(191) | NOT NULL | Associated NAAC Criterion |
| `verificationStatus` | ENUM | DEFAULT 'PENDING' | `PENDING`, `VERIFIED`, `REQUIRES_UPDATE`, `REJECTED` |
| `verifiedByName` | VARCHAR(191) | NULLABLE | Auditor who verified the item |
| `verificationNotes` | TEXT | NULLABLE | Auditor observations |

---

### Table: `audit_logs`
Immutable compliance audit trail.

| Field | Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(36) | PK | Unique log entry ID |
| `userId` | VARCHAR(36) | FK, NULLABLE | Actor who initiated action |
| `userName` | VARCHAR(191) | NOT NULL | Actor name |
| `userRole` | VARCHAR(50) | NOT NULL | Role of actor at time of event |
| `module` | VARCHAR(50) | NOT NULL | System module touched |
| `action` | VARCHAR(50) | NOT NULL | Operation performed (`CREATE`, `UPDATE`, etc.) |
| `description` | TEXT | NOT NULL | Event details |
| `ipAddress` | VARCHAR(45) | NOT NULL | IPv4 or IPv6 of client |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Event timestamp |
