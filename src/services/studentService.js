/**
 * Student Service Layer
 * Supports live Supabase PostgreSQL queries (`profiles`, `student_profiles`, `student_skills`)
 * with fallback to local state when unconfigured.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { INITIAL_STUDENTS } from '../data/students.js';

const LATENCY_MS = 200;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const LOCAL_STORAGE_KEY = 'collabmatrix_students';

const memoryStore = {};
const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
      return memoryStore[key] || null;
    } catch (e) {
      return memoryStore[key] || null;
    }
  },
  setItem: (key, val) => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, val);
      memoryStore[key] = String(val);
    } catch (e) {
      memoryStore[key] = String(val);
    }
  },
};

function getStoredStudents() {
  try {
    const raw = safeStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
  } catch (e) {
    return INITIAL_STUDENTS;
  }
}

function saveStoredStudents(students) {
  try {
    safeStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
}

/**
 * Fetch all student profiles with optional search and filters
 * @param {Object} [filters]
 * @returns {Promise<Array>}
 */
export async function getStudents(filters = {}) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, email, name, department, avatar_url,
        student_profiles(roll_number, academic_year, semester, domain, bio, availability, interests, has_completed_dna),
        student_skills(skill, proficiency, status)
      `)
      .eq('role', 'student');

    if (error) {
      throw new Error(`Supabase student query error: ${error.message}`);
    }

    let students = (data || []).map((p) => {
      const sp = Array.isArray(p.student_profiles) ? p.student_profiles[0] || {} : p.student_profiles || {};
      const skills = Array.isArray(p.student_skills) ? p.student_skills.map((s) => s.skill) : [];
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        department: p.department || '',
        avatar: p.avatar_url,
        rollNo: sp.roll_number || '',
        year: sp.academic_year || '',
        semester: sp.semester || '',
        domain: sp.domain || '',
        bio: sp.bio || '',
        skills: skills.length > 0 ? skills : ['General'],
        interests: sp.interests || [],
        availability: sp.availability || ['Flexible'],
        hasCompletedDNA: Boolean(sp.has_completed_dna),
      };
    });

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

  // LOCAL STANDBY FALLBACK
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
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getStudentById(id) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, email, name, department, avatar_url,
        student_profiles(roll_number, academic_year, semester, domain, bio, availability, interests, has_completed_dna),
        student_skills(skill, proficiency, status)
      `)
      .eq('id', id)
      .eq('role', 'student')
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase student fetch error: ${error.message}`);
    }

    if (!data) return null;

    const sp = Array.isArray(data.student_profiles) ? data.student_profiles[0] || {} : data.student_profiles || {};
    const skills = Array.isArray(data.student_skills) ? data.student_skills.map((s) => s.skill) : [];

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      department: data.department || '',
      avatar: data.avatar_url,
      rollNo: sp.roll_number || '',
      year: sp.academic_year || '',
      semester: sp.semester || '',
      domain: sp.domain || '',
      bio: sp.bio || '',
      skills: skills.length > 0 ? skills : ['General'],
      interests: sp.interests || [],
      availability: sp.availability || ['Flexible'],
      hasCompletedDNA: Boolean(sp.has_completed_dna),
    };
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const students = getStoredStudents();
  return students.find((s) => s.id === id) || null;
}

/**
 * Update an existing student's profile details
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export async function updateStudent(id, updates) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { error: pErr } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        department: updates.department,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (pErr) throw new Error(`Supabase update profile error: ${pErr.message}`);

    const { error: spErr } = await supabase
      .from('student_profiles')
      .update({
        academic_year: updates.year,
        semester: updates.semester,
        domain: updates.domain,
        bio: updates.bio,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', id);

    if (spErr) throw new Error(`Supabase update student profile error: ${spErr.message}`);

    return getStudentById(id);
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const students = getStoredStudents();
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error('Student not found');

  const updated = { ...students[idx], ...updates };
  students[idx] = updated;
  saveStoredStudents(students);
  return updated;
}
