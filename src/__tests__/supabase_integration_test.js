// Automated Verification Suite for Supabase Configuration, Migrations, and Database Readiness
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isSupabaseConfigured, getSupabaseConfigStatus } from '../lib/supabase.js';
import {
  DEMO_STUDENT,
  DEMO_FACULTY,
  loginAsDemoUser,
  loginAsDemoFaculty,
  register,
  updateProfile,
} from '../services/authService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

console.log('=== COLLABMATRIX SUPABASE READINESS & INTEGRATION VERIFICATION ===\n');

let total = 0;
let passed = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. ENVIRONMENT CONFIGURATION & SAFETY
console.log('--- TEST GROUP 1: ENVIRONMENT CONFIGURATION & SECRETS SAFETY ---');
const envExamplePath = path.join(rootDir, '.env.example');
const gitignorePath = path.join(rootDir, '.gitignore');

assert(fs.existsSync(envExamplePath), '.env.example template file exists in project root');
const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
assert(
  envExampleContent.includes('VITE_SUPABASE_URL=') &&
  envExampleContent.includes('VITE_SUPABASE_ANON_KEY='),
  '.env.example contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY placeholders'
);
assert(
  !envExampleContent.includes('service_role') && !envExampleContent.includes('SERVICE_KEY'),
  '.env.example never mentions or exposes service-role secrets'
);

const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
assert(
  gitignoreContent.includes('.env.local') && gitignoreContent.includes('.env'),
  '.gitignore strictly ignores .env and .env.local files'
);

// 2. SUPABASE CLIENT & RUNTIME DIAGNOSTICS
console.log('\n--- TEST GROUP 2: SUPABASE CLIENT & RUNTIME FALLBACK ---');
assert(typeof isSupabaseConfigured === 'function', 'isSupabaseConfigured export is a function');
const configStatus = getSupabaseConfigStatus();
assert(typeof configStatus === 'object', 'getSupabaseConfigStatus returns structured diagnostics');
assert(typeof configStatus.configured === 'boolean', 'Diagnostics contains boolean configured flag');
assert(typeof configStatus.mode === 'string', `Runtime mode identified: "${configStatus.mode}"`);
assert(
  !configStatus.anonKey && !configStatus.key,
  'Diagnostics strictly protects anon keys and secrets from exposure'
);

// 3. DATABASE MIGRATION INTEGRITY (19 TABLES + RLS)
console.log('\n--- TEST GROUP 3: POSTGRESQL SCHEMA & RLS MIGRATIONS ---');
const migration1Path = path.join(rootDir, 'supabase/migrations/20261009000001_initial_schema.sql');
const migration2Path = path.join(rootDir, 'supabase/migrations/20261009000002_row_level_security.sql');

assert(fs.existsSync(migration1Path), 'Migration 001 (initial schema) exists in supabase/migrations/');
assert(fs.existsSync(migration2Path), 'Migration 002 (row level security) exists in supabase/migrations/');

const migration1Content = fs.readFileSync(migration1Path, 'utf8');
const migration2Content = fs.readFileSync(migration2Path, 'utf8');

const expectedTables = [
  'profiles',
  'student_profiles',
  'faculty_profiles',
  'student_skills',
  'projects',
  'project_members',
  'collaboration_requests',
  'teams',
  'team_members',
  'tasks',
  'trial_sprints',
  'trial_sprint_participants',
  'contributions',
  'contribution_audits',
  'skill_evidence',
  'team_health_alerts',
  'team_agreements',
  'team_agreement_signatures',
  'notifications',
];

expectedTables.forEach((table) => {
  assert(
    migration1Content.includes(`CREATE TABLE IF NOT EXISTS public.${table}`),
    `Migration 001 defines table: public.${table}`
  );
  assert(
    migration2Content.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`),
    `Migration 002 enables RLS on: public.${table}`
  );
});

// Verify security triggers and functions
assert(
  migration1Content.includes('CREATE OR REPLACE FUNCTION public.handle_new_user()'),
  'Migration 001 includes handle_new_user() security definer trigger for auth.users sync'
);
assert(
  migration2Content.includes('CREATE OR REPLACE FUNCTION public.is_faculty()'),
  'Migration 002 includes is_faculty() security definer helper'
);
assert(
  migration2Content.includes('CREATE OR REPLACE FUNCTION public.is_student()'),
  'Migration 002 includes is_student() security definer helper'
);

// 4. AUTHENTICATION & DEMO SAFETY
console.log('\n--- TEST GROUP 4: AUTHENTICATION SERVICE DUAL-MODE ---');
assert(DEMO_STUDENT.role === 'student' && DEMO_STUDENT.isDemo === true, 'DEMO_STUDENT is explicitly tagged as demo');
assert(DEMO_FACULTY.role === 'faculty' && DEMO_FACULTY.isDemo === true, 'DEMO_FACULTY is explicitly tagged as demo');

const demoStudentSession = await loginAsDemoUser();
assert(demoStudentSession.email === 'lukmaan.hakim@campus.edu', 'loginAsDemoUser resolves student demo session');

const demoFacultySession = await loginAsDemoFaculty();
assert(demoFacultySession.email === 'aris.thorne@campus.edu', 'loginAsDemoFaculty resolves faculty demo session');

// Verify fresh user registration does not assume demo data
const testStudent = await register({
  name: 'Test Candidate',
  email: `test-${Date.now()}@campus.edu`,
  password: 'Password123!',
  role: 'student',
  department: 'Mechanical Engineering',
});

assert(testStudent.name === 'Test Candidate', 'Registered candidate preserves authentic name');
assert(testStudent.role === 'student', 'Registered candidate receives requested role');
assert(testStudent.isDemo === false, 'Newly registered candidate is NOT marked as demo');
assert(testStudent.skills.length === 0, 'Newly registered student has zero assumed skills');

console.log('\n=================================================');
console.log(`TOTAL CHECKS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
console.log('=================================================\n');

if (passed === total) {
  console.log('ALL SUPABASE INTEGRATION & READINESS CHECKS PASSED!');
} else {
  process.exit(1);
}
