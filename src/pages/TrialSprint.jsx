import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Users,
  ShieldCheck,
  Award,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

export default function TrialSprint() {
  const { user } = useAuth();
  const { trialSprints, teams, createTrialSprint, submitSprintDeliverable } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);

  // Form state for creating a new Trial Sprint
  const [newSprintForm, setNewSprintForm] = useState({
    title: '',
    objective: '',
    expectedDeliverable: '',
    duration: '48 Hours',
    deadline: '',
    requiredSkills: ['Python', 'UI/UX'],
    aiPolicy: 'AI code completion permitted for boilerplate. Algorithmic and design decisions must be explained by candidate.',
  });

  // Form state for submitting sprint deliverable
  const [submissionForm, setSubmissionForm] = useState({
    deliverableUrl: '',
    description: '',
    blockersEncountered: '',
  });

  const activeTeam = teams?.[0];
  const sprints = trialSprints || [];

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    if (!newSprintForm.title.trim() || !newSprintForm.objective.trim() || !newSprintForm.expectedDeliverable.trim()) {
      addToast({ type: 'error', title: 'Missing Fields', message: 'Please specify title, objective, and deliverable.' });
      return;
    }

    const created = await createTrialSprint({
      ...newSprintForm,
      teamId: activeTeam?.id || 'team-1',
      projectTitle: activeTeam?.name || 'AI Healthcare Assistant',
      participants: (activeTeam?.members || []).map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role || 'Sprint Participant',
        status: 'Accepted',
        assignedTask: `Deliverable module for ${m.name}`,
        submission: null,
      })),
      evaluationCriteria: [
        { name: 'Deliverable Quality', weight: '40%', description: 'Conforms to prompt specification' },
        { name: 'Communication & Coordination', weight: '30%', description: 'Asynchronous updates and blocker reports' },
        { name: 'Individual Evidence Ownership', weight: '30%', description: 'Attribution clarity' },
      ],
      reviewerFeedback: {
        reviewer: 'Dr. Aris Thorne',
        reviewerRole: 'Faculty Supervisor',
        reviewedAt: null,
        score: null,
        notes: 'Sprint registered. Awaiting participant submissions.',
      },
    });

    addToast({
      type: 'success',
      title: 'TRIAL SPRINT INITIALIZED',
      message: `${created.title} is now active!`,
    });
    setCreateModalOpen(false);
  };

  const handleOpenSubmit = (sprint) => {
    setSelectedSprint(sprint);
    setSubmissionForm({ deliverableUrl: '', description: '', blockersEncountered: '' });
    setSubmitModalOpen(true);
  };

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!submissionForm.deliverableUrl.trim() || !submissionForm.description.trim()) {
      addToast({ type: 'error', title: 'Incomplete Submission', message: 'Provide both deliverable link and explanation.' });
      return;
    }

    await submitSprintDeliverable(selectedSprint.id, user?.id || 'student-1', submissionForm);
    addToast({
      type: 'success',
      title: 'DELIVERABLE SUBMITTED',
      message: 'Your sprint task has been submitted for peer and faculty review.',
    });
    setSubmitModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brutal-red mb-1">
            <Zap className="w-4 h-4" />
            <span>PRIORITY FEATURE 01 // TRIAL SPRINT WORKSPACE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            TRIAL SPRINT.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            TEST TEAMWORK BEFORE COMMITMENT · SCOPED 48H MINI-MILESTONES · ZERO FABRICATED EVALUATIONS
          </p>
        </div>

        <Button
          variant="danger"
          size="md"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          [ + INITIALIZE TRIAL SPRINT → ]
        </Button>
      </div>

      {/* 2. Educational Brutalist Rule Card */}
      <div className="border-2 border-ink bg-white p-5 shadow-brutal font-mono text-xs space-y-2">
        <div className="flex items-center justify-between border-b border-ink/20 pb-1.5 font-bold text-ink/70 uppercase">
          <span className="flex items-center gap-1.5 text-ink">
            <ShieldCheck className="w-4 h-4 text-campus-green" />
            COLLABORATION PROTOCOL: WHY TRIAL SPRINTS MATTER
          </span>
          <span className="bg-signal-yellow text-ink px-2 py-0.5 border border-ink">CORE DIFFERENTIATOR</span>
        </div>
        <p className="text-xs font-sans text-ink/85 leading-relaxed">
          High-performing teams aren’t formed by matching resumes; they’re formed by testing communication, code review turnaround, and how candidates handle blockers. A Trial Sprint gives prospective teammates a low-stakes 48-to-72 hour challenge to validate working compatibility before committing to a semester-long project or hackathon squad.
        </p>
      </div>

      {/* 3. Sprints List */}
      <div className="space-y-6">
        {sprints.map((sprint) => {
          const participantCount = sprint.participants?.length || 0;
          const completedSubmissions = (sprint.participants || []).filter((p) => p.submission).length;
          const userParticipant = (sprint.participants || []).find((p) => p.id === user?.id);

          return (
            <div
              key={sprint.id}
              className="p-6 bg-white border-2 border-ink shadow-brutal space-y-6 font-mono"
            >
              {/* Sprint Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="bg-canvas border border-ink px-2 py-0.5 text-ink uppercase">
                      {sprint.duration} DURATION
                    </span>
                    <span className="text-ink/60 uppercase">
                      PROJECT: {sprint.projectTitle}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-ink uppercase tracking-tight">
                    {sprint.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold uppercase border-2 border-ink ${
                      sprint.status === 'Completed'
                        ? 'bg-campus-green text-white'
                        : sprint.status === 'Active'
                        ? 'bg-signal-yellow text-ink'
                        : 'bg-canvas text-ink'
                    }`}
                  >
                    ● STATUS: {sprint.status}
                  </span>
                </div>
              </div>

              {/* Objective & Spec */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 border-2 border-ink bg-canvas space-y-1">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">SPRINT OBJECTIVE:</span>
                  <p className="font-sans text-ink leading-relaxed font-medium">{sprint.objective}</p>
                </div>
                <div className="p-3.5 border-2 border-ink bg-white space-y-1">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">EXPECTED DELIVERABLE:</span>
                  <p className="font-sans text-ink leading-relaxed font-medium">{sprint.expectedDeliverable}</p>
                </div>
              </div>

              {/* AI & Attribution Rules */}
              <div className="p-3 border border-ink bg-canvas text-[11px] font-mono flex items-start gap-2">
                <Award className="w-4 h-4 text-brutal-red flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="uppercase">AI-USE & ATTRIBUTION POLICY:</strong> {sprint.aiPolicy}
                </div>
              </div>

              {/* Participants & Task Submissions Roster */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-ink/20 pb-1 text-xs font-bold text-ink/70 uppercase">
                  <span>PARTICIPANT WORK & SUBMISSION LEDGER</span>
                  <span>{completedSubmissions} / {participantCount} DELIVERED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sprint.participants?.map((p) => {
                    const isCurrentUser = p.id === user?.id;
                    const hasSubmitted = Boolean(p.submission);

                    return (
                      <div
                        key={p.id}
                        className={`p-3.5 border-2 border-ink flex flex-col justify-between space-y-2.5 ${
                          hasSubmitted ? 'bg-white' : 'bg-canvas'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-ink uppercase">{p.name}</span>
                            <span className={hasSubmitted ? 'text-campus-green' : 'text-brutal-red'}>
                              {hasSubmitted ? 'DELIVERED ✓' : 'PENDING'}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-ink/60 uppercase">{p.role}</p>
                          <div className="editorial-separator" />
                          <p className="text-[11px] font-sans text-ink/80 leading-snug">
                            <strong>Task:</strong> {p.assignedTask}
                          </p>

                          {hasSubmitted && (
                            <div className="pt-1 space-y-1 text-[10px] font-sans">
                              <p className="text-ink font-mono font-bold truncate">
                                ↳ <a href={p.submission.deliverableUrl} target="_blank" rel="noopener noreferrer" className="text-brutal-red underline hover:text-ink">
                                  {p.submission.deliverableUrl}
                                </a>
                              </p>
                              <p className="text-ink/80 italic">"{p.submission.description}"</p>
                              {p.submission.blockersEncountered && (
                                <p className="text-brutal-red">Blocker: {p.submission.blockersEncountered}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {isCurrentUser && !hasSubmitted && sprint.status === 'Active' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full text-xs font-bold"
                            icon={Send}
                            onClick={() => handleOpenSubmit(sprint)}
                          >
                            [ SUBMIT WORK → ]
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviewer Feedback Section */}
              {sprint.reviewerFeedback && (
                <div className="p-4 border-2 border-ink bg-canvas space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold border-b border-ink/20 pb-1">
                    <span className="uppercase text-ink">
                      SUPERVISORY REVIEW // {sprint.reviewerFeedback.reviewer} ({sprint.reviewerFeedback.reviewerRole})
                    </span>
                    {sprint.reviewerFeedback.score && (
                      <span className="bg-signal-yellow px-2 py-0.5 border border-ink text-ink font-bold">
                        SCORE: {sprint.reviewerFeedback.score}/100
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-ink/90 leading-relaxed">
                    {sprint.reviewerFeedback.notes || 'Observational review in progress.'}
                  </p>
                  {sprint.retrospectiveNotes && (
                    <p className="text-[11px] text-ink/75 font-mono pt-1">
                      <strong>RETROSPECTIVE:</strong> {sprint.retrospectiveNotes}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal 1: Create Trial Sprint */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="INITIALIZE TRIAL SPRINT"
        description="Design a small 48h to 72h collaborative test task for prospective team members."
      >
        <form onSubmit={handleCreateSprint} className="space-y-4 font-mono">
          <Input
            label="SPRINT TITLE"
            placeholder="e.g. Trial Sprint #2: Auth Microservice & State Hook"
            value={newSprintForm.title}
            onChange={(e) => setNewSprintForm({ ...newSprintForm, title: e.target.value })}
            required
          />

          <Textarea
            label="COLLABORATION OBJECTIVE"
            rows={2}
            placeholder="What should this test? Example: Test async communication and code review turnaround."
            value={newSprintForm.objective}
            onChange={(e) => setNewSprintForm({ ...newSprintForm, objective: e.target.value })}
            required
          />

          <Textarea
            label="EXPECTED DELIVERABLE"
            rows={2}
            placeholder="Clear, small deliverable (e.g. working script, Figma interactive wireframe, PR with tests)."
            value={newSprintForm.expectedDeliverable}
            onChange={(e) => setNewSprintForm({ ...newSprintForm, expectedDeliverable: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="DURATION"
              value={newSprintForm.duration}
              onChange={(e) => setNewSprintForm({ ...newSprintForm, duration: e.target.value })}
              options={[
                { value: '24 Hours', label: '24 HOURS (HACKATHON WARMUP)' },
                { value: '48 Hours', label: '48 HOURS (STANDARD TRIAL)' },
                { value: '72 Hours', label: '72 HOURS (WEEKEND SPRINT)' },
                { value: '7 Days', label: '07 DAYS (MILESTONE TRIAL)' },
              ]}
            />
            <Input
              label="DEADLINE DATE"
              type="date"
              value={newSprintForm.deadline}
              onChange={(e) => setNewSprintForm({ ...newSprintForm, deadline: e.target.value })}
            />
          </div>

          <Textarea
            label="AI-USE & ATTRIBUTION POLICY"
            rows={2}
            value={newSprintForm.aiPolicy}
            onChange={(e) => setNewSprintForm({ ...newSprintForm, aiPolicy: e.target.value })}
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" type="submit">
              [ LAUNCH SPRINT → ]
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Submit Sprint Deliverable */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="SUBMIT SPRINT DELIVERABLE"
        description="Provide the working link, explain your work, and report any blockers encountered."
      >
        <form onSubmit={handleSubmitDeliverable} className="space-y-4 font-mono">
          <Input
            label="DELIVERABLE LINK (GITHUB / FIGMA / DOC / NOTION)"
            placeholder="https://github.com/..."
            value={submissionForm.deliverableUrl}
            onChange={(e) => setSubmissionForm({ ...submissionForm, deliverableUrl: e.target.value })}
            required
          />

          <Textarea
            label="WHAT DID YOU BUILD & HOW DOES IT WORK?"
            rows={3}
            placeholder="Explain your approach, key decisions, and testing steps..."
            value={submissionForm.description}
            onChange={(e) => setSubmissionForm({ ...submissionForm, description: e.target.value })}
            required
          />

          <Textarea
            label="BLOCKERS OR COLLABORATION CHALLENGES ENCOUNTERED"
            rows={2}
            placeholder="What delayed you or required clarification from teammates? (Honest reflections are encouraged)"
            value={submissionForm.blockersEncountered}
            onChange={(e) => setSubmissionForm({ ...submissionForm, blockersEncountered: e.target.value })}
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setSubmitModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="primary" size="sm" type="submit">
              [ TRANSMIT DELIVERABLE → ]
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
