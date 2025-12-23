// This service has been deprecated as Supabase integration was removed.
// All functions now return empty/default values to prevent errors in existing imports.

import { UserProfile } from '../types';

export const isSupabaseConfigured = () => false;

export const supabase = null;

export const checkSupabaseHealth = async () => {
    return { ok: false, message: "Supabase integration removed" };
};

export const saveSubscriberToSupabase = async (profile: UserProfile) => {
  console.warn('Supabase removed: Subscriber not saved to DB');
  return { success: false, error: 'Integration removed' };
};

export const logBusinessSearchToSupabase = async (query: string) => {
  // no-op
};

export const logPulseSearchToSupabase = async (
  clientQuery: string, 
  countryQuery: string, 
  mediaQuery: string
) => {
  // no-op
};

export const logLeadershipSearchToSupabase = async (
  role: string, 
  company: string, 
  country: string
) => {
  // no-op
};

export const fetchFromSupabase = async (tableName: string, limitCount: number = 50) => {
  return [];
};

export const fetchSubscribers = async () => {
  return [];
};
