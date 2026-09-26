# NAAC-QMS Architecture & System Design

This document details the architectural blueprint, data flows, security model, and quality governance loops powering the **NAAC Stakeholder Feedback & Quality Management System (NAAC-QMS)**.

---

## 1. System Topology & Architectural Overview

NAAC-QMS is designed as a unified full-stack web application optimized for higher education accreditation workflows.

```text
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|  React 19 + TypeScript + Vite + Tailwind CSS 4 + Recharts + Lucide Icons |
|  - Role-Aware Dynamic View Routing                                      |
|  - Multi-Stakeholder Dynamic Survey Form Engine                         |
|  - Live Quality Index Calculation Display                               |
|  - Global Search & Audit Logs Viewer                                    |
+------------------------------------+------------------------------------+
                                     |
                                     | RESTful JSON (Bearer Auth)
                                     v
+------------------------------------+------------------------------------+
|                            APPLICATION TIER                             |
|              Node.js + Express 4 + TypeScript (TSX Runtime)             |
|  - Authentication & RBAC Middleware                                     |
|  - Continuous Quality Improvement Calculation Engine                    |
|  - Automated Gap Threshold Trigger (< 4.00 / 5.00)                      |
|  - Evidence Document Association & Audit Verification Workflow          |
|  - Regulatory Report & CSV Generator                                    |
+-------------------+---------------------------------+-------------------+
                    |                                 |
                    v                                 v
+-------------------+---------------+   +-------------+-------------------+
|            DATA STORE             |   |    QUALITATIVE ANALYTICS ENGINE |
|  Prisma ORM + PostgreSQL-Ready    |   |  Sentiment & Thematic Pipeline  |
|  In-Memory Storage Architecture   |   |  - Thematic Sentiment Synthesis |
|  - Seeded Higher Ed Datasets      |   |  - Suggested CAPA Generator     |
|  - Referential Integrity          |   |  - Manual IQAC Review Gate      |
|  - Audit Log Tracking             |   |  - Heuristic Offline Fallback   |
+-----------------------------------+   +---------------------------------+
```

---

## 2. The Continuous Quality Improvement Loop

Unlike static survey collection tools, NAAC-QMS enforces a closed-loop quality lifecycle:

```text
                  ┌───────────────────────────────┐
                  │ 1. Multi-Stakeholder Feedback │
                  │  (Student, Faculty, Alumni,   │
                  │   Employer, Parent Surveys)   │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │ 2. Automated Quality Analysis │
                  │   & Gap Threshold Detection   │
                  │  (Flags parameters < 4.0 / 5) │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │   3. CAPA Formulation by HoD  │
                  │   - Root-Cause Investigation  │
                  │   - Corrective Intervention   │
                  │   - Preventive Safeguard      │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │ 4. Documentary Evidence Vault │
                  │  (Purchase orders, revised    │
                  │   syllabi, workshop logs, MoUs│
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │  5. Remeasurement & Delta     │
                  │   Verification by IQAC        │
                  │   (Baseline: 2.8 -> Post: 4.3)│
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │  6. Official NAAC-Ready ATR   │
                  │  (Action Taken Report with    │
                  │   Director & Principal Seal)  │
                  └───────────────────────────────┘
```

---

## 3. The Institutional Quality Improvement Index Formula

The system computes a composite **Institutional Quality Improvement Index** ($Q_{\text{Index}}$) on a 0 to 100 scale:

$$Q_{\text{Index}} = \left( w_1 \cdot S \right) + \left( w_2 \cdot R \right) + \left( w_3 \cdot C \right) + \left( w_4 \cdot D \right) + \left( w_5 \cdot E \right)$$

Where:
- $S$: **Stakeholder Satisfaction Score** (Normalized $0 - 100$)
- $R$: **Survey Response Rate** ($\%$)
- $C$: **Action Closure Rate** ($\%$ of CAPAs verified and closed)
- $D$: **Improvement Delta** ($\%$ of remeasured indicators showing positive gain)
- $E$: **Evidence Completeness** ($\%$ of closed actions with verified evidence)
- $\sum_{i=1}^5 w_i = 1.00$ (Default weights: $w_1 = 0.30, w_2 = 0.15, w_3 = 0.25, w_4 = 0.15, w_5 = 0.15$)

> **Important Regulatory Boundary**: The index is explicitly demarcated in all user interfaces and reports as an internal diagnostic tool for institutional self-evaluation, not an official NAAC accreditation grade.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Module / Operation | Super Admin | IQAC Admin | Principal | HoD | Faculty | Student |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Executive Dashboard** | Yes | Yes | Yes | Yes (Dept) | Yes (Dept) | No |
| **Manage Feedback Forms & Builder** | Yes | Yes | Read-Only | Read-Only | No | No |
| **Submit Feedback (Anonymous/Identified)** | Yes | Yes | Yes | Yes | Yes | Yes |
| **Verify Detected Quality Gaps** | Yes | Yes | Read-Only | Read-Only | No | No |
| **Convert Gap to CAPA** | Yes | Yes | Read-Only | Yes (Dept) | No | No |
| **Manage & Close CAPA Plans** | Yes | Yes | Read-Only | Yes (Dept) | No | No |
| **Upload Evidence Documents** | Yes | Yes | Yes | Yes | Yes | No |
| **Audit & Verify Evidence** | Yes | Yes | Read-Only | No | No | No |
| **Configure Quality Index Weights** | Yes | Yes | No | No | No | No |
| **Run & Approve Qualitative Synthesis** | Yes | Yes | Read-Only | No | No | No |
| **Generate & Sign Official ATR / Reports** | Yes | Yes | Yes | Read-Only | No | No |
| **Inspect System Audit Logs** | Yes | Yes | Read-Only | No | No | No |

---

## 5. Privacy-Preserving Feedback Model

To collect authentic student and faculty feedback without fear of retaliation, NAAC-QMS implements a privacy-preserving submission architecture:

1. **Anonymous Mode Flag**: Each survey can be configured to allow anonymous submissions.
2. **Identity Decoupling**: When `isAnonymous: true`, the system:
   - Sets `userId: null` in the stored response record.
   - Clears respondent identifiers from qualitative text fields.
   - Omits IP address from the feedback payload stored in public tables.
   - Preserves demographic metadata (e.g., department and academic year) solely for aggregate cohort analytics.

---

## 6. Qualitative Analytics & Governance

The qualitative feedback synthesis subsystem adheres to quality assurance principles:
- **Grounding in Institutional Data**: Prompts receive strictly anonymized stakeholder feedback summaries.
- **Verification Workflow**: Automated themes and recommended CAPA interventions remain in `DRAFT` status until explicitly reviewed and approved by the IQAC Director.
- **Deterministic Offline Fallback**: If no external API key is configured or network calls fail, the built-in heuristics engine produces structured insights to ensure 100% reliable offline operation.
