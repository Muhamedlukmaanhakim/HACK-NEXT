/**
 * Team Health Radar Service Layer
 * Supports live Supabase PostgreSQL queries (`tasks`, `team_health_alerts`)
 * with standby local storage fallback when unconfigured.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { INITIAL_PROJECT_TASKS, INITIAL_HEALTH_ALERTS } from '../data/teamHealth.js';

export const PROJECT_HEALTH_STATUS = {
  ON_TRACK: 'On Track',
  NEEDS_ATTENTION: 'Needs Attention',
  AT_RISK: 'At Risk',
  INSUFFICIENT_DATA: 'Insufficient Data',
};

export const HEALTH_RISK_TYPES = {
  UNASSIGNED_ESSENTIAL: 'UNASSIGNED_ESSENTIAL',
  OVERDUE_CRITICAL: 'OVERDUE_CRITICAL',
  BUS_FACTOR_ONE: 'BUS_FACTOR_ONE',
  WORKLOAD_IMBALANCE: 'WORKLOAD_IMBALANCE',
  CAPABILITY_GAP: 'CAPABILITY_GAP',
};

const TASKS_STORAGE_KEY = 'collabmatrix_project_tasks';
const ALERTS_STORAGE_KEY = 'collabmatrix_health_alerts';
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

function loadTasks() {
  try {
    const raw = safeStorage.getItem(TASKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_PROJECT_TASKS;
  } catch (e) {
    return INITIAL_PROJECT_TASKS;
  }
}

function saveTasks(tasks) {
  try {
    safeStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}

function loadAlerts() {
  try {
    const raw = safeStorage.getItem(ALERTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_HEALTH_ALERTS;
  } catch (e) {
    return INITIAL_HEALTH_ALERTS;
  }
}

function saveAlerts(alerts) {
  try {
    safeStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts', e);
  }
}

export async function getProjectTasks(teamId = 'team-1') {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        assignee:profiles!assigned_to_id(id, name, department)
      `)
      .order('created_at', { ascending: true });

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Supabase tasks query error: ${error.message}`);
    }

    return (data || []).map((t) => ({
      id: t.id,
      teamId: t.team_id,
      title: t.title,
      deliverable: t.deliverable,
      assignedToId: t.assigned_to_id,
      assignedToName: t.assignee?.name || 'Unassigned',
      isEssential: t.is_essential,
      requiredSkill: t.required_skill,
      deadline: t.deadline,
      status: t.status,
      dependsOnTaskId: t.depends_on_task_id,
      estimatedHours: t.estimated_hours,
    }));
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const all = loadTasks();
  return teamId ? all.filter((t) => t.teamId === teamId) : all;
}

export async function createProjectTask(taskData) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        team_id: taskData.teamId || 'team-1',
        title: taskData.title,
        deliverable: taskData.deliverable || '',
        assigned_to_id: taskData.assignedToId || null,
        is_essential: Boolean(taskData.isEssential),
        required_skill: taskData.requiredSkill || '',
        deadline: taskData.deadline || null,
        status: taskData.status || 'Todo',
        depends_on_task_id: taskData.dependsOnTaskId || null,
        estimated_hours: Number(taskData.estimatedHours) || 5,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase create task error: ${error.message}`);
    }

    return {
      id: data.id,
      ...taskData,
    };
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const all = loadTasks();
  const newTask = {
    id: `task-${Date.now()}`,
    status: 'Todo',
    ...taskData,
  };
  const updated = [...all, newTask];
  saveTasks(updated);
  return newTask;
}

export async function updateProjectTask(taskId, updates) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const payload = { updated_at: new Date().toISOString() };
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.assignedToId !== undefined) payload.assigned_to_id = updates.assignedToId;
    if (updates.deadline !== undefined) payload.deadline = updates.deadline;
    if (updates.title !== undefined) payload.title = updates.title;

    const { data, error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase update task error: ${error.message}`);
    }

    return data;
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const all = loadTasks();
  const updated = all.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
  saveTasks(updated);
  return updated.find((t) => t.id === taskId);
}

export async function getHealthAlerts(teamId = 'team-1') {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    let query = supabase
      .from('team_health_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Supabase health alerts query error: ${error.message}`);
    }

    return (data || []).map((a) => ({
      id: a.id,
      teamId: a.team_id,
      title: a.title,
      severity: a.severity,
      category: a.category,
      deliverableAffected: a.deliverable_affected,
      whatDetected: a.what_detected,
      supportingEvidence: a.supporting_evidence,
      missingInformation: a.missing_information,
      recommendedActions: a.recommended_actions || [],
      status: a.status,
    }));
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const all = loadAlerts();
  return teamId ? all.filter((a) => a.teamId === teamId) : all;
}

export async function acknowledgeHealthAlert(alertId, acknowledgedBy = 'Team Lead', acknowledgedById = null) {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('team_health_alerts')
      .update({
        status: 'Acknowledged',
        acknowledged_by_id: acknowledgedById || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', alertId)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase acknowledge alert error: ${error.message}`);
    }

    return data;
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const all = loadAlerts();
  const updated = all.map((a) =>
    a.id === alertId ? { ...a, status: 'Acknowledged', acknowledgedBy } : a
  );
  saveAlerts(updated);
  return updated.find((a) => a.id === alertId);
}

export async function resolveHealthAlert(alertId, resolutionNote = 'Resolved') {
  // LIVE SUPABASE POSTGRESQL PATH
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('team_health_alerts')
      .update({
        status: 'Resolved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', alertId)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase resolve alert error: ${error.message}`);
    }

    return data;
  }

  // LOCAL STANDBY FALLBACK
  await delay();
  const all = loadAlerts();
  const updated = all.map((a) =>
    a.id === alertId
      ? {
          ...a,
          status: 'Resolved',
          recommendedActions: [...a.recommendedActions, `[RESOLVED]: ${resolutionNote}`],
        }
      : a
  );
  saveAlerts(updated);
  return updated.find((a) => a.id === alertId);
}

/**
 * Deterministic Team Health calculation based on real project state
 * @param {Object} team
 * @param {Array} tasks
 * @param {Array} alerts
 * @returns {Object} { status: 'On Track' | 'Needs Attention' | 'At Risk' | 'Insufficient Data', metrics: Object, riskFactors: Array }
 */
