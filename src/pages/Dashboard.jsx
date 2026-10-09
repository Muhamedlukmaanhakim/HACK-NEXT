import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Zap, BookOpen, Activity, Users, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import OpportunityCard from '../components/cards/OpportunityCard';
import StudentCard from '../components/cards/StudentCard';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { analyzeTeamGaps } from '../utils/gapAnalysis';
import { evaluateTeamHealth } from '../services/teamHealthService';
import { calculateMatch } from '../utils/matching';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    opportunities,
    students,
    requests,
    teams,
    sentConnections,
    connectStudent,
    trialSprints,
    contributions,
    projectTasks,
    healthAlerts,
    skillEvidences,
  } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const displayName = user?.name || 'Student Operator';
  const firstName = displayName.split(' ')[0].toUpperCase();

  // Active Team: find team where user is member or team-1 for demo
  const userTeam = useMemo(() => {
    return (teams || []).find((t) => (t.members || []).some((m) => m.id === user?.id)) || teams?.[0];
  }, [teams, user]);

  // Team Readiness & Gaps
  const gapAnalysisResult = useMemo(() => {
    if (!userTeam) return null;
    return analyzeTeamGaps(
      userTeam.requiredSkills || ['Python', 'AI/ML', 'Backend', 'UI/UX', 'Public Speaking'],
      userTeam.members || [],
      students || [],
      skillEvidences || []
    );
  }, [userTeam, students, skillEvidences]);

  // Team Health Radar status
  const healthEvaluation = useMemo(() => {
    if (!userTeam) return null;
    const teamTasks = (projectTasks || []).filter((t) => t.teamId === userTeam.id);
    const teamAlerts = (healthAlerts || []).filter((a) => a.teamId === userTeam.id);
    return evaluateTeamHealth(userTeam, teamTasks, teamAlerts);
  }, [userTeam, projectTasks, healthAlerts]);

  // Active Trial Sprint for this team
  const activeSprint = useMemo(() => {
    if (!userTeam) return null;
    return (trialSprints || []).find((s) => s.teamId === userTeam.id && s.status === 'Active');
  }, [userTeam, trialSprints]);

  // Recent Contributions
  const teamContributions = useMemo(() => {
    if (!userTeam) return [];
    return (contributions || []).filter((c) => c.teamId === userTeam.id).slice(0, 3);
  }, [userTeam, contributions]);

  const pendingRequestsCount = useMemo(() => {
    return (requests || []).filter((r) => r.status === 'Pending').length;
  }, [requests]);

  const recommendedOpportunities = useMemo(() => {
    return (opportunities || []).slice(0, 2);
  }, [opportunities]);

  // Recommended students matching missing gaps
  const recommendedStudents = useMemo(() => {
    const currentMemberIds = new Set((userTeam?.members || []).map((m) => m.id));
    return (students || [])
      .filter((s) => s.id !== user?.id && !currentMemberIds.has(s.id))
      .map((st) => {
        const matchData = calculateMatch(
          st,
          { requiredSkills: gapAnalysisResult?.missingSkills || userTeam?.requiredSkills || [] },
          skillEvidences
        );
        return {
          ...st,
          matchScore: matchData.score,
          matchReason: matchData.reason,
          verifiedSkills: matchData.verifiedSkills,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [students, user, userTeam, gapAnalysisResult, skillEvidences]);

  const handleConnect = async (student) => {
    await connectStudent(student, userTeam?.name);
    addToast({
      type: 'success',
      title: 'INVITATION TRANSMITTED',
      message: `Direct dispatch transmitted to ${student.name}.`,
    });
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-ink/60">
              01 / STUDENT DASHBOARD
            </span>
            {user?.isDemo && (
              <span className="text-[10px] font-bold bg-signal-yellow text-ink border border-ink px-1.5 py-0.2">
                DEMO OPERATOR
              </span>
            )}
          </div>
          <div className="text-sm sm:text-base font-bold text-ink/75 uppercase tracking-wide">
            WELCOME,
          </div>
          <div className="text-sm sm:text-base font-black text-ink uppercase tracking-wide mb-1">
            {firstName}.
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-ink tracking-tight leading-[0.95]">
            EVIDENCE-DRIVEN<br />
            <span className="text-brutal-red">TEAM MATRIX.</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={Zap}
            onClick={() => navigate('/team/trial-sprint')}
          >
            [ TRIAL SPRINT → ]
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            iconPosition="left"
            onClick={() => navigate('/opportunities/create')}
          >
            [ + INITIALIZE PROJECT → ]
          </Button>
        </div>
      </div>

      {/* 2. Top Metric Quad */}
      <div className="border-2 border-ink bg-white grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x-2 divide-ink shadow-brutal-sm font-mono">
        {/* Cell 1: Team Readiness */}
        <div className="p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:bg-canvas transition-colors" onClick={() => navigate('/team/gap-analysis')}>
          <div className="text-3xl sm:text-4xl font-display font-black text-ink">
            {gapAnalysisResult?.readinessIndex || 82}%
          </div>
          <div className="text-[11px] font-bold text-ink/70 uppercase tracking-wide mt-2">
            TEAM READINESS INDEX
          </div>
        </div>

        {/* Cell 2: Trial Sprint Status */}
        <div className="p-4 sm:p-5 flex flex-col justify-between bg-signal-yellow/20 cursor-pointer hover:bg-signal-yellow/30 transition-colors" onClick={() => navigate('/team/trial-sprint')}>
          <div className="text-3xl sm:text-4xl font-display font-black text-ink">
            {activeSprint ? 'LIVE' : 'IDLE'}
          </div>
          <div className="text-[11px] font-bold text-ink uppercase tracking-wide mt-2">
            TRIAL SPRINT PHASE
          </div>
        </div>

        {/* Cell 3: Requests */}
        <div className="p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:bg-canvas transition-colors" onClick={() => navigate('/requests')}>
          <div className="text-3xl sm:text-4xl font-display font-black text-ink">
            {pendingRequestsCount > 0 ? (pendingRequestsCount < 10 ? `0${pendingRequestsCount}` : `${pendingRequestsCount}`) : '00'}
          </div>
          <div className="text-[11px] font-bold text-ink/70 uppercase tracking-wide mt-2">
            ACTIVE REQUESTS
          </div>
        </div>

        {/* Cell 4: Team Health Radar State */}
        <div
          className={`p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity ${
            healthEvaluation?.status === 'At Risk'
              ? 'bg-brutal-red/10 text-brutal-red'
              : healthEvaluation?.status === 'Needs Attention'
              ? 'bg-signal-yellow/30 text-ink'
              : 'bg-campus-green/10 text-campus-green'
          }`}
          onClick={() => navigate('/team/health')}
        >
          <div className="text-xl sm:text-2xl font-display font-black uppercase truncate">
            {healthEvaluation?.status || 'ON TRACK'}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-wide mt-2">
            HEALTH RADAR STATE
          </div>
        </div>
      </div>

      {/* 3. THREE PRIORITY DIFFERENTIATORS INTEGRATION STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Priority 1: Trial Sprint Card */}
        <div className="p-5 border-2 border-ink bg-white shadow-brutal flex flex-col justify-between space-y-4 font-mono">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold border-b border-ink/20 pb-2">
              <span className="flex items-center gap-1.5 text-brutal-red uppercase">
                <Zap className="w-3.5 h-3.5" />
                PRIORITY 01 // TRIAL SPRINT
              </span>
              <span className="bg-canvas border border-ink px-1.5 py-0.2 uppercase">
                {activeSprint ? activeSprint.status : 'STANDBY'}
              </span>
            </div>
            <h3 className="font-display font-black text-lg text-ink uppercase tracking-tight">
              {activeSprint ? activeSprint.title : 'TEST COLLABORATION BEFORE COMMITMENT'}
            </h3>
            <p className="text-xs font-sans text-ink/80 leading-relaxed font-normal">
              {activeSprint
                ? activeSprint.objective
                : 'Run a 48-hour low-stakes micro-sprint with prospective teammates to test communication, delivery speed, and code quality.'}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="w-full text-xs"
            onClick={() => navigate('/team/trial-sprint')}
          >
            [ {activeSprint ? 'OPEN ACTIVE SPRINT' : 'INITIALIZE TRIAL SPRINT'} → ]
          </Button>
        </div>

        {/* Priority 2: Contribution Ledger Card */}
        <div className="p-5 border-2 border-ink bg-white shadow-brutal flex flex-col justify-between space-y-4 font-mono">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold border-b border-ink/20 pb-2">
              <span className="flex items-center gap-1.5 text-ink uppercase">
                <BookOpen className="w-3.5 h-3.5" />
                PRIORITY 02 // LEDGER
              </span>
              <span className="bg-canvas border border-ink px-1.5 py-0.2 uppercase">
                {teamContributions.length} RECORDED
              </span>
            </div>
            <h3 className="font-display font-black text-lg text-ink uppercase tracking-tight">
              CONTRIBUTION LEDGER
            </h3>
            <p className="text-xs font-sans text-ink/80 leading-relaxed font-normal">
              Evidence-linked individual project records with AI disclosure, peer acknowledgement, and faculty reviews.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => navigate('/team/contributions')}
          >
            [ INSPECT LEDGER ({teamContributions.length}) → ]
          </Button>
        </div>

        {/* Priority 3: Team Health Radar Card */}
        <div className="p-5 border-2 border-ink bg-white shadow-brutal flex flex-col justify-between space-y-4 font-mono">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold border-b border-ink/20 pb-2">
              <span className="flex items-center gap-1.5 text-campus-green uppercase">
                <Activity className="w-3.5 h-3.5" />
                PRIORITY 03 // HEALTH RADAR
              </span>
              <span className={`px-1.5 py-0.2 border border-ink uppercase ${healthEvaluation?.badgeColor || 'bg-canvas'}`}>
                {healthEvaluation?.status || 'MONITORING'}
              </span>
            </div>
            <h3 className="font-display font-black text-lg text-ink uppercase tracking-tight">
              TEAM HEALTH RADAR
            </h3>
            <p className="text-xs font-sans text-ink/80 leading-relaxed font-normal">
              {healthEvaluation?.riskFactors?.length
                ? `${healthEvaluation.riskFactors.length} delivery bottleneck(s) identified. Unassigned essential tasks & bus factor warnings.`
                : 'Project delivery telemetry healthy. Zero overdue milestones or capability bottlenecks detected.'}
            </p>
          </div>
          <Button
            variant="accent"
            size="sm"
            className="w-full text-xs"
            onClick={() => navigate('/team/health')}
          >
            [ VIEW HEALTH RADAR → ]
          </Button>
        </div>
      </div>

      {/* 4. TEAM READINESS & GAP DIAGNOSTIC BANNER */}
      {userTeam && gapAnalysisResult && (
        <section className="border-2 border-ink bg-white p-5 sm:p-6 shadow-brutal space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
            <div>
              <div className="text-[10px] font-bold text-ink/60 uppercase tracking-widest">
                ACTIVE TEAM CAPABILITY SPECIFICATION
              </div>
              <h3 className="font-display font-black text-lg sm:text-xl text-ink uppercase tracking-tight">
                {userTeam.name}
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-brutal-red uppercase">
                READINESS INDEX:
              </span>
              <div className="text-xl sm:text-2xl font-display font-black text-ink">
                {gapAnalysisResult.readinessIndex}% // {gapAnalysisResult.coveragePercentage}% COVERED
              </div>
            </div>
          </div>

          {/* ASCII Brutalist Progress Bar */}
          <div className="space-y-1 text-xs">
            <div className="w-full h-5 border-2 border-ink bg-canvas flex">
              <div
                style={{ width: `${gapAnalysisResult.coveragePercentage}%` }}
                className="h-full bg-ink"
              />
            </div>
            <div className="text-[10px] text-ink/60 font-bold uppercase tracking-wider flex justify-between">
              <span>● COVERED: {gapAnalysisResult.coveredSkills.join(' · ') || 'NONE'}</span>
              <span className="text-brutal-red font-bold">○ MISSING: {gapAnalysisResult.missingSkills.join(' · ') || 'ALL COVERED'}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-2 border-ink font-sans">
            <p className="text-xs text-ink/75">
              Readiness integrates essential capability coverage, evidence verification quality, and single-person dependency protection.
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/team/simulator')}
                className="text-xs font-mono font-bold"
              >
                [ WHAT-IF SIMULATOR ]
              </Button>
              <Button
                variant="accent"
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/team/gap-analysis')}
                className="text-xs font-mono font-bold"
              >
                [ RESOLVE GAPS → ]
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 5. Directory Feeds: RECOMMENDED COLLABORATORS & ACTIVE PROJECTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Collaborators */}
        <section className="space-y-3 font-mono">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <div>
              <span className="text-[10px] font-bold text-ink/50 uppercase">02 / MATCHING</span>
              <h3 className="text-base font-display font-black text-ink uppercase tracking-tight">
                RECOMMENDED COLLABORATORS
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/discover/students')}
              className="text-xs font-bold text-ink hover:text-brutal-red uppercase"
            >
              [ ALL STUDENTS ({students?.length || 16}) → ]
            </button>
          </div>

          <div className="space-y-3 font-sans">
            {recommendedStudents.map((st, idx) => (
              <StudentCard
                key={st.id}
                index={idx + 1}
                student={st}
                matchScore={st.matchScore}
                isRequested={sentConnections.includes(st.id)}
                onConnect={handleConnect}
                onViewProfile={(s) => navigate(`/profile?id=${s.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Active Project Opportunities */}
        <section className="space-y-3 font-mono">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <div>
              <span className="text-[10px] font-bold text-ink/50 uppercase">03 / OPPORTUNITIES</span>
              <h3 className="text-base font-display font-black text-ink uppercase tracking-tight">
                CAMPUS INITIATIVES
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/discover/opportunities')}
              className="text-xs font-bold text-ink hover:text-brutal-red uppercase"
            >
              [ EXPLORE ALL ({opportunities?.length || 10}) → ]
            </button>
          </div>

          <div className="space-y-3 font-sans">
            {recommendedOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onView={(o) => navigate(`/opportunities/${o.id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
