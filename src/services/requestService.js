/**
 * Collaboration Request Service Layer
 * Manages invitations, join requests, acceptances, and declines.
 * Future Supabase table: `public.collaboration_requests`
 */

import { INITIAL_REQUESTS } from '../data/requests';

const LATENCY_MS = 350;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const LOCAL_STORAGE_KEY = 'collabmatrix_requests';

function getStoredRequests() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_REQUESTS;
  } catch (e) {
    return INITIAL_REQUESTS;
  }
}

function saveStoredRequests(requests) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save requests', e);
  }
}

/**
 * Fetch all collaboration requests
 * @futureEndpoint Supabase: `supabase.from('collaboration_requests').select('*, student:students(*)')`
 * @param {string} [type] - 'incoming' | 'sent' | undefined
 * @returns {Promise<Array>}
 */
export async function getRequests(type) {
  await delay();
  const list = getStoredRequests();
  if (type) {
    return list.filter((r) => r.type === type);
  }
  return list;
}

/**
 * Send a new collaboration request
 * @futureEndpoint Supabase: `supabase.from('collaboration_requests').insert([reqData])`
 * @param {Object} requestData
 * @returns {Promise<Object>}
 */
export async function sendRequest(requestData) {
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
 * @futureEndpoint Supabase: `supabase.from('collaboration_requests').update({ status: 'Accepted' }).eq('id', id)`
 * @param {string} requestId
 * @returns {Promise<Object>}
 */
export async function acceptRequest(requestId) {
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
 * @futureEndpoint Supabase: `supabase.from('collaboration_requests').update({ status: 'Declined' }).eq('id', id)`
 * @param {string} requestId
 * @returns {Promise<Object>}
 */
export async function declineRequest(requestId) {
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
 * @futureEndpoint Supabase: `supabase.from('collaboration_requests').delete().eq('id', id)`
 * @param {string} requestId
 * @returns {Promise<boolean>}
 */
export async function withdrawRequest(requestId) {
  await delay();
  let list = getStoredRequests();
  list = list.filter((r) => r.id !== requestId);
  saveStoredRequests(list);
  return true;
}
