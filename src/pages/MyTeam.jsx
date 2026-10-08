import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, PieChart, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
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
        title="No active teams"
        description="You are not part of an active team yet. Create an opportunity or accept join requests to form a squad."
        actionLabel="Create Opportunity"
        onAction={() => navigate('/opportunities/create')}
      />
    );
  }

  const memberCount = activeTeam.members?.length || 0;
  const isFull = memberCount >= activeTeam.maxSize;

  // Candidates for add member modal (exclude current members)
  const currentMemberIds = new Set((activeTeam.members || []).map((m) => m.id));
  const availableCandidates = (students || []).filter((s) => !currentMemberIds.has(s.id));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              {activeTeam.name}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-teal/15 text-accent-teal border border-accent-teal/30">
              {activeTeam.type}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage your project roster, track domain skill coverage, and identify team gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={UserPlus}
            disabled={isFull}
            onClick={() => setAddMemberModalOpen(true)}
          >
            {isFull ? 'Roster Full' : 'Add Member'}
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={PieChart}
            onClick={() => navigate('/team/gap-analysis')}
          >
            Analyze Team Gaps
          </Button>
        </div>
      </div>

      {/* Roster Progress & Skill Coverage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Members Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-text-muted px-1">
            <span className="font-semibold uppercase tracking-wider">
              Active Members ({memberCount}/{activeTeam.maxSize})
            </span>
            <span>{activeTeam.maxSize - memberCount} openings available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="p-6 rounded-2xl border-2 border-dashed border-surface-border hover:border-accent-indigo/50 bg-surface/30 cursor-pointer flex flex-col items-center justify-center text-center transition-all group min-h-[160px]"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-elevated text-text-muted group-hover:text-accent-indigo flex items-center justify-center mb-2 transition-colors">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-text-primary">Recruit Open Slot</span>
                <span className="text-[11px] text-text-muted mt-0.5">Click to invite a specialist</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Skill Coverage (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <SkillCoverage coverage={gapAnalysisResult?.categoryCoverage} />

          {/* Quick Gap Teaser Box */}
          <div className="p-5 rounded-2xl bg-surface-elevated/80 border border-surface-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
              <Sparkles className="w-4 h-4 text-accent-teal" />
              <span>Team Competency Readiness</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your team currently covers <strong>{gapAnalysisResult?.coveredCount} of {gapAnalysisResult?.totalCount}</strong> required competencies ({gapAnalysisResult?.coveragePercentage}%).
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
        description={`Are you sure you want to remove ${removeModalState.member?.name} from ${activeTeam.name}?`}
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
              Confirm Remove
            </Button>
          </>
        }
      >
        <p className="text-xs text-text-muted">
          Removing this member will reduce the team&apos;s skill coverage and free up a roster slot.
        </p>
      </Modal>

      {/* Add Member Selection Modal */}
      <Modal
        isOpen={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        title="Invite Student to Team"
        description="Select a student to immediately recruit onto your project roster."
        maxWidth="max-w-xl"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto py-2">
          {availableCandidates.slice(0, 8).map((cand) => (
            <div
              key={cand.id}
              className="p-3.5 rounded-xl bg-surface border border-surface-border flex items-center justify-between gap-3 hover:border-surface-border-hover transition-all"
            >
              <div className="flex items-center gap-3">
                <Avatar name={cand.name} size="sm" />
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">{cand.name}</h4>
                  <p className="text-[11px] text-text-muted">{cand.department} • {cand.year}</p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddMember(cand)}
              >
                Add Member
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
