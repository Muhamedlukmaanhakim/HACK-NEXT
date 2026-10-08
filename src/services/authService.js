/**
 * Authentication Service Layer
 * Manages user sessions, credentials, onboarding state, and demo login.
 * Future Supabase auth: `supabase.auth.signInWithPassword`, `supabase.auth.signUp`, etc.
 */

const LATENCY_MS = 300;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const AUTH_USER_KEY = 'collabmatrix_auth_user';

export const DEMO_USER = {
  id: 'student-1',
  name: 'Lukmaan Hakim',
  email: 'lukmaan.hakim@campus.edu',
  department: 'Computer Science (CSE)',
  year: '2nd Year',
  bio: 'AI researcher and systems developer passionate about building predictive diagnostics and intelligent healthcare pipelines.',
  skills: ['Python', 'AI/ML', 'C/C++', 'Backend', 'Data Science'],
  interests: ['AI & Machine Learning', 'Healthcare & MedTech', 'Hardware & IoT'],
  availability: ['Weekends', 'Evenings'],
  preferences: ['Hackathon', 'Project', 'Research'],
  hasCompletedOnboarding: true,
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

/**
 * Get the currently logged-in user session
 * @futureEndpoint Supabase: `supabase.auth.getUser()`
 * @returns {Object|null}
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Log in with email and password
 * @futureEndpoint Supabase: `supabase.auth.signInWithPassword({ email, password })`
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function login(email, password) {
  await delay();
  if (!email || !password) {
    throw new Error('Please provide email and password.');
  }

  // If email matches Lukmaan or demo shortcut
  const user = {
    ...DEMO_USER,
    email,
    name: email.toLowerCase().includes('lukmaan') ? 'Lukmaan Hakim' : 'College Innovator',
    hasCompletedOnboarding: true,
  };

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  return user;
}

/**
 * Instant demo login as Lukmaan Hakim
 * @returns {Promise<Object>}
 */
export async function loginAsDemoUser() {
  await delay(150);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_USER));
  return DEMO_USER;
}

/**
 * Register a new user account
 * @futureEndpoint Supabase: `supabase.auth.signUp({ email, password })`
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export async function register(userData) {
  await delay();
  const newUser = {
    id: `student-${Date.now()}`,
    name: userData.name || 'New Student',
    email: userData.email,
    department: 'Computer Science (CSE)',
    year: '1st Year',
    bio: '',
    skills: [],
    interests: [],
    availability: ['Flexible'],
    preferences: ['Project', 'Hackathon'],
    hasCompletedOnboarding: false, // Requires onboarding
  };

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
  return newUser;
}

/**
 * Simulated Google OAuth authentication
 * @futureEndpoint Supabase: `supabase.auth.signInWithOAuth({ provider: 'google' })`
 * @returns {Promise<Object>}
 */
export async function loginWithGoogle() {
  await delay(400);
  const googleUser = {
    ...DEMO_USER,
    email: 'lukmaan.google@campus.edu',
    name: 'Lukmaan Hakim',
    hasCompletedOnboarding: true,
  };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(googleUser));
  return googleUser;
}

/**
 * Log out and clear session
 * @futureEndpoint Supabase: `supabase.auth.signOut()`
 * @returns {Promise<void>}
 */
export async function logout() {
  await delay(100);
  localStorage.removeItem(AUTH_USER_KEY);
}

/**
 * Update authenticated user profile details
 * @futureEndpoint Supabase: `supabase.from('students').update(updates).eq('id', user.id)`
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export async function updateProfile(updates) {
  await delay();
  const current = getCurrentUser() || DEMO_USER;
  const updated = { ...current, ...updates };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
  return updated;
}
