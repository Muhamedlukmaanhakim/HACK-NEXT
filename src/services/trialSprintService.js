/**
 * Trial Sprint Service Layer
 * Supports live Supabase PostgreSQL queries (`trial_sprints`, `trial_sprint_participants`)
 * with standby local storage fallback when unconfigured.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { INITIAL_TRIAL_SPRINTS } from '../data/trialSprints.js';

const STORAGE_KEY = 'collabmatrix_trial_sprints';
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

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

function loadSprints() {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_TRIAL_SPRINTS;
  } catch (e) {
    return INITIAL_TRIAL_SPRINTS;
  }
}

function saveSprints(sprints) {
  try {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(sprints));
  } catch (e) {
    console.error('Failed to save sprints', e);
  }
}

export async function getTrialSprints() {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('trial_sprints')
      .select(`
        *,
        participants:trial_sprint_participants(
          *,
          user:profiles!user_id(id, name, department, avatar_url)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase trial sprints error: ${error.message}`);
    }

    return (data || []).map((s) => ({
      id: s.id,
      title: s.title,
      objective: s.objective,
      expectedDeliverable: s.expected_deliverable,
      durationHours: s.duration_hours,
      deadline: s.deadline,
      requiredSkills: s.required_skills || [],
      aiPolicy: s.ai_policy,
      evaluationCriteria: s.evaluation_criteria || [],
      status: s.status,
      createdAt: s.created_at,
      participants: (s.participants || []).map((p) => ({
        id: p.user_id,
        name: p.user?.name || 'Candidate',
        department: p.user?.department || '',
        role: p.role,
        assignedTask: p.assigned_task,
        status: p.status,
        submission: p.submitted_at ? {
          deliverableUrl: p.deliverable_url,
          submissionNotes: p.submission_notes,
          blockersEncountered: p.blockers_encountered,
          submittedAt: p.submitted_at,
        } : null,
        score: p.score,
        feedback: p.feedback,
      })),
    }));
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  return loadSprints();
}

export async function getTrialSprintById(id) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('trial_sprints')
      .select(`
        *,
        participants:trial_sprint_participants(
          *,
          user:profiles!user_id(id, name, department, avatar_url)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase getTrialSprintById error: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      objective: data.objective,
      expectedDeliverable: data.expected_deliverable,
      durationHours: data.duration_hours,
      deadline: data.deadline,
      requiredSkills: data.required_skills || [],
      aiPolicy: data.ai_policy,
      evaluationCriteria: data.evaluation_criteria || [],
      status: data.status,
      createdAt: data.created_at,
      participants: (data.participants || []).map((p) => ({
        id: p.user_id,
        name: p.user?.name || 'Candidate',
        department: p.user?.department || '',
        role: p.role,
        assignedTask: p.assigned_task,
        status: p.status,
        submission: p.submitted_at ? {
          deliverableUrl: p.deliverable_url,
          submissionNotes: p.submission_notes,
          blockersEncountered: p.blockers_encountered,
          submittedAt: p.submitted_at,
        } : null,
        score: p.score,
        feedback: p.feedback,
      })),
    };
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = loadSprints();
  return list.find((s) => s.id === id) || null;
}

export async function createTrialSprint(sprintData) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('trial_sprints')
      .insert({
        team_id: sprintData.teamId || null,
        opportunity_id: sprintData.opportunityId || null,
        created_by_id: sprintData.createdById,
        title: sprintData.title,
        objective: sprintData.objective,
        expected_deliverable: sprintData.expectedDeliverable,
        duration_hours: sprintData.durationHours || 48,
        deadline: sprintData.deadline || null,
        required_skills: sprintData.requiredSkills || [],
        ai_policy: sprintData.aiPolicy || '',
        evaluation_criteria: sprintData.evaluationCriteria || [],
        status: 'Active',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase create trial sprint error: ${error.message}`);
    }

    return getTrialSprintById(data.id);
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = loadSprints();
  const newSprint = {
    id: `sprint-${Date.now()}`,
    status: 'Active',
    createdAt: new Date().toISOString(),
    participants: [],
    ...sprintData,
  };
  const updated = [newSprint, ...list];
  saveSprints(updated);
  return newSprint;
}

export async function submitSprintDeliverable(sprintId, participantId, submissionData) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('trial_sprint_participants')
      .update({
        deliverable_url: submissionData.deliverableUrl || '',
        submission_notes: submissionData.submissionNotes || '',
        blockers_encountered: submissionData.blockersEncountered || '',
        submitted_at: new Date().toISOString(),
      })
      .eq('sprint_id', sprintId)
      .eq('user_id', participantId);

    if (error) {
      throw new Error(`Supabase submit sprint deliverable error: ${error.message}`);
    }

    await supabase
      .from('trial_sprints')
      .update({ status: 'Review Pending', updated_at: new Date().toISOString() })
      .eq('id', sprintId);

    return getTrialSprintById(sprintId);
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = loadSprints();
  const updated = list.map((sprint) => {
    if (sprint.id !== sprintId) return sprint;
    const participants = sprint.participants.map((p) => {
      if (p.id !== participantId) return p;
      return {
        ...p,
        submission: {
          submittedAt: new Date().toISOString(),
          ...submissionData,
        },
      };
    });
    return {
      ...sprint,
      participants,
      status: 'Awaiting Review',
    };
  });
  saveSprints(updated);
  return updated.find((s) => s.id === sprintId);
}

export async function reviewTrialSprint(sprintId, reviewData) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('trial_sprints')
      .update({
        status: reviewData.status || 'Completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sprintId);

    if (error) {
      throw new Error(`Supabase review sprint error: ${error.message}`);
    }

    return getTrialSprintById(sprintId);
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = loadSprints();
  const updated = list.map((sprint) => {
    if (sprint.id !== sprintId) return sprint;
    return {
      ...sprint,
      status: reviewData.status || 'Completed',
      reviewerFeedback: {
        reviewer: reviewData.reviewerName || 'Dr. Aris Thorne',
        reviewerRole: reviewData.reviewerRole || 'Faculty Supervisor',
        reviewedAt: new Date().toISOString(),
        score: reviewData.score || 90,
        notes: reviewData.notes || '',
      },
      retrospectiveNotes: reviewData.retrospectiveNotes || sprint.retrospectiveNotes,
    };
  });
  saveSprints(updated);
  return updated.find((s) => s.id === sprintId);
}

export async function respondToSprintInvitation(sprintId, participantId, responseStatus) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('trial_sprint_participants')
      .update({ status: responseStatus })
      .eq('sprint_id', sprintId)
      .eq('user_id', participantId);

    if (error) {
      throw new Error(`Supabase sprint invitation response error: ${error.message}`);
    }

    return getTrialSprintById(sprintId);
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = loadSprints();
  const updated = list.map((sprint) => {
    if (sprint.id !== sprintId) return sprint;
    const participants = sprint.participants.map((p) => {
      if (p.id !== participantId) return p;
      return { ...p, status: responseStatus };
    });
    return { ...sprint, participants };
  });
  saveSprints(updated);
  return updated.find((s) => s.id === sprintId);
}
