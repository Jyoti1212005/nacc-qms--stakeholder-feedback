# NAAC-QMS RESTful API Specification

This document provides complete documentation for the backend API endpoints exposed by the **NAAC Stakeholder Feedback & Quality Management System (NAAC-QMS)**.

---

## Base URL
All API requests are routed under:  
`/api/`

## Authentication
Protected routes require the `Authorization` HTTP header with a Bearer token:
```http
Authorization: Bearer <user_id>
```

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
Authenticates a user and starts an active session.

**Request Body:**
```json
{
  "email": "iqac@naac-qms.edu",
  "password": "any_password"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user-2",
    "name": "Prof. Radhika Venkataraman",
    "email": "iqac@naac-qms.edu",
    "role": "IQAC_ADMIN",
    "designation": "Director, IQAC & Professor",
    "departmentId": "dept-1"
  },
  "token": "user-2"
}
```

---

## 2. Dashboard Endpoints

### `GET /api/dashboard/summary`
Returns institutional KPI cards, multi-year satisfaction trends, and department rankings.

**Query Parameters:**
- `academicYearId` (optional, string)
- `departmentId` (optional, string)
- `stakeholderType` (optional, string)

**Response (200 OK):**
```json
{
  "stats": {
    "totalStakeholders": 1250,
    "totalResponses": 780,
    "responseRatePercent": 78.4,
    "activeSurveys": 5,
    "averageSatisfaction": 4.14,
    "criticalGapsCount": 3,
    "openActionsCount": 2,
    "closedActionsCount": 5,
    "pendingEvidenceCount": 1,
    "qualityIndexScore": 84.6
  },
  "satisfactionTrend": [
    { "academicYear": "2022-23", "score": 3.82, "responses": 540 },
    { "academicYear": "2026-27", "score": 4.28, "responses": 780 }
  ],
  "departmentPerformance": [
    { "department": "CSE", "score": 4.18, "responses": 290, "actionClosureRate": 85 }
  ],
  "qualityFunnel": [
    { "stage": "Feedback Received", "count": 780 },
    { "stage": "Gaps Flagged", "count": 8 },
    { "stage": "Actions Closed", "count": 5 }
  ]
}
```

---

## 3. IQAC Command Center Endpoints

### `GET /api/iqac/overview`
Retrieves the composite Institutional Quality Improvement Index breakdown and 7 criteria metrics.

**Response (200 OK):**
```json
{
  "index": {
    "totalIndex": 84.6,
    "statusLabel": "GOOD",
    "criticalGapsCount": 3,
    "openActions": 2,
    "components": {
      "satisfactionScore": 82.8,
      "responseRatePercent": 78.4,
      "actionClosureRatePercent": 80.0,
      "improvementDeltaPercent": 75.0,
      "evidenceCompletenessPercent": 85.0
    },
    "weights": {
      "stakeholderSatisfaction": 0.3,
      "responseRate": 0.15,
      "actionClosureRate": 0.25,
      "improvementDelta": 0.15,
      "evidenceCompleteness": 0.15
    }
  },
  "criteriaSummary": [
    {
      "categoryId": "cat-1",
      "code": "Criterion 1",
      "name": "Curricular Aspects",
      "weight": 150,
      "achievementPercent": 84,
      "indicatorsCount": 2
    }
  ]
}
```

### `POST /api/iqac/weights`
Updates institutional weights for the Quality Improvement Index formula. Requires role `SUPER_ADMIN` or `IQAC_ADMIN`.

**Request Body:**
```json
{
  "stakeholderSatisfaction": 0.30,
  "responseRate": 0.15,
  "actionClosureRate": 0.25,
  "improvementDelta": 0.15,
  "evidenceCompleteness": 0.15
}
```

---

## 4. Feedback Survey Endpoints

### `GET /api/feedback/forms`
Lists available feedback survey instruments.

**Query Parameters:**
- `academicYearId` (optional, string)
- `targetType` (optional, enum)

### `POST /api/feedback/forms`
Creates a new structured survey instrument with sections and questions.

### `POST /api/feedback/responses`
Records a stakeholder's completed response. Automatically triggers Quality Gap detection if parameters fall below target thresholds.

**Request Body:**
```json
{
  "formId": "form-1",
  "academicYearId": "ay-2026-27",
  "departmentId": "dept-1",
  "isAnonymous": true,
  "stakeholderType": "STUDENT",
  "answers": [
    { "questionId": "q-1-1", "scoreValue": 4.5 },
    { "questionId": "q-1-3", "textValue": "Need more cloud GPU instances." }
  ]
}
```

---

## 5. Quality Gap Analysis Endpoints

### `GET /api/gaps`
Retrieves detected and verified quality deficiencies.

### `POST /api/gaps/:id/verify`
Marks a flagged gap as verified by IQAC.

### `POST /api/gaps/:id/convert-to-capa`
Converts a verified quality gap into an assigned CAPA remediation plan.

**Request Body:**
```json
{
  "rootCause": "Aging hardware in Lab 4 and insufficient budget allocation.",
  "correctiveAction": "Procure 30 high-performance workstations.",
  "preventiveAction": "Institute a recurring 3-year hardware refresh cycle.",
  "assignedToName": "Dr. Anand Raman (HoD CSE)",
  "dueDate": "2026-10-31"
}
```

---

## 6. CAPA Action Plans Endpoints

### `GET /api/action-plans`
Lists CAPA action plans with overdue indicators, before/after scores, and attached evidence.

### `PUT /api/action-plans/:id`
Updates an action plan's remediation status or remeasured scores.

**Request Body:**
```json
{
  "status": "CLOSED",
  "afterScore": 4.31,
  "closureRemarks": "Workstations installed, inspected, and verified with students."
}
```

### `POST /api/action-plans/:id/link-evidence`
Attaches a document from the evidence repository to this CAPA plan.

**Request Body:**
```json
{
  "evidenceId": "evi-1"
}
```

---

## 7. Evidence Repository Endpoints

### `GET /api/evidence`
Retrieves stored evidence documents with verification statuses.

### `POST /api/evidence`
Uploads and indexes a new documentary evidence item.

### `POST /api/evidence/:id/verify`
Updates verification status (`VERIFIED`, `REQUIRES_UPDATE`, `REJECTED`) with auditor observations.

---

## 8. Action Taken Report (ATR) Endpoints

### `GET /api/atr`
Retrieves consolidated ATR records with before-intervention baseline, post-intervention remeasured score, and calculated delta ($\Delta$).

---

## 9. Qualitative Analytics Endpoints

### `GET /api/ai/insights`
Fetches all synthesized qualitative sentiment insights.

### `POST /api/ai/generate`
Triggers qualitative theme clustering, sentiment extraction, and CAPA formulation for a chosen domain.

### `POST /api/ai/insights/:id/approve`
Formally ratifies an insight record for inclusion in institutional records. Requires role `IQAC_ADMIN`.

---

## 10. Audit Log Endpoints

### `GET /api/audit-logs`
Returns the immutable audit log trail. Supports filtering by `module`, `action`, and `search`.
