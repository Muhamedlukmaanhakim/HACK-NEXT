/**
 * Opportunity Service Layer
 * Manages project postings and collaboration listings.
 * Future Supabase table: `public.opportunities`
 */

import { INITIAL_OPPORTUNITIES } from '../data/opportunities';

const LATENCY_MS = 400;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const LOCAL_STORAGE_KEY = 'collabmatrix_opportunities';

function getStoredOpportunities() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_OPPORTUNITIES;
  } catch (e) {
    return INITIAL_OPPORTUNITIES;
  }
}

function saveStoredOpportunities(opps) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(opps));
  } catch (e) {
    console.error('Failed to save opportunities', e);
  }
}

/**
 * Fetch all collaboration opportunities with optional filters
 * @futureEndpoint Supabase: `supabase.from('opportunities').select('*, currentMembers(*)')`
 * @param {Object} [filters]
 * @returns {Promise<Array>}
 */
export async function getOpportunities(filters = {}) {
  await delay();
  let list = getStoredOpportunities();

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        (o.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
    );
  }

  if (filters.projectType) {
    list = list.filter((o) => o.type === filters.projectType);
  }

  if (filters.status) {
    list = list.filter((o) => o.status === filters.status);
  }

  return list;
}

/**
 * Fetch a single opportunity by ID
 * @futureEndpoint Supabase: `supabase.from('opportunities').select('*, currentMembers(*)').eq('id', id).single()`
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getOpportunityById(id) {
  await delay();
  const list = getStoredOpportunities();
  return list.find((o) => o.id === id) || null;
}

/**
 * Create a new collaboration opportunity
 * @futureEndpoint Supabase: `supabase.from('opportunities').insert([opportunityData]).select()`
 * @param {Object} opportunityData
 * @returns {Promise<Object>}
 */
export async function createOpportunity(opportunityData) {
  await delay();
  const list = getStoredOpportunities();
  const newId = `opp-${Date.now()}`;

  const newOpp = {
    id: newId,
    title: opportunityData.title,
    type: opportunityData.type || 'Project',
    creator: opportunityData.creator || {
      id: 'student-1',
      name: 'Lukmaan Hakim',
      department: 'Computer Science (CSE)',
    },
    description: opportunityData.description,
    requiredSkills: opportunityData.requiredSkills || [],
    interests: opportunityData.interests || [],
    availability: opportunityData.availability || ['Flexible'],
    teamSize: Number(opportunityData.teamSize) || 4,
    currentMembers: [
      {
        id: opportunityData.creator?.id || 'student-1',
        name: opportunityData.creator?.name || 'Lukmaan Hakim',
        role: 'Creator / Team Lead',
        department: opportunityData.creator?.department || 'Computer Science (CSE)',
        year: '2nd Year',
        skills: ['Python', 'AI/ML', 'Backend'],
      },
    ],
    status: 'Open',
    matchScore: 92,
    createdAt: new Date().toISOString(),
  };

  const updatedList = [newOpp, ...list];
  saveStoredOpportunities(updatedList);
  return newOpp;
}

/**
 * Update opportunity details
 * @futureEndpoint Supabase: `supabase.from('opportunities').update(updates).eq('id', id)`
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export async function updateOpportunity(id, updates) {
  await delay();
  const list = getStoredOpportunities();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error('Opportunity not found');

  const updated = { ...list[idx], ...updates };
  list[idx] = updated;
  saveStoredOpportunities(list);
  return updated;
}
