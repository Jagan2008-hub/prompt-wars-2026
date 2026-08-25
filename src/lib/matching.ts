import {
  UserProfile,
  Project,
  AIMatchAnalysis,
  SkillGapItem,
  DreamTeamResult,
  DreamTeamMember,
  RoleType,
  TeamDNA,
  CandidateRejectionReason,
  ProjectReadiness,
} from '../types';

/** Matching weight configuration (must sum to 100) */
export const MATCH_WEIGHTS = {
  skill: 30,
  role: 20,
  availability: 15,
  experience: 15,
  learning: 10,
  interest: 10,
} as const;

/**
 * Normalize a string for case-insensitive fuzzy matching.
 */
function normalize(s: string): string {
  return s.toLowerCase().trim();
}

/**
 * Check whether two skill strings are a fuzzy match.
 * Matches exact equality or substring containment.
 */
export function skillsMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

/**
 * Transparent Multi-Factor Compatibility Calculator.
 *
 * Weights:
 *   Skill Compatibility       30%
 *   Role Compatibility        20%
 *   Availability              15%
 *   Experience                15%
 *   Learning Goals            10%
 *   Project Interest          10%
 */
export function calculateLocalMatch(
  project: Project,
  profile: UserProfile
): AIMatchAnalysis {
  const reqSkills = project.required_skills.map(normalize);
  const userSkills = profile.skills.map(normalize);

  // 1. Skill Match (30%)
  let matchedSkillCount = 0;
  const matchedSkillNames: string[] = [];
  const missingSkillNames: string[] = [];

  project.required_skills.forEach((reqSkill, idx) => {
    const found = userSkills.some((u) => skillsMatch(u, reqSkills[idx]));
    if (found) {
      matchedSkillCount++;
      matchedSkillNames.push(reqSkill);
    } else {
      missingSkillNames.push(reqSkill);
    }
  });

  const skillMatchRatio =
    reqSkills.length > 0 ? matchedSkillCount / reqSkills.length : 0;
  const skillMatch = Math.min(
    100,
    Math.max(0, Math.round(skillMatchRatio * 100))
  );

  // 2. Role Match (20%)
  const reqRoles = project.required_roles;
  const userRoles = profile.preferred_roles;
  const directRoleMatch = userRoles.find((r) => reqRoles.includes(r));
  let roleMatch: number;
  if (userRoles.length === 0) {
    roleMatch = 0;
  } else if (directRoleMatch) {
    roleMatch = 95;
  } else if (
    userRoles.some((r) => r === 'Full Stack' || r === 'Developer')
  ) {
    roleMatch = 70;
  } else {
    roleMatch = 40;
  }

  // 3. Availability / Schedule Overlap (15%)
  const projectHours = Math.max(1, project.commitment_hours);
  const hoursRatio = Math.min(1, profile.hours_per_week / projectHours);
  const dayScore =
    profile.days_available.length >= 5
      ? 100
      : profile.days_available.length >= 4
        ? 90
        : profile.days_available.length >= 3
          ? 75
          : profile.days_available.length >= 2
            ? 55
            : 30;
  const availabilityMatch = Math.min(
    100,
    Math.round(hoursRatio * 50 + dayScore * 0.5)
  );

  // 4. Experience Match (15%)
  let expMatch: number;
  if (profile.experience_level === project.experience_preference) {
    expMatch = 95;
  } else if (profile.experience_level === 'Advanced') {
    expMatch = 85;
  } else if (
    profile.experience_level === 'Intermediate' &&
    project.experience_preference === 'Beginner'
  ) {
    expMatch = 80;
  } else if (
    profile.experience_level === 'Beginner' &&
    project.experience_preference === 'Advanced'
  ) {
    expMatch = 35;
  } else {
    expMatch = 60;
  }

  // 5. Learning Synergy (10%)
  const goalsOverlap = profile.learning_goals.filter((g) =>
    reqSkills.some(
      (r) =>
        normalize(g).includes(r) || r.includes(normalize(g))
    )
  );
  let learningSynergy: number;
  if (goalsOverlap.length >= 2) {
    learningSynergy = 95;
  } else if (goalsOverlap.length === 1) {
    learningSynergy = 80;
  } else if (profile.learning_goals.length > 0) {
    learningSynergy = 50;
  } else {
    learningSynergy = 30;
  }

  // 6. Project Interest/Type Match (10%)
  const interestOverlap = profile.desired_project_types?.filter((t) =>
    normalize(t).includes(normalize(project.category)) ||
    normalize(project.category).includes(normalize(t))
  ) || [];
  const interestMatch = interestOverlap.length > 0 ? 90 : 40;

  // Communication Fit (informational, not in weighted score)
  const communicationFit =
    profile.schedule_preference === 'Flexible'
      ? 95
      : profile.schedule_preference === 'Evenings'
        ? 85
        : 70;

  // Weighted overall calculation
  const overallScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        skillMatch * (MATCH_WEIGHTS.skill / 100) +
          roleMatch * (MATCH_WEIGHTS.role / 100) +
          availabilityMatch * (MATCH_WEIGHTS.availability / 100) +
          expMatch * (MATCH_WEIGHTS.experience / 100) +
          learningSynergy * (MATCH_WEIGHTS.learning / 100) +
          interestMatch * (MATCH_WEIGHTS.interest / 100)
      )
    )
  );

  const factors = [
    {
      name: 'Skill Compatibility',
      score: skillMatch,
      weight: MATCH_WEIGHTS.skill,
      description:
        matchedSkillCount > 0
          ? `Has ${matchedSkillCount} of ${reqSkills.length} required skills (${matchedSkillNames.slice(0, 3).join(', ')}).`
          : `No direct overlap with the ${reqSkills.length} required skills.`,
    },
    {
      name: 'Role Compatibility',
      score: roleMatch,
      weight: MATCH_WEIGHTS.role,
      description: directRoleMatch
        ? `Preferred role "${directRoleMatch}" matches a project requirement.`
        : `Preferred roles (${userRoles.slice(0, 2).join(', ')}) do not directly match required roles.`,
    },
    {
      name: 'Availability',
      score: availabilityMatch,
      weight: MATCH_WEIGHTS.availability,
      description: `Available ${profile.hours_per_week} hrs/week (project needs ${project.commitment_hours} hrs/week), ${profile.days_available.length} days/week.`,
    },
    {
      name: 'Experience',
      score: expMatch,
      weight: MATCH_WEIGHTS.experience,
      description: `${profile.experience_level} level (project prefers ${project.experience_preference}).`,
    },
    {
      name: 'Learning Goals',
      score: learningSynergy,
      weight: MATCH_WEIGHTS.learning,
      description:
        goalsOverlap.length > 0
          ? `Wants to learn ${goalsOverlap.join(', ')}, which aligns with project needs.`
          : profile.learning_goals.length > 0
            ? `Learning goals (${profile.learning_goals.slice(0, 2).join(', ')}) don't directly overlap with required skills.`
            : `No learning goals specified.`,
    },
    {
      name: 'Project Interest',
      score: interestMatch,
      weight: MATCH_WEIGHTS.interest,
      description:
        interestOverlap.length > 0
          ? `Interested in ${project.category} projects.`
          : `Project type (${project.category}) not listed in interests.`,
    },
  ];

  // Key Strengths — deterministic, based on actual data
  const keyStrengths: string[] = [];
  if (matchedSkillNames.length > 0) {
    keyStrengths.push(
      `Has ${matchedSkillNames.length} of ${reqSkills.length} required skills: ${matchedSkillNames.join(', ')}.`
    );
  }
  if (directRoleMatch) {
    keyStrengths.push(
      `Preferred role "${directRoleMatch}" matches project requirement.`
    );
  }
  if (profile.hours_per_week >= project.commitment_hours) {
    keyStrengths.push(
      `Available ${profile.hours_per_week} hrs/week (meets the ${project.commitment_hours} hrs/week requirement).`
    );
  }
  if (goalsOverlap.length > 0) {
    keyStrengths.push(
      `Wants to learn ${goalsOverlap.join(', ')}, complementing the project.`
    );
  }
  if (keyStrengths.length === 0) {
    keyStrengths.push(
      `${profile.experience_level} level with ${profile.skills.length} skills in their profile.`
    );
  }

  // Growth Areas / Weaknesses — deterministic, based on actual data
  const growthAreas: string[] = [];
  if (missingSkillNames.length > 0) {
    growthAreas.push(
      `Does not have ${missingSkillNames.slice(0, 3).join(', ')} experience.`
    );
  }
  if (profile.hours_per_week < project.commitment_hours) {
    growthAreas.push(
      `Only available ${profile.hours_per_week} hrs/week (project needs ${project.commitment_hours} hrs/week).`
    );
  }
  if (!directRoleMatch) {
    growthAreas.push(
      `Preferred roles don't directly match required roles.`
    );
  }
  if (growthAreas.length === 0) {
    growthAreas.push(`No significant gaps identified.`);
  }

  const primaryRole = profile.preferred_roles[0] || 'Contributor';
  const synergyReasoning = `${profile.full_name} scores ${overallScore}% compatibility for ${project.title} as ${primaryRole}. ${keyStrengths[0] || ''}`;

  return {
    overallScore,
    skillMatch,
    roleMatch,
    availabilityMatch,
    experienceMatch: expMatch,
    learningSynergy,
    communicationFit,
    factors,
    keyStrengths,
    growthAreas,
    synergyReasoning,
    isAiGenerated: false,
  };
}

