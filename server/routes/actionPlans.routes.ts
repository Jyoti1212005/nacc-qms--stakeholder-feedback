import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';
import { getAuthUser } from '../middleware/auth.ts';
import { ActionPlan } from '../types.ts';

export const actionPlansRouter = Router();

actionPlansRouter.get('/action-plans', (req: Request, res: Response) => {
  const { status, departmentId } = req.query;
  let actions = dbStore.actionPlans;

  if (status) {
    actions = actions.filter((a) => a.status === status);
  }
  if (departmentId) {
    actions = actions.filter((a) => a.departmentId === departmentId);
  }

  const today = new Date().toISOString().slice(0, 10);
  const enriched = actions.map((a) => ({
    ...a,
    isOverdue: a.dueDate < today && a.status !== 'CLOSED' && a.status !== 'COMPLETED',
    evidenceList: dbStore.evidenceItems.filter((e) => a.evidenceIds.includes(e.id)),
  }));

  res.json(enriched);
});

actionPlansRouter.post('/action-plans', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const data = req.body;

  const capaCode = `CAPA-2026-${(dbStore.actionPlans.length + 1).toString().padStart(3, '0')}`;
  const newAction: ActionPlan = {
    id: `capa-${Date.now()}`,
    code: capaCode,
    gapId: data.gapId,
    departmentId: data.departmentId || 'dept-1',
    issue: data.issue,
    rootCause: data.rootCause || '',
    correctiveAction: data.correctiveAction,
    preventiveAction: data.preventiveAction || '',
    priority: data.priority || 'HIGH',
    status: data.status || 'OPEN',
    assignedToId: data.assignedToId || 'user-hod-cse',
    assignedToName: data.assignedToName || 'Dr. Anand Raman',
    createdById: user?.id || 'user-iqac',
    createdByName: user?.fullName || 'IQAC Coordinator',
    startDate: data.startDate || new Date().toISOString().slice(0, 10),
    dueDate: data.dueDate || new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
    expectedOutcome: data.expectedOutcome || '',
    beforeScore: data.beforeScore ? Number(data.beforeScore) : undefined,
    evidenceIds: data.evidenceIds || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.actionPlans.unshift(newAction);
  dbStore.addNotification(newAction.assignedToId, 'New Action Plan Assigned', `Action item ${newAction.code} has been assigned.`, 'ACTION_ASSIGNED', '/action-plans');
  dbStore.logAudit('CREATE', 'CAPA', `Created Action Plan ${newAction.code}: ${newAction.issue.slice(0, 40)}...`, user, undefined, req.ip);

  res.status(201).json(newAction);
});

actionPlansRouter.put('/action-plans/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const index = dbStore.actionPlans.findIndex((a) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Action Plan not found' });

  const existing = dbStore.actionPlans[index];
  const updated: ActionPlan = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  if (req.body.status === 'CLOSED' && existing.status !== 'CLOSED') {
    updated.completedAt = new Date().toISOString().slice(0, 10);
    updated.verifiedById = user?.id;
    updated.verifiedByName = user?.fullName;
  }

  dbStore.actionPlans[index] = updated;
  dbStore.logAudit('UPDATE', 'CAPA', `Updated Action Plan ${updated.code} status to ${updated.status}`, user, undefined, req.ip);
  res.json(updated);
});

actionPlansRouter.post('/action-plans/:id/link-evidence', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const action = dbStore.actionPlans.find((a) => a.id === req.params.id);
  if (!action) return res.status(404).json({ error: 'Action plan not found' });

  const { evidenceId } = req.body;
  if (!action.evidenceIds.includes(evidenceId)) {
    action.evidenceIds.push(evidenceId);
  }

  const evi = dbStore.evidenceItems.find((e) => e.id === evidenceId);
  if (evi) {
    evi.actionPlanId = action.id;
  }

  dbStore.logAudit('LINK_EVIDENCE', 'CAPA', `Linked Evidence ${evi?.code || evidenceId} to CAPA ${action.code}`, user, undefined, req.ip);
  res.json({ success: true, action });
});
