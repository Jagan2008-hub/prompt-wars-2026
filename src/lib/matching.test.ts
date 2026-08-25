import { describe, it, expect } from 'vitest';
import {
  calculateLocalMatch,
  detectSkillGaps,
  generateRecommendedTeam,
  evaluateProjectReadiness,
  calculateTeamDNA,
  filterProfiles,
  skillsMatch,
  MATCH_WEIGHTS,
} from './matching';
import { UserProfile, Project, ProjectMember, RoleType } from '../types';

// ─── Test Helpers ───────────────────────────────────────────────────────

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'test-user-1',
    email: 'test@example.com',
    full_name: 'Test User',
    college: 'Test University',
    course: 'Computer Science',
    year_of_study: '3rd Year',
    bio: 'A test user for unit tests.',
    experience_level: 'Intermediate',
    skills: ['React', 'Python'],
    preferred_roles: ['Developer'],
    interests: ['Hackathons'],
    days_available: ['Mon', 'Wed', 'Fri', 'Sat'],
    hours_per_week: 15,
    schedule_preference: 'Flexible',
    learning_goals: ['AI/ML'],
    desired_project_types: ['Hackathon'],
    ...overrides,
  };
}

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'test-proj-1',
    creator_id: 'creator-1',
    title: 'Test Project',
    description: 'A test project.',
    category: 'Hackathon',
    project_type: 'Hackathon',
    members_needed: 4,
    deadline: '2026-12-31',
    commitment_hours: 15,
    availability_requirement: 'Flexible',
    experience_preference: 'Intermediate',
    required_skills: ['React', 'Python', 'AI/ML'],
    required_roles: ['Frontend', 'Backend', 'AI/ML Engineer'],
    members: [],
    status: 'open',
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

function makeMember(
  profile: UserProfile,
  role: RoleType = 'Developer'
): ProjectMember {
  return {
    user_id: profile.id,
    profile,
    role,
    joined_at: '2026-01-01T00:00:00Z',
  };
}

// ─── skillsMatch ────────────────────────────────────────────────────────

describe('skillsMatch', () => {
  it('matches exact same skill', () => {
    expect(skillsMatch('React', 'React')).toBe(true);
  });

  it('matches case-insensitively', () => {
    expect(skillsMatch('react', 'React')).toBe(true);
    expect(skillsMatch('PYTHON', 'python')).toBe(true);
  });

  it('matches substring containment', () => {
    expect(skillsMatch('AI/ML', 'ai/ml')).toBe(true);
  });

  it('does not match unrelated skills', () => {
    expect(skillsMatch('React', 'Python')).toBe(false);
    expect(skillsMatch('Go', 'Docker')).toBe(false);
  });
});

// ─── MATCH_WEIGHTS ──────────────────────────────────────────────────────

describe('MATCH_WEIGHTS', () => {
  it('weights sum to 100', () => {
    const total = Object.values(MATCH_WEIGHTS).reduce((sum, w) => sum + w, 0);
    expect(total).toBe(100);
  });
});

// ─── calculateLocalMatch ───────────────────────────────────────────────

