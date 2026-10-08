/**
 * Team Service Layer
 * Manages active team rosters, member assignments, and skill alignments.
 * Future Supabase table: `public.teams` and `public.team_members`
 */

import { INITIAL_TEAMS } from '../data/teams';

const LATENCY_MS = 350;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const LOCAL_STORAGE_KEY = 'collabmatrix_teams';

function getStoredTeams() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_TEAMS;
  } catch (e) {
    return INITIAL_TEAMS;
  }
}

function saveStoredTeams(teams) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(teams));
  } catch (e) {
    console.error('Failed to save teams', e);
  }
}

/**
 * Fetch all teams for the active user
 * @futureEndpoint Supabase: `supabase.from('teams').select('*, members:team_members(*)')`
 * @returns {Promise<Array>}
 */
export async function getTeams() {
  await delay();
  return getStoredTeams();
}

/**
 * Fetch team by ID
 * @futureEndpoint Supabase: `supabase.from('teams').select('*, members:team_members(*)').eq('id', id).single()`
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getTeamById(id) {
  await delay();
  const teams = getStoredTeams();
  return teams.find((t) => t.id === id) || null;
}

/**
 * Add a member to a team
 * @futureEndpoint Supabase: `supabase.from('team_members').insert({ team_id, user_id, role })`
 * @param {string} teamId
 * @param {Object} member
 * @returns {Promise<Object>}
 */
export async function addTeamMember(teamId, member) {
  await delay();
  const teams = getStoredTeams();
  const team = teams.find((t) => t.id === teamId);
  if (!team) throw new Error('Team not found');

  // Prevent duplicate
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
 * @futureEndpoint Supabase: `supabase.from('team_members').delete().match({ team_id, user_id })`
 * @param {string} teamId
 * @param {string} memberId
 * @returns {Promise<Object>}
 */
export async function removeTeamMember(teamId, memberId) {
  await delay();
  const teams = getStoredTeams();
  const team = teams.find((t) => t.id === teamId);
  if (!team) throw new Error('Team not found');

  // Do not allow removing owner
  const targetMember = team.members.find((m) => m.id === memberId);
  if (targetMember?.isOwner) {
    throw new Error('Cannot remove team creator / owner.');
  }

  team.members = team.members.filter((m) => m.id !== memberId);
  saveStoredTeams(teams);
  return team;
}
