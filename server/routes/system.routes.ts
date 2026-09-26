import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';
import { getAuthUser } from '../middleware/auth.ts';

export const systemRouter = Router();

// Notifications
systemRouter.get('/notifications', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  let notifs = dbStore.notifications;
  if (user) {
    notifs = notifs.filter((n) => n.userId === user.id || n.userId === 'all');
  }
  res.json(notifs);
});

systemRouter.post('/notifications/:id/read', (req: Request, res: Response) => {
  const notif = dbStore.notifications.find((n) => n.id === req.params.id);
  if (notif) notif.isRead = true;
  res.json({ success: true });
});

systemRouter.post('/notifications/read-all', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (user) {
    dbStore.notifications.filter((n) => n.userId === user.id).forEach((n) => (n.isRead = true));
  } else {
    dbStore.notifications.forEach((n) => (n.isRead = true));
  }
  res.json({ success: true });
});

systemRouter.post('/notifications/simulate-event', (req: Request, res: Response) => {
  const user = getAuthUser(req) || dbStore.users[0];
  const { eventType, title, message } = req.body;

  let newNotif;
  if (eventType === 'ACTION_ASSIGNED') {
    const code = `CAPA-2026-${Math.floor(100 + Math.random() * 900)}`;
    newNotif = dbStore.addNotification(
      user.id,
      title || 'New Action Plan Assigned',
      message || `Action Plan ${code}: 'Upgrade Advanced Computing Lab Hardware' has been assigned to you. Due date: 30 days.`,
      'ACTION_ASSIGNED',
      '/action-plans'
    );
    dbStore.logAudit('ASSIGN_CAPA', 'NOTIFICATIONS', `Real-time Alert: Assigned ${code} to ${user.fullName}`, user, undefined, req.ip);
  } else {
    const surveyNum = Math.floor(10 + Math.random() * 90);
    newNotif = dbStore.addNotification(
      'all',
      title || 'New Survey Published',
      message || `Survey "QMS-SURVEY-${surveyNum}: Institutional Curriculum & Pedagogy Evaluation" is now open for your feedback.`,
      'SURVEY_PUBLISHED',
      '/feedback'
    );
    dbStore.logAudit('PUBLISH_SURVEY', 'NOTIFICATIONS', `Real-time Alert: Published new survey QMS-SURVEY-${surveyNum}`, user, undefined, req.ip);
  }

  res.json({ success: true, notification: newNotif });
});

// Audit Logs
systemRouter.get('/audit-logs', (req: Request, res: Response) => {
  const { module, action, search } = req.query;
  let logs = dbStore.auditLogs;

  if (module) {
    logs = logs.filter((l) => l.module === module);
  }
  if (action) {
    logs = logs.filter((l) => l.action === action);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    logs = logs.filter(
      (l) =>
        l.description.toLowerCase().includes(q) ||
        (l.userName && l.userName.toLowerCase().includes(q))
    );
  }

  res.json(logs.slice(0, 100));
});

// Global Full-Text Search
systemRouter.get('/search', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').toLowerCase().trim();
  if (!q || q.length < 2) {
    return res.json({ results: [] });
  }

  const results: { type: string; title: string; subtitle: string; link: string }[] = [];

  dbStore.feedbackForms.forEach((f) => {
    if (f.title.toLowerCase().includes(q) || f.code.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) {
      results.push({ type: 'Survey Form', title: f.title, subtitle: `${f.code} • ${f.targetType}`, link: '/forms' });
    }
  });

  dbStore.actionPlans.forEach((a) => {
    if (a.code.toLowerCase().includes(q) || a.issue.toLowerCase().includes(q) || a.correctiveAction.toLowerCase().includes(q)) {
      results.push({ type: 'CAPA Action', title: a.code, subtitle: `${a.issue.slice(0, 60)}... (${a.status})`, link: '/action-plans' });
    }
  });

  dbStore.evidenceItems.forEach((e) => {
    if (e.title.toLowerCase().includes(q) || e.code.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q))) {
      results.push({ type: 'Evidence', title: e.title, subtitle: `${e.code} • ${e.category} (${e.verificationStatus})`, link: '/evidence' });
    }
  });

  dbStore.qualityIndicators.forEach((qi) => {
    if (qi.name.toLowerCase().includes(q) || qi.code.toLowerCase().includes(q)) {
      results.push({ type: 'Indicator', title: qi.name, subtitle: `${qi.code} • Score: ${qi.actualScore}/${qi.targetScore}`, link: '/quality-indicators' });
    }
  });

  dbStore.departments.forEach((d) => {
    if (d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)) {
      results.push({ type: 'Department', title: d.name, subtitle: `Code: ${d.code} • HoD: ${d.headOfDept}`, link: `/departments/${d.id}` });
    }
  });

  res.json({ query: q, results: results.slice(0, 15) });
});

// System Settings
systemRouter.get('/settings', (_req: Request, res: Response) => {
  res.json({
    institutionName: 'Apex Institute of Technology & Management (Autonomous)',
    shortName: 'NAAC-QMS',
    currentCycle: 'Cycle 3 (2022-2027)',
    accreditationStatus: 'A+ Grade (3.42 CGPA in previous cycle)',
    currentAcademicYear: dbStore.academicYears.find((ay) => ay.isCurrent)?.name || '2026-27',
    academicYears: dbStore.academicYears,
    weights: dbStore.qualityWeights,
    categories: dbStore.qualityCategories,
  });
});

// Database Status & Diagnostics
systemRouter.get('/database/status', (_req: Request, res: Response) => {
  res.json(dbStore.getDatabaseStatus());
});

