import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as studentService from '../services/studentService';
import * as opportunityService from '../services/opportunityService';
import * as teamService from '../services/teamService';
import * as requestService from '../services/requestService';
import * as trialSprintService from '../services/trialSprintService';
import * as contributionService from '../services/contributionService';
import * as teamHealthService from '../services/teamHealthService';
import * as skillEvidenceService from '../services/skillEvidenceService';

import { INITIAL_STUDENTS } from '../data/students';
import { INITIAL_OPPORTUNITIES } from '../data/opportunities';
import { INITIAL_TEAMS } from '../data/teams';
import { INITIAL_REQUESTS } from '../data/requests';
import { INITIAL_FACULTY } from '../data/faculty';
import { INITIAL_TRIAL_SPRINTS } from '../data/trialSprints';
import { INITIAL_CONTRIBUTIONS } from '../data/contributions';
import { INITIAL_PROJECT_TASKS, INITIAL_HEALTH_ALERTS } from '../data/teamHealth';
import { INITIAL_SKILL_EVIDENCE } from '../data/skillEvidence';
import { INITIAL_TEAM_AGREEMENTS } from '../data/teamAgreements';

const AppDataContext = createContext(null);

const STORAGE_KEYS = {
  STUDENTS: 'collabmatrix_students',
  OPPORTUNITIES: 'collabmatrix_opportunities',
  TEAMS: 'collabmatrix_teams',
  REQUESTS: 'collabmatrix_requests',
  CONNECTIONS: 'collabmatrix_sent_connections',
  FACULTY: 'collabmatrix_faculty',
  TRIAL_SPRINTS: 'collabmatrix_trial_sprints',
  CONTRIBUTIONS: 'collabmatrix_contributions',
  PROJECT_TASKS: 'collabmatrix_project_tasks',
  HEALTH_ALERTS: 'collabmatrix_health_alerts',
  SKILL_EVIDENCE: 'collabmatrix_skill_evidence',
  TEAM_AGREEMENTS: 'collabmatrix_team_agreements',
};

