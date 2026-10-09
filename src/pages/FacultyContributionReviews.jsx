import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

export default function FacultyContributionReviews() {
  const { user } = useAuth();
  const { contributions, reviewContribution } = useAppData();
  const { addToast } = useToast();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const handleOpenReview = (c) => {
    setSelectedContribution(c);
    setReviewNotes('Evidence inspected. Code benchmarks and clinical documentation verified.');
    setReviewModalOpen(true);
  };

  const handleConfirmReview = async (e) => {
    e.preventDefault();
    if (!selectedContribution) return;

    await reviewContribution(selectedContribution.id, {
      status: 'Reviewed',
      reviewerId: user?.id || 'faculty-1',
      reviewerName: user?.name || 'Dr. Aris Thorne',
      reviewerRole: user?.designation || 'Faculty Supervisor',
      reviewNotes: reviewNotes.trim(),
    });

    addToast({
      type: 'success',
      title: 'CONTRIBUTION REVIEWED',
      message: `Verified contribution: "${selectedContribution.taskTitle}" by ${selectedContribution.contributorName}.`,
    });
    setReviewModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
            <BookOpen className="w-4 h-4 text-ink" />
            <span>FACULTY WORKFLOW // CONTRIBUTION LEDGER REVIEWS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            CONTRIBUTION REVIEWS.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            INSPECT SUBMITTED REPOSITORIES · AUDIT PRACTICAL DELIVERABLES · FORMAL SUPERVISORY SIGN-OFF
          </p>
        </div>

        <div className="text-xs font-mono font-bold bg-canvas border-2 border-ink px-3 py-1.5 shadow-brutal-sm">
          <span>LEDGER QUEUE: {contributions?.length || 0} TOTAL RECORDS</span>
        </div>
      </div>

      {/* 2. Contributions List */}
      <div className="space-y-4 font-mono">
        {contributions?.map((c) => {
          const isPending = c.status === 'Submitted' || c.status === 'Awaiting Review';

          return (
            <div
              key={c.id}
              className={`p-6 border-2 border-ink shadow-brutal space-y-4 ${
                isPending ? 'bg-white' : 'bg-canvas'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3 text-xs">
                <div>
                  <span className="font-display font-black text-lg text-ink uppercase">
                    {c.contributorName} // {c.taskTitle}
                  </span>
                  <span className="text-[10px] text-ink/60 uppercase block">
                    PROJECT: {c.projectTitle} · DATE: {c.date} · CAT: {c.category}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-xs font-bold uppercase border ${
                    c.status === 'Reviewed'
                      ? 'bg-campus-green text-white border-ink'
                      : 'bg-signal-yellow text-ink border-ink'
                  }`}
                >
                  ● {c.status}
                </span>
              </div>

              {/* Description & Links */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-sans">
                <div className="md:col-span-8 space-y-2">
                  <p className="text-ink leading-relaxed font-normal">{c.description}</p>
                  <div className="font-mono text-[11px] pt-1">
                    <a
                      href={c.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brutal-red hover:underline font-bold"
                    >
                      <span>[ INSPECT DELIVERABLE ARTIFACT ]</span>
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                    </a>
                  </div>

                  <div className="text-[11px] font-mono text-ink/80 flex items-start gap-1.5 bg-signal-yellow/15 p-2 border border-ink/40">
                    <Sparkles className="w-3.5 h-3.5 text-ink flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>AI DISCLOSURE:</strong> {c.aiDisclosure}
                    </div>
                  </div>

                  {c.reviewNotes && (
                    <div className="p-3 border border-ink bg-white font-mono text-[11px] space-y-0.5">
                      <div className="text-[10px] font-bold text-ink/60 uppercase">
                        FACULTY REVIEW NOTE ({c.reviewerName || 'FACULTY'}):
                      </div>
                      <p className="font-sans text-ink">{c.reviewNotes}</p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-4 border-t md:border-t-0 md:border-l-2 border-ink md:pl-4 flex flex-col justify-between font-mono">
                  <div className="text-xs space-y-1">
                    <span className="text-[10px] text-ink/60 uppercase font-bold">EVIDENCE TYPE:</span>
                    <p className="font-bold text-ink uppercase">{c.evidenceType}</p>
                  </div>

                  <div className="pt-3">
                    {c.status !== 'Reviewed' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-xs font-bold"
                        onClick={() => handleOpenReview(c)}
                      >
                        [ REVIEW & ENDORSE → ]
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-campus-green font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>SUPERVISOR APPROVED</span>
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
        title="REVIEW PROJECT CONTRIBUTION"
        description="Record supervisory feedback and append approval to student's verifiable ledger."
      >
        <form onSubmit={handleConfirmReview} className="space-y-4 font-mono">
          <p className="text-xs text-ink/80 font-sans">
            Deliverable: <strong>{selectedContribution?.taskTitle}</strong> by <strong>{selectedContribution?.contributorName}</strong>.
          </p>

          <Textarea
            label="FACULTY SUPERVISOR EVALUATION NOTE"
            rows={3}
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            required
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setReviewModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" type="submit">
              [ CERTIFY CONTRIBUTION ✓ ]
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
