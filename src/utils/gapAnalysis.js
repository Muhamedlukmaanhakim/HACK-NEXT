/**
 * Team Gap Analysis logic
 * Derives coverage dynamically from current members vs. project requirements
 */

import { getSkillCategory } from './format.js';
import { calculateMatch } from './matching.js';

/**
 * Performs complete skill gap analysis for a team
 * @param {string[]} requiredSkills - List of project required skills
 * @param {Array} members - Current team members with their skills
 * @param {Array} allStudents - Full student pool for recommendation matching
 * @returns {Object} Gap analysis result
 */
export function analyzeTeamGaps(requiredSkills = [], members = [], allStudents = []) {
  // Aggregate all skills from current team members
  const teamSkillsSet = new Set();
  const currentMemberIds = new Set(members.map((m) => m.id));

  members.forEach((member) => {
    (member.skills || []).forEach((skill) => {
      teamSkillsSet.add(skill.toLowerCase());
    });
  });

  const coveredSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((req) => {
    if (teamSkillsSet.has(req.toLowerCase())) {
      coveredSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const totalCount = requiredSkills.length;
  const coveredCount = coveredSkills.length;
  const coveragePercentage = totalCount > 0 ? Math.round((coveredCount / totalCount) * 100) : 100;

  // Category coverage breakdown
  const categoryStats = {
    Technical: { total: 0, covered: 0 },
    Creative: { total: 0, covered: 0 },
    Communication: { total: 0, covered: 0 },
    Business: { total: 0, covered: 0 },
    Research: { total: 0, covered: 0 },
  };

  requiredSkills.forEach((req) => {
    const cat = getSkillCategory(req);
    if (categoryStats[cat]) {
      categoryStats[cat].total += 1;
      if (teamSkillsSet.has(req.toLowerCase())) {
        categoryStats[cat].covered += 1;
      }
    }
  });

  const categoryCoverage = {};
  Object.keys(categoryStats).forEach((cat) => {
    const { total, covered } = categoryStats[cat];
    categoryCoverage[cat] = total > 0 ? Math.round((covered / total) * 100) : (covered > 0 ? 100 : 70);
  });

  // Find candidate recommendations for missing skills
  // RULE: NEVER recommend someone who is already on the team!
  const recommendationsBySkill = {};

  missingSkills.forEach((missingSkill) => {
    const eligibleCandidates = allStudents
      .filter((s) => !currentMemberIds.has(s.id))
      .filter((s) =>
        (s.skills || []).some((sk) => sk.toLowerCase() === missingSkill.toLowerCase())
      )
      .map((student) => {
        const matchData = calculateMatch(student, { requiredSkills: [missingSkill, ...requiredSkills] });
        return {
          student,
          skill: missingSkill,
          matchScore: matchData.score,
          subScores: matchData.subScores,
          reason: matchData.reason,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    recommendationsBySkill[missingSkill] = eligibleCandidates;
  });

  return {
    requirements: requiredSkills,
    teamSkills: Array.from(teamSkillsSet),
    coveredSkills,
    missingSkills,
    coveredCount,
    totalCount,
    coveragePercentage,
    categoryCoverage,
    recommendationsBySkill,
    isFullCoverage: missingSkills.length === 0,
  };
}
