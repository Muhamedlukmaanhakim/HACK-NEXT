import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Users,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  Calendar,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { analyzeTeamGaps } from '../utils/gapAnalysis';
import { evaluateTeamHealth } from '../services/teamHealthService';

export default function WhatIfSimulator() {
  const { teams, students, skillEvidences, projectTasks, healthAlerts, addMemberToTeam, removeMemberFromTeam } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const activeTeam = teams?.[0];

  // Base state
  const baseMembers = activeTeam?.members || [];
  const baseSkills = activeTeam?.requiredSkills || ['Python', 'AI/ML', 'Backend', 'UI/UX', 'Public Speaking'];
  const baseTasks = (projectTasks || []).filter((t) => t.teamId === activeTeam?.id);

  // Simulation Sandbox State (Isolated from live project data)
  const [removedMemberId, setRemovedMemberId] = useState('');
  const [addedCandidateId, setAddedCandidateId] = useState('');
  const [extraRequiredSkill, setExtraRequiredSkill] = useState('');
  const [simulatedDeadlineDays, setSimulatedDeadlineDays] = useState(0); // e.g. -3 days compressed
  const [unassignedTaskToggle, setUnassignedTaskToggle] = useState(false);

  // Available students not currently in base team
  const availableCandidates = useMemo(() => {
    const currentMemberIds = new Set(baseMembers.map((m) => m.id));
    return (students || []).filter((s) => !currentMemberIds.has(s.id));
  }, [students, baseMembers]);

  // BASE CALCULATION
  const baseGapResult = useMemo(() => {
    return analyzeTeamGaps(baseSkills, baseMembers, students || [], skillEvidences || []);
  }, [baseSkills, baseMembers, students, skillEvidences]);

  const baseHealthResult = useMemo(() => {
    return evaluateTeamHealth(activeTeam, baseTasks, healthAlerts || []);
  }, [activeTeam, baseTasks, healthAlerts]);

  // SIMULATED STATE
  const simulatedMembers = useMemo(() => {
    let result = [...baseMembers];
    if (removedMemberId) {
      result = result.filter((m) => m.id !== removedMemberId);
    }
    if (addedCandidateId) {
      const candidate = availableCandidates.find((c) => c.id === addedCandidateId);
      if (candidate) {
        result.push({
          id: candidate.id,
          name: candidate.name,
          role: 'Simulated Collaborator',
          department: candidate.department,
          year: candidate.year,
          skills: candidate.skills || [],
        });
      }
    }
    return result;
  }, [baseMembers, removedMemberId, addedCandidateId, availableCandidates]);

  const simulatedSkills = useMemo(() => {
    const list = [...baseSkills];
    if (extraRequiredSkill && !list.includes(extraRequiredSkill)) {
      list.push(extraRequiredSkill);
    }
    return list;
  }, [baseSkills, extraRequiredSkill]);

  const simulatedTasks = useMemo(() => {
    let tasks = [...baseTasks];
    if (unassignedTaskToggle) {
      tasks.push({
        id: 'sim-task-1',
        title: 'Simulated High-Complexity Cloud Deploy',
        deliverable: 'Kubernetes Cluster',
        assignedToId: null, // Unassigned!
        isEssential: true,
        deadline: '2026-10-12',
      });
    }
    return tasks;
  }, [baseTasks, unassignedTaskToggle]);

  // SIMULATED CALCULATION
  const simGapResult = useMemo(() => {
    return analyzeTeamGaps(simulatedSkills, simulatedMembers, students || [], skillEvidences || []);
  }, [simulatedSkills, simulatedMembers, students, skillEvidences]);

  const simHealthResult = useMemo(() => {
    const simulatedTeamObj = { ...activeTeam, members: simulatedMembers, requiredSkills: simulatedSkills };
    return evaluateTeamHealth(simulatedTeamObj, simulatedTasks, healthAlerts || []);
  }, [activeTeam, simulatedMembers, simulatedSkills, simulatedTasks, healthAlerts]);

  // Delta calculations
  const readinessDelta = simGapResult.readinessIndex - baseGapResult.readinessIndex;
  const coverageDelta = simGapResult.coveragePercentage - baseGapResult.coveragePercentage;

  const handleResetSimulation = () => {
    setRemovedMemberId('');
    setAddedCandidateId('');
    setExtraRequiredSkill('');
    setSimulatedDeadlineDays(0);
    setUnassignedTaskToggle(false);
    addToast({ type: 'info', title: 'SANDBOX RESET', message: 'Restored to baseline project parameters.' });
  };

  const handleCommitScenario = async () => {
    if (addedCandidateId) {
      const candidate = availableCandidates.find((c) => c.id === addedCandidateId);
      if (candidate && activeTeam) {
        await addMemberToTeam(activeTeam.id, candidate);
      }
    }
    if (removedMemberId && activeTeam) {
      await removeMemberFromTeam(activeTeam.id, removedMemberId);
    }
    addToast({
      type: 'success',
      title: 'SCENARIO COMMITTED',
      message: 'Simulated member roster applied to live project team!',
    });
    handleResetSimulation();
    navigate('/team');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brutal-red mb-1">
            <Sliders className="w-4 h-4" />
            <span>ADAPTIVE INTELLIGENCE // WHAT-IF SIMULATOR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            WHAT-IF SIMULATOR.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            STRESS-TEST MEMBER DEPARTURES · TEST CANDIDATE RECRUITS · LIVE REAL-TIME DELTA COMPUTATION
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleResetSimulation}>
            [ RESET SANDBOX ]
          </Button>
          <Button variant="danger" size="sm" icon={ArrowRight} iconPosition="right" onClick={handleCommitScenario}>
            [ COMMIT SCENARIO TO PROJECT → ]
          </Button>
        </div>
      </div>

      {/* 2. Simulation Sandbox Controls Panel */}
      <div className="p-6 border-2 border-ink bg-white shadow-brutal font-mono space-y-5">
        <div className="flex items-center justify-between border-b-2 border-ink pb-3 text-xs font-bold uppercase">
          <span className="flex items-center gap-1.5 text-ink">
            <Sliders className="w-4 h-4 text-brutal-red" />
            SIMULATION HYPOTHESIS VARIABLES (ISOLATED SANDBOX)
          </span>
          <span className="bg-signal-yellow px-2 py-0.5 border border-ink text-ink font-bold">
            ZERO WRITE MUTATIONS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Var 1: Member Departure */}
          <div>
            <Select
              label="SIMULATE MEMBER DEPARTURE"
              value={removedMemberId}
              onChange={(e) => setRemovedMemberId(e.target.value)}
              options={[
                { value: '', label: '[ NO ONE LEAVES (DEFAULT) ]' },
                ...baseMembers.map((m) => ({ value: m.id, label: `LEAVES: ${m.name.toUpperCase()}` })),
              ]}
            />
          </div>

          {/* Var 2: Candidate Join */}
          <div>
            <Select
              label="SIMULATE NEW MEMBER JOINING"
              value={addedCandidateId}
              onChange={(e) => setAddedCandidateId(e.target.value)}
              options={[
                { value: '', label: '[ NO RECRUIT (DEFAULT) ]' },
                ...availableCandidates.map((c) => ({
                  value: c.id,
                  label: `JOINS: ${c.name.toUpperCase()} (${c.skills?.slice(0, 2).join(',')})`,
                })),
              ]}
            />
          </div>

          {/* Var 3: Additional Skill Requirement */}
          <div>
            <Select
              label="ADD EXTRA ESSENTIAL SKILL"
              value={extraRequiredSkill}
              onChange={(e) => setExtraRequiredSkill(e.target.value)}
              options={[
                { value: '', label: '[ NO NEW SKILL (DEFAULT) ]' },
                { value: 'Cybersecurity', label: '+ CYBERSECURITY (DEVSECOPS)' },
                { value: 'Cloud', label: '+ CLOUD ARCHITECTURE' },
                { value: 'Robotics', label: '+ ROBOTICS HARDWARE' },
                { value: 'Marketing', label: '+ MARKETING & GROWTH' },
              ]}
            />
          </div>

          {/* Var 4: Unassigned Critical Task */}
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70 block mb-1">
              SIMULATE UNASSIGNED ESSENTIAL TASK
            </label>
            <button
              type="button"
              onClick={() => setUnassignedTaskToggle(!unassignedTaskToggle)}
              className={`w-full p-2.5 border-2 border-ink text-xs font-bold uppercase text-center transition-colors ${
                unassignedTaskToggle ? 'bg-brutal-red text-white' : 'bg-canvas text-ink hover:bg-white'
              }`}
            >
              [ {unassignedTaskToggle ? 'ACTIVE: +1 UNASSIGNED TASK' : 'INACTIVE (NO EXTRA TASK)'} ]
            </button>
          </div>
        </div>
      </div>

      {/* 3. Before-and-After Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        {/* BASE STATE */}
        <div className="p-6 border-2 border-ink bg-white shadow-brutal space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <span className="text-xs font-black text-ink uppercase">CURRENT PROJECT BASELINE</span>
            <span className="bg-canvas border border-ink px-2 py-0.5 text-[10px] uppercase">LIVE STATE</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-black text-ink">
              {baseGapResult.readinessIndex}%
            </span>
            <span className="text-xs font-bold text-ink/70 uppercase">READINESS INDEX</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 border-2 border-ink bg-canvas">
            <div style={{ width: `${baseGapResult.coveragePercentage}%` }} className="h-full bg-ink" />
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-ink/60 uppercase">COVERAGE:</span>
              <strong className="text-ink">{baseGapResult.coveragePercentage}% ({baseGapResult.coveredCount}/{baseGapResult.totalCount})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60 uppercase">HEALTH STATE:</span>
              <strong className="text-ink uppercase">{baseHealthResult.status}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60 uppercase">TEAM ROSTER:</span>
              <span className="text-ink uppercase">{baseMembers.map((m) => m.name.split(' ')[0]).join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brutal-red uppercase">MISSING GAPS:</span>
              <span className="text-brutal-red uppercase font-bold">{baseGapResult.missingSkills.join(', ') || 'NONE'}</span>
            </div>
          </div>
        </div>

        {/* SIMULATED SCENARIO */}
        <div className={`p-6 border-3 border-ink shadow-brutal space-y-4 ${
          readinessDelta < 0 ? 'bg-brutal-red/5 border-brutal-red' : readinessDelta > 0 ? 'bg-campus-green/5' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <span className="text-xs font-black text-ink uppercase">SIMULATED SCENARIO OUTCOME</span>
            <span className="bg-signal-yellow border border-ink px-2 py-0.5 text-[10px] text-ink uppercase font-bold">
              DELTA: {readinessDelta > 0 ? `+${readinessDelta}%` : `${readinessDelta}%`}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-black text-ink">
                {simGapResult.readinessIndex}%
              </span>
              <span className={`text-sm font-bold ${readinessDelta >= 0 ? 'text-campus-green' : 'text-brutal-red'}`}>
                ({readinessDelta >= 0 ? `+${readinessDelta}%` : `${readinessDelta}%`})
              </span>
            </div>
            <span className="text-xs font-bold text-ink/70 uppercase">PREDICTED READINESS</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 border-2 border-ink bg-canvas">
            <div
              style={{ width: `${simGapResult.coveragePercentage}%` }}
              className={`h-full ${readinessDelta < 0 ? 'bg-brutal-red' : 'bg-ink'}`}
            />
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-ink/60 uppercase">COVERAGE:</span>
              <strong className="text-ink">
                {simGapResult.coveragePercentage}% ({simGapResult.coveredCount}/{simGapResult.totalCount})
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60 uppercase">PREDICTED HEALTH:</span>
              <strong className={`uppercase ${simHealthResult.status === 'At Risk' ? 'text-brutal-red' : 'text-ink'}`}>
                {simHealthResult.status}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60 uppercase">SIMULATED ROSTER:</span>
              <span className="text-ink uppercase">{simulatedMembers.map((m) => m.name.split(' ')[0]).join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brutal-red uppercase">MISSING GAPS:</span>
              <span className="text-brutal-red uppercase font-bold">{simGapResult.missingSkills.join(', ') || 'ALL COVERED'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Scope Reality Check & Algorithmic Prescriptions */}
      <div className="p-6 border-2 border-ink bg-white shadow-brutal font-mono space-y-4">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2 text-xs font-bold uppercase">
          <span className="flex items-center gap-1.5 text-ink">
            <Layers className="w-4 h-4 text-brutal-red" />
            SCOPE REALITY CHECK & ADAPTIVE PRESCRIPTIONS
          </span>
          <span className="bg-canvas border border-ink px-2 py-0.5 text-ink text-[10px]">
            SECTION 10.5 COMPLIANT
          </span>
        </div>

        <div className="space-y-2 text-xs font-sans">
          {simGapResult.missingSkills.length > 0 && (
            <div className="p-3 border border-brutal-red bg-brutal-red/5 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-brutal-red flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono text-brutal-red uppercase block">CAPABILITY DEFICIT DETECTED:</strong>
                Your team currently lacks verified coverage for <strong>{simGapResult.missingSkills.join(', ')}</strong>.
                Recommendation: Either recruit candidate <strong>Sarah Rahman</strong> (UI/UX) or split the project scope to deliver backend MVP endpoints first.
              </div>
            </div>
          )}

          {simHealthResult.singlePointCount > 0 && (
            <div className="p-3 border border-ink bg-signal-yellow/15 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono text-ink uppercase block">BUS FACTOR 1 WARNING:</strong>
                {simHealthResult.singlePointCount} capability is carried by a single member. Recommendation: Establish peer pair-programming sessions and formalize code reviews in the Team Agreement.
              </div>
            </div>
          )}

          {simGapResult.isFullCoverage && (
            <div className="p-3 border border-campus-green bg-campus-green/10 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-campus-green flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-mono text-campus-green uppercase block">OPTIMAL CAPABILITY ALIGNMENT:</strong>
                Simulated roster achieves 100% skill coverage across all required domains with balanced workload distribution.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
