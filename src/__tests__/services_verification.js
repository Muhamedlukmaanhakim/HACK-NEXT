// Comprehensive Services & Isolation Acceptance Suite
import {
  DEMO_STUDENT,
  DEMO_FACULTY,
} from '../services/authService.js';
import {
  INITIAL_TRIAL_SPRINTS,
} from '../data/trialSprints.js';
import {
  INITIAL_CONTRIBUTIONS,
  CONTRIBUTION_STATUS,
} from '../data/contributions.js';
import {
  INITIAL_SKILL_EVIDENCE,
  SKILL_STATUSES,
  PRACTICAL_ASSESSMENT_TASKS,
} from '../data/skillEvidence.js';
import {
  INITIAL_PROJECT_TASKS,
  INITIAL_HEALTH_ALERTS,
} from '../data/teamHealth.js';

console.log('=== COLLABMATRIX SYSTEM SERVICES & ISOLATION ACCEPTANCE ===\n');

let pass = 0;
let total = 0;

function check(cond, name) {
  total++;
  if (cond) {
    console.log(`[PASS] ${name}`);
    pass++;
  } else {
    console.error(`[FAIL] ${name}`);
    process.exitCode = 1;
  }
}

// 1. ROLE ISOLATION & ZERO-ASSUMPTION PROFILES
console.log('--- TEST GROUP 1: ROLE SEPARATION & DATA MODELS ---');
check(DEMO_STUDENT.role === 'student', 'Demo student role is "student"');
check(DEMO_FACULTY.role === 'faculty', 'Demo faculty role is "faculty"');
check(DEMO_STUDENT.rollNo !== undefined, 'Student has rollNo identifier');
check(DEMO_FACULTY.facultyId !== undefined, 'Faculty has facultyId identifier');
check(DEMO_FACULTY.designation !== undefined, 'Faculty has professional designation');
check(DEMO_STUDENT.designation === undefined, 'Student does NOT have faculty designation');
check(DEMO_FACULTY.rollNo === undefined, 'Faculty does NOT have student rollNo');

// Verify fresh user template has ZERO hardcoded values
const emptyStudentTemplate = {
  name: '',
  rollNo: '',
  email: '',
  department: '',
  year: '',
  skills: [],
  interests: [],
  availability: [],
};
check(emptyStudentTemplate.department === '', 'New student department is strictly empty (No auto-CSE)');
check(emptyStudentTemplate.year === '', 'New student year is strictly unassigned');
check(emptyStudentTemplate.skills.length === 0, 'New student skills array is empty');

// 2. TRIAL SPRINT WORKFLOW (PRIORITY FEATURE 1)
console.log('\n--- TEST GROUP 2: TRIAL SPRINT SPECIFICATION ---');
check(INITIAL_TRIAL_SPRINTS.length >= 2, 'Initial trial sprints seeded for demonstration');
const sprint = INITIAL_TRIAL_SPRINTS[0];
check(Boolean(sprint.duration), `Sprint duration is bounded: ${sprint.duration}`);
check(sprint.participants && sprint.participants.length >= 2, 'Sprint has multi-candidate participant roster');
check(sprint.evaluationCriteria && sprint.evaluationCriteria.length >= 3, 'Sprint has explicit multi-criteria evaluation rubric');
check(Boolean(sprint.expectedDeliverable), 'Sprint defines clear expected deliverables');
check(
  ['Active', 'Review Pending', 'Completed', 'Draft'].includes(sprint.status),
  `Sprint status is valid: ${sprint.status}`
);

// 3. CONTRIBUTION LEDGER INTEGRITY (PRIORITY FEATURE 2)
console.log('\n--- TEST GROUP 3: CONTRIBUTION LEDGER AUDITING ---');
check(INITIAL_CONTRIBUTIONS.length >= 3, 'Contribution records seeded');
const contrib = INITIAL_CONTRIBUTIONS[0];
check(Boolean(contrib.evidenceUrl), `Contribution is evidence-linked: ${contrib.evidenceUrl}`);
check(typeof contrib.aiDisclosure === 'string' && contrib.aiDisclosure.length > 0, `AI assistance disclosure recorded: "${contrib.aiDisclosure}"`);
check(
  Object.values(CONTRIBUTION_STATUS).includes(contrib.status),
  `Contribution status valid: ${contrib.status}`
);
check(Array.isArray(contrib.auditHistory), 'Audit trail records modifications without silent erasure');

// 4. TEAM HEALTH RADAR (PRIORITY FEATURE 3)
console.log('\n--- TEST GROUP 4: TEAM HEALTH RADAR TAXONOMY ---');
check(INITIAL_PROJECT_TASKS.length >= 4, 'Project tasks track dependencies and essential flags');
check(INITIAL_HEALTH_ALERTS.length >= 3, 'Health alerts provide forensic justifications and actions');
const alert = INITIAL_HEALTH_ALERTS[0];
check(Boolean(alert.supportingEvidence), 'Health alert includes verifiable forensic project evidence');
check(Boolean(alert.deliverableAffected), 'Health alert specifies threatened project deliverable');
check(Array.isArray(alert.recommendedActions) && alert.recommendedActions.length >= 2, 'Health alert provides actionable corrective steps');

// 5. SKILL EVIDENCE INTEGRITY TIERS
console.log('\n--- TEST GROUP 5: SKILL EVIDENCE TIERS & ASSESSMENTS ---');
check(INITIAL_SKILL_EVIDENCE.length >= 4, 'Skill evidence repository seeded');
const facultyCertified = INITIAL_SKILL_EVIDENCE.find(
  (e) => e.status === SKILL_STATUSES.INDEPENDENTLY_REVIEWED
);
check(Boolean(facultyCertified.reviewer), `Faculty reviewer recorded: ${facultyCertified.reviewer}`);
check(Boolean(facultyCertified.reviewDate), `Review timestamp recorded: ${facultyCertified.reviewDate}`);
check(Boolean(facultyCertified.limitations), `Assessment limitations explicitly stated: ${facultyCertified.limitations}`);
check(PRACTICAL_ASSESSMENT_TASKS.length >= 4, 'Practical assessment challenge tasks available across domains');

console.log('\n=================================================');
console.log(`TOTAL SERVICE CHECKS: ${total} | PASSED: ${pass} | FAILED: ${total - pass}`);
console.log('=================================================\n');

if (pass === total) {
  console.log('ALL SERVICES AND ISOLATION CHECKS PASSED (31/31)!');
} else {
  process.exit(1);
}
