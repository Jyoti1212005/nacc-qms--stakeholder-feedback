import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';
import { getAuthUser } from '../middleware/auth.ts';

export const iqacRouter = Router();

iqacRouter.get('/iqac/overview', (req: Request, res: Response) => {
  const ayId = (req.query.academicYearId as string) || 'ay-5';
  const index = dbStore.calculateQualityIndex(ayId);

  const criteriaSummary = dbStore.qualityCategories.map((cat) => {
    const indicators = dbStore.qualityIndicators.filter((qi) => qi.categoryId === cat.id);
    const avgScore = indicators.length > 0
      ? indicators.reduce((acc, qi) => acc + (qi.actualScore / qi.targetScore) * 100, 0) / indicators.length
      : 82;
    return {
      categoryId: cat.id,
      code: cat.code,
      name: cat.name,
      weight: cat.weight,
      achievementPercent: Math.min(100, Math.round(avgScore * 10) / 10),
      indicatorsCount: indicators.length,
    };
  });

  res.json({
    index,
    criteriaSummary,
    academicYears: dbStore.academicYears,
    cycleStages: [
      { name: '1. Feedback Collection', status: 'ACTIVE', progress: 85, detail: 'Surveys live across 5 stakeholder tiers' },
      { name: '2. Data Validation & Gap Detection', status: 'ACTIVE', progress: 92, detail: '5 critical gaps flagged' },
      { name: '3. CAPA Formulation', status: 'ACTIVE', progress: 78, detail: '3 CAPA plans assigned to HoDs' },
      { name: '4. Evidence Verification', status: 'IN_PROGRESS', progress: 65, detail: '5 pieces of evidence archived' },
      { name: '5. Remeasurement & Improvement', status: 'IN_PROGRESS', progress: 70, detail: '+1.37 demonstrated delta' },
      { name: '6. NAAC-Ready Reporting', status: 'READY', progress: 90, detail: 'ATR and IQAC Annual reports generated' },
    ],
  });
});

iqacRouter.post('/iqac/weights', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (user && user.role !== 'SUPER_ADMIN' && user.role !== 'IQAC_ADMIN') {
    return res.status(403).json({ error: 'Only IQAC Administrators can adjust Quality Index weights.' });
  }

  const { stakeholderSatisfaction, responseRate, actionClosureRate, improvementDelta, evidenceCompleteness } = req.body;
  dbStore.qualityWeights = {
    stakeholderSatisfaction: Number(stakeholderSatisfaction) || 0.3,
    responseRate: Number(responseRate) || 0.15,
    actionClosureRate: Number(actionClosureRate) || 0.25,
    improvementDelta: Number(improvementDelta) || 0.15,
    evidenceCompleteness: Number(evidenceCompleteness) || 0.15,
  };

  dbStore.logAudit('UPDATE', 'SETTINGS', 'Updated Institutional Quality Improvement Index weights', user, dbStore.qualityWeights, req.ip);
  res.json({ success: true, weights: dbStore.qualityWeights });
});
