import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Send, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import GapAnalysis from '../components/features/GapAnalysis';
import CollaborationMatrix from '../components/features/CollaborationMatrix';
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
    addToast({ type: 'success', title: 'INVITATION TRANSMITTED', message: `Dispatched invite to ${candidate.student?.name}!` });
    setInviteModalState({ isOpen: false, candidate: null, skill: null, message: '' });
  };

  const handleImmediateAdd = async (candidate) => {
    await addMemberToTeam(activeTeam.id, candidate.student);
    addToast({ type: 'success', title: 'GAP RESOLVED!', message: `${candidate.student.name} joined ${activeTeam.name}. Skill coverage increased!` });
  };

  if (!gapAnalysis) return <div className="text-center py-12 font-mono font-bold text-ink">COMPUTING GAP ANALYSIS...</div>;

  const { requirements, teamSkills, coveragePercentage, coveredCount, totalCount, missingSkills, recommendationsBySkill, isFullCoverage } = gapAnalysis;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="border-b-3 border-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">
            07 / SKILL GAP ANALYSIS
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            WHAT'S MISSING?
          </h1>
          <p className="text-xs sm:text-sm font-mono text-ink/70 font-semibold uppercase mt-2">
            IDENTIFY WEAK SPOTS AND ASSEMBLE A BALANCED HACKATHON CREW
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/team')}
          className="text-xs font-bold self-start md:self-auto"
        >
          ← BACK TO MISSION CONTROL
        </Button>
      </div>

      <GapAnalysis
        requirements={requirements}
        teamSkills={teamSkills}
        coveragePercentage={coveragePercentage}
        coveredCount={coveredCount}
        totalCount={totalCount}
      />

      {/* Collaboration Matrix Dot Grid */}
      <CollaborationMatrix
        requirements={requirements}
        members={activeTeam.members || []}
      />

      {isFullCoverage ? (
        <div className="p-8 bg-campus-green border-2 border-ink shadow-brutal text-center space-y-4">
          <div className="w-14 h-14 bg-white border-2 border-ink flex items-center justify-center mx-auto shadow-brutal-sm">
            <ShieldCheck className="w-8 h-8 text-ink stroke-[2.5]" />
          </div>
          <h3 className="text-2xl font-display font-black text-ink uppercase">
            TEAM HAS ACHIEVED 100% SKILL COVERAGE
          </h3>
          <p className="text-xs sm:text-sm font-mono text-ink/90 max-w-md mx-auto uppercase font-semibold">
            ALL PROJECT COMPETENCIES ARE COVERED ACROSS YOUR CURRENT ROSTER. READY TO BUILD.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/team')}>
              RETURN TO TEAM HUB
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border-b-2 border-ink pb-3 flex items-center justify-between">
            <h3 className="font-display font-black text-lg text-ink uppercase">
              RECOMMENDED TO FILL IDENTIFIED GAPS
            </h3>
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brutal-red text-white border border-ink uppercase">
              {missingSkills.length} CRITICAL GAPS
            </span>
          </div>

          <div className="space-y-4">
            {missingSkills.map((missingSkill) => {
              const recs = recommendationsBySkill[missingSkill] || [];
              return (
                <div key={missingSkill} className="p-6 bg-white border-2 border-ink shadow-brutal space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-brutal-red rounded-full border border-ink" />
                      <h4 className="font-display font-black text-sm uppercase text-ink">
                        UNCOVERED DISCIPLINE: <span className="text-brutal-red">{missingSkill}</span>
                      </h4>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-ink/60 uppercase">
                      {recs.length} TALENTS QUALIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recs.map((rec) => {
                      const isInvited = invitedStudentIds.includes(rec.student.id);
                      return (
                        <div
                          key={rec.student.id}
                          className="p-4 bg-canvas border-2 border-ink flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <Avatar name={rec.student.name} size="md" className="border-2 border-ink" />
                              <div>
                                <h5 className="font-display font-black text-sm text-ink uppercase">
                                  {rec.student.name}
                                </h5>
                                <p className="text-[11px] font-mono text-ink/70 uppercase">
                                  {rec.student.department} · {rec.student.year}
                                </p>
                                <p className="text-xs font-sans text-ink/80 mt-1 line-clamp-2">
                                  {rec.student.bio}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-signal-yellow text-ink border border-ink whitespace-nowrap">
                              {rec.matchScore}% MATCH
                            </span>
                          </div>

                          <div className="pt-2 border-t border-ink/30 flex items-center justify-between gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleImmediateAdd(rec)}
                            >
                              + ADD TO TEAM
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={isInvited}
                              icon={Send}
                              className="text-xs font-bold"
                              onClick={() => handleOpenInvite(rec, missingSkill)}
                            >
                              {isInvited ? 'INVITED' : 'INVITE TO FILL GAP →'}
                            </Button>
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
        title={`INVITE ${inviteModalState.candidate?.student?.name?.toUpperCase()} TO TEAM`}
        description={`Send a direct dispatch to fill the ${inviteModalState.skill} requirement.`}
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInviteModalState({ isOpen: false, candidate: null, skill: null, message: '' })}
            >
              CANCEL
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Send}
              onClick={handleConfirmInvite}
            >
              TRANSMIT INVITATION
            </Button>
          </>
        }
      >
        <Textarea
          label="PERSONAL INVITATION NOTE"
          rows={3}
          value={inviteModalState.message}
          onChange={(e) => setInviteModalState((prev) => ({ ...prev, message: e.target.value }))}
        />
      </Modal>
    </div>
  );
}
