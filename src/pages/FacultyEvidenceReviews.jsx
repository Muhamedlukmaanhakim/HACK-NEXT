import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Award,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Filter,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { SKILL_STATUSES } from '../data/skillEvidence';

export default function FacultyEvidenceReviews() {
  const { user } = useAuth();
  const { skillEvidences, reviewSkillEvidence } = useAppData();
  const { addToast } = useToast();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    score: 95,
    notes: 'Code implementation conforms to departmental standards. Reproducibility verified.',
    limitations: 'Validated for signal processing and deep learning modules.',
  });

  const handleOpenReview = (ev) => {
    setSelectedEvidence(ev);
    setReviewForm({
      score: ev.assessmentResult?.score || 95,
      notes: 'Code implementation conforms to departmental standards. Reproducibility verified.',
      limitations: ev.limitations || 'Validated for production-grade sprint tasks.',
    });
    setReviewModalOpen(true);
  };

  const handleConfirmReview = async (e) => {
    e.preventDefault();
    if (!selectedEvidence) return;

    await reviewSkillEvidence(selectedEvidence.id, {
      reviewer: user?.name || 'Dr. Aris Thorne',
      reviewerRole: user?.designation || 'Professor & Lab Director',
      score: reviewForm.score,
      notes: reviewForm.notes,
      limitations: reviewForm.limitations,
    });

    addToast({
      type: 'success',
      title: 'EVIDENCE CERTIFIED',
      message: `${selectedEvidence.skill} evidence for ${selectedEvidence.studentName} has been certified as INDEPENDENTLY_REVIEWED.`,
    });
    setReviewModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brutal-red mb-1">
            <ShieldCheck className="w-4 h-4 text-campus-green" />
            <span>FACULTY WORKFLOW // EVIDENCE AUDIT QUEUE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            SKILL REVIEWS.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            INSPECT SUBMITTED REPOSITORIES · AUDIT PRACTICAL ASSESSMENTS · GRANT VERIFIED STATUS
          </p>
        </div>

        <div className="text-xs font-mono font-bold bg-canvas border-2 border-ink px-3 py-1.5 shadow-brutal-sm">
          <span>QUEUE: {skillEvidences?.length || 0} TOTAL RECORDS</span>
        </div>
      </div>

      {/* 2. Review Table / Cards */}
      <div className="space-y-4 font-mono">
        {skillEvidences?.map((ev) => {
          const isPending = ev.status === SKILL_STATUSES.EVIDENCE_SUBMITTED || ev.status === SKILL_STATUSES.PRACTICALLY_DEMONSTRATED;

          return (
            <div
              key={ev.id}
              className={`p-6 border-2 border-ink shadow-brutal space-y-4 ${
                isPending ? 'bg-white' : 'bg-canvas'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3 text-xs">
                <div>
                  <span className="font-display font-black text-lg text-ink uppercase">
                    {ev.studentName} // {ev.skill}
                  </span>
                  <span className="text-[10px] text-ink/60 uppercase block">
                    SUBMISSION: {ev.submissionDate} · TYPE: {ev.evidenceType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold uppercase border ${
                      ev.status === SKILL_STATUSES.INDEPENDENTLY_REVIEWED
                        ? 'bg-campus-green text-white border-ink'
                        : 'bg-signal-yellow text-ink border-ink'
                    }`}
                  >
                    ● {ev.status}
                  </span>
                </div>
              </div>

              {/* Description & Links */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-sans">
                <div className="md:col-span-8 space-y-2">
                  <p className="text-ink leading-relaxed font-normal">{ev.description}</p>
                  {ev.evidenceUrl && !ev.evidenceUrl.startsWith('#') && (
                    <div className="font-mono text-[11px] pt-1">
                      <a
                        href={ev.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brutal-red hover:underline font-bold"
                      >
                        <span>[ INSPECT STUDENT REPOSITORY / ARTIFACT ]</span>
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      </a>
                    </div>
                  )}

                  {ev.reviewNotes && (
                    <div className="p-3 border border-ink bg-white font-mono text-[11px] space-y-0.5">
                      <div className="text-[10px] font-bold text-ink/60 uppercase">
                        FACULTY REVIEW NOTE ({ev.reviewer || 'FACULTY'}):
                      </div>
                      <p className="font-sans text-ink">{ev.reviewNotes}</p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-4 border-t md:border-t-0 md:border-l-2 border-ink md:pl-4 space-y-3 font-mono">
                  {ev.assessmentResult && (
                    <div className="p-3 border border-ink bg-white space-y-1">
                      <div className="text-[10px] text-ink/60 uppercase font-bold">PRACTICAL SCORE:</div>
                      <div className="text-2xl font-display font-black text-ink">{ev.assessmentResult.score}/100</div>
                      <p className="text-[10px] text-campus-green font-bold uppercase">{ev.assessmentResult.taskName}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    {ev.status !== SKILL_STATUSES.INDEPENDENTLY_REVIEWED ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-xs font-bold"
                        onClick={() => handleOpenReview(ev)}
                      >
                        [ AUDIT & CERTIFY → ]
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-campus-green font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>FACULTY ENDORSED</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="CERTIFY SKILL EVIDENCE"
        description="Verify artifact ownership and record departmental endorsement."
      >
        <form onSubmit={handleConfirmReview} className="space-y-4 font-mono">
          <p className="text-xs text-ink/80 font-sans">
            Candidate: <strong>{selectedEvidence?.studentName}</strong> · Skill: <strong>{selectedEvidence?.skill}</strong>
          </p>

          <Input
            label="EVALUATION SCORE (OUT OF 100)"
            type="number"
            value={reviewForm.score}
            onChange={(e) => setReviewForm({ ...reviewForm, score: Number(e.target.value) })}
            required
          />

          <Textarea
            label="FACULTY SUPERVISOR NOTES & RUBRIC FEEDBACK"
            rows={3}
            value={reviewForm.notes}
            onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
            required
          />

          <Input
            label="RECORDED SCOPE & LIMITATIONS"
            value={reviewForm.limitations}
            onChange={(e) => setReviewForm({ ...reviewForm, limitations: e.target.value })}
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setReviewModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" type="submit">
              [ GRANT INDEPENDENTLY_REVIEWED STATUS ✓ ]
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
