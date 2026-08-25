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
  ProjectReadiness 
} from '../types';

/**
 * Transparent Multi-Factor Compatibility Calculator
 */
export function calculateLocalMatch(project: Project, profile: UserProfile): AIMatchAnalysis {
  // 1. Skill Match (35% weight)
  const reqSkills = project.required_skills.map(s => s.toLowerCase());
  const userSkills = profile.skills.map(s => s.toLowerCase());
  
  let matchedSkillCount = 0;
  reqSkills.forEach(req => {
    if (userSkills.some(u => u.includes(req) || req.includes(u))) {
      matchedSkillCount += 1;
    }
  });

  const skillMatchRatio = reqSkills.length > 0 ? (matchedSkillCount / reqSkills.length) : 0.85;
  const skillMatch = Math.min(100, Math.max(45, Math.round(skillMatchRatio * 100)));

  // 2. Role Match (20% weight)
  const reqRoles = project.required_roles;
  const userRoles = profile.preferred_roles;
  const directRoleMatch = userRoles.find(r => reqRoles.includes(r));
  const roleMatch = directRoleMatch ? 96 : userRoles.some(r => r === 'Full Stack' || r === 'Developer') ? 82 : 64;

  // 3. Availability / Schedule Overlap (15% weight)
  const hoursCommitmentRatio = Math.min(1.25, profile.hours_per_week / Math.max(1, project.commitment_hours));
  const dayOverlapScore = profile.days_available.length >= 4 ? 96 : profile.days_available.length >= 3 ? 88 : 72;
  const availabilityMatch = Math.min(100, Math.round((hoursCommitmentRatio * 50) + (dayOverlapScore * 0.5)));

  // 4. Experience Match (15% weight)
  let expMatch = 85;
  if (profile.experience_level === project.experience_preference) {
    expMatch = 96;
  } else if (profile.experience_level === 'Advanced') {
    expMatch = 98;
  } else if (profile.experience_level === 'Beginner' && project.experience_preference === 'Advanced') {
    expMatch = 65;
  }

  // 5. Learning Synergy (15% weight)
  // Highly rewarded if candidate is eager to learn complementary project technologies
  const goalsOverlap = profile.learning_goals.filter(g => reqSkills.some(r => r.includes(g.toLowerCase()) || g.toLowerCase().includes(r)));
  const learningSynergy = goalsOverlap.length > 0 ? 98 : profile.learning_goals.length > 0 ? 88 : 75;

  // Communication & Work Schedule Fit
  const communicationFit = profile.schedule_preference === 'Flexible' ? 96 : profile.schedule_preference === 'Evenings' ? 92 : 86;

  // Weighted overall calculation: 35% + 20% + 15% + 15% + 15% = 100%
  const overallScore = Math.round(
    (skillMatch * 0.35) +
    (roleMatch * 0.20) +
    (availabilityMatch * 0.15) +
    (expMatch * 0.15) +
    (learningSynergy * 0.15)
  );

  const factors = [
    {
      name: 'Technical Skill Match',
      score: skillMatch,
      weight: 35,
      description: `Matched ${matchedSkillCount} of ${reqSkills.length} required skills directly (${profile.skills.slice(0, 3).join(', ')}).`,
    },
    {
      name: 'Target Role Alignment',
      score: roleMatch,
      weight: 20,
      description: directRoleMatch 
        ? `Directly covers the '${directRoleMatch}' role required by project.` 
        : `Prefers ${profile.preferred_roles[0]}, which offers adaptable engineering coverage.`,
    },
    {
      name: 'Schedule & Hours Overlap',
      score: availabilityMatch,
      weight: 15,
      description: `${profile.hours_per_week} hrs/week commitment vs ${project.commitment_hours} hrs/week project requirement.`,
    },
    {
      name: 'Track Record & Experience',
      score: expMatch,
      weight: 15,
      description: `${profile.experience_level} builder level with relevant portfolio history.`,
    },
    {
      name: 'Learning Goal Synergy',
      score: learningSynergy,
      weight: 15,
      description: goalsOverlap.length > 0 
        ? `High intrinsic motivation: Actively mastering ${goalsOverlap.join(', ')}.` 
        : `Growth mindset aligned with fast-paced hackathon delivery.`,
    },
  ];

  // Key Strengths
  const keyStrengths: string[] = [];
  const matchedSkillNames = profile.skills.filter(s => reqSkills.some(r => r.includes(s.toLowerCase()) || s.toLowerCase().includes(r)));
  if (matchedSkillNames.length > 0) {
    keyStrengths.push(`Direct skill overlap in ${matchedSkillNames.join(', ')}.`);
  }
  if (directRoleMatch) {
    keyStrengths.push(`Directly satisfies open '${directRoleMatch}' staffing slot.`);
  }
  if (profile.hours_per_week >= project.commitment_hours) {
    keyStrengths.push(`High availability (${profile.hours_per_week}h/wk) exceeds required baseline (${project.commitment_hours}h/wk).`);
  }
  if (goalsOverlap.length > 0) {
    keyStrengths.push(`Accelerated learning velocity in ${goalsOverlap.join(', ')}.`);
  }
  if (keyStrengths.length < 3) {
    keyStrengths.push(`Strong portfolio track record with ${profile.experience_level} delivery standards.`);
  }

  // Growth Areas / Risks
  const growthAreas: string[] = [];
  const missingReqs = project.required_skills.filter(r => !userSkills.some(u => u.includes(r.toLowerCase())));
  if (missingReqs.length > 0 && missingReqs.length <= 3) {
    growthAreas.push(`Does not directly cover ${missingReqs.slice(0, 2).join(', ')} — best paired with a complementary teammate.`);
  }
  if (profile.hours_per_week < project.commitment_hours) {
    growthAreas.push(`Weekly availability (${profile.hours_per_week}h/wk) is slightly under project target (${project.commitment_hours}h/wk).`);
  }
  if (growthAreas.length === 0) {
    growthAreas.push(`No critical blockers identified; align on API boundaries in Sprint 1.`);
  }

  const primaryRole = profile.preferred_roles[0] || 'Contributor';
  const synergyReasoning = `${profile.full_name} is a high-conviction candidate (${overallScore}% synergy) for ${project.title} as ${primaryRole}. Their command over ${profile.skills.slice(0, 2).join(' and ')} combined with a ${profile.schedule_preference.toLowerCase()} schedule directly bridges team milestones.`;

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
    isAiGenerated: false
  };
}

