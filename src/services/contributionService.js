/**
 * Contribution Ledger Service Layer
 * Supports live Supabase PostgreSQL queries (`contributions`, `contribution_audits`)
 * with standby local storage fallback when unconfigured.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { INITIAL_CONTRIBUTIONS } from '../data/contributions.js';

const STORAGE_KEY = 'collabmatrix_contributions';
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

function loadContributions() {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CONTRIBUTIONS;
  } catch (e) {
    return INITIAL_CONTRIBUTIONS;
  }
}

function saveContributions(items) {
  try {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save contributions', e);
  }
}

export async function getContributions(filter = {}) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    let query = supabase
      .from('contributions')
      .select(`
        *,
        contributor:profiles!contributor_id(id, name, department, avatar_url),
        reviewer:profiles!reviewer_id(id, name, department),
        audits:contribution_audits(*)
      `)
      .order('created_at', { ascending: false });

    if (filter.teamId) query = query.eq('team_id', filter.teamId);
    if (filter.contributorId) query = query.eq('contributor_id', filter.contributorId);
    if (filter.status) query = query.eq('status', filter.status);

    const { data, error } = await query;
    if (error) {
      throw new Error(`Supabase contributions error: ${error.message}`);
    }

    return (data || []).map((c) => ({
      id: c.id,
      teamId: c.team_id,
      contributorId: c.contributor_id,
      contributorName: c.contributor?.name || 'Contributor',
      taskTitle: c.task_title,
      description: c.description,
      date: c.date,
      category: c.category,
      evidenceType: c.evidence_type,
      evidenceUrl: c.evidence_url,
      aiDisclosure: c.ai_disclosure,
      status: c.status,
      reviewerId: c.reviewer_id,
      reviewerName: c.reviewer?.name || null,
      reviewNotes: c.review_notes,
      reviewedAt: c.reviewed_at,
      auditHistory: (c.audits || []).map((a) => ({
        action: a.action,
        timestamp: a.created_at,
        actor: a.actor_id,
      })),
    }));
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  let list = loadContributions();
  if (filter.teamId) list = list.filter((c) => c.teamId === filter.teamId);
  if (filter.contributorId) list = list.filter((c) => c.contributorId === filter.contributorId);
  if (filter.status) list = list.filter((c) => c.status === filter.status);
  return list;
}

export async function submitContribution(data) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data: contrib, error } = await supabase
      .from('contributions')
      .insert({
        team_id: data.teamId || null,
        opportunity_id: data.opportunityId || null,
        contributor_id: data.contributorId,
        task_title: data.taskTitle,
        description: data.description,
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || 'Engineering',
        evidence_type: data.evidenceType,
        evidence_url: data.evidenceUrl,
        ai_disclosure: data.aiDisclosure,
        status: 'Submitted',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase submit contribution error: ${error.message}`);
    }

    // Insert audit log
    await supabase.from('contribution_audits').insert({
      contribution_id: contrib.id,
      action: 'Submitted',
      actor_id: data.contributorId,
    });

    return {
      id: contrib.id,
      ...data,
      status: 'Submitted',
      auditHistory: [
        { action: 'Submitted', timestamp: new Date().toISOString(), actor: data.contributorName || 'Contributor' },
      ],
    };
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = loadContributions();
  const newContrib = {
    id: `contrib-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Submitted',
    reviewerId: null,
    reviewerName: null,
    reviewerRole: null,
    reviewNotes: null,
    reviewedAt: null,
    auditHistory: [
      { action: 'Submitted', timestamp: new Date().toISOString(), actor: data.contributorName || 'Contributor' },
    ],
    ...data,
  };
  const updated = [newContrib, ...list];
  saveContributions(updated);
  return newContrib;
}

export async function reviewContribution(contribId, { status = 'Reviewed', reviewerName, reviewerRole, reviewerId, reviewNotes }) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('contributions')
      .update({
        status,
        reviewer_id: reviewerId || null,
        review_notes: reviewNotes || 'Evidence inspected and verified.',
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', contribId)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase review contribution error: ${error.message}`);
    }

    if (reviewerId) {
      await supabase.from('contribution_audits').insert({
        contribution_id: contribId,
        action: `Status changed to ${status}`,
        actor_id: reviewerId,
      });
    }

    return data;
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = loadContributions();
  const updated = list.map((item) => {
    if (item.id !== contribId) return item;
    const history = item.auditHistory || [];
    return {
      ...item,
      status,
      reviewerId: reviewerId || 'faculty-1',
      reviewerName: reviewerName || 'Faculty Supervisor',
      reviewerRole: reviewerRole || 'Faculty Supervisor',
      reviewNotes: reviewNotes || 'Evidence inspected and verified against project requirements.',
      reviewedAt: new Date().toISOString(),
      auditHistory: [
        ...history,
        { action: `Status changed to ${status}`, timestamp: new Date().toISOString(), actor: reviewerName || 'Reviewer' },
      ],
    };
  });
  saveContributions(updated);
  return updated.find((c) => c.id === contribId);
}

export async function disputeContribution(contribId, { studentName, disputeReason, studentId }) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('contributions')
      .update({
        status: 'Disputed',
        review_notes: `Dispute flagged: "${disputeReason}". Awaiting faculty mediation.`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contribId)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase dispute contribution error: ${error.message}`);
    }

    if (studentId) {
      await supabase.from('contribution_audits').insert({
        contribution_id: contribId,
        action: `Disputed: ${disputeReason}`,
        actor_id: studentId,
      });
    }

    return data;
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = loadContributions();
  const updated = list.map((item) => {
    if (item.id !== contribId) return item;
    const history = item.auditHistory || [];
    return {
      ...item,
      status: 'Disputed',
      reviewNotes: `Dispute flagged: "${disputeReason}". Awaiting faculty mediation.`,
      auditHistory: [
        ...history,
        { action: `Disputed by ${studentName}: ${disputeReason}`, timestamp: new Date().toISOString(), actor: studentName },
      ],
    };
  });
  saveContributions(updated);
  return updated.find((c) => c.id === contribId);
}

export async function requestClarification(contribId, { reviewerName, clarificationPrompt, reviewerId }) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('contributions')
      .update({
        status: 'Needs Clarification',
        review_notes: `Clarification requested: "${clarificationPrompt}".`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contribId)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase request clarification error: ${error.message}`);
    }

    if (reviewerId) {
      await supabase.from('contribution_audits').insert({
        contribution_id: contribId,
        action: `Clarification requested: ${clarificationPrompt}`,
        actor_id: reviewerId,
      });
    }

    return data;
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = loadContributions();
  const updated = list.map((item) => {
    if (item.id !== contribId) return item;
    const history = item.auditHistory || [];
    return {
      ...item,
      status: 'Needs Clarification',
      reviewNotes: `Clarification requested: "${clarificationPrompt}".`,
      auditHistory: [
        ...history,
        { action: `Clarification requested: ${clarificationPrompt}`, timestamp: new Date().toISOString(), actor: reviewerName },
      ],
    };
  });
  saveContributions(updated);
  return updated.find((c) => c.id === contribId);
}
