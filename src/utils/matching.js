/**
 * Multi-factor matching algorithm and deterministic demo overrides
 * Formula weights:
 * - Skills: 50%
 * - Interests: 20%
 * - Availability: 15%
 * - Experience / Proficiency: 15%
 */

// Stable demo overrides map for exact §6 narrative numbers
const DEMO_OVERRIDES = {
  'student-2': {
    // Sarah Rahman
    score: 94,
    subScores: { skill: 96, interest: 92, availability: 95, experience: 90 },
    reason: 'Exceptional UI/UX and presentation alignment with active weekend sprint availability.',
  },
  'student-3': {
    // Rahul Kumar
    score: 91,
    subScores: { skill: 94, interest: 88, availability: 90, experience: 92 },
    reason: 'Deep backend and API systems engineering capability with direct AI pipeline experience.',
  },
  'student-4': {
    // Aisha
    score: 89,
    subScores: { skill: 88, interest: 90, availability: 90, experience: 88 },
    reason: 'Strong brand messaging, social launch strategy, and pitch deck narrative expertise.',
  },
  'student-5': {
    // Arjun
    score: 84,
    subScores: { skill: 86, interest: 82, availability: 85, experience: 80 },
    reason: 'Solid React frontend architecture skills and responsive web design foundations.',
  },
  'student-6': {
    // Meera Nair
    score: 88,
    subScores: { skill: 92, interest: 85, availability: 85, experience: 90 },
    reason: 'Proven stage orator with debate accolades; ideal for hackathon final jury presentations.',
  },
};

/**
 * Calculates match between a student and opportunity requirements
 * @param {Object} student
 * @param {Object} opportunityOrRequirements
 * @returns {{ score: number, subScores: Object, matchedSkills: string[], reason: string }}
 */
export function calculateMatch(student, opportunityOrRequirements = {}) {
  if (!student) {
    return {
      score: 50,
      subScores: { skill: 50, interest: 50, availability: 50, experience: 50 },
      matchedSkills: [],
      reason: 'General peer match.',
    };
  }

  // Check demo override first for exact stable numbers
  if (DEMO_OVERRIDES[student.id]) {
    const override = DEMO_OVERRIDES[student.id];
    const targetSkills =
      opportunityOrRequirements.requiredSkills || [
        'UI/UX',
        'Presentation',
        'Public Speaking',
      ];
    const matched = (student.skills || []).filter((s) =>
      targetSkills.some(
        (ts) => ts.toLowerCase() === s.toLowerCase()
      )
    );

    return {
      score: override.score,
      subScores: override.subScores,
      matchedSkills: matched.length > 0 ? matched : student.skills.slice(0, 2),
      reason: override.reason,
    };
  }

  const reqSkills = opportunityOrRequirements.requiredSkills || [];
  const reqInterests = opportunityOrRequirements.interests || [];
  const reqAvailability = opportunityOrRequirements.availability || ['Weekends'];

  // 1. Skill Match (50%)
  const matchedSkills = (student.skills || []).filter((s) =>
    reqSkills.some((rs) => rs.toLowerCase() === s.toLowerCase())
  );
  const skillRatio = reqSkills.length > 0 ? matchedSkills.length / reqSkills.length : 0.6;
  const skillScore = Math.min(100, Math.round(Math.max(40, skillRatio * 100)));

  // 2. Interest Match (20%)
  const matchedInterests = (student.interests || []).filter((i) =>
    reqInterests.some((ri) => ri.toLowerCase() === i.toLowerCase())
  );
  const interestRatio = reqInterests.length > 0 ? matchedInterests.length / reqInterests.length : 0.5;
  const interestScore = Math.min(100, Math.round(Math.max(40, interestRatio * 100)));

  // 3. Availability Match (15%)
  const matchedAvail = (student.availability || []).filter((a) =>
    reqAvailability.some((ra) => ra.toLowerCase() === a.toLowerCase())
  );
  const availScore = matchedAvail.length > 0 || (student.availability || []).includes('Flexible') ? 90 : 60;

  // 4. Experience / Proficiency (15%)
  const avgProficiency = Object.values(student.proficiency || {}).reduce((acc, v) => acc + v, 0) /
    (Object.values(student.proficiency || {}).length || 1);
  const experienceScore = Math.round((avgProficiency / 5) * 100);

  // Overall Weighted Score
  const compositeScore = Math.round(
    skillScore * 0.5 +
    interestScore * 0.2 +
    availScore * 0.15 +
    experienceScore * 0.15
  );

  // Natural reason text
  const reason = matchedSkills.length > 0
    ? `Matches ${matchedSkills.length} requested competencies (${matchedSkills.join(', ')}) with complementary schedule.`
    : `Brings foundational cross-discipline skills and active ${student.availability?.[0] || 'flexible'} commitment.`;

  return {
    score: compositeScore,
    subScores: {
      skill: skillScore,
      interest: interestScore,
      availability: availScore,
      experience: experienceScore,
    },
    matchedSkills: matchedSkills.length > 0 ? matchedSkills : (student.skills || []).slice(0, 2),
    reason,
  };
}