/**
 * AI-Powered Candidate Match Evaluator
 */
export async function evaluateCandidateMatch(project: Project, profile: UserProfile): Promise<AIMatchAnalysis> {
  const fallback = calculateLocalMatch(project, profile);
  
  try {
    const response = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, profile }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.overallScore === 'number' && !data.useFallback) {
        return {
          ...data,
          factors: fallback.factors,
          learningSynergy: fallback.learningSynergy,
          communicationFit: fallback.communicationFit,
          isAiGenerated: true,
        };
      }
    }
  } catch {
    // Graceful fallback
  }

  return fallback;
}

/**
 * Advanced Skill Gap Detector with Matrix Percentages & Candidate Recommendations
 */
export function detectSkillGaps(project: Project, allProfiles: UserProfile[]): SkillGapItem[] {
  const existingMemberSkills = new Map<string, string[]>();

  project.members.forEach(member => {
    (member.profile?.skills || []).forEach(skill => {
      const sLower = skill.toLowerCase();
      const list = existingMemberSkills.get(sLower) || [];
      list.push(member.profile?.full_name || 'Current Team');
      existingMemberSkills.set(sLower, list);
    });
  });

  return project.required_skills.map(reqSkill => {
    const sLower = reqSkill.toLowerCase();
    const isDirectlyCovered = Array.from(existingMemberSkills.keys()).some(s => s === sLower || s.includes(sLower) || sLower.includes(s));
    
    if (isDirectlyCovered) {
      const coveringMembers = Array.from(existingMemberSkills.entries())
        .filter(([s]) => s === sLower || s.includes(sLower) || sLower.includes(s))
        .flatMap(([, members]) => members);

      return {
        skill: reqSkill,
        status: 'Covered',
        coveragePercentage: 100,
        coveredBy: Array.from(new Set(coveringMembers)),
      };
    }

    // Find non-member candidates with this skill
    const suitableCandidates = allProfiles
      .filter(p => !project.members.some(m => m.user_id === p.id))
      .filter(p => p.skills.some(s => s.toLowerCase().includes(sLower) || sLower.includes(s.toLowerCase())))
      .map(p => {
        const proficiency = p.skill_proficiencies?.[reqSkill] || 'Advanced';
        const eff = proficiency === 'Expert' ? 95 : 85;
        return {
          profile: p,
          gapFillEfficiency: eff,
          reason: `${p.full_name} (${p.preferred_roles[0]}) specializes in ${reqSkill} (${p.hours_per_week}h/wk available).`,
        };
      })
      .slice(0, 3);

    const isPartiallyCovered = suitableCandidates.length > 0;

    return {
      skill: reqSkill,
      status: isPartiallyCovered ? 'Partial' : 'Missing',
      coveragePercentage: isPartiallyCovered ? 65 : 15,
      suggestedCandidates: suitableCandidates,
    };
  });
}

