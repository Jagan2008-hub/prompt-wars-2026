export type RoleType = 
  | 'Developer'
  | 'Frontend'
  | 'Backend'
  | 'Full Stack'
  | 'AI/ML Engineer'
  | 'UI/UX Designer'
  | 'Researcher'
  | 'Hardware/Robotics'
  | 'Project Manager'
  | 'Marketing/Growth'
  | 'Domain Expert';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ProjectCategory = 
  | 'Hackathon' 
  | 'AI / ML' 
  | 'Startup' 
  | 'Research' 
  | 'College Project' 
  | 'Open Source' 
  | 'Robotics / IoT' 
  | 'FinTech';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  college: string;
  course: string;
  year_of_study: string;
  bio: string;
  avatar_url?: string;
  experience_level: ExperienceLevel;
  experience_summary?: string;
  skills: string[];
  skill_proficiencies?: Record<string, 'Beginner' | 'Intermediate' | 'Expert'>;
  preferred_roles: RoleType[];
  interests: string[];
  days_available: string[];
  hours_per_week: number;
  schedule_preference: 'Weekdays' | 'Weekends' | 'Flexible' | 'Evenings';
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  learning_goals: string[];
  desired_project_types: ProjectCategory[];
  created_at?: string;
}

export interface ProjectMember {
  user_id: string;
  profile: UserProfile;
  role: RoleType;
  joined_at: string;
}

export interface Project {
  id: string;
  creator_id: string;
  creator_name?: string;
  title: string;
  description: string;
  category: ProjectCategory;
  project_type: string;
  members_needed: number;
  deadline: string;
  commitment_hours: number;
  availability_requirement: string;
  experience_preference: ExperienceLevel;
  required_skills: string[];
  required_roles: RoleType[];
  members: ProjectMember[];
  status: 'open' | 'in_progress' | 'completed';
  created_at: string;
}

export interface AIMatchFactor {
  name: string;
  score: number;
  weight: number; // percentage e.g. 35
  description: string;
}

export interface AIMatchAnalysis {
  overallScore: number;
  skillMatch: number;
  roleMatch: number;
  availabilityMatch: number;
  experienceMatch: number;
  learningSynergy: number;
  communicationFit: number;
  factors: AIMatchFactor[];
  keyStrengths: string[];
  growthAreas: string[];
  synergyReasoning: string;
  isAiGenerated?: boolean;
}

export interface SkillGapItem {
  skill: string;
  status: 'Covered' | 'Partial' | 'Missing';
  coveragePercentage: number;
  coveredBy?: string[];
  suggestedCandidates?: {
    profile: UserProfile;
    reason: string;
    gapFillEfficiency: number;
  }[];
}

export interface DreamTeamMember {
  profile: UserProfile;
  assignedRole: RoleType;
  matchScore: number;
  contributedSkills: string[];
  selectionReason: string;
}

export interface CandidateRejectionReason {
  profile: UserProfile;
  reason: string;
}

export interface TeamDNA {
  technical: number;
  creative: number;
  execution: number;
  leadership: number;
  learning: number;
  dnaSummary: string;
}

export interface DreamTeamResult {
  teamCompatibilityScore: number;
  recommendedTeam: DreamTeamMember[];
  skillCoverageScore: number;
  availabilitySynergyScore: number;
  teamBalanceScore: number;
  overallSynergyReasoning: string;
  strengths: string[];
  potentialRisks: string[];
  uncoveredSkills: string[];
  rejectedCandidates?: CandidateRejectionReason[];
  dna: TeamDNA;
}

export interface ProjectReadiness {
  readinessScore: number;
  skillCoverage: number;
  roleStaffing: number;
  difficultyEstimate: 'Beginner Friendly' | 'Moderate Sprint' | 'High Technical Complexity';
  recommendedInitialRoles: RoleType[];
  readinessAdvice: string;
}

export interface InvitationOrRequest {
  id: string;
  project_id: string;
  project_title: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string;
  recipient_name: string;
  type: 'join_request' | 'project_invite';
  status: 'pending' | 'accepted' | 'declined';
  role_offered_or_requested?: RoleType;
  message?: string;
  created_at: string;
}

export interface WorkspaceTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  assigned_to_id?: string;
  assigned_to_name?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  type?: 'invite' | 'match' | 'system' | 'gap';
}
