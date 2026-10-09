import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  UserCheck,
  ShieldCheck,
  BookOpen,
  Activity,
  Plus,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { evaluateTeamHealth } from '../services/teamHealthService';
import { analyzeTeamGaps } from '../utils/gapAnalysis';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const {
    opportunities,
    teams,
    students,
    trialSprints,
    contributions,
    projectTasks,
    healthAlerts,
    skillEvidences,
  } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const facultyName = user?.name || 'Dr. Aris Thorne';
  const facultyDept = user?.department || 'Computer Science (CSE)';
  const facultyDesignation = user?.designation || 'Professor & Lab Director';

  // Supervised opportunities
  const supervisedOpportunities = useMemo(() => {
    return (opportunities || []).slice(0, 3);
  }, [opportunities]);

  // Teams needing attention (Health radar active alerts)
  const activeAlerts = useMemo(() => {
    return (healthAlerts || []).filter((a) => a.status === 'Active');
  }, [healthAlerts]);

  // Pending evidence reviews
  const pendingEvidenceReviews = useMemo(() => {
    return (skillEvidences || []).filter((e) => e.status === 'EVIDENCE_SUBMITTED' || e.status === 'PRACTICALLY_DEMONSTRATED');
  }, [skillEvidences]);

  // Pending contribution reviews
  const pendingContributionReviews = useMemo(() => {
    return (contributions || []).filter((c) => c.status === 'Submitted' || c.status === 'Awaiting Review');
  }, [contributions]);

  // Active trial sprints needing supervision
  const activeTrialSprints = useMemo(() => {
    return (trialSprints || []).filter((s) => s.status === 'Active' || s.status === 'Awaiting Review');
  }, [trialSprints]);

  // Supervised team health
  const supervisedTeam = teams?.[0];
  const teamTasks = (projectTasks || []).filter((t) => t.teamId === supervisedTeam?.id);
  const healthEvaluation = useMemo(() => {
    if (!supervisedTeam) return null;
    return evaluateTeamHealth(supervisedTeam, teamTasks, healthAlerts || []);
  }, [supervisedTeam, teamTasks, healthAlerts]);

  const teamGap = useMemo(() => {
    if (!supervisedTeam) return null;
    return analyzeTeamGaps(
      supervisedTeam.requiredSkills || [],
      supervisedTeam.members || [],
      students || [],
      skillEvidences || []
    );
  }, [supervisedTeam, students, skillEvidences]);

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-ink/60">
              01 / FACULTY SUPERVISION DASHBOARD
            </span>
            <span className="text-[10px] font-bold bg-ink text-white border border-ink px-2 py-0.5">
              CLEARANCE: FACULTY NODE
            </span>
          </div>
          <div className="text-sm sm:text-base font-bold text-ink/75 uppercase tracking-wide">
            WELCOME,
          </div>
          <div className="text-sm sm:text-base font-black text-ink uppercase tracking-wide mb-1">
            {facultyName}.
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-ink tracking-tight leading-[0.95]">
            DEPARTMENTAL<br />
            <span className="text-brutal-red">OVERSIGHT GRID.</span>
          </h1>
          <p className="text-xs text-ink/70 font-sans mt-2">
            {facultyDesignation} · {facultyDept}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={ShieldCheck}
            onClick={() => navigate('/faculty/reviews/evidence')}
          >
            [ REVIEW EVIDENCE ({pendingEvidenceReviews.length}) → ]
          </Button>
          <Button
            variant="danger"
            size="md"
            icon={Plus}
            onClick={() => navigate('/faculty/opportunities/create')}
          >
            [ + POST LAB INITIATIVE → ]
          </Button>
        </div>
      </div>

      {/* 2. Four-Cell Faculty Metrics */}
      <div className="border-2 border-ink bg-white grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x-2 divide-ink shadow-brutal-sm font-mono">
        {/* Cell 1: Supervised Projects */}
        <div
          className="p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:bg-canvas transition-colors"
          onClick={() => navigate('/faculty/supervision')}
        >
          <div className="text-3xl sm:text-4xl font-display font-black text-ink">
            {supervisedOpportunities.length < 10 ? `0${supervisedOpportunities.length}` : supervisedOpportunities.length}
          </div>
          <div className="text-[11px] font-bold text-ink/70 uppercase tracking-wide mt-2">
            SUPERVISED SQUADS
          </div>
        </div>

        {/* Cell 2: Teams Needing Attention */}
        <div
          className={`p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:bg-signal-yellow/30 transition-colors ${
            activeAlerts.length > 0 ? 'bg-signal-yellow/20' : ''
          }`}
          onClick={() => navigate('/faculty/health-radar')}
        >
          <div className="text-3xl sm:text-4xl font-display font-black text-ink">
            {activeAlerts.length < 10 ? `0${activeAlerts.length}` : activeAlerts.length}
          </div>
          <div className="text-[11px] font-bold text-ink uppercase tracking-wide mt-2">
            TEAMS NEEDING ATTENTION
          </div>
        </div>

        {/* Cell 3: Evidence Awaiting Review */}
        <div
          className="p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:bg-canvas transition-colors"
          onClick={() => navigate('/faculty/reviews/evidence')}
        >
          <div className="text-3xl sm:text-4xl font-display font-black text-ink">
            {pendingEvidenceReviews.length < 10 ? `0${pendingEvidenceReviews.length}` : pendingEvidenceReviews.length}
          </div>
          <div className="text-[11px] font-bold text-ink/70 uppercase tracking-wide mt-2">
            EVIDENCE REVIEWS
          </div>
        </div>

        {/* Cell 4: Pending Contributions */}
        <div
          className="p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:bg-canvas transition-colors"
          onClick={() => navigate('/faculty/reviews/contributions')}
        >
          <div className="text-3xl sm:text-4xl font-display font-black text-ink">
            {pendingContributionReviews.length < 10 ? `0${pendingContributionReviews.length}` : pendingContributionReviews.length}
          </div>
          <div className="text-[11px] font-bold text-ink/70 uppercase tracking-wide mt-2">
            LEDGER SUBMISSIONS
          </div>
        </div>
      </div>

      {/* 3. SUPERVISED PROJECT HEALTH & READINESS HIGHLIGHT */}
      {supervisedTeam && (
        <section className="border-3 border-ink bg-white p-6 shadow-brutal space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
            <div>
              <div className="text-[10px] font-bold text-ink/60 uppercase tracking-widest">
                ACTIVE LAB SUPERVISION // {supervisedTeam.name.toUpperCase()}
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-ink uppercase tracking-tight">
                HEALTH RADAR: {healthEvaluation?.status?.toUpperCase()}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className={`text-xs font-bold px-2.5 py-1 border uppercase ${healthEvaluation?.badgeColor}`}>
                ● {healthEvaluation?.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-3.5 border-2 border-ink bg-canvas font-mono space-y-1">
              <span className="text-[10px] text-ink/60 uppercase font-bold">TEAM READINESS INDEX</span>
              <div className="text-2xl font-display font-black text-ink">{teamGap?.readinessIndex}%</div>
              <p className="text-[11px] text-ink/70 font-sans">{teamGap?.readinessState}</p>
            </div>

            <div className="p-3.5 border-2 border-ink bg-canvas font-mono space-y-1">
              <span className="text-[10px] text-ink/60 uppercase font-bold">ACTIVE BOTTLENECK ALERTS</span>
              <div className="text-2xl font-display font-black text-brutal-red">{healthEvaluation?.riskFactors?.length || 0}</div>
              <p className="text-[11px] text-ink/70 font-sans">Unassigned deliverable & bus factor warnings</p>
            </div>

            <div className="p-3.5 border-2 border-ink bg-canvas font-mono space-y-1">
              <span className="text-[10px] text-ink/60 uppercase font-bold">SQUAD ROSTER</span>
              <div className="text-sm font-bold text-ink uppercase">
                {supervisedTeam.members?.map((m) => m.name.split(' ')[0]).join(' · ')}
              </div>
              <p className="text-[11px] text-ink/70 font-sans">Slots: {supervisedTeam.members?.length} / {supervisedTeam.maxSize}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <p className="text-ink/80 font-sans">
              Supervisors can review Trial Sprints, endorse skill evidence, and trigger workload rebalancing.
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/faculty/health-radar')}
                className="text-xs font-bold font-mono"
              >
                [ INSPECT RADAR ]
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/faculty/supervision')}
                className="text-xs font-bold font-mono"
              >
                [ SUPERVISION VIEW → ]
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 4. TWO ACTIVE FACULTY WORKFLOW QUEUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono">
        {/* Queue 1: Pending Skill Evidence Reviews */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <div>
              <span className="text-[10px] font-bold text-ink/50 uppercase">02 / EVIDENCE AUDITS</span>
              <h3 className="text-base font-display font-black text-ink uppercase tracking-tight">
                SKILL EVIDENCE REVIEW QUEUE
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/faculty/reviews/evidence')}
              className="text-xs font-bold text-ink hover:text-brutal-red uppercase"
            >
              [ ALL ({pendingEvidenceReviews.length}) → ]
            </button>
          </div>

          <div className="space-y-3">
            {pendingEvidenceReviews.slice(0, 3).map((ev) => (
              <div key={ev.id} className="p-4 border-2 border-ink bg-white shadow-brutal-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="uppercase text-ink font-display font-black">{ev.studentName} // {ev.skill}</span>
                  <span className="px-1.5 py-0.2 border border-ink text-[10px] bg-canvas uppercase">
                    {ev.status}
                  </span>
                </div>
                <p className="text-xs font-sans text-ink/80 line-clamp-2">{ev.description}</p>
                <div className="pt-2 border-t border-ink/20 flex items-center justify-between">
                  <span className="text-[10px] text-ink/60 uppercase">{ev.evidenceType}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] py-1 px-2"
                    onClick={() => navigate('/faculty/reviews/evidence')}
                  >
                    [ AUDIT & GRADE → ]
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Queue 2: Trial Sprint Oversight */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <div>
              <span className="text-[10px] font-bold text-ink/50 uppercase">03 / TRIAL SPRINTS</span>
              <h3 className="text-base font-display font-black text-ink uppercase tracking-tight">
                TRIAL SPRINT OVERSIGHT
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/faculty/trial-sprints')}
              className="text-xs font-bold text-ink hover:text-brutal-red uppercase"
            >
              [ ALL ({activeTrialSprints.length}) → ]
            </button>
          </div>

          <div className="space-y-3">
            {activeTrialSprints.slice(0, 3).map((sp) => (
              <div key={sp.id} className="p-4 border-2 border-ink bg-white shadow-brutal-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="uppercase text-ink font-display font-black">{sp.title}</span>
                  <span className="px-1.5 py-0.2 border border-ink text-[10px] bg-signal-yellow uppercase">
                    {sp.status}
                  </span>
                </div>
                <p className="text-xs font-sans text-ink/80 line-clamp-2">{sp.objective}</p>
                <div className="pt-2 border-t border-ink/20 flex items-center justify-between">
                  <span className="text-[10px] text-ink/60 uppercase">{sp.duration} // {sp.participants?.length} PARTICIPANTS</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] py-1 px-2"
                    onClick={() => navigate('/faculty/trial-sprints')}
                  >
                    [ EVALUATE SPRINT → ]
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
