import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  UserModel,
  DepartmentModel,
  ProgrammeModel,
  AcademicYearModel,
  StakeholderModel,
  FeedbackFormModel,
  FeedbackResponseModel,
  QualityCategoryModel,
  QualityIndicatorModel,
  QualityGapModel,
  ActionPlanModel,
  EvidenceModel,
  AIInsightModel,
  NotificationModel,
  AuditLogModel,
  FeedbackCategoryModel,
  RoleCategoryMappingModel,
  QuestionTemplateModel,
  ClosingTheLoopModel,
} from '../models/index.ts';
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

let isConnected = false;

export function isMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function connectMongoDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('[MongoDB] Notice: MONGODB_URI is not set in .env. Running in In-Memory fallback mode.');
    return false;
  }

  try {
    console.log('[MongoDB] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    isConnected = true;
    console.log('[MongoDB] Connected successfully to MongoDB Database!');

    // Check if initial seeding is needed
    await autoSeedIfEmpty();

    return true;
  } catch (error: any) {
    isConnected = false;
    console.warn('[MongoDB] Connection failed or timed out:', error.message);
    console.log('[MongoDB] Gracefully falling back to In-Memory store. Application will continue without crashing.');
    return false;
  }
}

async function autoSeedIfEmpty() {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount > 0) {
      console.log(`[MongoDB] Database already populated (${userCount} users found). Skipping initial seed.`);
      return;
    }

    console.log('[MongoDB] Empty database detected. Seeding initial institutional data into MongoDB...');

    await Promise.all([
      DepartmentModel.insertMany(initialDepartments),
      ProgrammeModel.insertMany(initialProgrammes),
      AcademicYearModel.insertMany(initialAcademicYears),
      UserModel.insertMany(initialUsers),
      QualityCategoryModel.insertMany(initialQualityCategories),
      QualityIndicatorModel.insertMany(initialQualityIndicators),
      FeedbackFormModel.insertMany(initialFeedbackForms),
      QualityGapModel.insertMany(initialQualityGaps),
      ActionPlanModel.insertMany(initialActionPlans),
      EvidenceModel.insertMany(initialEvidenceItems),
      AIInsightModel.insertMany(initialAIInsights),
      NotificationModel.insertMany(initialNotifications),
      AuditLogModel.insertMany(initialAuditLogs),
      FeedbackCategoryModel.insertMany(initialFeedbackCategories),
      RoleCategoryMappingModel.insertMany(initialRoleCategoryMappings),
      QuestionTemplateModel.insertMany(initialQuestionTemplates),
      ClosingTheLoopModel.insertMany(initialClosingTheLoopItems),
    ]);

    const seedStakeholders = generateSeedStakeholders();
    const seedResponses = generateSeedResponses(seedStakeholders);

    if (seedStakeholders.length > 0) {
      await StakeholderModel.insertMany(seedStakeholders);
    }
    if (seedResponses.length > 0) {
      await FeedbackResponseModel.insertMany(seedResponses);
    }

    console.log('[MongoDB] Initial seeding completed successfully!');
  } catch (err: any) {
    console.error('[MongoDB] Auto-seed warning:', err.message);
  }
}