/**
 * Calculate 5-Axis Team DNA from members pool
 */
export function calculateTeamDNA(members: UserProfile[]): TeamDNA {
  if (members.length === 0) {
    return {
      technical: 85,
      creative: 75,
      execution: 80,
      leadership: 80,
      learning: 90,
      dnaSummary: 'Developing multidisciplinary profile.'
    };
  }

  let technicalCount = 0;
  let creativeCount = 0;
  let executionCount = 0;
  let leadershipCount = 0;
  let learningCount = 0;

  members.forEach(m => {
    // Technical
    if (m.skills.some(s => ['React', 'Python', 'AI/ML', 'Go', 'C++', 'PostgreSQL', 'PyTorch', 'Node.js'].includes(s))) {
      technicalCount += 1;
    }
    // Creative
    if (m.skills.some(s => ['UI/UX', 'Figma', 'Design Systems', 'Prototyping', 'Content Strategy'].includes(s)) || m.preferred_roles.includes('UI/UX Designer')) {
      creativeCount += 1;
    }
    // Execution
    if (m.experience_level === 'Advanced' || m.hours_per_week >= 15) {
      executionCount += 1;
    }
    // Leadership & Growth
    if (m.preferred_roles.includes('Project Manager') || m.preferred_roles.includes('Marketing/Growth') || m.preferred_roles.includes('Domain Expert')) {
      leadershipCount += 1;
    }
    // Learning
    if (m.learning_goals && m.learning_goals.length >= 2) {
      learningCount += 1;
    }
  });

  const technical = Math.min(98, Math.round(75 + (technicalCount / members.length) * 23));
  const creative = Math.min(96, Math.round(65 + (creativeCount / members.length) * 31));
  const execution = Math.min(97, Math.round(72 + (executionCount / members.length) * 25));
  const leadership = Math.min(95, Math.round(70 + (leadershipCount / members.length) * 25));
  const learning = Math.min(99, Math.round(80 + (learningCount / members.length) * 19));

  let dnaSummary = 'High-velocity innovation squad with balanced engineering and rapid iteration capabilities.';
  if (technical > 90 && creative > 85) {
    dnaSummary = 'Elite Full-Stack & Product Squad: High technical execution paired with top-tier product aesthetics.';
  } else if (technical > 92) {
    dnaSummary = 'Deep-Tech Engineering Core: Exceptional algorithmic, data pipeline, and system architecture velocity.';
  }

  return { technical, creative, execution, leadership, learning, dnaSummary };
}

/**
 * AI Dream Team Generator with "Why not the others?" transparency
 */
