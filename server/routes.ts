import { Router } from 'express';
import { authRouter } from './routes/auth.routes.ts';
import { dashboardRouter } from './routes/dashboard.routes.ts';
import { iqacRouter } from './routes/iqac.routes.ts';
import { feedbackRouter } from './routes/feedback.routes.ts';
import { stakeholdersRouter } from './routes/stakeholders.routes.ts';
import { qualityIndicatorsRouter } from './routes/qualityIndicators.routes.ts';
import { gapsRouter } from './routes/gaps.routes.ts';
import { actionPlansRouter } from './routes/actionPlans.routes.ts';
import { evidenceRouter } from './routes/evidence.routes.ts';
import { atrRouter } from './routes/atr.routes.ts';
import { closingTheLoopRouter } from './routes/closingTheLoop.routes.ts';
import { analyticsRouter } from './routes/analytics.routes.ts';
import { reportsRouter } from './routes/reports.routes.ts';
import { departmentsRouter } from './routes/departments.routes.ts';
import { systemRouter } from './routes/system.routes.ts';

export const apiRouter = Router();

// Mount domain routes
apiRouter.use(authRouter);
apiRouter.use(dashboardRouter);
apiRouter.use(iqacRouter);
apiRouter.use(feedbackRouter);
apiRouter.use(stakeholdersRouter);
apiRouter.use(qualityIndicatorsRouter);
apiRouter.use(gapsRouter);
apiRouter.use(actionPlansRouter);
apiRouter.use(evidenceRouter);
apiRouter.use(atrRouter);
apiRouter.use(closingTheLoopRouter);
apiRouter.use(analyticsRouter);
apiRouter.use(reportsRouter);
apiRouter.use(departmentsRouter);
apiRouter.use(systemRouter);

export default apiRouter;