export function AppDataProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [requests, setRequests] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [trialSprints, setTrialSprints] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [healthAlerts, setHealthAlerts] = useState([]);
  const [skillEvidences, setSkillEvidences] = useState([]);
  const [teamAgreements, setTeamAgreements] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TEAM_AGREEMENTS);
      return raw ? JSON.parse(raw) : INITIAL_TEAM_AGREEMENTS;
    } catch (e) {
      return INITIAL_TEAM_AGREEMENTS;
    }
  });

  const [sentConnections, setSentConnections] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  // Load initial datasets from service layers
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sList, oList, tList, rList, spList, cList, taskList, aList, evList] =
        await Promise.all([
          studentService.getStudents(),
          opportunityService.getOpportunities(),
          teamService.getTeams(),
          requestService.getRequests(),
          trialSprintService.getTrialSprints(),
          contributionService.getContributions(),
          teamHealthService.getProjectTasks(),
          teamHealthService.getHealthAlerts(),
          skillEvidenceService.getSkillEvidences(),
        ]);

      setStudents(sList);
      setOpportunities(oList);
      setTeams(tList);
      setRequests(rList);
      setTrialSprints(spList);
      setContributions(cList);
      setProjectTasks(taskList);
      setHealthAlerts(aList);
      setSkillEvidences(evList);

      // Faculty list
      try {
        const rawFac = localStorage.getItem(STORAGE_KEYS.FACULTY);
        setFaculty(rawFac ? JSON.parse(rawFac) : INITIAL_FACULTY);
      } catch (e) {
        setFaculty(INITIAL_FACULTY);
      }
    } catch (error) {
      console.error('Error loading initial app data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Connect action (send connection request)
  const connectStudent = async (student, opportunityTitle = 'AI Healthcare Assistant') => {
    const newReq = await requestService.sendRequest({
      studentId: student.id,
      student,
      opportunityId: 'opp-1',
      opportunityTitle,
      message: `Hi ${student.name.split(' ')[0]}, I came across your profile on CollabMatrix and would love to collaborate!`,
      matchScore: student.matchScore || 90,
    });

    setRequests((prev) => [newReq, ...prev]);
    const updatedConnections = Array.from(new Set([...sentConnections, student.id]));
    setSentConnections(updatedConnections);
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(updatedConnections));
    return newReq;
  };

  // Accept incoming request workflow
  const acceptRequest = async (requestId) => {
    const updatedReq = await requestService.acceptRequest(requestId);
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Accepted' } : r))
    );

    if (updatedReq.student) {
      const newMember = {
        id: updatedReq.student.id,
        name: updatedReq.student.name,
        department: updatedReq.student.department,
        year: updatedReq.student.year,
        role: 'Collaborator',
        skills: updatedReq.student.skills || [],
      };

      const updatedTeam = await teamService.addTeamMember('team-1', newMember);
      setTeams((prev) =>
        prev.map((t) => (t.id === 'team-1' ? updatedTeam : t))
      );

      const opp = await opportunityService.getOpportunityById('opp-1');
      if (opp) {
        const members = opp.currentMembers || [];
        if (!members.some((m) => m.id === newMember.id)) {
          const updatedOpp = await opportunityService.updateOpportunity('opp-1', {
            currentMembers: [...members, newMember],
          });
          setOpportunities((prev) =>
            prev.map((o) => (o.id === 'opp-1' ? updatedOpp : o))
          );
        }
      }
    }
    return updatedReq;
  };

  const declineRequest = async (requestId) => {
    const updatedReq = await requestService.declineRequest(requestId);
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Declined' } : r))
    );
    return updatedReq;
  };

  const addMemberToTeam = async (teamId, member) => {
    const updatedTeam = await teamService.addTeamMember(teamId, member);
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? updatedTeam : t))
    );
    return updatedTeam;
  };

  const removeMemberFromTeam = async (teamId, memberId) => {
    const updatedTeam = await teamService.removeTeamMember(teamId, memberId);
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? updatedTeam : t))
    );
    return updatedTeam;
  };

  const createNewOpportunity = async (oppData) => {
    const created = await opportunityService.createOpportunity(oppData);
    setOpportunities((prev) => [created, ...prev]);
    return created;
  };

  // Trial Sprint actions
  const createTrialSprint = async (sprintData) => {
    const created = await trialSprintService.createTrialSprint(sprintData);
    setTrialSprints((prev) => [created, ...prev]);
    return created;
  };

  const submitSprintDeliverable = async (sprintId, participantId, subData) => {
    const updated = await trialSprintService.submitSprintDeliverable(sprintId, participantId, subData);
    setTrialSprints((prev) => prev.map((s) => (s.id === sprintId ? updated : s)));
    return updated;
  };

  const reviewTrialSprint = async (sprintId, reviewData) => {
    const updated = await trialSprintService.reviewTrialSprint(sprintId, reviewData);
    setTrialSprints((prev) => prev.map((s) => (s.id === sprintId ? updated : s)));
    return updated;
  };

  // Contribution Ledger actions
  const submitContribution = async (contribData) => {
    const created = await contributionService.submitContribution(contribData);
    setContributions((prev) => [created, ...prev]);
    return created;
  };

  const reviewContribution = async (contribId, reviewData) => {
    const updated = await contributionService.reviewContribution(contribId, reviewData);
    setContributions((prev) => prev.map((c) => (c.id === contribId ? updated : c)));
    return updated;
  };

  const disputeContribution = async (contribId, disputeData) => {
    const updated = await contributionService.disputeContribution(contribId, disputeData);
    setContributions((prev) => prev.map((c) => (c.id === contribId ? updated : c)));
    return updated;
  };

  // Health Radar actions
  const createProjectTask = async (taskData) => {
    const created = await teamHealthService.createProjectTask(taskData);
    setProjectTasks((prev) => [...prev, created]);
    return created;
  };

  const updateProjectTask = async (taskId, updates) => {
    const updated = await teamHealthService.updateProjectTask(taskId, updates);
    setProjectTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  };

  const acknowledgeHealthAlert = async (alertId, actor) => {
    const updated = await teamHealthService.acknowledgeHealthAlert(alertId, actor);
    setHealthAlerts((prev) => prev.map((a) => (a.id === alertId ? updated : a)));
    return updated;
  };

  const resolveHealthAlert = async (alertId, note) => {
    const updated = await teamHealthService.resolveHealthAlert(alertId, note);
    setHealthAlerts((prev) => prev.map((a) => (a.id === alertId ? updated : a)));
    return updated;
  };

  // Skill Evidence actions
  const submitSkillEvidence = async (evData) => {
    const created = await skillEvidenceService.submitSkillEvidence(evData);
    setSkillEvidences((prev) => [created, ...prev]);
    return created;
  };

  const recordPracticalAssessment = async (assessData) => {
    const created = await skillEvidenceService.recordPracticalAssessment(assessData);
    setSkillEvidences((prev) => [created, ...prev]);
    return created;
  };

  const reviewSkillEvidence = async (evId, revData) => {
    const updated = await skillEvidenceService.reviewSkillEvidence(evId, revData);
    setSkillEvidences((prev) => prev.map((e) => (e.id === evId ? updated : e)));
    return updated;
  };

  // Team Agreement actions
  const acknowledgeAgreement = (agreementId, student) => {
    const updated = teamAgreements.map((ag) => {
      if (ag.id !== agreementId) return ag;
      const existing = ag.signOffs || [];
      if (existing.some((s) => s.studentId === student.id)) return ag;
      return {
        ...ag,
        signOffs: [
          ...existing,
          {
            studentId: student.id,
            name: student.name,
            signedAt: new Date().toISOString(),
            status: 'Acknowledged',
          },
        ],
      };
    });
    setTeamAgreements(updated);
    localStorage.setItem(STORAGE_KEYS.TEAM_AGREEMENTS, JSON.stringify(updated));
  };

  // Reset to initial seed state
  const resetToSeedData = () => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_OPPORTUNITIES));
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(INITIAL_TEAMS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(INITIAL_FACULTY));
    localStorage.setItem(STORAGE_KEYS.TRIAL_SPRINTS, JSON.stringify(INITIAL_TRIAL_SPRINTS));
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(INITIAL_CONTRIBUTIONS));
    localStorage.setItem(STORAGE_KEYS.PROJECT_TASKS, JSON.stringify(INITIAL_PROJECT_TASKS));
    localStorage.setItem(STORAGE_KEYS.HEALTH_ALERTS, JSON.stringify(INITIAL_HEALTH_ALERTS));
    localStorage.setItem(STORAGE_KEYS.SKILL_EVIDENCE, JSON.stringify(INITIAL_SKILL_EVIDENCE));
    localStorage.setItem(STORAGE_KEYS.TEAM_AGREEMENTS, JSON.stringify(INITIAL_TEAM_AGREEMENTS));
    localStorage.removeItem(STORAGE_KEYS.CONNECTIONS);

    setStudents(INITIAL_STUDENTS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setTeams(INITIAL_TEAMS);
    setRequests(INITIAL_REQUESTS);
    setFaculty(INITIAL_FACULTY);
    setTrialSprints(INITIAL_TRIAL_SPRINTS);
    setContributions(INITIAL_CONTRIBUTIONS);
    setProjectTasks(INITIAL_PROJECT_TASKS);
    setHealthAlerts(INITIAL_HEALTH_ALERTS);
    setSkillEvidences(INITIAL_SKILL_EVIDENCE);
    setTeamAgreements(INITIAL_TEAM_AGREEMENTS);
    setSentConnections([]);
  };

  return (
    <AppDataContext.Provider
      value={{
        students,
        opportunities,
        teams,
        requests,
        faculty,
        trialSprints,
        contributions,
        projectTasks,
        healthAlerts,
        skillEvidences,
        teamAgreements,
        sentConnections,
        loading,
        connectStudent,
        acceptRequest,
        declineRequest,
        addMemberToTeam,
        removeMemberFromTeam,
        createNewOpportunity,
        createTrialSprint,
        submitSprintDeliverable,
        reviewTrialSprint,
        submitContribution,
        reviewContribution,
        disputeContribution,
        createProjectTask,
        updateProjectTask,
        acknowledgeHealthAlert,
        resolveHealthAlert,
        submitSkillEvidence,
        recordPracticalAssessment,
        reviewSkillEvidence,
        acknowledgeAgreement,
        resetToSeedData,
        refreshData: loadData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
