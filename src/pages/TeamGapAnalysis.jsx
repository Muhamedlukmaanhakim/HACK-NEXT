import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, ShieldCheck, Send, ArrowRight, Info, Check } from 'lucide-react';
import GapAnalysis from '../components/features/GapAnalysis';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { analyzeTeamGaps } from '../utils/gapAnalysis';

export default function TeamGapAnalysis() {
  const { teams, students, addMemberToTeam } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [inviteModalState, setInviteModalState] = useState({
    isOpen: false, candidate: null, skill: null, message: '',
  });
  const [invitedStudentIds, setInvitedStudentIds] = useState([]);

  // Active user team is team-1 (AI Healthcare Assistant)
  const activeTeam = teams.find((t) => t.id === 'team-1') || teams?.[0];

  const gapAnalysis = useMemo(() => {
    if (!activeTeam) return null;
    return analyzeTeamGaps(
      activeTeam.requiredSkills || ['Python', 'AI/ML', 'Backend', 'UI/UX', 'Public Speaking', 'Marketing'],
      activeTeam.members || [],
      students || []
    );
  }, [activeTeam, students]);

  const handleOpenInvite = (cand, skill) => {
    setInviteModalState({
      isOpen: true,
      candidate: cand,
      skill,
      message: `Hi ${cand.student?.name?.split(' ')[0]}, our team ${activeTeam.name} needs your expertise in ${skill}. Would you like to join us?`,
    });
  };

  const handleConfirmInvite = async () => {
    const { candidate } = inviteModalState;
    if (!candidate) return;
    setInvitedStudentIds((prev) => [...prev, candidate.student.id]);
    addToast({ type: 'success', title: 'Invitation Dispatched', message: `Invitation sent to ${candidate.student?.name}!` });
    setInviteModalState({ isOpen: false, candidate: null, skill: null, message: '' });
  };

  // Immediate "Add to Team" for interactive demo testing of 100% coverage
  const handleImmediateAdd = async (candidate) => {
    await addMemberToTeam(activeTeam.id, candidate.student);
    addToast({ type: 'success', title: 'Gap Filled!', message: `${candidate.student.name} joined ${activeTeam.name}. Skill coverage increased!` });
  };

  if (!gapAnalysis) return <div className="text-center py-12 text-text-muted">Loading team gap analysis...</div>;

  const { requirements, teamSkills, coveragePercentage, coveredCount, totalCount, missingSkills, recommendationsBySkill, isFullCoverage } = gapAnalysis;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">Team Gap Analysis</h1>
            <span className="p-1 rounded-lg bg-accent-teal/20 text-accent-teal"><PieChart className="w-4 h-4" /></span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">Identify what your team is missing and recruit exact matching candidates.</p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-surface border border-surface-border text-text-muted">
          <Info className="w-3.5 h-3.5 text-accent-indigo" />
          <span>Dynamic computation from team roster</span>
        </div>
      </div>

      <GapAnalysis requirements={requirements} teamSkills={teamSkills} coveragePercentage={coveragePercentage} coveredCount={coveredCount} totalCount={totalCount} />

      {isFullCoverage ? (
        <div className="p-10 rounded-3xl bg-surface border border-status-success/30 text-center space-y-4 shadow-elevated animate-slide-up">
          <div className="w-14 h-14 rounded-2xl bg-status-success/15 text-status-success border border-status-success/30 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-text-primary tracking-tight">Your team currently has full skill coverage!</h3>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
            All project competencies ({requirements.join(', ')}) are covered across your current team roster. You are ready to build and win!
          </p>
          <div className="pt-2">
            <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/team')}>
              Return to Team Hub
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-primary tracking-tight">Recommended Candidates to Fill Gaps</h3>
              <p className="text-xs text-text-secondary">Students who fulfill the missing {missingSkills.join(' and ')} requirements.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-status-warning/15 text-status-warning border border-status-warning/30">
              {missingSkills.length} Critical Gaps
            </span>
          </div>

          <div className="space-y-6">
            {missingSkills.map((missingSkill) => {
              const recs = recommendationsBySkill[missingSkill] || [];
              return (
                <div key={missingSkill} className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-status-danger px-2.5 py-0.5 rounded-full bg-status-danger/10 border border-status-danger/25">Missing Skill</span>
                      <h4 className="text-base font-bold text-text-primary">{missingSkill}</h4>
                    </div>
                    <span className="text-xs text-text-muted">{recs.length} candidates available</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recs.slice(0, 2).map((cand) => {
                      const isInvited = invitedStudentIds.includes(cand.student.id);
                      return (
                        <div key={cand.student.id} className="p-4 rounded-xl bg-surface-elevated/70 border border-surface-border hover:border-surface-border-hover transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-3">
                                <Avatar name={cand.student.name} size="md" />
                                <div>
                                  <h5 className="text-sm font-semibold text-text-primary">{cand.student.name}</h5>
                                  <p className="text-xs text-text-secondary">{cand.student.department} • {cand.student.year}</p>
                                </div>
                              </div>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-teal/15 text-accent-teal border border-accent-teal/30">{cand.matchScore}% Match</span>
                            </div>
                            <p className="text-xs text-text-muted mb-3 line-clamp-2">{cand.reason}</p>
                          </div>
                          <div className="pt-3 border-t border-surface-border/50 flex items-center justify-between gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/profile?id=${cand.student.id}`)}>Profile</Button>
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" onClick={() => handleImmediateAdd(cand)} title="Instantly recruit to team to simulate 100% coverage">+ Add Now</Button>
                              <Button variant={isInvited ? 'secondary' : 'primary'} size="sm" disabled={isInvited} icon={isInvited ? Check : Send} onClick={() => !isInvited && handleOpenInvite(cand, missingSkill)}>
                                {isInvited ? 'Invited' : 'Invite'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <Modal
        isOpen={inviteModalState.isOpen}
        onClose={() => setInviteModalState({ isOpen: false, candidate: null, skill: null, message: '' })}
        title={`Invite ${inviteModalState.candidate?.student?.name} to Team`}
        description={`Send a collaboration invitation to fill the ${inviteModalState.skill} requirement.`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setInviteModalState({ isOpen: false, candidate: null, skill: null, message: '' })}>Cancel</Button>
            <Button variant="primary" size="sm" icon={Send} onClick={handleConfirmInvite}>Send Invitation</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Textarea
            label="Invitation Message"
            rows={3}
            value={inviteModalState.message}
            onChange={(e) => setInviteModalState({ ...inviteModalState, message: e.target.value })}
            helperText="Personalized messages increase acceptance rates on CollabMatrix."
          />
        </div>
      </Modal>
    </div>
  );
}
