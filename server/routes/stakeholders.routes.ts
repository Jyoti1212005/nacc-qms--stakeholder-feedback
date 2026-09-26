import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';

export const stakeholdersRouter = Router();

stakeholdersRouter.get('/stakeholders', (req: Request, res: Response) => {
  const { type, search, departmentId } = req.query;
  let list = dbStore.stakeholders;

  if (type) {
    list = list.filter((s) => s.type === type);
  }
  if (departmentId) {
    list = list.filter((s) => s.departmentId === departmentId);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.identifier.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }

  res.json({
    total: list.length,
    items: list.slice(0, 100),
  });
});