describe('calculateLocalMatch', () => {
  it('returns an overallScore between 0 and 100', () => {
    const project = makeProject();
    const profile = makeProfile();
    const result = calculateLocalMatch(project, profile);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it('returns higher score when all skills match', () => {
    const project = makeProject({ required_skills: ['React', 'Python'] });
    const fullMatch = makeProfile({ skills: ['React', 'Python', 'Node.js'] });
    const noMatch = makeProfile({
      id: 'user-2',
      skills: ['Go', 'Rust', 'Docker'],
    });

    const fullResult = calculateLocalMatch(project, fullMatch);
    const noResult = calculateLocalMatch(project, noMatch);

    expect(fullResult.skillMatch).toBeGreaterThan(noResult.skillMatch);
    expect(fullResult.overallScore).toBeGreaterThan(noResult.overallScore);
  });

  it('calculates partial skill overlap accurately', () => {
    const project = makeProject({ required_skills: ['React', 'Python', 'Go', 'Docker'] });
    const partialMatch = makeProfile({ skills: ['React'] }); // 1 of 4 = 25%

    const result = calculateLocalMatch(project, partialMatch);
    expect(result.skillMatch).toBe(25);
  });

  it('returns higher score when role matches', () => {
    const project = makeProject({ required_roles: ['Frontend'] });
    const roleMatch = makeProfile({ preferred_roles: ['Frontend'] });
    const noRoleMatch = makeProfile({
      id: 'user-2',
      preferred_roles: ['Researcher'],
    });

    const matchResult = calculateLocalMatch(project, roleMatch);
    const noMatchResult = calculateLocalMatch(project, noRoleMatch);

    expect(matchResult.roleMatch).toBeGreaterThan(noMatchResult.roleMatch);
  });

  it('rewards higher availability', () => {
    const project = makeProject({ commitment_hours: 15 });
    const highAvail = makeProfile({
      hours_per_week: 20,
      days_available: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    });
    const lowAvail = makeProfile({
      id: 'user-2',
      hours_per_week: 5,
      days_available: ['Sat'],
    });

    const highResult = calculateLocalMatch(project, highAvail);
    const lowResult = calculateLocalMatch(project, lowAvail);

    expect(highResult.availabilityMatch).toBeGreaterThan(
      lowResult.availabilityMatch
    );
  });

  it('handles zero or low availability edge case', () => {
    const project = makeProject({ commitment_hours: 20 });
    const zeroAvail = makeProfile({
      hours_per_week: 0,
      days_available: [],
    });

    const result = calculateLocalMatch(project, zeroAvail);
    expect(result.availabilityMatch).toBeLessThanOrEqual(25);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
  });

  it('rewards matching experience level', () => {
    const project = makeProject({ experience_preference: 'Advanced' });
    const advProfile = makeProfile({ experience_level: 'Advanced' });
    const begProfile = makeProfile({
      id: 'user-2',
      experience_level: 'Beginner',
    });

    const advResult = calculateLocalMatch(project, advProfile);
    const begResult = calculateLocalMatch(project, begProfile);

    expect(advResult.experienceMatch).toBeGreaterThan(
      begResult.experienceMatch
    );
  });

  it('rewards learning synergy when goals overlap with required skills', () => {
    const project = makeProject({ required_skills: ['AI/ML', 'PyTorch'] });
    const learnerProfile = makeProfile({ learning_goals: ['AI/ML', 'PyTorch'] });
    const noGoalsProfile = makeProfile({
      id: 'user-2',
      learning_goals: [],
    });

    const learnerResult = calculateLocalMatch(project, learnerProfile);
    const noGoalsResult = calculateLocalMatch(project, noGoalsProfile);

    expect(learnerResult.learningSynergy).toBeGreaterThan(
      noGoalsResult.learningSynergy
    );
  });

  it('handles empty profile edge cases gracefully', () => {
    const project = makeProject({ required_skills: ['React'] });
    const emptyProfile: UserProfile = {
      id: 'empty-user',
      email: 'empty@test.com',
      full_name: 'Empty Profile',
      college: '',
      course: '',
      year_of_study: '1st Year',
      bio: '',
      experience_level: 'Beginner',
      skills: [],
      preferred_roles: [],
      interests: [],
      days_available: [],
      hours_per_week: 0,
      schedule_preference: 'Flexible',
      learning_goals: [],
      desired_project_types: [],
    };

    const result = calculateLocalMatch(project, emptyProfile);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.skillMatch).toBe(0);
    expect(result.roleMatch).toBe(0);
  });

  it('returns factors array with 6 dimensions', () => {
    const result = calculateLocalMatch(makeProject(), makeProfile());
    expect(result.factors).toHaveLength(6);
    expect(result.factors.map((f) => f.name)).toEqual([
      'Skill Compatibility',
      'Role Compatibility',
      'Availability',
      'Experience',
      'Learning Goals',
      'Project Interest',
    ]);
  });

  it('factor weights sum to 100', () => {
    const result = calculateLocalMatch(makeProject(), makeProfile());
    const weightSum = result.factors.reduce((s, f) => s + f.weight, 0);
    expect(weightSum).toBe(100);
  });

  it('populates keyStrengths from actual data', () => {
    const result = calculateLocalMatch(
      makeProject({ required_skills: ['React'] }),
      makeProfile({ skills: ['React'] })
    );
    expect(result.keyStrengths.length).toBeGreaterThan(0);
    expect(result.keyStrengths.some((s) => s.includes('React'))).toBe(true);
  });

  it('populates growthAreas when skills are missing', () => {
    const result = calculateLocalMatch(
      makeProject({ required_skills: ['React', 'Go', 'Rust'] }),
      makeProfile({ skills: ['React'] })
    );
    expect(result.growthAreas.length).toBeGreaterThan(0);
    expect(result.growthAreas.some((s) => s.includes('Go') || s.includes('Rust'))).toBe(true);
  });

  it('isAiGenerated is false', () => {
    const result = calculateLocalMatch(makeProject(), makeProfile());
    expect(result.isAiGenerated).toBe(false);
  });
});

// ─── detectSkillGaps ───────────────────────────────────────────────────

describe('detectSkillGaps', () => {
  it('marks skill as Covered when a team member has it', () => {
    const member = makeProfile({ id: 'member-1', skills: ['React'] });
    const project = makeProject({
      required_skills: ['React'],
      members: [makeMember(member, 'Frontend')],
    });

    const gaps = detectSkillGaps(project, [member]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].status).toBe('Covered');
    expect(gaps[0].coveragePercentage).toBe(100);
    expect(gaps[0].coveredBy).toContain('Test User');
  });

  it('marks skill as Missing when no team member or candidate has it', () => {
    const member = makeProfile({ id: 'member-1', skills: ['React'] });
    const project = makeProject({
      required_skills: ['Rust'],
      members: [makeMember(member, 'Frontend')],
    });

    const gaps = detectSkillGaps(project, [member]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].status).toBe('Missing');
    expect(gaps[0].coveragePercentage).toBe(0);
  });

  it('marks skill as Partial when a non-member candidate has it', () => {
    const member = makeProfile({ id: 'member-1', skills: ['React'] });
    const candidate = makeProfile({ id: 'candidate-1', skills: ['Python'] });
    const project = makeProject({
      required_skills: ['Python'],
      members: [makeMember(member, 'Frontend')],
    });

    const gaps = detectSkillGaps(project, [member, candidate]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].status).toBe('Partial');
    expect(gaps[0].coveragePercentage).toBeGreaterThan(0);
    expect(gaps[0].coveragePercentage).toBeLessThan(100);
    expect(gaps[0].suggestedCandidates).toHaveLength(1);
    expect(gaps[0].suggestedCandidates![0].profile.id).toBe('candidate-1');
  });

  it('handles edge case when no candidates are provided', () => {
    const project = makeProject({
      required_skills: ['React', 'Python'],
      members: [],
    });

    const gaps = detectSkillGaps(project, []);
    expect(gaps).toHaveLength(2);
    expect(gaps.every(g => g.status === 'Missing')).toBe(true);
    expect(gaps.every(g => g.suggestedCandidates?.length === 0)).toBe(true);
  });

  it('does not suggest existing members as candidates', () => {
    const member = makeProfile({ id: 'member-1', skills: ['React', 'Python'] });
    const project = makeProject({
      required_skills: ['Python'],
      members: [makeMember(member, 'Frontend')],
    });

    const gaps = detectSkillGaps(project, [member]);
    expect(gaps[0].status).toBe('Covered');
  });

  it('limits candidate suggestions to 3', () => {
    const profiles = Array.from({ length: 5 }, (_, i) =>
      makeProfile({ id: `cand-${i}`, skills: ['AI/ML'], full_name: `Candidate ${i}` })
    );
    const project = makeProject({
      required_skills: ['AI/ML'],
      members: [],
    });

    const gaps = detectSkillGaps(project, profiles);
    expect(gaps[0].status).toBe('Partial');
    expect(gaps[0].suggestedCandidates!.length).toBeLessThanOrEqual(3);
  });

  it('handles empty required_skills', () => {
    const gaps = detectSkillGaps(makeProject({ required_skills: [] }), []);
    expect(gaps).toHaveLength(0);
  });
});

