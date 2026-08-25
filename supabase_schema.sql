-- =========================================================
-- ProjectMatch Supabase Database Schema & Migration
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT NOT NULL,
  college TEXT,
  course TEXT,
  year_of_study TEXT,
  bio TEXT,
  avatar_url TEXT,
  experience_level TEXT DEFAULT 'Intermediate',
  experience_summary TEXT,
  skills TEXT[] DEFAULT '{}',
  preferred_roles TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  days_available TEXT[] DEFAULT '{}',
  hours_per_week INTEGER DEFAULT 15,
  schedule_preference TEXT DEFAULT 'Flexible',
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  learning_goals TEXT[] DEFAULT '{}',
  desired_project_types TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  project_type TEXT DEFAULT 'Hackathon',
  members_needed INTEGER DEFAULT 4,
  deadline DATE,
  commitment_hours INTEGER DEFAULT 15,
  availability_requirement TEXT,
  experience_preference TEXT DEFAULT 'Intermediate',
  required_skills TEXT[] DEFAULT '{}',
  required_roles TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Project Members
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- 4. Invitations and Requests
CREATE TABLE IF NOT EXISTS public.invitations_and_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('join_request', 'project_invite')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  role_offered_or_requested TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Workspace Tasks
CREATE TABLE IF NOT EXISTS public.workspace_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations_and_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_tasks ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Project members viewable by everyone" ON public.project_members FOR SELECT USING (true);
CREATE POLICY "Workspace tasks viewable by everyone" ON public.workspace_tasks FOR SELECT USING (true);

-- User Update Policies
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update their projects" ON public.projects FOR UPDATE USING (auth.uid() = creator_id);
