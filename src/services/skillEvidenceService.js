/**
 * Skill Evidence Service Layer
 * Supports live Supabase PostgreSQL queries (`skill_evidence`)
 * with standby local storage fallback when unconfigured.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { INITIAL_SKILL_EVIDENCE, PRACTICAL_ASSESSMENT_TASKS, SKILL_STATUSES } from '../data/skillEvidence.js';

const STORAGE_KEY = 'collabmatrix_skill_evidence';
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

function loadEvidence() {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SKILL_EVIDENCE;
  } catch (e) {
    return INITIAL_SKILL_EVIDENCE;
  }
}

function saveEvidence(items) {
  try {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save skill evidence', e);
  }
}

export async function getSkillEvidences(studentId) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    let query = supabase
      .from('skill_evidence')
      .select(`
        *,
        student:profiles!student_id(id, name, department),
        reviewer:profiles!reviewer_id(id, name, department)
      `)
      .order('created_at', { ascending: false });

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Supabase skill evidence query error: ${error.message}`);
    }

    return (data || []).map((e) => ({
      id: e.id,
      studentId: e.student_id,
      studentName: e.student?.name || 'Student',
      skill: e.skill,
      status: e.status,
      evidenceType: e.evidence_type,
      evidenceUrl: e.evidence_url,
      description: e.description,
      assessmentResult: e.assessment_result,
      reviewer: e.reviewer?.name || null,
      reviewerId: e.reviewer_id,
      reviewDate: e.review_date,
      limitations: e.limitations,
      createdAt: e.created_at,
    }));
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const all = loadEvidence();
  return studentId ? all.filter((e) => e.studentId === studentId) : all;
}

export async function submitSkillEvidence(evidenceData) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('skill_evidence')
      .insert({
        student_id: evidenceData.studentId,
        skill: evidenceData.skill,
        status: SKILL_STATUSES.EVIDENCE_SUBMITTED,
        evidence_type: evidenceData.evidenceType,
        evidence_url: evidenceData.evidenceUrl || null,
        description: evidenceData.description,
        limitations: evidenceData.limitations || 'Evidence submitted by student; awaiting faculty review.',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase submit skill evidence error: ${error.message}`);
    }

    return {
      id: data.id,
      studentId: data.student_id,
      skill: data.skill,
      status: data.status,
      evidenceType: data.evidence_type,
      evidenceUrl: data.evidence_url,
      description: data.description,
      submissionDate: data.created_at?.split('T')[0],
      limitations: data.limitations,
    };
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const all = loadEvidence();
  const newEv = {
    id: `ev-${Date.now()}`,
    status: SKILL_STATUSES.EVIDENCE_SUBMITTED,
    submissionDate: new Date().toISOString().split('T')[0],
    reviewer: null,
    reviewerRole: null,
    reviewDate: null,
    assessmentResult: null,
    limitations: 'Evidence submitted by student; awaiting independent faculty verification.',
    ...evidenceData,
  };
  const updated = [newEv, ...all];
  saveEvidence(updated);
  return newEv;
}

export async function recordPracticalAssessment({ studentId, studentName, skill, taskName, score, rubricScores }) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('skill_evidence')
      .insert({
        student_id: studentId,
        skill,
        status: SKILL_STATUSES.PRACTICALLY_DEMONSTRATED,
        evidence_type: 'CollabMatrix Practical Skill Assessment Sandbox',
        evidence_url: `#assessment-${Date.now()}`,
        description: `Completed interactive practical task: ${taskName}. Evaluated against transparent engineering rubrics.`,
        assessment_result: { taskName, score, rubricScores },
        limitations: 'Performance validated in sandbox benchmark; valid for campus hackathon and team matching.',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase record practical assessment error: ${error.message}`);
    }

    return {
      id: data.id,
      studentId: data.student_id,
      studentName,
      skill: data.skill,
      status: data.status,
      evidenceType: data.evidence_type,
      evidenceUrl: data.evidence_url,
      description: data.description,
      assessmentResult: data.assessment_result,
      submissionDate: data.created_at?.split('T')[0],
      limitations: data.limitations,
    };
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const all = loadEvidence();
  const newEv = {
    id: `ev-${Date.now()}`,
    studentId,
    studentName,
    skill,
    status: SKILL_STATUSES.PRACTICALLY_DEMONSTRATED,
    evidenceType: 'CollabMatrix Practical Skill Assessment Sandbox',
    evidenceUrl: `#assessment-${Date.now()}`,
    submissionDate: new Date().toISOString().split('T')[0],
    description: `Completed interactive practical task: ${taskName}. Evaluated against transparent engineering rubrics.`,
    assessmentResult: {
      taskName,
      score,
      rubricScores,
    },
    reviewer: null,
    reviewerRole: null,
    reviewDate: null,
    limitations: 'Performance validated in sandbox benchmark; valid for campus hackathon and team matching.',
  };
  const updated = [newEv, ...all];
  saveEvidence(updated);
  return newEv;
}

export async function reviewSkillEvidence(evidenceId, { reviewer, reviewerRole, reviewerId, score, limitations, notes }) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('skill_evidence')
      .update({
        status: SKILL_STATUSES.INDEPENDENTLY_REVIEWED,
        reviewer_id: reviewerId || null,
        review_date: new Date().toISOString().split('T')[0],
        limitations: limitations || 'Verified against departmental competency rubrics.',
        updated_at: new Date().toISOString(),
      })
      .eq('id', evidenceId)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase review skill evidence error: ${error.message}`);
    }

    return data;
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const all = loadEvidence();
  const updated = all.map((ev) => {
    if (ev.id !== evidenceId) return ev;
    return {
      ...ev,
      status: SKILL_STATUSES.INDEPENDENTLY_REVIEWED,
      reviewer: reviewer || 'Dr. Aris Thorne',
      reviewerRole: reviewerRole || 'Faculty Supervisor',
      reviewDate: new Date().toISOString().split('T')[0],
      limitations: limitations || ev.limitations,
      reviewNotes: notes || 'Verified against departmental competency rubrics.',
    };
  });
  saveEvidence(updated);
  return updated.find((e) => e.id === evidenceId);
}

export function getAssessmentTasks() {
  return PRACTICAL_ASSESSMENT_TASKS;
}
