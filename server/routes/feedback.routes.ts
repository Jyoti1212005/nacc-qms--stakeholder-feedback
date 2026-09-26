import { Router, Request, Response } from 'express';
import { dbStore } from '../db.ts';
import { getAuthUser } from '../middleware/auth.ts';
import { FeedbackForm } from '../types.ts';

export const feedbackRouter = Router();

// Survey instruments management
feedbackRouter.get('/feedback/forms', (req: Request, res: Response) => {
  const { targetType, status, academicYearId } = req.query;
  let forms = dbStore.feedbackForms;

  if (targetType) {
    forms = forms.filter((f) => f.targetType === targetType);
  }
  if (status) {
    forms = forms.filter((f) => f.status === status);
  }
  if (academicYearId) {
    forms = forms.filter((f) => f.academicYearId === academicYearId);
  }

  res.json(forms);
});

feedbackRouter.get('/feedback/forms/:id', (req: Request, res: Response) => {
  const form = dbStore.feedbackForms.find((f) => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: 'Feedback form not found' });
  res.json(form);
});

feedbackRouter.post('/feedback/forms', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const data = req.body;

  const newForm: FeedbackForm = {
    id: `form-${Date.now()}`,
    code: data.code || `FB-${Date.now().toString().slice(-4)}`,
    title: data.title,
    description: data.description || '',
    targetType: data.targetType || 'STUDENT',
    academicYearId: data.academicYearId || 'ay-5',
    departmentId: data.departmentId || undefined,
    status: data.status || 'DRAFT',
    allowAnonymous: data.allowAnonymous !== false,
    startDate: data.startDate || new Date().toISOString().slice(0, 10),
    endDate: data.endDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    instructions: data.instructions || 'Please answer all questions objectively.',
    version: 1,
    responseCount: 0,
    averageScore: 0,
    sections: data.sections || [
      {
        id: `sec-${Date.now()}-1`,
        formId: `form-${Date.now()}`,
        title: 'Academic Quality & Experience',
        category: 'Curricular Aspects',
        orderIndex: 1,
        questions: [
          {
            id: `q-${Date.now()}-1`,
            sectionId: `sec-${Date.now()}-1`,
            prompt: 'Rate the relevance of the academic curriculum to contemporary industry trends.',
            questionType: 'LIKERT_SCALE',
            parameter: 'Curriculum Relevance',
            category: 'Curricular Aspects',
            isRequired: true,
            orderIndex: 1,
            scaleMax: 5,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.feedbackForms.unshift(newForm);
  dbStore.logAudit('CREATE', 'FEEDBACK', `Created feedback form: ${newForm.title} (${newForm.code})`, user, undefined, req.ip);
  res.status(201).json(newForm);
});

feedbackRouter.put('/feedback/forms/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const index = dbStore.feedbackForms.findIndex((f) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Form not found' });

  const updated = {
    ...dbStore.feedbackForms[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  dbStore.feedbackForms[index] = updated;
  dbStore.logAudit('UPDATE', 'FEEDBACK', `Updated feedback form: ${updated.title}`, user, undefined, req.ip);
  res.json(updated);
});

feedbackRouter.post('/feedback/forms/:id/publish', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const form = dbStore.feedbackForms.find((f) => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: 'Form not found' });

  form.status = 'PUBLISHED';
  form.updatedAt = new Date().toISOString();

  dbStore.addNotification('all', 'New Survey Published', `Survey "${form.title}" is now open for your feedback.`, 'SURVEY_PUBLISHED', `/feedback`);
  dbStore.logAudit('PUBLISH', 'FEEDBACK', `Published feedback form: ${form.title}`, user, undefined, req.ip);

  res.json({ success: true, form });
});

feedbackRouter.post('/feedback/forms/:id/duplicate', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const source = dbStore.feedbackForms.find((f) => f.id === req.params.id);
  if (!source) return res.status(404).json({ error: 'Form not found' });

  const duplicated: FeedbackForm = {
    ...JSON.parse(JSON.stringify(source)),
    id: `form-${Date.now()}`,
    code: `${source.code}-COPY`,
    title: `${source.title} (Copy)`,
    status: 'DRAFT',
    responseCount: 0,
    averageScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbStore.feedbackForms.unshift(duplicated);
  dbStore.logAudit('DUPLICATE', 'FEEDBACK', `Duplicated form: ${source.title}`, user, undefined, req.ip);
  res.status(201).json(duplicated);
});

feedbackRouter.post('/feedback/forms/:id/archive', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const form = dbStore.feedbackForms.find((f) => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: 'Form not found' });

  form.status = 'ARCHIVED';
  form.updatedAt = new Date().toISOString();
  dbStore.logAudit('ARCHIVE', 'FEEDBACK', `Archived feedback form: ${form.title}`, user, undefined, req.ip);
  res.json({ success: true, form });
});

