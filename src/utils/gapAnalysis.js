/**
 * Team Gap & Readiness Intelligence Engine
 * Evaluates:
 * - Essential capability coverage
 * - Evidence quality (claimed vs. practically demonstrated/reviewed)
 * - Single-person dependencies (bus factor)
 * - Workload distribution & availability feasibility
 */

import { getSkillCategory } from './format.js';
import { calculateMatch } from './matching.js';

/**
 * Performs complete team gap and readiness analysis
 * @param {string[]} requiredSkills - List of project required skills
 * @param {Array} members - Current team members with their skills
 * @param {Array} allStudents - Pool of students for gap resolution matching
 * @param {Array} skillEvidences - Skill evidence records for evidence-based verification
 * @returns {Object} Gap analysis & Readiness result
 */
export function analyzeTeamGaps(
  requiredSkills = [],
  members = [],
  allStudents = [],
  skillEvidences = []
) {
  const teamSkillsSet = new Set();
  const verifiedSkillsSet = new Set();
  const currentMemberIds = new Set(members.map((m) => m.id));

  // Tally capability occurrences across members to detect single-person dependencies
  const skillMemberCount = {};

  members.forEach((member) => {
    (member.skills || []).forEach((skill) => {
      const lower = skill.toLowerCase();
      teamSkillsSet.add(lower);
      skillMemberCount[lower] = (skillMemberCount[lower] || 0) + 1;

      // Check if this member has recorded practical demonstration or faculty review
      const hasEvidence = skillEvidences.some(
        (ev) =>
          ev.studentId === member.id &&
          ev.skill?.toLowerCase() === lower &&
          (ev.status === 'PRACTICALLY_DEMONSTRATED' || ev.status === 'INDEPENDENTLY_REVIEWED')
      );
      if (hasEvidence) {
        verifiedSkillsSet.add(lower);
      }
    });
  });

  const coveredSkills = [];
  const weaklyCoveredSkills = []; // Claimed only, no verified evidence
  const robustlyCoveredSkills = []; // Has verified evidence or multiple contributors
  const missingSkills = [];
  const singlePointSkills = [];

  requiredSkills.forEach((req) => {
    const lower = req.toLowerCase();
    const count = skillMemberCount[lower] || 0;
    const isVerified = verifiedSkillsSet.has(lower);

    if (count > 0) {
      coveredSkills.push(req);
      if (count === 1) {
        singlePointSkills.push(req);
      }
      if (isVerified || count > 1) {
        robustlyCoveredSkills.push(req);
      } else {
        weaklyCoveredSkills.push(req);
      }
    } else {
      missingSkills.push(req);
    }
  });

  const totalCount = requiredSkills.length;
  const coveredCount = coveredSkills.length;
  const coveragePercentage = totalCount > 0 ? Math.round((coveredCount / totalCount) * 100) : 100;

  // READINESS INDEX CALCULATION
  // 1. Coverage Ratio (40% weight)
  const coverageRatio = totalCount > 0 ? coveredCount / totalCount : 1.0;

  // 2. Evidence Quality Ratio (25% weight)
  const evidenceRatio = coveredCount > 0 ? robustlyCoveredSkills.length / coveredCount : 0.5;

  // 3. Redundancy / Single-Point Penalty (20% weight)
  const singlePointPenalty = coveredCount > 0 ? (singlePointSkills.length / coveredCount) * 0.3 : 0;
  const redundancyScore = Math.max(0, 1.0 - singlePointPenalty);

  // 4. Team Sizing & Availability (15% weight)
  const teamSizeFeasibility = members.length >= 2 ? (members.length >= 3 ? 1.0 : 0.85) : 0.5;

  const rawReadiness =
    coverageRatio * 0.40 +
    evidenceRatio * 0.25 +
    redundancyScore * 0.20 +
    teamSizeFeasibility * 0.15;

  const readinessIndex = Math.min(98, Math.max(25, Math.round(rawReadiness * 100)));

  // Readiness classification
  let readinessState = 'On Track';
  if (readinessIndex >= 85) readinessState = 'Sprint Ready (High Confidence)';
  else if (readinessIndex >= 70) readinessState = 'Viable with Mentorship (Moderate Confidence)';
  else if (readinessIndex >= 50) readinessState = 'Capability Gaps Detected';
  else readinessState = 'High Delivery Risk';

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

  // Recommendations for missing skills
  const recommendationsBySkill = {};
  missingSkills.forEach((missingSkill) => {
    const eligibleCandidates = allStudents
      .filter((s) => !currentMemberIds.has(s.id))
      .filter((s) =>
        (s.skills || []).some((sk) => sk.toLowerCase() === missingSkill.toLowerCase())
      )
      .map((student) => {
        const matchData = calculateMatch(
          student,
          { requiredSkills: [missingSkill, ...requiredSkills] },
          skillEvidences
        );
        return {
          student,
          skill: missingSkill,
          matchScore: matchData.score,
          subScores: matchData.subScores,
          reason: matchData.reason,
          limitations: matchData.limitations,
          verifiedSkills: matchData.verifiedSkills,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    recommendationsBySkill[missingSkill] = eligibleCandidates;
  });

  return {
    requirements: requiredSkills,
    teamSkills: Array.from(teamSkillsSet),
    coveredSkills,
    weaklyCoveredSkills,
    robustlyCoveredSkills,
    missingSkills,
    singlePointSkills,
    coveredCount,
    totalCount,
    coverageRatio,
    coveragePercentage,
    readinessIndex,
    readinessState,
    categoryCoverage,
    recommendationsBySkill,
    isFullCoverage: missingSkills.length === 0,
  };
}

export function calculateReadinessIndex(members, requiredSkills, skillEvidences = []) {
  const result = analyzeTeamGaps(requiredSkills, members, [], skillEvidences);
  return {
    overallScore: result.readinessIndex,
    coverageRatio: result.coverageRatio,
    missingSkills: result.missingSkills,
    readinessState: result.readinessState,
  };
}

export const analyzeCapabilityCoverage = analyzeTeamGaps;