export function evaluateTeamHealth(team, tasks = [], alerts = []) {
  if (!team || (!tasks.length && !alerts.length)) {
    return {
      status: 'Insufficient Data',
      badgeColor: 'text-ink/60 bg-white',
      score: 50,
      summary: 'Insufficient project deliverable and dependency records to compute an accurate risk index.',
      riskFactors: [],
    };
  }

  const todayStr = '2026-10-09';
  const members = team.members || [];
  const requiredSkills = team.requiredSkills || [];

  const activeAlerts = alerts.filter((a) => a.status === 'Active');
  const highSeverityAlerts = activeAlerts.filter((a) => a.severity === 'High');

  // Check 1: Overdue tasks
  const overdueTasks = tasks.filter(
    (t) => t.deadline && t.deadline < todayStr && t.status !== 'Completed'
  );

  // Check 2: Unassigned essential tasks
  const unassignedEssentialTasks = tasks.filter((t) => t.isEssential && !t.assignedToId);

  // Check 3: Single point of failure skills (only 1 member covering required skill)
  const singlePointSkills = [];
  requiredSkills.forEach((skill) => {
    const matchingMembers = members.filter((m) =>
      (m.skills || []).some((s) => s.toLowerCase() === skill.toLowerCase())
    );
    if (matchingMembers.length === 1) {
      singlePointSkills.push({ skill, member: matchingMembers[0] });
    }
  });

  const riskFactors = [];

  if (unassignedEssentialTasks.length > 0) {
    riskFactors.push({
      type: HEALTH_RISK_TYPES.UNASSIGNED_ESSENTIAL,
      severity: 'High',
      title: `${unassignedEssentialTasks.length} Essential Deliverable(s) Unassigned`,
      description: `Critical tasks on the critical path have no active owner: "${unassignedEssentialTasks.map((t) => t.title).join('", "')}".`,
      evidence: `Deliverable milestone: ${unassignedEssentialTasks[0].deliverable || 'Core component'}.`,
      action: 'Assign an owner from the roster or initiate an invitation request.',
    });
  }

  if (overdueTasks.length > 0) {
    riskFactors.push({
      type: HEALTH_RISK_TYPES.OVERDUE_CRITICAL,
      severity: 'High',
      title: `${overdueTasks.length} Deliverable(s) Past Milestone Deadline`,
      description: `Task "${overdueTasks[0].title}" had deadline ${overdueTasks[0].deadline} and is not yet completed.`,
      evidence: `Assigned to: ${overdueTasks[0].assignedToName || 'Unassigned'}.`,
      action: 'Re-negotiate milestone deadline or reallocate tasks.',
    });
  }

  if (singlePointSkills.length > 0) {
    riskFactors.push({
      type: HEALTH_RISK_TYPES.BUS_FACTOR_ONE,
      severity: 'Medium',
      title: `Bus Factor 1 Detected on ${singlePointSkills.length} Required Capability(ies)`,
      description: `Single points of failure: ${singlePointSkills.map((s) => `${s.skill} (sole owner: ${s.member.name})`).join(', ')}.`,
      evidence: 'If key member becomes unavailable, delivery of dependent deliverables halts.',
      action: 'Pair program or cross-train a secondary teammate.',
    });
  }

  // Determine Overall Status
  let status = PROJECT_HEALTH_STATUS.ON_TRACK;
  let badgeColor = 'bg-campus-green text-white';
  let score = 92;
  let summary = 'Squad is progressing normally. Deliverables and member allocations are balanced.';

  if (highSeverityAlerts.length > 0 || overdueTasks.length > 0 || unassignedEssentialTasks.length > 1) {
    status = PROJECT_HEALTH_STATUS.AT_RISK;
    badgeColor = 'bg-brutal-red text-white';
    score = 38;
    summary = 'Critical delivery bottlenecks detected. Immediate intervention recommended.';
  } else if (riskFactors.length > 0 || activeAlerts.length > 0) {
    status = PROJECT_HEALTH_STATUS.NEEDS_ATTENTION;
    badgeColor = 'bg-signal-yellow text-ink';
    score = 68;
    summary = 'Deliverable friction or bus factor vulnerability detected. Monitor task assignments.';
  }

  return {
    status,
    badgeColor,
    score,
    summary,
    riskFactors,
    unassignedCount: unassignedEssentialTasks.length,
    overdueCount: overdueTasks.length,
    singlePointCount: singlePointSkills.length,
    metrics: {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'Completed').length,
      overdueTasksCount: overdueTasks.length,
      unassignedEssentialCount: unassignedEssentialTasks.length,
      singlePointSkillsCount: singlePointSkills.length,
      activeAlertsCount: activeAlerts.length,
    },
  };
}
