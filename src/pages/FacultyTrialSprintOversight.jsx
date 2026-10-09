import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  ExternalLink,
  Award,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

export default function FacultyTrialSprintOversight() {
  const { user } = useAuth();
  const { trialSprints, reviewTrialSprint } = useAppData();
  const { addToast } = useToast();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [reviewScore, setReviewScore] = useState(92);
  const [reviewNotes, setReviewNotes] = useState('');
  const [retroNotes, setRetroNotes] = useState('');

  const handleOpenReview = (sprint) => {
    setSelectedSprint(sprint);
    setReviewScore(sprint.reviewerFeedback?.score || 92);
    setReviewNotes(sprint.reviewerFeedback?.notes || 'Tested working deliverable across clinical scenarios. Exceptional communication observed.');
    setRetroNotes(sprint.retrospectiveNotes || 'Sprint demonstrated strong sync cadence. Cleared for long-term project commitment.');
    setReviewModalOpen(true);
  };

  const handleConfirmReview = async (e) => {
    e.preventDefault();
    if (!selectedSprint) return;

    await reviewTrialSprint(selectedSprint.id, {
      status: 'Completed',
      reviewerName: user?.name || 'Dr. Aris Thorne',
      reviewerRole: user?.designation || 'Faculty Supervisor',
      score: Number(reviewScore),
      notes: reviewNotes.trim(),
      retrospectiveNotes: retroNotes.trim(),
    });

    addToast({
      type: 'success',
      title: 'TRIAL SPRINT CERTIFIED',
      message: `Trial sprint "${selectedSprint.title}" evaluated and marked Completed.`,
    });
    setReviewModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brutal-red mb-1">
            <Zap className="w-4 h-4" />
            <span>FACULTY WORKFLOW // TRIAL SPRINT OVERSIGHT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            SPRINT OVERSIGHT.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            INSPECT 48H COLLABORATION DELIVERABLES · AUDIT BLOCKERS · EVALUATE SQUAD COMMITMENT
          </p>
        </div>

        <div className="text-xs font-mono font-bold bg-canvas border-2 border-ink px-3 py-1.5 shadow-brutal-sm">
          <span>SPRINTS: {trialSprints?.length || 0} MONITORED</span>
        </div>
      </div>

      {/* 2. Sprints Oversight Grid */}
      <div className="space-y-6 font-mono">
        {trialSprints?.map((sprint) => {
          const completedCount = (sprint.participants || []).filter((p) => p.submission).length;
          const totalCount = sprint.participants?.length || 0;

          return (
            <div key={sprint.id} className="p-6 bg-white border-2 border-ink shadow-brutal space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink pb-3 text-xs">
                <div>
                  <span className="font-display font-black text-xl text-ink uppercase">
                    {sprint.title}
                  </span>
                  <span className="text-[10px] text-ink/60 uppercase block">
                    PROJECT: {sprint.projectTitle} · DURATION: {sprint.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase border-2 border-ink ${
                    sprint.status === 'Completed' ? 'bg-campus-green text-white' : 'bg-signal-yellow text-ink'
                  }`}>
                    ● {sprint.status}
                  </span>
                </div>
              </div>

              {/* Objective & Policy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-3.5 border border-ink bg-canvas space-y-1">
                  <span className="font-mono text-[10px] font-bold uppercase text-ink/60 block">OBJECTIVE:</span>
                  <p className="text-ink leading-relaxed font-normal">{sprint.objective}</p>
                </div>
                <div className="p-3.5 border border-ink bg-canvas space-y-1">
                  <span className="font-mono text-[10px] font-bold uppercase text-ink/60 block">EXPECTED DELIVERABLE:</span>
                  <p className="text-ink leading-relaxed font-normal">{sprint.expectedDeliverable}</p>
                </div>
              </div>

              {/* Participant Submissions Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-ink/70 border-b border-ink/20 pb-1">
                  <span>PARTICIPANT SUBMISSIONS ({completedCount}/{totalCount})</span>
                  <span>DELIVERABLE LINKS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sprint.participants?.map((p) => (
                    <div key={p.id} className="p-3 border border-ink bg-white space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-[11px]">
                        <span className="text-ink uppercase">{p.name}</span>
                        <span className={p.submission ? 'text-campus-green' : 'text-brutal-red'}>
                          {p.submission ? 'DELIVERED ✓' : 'PENDING'}
                        </span>
                      </div>
                      <p className="text-[10px] text-ink/60 uppercase">{p.role}</p>
                      {p.submission && (
                        <div className="pt-1 text-[10px] font-sans space-y-0.5">
                          <a
                            href={p.submission.deliverableUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brutal-red underline font-mono font-bold block truncate"
                          >
                            ↳ {p.submission.deliverableUrl}
                          </a>
                          <p className="text-ink/80 italic">"{p.submission.description}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Supervisory Review Summary */}
              {sprint.reviewerFeedback && (
                <div className="p-4 border-2 border-ink bg-canvas text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold border-b border-ink/20 pb-1">
                    <span className="uppercase text-ink">
                      SUPERVISOR EVALUATION // {sprint.reviewerFeedback.reviewer}
                    </span>
                    {sprint.reviewerFeedback.score && (
                      <span className="bg-signal-yellow px-2 py-0.5 border border-ink text-ink font-bold">
                        SCORE: {sprint.reviewerFeedback.score}/100
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-ink">{sprint.reviewerFeedback.notes}</p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 border-t border-ink/20 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenReview(sprint)}
                  className="text-xs font-bold"
                >
                  [ {sprint.status === 'Completed' ? 'RE-EVALUATE SPRINT' : 'GRADE & CERTIFY SPRINT'} → ]
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="GRADE TRIAL SPRINT"
        description="Record faculty score, evaluate deliverable quality, and authorize long-term team formation."
      >
        <form onSubmit={handleConfirmReview} className="space-y-4 font-mono">
          <Input
            label="SUPERVISORY SPRINT SCORE (OUT OF 100)"
            type="number"
            value={reviewScore}
            onChange={(e) => setReviewScore(e.target.value)}
            required
          />

          <Textarea
            label="FACULTY SUPERVISOR NOTES & TEAMWORK OBSERVATION"
            rows={3}
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            required
          />

          <Textarea
            label="RETROSPECTIVE & NEXT STEPS"
            rows={2}
            value={retroNotes}
            onChange={(e) => setRetroNotes(e.target.value)}
            required
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setReviewModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" type="submit">
              [ CERTIFY SPRINT COMPLETION ✓ ]
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
