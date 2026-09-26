import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';

export const dashboardRouter = Router();

dashboardRouter.get('/dashboard/stats', (req: Request, res: Response) => {
  const ayId = (req.query.academicYearId as string) || 'ay-5';
  const deptId = (req.query.departmentId as string) || undefined;

  const qualityData = dbStore.calculateQualityIndex(ayId, deptId);

  const today = new Date().toISOString().slice(0, 10);
  const overdueActions = dbStore.actionPlans.filter(
    (a) => a.dueDate < today && a.status !== 'CLOSED' && a.status !== 'COMPLETED'
  ).length;

  res.json({
    totalStakeholders: dbStore.stakeholders.length,
    totalResponses: qualityData.totalResponses,
    responseRatePercent: qualityData.components.responseRatePercent,
    activeSurveys: qualityData.activeSurveys,
    averageSatisfaction: qualityData.components.averageSatisfactionOutOf5,
    criticalGapsCount: qualityData.criticalGapsCount,
    openActionItems: qualityData.openActions,
    completedActionItems: qualityData.closedActions,
    overdueActions,
    pendingEvidenceCount: qualityData.pendingEvidence,
    qualityImprovementIndex: qualityData.totalIndex,
    qualityStatusLabel: qualityData.statusLabel,
    indexComponents: qualityData.components,
    weights: qualityData.weights,
  });
});

dashboardRouter.get('/dashboard/charts', (req: Request, res: Response) => {
  const ayId = (req.query.academicYearId as string) || 'ay-5';
  const deptId = (req.query.departmentId as string) || undefined;
  const stakeholderType = (req.query.stakeholderType as string) || undefined;

  const charts = dbStore.getDashboardAnalytics({ academicYearId: ayId, departmentId: deptId, stakeholderType });
  res.json(charts);
});
