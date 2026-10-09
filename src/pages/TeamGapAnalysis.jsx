import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Send, ArrowRight, UserPlus } from 'lucide-react';
import CollaborationMatrix from '../components/features/CollaborationMatrix';
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
    addToast({
      type: 'success',
      title: 'INVITATION TRANSMITTED',
      message: `Dispatched invite to ${candidate.student?.name}!`,
    });
    setInviteModalState({ isOpen: false, candidate: null, skill: null, message: '' });
  };

  const handleImmediateAdd = async (candidate) => {
    await addMemberToTeam(activeTeam.id, candidate.student);
    addToast({
      type: 'success',
      title: 'GAP RESOLVED!',
      message: `${candidate.student.name} joined ${activeTeam.name}. Skill coverage updated!`,
    });
  };

  if (!gapAnalysis) return <div className="text-center py-12 font-mono font-bold text-ink">COMPUTING GAP ANALYSIS...</div>;

  const { requirements, teamSkills, coveragePercentage, coveredCount, totalCount, missingSkills, recommendationsBySkill, isFullCoverage } = gapAnalysis;

  // Key candidates that complete the team
  const topCandidates = [
    { name: 'SARAH', fullName: 'Sarah Rahman', match: 96, skill: 'UI / UX · Presentation', id: 'student-2' },
    { name: 'RAHUL', fullName: 'Rahul Kumar', match: 91, skill: 'Backend · Cloud Architecture', id: 'student-3' },
    { name: 'AISHA', fullName: 'Aisha Khan', match: 87, skill: 'Marketing · Brand Growth', id: 'student-4' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header: 07 / ENGINEERING DIAGNOSTIC SHEET (Section 23) */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
            07 / TEAM GAP ANALYSIS
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            ENGINEERING DIAGNOSTIC
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            PROJECT: {activeTeam?.name?.toUpperCase() || 'AI HEALTHCARE ASSISTANT'}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/team')}
        >
          [ ← RETURN TO TEAM ]
        </Button>
      </div>

      {/* 2. Engineering Diagnostic Sheet: TEAM COVERAGE 82% (Section 23) */}
      <div className="p-5 sm:p-6 bg-white border-2 border-ink shadow-brutal font-mono space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
          <div>
            <div className="text-[10px] font-bold text-ink/60 uppercase tracking-widest">
              DIAGNOSTIC STATUS
            </div>
            <h3 className="font-display font-black text-xl text-ink uppercase tracking-tight">
              TEAM COVERAGE
            </h3>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-3xl sm:text-4xl font-display font-black text-ink">
              {Math.round(coveragePercentage)}%
            </span>
          </div>
        </div>

        {/* ASCII Brutalist Progress Bar (Section 23: ████████████████░░░░) */}
        <div className="space-y-1">
          <div className="w-full h-6 border-2 border-ink bg-canvas overflow-hidden flex">
            <div
              style={{ width: `${Math.round(coveragePercentage)}%` }}
              className="h-full bg-ink"
            />
          </div>
          <div className="text-[10px] text-ink/60 font-bold uppercase tracking-widest">
            ████████████████░░░░ [{Math.round(coveragePercentage)}% OPTIMIZED]
          </div>
        </div>

        {/* COVERED vs MISSING Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* COVERED */}
          <div className="p-3.5 border-2 border-ink bg-canvas space-y-2">
            <div className="text-[10px] font-bold text-campus-green uppercase">
              ● COVERED ({coveredCount}):
            </div>
            <div className="space-y-1 text-xs font-bold text-ink uppercase">
              {requirements.filter((r) => teamSkills.some((ts) => ts.toLowerCase() === r.toLowerCase())).map((cov) => (
                <div key={cov} className="flex items-center gap-1.5">
                  <span className="text-campus-green">✓</span>
                  <span>{cov}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MISSING */}
          <div className="p-3.5 border-2 border-brutal-red bg-brutal-red/5 space-y-2">
            <div className="text-[10px] font-bold text-brutal-red uppercase">
              ○ MISSING ({missingSkills.length}):
            </div>
            <div className="space-y-1 text-xs font-bold text-brutal-red uppercase">
              {missingSkills.map((mis, idx) => (
                <div key={mis} className="flex items-center gap-1.5">
                  <span>0{idx + 1} /</span>
                  <span>{mis}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. PEOPLE WHO COMPLETE YOUR TEAM (Section 23) */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2 text-xs font-bold text-ink/70 uppercase">
          <span>PEOPLE WHO COMPLETE YOUR TEAM</span>
          <span className="text-brutal-red font-bold">TOP MATCHING RESOLUTIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCandidates.map((cand) => {
            const studentObj = students.find((s) => s.id === cand.id);
            const isInvited = invitedStudentIds.includes(cand.id);

            return (
              <div
                key={cand.id}
                className="p-4 bg-white border-2 border-ink shadow-brutal flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-ink/20 pb-2">
                    <span className="text-xs font-bold text-ink uppercase">
                      {cand.name}
                    </span>
                    <span className="px-2 py-0.5 border border-ink bg-signal-yellow text-ink text-xs font-bold">
                      {cand.match}%
                    </span>
                  </div>

                  <h4 className="font-display font-black text-base text-ink uppercase tracking-tight">
                    {cand.fullName}
                  </h4>

                  <p className="text-[11px] text-ink/75 font-mono uppercase font-bold">
                    RESOLVES: {cand.skill}
                  </p>
                </div>

                <div className="pt-2 border-t border-ink/20 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2"
                    onClick={() => studentObj && handleImmediateAdd({ student: studentObj })}
                  >
                    + ADD
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    disabled={isInvited}
                    className="text-xs px-2.5"
                    onClick={() => studentObj && handleOpenInvite({ student: studentObj }, cand.skill)}
                  >
                    {isInvited ? 'INVITED' : '[ INVITE → ]'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Punch-card Matrix */}
      <CollaborationMatrix
        requirements={requirements}
        members={activeTeam.members || []}
      />

      {/* Invite Modal */}
      <Modal
        isOpen={inviteModalState.isOpen}
        onClose={() => setInviteModalState({ isOpen: false, candidate: null, skill: null, message: '' })}
        title={`INVITE CANDIDATE TO COMPLETE TEAM`}
        description={`Direct dispatch to fill the ${inviteModalState.skill} requirement.`}
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
