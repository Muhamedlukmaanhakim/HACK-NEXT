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
    addToast({ type: 'success', title: 'Invitation Dispatched', message: `Invitation transmitted to ${candidate.student?.name}!` });
    setInviteModalState({ isOpen: false, candidate: null, skill: null, message: '' });
  };

  // Immediate "Add to Team" for interactive demo testing of 100% coverage
  const handleImmediateAdd = async (candidate) => {
    await addMemberToTeam(activeTeam.id, candidate.student);
    addToast({ type: 'success', title: 'Gap Filled!', message: `${candidate.student.name} joined ${activeTeam.name}. Skill coverage increased!` });
  };

  if (!gapAnalysis) return <div className="text-center py-12 text-retro-muted font-mono">[ COMPUTING GAP ANALYSIS... ]</div>;

  const { requirements, teamSkills, coveragePercentage, coveredCount, totalCount, missingSkills, recommendationsBySkill, isFullCoverage } = gapAnalysis;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-retro-border pb-4">
        <div>
          <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
            [ SECTION 11 // TEAM DIAGNOSTICS ]
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper tracking-wide uppercase">
              TEAM DIAGNOSTICS <span className="text-retro-orange">//</span> GAP ANALYSIS
            </h1>
            <span className="p-1 rounded-none bg-retro-surface-elevated text-retro-teal border border-retro-teal/40">
              <PieChart className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-retro-muted font-sans mt-0.5">
            Identify uncovered disciplines in your roster and recruit candidates with exact matching skills.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-none bg-retro-surface border border-retro-border text-retro-muted">
          <Info className="w-3.5 h-3.5 text-retro-amber" />
          <span>Dynamic computation from team roster</span>
        </div>
      </div>

      <GapAnalysis
        requirements={requirements}
        teamSkills={teamSkills}
        coveragePercentage={coveragePercentage}
        coveredCount={coveredCount}
        totalCount={totalCount}
      />

      {isFullCoverage ? (
        <div className="p-8 sm:p-10 rounded-none bg-retro-surface border border-retro-teal shadow-terminal text-center space-y-4 animate-slide-up">
          <div className="w-12 h-12 rounded-none bg-retro-teal/15 text-retro-teal border border-retro-teal/40 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="text-[10px] text-retro-muted uppercase tracking-widest">[ AUDIT // ALL_ROLES_FILLED ]</div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-retro-paper uppercase">
            Team Has Achieved 100% Skill Coverage
          </h3>
          <p className="text-xs sm:text-sm text-retro-muted font-sans max-w-md mx-auto leading-relaxed">
            All project competencies ({requirements.join(', ')}) are fulfilled across your current roster. You are ready to build.
          </p>
          <div className="pt-2">
            <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/team')}>
              Return to Team Hub
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-retro-border pb-2">
            <div>
              <div className="text-[10px] text-retro-muted uppercase tracking-widest">[ DISPATCH // CANDIDATE_RECOMMENDATIONS ]</div>
              <h3 className="text-sm font-bold text-retro-paper tracking-wider uppercase">
                RECOMMENDED COLLABORATORS
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-retro-red/20 text-retro-red border border-retro-red/40 uppercase">
              GAPS DETECTED: {missingSkills.join(', ')}
            </span>
          </div>

          <div className="space-y-4">
            {missingSkills.map((missingSkill) => {
              const recs = recommendationsBySkill[missingSkill] || [];
              return (
                <div key={missingSkill} className="p-4 sm:p-5 rounded-none bg-retro-surface border border-retro-border space-y-3.5 shadow-panel">
                  <div className="flex items-center justify-between border-b border-retro-border/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-retro-red px-1.5 py-0.2 bg-retro-red/15 border border-retro-red/40">
                        MISSING
                      </span>
                      <h4 className="text-sm font-bold text-retro-paper tracking-wide">{missingSkill}</h4>
                    </div>
                    <span className="text-[10px] text-retro-muted">{recs.length} candidates located</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {recs.slice(0, 2).map((cand) => {
                      const isInvited = invitedStudentIds.includes(cand.student.id);
                      return (
                        <div key={cand.student.id} className="p-3.5 rounded-none bg-retro-surface-elevated border border-retro-border hover:border-retro-orange/60 transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2.5">
                                <Avatar name={cand.student.name} size="md" />
                                <div>
                                  <h5 className="text-xs font-bold text-retro-paper">{cand.student.name}</h5>
                                  <p className="text-[10px] text-retro-muted">{cand.student.department} // {cand.student.year}</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-retro-orange/15 text-retro-orange border border-retro-orange/40">
                                {cand.matchScore}% MATCH
                              </span>
                            </div>
                            <p className="text-xs text-retro-muted font-sans mb-3 line-clamp-2">{cand.reason}</p>
                          </div>
                          <div className="pt-2 border-t border-retro-border/60 flex items-center justify-between gap-2 text-xs">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/profile?id=${cand.student.id}`)}>Dossier</Button>
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" onClick={() => handleImmediateAdd(cand)} title="Instantly recruit to team to simulate 100% coverage">+ Add Now</Button>
                              <Button variant={isInvited ? 'secondary' : 'primary'} size="sm" disabled={isInvited} icon={isInvited ? Check : Send} onClick={() => !isInvited && handleOpenInvite(cand, missingSkill)}>
                                {isInvited ? 'Sent' : 'Invite'}
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
        title={`Transmit Invitation to ${inviteModalState.candidate?.student?.name}`}
        description={`Send a structured collaboration dispatch to fill the ${inviteModalState.skill} requirement.`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setInviteModalState({ isOpen: false, candidate: null, skill: null, message: '' })}>Cancel</Button>
            <Button variant="primary" size="sm" icon={Send} onClick={handleConfirmInvite}>Transmit</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Textarea
            label="Invitation Message"
            rows={3}
            value={inviteModalState.message}
            onChange={(e) => setInviteModalState({ ...inviteModalState, message: e.target.value })}
            helperText="Clear project context increases candidate acceptance rate."
          />
        </div>
      </Modal>
    </div>
  );
}
