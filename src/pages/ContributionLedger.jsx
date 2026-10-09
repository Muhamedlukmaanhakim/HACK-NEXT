import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

const CONTRIBUTION_CATEGORIES = [
  'Engineering / Frontend',
  'Engineering / Backend',
  'Engineering / ML',
  'Design / Product',
  'Testing & QA',
  'Research & Compliance',
  'Documentation & Specs',
  'Coordination & Agile',
];

const AI_DISCLOSURE_OPTIONS = [
  'None. Completely hand-authored logic and design.',
  'Copilot/Code Completion used for syntax and unit test boilerplate.',
  'Generative AI draft used for initial outline, then manually rewritten and verified.',
  'Significant AI assistance; all logic vetted and tested by contributor.',
];

export default function ContributionLedger() {
  const { user } = useAuth();
  const { contributions, teams, submitContribution, disputeContribution, reviewContribution } = useAppData();
  const { addToast } = useToast();

  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);

  // Form state for creating a new contribution entry
  const [newEntry, setNewEntry] = useState({
    taskTitle: '',
    category: 'Engineering / ML',
    description: '',
    evidenceType: 'GitHub Pull Request / Commit',
    evidenceUrl: '',
    aiDisclosure: AI_DISCLOSURE_OPTIONS[0],
  });

  // Dispute state
  const [disputeReason, setDisputeReason] = useState('');

  const activeTeam = teams?.[0];

  const filteredContributions = useMemo(() => {
    return (contributions || []).filter((item) => {
      if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
      if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.taskTitle?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchAuthor = item.contributorName?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchAuthor) return false;
      }
      return true;
    });
  }, [contributions, filterCategory, filterStatus, searchQuery]);

  const handleCreateContribution = async (e) => {
    e.preventDefault();
    if (!newEntry.taskTitle.trim() || !newEntry.description.trim() || !newEntry.evidenceUrl.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please provide task title, description, and supporting evidence URL.',
      });
      return;
    }

    await submitContribution({
      teamId: activeTeam?.id || 'team-1',
      opportunityId: activeTeam?.opportunityId || 'opp-1',
      projectTitle: activeTeam?.name || 'AI Healthcare Assistant',
      contributorId: user?.id || 'student-1',
      contributorName: user?.name || 'Lukmaan Hakim',
      contributorRole: user?.role === 'student' ? 'Contributor' : 'Team Lead',
      taskTitle: newEntry.taskTitle.trim(),
      category: newEntry.category,
      description: newEntry.description.trim(),
      evidenceType: newEntry.evidenceType,
      evidenceUrl: newEntry.evidenceUrl.trim(),
      aiDisclosure: newEntry.aiDisclosure,
    });

    addToast({
      type: 'success',
      title: 'RECORD APPENDED TO LEDGER',
      message: 'Contribution evidence logged for peer and faculty review.',
    });
    setCreateModalOpen(false);
    setNewEntry({
      taskTitle: '',
      category: 'Engineering / ML',
      description: '',
      evidenceType: 'GitHub Pull Request / Commit',
      evidenceUrl: '',
      aiDisclosure: AI_DISCLOSURE_OPTIONS[0],
    });
  };

  const handleConfirmDispute = async (e) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;

    await disputeContribution(selectedContribution.id, {
      studentName: user?.name || 'Student Contributor',
      disputeReason: disputeReason.trim(),
    });

    addToast({
      type: 'info',
      title: 'DISPUTE FLAGGED',
      message: 'Contribution record marked for faculty mediation without erasing audit log.',
    });
    setDisputeModalOpen(false);
    setDisputeReason('');
  };

  const handleAcknowledgePeer = async (contrib) => {
    await reviewContribution(contrib.id, {
      status: 'Acknowledged',
      reviewerId: user?.id || 'student-1',
      reviewerName: user?.name || 'Teammate',
      reviewerRole: 'Peer Collaborator',
      reviewNotes: `Acknowledged by peer ${user?.name || 'Collaborator'}. Verified contribution delivered to project.`,
    });
    addToast({
      type: 'success',
      title: 'CONTRIBUTION ACKNOWLEDGED',
      message: `You acknowledged ${contrib.contributorName}'s contribution.`,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Reviewed':
        return 'bg-campus-green text-white border-ink';
      case 'Acknowledged':
        return 'bg-signal-yellow text-ink border-ink';
      case 'Awaiting Review':
        return 'bg-white text-ink border-ink';
      case 'Submitted':
        return 'bg-canvas text-ink border-ink';
      case 'Disputed':
        return 'bg-brutal-red text-white border-ink';
      case 'Needs Clarification':
        return 'bg-signal-yellow/40 text-ink border-ink';
      default:
        return 'bg-canvas text-ink border-ink';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
            <BookOpen className="w-4 h-4 text-ink" />
            <span>PRIORITY FEATURE 02 // VERIFIABLE CONTRIBUTION LEDGER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            CONTRIBUTION LEDGER.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            WHAT DID EACH PERSON BUILD · SUPPORTING EVIDENCE · REVIEWS & AUDIT TRAILS
          </p>
        </div>

        <Button
          variant="danger"
          size="md"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          [ + LOG CONTRIBUTION RECORD → ]
        </Button>
      </div>

      {/* 2. Integrity Principle Stamp */}
      <div className="p-4 border-2 border-ink bg-white shadow-brutal font-mono text-xs space-y-1.5">
        <div className="flex items-center justify-between border-b border-ink/20 pb-1 font-bold text-ink/70 uppercase">
          <span className="flex items-center gap-1.5 text-ink">
            <ShieldCheck className="w-4 h-4 text-campus-green" />
            INTEGRITY PRINCIPLE: NO EMPTY COMMIT COUNT LEADERBOARDS
          </span>
          <span className="bg-canvas border border-ink px-1.5 py-0.2">SECTION 08 COMPLIANT</span>
        </div>
        <p className="text-xs font-sans text-ink/85 leading-relaxed">
          Git commits alone do not prove sole authorship, and not every meaningful contribution produces code. CollabMatrix records design, testing, architectural specifications, clinical compliance research, and coordination with mandatory AI disclosures and auditable peer/supervisor review workflows.
        </p>
      </div>

      {/* 3. Filters & Search */}
      <div className="p-4 border-2 border-ink bg-white shadow-brutal-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono">
        <div className="flex-1">
          <Input
            placeholder="Search deliverables, authors, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'STATUS: ALL' },
              { value: 'Reviewed', label: 'STATUS: REVIEWED ✓' },
              { value: 'Acknowledged', label: 'STATUS: ACKNOWLEDGED' },
              { value: 'Awaiting Review', label: 'STATUS: AWAITING REVIEW' },
              { value: 'Submitted', label: 'STATUS: SUBMITTED' },
              { value: 'Disputed', label: 'STATUS: DISPUTED ⚠' },
            ]}
          />

          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[
              { value: 'ALL', label: 'CATEGORY: ALL' },
              ...CONTRIBUTION_CATEGORIES.map((c) => ({ value: c, label: `CAT: ${c.toUpperCase()}` })),
            ]}
          />
        </div>
      </div>

      {/* 4. Ledger Entries Table / Responsive Cards */}
      <div className="space-y-4">
        {filteredContributions.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-ink bg-white font-mono">
            <BookOpen className="w-8 h-8 text-ink/40 mx-auto mb-2" />
            <h3 className="font-display font-black text-base uppercase text-ink">NO CONTRIBUTIONS MATCH FILTER</h3>
            <p className="text-xs text-ink/60 mt-1">Adjust search parameters or log a new deliverable entry above.</p>
          </div>
        ) : (
          filteredContributions.map((item, idx) => {
            const isOwnRecord = item.contributorId === user?.id;

            return (
              <div
                key={item.id}
                className="p-5 sm:p-6 bg-white border-2 border-ink shadow-brutal space-y-4 font-mono"
              >
                {/* Entry Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brutal-red">
                      #{String(idx + 1).padStart(3, '0')}
                    </span>
                    <span className="text-xs font-bold text-ink uppercase">
                      {item.taskTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-canvas border border-ink px-2 py-0.5 text-ink/75 uppercase">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 border ${getStatusBadge(item.status)} uppercase`}>
                      ● {item.status}
                    </span>
                  </div>
                </div>

                {/* Contributor & Description */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-sans">
                  <div className="md:col-span-4 font-mono space-y-1">
                    <div className="text-[10px] text-ink/50 uppercase font-bold">CONTRIBUTOR:</div>
                    <div className="font-bold text-sm text-ink uppercase">{item.contributorName}</div>
                    <div className="text-[11px] text-ink/70 uppercase">{item.contributorRole}</div>
                    <div className="text-[10px] text-ink/50 pt-1">DATE: {item.date}</div>
                  </div>

                  <div className="md:col-span-8 space-y-2">
                    <p className="text-ink leading-relaxed font-normal">{item.description}</p>

                    {/* Evidence Link & Type */}
                    <div className="p-2.5 border border-ink bg-canvas font-mono text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-ink/60 uppercase font-bold">EVIDENCE TYPE: </span>
                        <strong className="text-ink uppercase">{item.evidenceType}</strong>
                      </div>
                      <a
                        href={item.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brutal-red hover:underline font-bold"
                      >
                        <span>[ INSPECT EVIDENCE ]</span>
                        <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                      </a>
                    </div>

                    {/* AI Disclosure */}
                    <div className="text-[11px] font-mono text-ink/80 flex items-start gap-1.5 bg-signal-yellow/15 p-2 border border-ink/40">
                      <Sparkles className="w-3.5 h-3.5 text-ink flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>AI DISCLOSURE:</strong> {item.aiDisclosure}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Notes & Audit History */}
                {item.reviewNotes && (
                  <div className="p-3 border-2 border-ink bg-canvas text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-ink/60 uppercase">
                      <span>SUPERVISORY REVIEW NOTE // {item.reviewerName || 'FACULTY'} ({item.reviewerRole || 'SUPERVISOR'})</span>
                      {item.reviewedAt && <span>{new Date(item.reviewedAt).toLocaleDateString()}</span>}
                    </div>
                    <p className="font-sans text-ink leading-snug">{item.reviewNotes}</p>
                  </div>
                )}

                {/* Action Strip & Audit Trail */}
                <div className="pt-3 border-t border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-[10px] text-ink/60 uppercase">
                    AUDIT ENTRIES: {item.auditHistory?.length || 1} EVENT(S) RECORDED
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Peer Acknowledge Button */}
                    {!isOwnRecord && item.status !== 'Reviewed' && item.status !== 'Acknowledged' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcknowledgePeer(item)}
                        className="text-xs"
                      >
                        [ ACKNOWLEDGE AS PEER ✓ ]
                      </Button>
                    )}

                    {/* Dispute Button */}
                    {item.status !== 'Disputed' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedContribution(item);
                          setDisputeModalOpen(true);
                        }}
                        className="text-[11px] text-ink/60 hover:text-brutal-red font-bold uppercase transition-colors"
                      >
                        [ FLAG DISPUTE / CLARIFICATION ]
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal 1: Log Contribution Record */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="LOG CONTRIBUTION RECORD"
        description="Append an evidence-backed deliverable entry to your project ledger."
      >
        <form onSubmit={handleCreateContribution} className="space-y-4 font-mono">
          <Input
            label="TASK / DELIVERABLE TITLE"
            placeholder="e.g. Ingestion Pipeline & Denoising Filter"
            value={newEntry.taskTitle}
            onChange={(e) => setNewEntry({ ...newEntry, taskTitle: e.target.value })}
            required
          />

          <Select
            label="CONTRIBUTION CATEGORY"
            value={newEntry.category}
            onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
            options={CONTRIBUTION_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />

          <Textarea
            label="DESCRIPTION OF YOUR CONTRIBUTION"
            rows={3}
            placeholder="Clearly articulate what you engineered, designed, tested, or synthesized..."
            value={newEntry.description}
            onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="EVIDENCE TYPE"
              placeholder="e.g. GitHub PR #14, Figma File, Test Suite"
              value={newEntry.evidenceType}
              onChange={(e) => setNewEntry({ ...newEntry, evidenceType: e.target.value })}
              required
            />
            <Input
              label="EVIDENCE REFERENCE URL"
              placeholder="https://github.com/... or https://figma.com/..."
              value={newEntry.evidenceUrl}
              onChange={(e) => setNewEntry({ ...newEntry, evidenceUrl: e.target.value })}
              required
            />
          </div>

          <Select
            label="AI-ASSISTANCE DISCLOSURE"
            value={newEntry.aiDisclosure}
            onChange={(e) => setNewEntry({ ...newEntry, aiDisclosure: e.target.value })}
            options={AI_DISCLOSURE_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" type="submit">
              [ SUBMIT RECORD TO LEDGER → ]
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Flag Dispute / Clarification */}
      <Modal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        title="FLAG CONTRIBUTION DISPUTE"
        description="Flag an inaccuracy or request clarification without erasing historical audit logs."
      >
        <form onSubmit={handleConfirmDispute} className="space-y-4 font-mono">
          <p className="text-xs text-ink/80 font-sans">
            You are flagging record: <strong>{selectedContribution?.taskTitle}</strong> by <strong>{selectedContribution?.contributorName}</strong>.
          </p>

          <Textarea
            label="REASON FOR DISPUTE OR REQUIRED CLARIFICATION"
            rows={3}
            placeholder="Specify what work was overlapping, improperly attributed, or in need of verification..."
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            required
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDisputeModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" type="submit">
              [ SUBMIT DISPUTE AUDIT → ]
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
