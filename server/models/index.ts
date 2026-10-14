import { getSupabase } from '../config/supabase.ts';
import {
  Department,
  Programme,
  AcademicYear,
  User,
  Stakeholder,
  FeedbackForm,
  FeedbackResponse,
  QualityCategory,
  QualityIndicator,
  QualityGap,
  ActionPlan,
  EvidenceItem,
  AIInsightItem,
  NotificationItem,
  AuditLogItem,
  ReportItem,
  FeedbackCategory,
  RoleCategoryMapping,
  QuestionTemplate,
  ClosingTheLoopItem,
  PulseSurveySubmission,
} from '../types.ts';

export interface ISupabaseModel<T = any> {
  tableName: string;
  find(): { lean(): Promise<T[]> };
  findOne(filter: Record<string, any>): Promise<T | null>;
  create(doc: T): Promise<T>;
  findOneAndUpdate(filter: Record<string, any>, update: any, options?: any): Promise<T | null>;
  deleteOne(filter: Record<string, any>): Promise<any>;
  deleteMany(filter?: Record<string, any>): Promise<any>;
  insertMany(docs: T[]): Promise<T[]>;
  countDocuments(): Promise<number>;
}

export function createSupabaseModel<T = any>(tableName: string): ISupabaseModel<T> {
  return {
    tableName,
    find() {
      return {
        async lean(): Promise<T[]> {
          const sb = getSupabase();
          if (!sb) return [];
          const { data, error } = await sb.from(tableName).select('*');
          if (error) {
            console.warn(`[Supabase] Error reading from "${tableName}":`, error.message);
            return [];
          }
          return (data as T[]) || [];
        },
      };
    },
    async findOne(filter: Record<string, any>): Promise<T | null> {
      const sb = getSupabase();
      if (!sb) return null;
      let q = sb.from(tableName).select('*');
      for (const [key, value] of Object.entries(filter)) {
        q = q.eq(key, value);
      }
      const { data, error } = await q.maybeSingle();
      if (error) {
        console.warn(`[Supabase] Error findOne on "${tableName}":`, error.message);
        return null;
      }
      return data as T | null;
    },
    async create(doc: T): Promise<T> {
      const sb = getSupabase();
      if (!sb) return doc;
      const { data, error } = await sb.from(tableName).upsert(doc as any).select().maybeSingle();
      if (error) {
        console.error(`[Supabase] Error creating/upserting into "${tableName}":`, error.message);
      }
      return (data as T) || doc;
    },
    async findOneAndUpdate(filter: Record<string, any>, update: any, _options?: any): Promise<T | null> {
      const sb = getSupabase();
      if (!sb) return null;
      const doc = update?.$set ? update.$set : update;
      const { data, error } = await sb.from(tableName).upsert(doc).select().maybeSingle();
      if (error) {
        console.error(`[Supabase] Error findOneAndUpdate in "${tableName}":`, error.message);
      }
      return (data as T) || doc;
    },
    async deleteOne(filter: Record<string, any>): Promise<any> {
      const sb = getSupabase();
      if (!sb) return null;
      let q = sb.from(tableName).delete();
      for (const [key, value] of Object.entries(filter)) {
        q = q.eq(key, value);
      }
      const { error } = await q;
      if (error) {
        console.error(`[Supabase] Error deleteOne in "${tableName}":`, error.message);
      }
      return { deleted: !error };
    },
    async deleteMany(filter?: Record<string, any>): Promise<any> {
      const sb = getSupabase();
      if (!sb) return null;
      let q = sb.from(tableName).delete();
      if (filter && Object.keys(filter).length > 0) {
        for (const [key, value] of Object.entries(filter)) {
          q = q.eq(key, value);
        }
      } else {
        q = q.neq('id', '___non_existent___');
      }
      const { error } = await q;
      if (error) {
        console.error(`[Supabase] Error deleteMany in "${tableName}":`, error.message);
      }
      return { deleted: !error };
    },
    async insertMany(docs: T[]): Promise<T[]> {
      const sb = getSupabase();
      if (!sb || !docs.length) return docs;
      for (let i = 0; i < docs.length; i += 100) {
        const chunk = docs.slice(i, i + 100);
        const { error } = await sb.from(tableName).upsert(chunk as any);
        if (error) {
          console.error(`[Supabase] Error insertMany in "${tableName}":`, error.message);
        }
      }
      return docs;
    },
    async countDocuments(): Promise<number> {
      const sb = getSupabase();
      if (!sb) return 0;
      const { count, error } = await sb.from(tableName).select('*', { count: 'exact', head: true });
      if (error) return 0;
      return count || 0;
    },
  };
}

// Supabase Model Repository Exports
export const UserModel = createSupabaseModel<User>('users');
export const DepartmentModel = createSupabaseModel<Department>('departments');
export const ProgrammeModel = createSupabaseModel<Programme>('programmes');
export const AcademicYearModel = createSupabaseModel<AcademicYear>('academic_years');
export const StakeholderModel = createSupabaseModel<Stakeholder>('stakeholders');
export const FeedbackFormModel = createSupabaseModel<FeedbackForm>('feedback_forms');
export const FeedbackResponseModel = createSupabaseModel<FeedbackResponse>('feedback_responses');
export const QualityCategoryModel = createSupabaseModel<QualityCategory>('quality_categories');
export const QualityIndicatorModel = createSupabaseModel<QualityIndicator>('quality_indicators');
export const QualityGapModel = createSupabaseModel<QualityGap>('quality_gaps');
export const ActionPlanModel = createSupabaseModel<ActionPlan>('action_plans');
export const ClosingTheLoopModel = createSupabaseModel<ClosingTheLoopItem>('closing_the_loop');
export const EvidenceModel = createSupabaseModel<EvidenceItem>('evidence_items');
export const AIInsightModel = createSupabaseModel<AIInsightItem>('ai_insights');
export const PulseSurveyModel = createSupabaseModel<PulseSurveySubmission>('pulse_surveys');
export const ReportModel = createSupabaseModel<ReportItem>('reports');
export const NotificationModel = createSupabaseModel<NotificationItem>('notifications');
export const AuditLogModel = createSupabaseModel<AuditLogItem>('audit_logs');
export const FeedbackCategoryModel = createSupabaseModel<FeedbackCategory>('feedback_categories');
export const RoleCategoryMappingModel = createSupabaseModel<RoleCategoryMapping>('role_category_mappings');
export const QuestionTemplateModel = createSupabaseModel<QuestionTemplate>('question_templates');
