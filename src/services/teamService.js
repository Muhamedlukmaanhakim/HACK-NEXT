/**
 * Team Service Layer
 * Supports live Supabase PostgreSQL queries (`teams`, `team_members`, `profiles`)
 * with standby local storage fallback when unconfigured.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { INITIAL_TEAMS } from '../data/teams.js';

const LATENCY_MS = 200;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const LOCAL_STORAGE_KEY = 'collabmatrix_teams';

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

function getStoredTeams() {
  try {
    const raw = safeStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_TEAMS;
  } catch (e) {
    return INITIAL_TEAMS;
  }
}

function saveStoredTeams(teams) {
  try {
    safeStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(teams));
  } catch (e) {
    console.error('Failed to save teams', e);
  }
}

/**
 * Fetch all teams for the active user
 * @returns {Promise<Array>}
 */
export async function getTeams() {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        id, name, opportunity_id, lead_id, faculty_supervisor_id, status, created_at,
        team_members(
          id, role, joined_at, user_id,
          profile:profiles!user_id(id, name, department, avatar_url, role)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase teams query error: ${error.message}`);
    }

    return (data || []).map((t) => ({
      id: t.id,
      name: t.name,
      opportunityId: t.opportunity_id,
      leadId: t.lead_id,
      facultySupervisorId: t.faculty_supervisor_id,
      status: t.status,
      members: (t.team_members || []).map((m) => ({
        id: m.profile?.id || m.user_id,
        name: m.profile?.name || 'Collaborator',
        department: m.profile?.department || '',
        role: m.role || 'Member',
        isOwner: m.profile?.id === t.lead_id || m.user_id === t.lead_id,
        skills: [],
      })),
    }));
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  return getStoredTeams();
}

/**
 * Fetch team by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getTeamById(id) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        id, name, opportunity_id, lead_id, faculty_supervisor_id, status, created_at,
        team_members(
          id, role, joined_at, user_id,
          profile:profiles!user_id(id, name, department, avatar_url, role)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase getTeamById error: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      opportunityId: data.opportunity_id,
      leadId: data.lead_id,
      facultySupervisorId: data.faculty_supervisor_id,
      status: data.status,
      members: (data.team_members || []).map((m) => ({
        id: m.profile?.id || m.user_id,
        name: m.profile?.name || 'Collaborator',
        department: m.profile?.department || '',
        role: m.role || 'Member',
        isOwner: m.profile?.id === data.lead_id || m.user_id === data.lead_id,
        skills: [],
      })),
    };
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const teams = getStoredTeams();
  return teams.find((t) => t.id === id) || null;
}

/**
 * Add a member to a team
 * @param {string} teamId
 * @param {Object} member
 * @returns {Promise<Object>}
 */
export async function addTeamMember(teamId, member) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: member.id,
        role: member.role || 'Member',
      });

    if (error) {
      throw new Error(`Supabase addTeamMember error: ${error.message}`);
    }

    return getTeamById(teamId);
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const teams = getStoredTeams();
  const team = teams.find((t) => t.id === teamId);
  if (!team) throw new Error('Team not found');

  if (team.members.some((m) => m.id === member.id)) {
    return team;
  }

  const newMember = {
    id: member.id,
    name: member.name,
    department: member.department,
    year: member.year,
    role: member.role || 'Collaborator',
    skills: member.skills || [],
    isOwner: false,
  };

  team.members.push(newMember);
  saveStoredTeams(teams);
  return team;
}

/**
 * Remove a non-owner member from a team
 * @param {string} teamId
 * @param {string} memberId
 * @returns {Promise<Object>}
 */
export async function removeTeamMember(teamId, memberId) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .match({ team_id: teamId, user_id: memberId });

    if (error) {
      throw new Error(`Supabase removeTeamMember error: ${error.message}`);
    }

    return getTeamById(teamId);
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const teams = getStoredTeams();
  const team = teams.find((t) => t.id === teamId);
  if (!team) throw new Error('Team not found');

  const targetMember = team.members.find((m) => m.id === memberId);
  if (targetMember?.isOwner) {
    throw new Error('Cannot remove team creator / owner.');
  }

  team.members = team.members.filter((m) => m.id !== memberId);
  saveStoredTeams(teams);
  return team;
}
