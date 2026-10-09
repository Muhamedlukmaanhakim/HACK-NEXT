import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  PieChart,
  Zap,
  BookOpen,
  Activity,
  Sliders,
  FileCheck2,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import CollaborationMatrix from '../components/features/CollaborationMatrix';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { analyzeTeamGaps } from '../utils/gapAnalysis';
import { evaluateTeamHealth } from '../services/teamHealthService';

export default function MyTeam() {
  const { teams, students, addMemberToTeam, removeMemberFromTeam, projectTasks, healthAlerts, skillEvidences } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [selectedTeamId, setSelectedTeamId] = useState('team-1');
  const [removeModalState, setRemoveModalState] = useState({ isOpen: false, member: null });
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const activeTeam = (teams || []).find((t) => t.id === selectedTeamId) || teams?.[0];

  const teamTasks = (projectTasks || []).filter((t) => t.teamId === activeTeam?.id);
  const teamAlerts = (healthAlerts || []).filter((a) => a.teamId === activeTeam?.id);

  const gapAnalysisResult = useMemo(() => {
    if (!activeTeam) return null;
    return analyzeTeamGaps(
      activeTeam.requiredSkills || [],
      activeTeam.members || [],
      students || [],
      skillEvidences || []
    );
  }, [activeTeam, students, skillEvidences]);

  const healthEvaluation = useMemo(() => {
    if (!activeTeam) return null;
    return evaluateTeamHealth(activeTeam, teamTasks, teamAlerts);
  }, [activeTeam, teamTasks, teamAlerts]);

  const handleConfirmRemove = async () => {
    if (!removeModalState.member || !activeTeam) return;
    try {
      await removeMemberFromTeam(activeTeam.id, removeModalState.member.id);
      addToast({
        type: 'info',
        title: 'MEMBER REMOVED',
        message: `${removeModalState.member.name} was removed from ${activeTeam.name}.`,
      });
    } catch (err) {
      addToast({ type: 'error', title: 'Action Failed', message: err.message });
    } finally {
      setRemoveModalState({ isOpen: false, member: null });
    }
  };

  const handleAddMember = async (student) => {
    if (!activeTeam) return;
    try {
      await addMemberToTeam(activeTeam.id, student);
      addToast({
        type: 'success',
        title: 'MEMBER RECRUITED',
        message: `${student.name} joined ${activeTeam.name}!`,
      });
      setAddMemberModalOpen(false);
    } catch (err) {
      addToast({ type: 'error', title: 'Could not add member', message: err.message });
    }
  };

  if (!activeTeam) {
    return (
      <EmptyState
        icon={Users}
        title="NO ACTIVE TEAM ROSTER"
        description="You are not currently part of an active project crew. Create an opportunity or accept requests to form a team."
        actionLabel="CREATE PROJECT"
        onAction={() => navigate('/opportunities/create')}
      />
    );
  }

  const memberCount = activeTeam.members?.length || 0;
  const isFull = memberCount >= activeTeam.maxSize;
  const currentMemberIds = new Set((activeTeam.members || []).map((m) => m.id));
  const availableCandidates = (students || []).filter((s) => !currentMemberIds.has(s.id));

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
            TEAM / {activeTeam.id.toUpperCase()}
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            YOUR TEAM.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            0{memberCount} MEMBERS // {activeTeam.name.toUpperCase()} (MAX {activeTeam.maxSize})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={UserPlus}
            disabled={isFull}
            onClick={() => setAddMemberModalOpen(true)}
          >
            {isFull ? '[ ROSTER FULL ]' : '[ + RECRUIT ]'}
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={PieChart}
            onClick={() => navigate('/team/gap-analysis')}
          >
            [ READINESS & GAPS → ]
          </Button>
        </div>
      </div>

      {/* 2. Connected Workflow Shortcuts Banner */}
      <div className="border-2 border-ink bg-white grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x-2 divide-ink shadow-brutal-sm font-mono text-xs">
        <button
          type="button"
          onClick={() => navigate('/team/trial-sprint')}
          className="p-3 text-left hover:bg-signal-yellow/20 transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center gap-1.5 text-brutal-red font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>01 // TRIAL SPRINT</span>
          </div>
          <p className="text-[10px] text-ink/70 font-sans mt-1">Test teamwork in 48h mini-challenge</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('/team/contributions')}
          className="p-3 text-left hover:bg-canvas transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center gap-1.5 text-ink font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>02 // LEDGER</span>
          </div>
          <p className="text-[10px] text-ink/70 font-sans mt-1">Verifiable deliverable evidence</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('/team/health')}
          className="p-3 text-left hover:bg-canvas transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center gap-1.5 text-campus-green font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>03 // HEALTH RADAR</span>
          </div>
          <p className="text-[10px] text-ink/70 font-sans mt-1">Delivery risk monitoring</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('/team/simulator')}
          className="p-3 text-left hover:bg-canvas transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center gap-1.5 text-ink font-bold">
            <Sliders className="w-3.5 h-3.5" />
            <span>04 // SIMULATOR</span>
          </div>
          <p className="text-[10px] text-ink/70 font-sans mt-1">Stress-test member departure</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('/team/agreement')}
          className="p-3 text-left hover:bg-canvas transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center gap-1.5 text-ink font-bold">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>05 // CHARTER</span>
          </div>
          <p className="text-[10px] text-ink/70 font-sans mt-1">Team working agreement</p>
        </button>
      </div>

      {/* 3. Signature Competency Punch-Card Dot Matrix */}
      <CollaborationMatrix
        requirements={activeTeam.requiredSkills || ['Python', 'UI/UX', 'Speech', 'Video']}
        members={activeTeam.members || []}
      />

      {/* 4. Dense Editorial Member Dossiers */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs font-bold text-ink/70 uppercase border-b-2 border-ink pb-2">
          <span>ACTIVE ROSTER SPECIFICATION</span>
          <span>SLOTS: {memberCount} / {activeTeam.maxSize}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeTeam.members?.map((member, idx) => {
            const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
            const firstName = member.name.split(' ')[0].toUpperCase();

            return (
              <div
                key={member.id}
                className="p-4 bg-white border-2 border-ink shadow-brutal flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-ink/20 pb-1.5 text-[10px] font-bold">
                    <span className="text-brutal-red">{numStr} / {firstName}</span>
                    <span className="text-ink/60 uppercase">{idx === 0 ? 'LEAD' : 'MEMBER'}</span>
                  </div>

                  <h3 className="font-display font-black text-base text-ink uppercase tracking-tight">
                    {member.name}
                  </h3>

                  <div className="editorial-separator" />

                  {/* Role */}
                  <div className="text-[11px] font-bold">
                    <span className="text-ink/50 text-[10px] uppercase block">ROLE:</span>
                    <span className="text-ink uppercase">{member.role || 'CORE CONTRIBUTOR'}</span>
                  </div>

                  {/* Skills */}
                  <div className="text-[11px] font-bold">
                    <span className="text-ink/50 text-[10px] uppercase block">SKILLS:</span>
                    <span className="text-ink uppercase">
                      {(member.skills || []).slice(0, 3).join(' · ')}
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="text-[11px] font-bold">
                    <span className="text-ink/50 text-[10px] uppercase block">AVAILABILITY:</span>
                    <span className="text-ink/80 uppercase">
                      {member.availability?.[0] || 'WEEKENDS'}
                    </span>
                  </div>
                </div>

                {idx !== 0 && (
                  <div className="pt-2 border-t border-ink/20 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setRemoveModalState({ isOpen: true, member })}
                      className="text-[10px] text-ink/60 hover:text-brutal-red font-bold uppercase transition-colors"
                    >
                      [ REMOVE ]
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={removeModalState.isOpen}
        onClose={() => setRemoveModalState({ isOpen: false, member: null })}
        title="REMOVE TEAM MEMBER?"
        description={`Confirm removal of ${removeModalState.member?.name} from ${activeTeam.name}.`}
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRemoveModalState({ isOpen: false, member: null })}
            >
              CANCEL
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmRemove}
            >
              REMOVE MEMBER
            </Button>
          </>
        }
      >
        <p className="text-xs font-mono text-ink/80">
          Removing this collaborator will dynamically update skill coverage and may open new team gaps.
        </p>
      </Modal>

      {/* Recruit Member Modal */}
      <Modal
        isOpen={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        title="RECRUIT COLLABORATOR"
        description="Select a candidate from the network to add to your roster."
      >
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 font-mono">
          {availableCandidates.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-canvas border-2 border-ink flex items-center justify-between gap-3"
            >
              <div>
                <h4 className="font-display font-black text-xs uppercase text-ink">{c.name}</h4>
                <p className="text-[10px] text-ink/70">{(c.skills || []).slice(0, 3).join(', ')}</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="text-xs px-2.5 py-1"
                onClick={() => handleAddMember(c)}
              >
                + ADD
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
