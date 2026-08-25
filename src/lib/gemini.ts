import { 
  UserProfile, 
  Project, 
  AIMatchAnalysis
} from '../types';
import {
  calculateLocalMatch as calcLocalMatch,
  detectSkillGaps as detSkillGaps,
  calculateTeamDNA as calcTeamDNA,
  generateRecommendedTeam,
  evaluateProjectReadiness as evalProjectReadiness
} from './matching';

export const calculateLocalMatch = calcLocalMatch;
export const detectSkillGaps = detSkillGaps;
export const calculateTeamDNA = calcTeamDNA;
export const generateAIDreamTeam = generateRecommendedTeam;
export const evaluateProjectReadiness = evalProjectReadiness;

/**
 * Candidate Match Evaluator (Uses local deterministic matching)
 */
export async function evaluateCandidateMatch(project: Project, profile: UserProfile): Promise<AIMatchAnalysis> {
  return calculateLocalMatch(project, profile);
}
