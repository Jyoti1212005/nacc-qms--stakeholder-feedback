import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';
import { getAuthUser } from '../middleware/auth.ts';
import { EvidenceItem } from '../types.ts';

export const evidenceRouter = Router();

evidenceRouter.get('/evidence', (req: Request, res: Response) => {
  const { category, departmentId, verificationStatus, search } = req.query;
  let items = dbStore.evidenceItems;

  if (category) {
    items = items.filter((e) => e.category === category);
  }
  if (departmentId) {
    items = items.filter((e) => e.departmentId === departmentId);
  }
  if (verificationStatus) {
    items = items.filter((e) => e.verificationStatus === verificationStatus);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    items = items.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json(items);
});

evidenceRouter.post('/evidence', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const data = req.body;

  const code = `EVI-2026-${(dbStore.evidenceItems.length + 1).toString().padStart(2, '0')}`;
  const newEvidence: EvidenceItem = {
    id: `evi-${Date.now()}`,
    code,
    title: data.title,
    description: data.description || '',
    fileUrl: data.fileUrl || `/mock-documents/${code.toLowerCase()}.pdf`,
    fileType: data.fileType || 'PDF',
    fileSize: data.fileSize || 1850000,
    category: data.category || 'Institutional Quality',
    departmentId: data.departmentId,
    academicYearId: data.academicYearId || 'ay-5',
    actionPlanId: data.actionPlanId,
    qualityIndicatorId: data.qualityIndicatorId,
    uploadedById: user?.id || 'user-iqac',
    uploadedByName: user?.fullName || 'Quality Team Member',
    verificationStatus: 'PENDING',
    version: 1,
    tags: Array.isArray(data.tags) ? data.tags : ['Evidence', 'NAAC-Criterion'],
    createdAt: new Date().toISOString(),
  };

  dbStore.evidenceItems.unshift(newEvidence);

  if (data.actionPlanId) {
    const action = dbStore.actionPlans.find((a) => a.id === data.actionPlanId);
    if (action && !action.evidenceIds.includes(newEvidence.id)) {
      action.evidenceIds.push(newEvidence.id);
    }
  }

  dbStore.addNotification('user-iqac', 'New Evidence Uploaded', `Evidence document "${newEvidence.title}" uploaded, awaiting verification.`, 'EVIDENCE_UPLOADED', '/evidence');
  dbStore.logAudit('UPLOAD', 'EVIDENCE', `Uploaded evidence: ${newEvidence.title} (${newEvidence.code})`, user, undefined, req.ip);

  res.status(201).json(newEvidence);
});

evidenceRouter.post('/evidence/:id/verify', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const evi = dbStore.evidenceItems.find((e) => e.id === req.params.id);
  if (!evi) return res.status(404).json({ error: 'Evidence item not found' });

  const { status, notes } = req.body;
  evi.verificationStatus = status || 'VERIFIED';
  evi.verificationNotes = notes || 'Verified for compliance against institutional standards.';
  evi.verifiedById = user?.id || 'user-iqac';
  evi.verifiedByName = user?.fullName || 'Prof. Rajiv Chauhan';

  dbStore.logAudit('VERIFY', 'EVIDENCE', `Updated evidence verification: ${evi.title} -> ${evi.verificationStatus}`, user, undefined, req.ip);
  res.json({ success: true, evidence: evi });
});

evidenceRouter.delete('/evidence/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const index = dbStore.evidenceItems.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Evidence item not found' });

  const deleted = dbStore.evidenceItems.splice(index, 1)[0];
  dbStore.logAudit('DELETE', 'EVIDENCE', `Deleted evidence: ${deleted.title}`, user, undefined, req.ip);
  res.json({ success: true });
});