feedbackRouter.delete('/feedback/forms/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const index = dbStore.feedbackForms.findIndex((f) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Form not found' });

  const deleted = dbStore.feedbackForms.splice(index, 1)[0];
  dbStore.logAudit('DELETE', 'FEEDBACK', `Deleted feedback form: ${deleted.title}`, user, undefined, req.ip);
  res.json({ success: true });
});

// Dynamic form builder endpoints
feedbackRouter.get('/feedback/dynamic-builder/categories', (_req: Request, res: Response) => {
  res.json(dbStore.feedbackCategories);
});

feedbackRouter.get('/feedback/dynamic-builder/role-mappings', (req: Request, res: Response) => {
  const { role } = req.query;
  const mappings = dbStore.getRoleCategoryMappings(role as string);
  res.json(mappings);
});

feedbackRouter.post('/feedback/dynamic-builder/role-mappings', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { role, categoryId, isPrimary, priorityOrder, focusDescription, rationale } = req.body;
  if (!role || !categoryId) {
    return res.status(400).json({ error: 'Role and categoryId are required.' });
  }

  const newMapping: any = {
    id: `rcm-${Date.now()}`,
    role,
    categoryId,
    isPrimary: !!isPrimary,
    priorityOrder: Number(priorityOrder) || 1,
    focusDescription: focusDescription || 'Quality assessment category',
    rationale: rationale || 'Accreditation framework requirement',
  };

  dbStore.roleCategoryMappings.push(newMapping);
  dbStore.logAudit('CREATE', 'SETTINGS', `Added role-to-category mapping: ${role} -> ${categoryId}`, user, undefined, req.ip);
  res.status(201).json(newMapping);
});

feedbackRouter.get('/feedback/dynamic-builder/templates', (req: Request, res: Response) => {
  const { role, categoryId } = req.query;
  const templates = dbStore.getQuestionTemplates(role as string, categoryId as string);
  res.json(templates);
});

feedbackRouter.post('/feedback/dynamic-builder/templates', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { categoryId, applicableRoles, prompt, parameter, questionType, scaleMax, options, isRequired, naacMetricRef, tags } = req.body;
  if (!categoryId || !prompt || !parameter) {
    return res.status(400).json({ error: 'categoryId, prompt, and parameter are required.' });
  }

  const newTemplate: any = {
    id: `qt-${Date.now()}`,
    categoryId,
    applicableRoles: Array.isArray(applicableRoles) ? applicableRoles : ['FACULTY', 'STUDENT'],
    prompt,
    parameter,
    questionType: questionType || 'LIKERT_SCALE',
    scaleMax: scaleMax || 5,
    options,
    isRequired: isRequired !== false,
    naacMetricRef: naacMetricRef || 'NAAC Criterion',
    tags: Array.isArray(tags) ? tags : ['custom-template'],
  };

  dbStore.questionTemplates.push(newTemplate);
  dbStore.logAudit('CREATE', 'FEEDBACK', `Created question template for ${categoryId}: ${prompt.slice(0, 40)}...`, user, undefined, req.ip);
  res.status(201).json(newTemplate);
});

feedbackRouter.post('/feedback/dynamic-builder/generate', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { targetRole, selectedCategoryIds, academicYearId, departmentId, title, code, description, allowAnonymous, autoPublish } = req.body;

  if (!targetRole) {
    return res.status(400).json({ error: 'targetRole is required for dynamic survey generation.' });
  }

  const result = dbStore.generateDynamicSurveyByRole(
    {
      targetRole,
      selectedCategoryIds,
      academicYearId,
      departmentId,
      title,
      code,
      description,
      allowAnonymous,
      autoPublish,
    },
    user
  );

  res.status(201).json({
    success: true,
    form: result.form,
    mappedCategories: result.mappedCategories,
    questionCount: result.questionCount,
    role: targetRole,
  });
});

