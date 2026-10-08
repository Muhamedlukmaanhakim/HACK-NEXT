/**
 * Matching Service Layer
 * Computes multi-factor student compatibility for projects.
 * Future endpoint: Supabase RPC or PostgreSQL pgvector function `supabase.rpc('match_students', { opportunity_id })`
 */

import { getStudents } from './studentService';
import { getOpportunityById } from './opportunityService';
import { calculateMatch } from '../utils/matching';

const LATENCY_MS = 450;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Returns ranked student candidates for a specific opportunity
 * @param {string} opportunityId
 * @param {string} [sortBy='best'] - 'best' | 'skill' | 'availability' | 'experience'
 * @returns {Promise<Array>}
 */
export async function getMatches(opportunityId, sortBy = 'best') {
  await delay();

  const [opportunity, allStudents] = await Promise.all([
    getOpportunityById(opportunityId),
    getStudents(),
  ]);

  const targetOpp = opportunity || {
    id: opportunityId || 'opp-1',
    title: 'AI Healthcare Assistant',
    requiredSkills: ['UI/UX', 'Presentation', 'Public Speaking'],
    interests: ['Healthcare & MedTech', 'AI & Machine Learning'],
    availability: ['Weekends'],
    currentMembers: [{ id: 'student-1', name: 'Lukmaan Hakim' }],
  };

  const currentMemberIds = new Set(
    (targetOpp.currentMembers || []).map((m) => m.id)
  );

  // Filter out students already on the team
  const candidates = allStudents.filter((s) => !currentMemberIds.has(s.id));

  // Calculate scores
  const scoredList = candidates.map((student) => {
    const match = calculateMatch(student, targetOpp);
    return {
      student,
      score: match.score,
      subScores: match.subScores,
      matchedSkills: match.matchedSkills,
      reason: match.reason,
    };
  });

  // Sort based on requested dimension
  scoredList.sort((a, b) => {
    if (sortBy === 'skill') {
      return (b.subScores.skill || 0) - (a.subScores.skill || 0);
    }
    if (sortBy === 'availability') {
      return (b.subScores.availability || 0) - (a.subScores.availability || 0);
    }
    if (sortBy === 'experience') {
      return (b.subScores.experience || 0) - (a.subScores.experience || 0);
    }
    return b.score - a.score;
  });

  return scoredList;
}