// ─── generateRecommendedTeam ────────────────────────────────────────────

describe('generateRecommendedTeam', () => {
  it('returns recommended team members for unfilled roles', async () => {
    const profiles = [
      makeProfile({
        id: 'frontend-1',
        preferred_roles: ['Frontend'],
        skills: ['React', 'TypeScript'],
      }),
      makeProfile({
        id: 'backend-1',
        preferred_roles: ['Backend'],
        skills: ['Python', 'PostgreSQL'],
      }),
    ];
    const project = makeProject({
      required_roles: ['Frontend', 'Backend'],
      members: [],
    });

    const result = await generateRecommendedTeam(project, profiles);
    expect(result.recommendedTeam.length).toBeGreaterThan(0);
    expect(result.recommendedTeam.length).toBeLessThanOrEqual(2);
  });

  it('handles fully staffed project edge case gracefully', async () => {
    const members = [
      makeProfile({ id: 'm1', preferred_roles: ['Frontend'] }),
      makeProfile({ id: 'm2', preferred_roles: ['Backend'] }),
    ];
    const project = makeProject({
      required_roles: ['Frontend', 'Backend'],
      members_needed: 2,
      members: [
        makeMember(members[0], 'Frontend'),
        makeMember(members[1], 'Backend'),
      ],
    });

    const result = await generateRecommendedTeam(project, members);
    expect(result.recommendedTeam).toHaveLength(0);
    expect(result.teamBalanceScore).toBe(100);
  });

  it('handles no candidates edge case gracefully', async () => {
    const project = makeProject({
      required_roles: ['Frontend', 'Backend'],
      members: [],
    });

    const result = await generateRecommendedTeam(project, []);
    expect(result.recommendedTeam).toHaveLength(0);
    expect(result.skillCoverageScore).toBe(0);
  });

  it('does not select the same candidate twice', async () => {
    const singleProfile = makeProfile({
      id: 'multi-1',
      preferred_roles: ['Frontend', 'Backend'],
      skills: ['React', 'Python'],
    });
    const project = makeProject({
      required_roles: ['Frontend', 'Backend'],
      members: [],
    });

    const result = await generateRecommendedTeam(project, [singleProfile]);
    const ids = result.recommendedTeam.map((m) => m.profile.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('does not recommend existing project members', async () => {
    const existingMember = makeProfile({
      id: 'existing-1',
      preferred_roles: ['Frontend'],
      skills: ['React'],
    });
    const candidate = makeProfile({
      id: 'candidate-1',
      preferred_roles: ['Backend'],
      skills: ['Python'],
    });
    const project = makeProject({
      required_roles: ['Frontend', 'Backend'],
      members: [makeMember(existingMember, 'Frontend')],
    });

    const result = await generateRecommendedTeam(project, [
      existingMember,
      candidate,
    ]);
    const recommendedIds = result.recommendedTeam.map((m) => m.profile.id);
    expect(recommendedIds).not.toContain('existing-1');
  });

  it('prefers candidates who add missing skills', async () => {
    const reactDev = makeProfile({
      id: 'react-dev',
      preferred_roles: ['Frontend'],
      skills: ['React'],
    });
    const pythonDev = makeProfile({
      id: 'python-dev',
      preferred_roles: ['Frontend'],
      skills: ['Python', 'AI/ML'],
    });
    const project = makeProject({
      required_skills: ['Python', 'AI/ML'],
      required_roles: ['Frontend'],
      members: [],
    });

    const result = await generateRecommendedTeam(project, [
      reactDev,
      pythonDev,
    ]);
    expect(result.recommendedTeam.length).toBe(1);
    expect(result.recommendedTeam[0].profile.id).toBe('python-dev');
  });

  it('provides rejection reasons for non-selected candidates', async () => {
    const selected = makeProfile({
      id: 'selected',
      preferred_roles: ['Frontend'],
      skills: ['React'],
      hours_per_week: 20,
    });
    const rejected = makeProfile({
      id: 'rejected',
      preferred_roles: ['Researcher'],
      skills: ['Research'],
      hours_per_week: 5,
    });
    const project = makeProject({
      required_roles: ['Frontend'],
      commitment_hours: 15,
      members: [],
    });

    const result = await generateRecommendedTeam(project, [
      selected,
      rejected,
    ]);
    expect(result.rejectedCandidates).toBeDefined();
    expect(result.rejectedCandidates!.length).toBeGreaterThan(0);
    expect(result.rejectedCandidates![0].reason.length).toBeGreaterThan(0);
  });

  it('computes actual skillCoverageScore', async () => {
    const profile = makeProfile({
      skills: ['React', 'Python', 'AI/ML'],
      preferred_roles: ['Frontend'],
    });
    const project = makeProject({
      required_skills: ['React', 'Python', 'AI/ML'],
      required_roles: ['Frontend'],
      members: [],
    });

    const result = await generateRecommendedTeam(project, [profile]);
    expect(result.skillCoverageScore).toBe(100);
  });

  it('computes actual teamBalanceScore', async () => {
    const profile = makeProfile({
      preferred_roles: ['Frontend'],
    });
    const project = makeProject({
      required_roles: ['Frontend', 'Backend'],
      members: [],
    });

    const result = await generateRecommendedTeam(project, [profile]);
    expect(result.teamBalanceScore).toBe(50);
  });
});

// ─── evaluateProjectReadiness ──────────────────────────────────────────

describe('evaluateProjectReadiness', () => {
  it('returns higher readiness for a fully staffed project', () => {
    const members = [
      makeProfile({ id: 'u1', skills: ['React'] }),
      makeProfile({ id: 'u2', skills: ['Python'] }),
      makeProfile({ id: 'u3', skills: ['AI/ML'] }),
      makeProfile({ id: 'u4', skills: ['UI/UX'] }),
    ];
    const project = makeProject({
      required_skills: ['React', 'Python', 'AI/ML'],
      required_roles: ['Frontend', 'Backend', 'AI/ML Engineer', 'UI/UX Designer'],
      members_needed: 4,
      members: [
        makeMember(members[0], 'Frontend'),
        makeMember(members[1], 'Backend'),
        makeMember(members[2], 'AI/ML Engineer'),
        makeMember(members[3], 'UI/UX Designer'),
      ],
    });

    const result = evaluateProjectReadiness(project, members);
    expect(result.readinessScore).toBeGreaterThanOrEqual(80);
    expect(result.skillCoverage).toBe(100);
    expect(result.roleStaffing).toBe(100);
  });

  it('returns lower readiness for a partially staffed project', () => {
    const member = makeProfile({ id: 'u1', skills: ['React'] });
    const project = makeProject({
      required_skills: ['React', 'Python', 'AI/ML', 'PostgreSQL'],
      members_needed: 4,
      members: [makeMember(member, 'Frontend')],
    });

    const result = evaluateProjectReadiness(project, [member]);
    expect(result.readinessScore).toBeLessThan(60);
    expect(result.roleStaffing).toBe(25); // 1 of 4
  });

  it('identifies missing skills correctly', () => {
    const member = makeProfile({ id: 'u1', skills: ['React'] });
    const project = makeProject({
      required_skills: ['React', 'Rust'],
      members: [makeMember(member, 'Frontend')],
    });

    const result = evaluateProjectReadiness(project, [member]);
    expect(result.skillCoverage).toBe(50); // 1 of 2 covered
  });

  it('identifies unfilled roles', () => {
    const member = makeProfile({ id: 'u1', skills: ['React'] });
    const project = makeProject({
      required_roles: ['Frontend', 'Backend', 'AI/ML Engineer'],
      members: [makeMember(member, 'Frontend')],
    });

    const result = evaluateProjectReadiness(project, [member]);
    expect(result.recommendedInitialRoles).toContain('Backend');
    expect(result.recommendedInitialRoles).toContain('AI/ML Engineer');
    expect(result.recommendedInitialRoles).not.toContain('Frontend');
  });

  it('detects high technical complexity', () => {
    const project = makeProject({
      required_skills: ['AI/ML', 'PyTorch', 'React'],
    });
    const result = evaluateProjectReadiness(project, []);
    expect(result.difficultyEstimate).toBe('High Technical Complexity');
  });

  it('detects beginner friendly when few skills', () => {
    const project = makeProject({
      required_skills: ['React', 'CSS'],
    });
    const result = evaluateProjectReadiness(project, []);
    expect(result.difficultyEstimate).toBe('Beginner Friendly');
  });

  it('handles project with no required skills or roles', () => {
    const project = makeProject({
      required_skills: [],
      required_roles: [],
      members: [],
    });
    const result = evaluateProjectReadiness(project, []);
    expect(result.readinessScore).toBeGreaterThanOrEqual(0);
    expect(result.readinessScore).toBeLessThanOrEqual(100);
  });
});

// ─── calculateTeamDNA ──────────────────────────────────────────────────

describe('calculateTeamDNA', () => {
  it('returns zeros for an empty team', () => {
    const dna = calculateTeamDNA([]);
    expect(dna.technical).toBe(0);
    expect(dna.creative).toBe(0);
    expect(dna.execution).toBe(0);
    expect(dna.leadership).toBe(0);
    expect(dna.learning).toBe(0);
  });

  it('detects technical strength when members have technical skills', () => {
    const profiles = [
      makeProfile({ skills: ['React', 'Python'], experience_level: 'Advanced' }),
      makeProfile({
        id: 'u2',
        skills: ['TypeScript', 'Node.js'],
        experience_level: 'Advanced',
      }),
    ];
    const dna = calculateTeamDNA(profiles);
    expect(dna.technical).toBe(100);
    expect(dna.execution).toBe(100); // Both advanced
  });

  it('detects creative capability', () => {
    const designer = makeProfile({
      skills: ['UI/UX', 'Figma'],
      preferred_roles: ['UI/UX Designer'],
    });
    const dna = calculateTeamDNA([designer]);
    expect(dna.creative).toBe(100);
  });

  it('detects leadership when members have PM roles', () => {
    const pm = makeProfile({
      preferred_roles: ['Project Manager'],
    });
    const dev = makeProfile({
      id: 'u2',
      preferred_roles: ['Developer'],
    });
    const dna = calculateTeamDNA([pm, dev]);
    expect(dna.leadership).toBe(50); // 1 of 2
  });

  it('dnaSummary mentions gaps when they exist', () => {
    const dev = makeProfile({
      skills: ['React'],
      preferred_roles: ['Developer'],
      experience_level: 'Beginner',
      learning_goals: [],
      hours_per_week: 5,
    });
    const dna = calculateTeamDNA([dev]);
    expect(dna.dnaSummary.length).toBeGreaterThan(0);
  });

  it('all values are between 0 and 100', () => {
    const many = Array.from({ length: 10 }, (_, i) =>
      makeProfile({
        id: `u${i}`,
        skills: ['React', 'UI/UX', 'AI/ML'],
        preferred_roles: ['Project Manager'],
        experience_level: 'Advanced',
        hours_per_week: 20,
        learning_goals: ['Docker', 'Kubernetes'],
      })
    );
    const dna = calculateTeamDNA(many);
    expect(dna.technical).toBeLessThanOrEqual(100);
    expect(dna.creative).toBeLessThanOrEqual(100);
    expect(dna.execution).toBeLessThanOrEqual(100);
    expect(dna.leadership).toBeLessThanOrEqual(100);
    expect(dna.learning).toBeLessThanOrEqual(100);
  });
});

// ─── filterProfiles ────────────────────────────────────────────────────

describe('filterProfiles', () => {
  const profiles = [
    makeProfile({
      id: 'u1',
      full_name: 'Alice Chen',
      skills: ['React', 'TypeScript'],
      preferred_roles: ['Frontend'],
      experience_level: 'Advanced',
      schedule_preference: 'Flexible',
      college: 'MIT',
    }),
    makeProfile({
      id: 'u2',
      full_name: 'Bob Smith',
      skills: ['Python', 'AI/ML'],
      preferred_roles: ['AI/ML Engineer'],
      experience_level: 'Intermediate',
      schedule_preference: 'Evenings',
      college: 'Stanford',
    }),
    makeProfile({
      id: 'u3',
      full_name: 'Charlie Lee',
      skills: ['UI/UX', 'Figma'],
      preferred_roles: ['UI/UX Designer'],
      experience_level: 'Beginner',
      schedule_preference: 'Weekends',
      college: 'Parsons',
    }),
  ];

  it('returns all profiles when no filters applied', () => {
    const result = filterProfiles(profiles, {});
    expect(result).toHaveLength(3);
  });

  it('filters by skill', () => {
    const result = filterProfiles(profiles, { skill: 'React' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('u1');
  });

  it('filters by role', () => {
    const result = filterProfiles(profiles, { role: 'AI/ML Engineer' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('u2');
  });

  it('filters by experience level', () => {
    const result = filterProfiles(profiles, { experience: 'Beginner' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('u3');
  });

  it('filters by schedule', () => {
    const result = filterProfiles(profiles, { schedule: 'Evenings' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('u2');
  });

  it('filters by search query (name)', () => {
    const result = filterProfiles(profiles, { searchQuery: 'alice' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('u1');
  });

  it('filters by search query (college)', () => {
    const result = filterProfiles(profiles, { searchQuery: 'stanford' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('u2');
  });

  it('filters by search query (skill)', () => {
    const result = filterProfiles(profiles, { searchQuery: 'figma' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('u3');
  });

  it('applies multiple filters together', () => {
    const result = filterProfiles(profiles, {
      skill: 'Python',
      experience: 'Intermediate',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('u2');
  });

  it('returns empty when no profiles match', () => {
    const result = filterProfiles(profiles, {
      skill: 'Rust',
      experience: 'Advanced',
    });
    expect(result).toHaveLength(0);
  });

  it('clearing filters (All) returns all profiles', () => {
    const result = filterProfiles(profiles, {
      skill: 'All',
      role: 'All',
      experience: 'All',
      schedule: 'All',
      searchQuery: '',
    });
    expect(result).toHaveLength(3);
  });
});
