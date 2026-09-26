# NAAC-QMS MongoDB Atlas Integration Guide

This guide explains how MongoDB has been integrated with the **NAAC Stakeholder Feedback & Quality Management System (NAAC-QMS)** using a resilient **Hybrid Architecture**.

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
  |    MongoDB Atlas      |                     | In-Memory Cache/Store |
  | (Cloud Relational DB) | <--- (Sync Layer) - | (Zero-Downtime Fallback)|
  +-----------------------+                     +-----------------------+
```

### Key Highlights:
1. **Resilient Hybrid Fallback**:
   * If `MONGODB_URI` is provided and the network is connected, data is loaded from and stored into **MongoDB Atlas**.
   * If `MONGODB_URI` is empty or connection fails, the system automatically falls back to an **In-Memory Store** so the application **never crashes**.
2. **Auto-Seeding**:
   * On the very first connection to an empty MongoDB database, the system automatically populates all institutional departments, programmes, users, academic years, question templates, forms, and sample responses.
3. **Mongoose Models**:
   * Clean schemas defined in [`server/models/index.ts`](file:///c:/Users/soura/Downloads/naac-qms---stakeholder-feedback-&-quality-management-system/server/models/index.ts) for all 18 NAAC QMS entities.

---

## 2. Quick Setup Steps (MongoDB Atlas)

### Step 1: Create a Free MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in/create a free account.
2. Create a free shared cluster (e.g. `Cluster0` on AWS or Google Cloud).
3. Under **Database Access**, create a database user (e.g. username `naac_admin` and a strong password).
4. Under **Network Access**, add IP Access List:
   * Allow access from anywhere: `0.0.0.0/0` (recommended for development) or your current IP.

### Step 2: Get Connection String
1. Click **Connect** on your cluster.
2. Select **Drivers** (Node.js).
3. Copy the connection string. It looks like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 3: Add URI to `.env`
Open the [`.env`](file:///c:/Users/soura/Downloads/naac-qms---stakeholder-feedback-&-quality-management-system/.env) file in the project root and paste your connection string with the database name `naac_qms`:
```env
MONGODB_URI="mongodb+srv://naac_admin:YOUR_PASSWORD@cluster0.abcde.mongodb.net/naac_qms?retryWrites=true&w=majority"
```

### Step 4: Run the Application
Start the development server:
```bash
npm run dev
```

You will see:
```text
[MongoDB] Connecting to MongoDB Atlas...
[MongoDB] Connected successfully to MongoDB Database!
[MongoDB] Empty database detected. Seeding initial institutional data into MongoDB...
[MongoDB] Initial seeding completed successfully!
[MongoDB Sync] Synchronized 15 users, 4 forms, 1200 responses.
[NAAC-QMS] Institutional Quality Portal running at http://localhost:3000
```

---

## 3. Database Diagnostics API

You can verify your MongoDB connection status at any time by visiting:
* URL: `http://localhost:3000/api/database/status`

Sample Output:
```json
{
  "connected": true,
  "provider": "MongoDB Atlas (Persistent Cloud Cluster)",
  "database": "naac_qms",
  "status": "ONLINE",
  "counts": {
    "users": 15,
    "departments": 8,
    "programmes": 14,
    "feedbackForms": 4,
    "feedbackResponses": 1250,
    "qualityIndicators": 22,
    "qualityGaps": 6,
    "actionPlans": 12,
    "evidenceItems": 18
  }
}
```
