/**
 * Collaboration Request Service Layer
 * Supports live Supabase PostgreSQL queries (`collaboration_requests`)
 * with standby local storage fallback when unconfigured.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { INITIAL_REQUESTS } from '../data/requests.js';

const LATENCY_MS = 200;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const LOCAL_STORAGE_KEY = 'collabmatrix_requests';

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

function getStoredRequests() {
  try {
    const raw = safeStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_REQUESTS;
  } catch (e) {
    return INITIAL_REQUESTS;
  }
}

function saveStoredRequests(requests) {
  try {
    safeStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save requests', e);
  }
}

/**
 * Fetch all collaboration requests
 * @param {string} [type] - 'incoming' | 'sent' | undefined
 * @returns {Promise<Array>}
 */
export async function getRequests(type) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    let query = supabase
      .from('collaboration_requests')
      .select(`
        id, type, status, message, created_at, opportunity_id, sender_id, receiver_id,
        sender:profiles!sender_id(id, name, department, avatar_url, role),
        receiver:profiles!receiver_id(id, name, department, avatar_url, role),
        opportunity:projects!opportunity_id(id, title)
      `)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Supabase collaboration requests error: ${error.message}`);
    }

    return (data || []).map((r) => ({
      id: r.id,
      type: r.type,
      status: r.status,
      message: r.message,
      createdAt: r.created_at,
      opportunityId: r.opportunity_id,
      opportunityTitle: r.opportunity?.title || 'Collaboration Project',
      studentId: r.sender_id,
      student: r.sender ? {
        id: r.sender.id,
        name: r.sender.name,
        department: r.sender.department,
        avatar: r.sender.avatar_url,
      } : null,
      matchScore: 90,
    }));
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = getStoredRequests();
  if (type) {
    return list.filter((r) => r.type === type);
  }
  return list;
}

/**
 * Send a new collaboration request
 * @param {Object} requestData
 * @returns {Promise<Object>}
 */
export async function sendRequest(requestData) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const senderId = requestData.senderId || requestData.student?.id;
    const receiverId = requestData.receiverId || requestData.opportunityCreatorId;

    if (!senderId || !receiverId) {
      throw new Error('Both sender and receiver IDs are required for a database collaboration request.');
    }

    const { data, error } = await supabase
      .from('collaboration_requests')
      .insert({
        opportunity_id: requestData.opportunityId,
        sender_id: senderId,
        receiver_id: receiverId,
        type: 'sent',
        status: 'Pending',
        message: requestData.message || 'I would like to collaborate on your project.',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase send request error: ${error.message}`);
    }

    return {
      id: data.id,
      type: 'sent',
      studentId: data.sender_id,
      opportunityId: data.opportunity_id,
      message: data.message,
      matchScore: requestData.matchScore || 90,
      status: data.status,
      createdAt: data.created_at,
    };
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = getStoredRequests();
  const newRequest = {
    id: `req-${Date.now()}`,
    type: 'sent',
    studentId: requestData.studentId || requestData.student?.id,
    student: requestData.student,
    opportunityId: requestData.opportunityId || 'opp-1',
    opportunityTitle: requestData.opportunityTitle || 'AI Healthcare Assistant',
    message: requestData.message || 'I would like to collaborate on your project.',
    matchScore: requestData.matchScore || 90,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  const updated = [newRequest, ...list];
  saveStoredRequests(updated);
  return newRequest;
}

/**
 * Accept an incoming collaboration request
 * @param {string} requestId
 * @returns {Promise<Object>}
 */
export async function acceptRequest(requestId) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('collaboration_requests')
      .update({ status: 'Accepted', updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase accept request error: ${error.message}`);
    }

    return data;
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = getStoredRequests();
  const req = list.find((r) => r.id === requestId);
  if (!req) throw new Error('Request not found');

  req.status = 'Accepted';
  saveStoredRequests(list);
  return req;
}

/**
 * Decline an incoming collaboration request
 * @param {string} requestId
 * @returns {Promise<Object>}
 */
export async function declineRequest(requestId) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('collaboration_requests')
      .update({ status: 'Declined', updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase decline request error: ${error.message}`);
    }

    return data;
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const list = getStoredRequests();
  const req = list.find((r) => r.id === requestId);
  if (!req) throw new Error('Request not found');

  req.status = 'Declined';
  saveStoredRequests(list);
  return req;
}

/**
 * Withdraw a pending sent collaboration request
 * @param {string} requestId
 * @returns {Promise<boolean>}
 */
export async function withdrawRequest(requestId) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('collaboration_requests')
      .delete()
      .eq('id', requestId);

    if (error) {
      throw new Error(`Supabase withdraw request error: ${error.message}`);
    }

    return true;
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  let list = getStoredRequests();
  list = list.filter((r) => r.id !== requestId);
  saveStoredRequests(list);
  return true;
}
