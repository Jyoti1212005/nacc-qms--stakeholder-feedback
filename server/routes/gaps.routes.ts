import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';
import { getAuthUser } from '../middleware/auth.ts';
import { ActionPlan } from '../types.ts';

export const gapsRouter = Router();

gapsRouter.get('/gaps', (req: Request, res: Response) => {
  const { priority, status, departmentId } = req.query;
  let gaps = dbStore.qualityGaps;

  if (priority) {
    gaps = gaps.filter((g) => g.priority === priority);
  }
  if (status) {
    gaps = gaps.filter((g) => g.status === status);
  }
  if (departmentId) {
    gaps = gaps.filter((g) => g.departmentId === departmentId);
  }

  res.json(gaps);
});

gapsRouter.post('/gaps/:id/verify', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const gap = dbStore.qualityGaps.find((g) => g.id === req.params.id);
  if (!gap) return res.status(404).json({ error: 'Quality Gap not found' });

  gap.isVerified = true;
  gap.status = 'VERIFIED';
  dbStore.logAudit('VERIFY', 'GAP_ANALYSIS', `Verified Quality Gap: ${gap.parameter}`, user, undefined, req.ip);
  res.json({ success: true, gap });
});

gapsRouter.post('/gaps/:id/convert-to-capa', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const gap = dbStore.qualityGaps.find((g) => g.id === req.params.id);
  if (!gap) return res.status(404).json({ error: 'Quality Gap not found' });

  const capaCode = `CAPA-2026-${(dbStore.actionPlans.length + 1).toString().padStart(3, '0')}`;
  const newAction: ActionPlan = {
    id: `capa-${Date.now()}`,
    code: capaCode,
    gapId: gap.id,
    departmentId: gap.departmentId || 'dept-1',
    issue: `Quality deficiency identified in ${gap.parameter} (Current Score: ${gap.currentScore} vs Target: ${gap.targetScore})`,
    rootCause: req.body.rootCause || 'Root cause under investigation by departmental academic quality committee.',
    correctiveAction: req.body.correctiveAction || gap.suggestedAction,
    preventiveAction: req.body.preventiveAction || 'Institutionalize continuous mid-semester feedback checkpoints.',
    priority: gap.priority,
    status: 'ASSIGNED',
    assignedToId: req.body.assignedToId || 'user-hod-cse',
    assignedToName: req.body.assignedToName || 'Dr. Anand Raman (HoD CSE)',
    createdById: user?.id || 'user-iqac',
    createdByName: user?.fullName || 'Prof. Radhika Venkataraman (IQAC Director)',
    startDate: new Date().toISOString().slice(0, 10),
    dueDate: req.body.dueDate || new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
    expectedOutcome: `Improve parameter satisfaction score from ${gap.currentScore} to > ${gap.targetScore}.`,
    beforeScore: gap.currentScore,
    evidenceIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.actionPlans.unshift(newAction);
  gap.status = 'CONVERTED_TO_ACTION';
  dbStore.addNotification(newAction.assignedToId, 'New CAPA Assigned', `Action Plan ${newAction.code} for ${gap.parameter} has been assigned to you.`, 'ACTION_ASSIGNED', '/action-plans');
  dbStore.logAudit('CONVERT_CAPA', 'GAP_ANALYSIS', `Converted Gap ${gap.parameter} to Action Plan ${newAction.code}`, user, undefined, req.ip);

  res.status(201).json({ success: true, actionPlan: newAction });
});
