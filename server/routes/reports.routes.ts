import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';
import { getAuthUser } from '../middleware/auth.ts';

export const reportsRouter = Router();

reportsRouter.get('/reports', (_req: Request, res: Response) => {
  res.json(dbStore.reports);
});

reportsRouter.post('/reports/generate', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { reportType, title, academicYearId, departmentId, parameters } = req.body;

  const qualityData = dbStore.calculateQualityIndex(academicYearId || 'ay-5', departmentId);

  const newReport = {
    id: `rep-${Date.now()}`,
    reportType: reportType || 'STAKEHOLDER_FEEDBACK',
    title: title || `Official ${reportType} Report - AY 2026-27`,
    academicYearId: academicYearId || 'ay-5',
    departmentId,
    parameters: parameters || {},
    summaryData: {
      totalResponses: qualityData.totalResponses,
      averageSatisfaction: qualityData.components.averageSatisfactionOutOf5,
      qualityImprovementIndex: qualityData.totalIndex,
      openActions: qualityData.openActions,
      closedActions: qualityData.closedActions,
      generatedTimestamp: new Date().toISOString(),
    },
    generatedBy: user?.fullName || 'Prof. Rajiv Chauhan (Director, IQAC)',
    isApproved: false,
    createdAt: new Date().toISOString(),
  };

  dbStore.reports.unshift(newReport);
  dbStore.logAudit('GENERATE', 'REPORTS', `Generated Report: ${newReport.title}`, user, undefined, req.ip);
  res.status(201).json(newReport);
});

reportsRouter.post('/reports/:id/approve', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const rep = dbStore.reports.find((r) => r.id === req.params.id);
  if (!rep) return res.status(404).json({ error: 'Report not found' });

  rep.isApproved = true;
  rep.approvedBy = user?.fullName || 'Prof. (Dr.) Susheel Mittal (Vice-Chancellor)';
  dbStore.logAudit('APPROVE', 'REPORTS', `Approved Report: ${rep.title}`, user, undefined, req.ip);
  res.json({ success: true, report: rep });
});
