import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
  initialDepartments,
  initialProgrammes,
  initialAcademicYears,
  initialUsers,
  initialQualityCategories,
  initialQualityIndicators,
  initialFeedbackForms,
  initialQualityGaps,
  initialActionPlans,
  initialEvidenceItems,
  initialAIInsights,
  initialNotifications,
  initialAuditLogs,
  generateSeedStakeholders,
  generateSeedResponses,
} from '../seedData.ts';
import {
  initialFeedbackCategories,
  initialRoleCategoryMappings,
  initialQuestionTemplates,
} from '../formBuilderData.ts';
import { initialClosingTheLoopItems } from '../closingTheLoopData.ts';

dotenv.config();

let supabaseClient: SupabaseClient | null = null;
let isConnected = false;

export function getSupabase(): SupabaseClient | null {
  return supabaseClient;
}

export function isSupabaseConnected(): boolean {
  return isConnected && supabaseClient !== null;
}

export async function connectSupabase(): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)?.trim();

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-ref') || supabaseKey.includes('your-anon-key')) {
    console.log('[Supabase] Notice: SUPABASE_URL or SUPABASE_ANON_KEY is not configured or using placeholders in .env.');
    console.log('[Supabase] Running in resilient In-Memory fallback mode with institutional seed data.');
    isConnected = false;
    return false;
  }

  try {
    console.log('[Supabase] Connecting to Supabase Cloud PostgreSQL...');
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Test query to verify connection and schema existence
    const { count, error } = await supabaseClient
      .from('users')
      .select('id', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.users" does not exist')) {
        console.warn('[Supabase] Warning: Tables not found in Supabase database.');
        console.log('[Supabase] Please run the SQL migration script: "supabase_schema.sql" in your Supabase SQL Editor.');
      } else {
        console.warn('[Supabase] Connection test returned error:', error.message);
      }
      console.log('[Supabase] Gracefully falling back to In-Memory store. Application will continue without crashing.');
      isConnected = false;
      return false;
    }

    isConnected = true;
    console.log('[Supabase] Connected successfully to Supabase PostgreSQL database!');

    // Automatically seed initial data if the tables are empty
    await autoSeedIfEmpty(count ?? 0);

    return true;
  } catch (error: any) {
    isConnected = false;
    console.warn('[Supabase] Connection failed or timed out:', error.message);
    console.log('[Supabase] Gracefully falling back to In-Memory store. Application will continue without crashing.');
    return false;
  }
}

async function autoSeedIfEmpty(existingUserCount: number) {
  if (!supabaseClient) return;

  try {
    if (existingUserCount > 0) {
      console.log(`[Supabase] Database already populated (${existingUserCount} users found).`);
      return;
    }

    console.log('[Supabase] Empty database detected. Seeding initial institutional data into Supabase...');

    // Seed core reference tables
    await supabaseClient.from('departments').upsert(initialDepartments);
    await supabaseClient.from('programmes').upsert(initialProgrammes);
    await supabaseClient.from('academic_years').upsert(initialAcademicYears);
    await supabaseClient.from('users').upsert(initialUsers);
    await supabaseClient.from('quality_categories').upsert(initialQualityCategories);
    await supabaseClient.from('quality_indicators').upsert(initialQualityIndicators);
    await supabaseClient.from('feedback_categories').upsert(initialFeedbackCategories);
    await supabaseClient.from('role_category_mappings').upsert(initialRoleCategoryMappings);
    await supabaseClient.from('question_templates').upsert(initialQuestionTemplates);
    await supabaseClient.from('feedback_forms').upsert(initialFeedbackForms);
    await supabaseClient.from('quality_gaps').upsert(initialQualityGaps);
    await supabaseClient.from('action_plans').upsert(initialActionPlans);
    await supabaseClient.from('closing_the_loop').upsert(initialClosingTheLoopItems);
    await supabaseClient.from('evidence_items').upsert(initialEvidenceItems);
    await supabaseClient.from('ai_insights').upsert(initialAIInsights);
    await supabaseClient.from('notifications').upsert(initialNotifications);
    await supabaseClient.from('audit_logs').upsert(initialAuditLogs);

    const seedStakeholders = generateSeedStakeholders();
    const seedResponses = generateSeedResponses(seedStakeholders);

    if (seedStakeholders.length > 0) {
      // Insert in chunks of 100 for optimal Supabase payload size
      for (let i = 0; i < seedStakeholders.length; i += 100) {
        await supabaseClient.from('stakeholders').upsert(seedStakeholders.slice(i, i + 100));
      }
    }

    if (seedResponses.length > 0) {
      for (let i = 0; i < seedResponses.length; i += 100) {
        await supabaseClient.from('feedback_responses').upsert(seedResponses.slice(i, i + 100));
      }
    }

    console.log('[Supabase] Initial institutional seed data populated successfully into Supabase!');
  } catch (err: any) {
    console.error('[Supabase] Auto-seed warning:', err.message);
  }
}