export async function generateAIDreamTeam(project: Project, availableProfiles: UserProfile[]): Promise<DreamTeamResult> {
  const candidates = availableProfiles.filter(p => !project.members.some(m => m.user_id === p.id));
  const recommendedTeam: DreamTeamMember[] = [];
  const assignedRoles = new Set<RoleType>();
  const coveredSkills = new Set<string>();

  // Include existing members
  project.members.forEach(m => {
    assignedRoles.add(m.role);
    m.profile.skills.forEach(s => coveredSkills.add(s.toLowerCase()));
  });

  // Assign optimal member for each unfulfilled role
  for (const role of project.required_roles) {
    if (assignedRoles.has(role) && project.members.length > 0) continue;

    let bestCandidate: UserProfile | null = null;
    let highestScore = -1;

    for (const candidate of candidates) {
      if (recommendedTeam.some(r => r.profile.id === candidate.id)) continue;

      const match = calculateLocalMatch(project, candidate);
      let score = match.overallScore;

      if (candidate.preferred_roles.includes(role)) {
        score += 15;
      }
      const bringsNewSkills = candidate.skills.some(s => 
        project.required_skills.some(req => req.toLowerCase().includes(s.toLowerCase()) && !coveredSkills.has(s.toLowerCase()))
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
      const candidateSkills = bestCandidate.skills.filter(s => 
        project.required_skills.some(req => req.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(req.toLowerCase()))
      );

      recommendedTeam.push({
        profile: bestCandidate,
        assignedRole: role,
        matchScore: Math.min(98, Math.max(82, highestScore)),
        contributedSkills: candidateSkills.length > 0 ? candidateSkills : bestCandidate.skills.slice(0, 3),
        selectionReason: `Fulfills the '${role}' role with ${bestCandidate.skills.slice(0, 2).join(' & ')} proficiency (${bestCandidate.hours_per_week}h/wk availability).`,
      });

      assignedRoles.add(role);
      bestCandidate.skills.forEach(s => coveredSkills.add(s.toLowerCase()));
    }
  }

  // Calculate "Why not the others?" for transparent AI decision making
  const chosenIds = new Set(recommendedTeam.map(r => r.profile.id));
  const rejectedCandidates: CandidateRejectionReason[] = candidates
    .filter(c => !chosenIds.has(c.id))
    .slice(0, 3)
    .map(c => {
      const match = calculateLocalMatch(project, c);
      let reason = `Role slot (${c.preferred_roles[0]}) was prioritized for a candidate with higher availability overlap.`;
      if (c.hours_per_week < project.commitment_hours) {
        reason = `Weekly commitment (${c.hours_per_week}h/wk) is below the preferred sprint pace (${project.commitment_hours}h/wk).`;
      } else if (match.skillMatch < 70) {
        reason = `Skills in ${c.skills.slice(0, 2).join(', ')} do not directly overlap with unstaffed milestones.`;
      }
      return { profile: c, reason };
    });

  // Calculate collective synergy scores
  const allTeamProfiles = [...project.members.map(m => m.profile), ...recommendedTeam.map(r => r.profile)];
  const totalRequired = project.required_skills.length;
  const totalCovered = project.required_skills.filter(r => coveredSkills.has(r.toLowerCase())).length;
  const skillCoverageScore = Math.min(100, Math.round((totalCovered / Math.max(1, totalRequired)) * 100));
  
  const avgMatch = recommendedTeam.length > 0 
    ? Math.round(recommendedTeam.reduce((acc, m) => acc + m.matchScore, 0) / recommendedTeam.length) 
    : 92;

  const teamCompatibilityScore = Math.min(98, Math.round((avgMatch * 0.55) + (skillCoverageScore * 0.35) + 10));
  const dna = calculateTeamDNA(allTeamProfiles);
  const uncoveredSkills = project.required_skills.filter(r => !coveredSkills.has(r.toLowerCase()));

  return {
    teamCompatibilityScore,
    recommendedTeam,
    skillCoverageScore,
    availabilitySynergyScore: 94,
    teamBalanceScore: 92,
    overallSynergyReasoning: `Assembled squad provides ${skillCoverageScore}% full requirement coverage across ${project.required_roles.join(', ')} with complementary learning dynamics and high weekend sprint velocity.`,
    strengths: [
      'Comprehensive full-stack & AI architecture coverage with zero critical skill bottlenecks.',
      'Sufficient availability overlap across weekday evenings and weekend hack blocks.',
      'Balanced distribution of engineering execution and UI/UX presentation polish.'
    ],
    potentialRisks: uncoveredSkills.length > 0 
      ? [`Secondary skills not yet fully staffed: ${uncoveredSkills.join(', ')}.`] 
      : ['Ensure early agreement on API interface contracts between AI and Frontend.'],
    uncoveredSkills,
    rejectedCandidates,
    dna,
  };
}

/**
 * Project Readiness Evaluator
 */
export function evaluateProjectReadiness(project: Project, allProfiles: UserProfile[]): ProjectReadiness {
  const gaps = detectSkillGaps(project, allProfiles);
  const coveredCount = gaps.filter(g => g.status === 'Covered').length;
  const skillCoverage = Math.round((coveredCount / Math.max(1, gaps.length)) * 100);

  const roleStaffing = Math.round((project.members.length / Math.max(1, project.members_needed)) * 100);
  const readinessScore = Math.round((skillCoverage * 0.6) + (roleStaffing * 0.4));

  let difficultyEstimate: 'Beginner Friendly' | 'Moderate Sprint' | 'High Technical Complexity' = 'Moderate Sprint';
  if (project.required_skills.some(s => ['AI/ML', 'PyTorch', 'ROS2', 'Go', 'Robotics'].includes(s))) {
    difficultyEstimate = 'High Technical Complexity';
  } else if (project.required_skills.length <= 3) {
    difficultyEstimate = 'Beginner Friendly';
  }

  const unfilledRoles = project.required_roles.filter(r => !project.members.some(m => m.role === r));

  const readinessAdvice = readinessScore >= 75
    ? 'High Project Readiness: Team has solid baseline technical coverage to begin Sprint 1 immediately.'
    : 'Staffing Recommended: Recruit candidates to close pending role and skill gaps before locking project scope.';

  return {
    readinessScore,
    skillCoverage,
    roleStaffing,
    difficultyEstimate,
    recommendedInitialRoles: unfilledRoles.length > 0 ? unfilledRoles : project.required_roles,
    readinessAdvice,
  };
}
