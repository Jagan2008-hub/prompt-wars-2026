import { describe, it, expect } from 'vitest';
import {
  evaluateCandidateMatch,
  generateAIDreamTeam,
  calculateLocalMatch,
  detectSkillGaps,
  calculateTeamDNA,
  evaluateProjectReadiness,
} from './gemini';
import { UserProfile, Project } from '../types';

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'gemini-user-1',
    email: 'gemini@example.com',
    full_name: 'Gemini Test User',
    college: 'MIT',
    course: 'Computer Science',
    year_of_study: '3rd Year',
    bio: 'Test user bio.',
    experience_level: 'Intermediate',
    skills: ['React', 'Python'],
    preferred_roles: ['Developer'],
    interests: ['Hackathons'],
    days_available: ['Mon', 'Wed'],
    hours_per_week: 15,
    schedule_preference: 'Flexible',
    learning_goals: ['AI/ML'],
    desired_project_types: ['Hackathon'],
    ...overrides,
  };
}

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'gemini-proj-1',
    creator_id: 'creator-1',
    title: 'Gemini Test Project',
    description: 'A test project.',
    category: 'Hackathon',
    project_type: 'Hackathon',
    members_needed: 4,
    deadline: '2026-12-31',
    commitment_hours: 15,
    availability_requirement: 'Flexible',
    experience_preference: 'Intermediate',
    required_skills: ['React', 'Python'],
    required_roles: ['Developer'],
    members: [],
    status: 'open',
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('gemini re-exports & evaluateCandidateMatch', () => {
  it('evaluateCandidateMatch resolves local match with valid score structure', async () => {
    const project = makeProject();
    const profile = makeProfile();
    const result = await evaluateCandidateMatch(project, profile);

    expect(result).toBeDefined();
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.isAiGenerated).toBe(false);
    expect(result.factors).toHaveLength(6);
  });

  it('generateAIDreamTeam maps directly to recommended team generator', async () => {
    const project = makeProject({ required_roles: ['Developer'] });
    const profile = makeProfile();
    const result = await generateAIDreamTeam(project, [profile]);

    expect(result.recommendedTeam).toBeDefined();
    expect(result.skillCoverageScore).toBeGreaterThanOrEqual(0);
  });

  it('re-exported calculateLocalMatch works correctly', () => {
    const result = calculateLocalMatch(makeProject(), makeProfile());
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
  });

  it('re-exported detectSkillGaps works correctly', () => {
    const gaps = detectSkillGaps(makeProject({ required_skills: ['React'] }), []);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].status).toBe('Missing');
  });

  it('re-exported calculateTeamDNA works correctly', () => {
    const dna = calculateTeamDNA([makeProfile()]);
    expect(dna.technical).toBeGreaterThanOrEqual(0);
  });

  it('re-exported evaluateProjectReadiness works correctly', () => {
    const readiness = evaluateProjectReadiness(makeProject(), []);
    expect(readiness.readinessScore).toBeGreaterThanOrEqual(0);
  });
});
