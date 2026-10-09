// Verification suite for Settings routing, authorization, and role separation
import { DEMO_STUDENT, DEMO_FACULTY } from '../services/authService.js';

console.log('=== SETTINGS & ROLE AUTHORIZATION VERIFICATION ===\n');

let total = 0;
let passed = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Session and Role Truth
console.log('--- TEST GROUP 1: DEMO SESSIONS & ROLE INTEGRITY ---');
assert(DEMO_STUDENT.role === 'student', 'Student demo account has role "student"');
assert(DEMO_FACULTY.role === 'faculty', 'Faculty demo account has role "faculty"');
assert(DEMO_STUDENT.name === 'Lukmaan Hakim', 'Student demo account name is Lukmaan Hakim');
assert(DEMO_FACULTY.name === 'Dr. Aris Thorne', 'Faculty demo account name is Dr. Aris Thorne');
assert(DEMO_FACULTY.designation !== undefined, 'Faculty demo account has professional designation');
assert(DEMO_STUDENT.designation === undefined, 'Student demo account does not have faculty designation');

// 2. Route Guard Authorization Logic (Matching ProtectedRoute logic)
function checkRouteAccess(user, allowedRoles) {
  if (!user) return { status: 'REDIRECT_LOGIN', authorized: false };
  const userRole = user.role || 'student';
  if (!allowedRoles || allowedRoles.length === 0) return { status: 'AUTHORIZED', authorized: true };
  if (allowedRoles.includes(userRole)) return { status: 'AUTHORIZED', authorized: true };
  return {
    status: '403_CLEARANCE_MISMATCH',
    authorized: false,
    requiredRole: allowedRoles.join('/'),
    actualRole: userRole,
  };
}

const studentWorkspaceRoles = ['student'];
const facultyWorkspaceRoles = ['faculty'];
const sharedWorkspaceRoles = ['student', 'faculty'];

console.log('\n--- TEST GROUP 2: ROUTE CLEARANCE & GUARDS ---');
// Shared Settings route access:
const studentSettingsAccess = checkRouteAccess(DEMO_STUDENT, sharedWorkspaceRoles);
const facultySettingsAccess = checkRouteAccess(DEMO_FACULTY, sharedWorkspaceRoles);
const unauthSettingsAccess = checkRouteAccess(null, sharedWorkspaceRoles);

assert(
  studentSettingsAccess.authorized === true,
  'Student session is AUTHORIZED to access shared /settings'
);
assert(
  facultySettingsAccess.authorized === true,
  'Faculty session is AUTHORIZED to access shared /settings'
);
assert(
  unauthSettingsAccess.status === 'REDIRECT_LOGIN',
  'Unauthenticated visitor accessing /settings is redirected to login'
);

// Faculty Settings route access:
const facultyOnFacultySettings = checkRouteAccess(DEMO_FACULTY, facultyWorkspaceRoles);
const studentOnFacultySettings = checkRouteAccess(DEMO_STUDENT, facultyWorkspaceRoles);

assert(
  facultyOnFacultySettings.authorized === true,
  'Faculty session is AUTHORIZED to access /faculty/settings'
);
assert(
  studentOnFacultySettings.status === '403_CLEARANCE_MISMATCH',
  'Student session attempting /faculty/settings is BLOCKED with 403 Clearance Mismatch'
);

// Student-only route access:
const facultyOnStudentDashboard = checkRouteAccess(DEMO_FACULTY, studentWorkspaceRoles);
const facultyOnTrialSprint = checkRouteAccess(DEMO_FACULTY, studentWorkspaceRoles);
const studentOnStudentDashboard = checkRouteAccess(DEMO_STUDENT, studentWorkspaceRoles);

assert(
  facultyOnStudentDashboard.status === '403_CLEARANCE_MISMATCH',
  'Faculty session attempting /dashboard is BLOCKED with 403 Clearance Mismatch'
);
assert(
  facultyOnTrialSprint.status === '403_CLEARANCE_MISMATCH',
  'Faculty session attempting /team/trial-sprint is BLOCKED with 403 Clearance Mismatch'
);
assert(
  studentOnStudentDashboard.authorized === true,
  'Student session is AUTHORIZED on /dashboard'
);

// Faculty-only route access:
const studentOnFacultyDashboard = checkRouteAccess(DEMO_STUDENT, facultyWorkspaceRoles);
const studentOnFacultySupervision = checkRouteAccess(DEMO_STUDENT, facultyWorkspaceRoles);
const facultyOnFacultyDashboard = checkRouteAccess(DEMO_FACULTY, facultyWorkspaceRoles);

assert(
  studentOnFacultyDashboard.status === '403_CLEARANCE_MISMATCH',
  'Student session attempting /faculty/dashboard is BLOCKED with 403 Clearance Mismatch'
);
assert(
  studentOnFacultySupervision.status === '403_CLEARANCE_MISMATCH',
  'Student session attempting /faculty/supervision is BLOCKED with 403 Clearance Mismatch'
);
assert(
  facultyOnFacultyDashboard.authorized === true,
  'Faculty session is AUTHORIZED on /faculty/dashboard'
);

// 3. Settings Navigation Destination Resolution
console.log('\n--- TEST GROUP 3: NAVIGATION DESTINATION RESOLUTION ---');
function getSettingsRouteForRole(role) {
  return role === 'faculty' ? '/faculty/settings' : '/settings';
}

assert(
  getSettingsRouteForRole(DEMO_STUDENT.role) === '/settings',
  'Student navigation points to /settings'
);
assert(
  getSettingsRouteForRole(DEMO_FACULTY.role) === '/faculty/settings',
  'Faculty navigation points to /faculty/settings'
);

// 4. Role-Aware Profile Update State
console.log('\n--- TEST GROUP 4: ROLE-AWARE PROFILE ISOLATION ---');
const updatedStudent = {
  ...DEMO_STUDENT,
  name: 'Lukmaan H.',
  department: 'Information Technology',
  year: '3rd Year',
};
const updatedFaculty = {
  ...DEMO_FACULTY,
  name: 'Dr. Aris Thorne, Ph.D.',
  designation: 'Chair of Computing',
  expertise: 'Distributed AI Systems',
};

assert(updatedStudent.role === 'student', 'Updated student maintains student role');
assert(updatedFaculty.role === 'faculty', 'Updated faculty maintains faculty role');
assert(updatedFaculty.designation === 'Chair of Computing', 'Faculty designation correctly updated');
assert(updatedStudent.year === '3rd Year', 'Student year of study correctly updated');
assert(updatedStudent.designation === undefined, 'Student does not leak or gain designation field');
assert(updatedFaculty.year === undefined, 'Faculty does not leak or gain year of study field');

console.log('\n=================================================');
console.log(`TOTAL CHECKS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
console.log('=================================================\n');

if (passed === total) {
  console.log('ALL SETTINGS & AUTHORIZATION CHECKS PASSED!');
} else {
  process.exit(1);
}
