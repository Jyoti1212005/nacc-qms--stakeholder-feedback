# NAAC-QMS: Stakeholder Feedback & Quality Management System

A full-stack institutional quality management system engineered for higher education institutions (universities and colleges) to collect stakeholder surveys, evaluate quality indicators across the 7 NAAC accreditation criteria, track Corrective and Preventive Actions (CAPA), maintain documentary evidence, and compile statutory Action Taken Reports (ATR).

---

## Overview

Higher education accreditation frameworks mandate that institutions collect multi-stakeholder feedback (Students, Teachers, Employers, Alumni, and Parents) and close the loop through documented quality interventions.

NAAC-QMS automates this lifecycle:

```text
Stakeholder Surveys ──> Automated Gap Detection (<4.0) ──> CAPA Formulation ──> Evidence Archiving ──> Remeasurement & ATR Generation
```

### Core Capabilities

1. **Executive Quality Dashboard**
   - 10 institutional KPIs (Response rates, average satisfaction, critical quality gaps, open/closed CAPAs, and institutional improvement index).
   - Multi-year trend analysis across 5 academic cycles (2022-23 to 2026-27).
   - Departmental comparison and stakeholder sentiment distribution.

2. **IQAC Command Center**
   - Weighted institutional quality improvement index calculation based on satisfaction (30%), response rate (15%), CAPA closure rate (25%), improvement delta (15%), and evidence completeness (15%).
   - Tracking across the 7 NAAC criteria (Curricular Aspects, Teaching-Learning, Research, Infrastructure, Student Support, Governance, and Best Practices).

3. **Dynamic Feedback Engine**
   - Survey instruments tailored for Students, Faculty, Alumni, Employers, and Parents.
   - Dynamic form builder supporting Likert 1-5, star ratings, NPS (0-10), multiple choice, and open-ended qualitative remarks.
   - Confidential submission mode (decouples user identifier and IP hashes from stored responses).
   - Threshold watchdog: any metric score falling below institutional benchmark automatically registers a Quality Gap.

4. **Corrective & Preventive Action (CAPA) Module**
   - Root-cause documentation, immediate corrective remediation, and systemic preventive safeguards.
   - Assignable to Heads of Department (HoD) with target due dates and automated overdue tracking.
   - Demonstrates measurable pre-intervention vs. post-intervention score deltas (e.g. $2.94 \rightarrow 4.31$, $\Delta +1.37$).

5. **Institutional Evidence Repository**
   - Central document storage for purchase orders, installation reports, MoUs, syllabus revision minutes, and attendance records.
   - IQAC review and audit verification workflow (Verified, Requires Update, Rejected).

6. **Action Taken Report (ATR) Generator**
   - Statutory compliance reporting for NAAC Criterion 1.4 (Metrics 1.4.1 & 1.4.2).
   - Generates audit-ready resolution matrices with before/after scores, responsible authorities, and linked evidence citations.
   - Printable institutional letterhead format and one-click CSV export for NAAC SSR submission.

7. **Qualitative Sentiment & Thematic Analytics**
   - Sentiment classification and thematic extraction across free-form stakeholder remarks.
   - Deterministic heuristics engine with optional LLM inference when configured with an API key.
   - Mandatory IQAC verification gate before summaries are approved for official compliance reports.

8. **Role-Based Access Control (RBAC)**
   - Pre-configured institutional roles: Super Admin, IQAC Coordinator, Principal, HoD (CSE), Faculty, and Student.
   - Fine-grained permission guards and department-level data isolation.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Lucide Icons, Recharts, Framer Motion
- **Backend**: Node.js, Express 4, TypeScript, RESTful API
- **Database / Schema**: PostgreSQL-ready schema defined in Prisma (`prisma/schema.prisma`) with in-memory repository store for rapid local development
- **Analytics**: NLP sentiment analysis and thematic extraction service with offline heuristics fallback

---

## Project Structure

```text
├── server/
│   ├── routes/                # Modular domain routers
│   │   ├── actionPlans.routes.ts
│   │   ├── analytics.routes.ts
│   │   ├── atr.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── closingTheLoop.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── departments.routes.ts
│   │   ├── evidence.routes.ts
│   │   ├── feedback.routes.ts
│   │   ├── gaps.routes.ts
│   │   ├── iqac.routes.ts
│   │   ├── qualityIndicators.routes.ts
│   │   ├── reports.routes.ts
│   │   ├── stakeholders.routes.ts
│   │   └── system.routes.ts
│   ├── middleware/            # Auth and request middleware
│   ├── analyticsService.ts    # Sentiment and qualitative analysis service
│   ├── db.ts                  # In-memory data store with audit logging
│   ├── routes.ts              # API router mounting domain sub-routers
│   ├── seedData.ts            # Realistic institutional seed records
│   └── types.ts               # Core TypeScript data contracts
├── src/
│   ├── components/            # Reusable UI components & modals
│   ├── context/               # AuthContext & AppContext
│   ├── pages/                 # Route page components
│   ├── types/                 # Frontend type definitions
│   ├── App.tsx                # App entrypoint with navigation router
│   ├── index.css              # Global styles & Tailwind configuration
│   └── main.tsx               # React DOM root
├── server.ts                  # Express full-stack bootloader
├── vite.config.ts             # Vite configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The portal will start at `http://localhost:3000`.

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Run production server:**
   ```bash
   npm start
   ```

5. **Typecheck:**
   ```bash
   npm run typecheck
   ```

---

## Test Accounts

The system includes pre-configured personas for demonstration and testing:

| Role | Name | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Dr. Vikramaditya Rao | `superadmin@naac-qms.edu` | `Admin@123` | Full Institutional Administration |
| **IQAC Director** | Prof. Radhika Venkataraman | `iqac@naac-qms.edu` | `Iqac@123` | Quality Cockpit, Surveys, Weights, ATR |
| **Principal** | Dr. K. S. Krishnamurthy | `principal@naac-qms.edu` | `Principal@123` | Executive Governance & Sign-offs |
| **HoD (CSE)** | Dr. Anand Raman | `hod.cse@naac-qms.edu` | `Hod@123` | Department Cockpit & Assigned CAPAs |
| **Faculty Member** | Dr. Meenakshi Sundaram | `faculty.cse@naac-qms.edu` | `Faculty@123` | Faculty Appraisal & Course Feedback |
| **Final-Year Student** | Aarav Sharma | `student@naac-qms.edu` | `Student@123` | Student Surveys & Feedback Submission |

*Note: You can switch between any account instantly via the **Demo Switcher** in the top navigation bar.*

---

## Documentation

- [Architecture & Design (`ARCHITECTURE.md`)](./ARCHITECTURE.md)
- [Database Schema Dictionary (`DATABASE.md`)](./DATABASE.md)
- [REST API Reference (`API.md`)](./API.md)
- [Production Deployment Guide (`DEPLOYMENT.md`)](./DEPLOYMENT.md)

---

## License

This project is licensed under the MIT License.
