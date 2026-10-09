/**
 * Authentication Service Layer
 * Supports Supabase Auth + PostgreSQL with seamless fallback to
 * zero-assumption local state for testing and explicitly labeled demo logins.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LATENCY_MS = 150;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const AUTH_USER_KEY = 'collabmatrix_auth_user';
const USERS_REGISTRY_KEY = 'collabmatrix_registered_users';

// Universal storage wrapper that gracefully operates in browser or Node test runners
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
  removeItem: (key) => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      delete memoryStore[key];
    } catch (e) {
      delete memoryStore[key];
    }
  },
};

export const DEMO_STUDENT = {
  id: 'student-1',
  role: 'student',
  name: 'Lukmaan Hakim',
  rollNo: '23CSE-084',
  email: 'lukmaan.hakim@campus.edu',
  department: 'Computer Science (CSE)',
  year: '2nd Year',
  semester: 'Semester 4',
  domain: 'Artificial Intelligence & Systems',
  bio: 'AI researcher and systems developer passionate about building predictive diagnostics and intelligent healthcare pipelines.',
  skills: ['Python', 'AI/ML', 'C/C++', 'Backend', 'Data Science'],
  interests: ['AI & Machine Learning', 'Healthcare & MedTech', 'Hardware & IoT'],
  availability: ['Weekends', 'Evenings'],
  preferences: ['Hackathon', 'Project', 'Research'],
  hasCompletedOnboarding: true,
  isDemo: true,
  proficiency: {
    'Python': 5,
    'AI/ML': 4,
    'C/C++': 4,
    'Backend': 4,
    'Data Science': 4,
  },
  projects: [
    { name: 'CardioVision AI', desc: 'Real-time ECG arrhythmia classification using convolutional networks.' },
    { name: 'NeuralCache', desc: 'In-memory caching engine written in C++ with LRU eviction.' }
  ],
  achievements: [
    'Top 5 Finalist, National Healthcare AI Hackathon 2025',
    'Dean’s Honors List, Semester 1 & 2'
  ],
};

export const DEMO_FACULTY = {
  id: 'faculty-1',
  role: 'faculty',
  name: 'Dr. Aris Thorne',
  facultyId: 'FAC-8021',
  email: 'aris.thorne@campus.edu',
  department: 'Computer Science (CSE)',
  designation: 'Professor & Lab Director',
  expertise: 'Autonomous Systems & Predictive Healthcare AI',
  researchInterests: ['Healthcare & MedTech', 'AI & Machine Learning', 'Robotics'],
  mentoringAreas: ['Capstone Project Supervision', 'Research Paper Publishing', 'Hackathon Strategy'],
  bio: 'Directing the Campus Intelligent Systems Lab. Mentoring student teams bridging cutting-edge algorithmic theory with clinical and real-world deployment.',
  officeLocation: 'Turing Hall, Room 412',
  officeHours: 'Tuesdays & Thursdays, 3:00 PM – 5:00 PM',
  hasCompletedOnboarding: true,
  isDemo: true,
  achievements: [
    'Principal Investigator, National Healthcare Intelligence Grant 2024-2027',
    'Distinguished Faculty Mentorship Award 2025',
  ],
};

// Legacy alias
export const DEMO_USER = DEMO_STUDENT;

/**
 * Get internal registry of registered accounts
 * @returns {Array}
 */