// Feedback submissions and analytics
feedbackRouter.post('/feedback/responses', (req: Request, res: Response) => {
  const { formId, academicYearId, departmentId, programmeId, stakeholderId, isAnonymous, stakeholderType, answers } = req.body;
  if (!formId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid response payload. Missing formId or answers.' });
  }

  const response = dbStore.submitFeedbackResponse({
    formId,
    academicYearId: academicYearId || 'ay-5',
    departmentId,
    programmeId,
    stakeholderId,
    isAnonymous: !!isAnonymous,
    stakeholderType: stakeholderType || 'STUDENT',
    answers,
  });

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully. Thank you for contributing to institutional quality enhancement.',
    responseId: response.id,
    overallScore: response.overallScore,
  });
});

feedbackRouter.get('/feedback/analytics', (req: Request, res: Response) => {
  const formId = req.query.formId as string;
  let responses = dbStore.feedbackResponses;
  if (formId) {
    responses = responses.filter((r) => r.formId === formId);
  }

  const textFeedback: { text: string; parameter: string; sentiment: string; date: string }[] = [];
  responses.forEach((r) => {
    r.answers.forEach((a) => {
      if (a.textValue && a.textValue.trim().length > 3) {
        textFeedback.push({
          text: a.textValue.trim(),
          parameter: 'Stakeholder Reflection',
          sentiment: (r.overallScore >= 4 ? 'Positive' : r.overallScore >= 3 ? 'Neutral' : 'Negative'),
          date: r.submittedAt.slice(0, 10),
        });
      }
    });
  });

  res.json({
    totalResponses: responses.length,
    averageScore: responses.length > 0 ? Math.round((responses.reduce((a, b) => a + b.overallScore, 0) / responses.length) * 100) / 100 : 4.0,
    textFeedback: textFeedback.slice(0, 20),
  });
});

// GET /api/feedback/responses - Paginated and filtered responses list
feedbackRouter.get('/feedback/responses', (req: Request, res: Response) => {
  const {
    formId,
    stakeholderType,
    academicYearId,
    departmentId,
    isAnonymous,
    minScore,
    maxScore,
    search,
    limit,
    offset,
  } = req.query;

  const result = dbStore.getEnrichedResponses({
    formId: formId as string,
    stakeholderType: stakeholderType as string,
    academicYearId: academicYearId as string,
    departmentId: departmentId as string,
    isAnonymous: isAnonymous !== undefined ? isAnonymous === 'true' : undefined,
    minScore: minScore ? parseFloat(minScore as string) : undefined,
    maxScore: maxScore ? parseFloat(maxScore as string) : undefined,
    search: search as string,
    limit: limit ? parseInt(limit as string, 10) : 50,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });

  res.json(result);
});

// GET /api/feedback/forms/:id/results - Comprehensive analytics and question breakdown for a specific form
feedbackRouter.get('/feedback/forms/:id/results', (req: Request, res: Response) => {
  const { id } = req.params;
  const { academicYearId, departmentId } = req.query;

  const results = dbStore.getFormResults(id, academicYearId as string, departmentId as string);
  if (!results) {
    return res.status(404).json({ error: 'Feedback form not found' });
  }

  res.json(results);
});

// GET /api/admin/forms/summary & /api/feedback/forms-summary - Institutional overview matrix for all forms
feedbackRouter.get('/admin/forms/summary', (req: Request, res: Response) => {
  const { academicYearId, departmentId } = req.query;
  const summary = dbStore.getAllFormsSummary(academicYearId as string, departmentId as string);
  res.json(summary);
});

feedbackRouter.get('/feedback/forms-summary', (req: Request, res: Response) => {
  const { academicYearId, departmentId } = req.query;
  const summary = dbStore.getAllFormsSummary(academicYearId as string, departmentId as string);
  res.json(summary);
});

