/**
 * Opportunity / Project Service Layer
 * Supports live Supabase PostgreSQL queries with seamless fallback
 * to local state when unconfigured (standby mode).
 * Strict Rule: Real database errors are never masked by silent fallbacks to local storage.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { INITIAL_OPPORTUNITIES } from '../data/opportunities.js';

const LATENCY_MS = 200;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const LOCAL_STORAGE_KEY = 'collabmatrix_opportunities';

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

function getStoredOpportunities() {
  try {
    const raw = safeStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_OPPORTUNITIES;
  } catch (e) {
    return INITIAL_OPPORTUNITIES;
  }
}

function saveStoredOpportunities(opps) {
  try {
    safeStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(opps));
  } catch (e) {
    console.error('Failed to save opportunities', e);
  }
}

/**
 * Fetch all collaboration opportunities with optional filters
 * @param {Object} [filters]
 * @returns {Promise<Array>}
 */
export async function getOpportunities(filters = {}) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    let query = supabase
      .from('projects')
      .select('*, creator:profiles!creator_id(id, name, department, role)')
      .order('created_at', { ascending: false });

    if (filters.projectType) {
      query = query.eq('project_type', filters.projectType);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    let list = (data || []).map((p) => ({
      id: p.id,
      title: p.title,
      type: p.project_type,
      creator: p.creator || { id: p.creator_id, name: 'Project Lead', department: p.department },
      description: p.description,
      requiredSkills: p.required_skills || [],
      interests: p.interests || [],
      availability: p.availability || [],
      teamSize: p.team_size,
      status: p.status,
      currentMembers: p.creator ? [{ ...p.creator, role: 'Lead' }] : [],
      matchScore: 90,
      createdAt: p.created_at,
    }));

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          (o.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
      );
    }

    return list;
  }

  // LOCAL STANDBY FALLBACK (Only when unconfigured)
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
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getOpportunityById(id) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .select('*, creator:profiles!creator_id(id, name, department, role)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase fetch failed: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      type: data.project_type,
      creator: data.creator || { id: data.creator_id, name: 'Project Lead', department: data.department },
      description: data.description,
      requiredSkills: data.required_skills || [],
      interests: data.interests || [],
      availability: data.availability || [],
      teamSize: data.team_size,
      status: data.status,
      currentMembers: data.creator ? [{ ...data.creator, role: 'Lead' }] : [],
      matchScore: 92,
      createdAt: data.created_at,
    };
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = getStoredOpportunities();
  return list.find((o) => o.id === id) || null;
}

/**
 * Create a new collaboration opportunity
 * @param {Object} opportunityData
 * @returns {Promise<Object>}
 */
export async function createOpportunity(opportunityData) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const creatorId = opportunityData.creator?.id;
    if (!creatorId) {
      throw new Error('Creator ID is required to create a project in Supabase.');
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          creator_id: creatorId,
          title: opportunityData.title,
          description: opportunityData.description,
          project_type: opportunityData.type || 'Project',
          team_size: Number(opportunityData.teamSize) || 4,
          required_skills: opportunityData.requiredSkills || [],
          interests: opportunityData.interests || [],
          availability: opportunityData.availability || ['Flexible'],
          department: opportunityData.creator?.department || '',
          status: 'Open',
          is_faculty_initiative: Boolean(opportunityData.isFacultyInitiative),
          min_evidence_tier: opportunityData.minEvidenceTier || 'SELF_DECLARED',
          require_trial_sprint: Boolean(opportunityData.requireTrialSprint),
        },
      ])
      .select('*, creator:profiles!creator_id(id, name, department, role)')
      .single();

    if (error) {
      throw new Error(`Supabase create project error: ${error.message}`);
    }

    return {
      id: data.id,
      title: data.title,
      type: data.project_type,
      creator: data.creator || opportunityData.creator,
      description: data.description,
      requiredSkills: data.required_skills || [],
      interests: data.interests || [],
      availability: data.availability || [],
      teamSize: data.team_size,
      status: data.status,
      currentMembers: [{ ...opportunityData.creator, role: 'Creator' }],
      matchScore: 90,
      createdAt: data.created_at,
    };
  }

  // LOCAL STANDBY FALLBACK
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
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export async function updateOpportunity(id, updates) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const payload = {
      updated_at: new Date().toISOString(),
    };
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.teamSize !== undefined) payload.team_size = Number(updates.teamSize);
    if (updates.requiredSkills !== undefined) payload.required_skills = updates.requiredSkills;

    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id)
      .select('*, creator:profiles!creator_id(id, name, department, role)')
      .single();

    if (error) {
      throw new Error(`Supabase update project error: ${error.message}`);
    }

    return {
      id: data.id,
      title: data.title,
      type: data.project_type,
      creator: data.creator || { id: data.creator_id, name: 'Project Lead', department: data.department },
      description: data.description,
      requiredSkills: data.required_skills || [],
      interests: data.interests || [],
      availability: data.availability || [],
      teamSize: data.team_size,
      status: data.status,
      currentMembers: [],
      matchScore: 92,
      createdAt: data.created_at,
    };
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = getStoredOpportunities();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error('Opportunity not found');

  const updated = { ...list[idx], ...updates };
  list[idx] = updated;
  saveStoredOpportunities(list);
  return updated;
}
