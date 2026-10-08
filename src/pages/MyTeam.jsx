import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, PieChart, ArrowRight, ShieldCheck } from 'lucide-react';
import TeamMemberCard from '../components/cards/TeamMemberCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { analyzeTeamGaps } from '../utils/gapAnalysis';

export default function MyTeam() {
  const { teams, students, addMemberToTeam, removeMemberFromTeam } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [selectedTeamId, setSelectedTeamId] = useState('team-1');
  const [removeModalState, setRemoveModalState] = useState({ isOpen: false, member: null });
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const activeTeam = (teams || []).find((t) => t.id === selectedTeamId) || teams?.[0];

  const gapAnalysisResult = useMemo(() => {
    if (!activeTeam) return null;
    return analyzeTeamGaps(
      activeTeam.requiredSkills || [],
      activeTeam.members || [],
      students || []
    );
  }, [activeTeam, students]);

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
  const coverage = Math.round(gapAnalysisResult?.coveragePercentage || 82);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="border-b-3 border-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">
            06 / MISSION CONTROL
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            YOUR TEAM.
          </h1>
          <p className="text-xs sm:text-sm font-mono text-ink/70 font-semibold uppercase mt-2">
            0{memberCount} MEMBERS // {activeTeam.name.toUpperCase()} · HACKATHON SQUAD
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Button
            variant="outline"
            size="md"
            icon={UserPlus}
            disabled={isFull}
            onClick={() => setAddMemberModalOpen(true)}
            className="text-xs font-bold"
          >
            {isFull ? 'ROSTER FULL' : '+ ADD MEMBER'}
          </Button>

          <Button
            variant="danger"
            size="md"
            icon={PieChart}
            onClick={() => navigate('/team/gap-analysis')}
            className="text-xs font-bold"
          >
            RUN GAP ANALYSIS →
          </Button>
        </div>
      </div>

      {/* Segmented Skill Coverage Bar */}
      <div className="p-6 bg-white border-2 border-ink shadow-brutal space-y-3">
        <div className="flex items-center justify-between font-mono font-bold text-xs">
          <span className="uppercase text-ink text-sm">
            TEAM SKILL COVERAGE: <strong className="text-brutal-red">{coverage}%</strong>
          </span>
          <span className="text-ink/60 uppercase">
            {gapAnalysisResult?.coveredCount || 4} / {gapAnalysisResult?.totalCount || 5} SKILLS COVERED
          </span>
        </div>

        {/* Segmented Bar */}
        <div className="h-6 w-full border-2 border-ink flex overflow-hidden bg-canvas">
          <div style={{ width: '45%' }} className="bg-brutal-red border-r border-ink flex items-center justify-center text-[10px] font-mono font-bold text-white">
            TECH 45%
          </div>
          <div style={{ width: '20%' }} className="bg-signal-yellow border-r border-ink flex items-center justify-center text-[10px] font-mono font-bold text-ink">
            DESIGN 20%
          </div>
          <div style={{ width: '17%' }} className="bg-campus-green border-r border-ink flex items-center justify-center text-[10px] font-mono font-bold text-ink">
            COMM 17%
          </div>
          <div style={{ width: '18%' }} className="bg-white flex items-center justify-center text-[10px] font-mono font-bold text-ink/60">
            GAP 18%
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-ink/70 uppercase">
          <span>ACTIVE ROSTER ({memberCount} OF {activeTeam.maxSize} SLOTS)</span>
          <span>{activeTeam.maxSize - memberCount} OPENINGS AVAILABLE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeTeam.members?.map((member, idx) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              isOwner={idx === 0}
              onRemove={(m) => setRemoveModalState({ isOpen: true, member: m })}
            />
          ))}
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
          Removing this collaborator may create new skill coverage gaps in your project roster.
        </p>
      </Modal>

      {/* Recruit Member Modal */}
      <Modal
        isOpen={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        title="RECRUIT COLLABORATOR"
        description="Select a candidate from the network to add to your roster."
      >
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {availableCandidates.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-canvas border-2 border-ink flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={c.name} size="sm" className="border border-ink" />
                <div>
                  <h4 className="font-display font-bold text-xs uppercase text-ink">{c.name}</h4>
                  <p className="text-[10px] font-mono text-ink/70">{c.department}</p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="text-xs"
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
