import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Compass,
  Inbox,
  Eye,
  PlusCircle,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import StatCard from '../components/cards/StatCard';
import OpportunityCard from '../components/cards/OpportunityCard';
import StudentCard from '../components/cards/StudentCard';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { getTimeGreeting } from '../utils/greeting';

export default function Dashboard() {
  const { user } = useAuth();
  const { opportunities, students, requests, teams, sentConnections, connectStudent } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const firstName = (user?.name || 'Lukmaan').split(' ')[0];
  const greeting = getTimeGreeting(firstName);

  // Profile completion percentage
  const profileCompletion = useMemo(() => {
    let completed = 0;
    const checks = [
      user?.name,
      user?.department,
      user?.year,
      user?.bio,
      user?.skills?.length,
      user?.interests?.length,
      user?.availability?.length,
    ];
    checks.forEach((item) => {
      if (item) completed += 1;
    });
    return Math.round((completed / checks.length) * 100) || 85;
  }, [user]);

  // Pending requests count
  const pendingRequestsCount = useMemo(() => {
    return (requests || []).filter((r) => r.status === 'Pending').length;
  }, [requests]);

  // Recommended opportunities (top 4)
  const recommendedOpportunities = useMemo(() => {
    return (opportunities || []).slice(0, 4);
  }, [opportunities]);

  // Recommended students (exclude current user, top 3)
  const recommendedStudents = useMemo(() => {
    return (students || [])
      .filter((s) => s.id !== user?.id)
      .slice(0, 3);
  }, [students, user]);

  // Active collaboration team
  const activeTeam = teams?.[0];

  const handleConnect = async (student) => {
    await connectStudent(student);
    addToast({
      type: 'success',
      title: 'Collaboration Invitation Dispatched',
      message: `Invitation transmitted to ${student.name} with project context.`,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-mono">
      {/* Top Welcome & Mission Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-retro-border pb-5">
        <div>
          <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
            [ SYSTEM // CONSOLE_STATION_01  ● ONLINE ]
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper tracking-wide uppercase">
            YOUR COLLABORATION NETWORK
          </h1>
          <p className="text-xs text-retro-muted font-sans mt-0.5">
            {greeting}. Monitoring candidate compatibility, team gaps, and active rosters.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={() => navigate('/opportunities/create')}
        >
          Create Project
        </Button>
      </div>

      {/* Profile Calibration Meter */}
      <div className="p-4 rounded-none bg-retro-surface border border-retro-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-panel relative">
        <div className="space-y-0.5 max-w-lg">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-retro-paper uppercase tracking-wider">
              [ CALIBRATION // PROFILE_COMPLETENESS ]
            </span>
            <span className="text-retro-orange font-bold font-mono">
              {profileCompletion}%
            </span>
          </div>
          <p className="text-xs text-retro-muted font-sans">
            Calibrated profile vectors increase recommendation rank across campus teams by up to 2.4x.
          </p>
        </div>
        <div className="w-full sm:w-64 flex items-center gap-3">
          <ProgressBar value={profileCompletion} variant="orange" size="sm" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-xs text-retro-amber hover:text-retro-orange whitespace-nowrap"
          >
            Review
          </Button>
        </div>
      </div>

      {/* 4 Telemetry Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="ACTIVE TEAMS"
          value={teams?.length || 1}
          icon={Users}
          change="+1 this month"
        />
        <StatCard
          label="PENDING REQUESTS"
          value={pendingRequestsCount}
          icon={Inbox}
          change="Action required"
          trend="neutral"
        />
        <StatCard
          label="CAMPUS POSTS"
          value={opportunities?.length || 10}
          icon={Compass}
          change="10 open posts"
        />
        <StatCard
          label="DOSSIER VIEWS"
          value="48"
          icon={Eye}
          change="+18% weekly"
        />
      </div>

      {/* Active Team Docket Banner */}
      {activeTeam && (
        <div className="p-4 sm:p-5 rounded-none bg-retro-surface border border-retro-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-none bg-retro-surface-elevated text-retro-orange border border-retro-border">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-retro-muted uppercase">[ ACTIVE ROSTER ]</span>
                <h4 className="text-sm font-display font-bold text-retro-paper">
                  {activeTeam.name}
                </h4>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-retro-surface-elevated text-retro-amber border border-retro-border">
                  {activeTeam.type}
                </span>
              </div>
              <p className="text-xs text-retro-muted font-sans mt-0.5">
                Current roster: {activeTeam.members?.length} of {activeTeam.maxSize} positions occupied
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex -space-x-1.5 overflow-hidden">
              {activeTeam.members?.map((m) => (
                <Avatar key={m.id} name={m.name} size="sm" className="ring-1 ring-retro-surface" />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/team')}
            >
              Team Hub
            </Button>
          </div>
        </div>
      )}

      {/* Recommended Opportunities Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-retro-border pb-2">
          <div>
            <div className="text-[10px] text-retro-muted uppercase tracking-widest">[ DISPATCH // OPPORTUNITIES ]</div>
            <h3 className="text-sm font-bold text-retro-paper tracking-wider uppercase">
              Recommended Opportunities
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/discover/opportunities')}
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {recommendedOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              matchScore={opp.matchScore}
              onView={(o) => navigate(`/opportunities/${o.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Recommended Students Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-retro-border pb-2">
          <div>
            <div className="text-[10px] text-retro-muted uppercase tracking-widest">[ DISPATCH // COLLABORATORS ]</div>
            <h3 className="text-sm font-bold text-retro-paper tracking-wider uppercase">
              Recommended Collaborators
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/discover/students')}
          >
            Discover More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {recommendedStudents.map((st) => (
            <StudentCard
              key={st.id}
              student={st}
              matchScore={st.matchScore}
              isRequested={sentConnections.includes(st.id)}
              onConnect={handleConnect}
              onViewProfile={(s) => navigate(`/profile?id=${s.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