/**
 * Skill Gap Detection with coverage percentages and candidate recommendations.
 * Coverage is calculated from actual team members and available profiles.
 */
export function detectSkillGaps(
  project: Project,
  allProfiles: UserProfile[]
): SkillGapItem[] {
  // Build a map of skills covered by existing team members
  const existingMemberSkills = new Map<string, string[]>();

  project.members.forEach((member) => {
    (member.profile?.skills || []).forEach((skill) => {
      const sLower = normalize(skill);
      const list = existingMemberSkills.get(sLower) || [];
      list.push(member.profile?.full_name || 'Team Member');
      existingMemberSkills.set(sLower, list);
    });
  });

  return project.required_skills.map((reqSkill) => {
    const sLower = normalize(reqSkill);

    // Check if directly covered by existing members
    const coveringEntries = Array.from(existingMemberSkills.entries()).filter(
      ([s]) => skillsMatch(s, sLower)
    );

    if (coveringEntries.length > 0) {
      const coveringMembers = Array.from(
        new Set(coveringEntries.flatMap(([, members]) => members))
      );
      return {
        skill: reqSkill,
        status: 'Covered' as const,
        coveragePercentage: 100,
        coveredBy: coveringMembers,
      };
    }

    // Find non-member candidates with this skill
    const memberIds = new Set(project.members.map((m) => m.user_id));
    const suitableCandidates = allProfiles
      .filter((p) => !memberIds.has(p.id))
      .filter((p) =>
        p.skills.some((s) => skillsMatch(s, reqSkill))
      )
      .map((p) => {
        const proficiency = p.skill_proficiencies?.[reqSkill] || 'Intermediate';
        const eff =
          proficiency === 'Expert' ? 95 : proficiency === 'Intermediate' ? 75 : 60;
        return {
          profile: p,
          gapFillEfficiency: eff,
          reason: `${p.full_name} (${p.preferred_roles[0] || 'Developer'}) has ${reqSkill} experience (${p.hours_per_week} hrs/week available).`,
        };
      })
      .slice(0, 3);

    if (suitableCandidates.length > 0) {
      // Partial: candidates exist but not on the team
      const avgEfficiency = Math.round(
        suitableCandidates.reduce((sum, c) => sum + c.gapFillEfficiency, 0) /
          suitableCandidates.length
      );
      return {
        skill: reqSkill,
        status: 'Partial' as const,
        coveragePercentage: Math.min(70, Math.round(avgEfficiency * 0.7)),
        suggestedCandidates: suitableCandidates,
      };
    }

    // Missing: no candidates available
    return {
      skill: reqSkill,
      status: 'Missing' as const,
      coveragePercentage: 0,
      suggestedCandidates: [],
    };
  });
}

