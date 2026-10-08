import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Compass,
  Inbox,
  Eye,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
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

  // Compute profile completion percentage
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
      title: 'Collaboration Request Dispatched',
      message: `Invitation sent to ${student.name} with project context.`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            {greeting}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Ready to find the right people for your next idea?
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={() => navigate('/opportunities/create')}
        >
          Create Opportunity
        </Button>
      </div>

      {/* Profile Completion Meter */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-primary">
              Profile Completeness
            </span>
            <span className="text-xs font-bold text-accent-teal">
              {profileCompletion}%
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            A complete skill matrix and domain tags boost your recommendation ranking by up to 2.4x.
          </p>
        </div>
        <div className="w-full sm:w-64 flex items-center gap-3">
          <ProgressBar value={profileCompletion} variant="teal" size="sm" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-xs text-accent-indigo hover:text-accent-violet whitespace-nowrap"
          >
            Review
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Teams"
          value={teams?.length || 1}
          icon={Users}
          change="+1 this month"
        />
        <StatCard
          label="Pending Requests"
          value={pendingRequestsCount}
          icon={Inbox}
          change="Action required"
          trend="neutral"
        />
        <StatCard
          label="Opportunities"
          value={opportunities?.length || 10}
          icon={Compass}
          change="10 campus posts"
        />
        <StatCard
          label="Profile Views"
          value="48"
          icon={Eye}
          change="+18% weekly"
        />
      </div>

      {/* Active Collaborations Banner */}
      {activeTeam && (
        <div className="p-5 rounded-2xl bg-surface border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-accent-indigo/15 text-accent-indigo border border-accent-indigo/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-text-primary">
                  {activeTeam.name}
                </h4>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-accent-indigo/15 text-indigo-300">
                  {activeTeam.type}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Current team: {activeTeam.members?.length} of {activeTeam.maxSize} members filled
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex -space-x-2">
              {activeTeam.members?.map((m) => (
                <Avatar key={m.id} name={m.name} size="sm" className="ring-2 ring-surface" />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/team')}
            >
              Open Team Hub
            </Button>
          </div>
        </div>
      )}

      {/* Recommended Opportunities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-text-primary tracking-tight">
              Recommended Opportunities
            </h3>
            <p className="text-xs text-text-secondary">
              Projects looking for competencies in your skill stack.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/discover/opportunities')}
          >
            View all
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-text-primary tracking-tight">
              Recommended Collaborators
            </h3>
            <p className="text-xs text-text-secondary">
              Peers with complementary design, technical, and communication abilities.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/discover/students')}
          >
            Discover more
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