export function getRegisteredUsers() {
  try {
    const raw = safeStorage.getItem(USERS_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Save user to registry
 */
function saveUserToRegistry(user) {
  try {
    const users = getRegisteredUsers();
    const idx = users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    safeStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save to registry', e);
  }
}

/**
 * Get the currently logged-in user session
 * @returns {Object|null}
 */
export function getCurrentUser() {
  try {
    const raw = safeStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user && user.isDemo) {
      safeStorage.removeItem(AUTH_USER_KEY);
      return null;
    }
    return user;
  } catch (e) {
    return null;
  }
}

/**
 * Fetch unified profile record from Supabase PostgreSQL
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
export async function fetchSupabaseProfile(userId) {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileErr || !profile) return null;

    let subProfile = {};
    let skillsList = [];
    if (profile.role === 'faculty') {
      const { data: fac } = await supabase
        .from('faculty_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      subProfile = fac || {};
    } else {
      const [{ data: stud }, { data: skillsData }] = await Promise.all([
        supabase
          .from('student_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('student_skills')
          .select('skill, proficiency, status')
          .eq('user_id', userId),
      ]);
      subProfile = stud || {};
      skillsList = (skillsData || []).map((s) => s.skill);
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      department: profile.department,
      avatarUrl: profile.avatar_url,
      hasCompletedOnboarding: profile.has_completed_onboarding,
      isDemo: profile.is_demo,
      ...(profile.role === 'student' ? {
        rollNo: subProfile.roll_number || '',
        year: subProfile.academic_year || '',
        semester: subProfile.semester || '',
        domain: subProfile.domain || '',
        bio: subProfile.bio || '',
        skills: skillsList.length > 0 ? skillsList : (subProfile.skills || []),
        availability: subProfile.availability || [],
        interests: subProfile.interests || [],
        hasCompletedDNA: subProfile.has_completed_dna || false,
      } : {
        facultyId: subProfile.employee_id || '',
        designation: subProfile.designation || '',
        expertise: subProfile.expertise || '',
        researchInterests: subProfile.research_interests || [],
        mentoringAreas: subProfile.mentoring_areas || [],
        officeHours: subProfile.office_hours || '',
        officeLocation: subProfile.office_location || '',
      }),
    };
  } catch (err) {
    console.warn('[CollabMatrix] Failed to fetch Supabase profile:', err.message);
    return null;
  }
}


/**
 * Log in with email and password
 * Supports both live Supabase Auth and deterministic demo logins
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function login(email, password) {
  if (!email || !password) {
    throw new Error('Please enter both campus email and password.');
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Real Supabase Auth Execution when configured
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.user) {
      const fullProfile = await fetchSupabaseProfile(data.user.id);
      const sessionUser = fullProfile || {
        id: data.user.id,
        email: cleanEmail,
        name: data.user.user_metadata?.name || cleanEmail.split('@')[0],
        role: data.user.user_metadata?.role || 'student',
        hasCompletedOnboarding: false,
        isDemo: false,
      };

      safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
      saveUserToRegistry(sessionUser);
      return sessionUser;
    }
  }

  // 3. Fallback: Lookup in saved registered users (Local Mode)
  await delay();
  const users = getRegisteredUsers();
  const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (matched) {
    safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(matched));
    return matched;
  }

  // If new email in local state, create fresh unassigned session
  const isFacultyDomain = cleanEmail.includes('faculty') || cleanEmail.includes('prof') || cleanEmail.includes('dr.');
  const role = isFacultyDomain ? 'faculty' : 'student';

  const user = {
    id: `${role}-${Date.now()}`,
    role,
    name: email.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
    email: cleanEmail,
    department: '',
    hasCompletedOnboarding: false,
    isDemo: false,
    ...(role === 'student' ? {
      rollNo: '',
      year: '',
      semester: '',
      skills: [],
      interests: [],
      availability: [],
      domain: '',
      bio: '',
    } : {
      facultyId: '',
      designation: '',
      expertise: '',
      researchInterests: [],
      mentoringAreas: [],
      bio: '',
    })
  };

  saveUserToRegistry(user);
  safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  return user;
}

/**
 * Instant demo login as Student (Lukmaan Hakim)
 * Explicitly labeled as demo session
 * @returns {Promise<Object>}
 */
export async function loginAsDemoUser() {
  await delay(50);
  safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_STUDENT));
  return DEMO_STUDENT;
}

/**
 * Instant demo login as Faculty (Dr. Aris Thorne)
 * Explicitly labeled as demo session
 * @returns {Promise<Object>}
 */
export async function loginAsDemoFaculty() {
  await delay(50);
  safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_FACULTY));
  return DEMO_FACULTY;
}

/**
 * Register a new user account with zero assumptions
 * Critical Rule: Never preselect, prefill, or hardcode personal profile fields!
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export async function register(userData) {
  const role = userData.role === 'faculty' ? 'faculty' : 'student';
  const cleanEmail = (userData.email || '').trim().toLowerCase();

  // Live Supabase Auth Registration
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: userData.password,
      options: {
        data: {
          name: (userData.name || '').trim(),
          role,
          department: (userData.department || '').trim(),
          rollNo: (userData.rollNo || '').trim(),
          year: (userData.year || '').trim(),
          facultyId: (userData.facultyId || '').trim(),
          designation: (userData.designation || '').trim(),
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    const newUser = {
      id: data.user?.id || `${role}-${Date.now()}`,
      role,
      name: (userData.name || '').trim(),
      email: cleanEmail,
      department: (userData.department || '').trim(),
      hasCompletedOnboarding: false,
      isDemo: false,
      createdAt: new Date().toISOString(),
      ...(role === 'student' ? {
        rollNo: (userData.rollNo || '').trim(),
        year: (userData.year || '').trim(),
        semester: (userData.semester || '').trim(),
        skills: Array.isArray(userData.skills) ? userData.skills : [],
        interests: Array.isArray(userData.interests) ? userData.interests : [],
        domain: (userData.domain || '').trim(),
        availability: Array.isArray(userData.availability) ? userData.availability : [],
        bio: (userData.bio || '').trim(),
      } : {
        facultyId: (userData.facultyId || '').trim(),
        designation: (userData.designation || '').trim(),
        expertise: (userData.expertise || '').trim(),
        researchInterests: Array.isArray(userData.researchInterests) ? userData.researchInterests : [],
        mentoringAreas: Array.isArray(userData.mentoringAreas) ? userData.mentoringAreas : [],
        bio: (userData.bio || '').trim(),
      }),
    };

    saveUserToRegistry(newUser);
    safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    return newUser;
  }

  // Local fallback mode
  await delay();
  const users = getRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail && !u.isDemo);
  if (existing) {
    throw new Error('An account with this campus email already exists. Please log in.');
  }

  const newUser = {
    id: `${role}-${Date.now()}`,
    role,
    name: (userData.name || '').trim(),
    email: cleanEmail,
    department: (userData.department || '').trim(),
    hasCompletedOnboarding: false,
    isDemo: false,
    createdAt: new Date().toISOString(),
    ...(role === 'student' ? {
      rollNo: (userData.rollNo || '').trim(),
      year: (userData.year || '').trim(),
      semester: (userData.semester || '').trim(),
      skills: Array.isArray(userData.skills) ? userData.skills : [],
      interests: Array.isArray(userData.interests) ? userData.interests : [],
      domain: (userData.domain || '').trim(),
      availability: Array.isArray(userData.availability) ? userData.availability : [],
      bio: (userData.bio || '').trim(),
      proficiency: {},
      hasCompletedDNA: false,
    } : {
      facultyId: (userData.facultyId || '').trim(),
      designation: (userData.designation || '').trim(),
      expertise: (userData.expertise || '').trim(),
      researchInterests: Array.isArray(userData.researchInterests) ? userData.researchInterests : [],
      mentoringAreas: Array.isArray(userData.mentoringAreas) ? userData.mentoringAreas : [],
      bio: (userData.bio || '').trim(),
    }),
  };

  saveUserToRegistry(newUser);
  safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
  return newUser;
}

/**
 * Simulated Google OAuth authentication
 * @returns {Promise<Object>}
 */