/**
 * Calculate 5-Axis Team DNA from the members pool.
 * Based on actual team member data.
 */
export function calculateTeamDNA(members: UserProfile[]): TeamDNA {
  if (members.length === 0) {
    return {
      technical: 0,
      creative: 0,
      execution: 0,
      leadership: 0,
      learning: 0,
      dnaSummary: 'No team members yet. Add members to see Team DNA.',
    };
  }

  const technicalSkills = new Set([
    'react', 'python', 'ai/ml', 'go', 'c++', 'postgresql', 'pytorch',
    'node.js', 'typescript', 'fastapi', 'docker', 'redis', 'supabase',
    'graphql', 'next.js', 'langchain', 'computer vision', 'data science',
    'robotics', 'ros2', 'arduino/esp32',
  ]);
  const creativeSkills = new Set([
    'ui/ux', 'figma', 'design systems', 'prototyping', 'content strategy',
    'css animation',
  ]);
  const leadershipRoles = new Set([
    'Project Manager', 'Marketing/Growth', 'Domain Expert',
  ]);

  let technicalCount = 0;
  let creativeCount = 0;
  let executionCount = 0;
  let leadershipCount = 0;
  let learningCount = 0;

  members.forEach((m) => {
    if (m.skills.some((s) => technicalSkills.has(normalize(s)))) {
      technicalCount++;
    }
    if (
      m.skills.some((s) => creativeSkills.has(normalize(s))) ||
      m.preferred_roles.includes('UI/UX Designer')
    ) {
      creativeCount++;
    }
    if (m.experience_level === 'Advanced' || m.hours_per_week >= 15) {
      executionCount++;
    }
    if (m.preferred_roles.some((r) => leadershipRoles.has(r))) {
      leadershipCount++;
    }
    if (m.learning_goals && m.learning_goals.length >= 2) {
      learningCount++;
    }
  });

  const n = members.length;
  const technical = Math.min(100, Math.round((technicalCount / n) * 100));
  const creative = Math.min(100, Math.round((creativeCount / n) * 100));
  const execution = Math.min(100, Math.round((executionCount / n) * 100));
  const leadership = Math.min(100, Math.round((leadershipCount / n) * 100));
  const learning = Math.min(100, Math.round((learningCount / n) * 100));

  // Generate data-driven summary
  const strengths: string[] = [];
  const gaps: string[] = [];

  if (technical >= 75) strengths.push('strong technical execution');
  else if (technical < 40) gaps.push('limited technical depth');

  if (creative >= 50) strengths.push('solid creative/design capability');
  else gaps.push('no dedicated UI/UX designer');

  if (execution >= 75) strengths.push('high execution velocity');
  if (leadership >= 50) strengths.push('project leadership coverage');
  else gaps.push('no dedicated project manager');

  if (learning >= 50) strengths.push('strong learning orientation');

  let dnaSummary: string;
  if (strengths.length > 0 && gaps.length > 0) {
    dnaSummary = `Team has ${strengths.join(', ')}. Consider adding: ${gaps.join(', ')}.`;
  } else if (strengths.length > 0) {
    dnaSummary = `Well-balanced team with ${strengths.join(', ')}.`;
  } else {
    dnaSummary = `Team is still forming. Consider adding members with diverse skills.`;
  }

  return { technical, creative, execution, leadership, learning, dnaSummary };
}

