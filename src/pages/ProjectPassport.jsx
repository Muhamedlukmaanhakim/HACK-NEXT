import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Zap,
  Target,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

export default function ProjectPassport() {
  const { user } = useAuth();
  const { skillEvidences, contributions, trialSprints, teams } = useAppData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('passport'); // 'passport' | 'growth'

  const userEvidences = (skillEvidences || []).filter((e) => e.studentId === user?.id);
  const userContributions = (contributions || []).filter(
    (c) => c.contributorId === user?.id && (c.status === 'Reviewed' || c.status === 'Acknowledged')
  );
  const userSprints = (trialSprints || []).filter((s) =>
    (s.participants || []).some((p) => p.id === user?.id && p.submission)
  );

  // Skill growth pathway recommendations
  const growthPathways = [
    {
      skill: 'UI/UX & Design Systems',
      status: 'In Progress',
      gapReason: 'High demand across student hackathon squads; missing verified Figma artifact.',
      prerequisites: 'Visual hierarchy, WCAG contrast basics, component variants.',
      suggestedTask: 'Design a 3-state clinical emergency triage component conforming to WCAG AAA.',
      actionRoute: '/skills/evidence',
    },
    {
      skill: 'Microservices & gRPC Telemetry',
      status: 'Recommended',
      gapReason: 'Required for high-throughput sensor telemetry projects.',
      prerequisites: 'FastAPI, Protocol Buffers, async I/O in Python.',
      suggestedTask: 'Complete the FastAPI Telemetry Stream & Schema Validation practical assessment.',
      actionRoute: '/skills/evidence',
    },
    {
      skill: 'Hackathon Stage Pitching',
      status: 'Ready to Practice',
      gapReason: 'Critical for winning final jury awards.',
      prerequisites: 'Story arc synthesis, problem hook, concise demo choreography.',
      suggestedTask: 'Record 3-minute pitch deck walkthrough and link video evidence.',
      actionRoute: '/skills/evidence',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brutal-red mb-1">
            <Award className="w-4 h-4 text-brutal-red" />
            <span>SECTION 11 // PORTABLE PROJECT PASSPORT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            PROJECT PASSPORT.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            VERIFIED DEMONSTRATIONS · REVIEWED CONTRIBUTIONS · EVIDENCE-BACKED CREDIBILITY
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'passport' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('passport')}
          >
            [ VERIFIED PASSPORT ]
          </Button>
          <Button
            variant={activeTab === 'growth' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('growth')}
          >
            [ SKILL GROWTH PATHWAYS ]
          </Button>
        </div>
      </div>

      {activeTab === 'passport' ? (
        <div className="space-y-6 font-mono">
          {/* Passport Identity Header */}
          <div className="p-6 border-3 border-ink bg-white shadow-brutal space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3 text-xs">
              <span className="font-bold text-ink/60 uppercase">
                CAMPUS CREDENTIAL RECORD // {user?.id?.toUpperCase() || 'STU-01'}
              </span>
              <span className="bg-campus-green text-white px-2 py-0.5 border border-ink font-bold">
                EVIDENCE CERTIFIED
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-ink uppercase">
                  {user?.name || 'Lukmaan Hakim'}
                </h2>
                <p className="text-xs font-bold text-ink/75 uppercase mt-1">
                  {user?.department || 'Computer Science (CSE)'} · {user?.year || '2nd Year'} · {user?.rollNo || '23CSE-084'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 border-2 border-ink bg-canvas">
                  <div className="text-xl font-display font-black text-ink">{userEvidences.length}</div>
                  <div className="text-[9px] text-ink/60 uppercase font-bold">VERIFIED SKILLS</div>
                </div>
                <div className="p-2.5 border-2 border-ink bg-canvas">
                  <div className="text-xl font-display font-black text-ink">{userContributions.length}</div>
                  <div className="text-[9px] text-ink/60 uppercase font-bold">LEDGER TASKS</div>
                </div>
                <div className="p-2.5 border-2 border-ink bg-canvas">
                  <div className="text-xl font-display font-black text-ink">{userSprints.length}</div>
                  <div className="text-[9px] text-ink/60 uppercase font-bold">TRIAL SPRINTS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Demonstrated Skills Strip */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-ink pb-1.5 text-xs font-bold text-ink/70 uppercase">
              <span>DEMONSTRATED & REVIEWED SKILLS</span>
              <span>{userEvidences.length} COMPETENCIES</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {userEvidences.map((ev) => (
                <div key={ev.id} className="p-4 border-2 border-ink bg-white shadow-brutal-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="font-display font-black text-base uppercase text-ink">{ev.skill}</span>
                    <span className="bg-campus-green text-white px-1.5 py-0.2 border border-ink">
                      {ev.status === 'INDEPENDENTLY_REVIEWED' ? 'FACULTY REVIEWED' : 'PRACTICALLY DEMONSTRATED'}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-ink/80 leading-snug">{ev.description}</p>
                  {ev.reviewer && (
                    <div className="text-[10px] text-ink/60 pt-1 border-t border-ink/20">
                      Endorsed by {ev.reviewer} ({ev.reviewerRole})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reviewed Contribution Ledger Entries */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-ink pb-1.5 text-xs font-bold text-ink/70 uppercase">
              <span>VERIFIED PROJECT CONTRIBUTIONS</span>
              <span>{userContributions.length} RECORDED DELIVERABLES</span>
            </div>

            <div className="space-y-3">
              {userContributions.map((c) => (
                <div key={c.id} className="p-4 border-2 border-ink bg-white shadow-brutal-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold border-b border-ink/20 pb-1.5">
                    <span className="uppercase text-ink">{c.taskTitle}</span>
                    <span className="bg-canvas border border-ink px-2 py-0.5 text-[10px] uppercase">
                      PROJECT: {c.projectTitle}
                    </span>
                  </div>
                  <p className="text-xs font-sans text-ink/85">{c.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-ink/60 pt-1 border-t border-ink/20">
                    <span>EVIDENCE: {c.evidenceType}</span>
                    <span>REVIEWED BY: {c.reviewerName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 font-mono">
          {/* Skill Growth Pathway View */}
          <div className="p-4 border-2 border-ink bg-white shadow-brutal-sm text-xs space-y-1">
            <div className="text-[10px] font-bold text-ink/60 uppercase">
              GROWTH ROADMAP // SECTION 11.1
            </div>
            <h3 className="font-display font-black text-lg text-ink uppercase">
              RECOMMENDED PRACTICE PATHWAYS
            </h3>
            <p className="text-xs font-sans text-ink/80">
              When you lack a requested skill, CollabMatrix identifies prerequisite milestones and provides interactive sandbox tasks so you can demonstrate readiness without exclusion.
            </p>
          </div>

          <div className="space-y-3">
            {growthPathways.map((path) => (
              <div key={path.skill} className="p-5 border-2 border-ink bg-white shadow-brutal space-y-3">
                <div className="flex items-center justify-between border-b-2 border-ink pb-2 text-xs font-bold">
                  <span className="font-display font-black text-base text-ink uppercase">{path.skill}</span>
                  <span className="bg-signal-yellow border border-ink px-2 py-0.5 uppercase text-[10px]">
                    {path.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
                  <div className="p-3 border border-ink bg-canvas space-y-1">
                    <strong className="text-[10px] font-mono font-bold uppercase text-ink/60 block">GAP CONTEXT:</strong>
                    <p className="text-ink">{path.gapReason}</p>
                  </div>
                  <div className="p-3 border border-ink bg-canvas space-y-1">
                    <strong className="text-[10px] font-mono font-bold uppercase text-ink/60 block">PREREQUISITES:</strong>
                    <p className="text-ink">{path.prerequisites}</p>
                  </div>
                  <div className="p-3 border border-ink bg-white space-y-1">
                    <strong className="text-[10px] font-mono font-bold uppercase text-ink/60 block">SUGGESTED ACTION:</strong>
                    <p className="text-ink">{path.suggestedTask}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-ink/20 flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs font-mono font-bold"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => navigate(path.actionRoute)}
                  >
                    [ TAKE PRACTICE ASSESSMENT → ]
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
