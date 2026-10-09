// Automated Functional Acceptance Verification Script for CollabMatrix
import { calculateMatchScore, calculateTeamCompatibility } from '../utils/matching.js';
import { calculateReadinessIndex, analyzeCapabilityCoverage } from '../utils/gapAnalysis.js';
import {
  evaluateTeamHealth,
  PROJECT_HEALTH_STATUS,
} from '../services/teamHealthService.js';
import {
  SKILL_EVIDENCE_STATUS,
  EVIDENCE_WEIGHT_MULTIPLIERS,
} from '../data/skillEvidence.js';

console.log('=== COLLABMATRIX FUNCTIONAL ACCEPTANCE SUITE ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. EVIDENCE INTEGRITY & STATUS TIERS
console.log('--- TEST GROUP 1: EVIDENCE STATUS TIERS ---');
assert(SKILL_EVIDENCE_STATUS.SELF_DECLARED === 'SELF_DECLARED', 'Tier 1 is SELF_DECLARED');
assert(SKILL_EVIDENCE_STATUS.EVIDENCE_SUBMITTED === 'EVIDENCE_SUBMITTED', 'Tier 2 is EVIDENCE_SUBMITTED');
assert(SKILL_EVIDENCE_STATUS.PRACTICALLY_DEMONSTRATED === 'PRACTICALLY_DEMONSTRATED', 'Tier 3 is PRACTICALLY_DEMONSTRATED');
assert(SKILL_EVIDENCE_STATUS.INDEPENDENTLY_REVIEWED === 'INDEPENDENTLY_REVIEWED', 'Tier 4 is INDEPENDENTLY_REVIEWED');
assert(
  EVIDENCE_WEIGHT_MULTIPLIERS.SELF_DECLARED < EVIDENCE_WEIGHT_MULTIPLIERS.INDEPENDENTLY_REVIEWED,
  'Self-declared weight (0.60) is strictly lower than faculty certified (1.00)'
);

// 2. DETERMINISTIC MATCHING ENGINE
console.log('\n--- TEST GROUP 2: DETERMINISTIC WEIGHTED MATCHING ---');
const sampleRequirements = {
  requiredSkills: ['React', 'Node.js', 'Docker'],
  interests: ['Web Development', 'Cloud Computing'],
  availability: ['Weekdays', 'Flexible'],
  domain: 'Computer Science',
};

const candidateWithSkills = {
  id: 'cand-1',
  name: 'Alex Rivera',
  skills: ['React', 'Node.js'],
  interests: ['Web Development'],
  availability: ['Weekdays'],
  experience: 'Intermediate',
  domain: 'Computer Science',
};

const candidateBeginner = {
  id: 'cand-2',
  name: 'Jordan Lee',
  skills: ['React'],
  interests: ['Web Development'],
  availability: ['Weekdays'],
  experience: 'Beginner',
  domain: 'Computer Science',
};

const verifiedEvidences = [
  { studentId: 'cand-1', skill: 'React', status: 'INDEPENDENTLY_REVIEWED' },
  { studentId: 'cand-1', skill: 'Node.js', status: 'PRACTICALLY_DEMONSTRATED' },
];

const matchScore1 = calculateMatchScore(candidateWithSkills, sampleRequirements, verifiedEvidences);
const matchScore2 = calculateMatchScore(candidateBeginner, sampleRequirements, []);

assert(typeof matchScore1 === 'number' && matchScore1 > 0 && matchScore1 <= 100, `Match score 1 calculated: ${matchScore1}%`);
assert(typeof matchScore2 === 'number' && matchScore2 > 0 && matchScore2 <= 100, `Match score 2 calculated: ${matchScore2}%`);
assert(matchScore1 > matchScore2, `Candidate with verified evidence scores higher (${matchScore1}% vs ${matchScore2}%)`);

// 3. TEAM READINESS INDEX & CAPABILITY COVERAGE
console.log('\n--- TEST GROUP 3: TEAM READINESS & GAP ANALYSIS ---');
const sampleRoster = [
  { id: 'm1', name: 'Dev 1', skills: ['React', 'CSS'] },
  { id: 'm2', name: 'Dev 2', skills: ['Node.js', 'PostgreSQL'] },
];
const requiredCaps = ['React', 'Node.js', 'Docker', 'Kubernetes'];

const readiness = calculateReadinessIndex(sampleRoster, requiredCaps, verifiedEvidences);
assert(readiness.overallScore >= 0 && readiness.overallScore <= 100, `Readiness score computed: ${readiness.overallScore}%`);
assert(readiness.coverageRatio === 0.5, `Coverage ratio is exactly 50% (2 of 4 capabilities): ${readiness.coverageRatio}`);
assert(readiness.missingSkills.includes('Docker'), 'Identified missing skill: Docker');
assert(readiness.missingSkills.includes('Kubernetes'), 'Identified missing skill: Kubernetes');

// 4. TEAM HEALTH RADAR FORENSIC DETECTION
console.log('\n--- TEST GROUP 4: TEAM HEALTH RADAR FORENSICS ---');
const sampleTasks = [
  {
    id: 't-1',
    title: 'PostgreSQL Migration',
    assignedToId: null, // UNASSIGNED ESSENTIAL
    isEssential: true,
    deadline: '2026-10-15',
    status: 'In Progress',
  },
  {
    id: 't-2',
    title: 'Protobuf Telemetry Parser',
    assignedToId: 'm1',
    isEssential: true,
    deadline: '2026-09-01', // OVERDUE (past 2026-10-09)
    status: 'In Progress',
  },
  {
    id: 't-3',
    title: 'UI Dashboard Shell',
    assignedToId: 'm2',
    isEssential: false,
    deadline: '2026-10-20',
    status: 'Completed',
  },
];

const sampleTeam = {
  id: 'team-1',
  name: 'Telemetry Squad',
  members: sampleRoster,
  requiredSkills: requiredCaps,
};

const healthEval = evaluateTeamHealth(sampleTeam, sampleTasks, []);

assert(healthEval.status !== PROJECT_HEALTH_STATUS.ON_TRACK, `Health status accurately flagged non-trivial risk: ${healthEval.status}`);
assert(healthEval.unassignedCount === 1, `Forensic counter for unassigned essential task is 1 (actual: ${healthEval.unassignedCount})`);
assert(healthEval.overdueCount === 1, `Forensic counter for overdue critical deliverable is 1 (actual: ${healthEval.overdueCount})`);
assert(healthEval.singlePointCount > 0, `Forensic counter for bus factor 1 single-point skills detected: ${healthEval.singlePointCount}`);
assert(healthEval.riskFactors.length >= 2, `Risk factors list populated with forensic justifications: ${healthEval.riskFactors.length}`);

console.log('\n=================================================');
console.log(`TOTAL CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log('=================================================\n');

if (passedTests === totalTests) {
  console.log('ALL ACCEPTANCE ASSERTIONS SATISFIED!');
} else {
  process.exit(1);
}
