
import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

// Credentials provided by the user
const SUPABASE_URL = 'https://timeqjewqmrvubbtdghv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpbWVxamV3cW1ydnViYnRkZ2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTc3MTYsImV4cCI6MjA3OTg5MzcxNn0.ni2PFsGfKyaiuVds-0drvfsm6bMmpeXRZBR8snMcy20';

export const isSupabaseConfigured = () => {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY && 
         SUPABASE_URL.startsWith('http') && 
         SUPABASE_ANON_KEY.length > 20;
};

export const supabase = isSupabaseConfigured() 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

const formatError = (error: any) => {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error.message) return error.message;
  try {
    return JSON.stringify(error);
  } catch (e) {
    return 'Unserializable error object';
  }
};

export const checkSupabaseHealth = async () => {
    if (!supabase) return { ok: false, message: "Client not initialized" };
    try {
        const { data, error } = await supabase.from('subscribers').select('count', { count: 'exact', head: true });
        if (error) throw error;
        return { ok: true, count: data };
    } catch (e: any) {
        return { ok: false, message: e.message || formatError(e) };
    }
};

// 1. Subscribe User / Login
export const saveSubscriberToSupabase = async (profile: UserProfile) => {
  if (!supabase) return { success: false, error: 'MISSING_CREDENTIALS' };
  
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .upsert({
        email: profile.email,
        role: profile.role,
        regions: profile.regions || [],
        topics: profile.topics || [],
        is_subscribed: profile.isSubscribed,
        consent_date: profile.consentDate,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    console.log(`[Supabase] User saved: ${profile.email}`);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error saving subscriber:', formatError(error));
    throw error;
  }
};

// 2. Log Business Intelligence Search (Anonymous)
export const logBusinessSearchToSupabase = async (query: string) => {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('business_search_logs')
      .insert({
        query: query,
        // user_email removed
      });

    if (error) throw error;
    console.log(`[Supabase] Business search logged: "${query}"`);
  } catch (error: any) {
    console.error('Error logging business search:', formatError(error));
  }
};

// 3. Log Weekly Pulse Scanner (Anonymous)
export const logPulseSearchToSupabase = async (
  clientQuery: string, 
  countryQuery: string, 
  mediaQuery: string
) => {
  if (!supabase) return;
  // Don't log empty default states
  if (!clientQuery && !countryQuery && mediaQuery === 'All Media') return;

  try {
    const { error } = await supabase
      .from('pulse_scanner_logs')
      .insert({
        client_query: clientQuery,
        country_query: countryQuery,
        media_type: mediaQuery,
        // user_email removed
      });

    if (error) throw error;
    console.log(`[Supabase] Pulse search logged: "${clientQuery}"`);
  } catch (error: any) {
    console.error('Error logging pulse search:', formatError(error));
  }
};

// 4. Log Leadership Scanner (Anonymous)
export const logLeadershipSearchToSupabase = async (
  role: string, 
  company: string, 
  country: string
) => {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('leadership_logs')
      .insert({
        role: role,
        company: company,
        country: country,
        // user_email removed
      });

    if (error) throw error;
    console.log(`[Supabase] Leadership search logged: "${company}"`);
  } catch (error: any) {
    console.error('Error logging leadership search:', formatError(error));
  }
};

// 5. Fetch Data for Admin Panel
export const fetchFromSupabase = async (tableName: string, limitCount: number = 50) => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error(`Error fetching ${tableName}:`, formatError(error));
    return [];
  }
};

// 6. Fetch Subscribers (for SubscribersListModal)
export const fetchSubscribers = async () => {
  if (!supabase) throw new Error('MISSING_CREDENTIALS');
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching subscribers:', formatError(error));
    throw error;
  }
};