/**
 * Recommended Team Generator with transparent selection reasoning.
 */
export async function generateRecommendedTeam(
  project: Project,
  availableProfiles: UserProfile[]
): Promise<DreamTeamResult> {
  const candidates = availableProfiles.filter(
    (p) => !project.members.some((m) => m.user_id === p.id)
  );
  const recommendedTeam: DreamTeamMember[] = [];
  const assignedRoles = new Set<RoleType>();
  const coveredSkills = new Set<string>();

  // Include existing members' contributions
  project.members.forEach((m) => {
    assignedRoles.add(m.role);
    m.profile.skills.forEach((s) => coveredSkills.add(normalize(s)));
  });

  // Assign best candidate for each unfulfilled role
  for (const role of project.required_roles) {
    if (assignedRoles.has(role) && project.members.length > 0) continue;

    let bestCandidate: UserProfile | null = null;
    let highestScore = -1;

    for (const candidate of candidates) {
      if (recommendedTeam.some((r) => r.profile.id === candidate.id)) continue;

      const match = calculateLocalMatch(project, candidate);
      let score = match.overallScore;

      // Bonus for matching the specific role
      if (candidate.preferred_roles.includes(role)) {
        score += 15;
      }

      // Bonus for bringing new required skills not yet covered
      const bringsNewSkills = candidate.skills.some(
        (s) =>
          project.required_skills.some(
            (req) => skillsMatch(s, req) && !coveredSkills.has(normalize(s))
          )
      );
      if (bringsNewSkills) {
        score += 10;
      }

      if (score > highestScore) {
        highestScore = score;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate) {
      const match = calculateLocalMatch(project, bestCandidate);
      const candidateSkills = bestCandidate.skills.filter((s) =>
        project.required_skills.some((req) => skillsMatch(s, req))
      );

      // Build deterministic selection reasons
      const reasons: string[] = [];
      if (bestCandidate.preferred_roles.includes(role)) {
        reasons.push(`Preferred role matches "${role}"`);
      }
      if (candidateSkills.length > 0) {
        reasons.push(`Has skills: ${candidateSkills.join(', ')}`);
      }
      reasons.push(`${bestCandidate.hours_per_week} hrs/week available`);

      recommendedTeam.push({
        profile: bestCandidate,
        assignedRole: role,
        matchScore: Math.min(100, Math.max(0, match.overallScore)),
        contributedSkills:
          candidateSkills.length > 0
            ? candidateSkills
            : bestCandidate.skills.slice(0, 3),
        selectionReason: reasons.join('. ') + '.',
      });

      assignedRoles.add(role);
      bestCandidate.skills.forEach((s) => coveredSkills.add(normalize(s)));
    }
  }

  // "Why not the others?" — transparent rejection reasoning
  const chosenIds = new Set(recommendedTeam.map((r) => r.profile.id));
  const rejectedCandidates: CandidateRejectionReason[] = candidates
    .filter((c) => !chosenIds.has(c.id))
    .slice(0, 3)
    .map((c) => {
      const match = calculateLocalMatch(project, c);
      const reasons: string[] = [];

      if (match.skillMatch < 50) {
        reasons.push(
          `Skill overlap is low (${match.skillMatch}% match with required skills)`
        );
      }
      if (c.hours_per_week < project.commitment_hours) {
        reasons.push(
          `Available ${c.hours_per_week} hrs/week (project needs ${project.commitment_hours} hrs/week)`
        );
      }
      if (!c.preferred_roles.some((r) => project.required_roles.includes(r))) {
        reasons.push(
          `Preferred roles (${c.preferred_roles.slice(0, 2).join(', ')}) don't match unfulfilled project roles`
        );
      }

      if (reasons.length === 0) {
        reasons.push(
          `Role was already filled by a candidate with higher overall compatibility`
        );
      }

      return { profile: c, reason: reasons.join('. ') + '.' };
    });

  // Calculate actual synergy scores
  const allTeamProfiles = [
    ...project.members.map((m) => m.profile),
    ...recommendedTeam.map((r) => r.profile),
  ];
  const totalRequired = project.required_skills.length;
  const totalCovered = project.required_skills.filter((r) =>
    coveredSkills.has(normalize(r))
  ).length;
  const skillCoverageScore = Math.min(
    100,
    Math.round((totalCovered / Math.max(1, totalRequired)) * 100)
  );

  // Actual availability synergy: average hours ratio
  const allHours = allTeamProfiles.map((p) => p.hours_per_week);
  const avgHoursRatio =
    allHours.length > 0
      ? allHours.reduce((s, h) => s + Math.min(1, h / Math.max(1, project.commitment_hours)), 0) /
        allHours.length
      : 0;
  const availabilitySynergyScore = Math.min(
    100,
    Math.round(avgHoursRatio * 100)
  );

  // Actual team balance: ratio of filled roles to required roles
  const filledRoles = project.required_roles.filter((r) => assignedRoles.has(r));
  const teamBalanceScore = Math.min(
    100,
    Math.round((filledRoles.length / Math.max(1, project.required_roles.length)) * 100)
  );

  const avgMatch =
    recommendedTeam.length > 0
      ? Math.round(
          recommendedTeam.reduce((acc, m) => acc + m.matchScore, 0) /
            recommendedTeam.length
        )
      : 0;

  const teamCompatibilityScore = Math.min(
    100,
    Math.round(avgMatch * 0.5 + skillCoverageScore * 0.3 + teamBalanceScore * 0.2)
  );

  const dna = calculateTeamDNA(allTeamProfiles);
  const uncoveredSkills = project.required_skills.filter(
    (r) => !coveredSkills.has(normalize(r))
  );

  // Data-driven strengths
  const strengths: string[] = [];
  if (skillCoverageScore >= 80) {
    strengths.push(
      `${skillCoverageScore}% skill coverage across required technologies.`
    );
  }
  if (teamBalanceScore >= 80) {
    strengths.push(
      `${filledRoles.length} of ${project.required_roles.length} required roles filled.`
    );
  }
  if (availabilitySynergyScore >= 80) {
    strengths.push(`Team members meet the weekly hour commitment.`);
  }
  if (strengths.length === 0) {
    strengths.push(`Team is forming — ${recommendedTeam.length} candidates recommended.`);
  }

  // Data-driven risks
  const potentialRisks: string[] = [];
  if (uncoveredSkills.length > 0) {
    potentialRisks.push(
      `Skills not yet covered: ${uncoveredSkills.join(', ')}.`
    );
  }
  if (teamBalanceScore < 80) {
    potentialRisks.push(
      `${project.required_roles.length - filledRoles.length} required roles still unfilled.`
    );
  }
  if (potentialRisks.length === 0) {
    potentialRisks.push(`No critical gaps identified.`);
  }

  return {
    teamCompatibilityScore,
    recommendedTeam,
    skillCoverageScore,
    availabilitySynergyScore,
    teamBalanceScore,
    overallSynergyReasoning: `Team provides ${skillCoverageScore}% skill coverage with ${filledRoles.length} of ${project.required_roles.length} roles filled. Average match score: ${avgMatch}%.`,
    strengths,
    potentialRisks,
    uncoveredSkills,
    rejectedCandidates,
    dna,
  };
}

/**
 * Project Readiness Evaluator — based on actual staffing and skill coverage.
 */
export function evaluateProjectReadiness(
  project: Project,
  allProfiles: UserProfile[]
): ProjectReadiness {
  const gaps = detectSkillGaps(project, allProfiles);
  const coveredCount = gaps.filter((g) => g.status === 'Covered').length;
  const skillCoverage = Math.round(
    (coveredCount / Math.max(1, gaps.length)) * 100
  );

  const roleStaffing = Math.round(
    (project.members.length / Math.max(1, project.members_needed)) * 100
  );
  const readinessScore = Math.min(
    100,
    Math.round(skillCoverage * 0.6 + roleStaffing * 0.4)
  );

  let difficultyEstimate: ProjectReadiness['difficultyEstimate'] =
    'Moderate Sprint';
  if (
    project.required_skills.some((s) =>
      ['AI/ML', 'PyTorch', 'ROS2', 'Go', 'Robotics'].includes(s)
    )
  ) {
    difficultyEstimate = 'High Technical Complexity';
  } else if (project.required_skills.length <= 3) {
    difficultyEstimate = 'Beginner Friendly';
  }

  const unfilledRoles = project.required_roles.filter(
    (r) => !project.members.some((m) => m.role === r)
  );

  const readinessAdvice =
    readinessScore >= 75
      ? 'Team has solid skill coverage to begin working. Focus on defining milestones and task assignments.'
      : 'Consider recruiting more teammates to close skill and role gaps before starting.';

  return {
    readinessScore,
    skillCoverage,
    roleStaffing,
    difficultyEstimate,
    recommendedInitialRoles:
      unfilledRoles.length > 0 ? unfilledRoles : project.required_roles,
    readinessAdvice,
  };
}

/**
 * Filter profiles by search and filter criteria.
 * Pure function for testability.
 */
export function filterProfiles(
  profiles: UserProfile[],
  filters: {
    searchQuery?: string;
    role?: string;
    skill?: string;
    experience?: string;
    schedule?: string;
  }
): UserProfile[] {
  return profiles.filter((p) => {
    const q = (filters.searchQuery || '').toLowerCase();

    const matchesSearch =
      !q ||
      p.full_name.toLowerCase().includes(q) ||
      p.college.toLowerCase().includes(q) ||
      p.course.toLowerCase().includes(q) ||
      p.skills.some((s) => s.toLowerCase().includes(q)) ||
      p.preferred_roles.some((r) => r.toLowerCase().includes(q));

    const matchesRole =
      !filters.role ||
      filters.role === 'All' ||
      p.preferred_roles.includes(filters.role as RoleType);

    const matchesSkill =
      !filters.skill ||
      filters.skill === 'All' ||
      p.skills.some((s) => normalize(s) === normalize(filters.skill!));

    const matchesExp =
      !filters.experience ||
      filters.experience === 'All' ||
      p.experience_level === filters.experience;

    const matchesSchedule =
      !filters.schedule ||
      filters.schedule === 'All' ||
      p.schedule_preference === filters.schedule;

    return (
      matchesSearch && matchesRole && matchesSkill && matchesExp && matchesSchedule
    );
  });
}
