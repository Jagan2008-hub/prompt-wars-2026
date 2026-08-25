import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url' &&
  !supabaseUrl.includes('placeholder')
);

// Create a safe client instance with fallback
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://mock-supabase.example.com', 'mock-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  college: string;
  course: string;
  year_of_study: string;
  bio: string;
  avatar_url?: string;
  experience?: string;
  days_available: string[];
  hours_per_week: number;
  schedule_preference: string;
  preferred_role: string;
  skills: string[];
  learning_goals: string[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  created_at?: string;
}
