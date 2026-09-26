import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';
import { getAuthUser } from '../middleware/auth.ts';
import { QualityIndicator, ActionPlan } from '../types.ts';

export const qualityIndicatorsRouter = Router();

qualityIndicatorsRouter.get('/quality-indicators', (req: Request, res: Response) => {
  const { categoryId, departmentId } = req.query;
  let indicators = dbStore.qualityIndicators;

  if (categoryId) {
    indicators = indicators.filter((qi) => qi.categoryId === categoryId);
  }
  if (departmentId) {
    indicators = indicators.filter((qi) => qi.departmentId === departmentId);
  }

  const enriched = indicators.map((qi) => {
    const cat = dbStore.qualityCategories.find((c) => c.id === qi.categoryId);
    return {
      ...qi,
      categoryName: cat?.name || 'Criterion',
      categoryCode: cat?.code || '',
    };
  });

  res.json(enriched);
});

qualityIndicatorsRouter.post('/quality-indicators', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const data = req.body;

  const newIndicator: QualityIndicator = {
    id: `qi-${Date.now()}`,
    code: data.code || `QI-${(dbStore.qualityIndicators.length + 1).toString()}`,
    name: data.name,
    description: data.description || '',
    categoryId: data.categoryId || 'cat-1',
    departmentId: data.departmentId,
    academicYearId: data.academicYearId || 'ay-5',
    targetScore: Number(data.targetScore) || 4.0,
    actualScore: Number(data.actualScore) || 3.8,
    unit: data.unit || 'Rating (1-5)',
    dataSource: data.dataSource || 'Feedback Surveys',
    frequency: data.frequency || 'Annual',
    owner: data.owner || 'IQAC Coordinator',
    formula: data.formula,
    status: (data.actualScore >= data.targetScore ? 'EXCELLENT' : data.actualScore >= data.targetScore * 0.85 ? 'GOOD' : 'NEEDS_ATTENTION'),
    updatedAt: new Date().toISOString(),
  };

  dbStore.qualityIndicators.unshift(newIndicator);
  dbStore.logAudit('CREATE', 'INDICATORS', `Added Quality Indicator: ${newIndicator.name}`, user, undefined, req.ip);
  res.status(201).json(newIndicator);
});

qualityIndicatorsRouter.put('/quality-indicators/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const index = dbStore.qualityIndicators.findIndex((qi) => qi.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Quality Indicator not found' });

  const updated: QualityIndicator = {
    ...dbStore.qualityIndicators[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  dbStore.qualityIndicators[index] = updated;
  dbStore.logAudit('UPDATE', 'INDICATORS', `Updated Quality Indicator: ${updated.name}`, user, undefined, req.ip);
  res.json(updated);
});

qualityIndicatorsRouter.get('/quality-indicators/escalations', (_req: Request, res: Response) => {
  const escalatedIndicators = dbStore.qualityIndicators.filter(
    (qi) => qi.isEscalated || (qi.actualScore < qi.targetScore && (qi.daysBelowTarget || 0) >= 30 && !qi.hasAssignedCapa)
  );

  res.json({
    count: escalatedIndicators.length,
    escalationThresholdDays: 30,
    items: escalatedIndicators,
  });
});

qualityIndicatorsRouter.post('/quality-indicators/:id/assign-rapid-capa', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const indicator = dbStore.qualityIndicators.find((qi) => qi.id === req.params.id);
  if (!indicator) return res.status(404).json({ error: 'Quality Indicator not found' });

  const { correctiveAction, preventiveAction, assignedToId, assignedToName } = req.body;

  const dept = dbStore.departments.find((d) => d.id === indicator.departmentId) || dbStore.departments[0];
  const capaCode = `CAPA-2026-${Math.floor(100 + Math.random() * 900)}`;

  const newAction: ActionPlan = {
    id: `action-${Date.now()}`,
    code: capaCode,
    departmentId: dept.id,
    issue: `Escalated Quality Metric: ${indicator.name} (${indicator.code}) scoring ${indicator.actualScore} vs target ${indicator.targetScore} for ${indicator.daysBelowTarget || 35} days.`,
    rootCause: 'Prolonged performance deficit identified by automated IQAC escalation watchdog without assigned intervention.',
    correctiveAction: correctiveAction || `Initiate immediate executive remediation for ${indicator.name}. Convene departmental review committee.`,
    preventiveAction: preventiveAction || `Institute bi-weekly tracking checkpoints and incorporate progress metrics in monthly HoD reviews.`,
    priority: 'CRITICAL',
    status: 'ASSIGNED',
    assignedToId: assignedToId || user?.id || 'user-hod-cse',
    assignedToName: assignedToName || 'Head of Department / Committee Chair',
    createdById: user?.id || 'user-iqac',
    createdByName: user?.fullName || 'Prof. Radhika Venkataraman (Director, IQAC)',
    startDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    expectedOutcome: `Elevate ${indicator.code} score from ${indicator.actualScore} to >= ${indicator.targetScore} ${indicator.unit}.`,
    beforeScore: indicator.actualScore,
    evidenceIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.actionPlans.unshift(newAction);

  indicator.hasAssignedCapa = true;
  indicator.assignedCapaId = newAction.id;
  indicator.assignedCapaCode = newAction.code;
  indicator.isEscalated = false;
  indicator.escalationLevel = 'NONE';
  indicator.status = 'NEEDS_ATTENTION';

  dbStore.logAudit(
    'ASSIGN_RAPID_CAPA',
    'CAPA',
    `Rapid CAPA ${capaCode} assigned to resolve escalated indicator ${indicator.code}`,
    user,
    undefined,
    req.ip
  );

  dbStore.addNotification(
    newAction.assignedToId,
    `Urgent CAPA Assigned: ${indicator.code}`,
    `Action plan ${capaCode} assigned to address escalated indicator ${indicator.name}. Target due date: 30 days.`,
    'ACTION_ASSIGNED',
    '/action-plans'
  );

  res.status(201).json({
    success: true,
    message: `Rapid CAPA ${capaCode} created successfully and assigned to ${newAction.assignedToName}`,
    actionPlan: newAction,
    indicator,
  });
});
