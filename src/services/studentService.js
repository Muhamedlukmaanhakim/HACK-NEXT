/**
 * Student Service Layer
 * Simulates async database interactions for student profiles.
 * Future Supabase table: `public.students`
 */

import { INITIAL_STUDENTS } from '../data/students';

const LATENCY_MS = 400;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const LOCAL_STORAGE_KEY = 'collabmatrix_students';

function getStoredStudents() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
  } catch (e) {
    return INITIAL_STUDENTS;
  }
}

function saveStoredStudents(students) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
}

/**
 * Fetch all student profiles with optional search and filters
 * @futureEndpoint Supabase: `supabase.from('students').select('*')`
 * @param {Object} [filters]
 * @returns {Promise<Array>}
 */
export async function getStudents(filters = {}) {
  await delay();
  let students = getStoredStudents();

  if (filters.search) {
    const q = filters.search.toLowerCase();
    students = students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.skills || []).some((sk) => sk.toLowerCase().includes(q)) ||
        (s.interests || []).some((it) => it.toLowerCase().includes(q)) ||
        (s.department || '').toLowerCase().includes(q)
    );
  }

  if (filters.department) {
    students = students.filter((s) => s.department === filters.department);
  }

  if (filters.year) {
    students = students.filter((s) => s.year === filters.year);
  }

  if (filters.availability) {
    students = students.filter((s) =>
      (s.availability || []).includes(filters.availability) ||
      (s.availability || []).includes('Flexible')
    );
  }

  return students;
}

/**
 * Fetch a single student profile by ID
 * @futureEndpoint Supabase: `supabase.from('students').select('*').eq('id', id).single()`
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getStudentById(id) {
  await delay();
  const students = getStoredStudents();
  return students.find((s) => s.id === id) || null;
}

/**
 * Update an existing student's profile details
 * @futureEndpoint Supabase: `supabase.from('students').update(updates).eq('id', id)`
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export async function updateStudent(id, updates) {
  await delay();
  const students = getStoredStudents();
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error('Student not found');

  const updated = { ...students[idx], ...updates };
  students[idx] = updated;
  saveStoredStudents(students);
  return updated;
}
