import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, PieChart, Sparkles, ArrowRight } from 'lucide-react';
import TeamMemberCard from '../components/cards/TeamMemberCard';
import SkillCoverage from '../components/skills/SkillCoverage';
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

  // Derive coverage dynamically
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
        title: 'Member Removed',
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
        title: 'Member Added',
        message: `${student.name} is now part of ${activeTeam.name}!`,
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
        title="No active project rosters"
        description="You are not part of an active project crew. Create an opportunity or accept join requests to form a team."
        actionLabel="Create Opportunity"
        onAction={() => navigate('/opportunities/create')}
      />
    );
  }

  const memberCount = activeTeam.members?.length || 0;
  const isFull = memberCount >= activeTeam.maxSize;

  // Candidates for add member modal
  const currentMemberIds = new Set((activeTeam.members || []).map((m) => m.id));
  const availableCandidates = (students || []).filter((s) => !currentMemberIds.has(s.id));

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-retro-border pb-4">
        <div>
          <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
            [ CREW // ACTIVE_ROSTER_MANIFEST ]
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper tracking-wide uppercase">
              {activeTeam.name}
            </h1>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-none bg-retro-teal/20 text-retro-teal border border-retro-teal/40 uppercase">
              {activeTeam.type}
            </span>
          </div>
          <p className="text-xs text-retro-muted font-sans mt-0.5">
            Manage your project roster, track domain skill coverage, and identify uncovered disciplines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            icon={UserPlus}
            disabled={isFull}
            onClick={() => setAddMemberModalOpen(true)}
          >
            {isFull ? 'Roster Full' : 'Recruit Member'}
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={PieChart}
            onClick={() => navigate('/team/gap-analysis')}
          >
            Team Gap Analysis
          </Button>
        </div>
      </div>

      {/* Roster Progress & Skill Coverage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Members Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between text-[10px] text-retro-muted uppercase px-1">
            <span>
              [ ACTIVE_CREW // {memberCount} OF {activeTeam.maxSize} ROLES ]
            </span>
            <span>{activeTeam.maxSize - memberCount} OPENINGS AVAILABLE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activeTeam.members?.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                isOwner={member.isOwner}
                onRemove={(m) => setRemoveModalState({ isOpen: true, member: m })}
              />
            ))}

            {/* Empty Slot Placeholder */}
            {!isFull && (
              <div
                onClick={() => setAddMemberModalOpen(true)}
                className="p-6 rounded-none border border-dashed border-retro-border hover:border-retro-orange bg-retro-surface/40 cursor-pointer flex flex-col items-center justify-center text-center transition-all group min-h-[160px]"
              >
                <div className="w-8 h-8 rounded-none bg-retro-surface-elevated text-retro-muted group-hover:text-retro-orange border border-retro-border flex items-center justify-center mb-2 transition-colors">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-retro-paper">[ RECRUIT OPEN SLOT ]</span>
                <span className="text-[10px] text-retro-muted mt-0.5">Click to invite specialist</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Skill Coverage (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <SkillCoverage coverage={gapAnalysisResult?.categoryCoverage} />

          {/* Quick Gap Teaser Box */}
          <div className="p-4 rounded-none bg-retro-surface border border-retro-border space-y-2.5 shadow-panel">
            <div className="flex items-center gap-1.5 text-xs font-bold text-retro-amber uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Competency Readiness</span>
            </div>
            <p className="text-xs text-retro-muted font-sans leading-relaxed">
              Your roster currently covers <strong>{gapAnalysisResult?.coveredCount} of {gapAnalysisResult?.totalCount}</strong> required competencies ({gapAnalysisResult?.coveragePercentage}%).
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full"
              onClick={() => navigate('/team/gap-analysis')}
            >
              Run Full Gap Diagnostics
            </Button>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={removeModalState.isOpen}
        onClose={() => setRemoveModalState({ isOpen: false, member: null })}
        title="Remove Team Member?"
        description={`Confirm removal of ${removeModalState.member?.name} from ${activeTeam.name}.`}
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRemoveModalState({ isOpen: false, member: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmRemove}
            >
              Confirm Removal
            </Button>
          </>
        }
      >
        <p className="text-xs text-retro-muted font-sans">
          Removing this member will reduce the team&apos;s collective skill coverage and vacate a roster slot.
        </p>
      </Modal>

      {/* Add Member Selection Modal */}
      <Modal
        isOpen={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        title="Recruit Peer to Crew"
        description="Select a candidate to immediately place onto your project roster."
        maxWidth="max-w-xl"
      >
        <div className="space-y-2 max-h-96 overflow-y-auto py-2">
          {availableCandidates.slice(0, 8).map((cand) => (
            <div
              key={cand.id}
              className="p-3 rounded-none bg-retro-surface-elevated border border-retro-border flex items-center justify-between gap-3 hover:border-retro-orange/60 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={cand.name} size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-retro-paper">{cand.name}</h4>
                  <p className="text-[10px] text-retro-muted">{cand.department} // {cand.year}</p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddMember(cand)}
              >
                Recruit
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
