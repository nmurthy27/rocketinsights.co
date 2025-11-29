
import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

// Credentials provided by the user
const SUPABASE_URL = 'https://flrtpgtwmedygfpxhlkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZscnRwZ3R3bWVkeWdmcHhobGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDU3NDIsImV4cCI6MjA3OTcyMTc0Mn0.4YzaZ8bNQEISzKLFXfFS2NDGYcnJlLWijJnkjnsD2Wk';

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
  if (error.message) return error.message;
  return JSON.stringify(error);
};

export const subscribeUser = async (profile: UserProfile) => {
  if (!supabase) {
    throw new Error('MISSING_CREDENTIALS');
  }
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .upsert({
        email: profile.email,
        regions: profile.regions,
        topics: profile.topics,
        is_subscribed: profile.isSubscribed,
        consent_date: profile.consentDate,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error subscribing:', formatError(error));
    throw error;
  }
};

export const unsubscribeUser = async (email: string) => {
  if (!supabase) {
    throw new Error('MISSING_CREDENTIALS');
  }
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .update({ is_subscribed: false })
      .eq('email', email)
      .select();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error unsubscribing:', formatError(error));
    throw error;
  }
};

export const fetchSubscribers = async () => {
  if (!supabase) {
    throw new Error('MISSING_CREDENTIALS');
  }
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching subscribers:', formatError(error));
    throw error;
  }
};
