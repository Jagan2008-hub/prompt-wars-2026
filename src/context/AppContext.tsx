import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Project, WorkspaceTask, InvitationOrRequest, NotificationItem, RoleType, ProjectCategory, ExperienceLevel } from '../types';
import { INITIAL_PROFILES, INITIAL_PROJECTS, INITIAL_TASKS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  profiles: UserProfile[];
  projects: Project[];
  tasks: WorkspaceTask[];
  invitations: InvitationOrRequest[];
  notifications: NotificationItem[];
  isDemoMode: boolean;
  profileCompletionPercentage: number;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  createProject: (newProject: Omit<Project, 'id' | 'creator_id' | 'members' | 'created_at'>) => Project;
  applyToProject: (projectId: string, message: string, role: RoleType) => void;
  inviteUserToProject: (projectId: string, userId: string, role: RoleType, message: string) => void;
  respondToInvitation: (invitationId: string, accept: boolean) => void;
  addTask: (task: Omit<WorkspaceTask, 'id' | 'created_at'>) => void;
  updateTaskStatus: (taskId: string, status: 'todo' | 'in_progress' | 'done') => void;
  markNotificationRead: (id: string) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  toasts: { id: string; message: string; type: 'success' | 'info' | 'warning' }[];
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('pm_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('pm_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => {
    const saved = localStorage.getItem('pm_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [invitations, setInvitations] = useState<InvitationOrRequest[]>(() => {
    const saved = localStorage.getItem('pm_invitations');
    return saved ? JSON.parse(saved) : [
      {
        id: 'inv-1',
        project_id: 'proj-medai-1',
        project_title: 'PulseSense AI',
        sender_id: 'user-rahul-3',
        sender_name: 'Rahul Varma',
        recipient_id: 'user-arjun-1',
        recipient_name: 'Arjun Mehta',
        type: 'project_invite',
        status: 'pending',
        role_offered_or_requested: 'Frontend',
        message: 'Hey Arjun, saw your React & Next.js background. We need a lead frontend engineer for PulseSense AI!',
        created_at: '2026-01-20T10:00:00Z',
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pm_current_user');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES[0]; // Defaults to Arjun Mehta for instant demo
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Team Invitation',
      message: 'Rahul Varma invited you to join PulseSense AI as Frontend Lead.',
      timestamp: '2 hours ago',
      read: false,
      link: '/projects/proj-medai-1',
    },
    {
      id: 'notif-2',
      title: '94% Compatibility Match Found',
      message: 'ZeroShield matches your skills in React and high-performance WebSockets.',
      timestamp: '1 day ago',
      read: true,
      link: '/projects/proj-fraud-3',
    }
  ]);

  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'warning' }[]>([]);

  // Persist local changes
  useEffect(() => {
    localStorage.setItem('pm_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('pm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pm_invitations', JSON.stringify(invitations));
  }, [invitations]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pm_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pm_current_user');
    }
  }, [currentUser]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Calculate profile completion percentage
  const profileCompletionPercentage = React.useMemo(() => {
    if (!currentUser) return 0;
    let score = 0;
    if (currentUser.full_name) score += 15;
    if (currentUser.college && currentUser.course) score += 15;
    if (currentUser.bio && currentUser.bio.length > 20) score += 15;
    if (currentUser.skills && currentUser.skills.length >= 3) score += 20;
    if (currentUser.preferred_roles && currentUser.preferred_roles.length >= 1) score += 10;
    if (currentUser.days_available && currentUser.days_available.length >= 2) score += 10;
    if (currentUser.github_url || currentUser.linkedin_url || currentUser.portfolio_url) score += 10;
    if (currentUser.learning_goals && currentUser.learning_goals.length >= 1) score += 5;
    return Math.min(100, score);
  }, [currentUser]);

  const login = async (email: string, _pass: string) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: _pass });
        if (error) throw error;
        if (data.user) {
          // Fetch profile
          const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          if (prof) {
            setCurrentUser(prof as UserProfile);
            addToast(`Welcome back, ${prof.full_name}!`, 'success');
            return { success: true };
          }
        }
      } catch (err: any) {
        // Fallback to demo mode if Supabase credentials fail
      }
    }

    // Demo Mode Auth
    const existing = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      addToast(`Logged in as ${existing.full_name} (Demo Mode)`, 'success');
      return { success: true };
    }

    // Create demo profile on the fly
    const newDemoUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0].toUpperCase(),
      college: 'Tech University',
      course: 'Computer Science',
      year_of_study: '3rd Year',
      bio: 'Eager builder looking for hackathon teammates and startup co-founders.',
      experience_level: 'Intermediate',
      skills: ['React', 'Python', 'UI/UX'],
      preferred_roles: ['Developer', 'Full Stack'],
      interests: ['AI / ML', 'Hackathons'],
      days_available: ['Mon', 'Wed', 'Fri', 'Sat'],
      hours_per_week: 15,
      schedule_preference: 'Flexible',
      learning_goals: ['PyTorch', 'System Architecture'],
      desired_project_types: ['Hackathon', 'AI / ML'],
    };

    setProfiles(prev => [newDemoUser, ...prev]);
    setCurrentUser(newDemoUser);
    addToast(`Account created for ${newDemoUser.full_name}!`, 'success');
    return { success: true };
  };

  const signup = async (email: string, pass: string, name: string) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        if (data.user) {
          const newProf: UserProfile = {
            id: data.user.id,
            email,
            full_name: name,
            college: '',
            course: '',
            year_of_study: '1st Year',
            bio: '',
            experience_level: 'Beginner',
            skills: [],
            preferred_roles: ['Developer'],
            interests: [],
            days_available: ['Sat', 'Sun'],
            hours_per_week: 10,
            schedule_preference: 'Flexible',
            learning_goals: [],
            desired_project_types: ['Hackathon'],
          };
          setCurrentUser(newProf);
          setProfiles(prev => [newProf, ...prev]);
          addToast('Account created successfully!', 'success');
          return { success: true };
        }
      } catch (err: any) {
        // Fallback to local state
      }
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      full_name: name,
      college: 'Tech University',
      course: 'Computer Science',
      year_of_study: '2nd Year',
      bio: 'Passionate developer forming new hackathon teams.',
      experience_level: 'Intermediate',
      skills: ['React', 'JavaScript', 'UI/UX'],
      preferred_roles: ['Frontend', 'Developer'],
      interests: ['Hackathons', 'Startups'],
      days_available: ['Mon', 'Tue', 'Thu', 'Sat', 'Sun'],
      hours_per_week: 14,
      schedule_preference: 'Evenings',
      learning_goals: ['AI/ML', 'Docker'],
      desired_project_types: ['Hackathon', 'Startup'],
      created_at: new Date().toISOString(),
    };

    setProfiles(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    addToast(`Welcome to ProjectMatch, ${name}!`, 'success');
    return { success: true };
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentUser(null);
    addToast('Logged out', 'info');
  };

  const switchDemoUser = (userId: string) => {
    const target = profiles.find(p => p.id === userId);
    if (target) {
      setCurrentUser(target);
      addToast(`Switched active view to: ${target.full_name} (${target.preferred_roles[0] || 'Member'})`, 'info');
    }
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setProfiles(prev => prev.map(p => p.id === currentUser.id ? updated : p));
    
    // Also update any project membership where this user exists
    setProjects(prev => prev.map(proj => ({
      ...proj,
      members: proj.members.map(m => m.user_id === currentUser.id ? { ...m, profile: updated } : m)
    })));

    addToast('Profile updated successfully!', 'success');
  };

  const createProject = (newProjectData: Omit<Project, 'id' | 'creator_id' | 'members' | 'created_at'>) => {
    const creatorId = currentUser?.id || 'guest';
    const creatorName = currentUser?.full_name || 'Anonymous Builder';
    
    const newProj: Project = {
      ...newProjectData,
      id: `proj-${Date.now()}`,
      creator_id: creatorId,
      creator_name: creatorName,
      status: 'open',
      created_at: new Date().toISOString(),
      members: currentUser ? [
        {
          user_id: currentUser.id,
          profile: currentUser,
          role: currentUser.preferred_roles[0] || 'Developer',
          joined_at: new Date().toISOString(),
        }
      ] : []
    };

    setProjects(prev => [newProj, ...prev]);
    addToast(`Project "${newProj.title}" published!`, 'success');
    return newProj;
  };

  const applyToProject = (projectId: string, message: string, role: RoleType) => {
    if (!currentUser) {
      addToast('Please login to apply to projects', 'warning');
      return;
    }

    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    // Check if already applied or already a member
    if (proj.members.some(m => m.user_id === currentUser.id)) {
      addToast('You are already a member of this project.', 'info');
      return;
    }

    const newReq: InvitationOrRequest = {
      id: `req-${Date.now()}`,
      project_id: projectId,
      project_title: proj.title,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      recipient_id: proj.creator_id,
      recipient_name: proj.creator_name || 'Project Creator',
      type: 'join_request',
      status: 'pending',
      role_offered_or_requested: role,
      message,
      created_at: new Date().toISOString(),
    };

    setInvitations(prev => [newReq, ...prev]);
    addToast('Join request sent to the project creator!', 'success');
  };

  const inviteUserToProject = (projectId: string, userId: string, role: RoleType, message: string) => {
    if (!currentUser) return;
    const proj = projects.find(p => p.id === projectId);
    const targetUser = profiles.find(p => p.id === userId);
    if (!proj || !targetUser) return;

    const newInv: InvitationOrRequest = {
      id: `inv-${Date.now()}`,
      project_id: projectId,
      project_title: proj.title,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      recipient_id: userId,
      recipient_name: targetUser.full_name,
      type: 'project_invite',
      status: 'pending',
      role_offered_or_requested: role,
      message,
      created_at: new Date().toISOString(),
    };

    setInvitations(prev => [newInv, ...prev]);
    addToast(`Invitation sent to ${targetUser.full_name}!`, 'success');
  };

  const respondToInvitation = (invitationId: string, accept: boolean) => {
    const inv = invitations.find(i => i.id === invitationId);
    if (!inv) return;

    const newStatus = accept ? 'accepted' : 'declined';
    setInvitations(prev => prev.map(i => i.id === invitationId ? { ...i, status: newStatus } : i));

    if (accept) {
      // Add member to project
      const targetProject = projects.find(p => p.id === inv.project_id);
      const userToAdd = profiles.find(p => p.id === (inv.type === 'project_invite' ? inv.recipient_id : inv.sender_id));

      if (targetProject && userToAdd) {
        const newMember = {
          user_id: userToAdd.id,
          profile: userToAdd,
          role: inv.role_offered_or_requested || userToAdd.preferred_roles[0] || 'Developer',
          joined_at: new Date().toISOString(),
        };

        setProjects(prev => prev.map(p => 
          p.id === targetProject.id && !p.members.some(m => m.user_id === userToAdd.id)
            ? { ...p, members: [...p.members, newMember] }
            : p
        ));
      }
      addToast('Invitation accepted! Member added to team.', 'success');
    } else {
      addToast('Invitation declined.', 'info');
    }
  };

  const addTask = (taskData: Omit<WorkspaceTask, 'id' | 'created_at'>) => {
    const newTask: WorkspaceTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    addToast('Task added to workspace board', 'success');
  };

  const updateTaskStatus = (taskId: string, status: 'todo' | 'in_progress' | 'done') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        profiles,
        projects,
        tasks,
        invitations,
        notifications,
        isDemoMode: !isSupabaseConfigured,
        profileCompletionPercentage,
        login,
        signup,
        logout,
        switchDemoUser,
        updateCurrentUser,
        createProject,
        applyToProject,
        inviteUserToProject,
        respondToInvitation,
        addTask,
        updateTaskStatus,
        markNotificationRead,
        addToast,
        toasts,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