export async function loginWithGoogle() {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw new Error(error.message);
    return data;
  }
  await delay(200);
  const googleUser = {
    id: `student-google-${Date.now()}`,
    role: 'student',
    email: 'student.google@campus.edu',
    name: 'Google Campus Student',
    department: '',
    hasCompletedOnboarding: false,
    isDemo: false,
    skills: [],
    interests: [],
    availability: ['Flexible'],
  };
  safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(googleUser));
  saveUserToRegistry(googleUser);
  return googleUser;
}

/**
 * Log out and clear session
 * @returns {Promise<void>}
 */
export async function logout() {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('[CollabMatrix] Supabase signOut note:', e.message);
    }
  }
  await delay(50);
  safeStorage.removeItem(AUTH_USER_KEY);
}

/**
 * Update authenticated user profile details
 * Strictly preserves non-demo accounts and persists changes in Supabase & local state
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export async function updateProfile(updates) {
  const current = getCurrentUser();
  if (!current) {
    throw new Error('No active user session to update.');
  }

  // If live Supabase session exists and is not demo
  if (isSupabaseConfigured() && !current.isDemo) {
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({
        name: updates.name !== undefined ? updates.name : current.name,
        department: updates.department !== undefined ? updates.department : current.department,
        has_completed_onboarding: updates.hasCompletedOnboarding !== undefined ? updates.hasCompletedOnboarding : current.hasCompletedOnboarding,
        updated_at: new Date().toISOString(),
      })
      .eq('id', current.id);

    if (profileErr) {
      throw new Error(`Supabase profile update error: ${profileErr.message}`);
    }

    if (current.role === 'faculty') {
      const { error: facErr } = await supabase
        .from('faculty_profiles')
        .update({
          designation: updates.designation !== undefined ? updates.designation : current.designation,
          expertise: updates.expertise !== undefined ? updates.expertise : current.expertise,
          office_hours: updates.officeHours !== undefined ? updates.officeHours : current.officeHours,
          office_location: updates.officeLocation !== undefined ? updates.officeLocation : current.officeLocation,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', current.id);

      if (facErr) {
        throw new Error(`Supabase faculty profile update error: ${facErr.message}`);
      }
    } else {
      const { error: studErr } = await supabase
        .from('student_profiles')
        .update({
          academic_year: updates.year !== undefined ? updates.year : current.year,
          semester: updates.semester !== undefined ? updates.semester : current.semester,
          domain: updates.domain !== undefined ? updates.domain : current.domain,
          bio: updates.bio !== undefined ? updates.bio : current.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', current.id);

      if (studErr) {
        throw new Error(`Supabase student profile update error: ${studErr.message}`);
      }

      // If skills updated, sync to student_skills table
      if (Array.isArray(updates.skills) && updates.skills.length > 0) {
        const skillRows = updates.skills.map((skill) => ({
          user_id: current.id,
          skill,
          proficiency: (updates.proficiency && updates.proficiency[skill]) || 3,
          status: 'SELF_DECLARED',
        }));
        await supabase
          .from('student_skills')
          .upsert(skillRows, { onConflict: 'user_id,skill' });
      }
    }
  }

  await delay();
  const updated = {
    ...current,
    ...updates,
  };

  saveUserToRegistry(updated);
  safeStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
  return updated;
}
