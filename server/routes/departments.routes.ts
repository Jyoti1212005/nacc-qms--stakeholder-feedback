import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';

export const departmentsRouter = Router();

departmentsRouter.get('/departments', (_req: Request, res: Response) => {
  res.json(dbStore.departments);
});

departmentsRouter.get('/departments/:id/dashboard', (req: Request, res: Response) => {
  const dept = dbStore.departments.find((d) => d.id === req.params.id);
  if (!dept) return res.status(404).json({ error: 'Department not found' });

  const ayId = (req.query.academicYearId as string) || 'ay-5';
  const deptResponses = dbStore.feedbackResponses.filter(
    (r) => r.departmentId === dept.id && r.academicYearId === ayId
  );
  const deptActions = dbStore.actionPlans.filter((a) => a.departmentId === dept.id);
  const deptGaps = dbStore.qualityGaps.filter((g) => g.departmentId === dept.id);
  const deptEvidence = dbStore.evidenceItems.filter((e) => e.departmentId === dept.id);
  const deptIndicators = dbStore.qualityIndicators.filter(
    (qi) => qi.departmentId === dept.id || !qi.departmentId
  );

  const avgSatisfaction =
    deptResponses.length > 0
      ? Math.round(
          (deptResponses.reduce((a, b) => a + b.overallScore, 0) / deptResponses.length) * 100
        ) / 100
      : 4.0;

  const deptProgrammes = dbStore.programmes.filter((p) => p.departmentId === dept.id);

  res.json({
    department: dept,
    programmes: deptProgrammes,
    stats: {
      responsesCount: deptResponses.length,
      averageSatisfaction: avgSatisfaction,
      openActions: deptActions.filter((a) => a.status !== 'CLOSED').length,
      closedActions: deptActions.filter((a) => a.status === 'CLOSED').length,
      activeGaps: deptGaps.length,
      evidenceCount: deptEvidence.length,
    },
    actionPlans: deptActions,
    gaps: deptGaps,
    indicators: deptIndicators,
    evidence: deptEvidence,
  });
});

departmentsRouter.get('/programmes', (_req: Request, res: Response) => {
  res.json(dbStore.programmes);
});
