// Re-export Supabase configuration for backward compatibility
export { connectSupabase, isSupabaseConnected, getSupabase } from './supabase.ts';
export const connectMongoDB = async () => false;
export const isMongoConnected = () => false;
