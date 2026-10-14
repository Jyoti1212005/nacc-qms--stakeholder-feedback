# NAAC-QMS Supabase Integration & Setup Guide

This guide explains how **Supabase (PostgreSQL Cloud)** is integrated with the **NAAC Stakeholder Feedback & Quality Management System (NAAC-QMS)** using a resilient **Hybrid Architecture**.

---

## 1. Architecture Overview

```
                      +-----------------------------+
                      |       React Frontend        |
                      +--------------+--------------+
                                     |  REST API
                                     v
                      +-----------------------------+
                      |   Express + Node.js Server  |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v                                             v
  +-----------------------+                     +-----------------------+
  |    Supabase Cloud     |                     | In-Memory State Store |
  |   (PostgreSQL Cloud)  | <--- (Sync Layer) - | (Zero-Downtime Fallback)|
  +-----------------------+                     +-----------------------+
```

### Key Highlights:
1. **Resilient Hybrid Fallback**:
   * If `SUPABASE_URL` and `SUPABASE_ANON_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) are provided in `.env`, data is loaded from and stored into **Supabase Cloud**.
   * If keys are empty or not configured yet, the system runs in **In-Memory Fallback Mode** with realistic seed data, guaranteeing **zero crashes** and immediate usability.
2. **Auto-Seeding**:
   * On the very first connection to an empty Supabase database, the system automatically populates all institutional departments, programmes, users, academic years, question templates, feedback categories, forms, quality gaps, CAPA action plans, evidence, and sample responses.
3. **High-Performance Repositories**:
   * Clean models defined in [`server/models/index.ts`](file:///c:/Users/HP/Downloads/naac-qms---stakeholder-feedback-&-quality-management-system/server/models/index.ts) for all 21 NAAC-QMS entities.
4. **Complete SQL Migration Script**:
   * Ready-to-run schema script in [`supabase_schema.sql`](file:///c:/Users/HP/Downloads/naac-qms---stakeholder-feedback-&-quality-management-system/supabase_schema.sql) with tables, foreign keys, indexes, and RLS (Row Level Security) policies.

---

## 2. Quick Setup Steps (Supabase Cloud)

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free account or sign in.
2. Click **New Project**.
3. Choose an organization, enter a project name (e.g., `naac-qms`), choose a region (e.g. `ap-south-1` Mumbai or closest), and set a secure database password.
4. Wait 1-2 minutes for the database cluster to provision.

### Step 2: Run the Schema Migration
1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Copy the entire contents of [`supabase_schema.sql`](file:///c:/Users/HP/Downloads/naac-qms---stakeholder-feedback-&-quality-management-system/supabase_schema.sql) and paste it into the editor.
4. Click **Run** (or `Ctrl+Enter`).
5. All 21 tables, constraints, indexes, and security policies will be created instantly.

### Step 3: Copy Your API Credentials
1. In your Supabase Dashboard, navigate to **Project Settings** (gear icon) -> **API**.
2. Copy:
   * **Project URL**: e.g. `https://xyzabcdefghijklm.supabase.co`
   * **anon (public)** key: e.g. `eyJhbGciOiJIUzI1NiIsInR5cCI...`
   * *(Optional but recommended)* **service_role (secret)** key for backend admin operations.

### Step 4: Configure `.env`
Open your [`.env`](file:///c:/Users/HP/Downloads/naac-qms---stakeholder-feedback-&-quality-management-system/.env) file and paste your credentials:

```env
# Supabase Cloud Database Configuration
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Step 5: Start the Server
Run the dev server:
```powershell
npm.cmd run dev
```

You will see:
```text
[Supabase] Connecting to Supabase Cloud PostgreSQL...
[Supabase] Connected successfully to Supabase PostgreSQL database!
[Supabase] Synchronized 15 users, 4 forms, 1000+ responses.
[NAAC-QMS] Institutional Quality Portal running at http://localhost:3000
```

---

## 3. Database Status & Diagnostics

To check database connection status in real-time, visit:
* URL: `http://localhost:3000/api/database/status`

Example Response:
```json
{
  "connected": true,
  "provider": "Supabase (PostgreSQL Cloud)",
  "database": "Supabase",
  "status": "ONLINE",
  "counts": {
    "users": 15,
    "departments": 8,
    "programmes": 12,
    "feedbackForms": 4,
    "feedbackResponses": 1050,
    "qualityIndicators": 18,
    "qualityGaps": 6,
    "actionPlans": 5,
    "evidenceItems": 8,
    "closingTheLoop": 5,
    "reports": 2,
    "auditLogs": 12
  }
}
```

---

## 4. Entity Collections in Supabase

| Table Name | Description | Key NAAC Criteria |
| :--- | :--- | :--- |
| `departments` | Academic and Administrative Departments | Criterion 1, 2 |
| `programmes` | Academic Programmes (UG, PG, Ph.D.) | Criterion 1 |
| `academic_years` | Assessment Cycles & Academic Years | Institutional |
| `users` | Roles (Super Admin, IQAC Director, Principal, HoD, Faculty, Student, Alumni, Employer) | Criterion 6, 7 |
| `stakeholders` | Registered stakeholder records | Criterion 1.4 |
| `feedback_categories`| NAAC Core Metric Quality Domains | Criterion 1.4, 2.7 |
| `role_category_mappings`| Role-specific priority matrix | Criterion 1.4 |
| `question_templates` | Standardized questionnaire bank | Criterion 1.4, 2.7 |
| `feedback_forms` | Active & published evaluation instruments | Criterion 1.4.1 |
| `feedback_responses`| Collected feedback responses with itemized scores | Criterion 1.4.2 |
| `quality_categories`| Institutional criteria weights | Criterion 6.5 |
| `quality_indicators`| Quantitative quality KPIs | Criterion 6.5.1 |
| `quality_gaps` | Algorithmic gap detections | Criterion 1.4, 6.5 |
| `action_plans` | Corrective & Preventive Actions (CAPA) | Criterion 1.4.2, 6.5.3 |
| `closing_the_loop` | Verified before/after improvement outcomes | Criterion 1.4, 2.7, 6.5 |
| `evidence_items` | Geo-tagged and timestamped documentation | Criterion 1.4, 2.7 |
| `ai_insights` | Gemini AI qualitative synthesis | Institutional Quality |
| `pulse_surveys` | Rapid sentiment pulse submissions | Criterion 2.7 |
| `reports` | Approved Annual AQAR, IQAC Audit & ATRs | Criterion 6.5 |
| `notifications` | System alerts & CAPA assignment notices | Workflow |
| `audit_logs` | Immutable audit trail with IP & timestamps | Compliance |
