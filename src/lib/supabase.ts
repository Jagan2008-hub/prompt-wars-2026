import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is missing from .env');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is missing from .env');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const isSupabaseConfigured = true;

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
  experience_level?: string;
  experience_summary?: string;
  days_available: string[];
  hours_per_week: number;
  schedule_preference: string;
  preferred_role?: string;
  preferred_roles?: string[];
  skills: string[];
  interests?: string[];
  learning_goals: string[];
  desired_project_types?: string[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  created_at?: string;
  updated_at?: string;
}