import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as studentService from '../services/studentService';
import * as opportunityService from '../services/opportunityService';
import * as teamService from '../services/teamService';
import * as requestService from '../services/requestService';
import { INITIAL_STUDENTS } from '../data/students';
import { INITIAL_OPPORTUNITIES } from '../data/opportunities';
import { INITIAL_TEAMS } from '../data/teams';
import { INITIAL_REQUESTS } from '../data/requests';

const AppDataContext = createContext(null);

const STORAGE_KEYS = {
  STUDENTS: 'collabmatrix_students',
  OPPORTUNITIES: 'collabmatrix_opportunities',
  TEAMS: 'collabmatrix_teams',
  REQUESTS: 'collabmatrix_requests',
  CONNECTIONS: 'collabmatrix_sent_connections',
};

export function AppDataProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sentConnections, setSentConnections] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  // Load initial datasets from service layer
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sList, oList, tList, rList] = await Promise.all([
        studentService.getStudents(),
        opportunityService.getOpportunities(),
        teamService.getTeams(),
        requestService.getRequests(),
      ]);
      setStudents(sList);
      setOpportunities(oList);
      setTeams(tList);
      setRequests(rList);
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
    // 1. Add request via requestService
    const newReq = await requestService.sendRequest({
      studentId: student.id,
      student,
      opportunityId: 'opp-1',
      opportunityTitle,
      message: `Hi ${student.name.split(' ')[0]}, I came across your profile on CollabMatrix and would love to collaborate!`,
      matchScore: student.matchScore || 90,
    });

    // 2. Update state and connection IDs
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

    // If request has student, add them to user's team (team-1 / AI Healthcare Assistant)
    if (updatedReq.student) {
      const newMember = {
        id: updatedReq.student.id,
        name: updatedReq.student.name,
        department: updatedReq.student.department,
        year: updatedReq.student.year,
        role: 'Collaborator',
        skills: updatedReq.student.skills || [],
      };

      // Add to team-1
      const updatedTeam = await teamService.addTeamMember('team-1', newMember);
      setTeams((prev) =>
        prev.map((t) => (t.id === 'team-1' ? updatedTeam : t))
      );

      // Keep Opportunity Details in sync
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

  // Decline incoming request
  const declineRequest = async (requestId) => {
    const updatedReq = await requestService.declineRequest(requestId);
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Declined' } : r))
    );
    return updatedReq;
  };

  // Add member directly to team
  const addMemberToTeam = async (teamId, member) => {
    const updatedTeam = await teamService.addTeamMember(teamId, member);
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? updatedTeam : t))
    );

    // Sync corresponding opportunity
    if (updatedTeam.opportunityId) {
      const opp = await opportunityService.getOpportunityById(updatedTeam.opportunityId);
      if (opp) {
        const members = opp.currentMembers || [];
        if (!members.some((m) => m.id === member.id)) {
          const updatedOpp = await opportunityService.updateOpportunity(updatedTeam.opportunityId, {
            currentMembers: [...members, member],
          });
          setOpportunities((prev) =>
            prev.map((o) => (o.id === updatedTeam.opportunityId ? updatedOpp : o))
          );
        }
      }
    }
    return updatedTeam;
  };

  // Remove member from team
  const removeMemberFromTeam = async (teamId, memberId) => {
    const updatedTeam = await teamService.removeTeamMember(teamId, memberId);
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? updatedTeam : t))
    );

    // Sync opportunity
    if (updatedTeam.opportunityId) {
      const opp = await opportunityService.getOpportunityById(updatedTeam.opportunityId);
      if (opp) {
        const updatedOpp = await opportunityService.updateOpportunity(updatedTeam.opportunityId, {
          currentMembers: (opp.currentMembers || []).filter((m) => m.id !== memberId),
        });
        setOpportunities((prev) =>
          prev.map((o) => (o.id === updatedTeam.opportunityId ? updatedOpp : o))
        );
      }
    }
    return updatedTeam;
  };

  // Create new opportunity
  const createNewOpportunity = async (oppData) => {
    const created = await opportunityService.createOpportunity(oppData);
    setOpportunities((prev) => [created, ...prev]);
    return created;
  };

  // Reset demo back to initial seed data
  const resetToSeedData = () => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_OPPORTUNITIES));
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(INITIAL_TEAMS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.removeItem(STORAGE_KEYS.CONNECTIONS);

    setStudents(INITIAL_STUDENTS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setTeams(INITIAL_TEAMS);
    setRequests(INITIAL_REQUESTS);
    setSentConnections([]);
  };

  return (
    <AppDataContext.Provider
      value={{
        students,
        opportunities,
        teams,
        requests,
        sentConnections,
        loading,
        connectStudent,
        acceptRequest,
        declineRequest,
        addMemberToTeam,
        removeMemberFromTeam,
        createNewOpportunity,
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
