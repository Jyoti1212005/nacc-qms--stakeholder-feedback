import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';
import { getAuthUser } from '../middleware/auth.ts';

export const authRouter = Router();

authRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = dbStore.users.find(
    (u) => u.email.toLowerCase() === (email || '').toLowerCase().trim()
  );

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({
      error: 'Invalid institutional credentials. Please check your registered email and password.',
    });
  }

  dbStore.logAudit('LOGIN', 'AUTH', `User logged in: ${user.fullName} (${user.role})`, user, undefined, req.ip);

  res.json({
    token: user.id,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      departmentId: user.departmentId,
      programmeId: user.programmeId,
      avatarUrl: user.avatarUrl,
    },
  });
});

authRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized or session expired.' });
  }
  res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      departmentId: user.departmentId,
      programmeId: user.programmeId,
      avatarUrl: user.avatarUrl,
    },
  });
});

authRouter.get('/users/profile/:id?', (req: Request, res: Response) => {
  const paramId = req.params.id || (req.query.userId as string);
  let user = paramId ? dbStore.users.find((u) => u.id === paramId) : getAuthUser(req);
  if (!user) {
    user = dbStore.users[0];
  }

  const dept = user.departmentId ? dbStore.departments.find((d) => d.id === user.departmentId) : null;
  const prog = user.programmeId ? dbStore.programmes.find((p) => p.id === user.programmeId) : null;

  const assignedActions = dbStore.actionPlans.filter(
    (a) => a.assignedToId === user!.id || a.assignedToName === user!.fullName
  ).length;
  const userResponses = dbStore.feedbackResponses.filter((r) => r.stakeholderId === user!.id).length;

  res.json({
    id: user.id,
    fullName: user.fullName,
    role: user.role,
    department: dept ? dept.name : 'Institutional Governance / Central Administration',
    departmentCode: dept ? dept.code : 'INST',
    departmentId: user.departmentId || null,
    joinDate: user.createdAt || '2023-01-01T00:00:00Z',
    email: user.email,
    phone: user.phone || '+91 98450 12345',
    programme: prog ? prog.name : null,
    degreeLevel: prog ? prog.degreeLevel : null,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive !== false,
    stats: {
      assignedActions,
      feedbackSubmissions: userResponses,
      tenureYears: Math.max(1, new Date().getFullYear() - new Date(user.createdAt || '2023-01-01').getFullYear()),
    },
  });
});

authRouter.get('/auth/profile', (req: Request, res: Response) => {
  let user = getAuthUser(req);
  if (!user) {
    user = dbStore.users[0];
  }

  const dept = user.departmentId ? dbStore.departments.find((d) => d.id === user.departmentId) : null;
  const prog = user.programmeId ? dbStore.programmes.find((p) => p.id === user.programmeId) : null;

  const assignedActions = dbStore.actionPlans.filter(
    (a) => a.assignedToId === user!.id || a.assignedToName === user!.fullName
  ).length;
  const userResponses = dbStore.feedbackResponses.filter((r) => r.stakeholderId === user!.id).length;

  res.json({
    id: user.id,
    fullName: user.fullName,
    role: user.role,
    department: dept ? dept.name : 'Institutional Governance / Central Administration',
    departmentCode: dept ? dept.code : 'INST',
    departmentId: user.departmentId || null,
    joinDate: user.createdAt || '2023-01-01T00:00:00Z',
    email: user.email,
    phone: user.phone || '+91 98450 12345',
    programme: prog ? prog.name : null,
    degreeLevel: prog ? prog.degreeLevel : null,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive !== false,
    stats: {
      assignedActions,
      feedbackSubmissions: userResponses,
      tenureYears: Math.max(1, new Date().getFullYear() - new Date(user.createdAt || '2023-01-01').getFullYear()),
    },
  });
});

authRouter.get('/auth/demo-users', (_req: Request, res: Response) => {
  const demoAccounts = dbStore.users.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    password: u.passwordHash,
    role: u.role,
    department: dbStore.departments.find((d) => d.id === u.departmentId)?.name || 'Institutional / General',
  }));
  res.json(demoAccounts);
});
