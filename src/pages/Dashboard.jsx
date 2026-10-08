import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Compass,
  Inbox,
  PlusCircle,
  ArrowRight,
  PieChart,
  UserCheck,
} from 'lucide-react';
import StatCard from '../components/cards/StatCard';
import OpportunityCard from '../components/cards/OpportunityCard';
import StudentCard from '../components/cards/StudentCard';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { opportunities, students, requests, teams, sentConnections, connectStudent } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const firstName = (user?.name || 'Lukmaan').split(' ')[0];

  const pendingRequestsCount = useMemo(() => {
    return (requests || []).filter((r) => r.status === 'Pending').length;
  }, [requests]);

  const recommendedOpportunities = useMemo(() => {
    return (opportunities || []).slice(0, 3);
  }, [opportunities]);

  const recommendedStudents = useMemo(() => {
    return (students || [])
      .filter((s) => s.id !== user?.id)
      .slice(0, 3);
  }, [students, user]);

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
    <div className="space-y-12 animate-fade-in font-sans">
      {/* 1. Header: GOOD MORNING, LUKMAAN. WHAT ARE YOU BUILDING NEXT? */}
      <div className="border-b-2 border-ink pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60 bg-white border border-ink px-2 py-0.5 shadow-brutal-sm">
            CAMPUS CONSOLE / 01
          </span>
          <h2 className="text-xs sm:text-sm font-mono text-ink/75 uppercase tracking-wide mt-2 font-bold">
            GOOD MORNING, {firstName.toUpperCase()}.
          </h2>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-ink tracking-tight leading-none mt-1">
            WHAT ARE YOU<br />
            <span className="text-brutal-red">BUILDING NEXT?</span>
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={() => navigate('/opportunities/create')}
        >
          [ START SOMETHING → ]
        </Button>
      </div>

      {/* 2. Oversized Metrics (Section 13) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="ACTIVE PROJECTS"
          value="03"
          icon={Compass}
          change="Sprint in progress"
        />
        <StatCard
          label="POTENTIAL MATCHES"
          value="12"
          icon={Users}
          change="94% peak signal"
          isKey={true}
        />
        <StatCard
          label="REQUESTS"
          value={pendingRequestsCount > 0 ? (pendingRequestsCount < 10 ? `0${pendingRequestsCount}` : `${pendingRequestsCount}`) : '04'}
          icon={Inbox}
          change="Action required"
        />
        <StatCard
          label="TEAM GAP"
          value="01"
          icon={PieChart}
          change="UI/UX missing"
        />
      </div>

      {/* 3. YOUR PROJECTS ──────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2">
          <div>
            <span className="text-[10px] font-mono font-bold text-ink/60 uppercase">// 01 DIRECTORY</span>
            <h3 className="text-base font-display font-extrabold text-ink uppercase tracking-wide">
              YOUR PROJECTS
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/discover/opportunities')}
            className="text-xs font-mono font-bold"
          >
            [ VIEW ALL ({opportunities?.length || 10}) → ]
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onView={(o) => navigate(`/discover/opportunities?id=${o.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 4. PEOPLE TO MEET ──────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2">
          <div>
            <span className="text-[10px] font-mono font-bold text-ink/60 uppercase">// 02 COMPATIBLE NODES</span>
            <h3 className="text-base font-display font-extrabold text-ink uppercase tracking-wide">
              PEOPLE TO MEET
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/discover/students')}
            className="text-xs font-mono font-bold"
          >
            [ EXPLORE DIRECTORY → ]
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedStudents.map((st) => (
            <StudentCard
              key={st.id}
              student={st}
              matchScore={st.matchScore || (st.id === 'student-2' ? 94 : st.id === 'student-3' ? 91 : 88)}
              isRequested={sentConnections.includes(st.id)}
              onConnect={handleConnect}
              onViewProfile={(s) => navigate(`/profile?id=${s.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 5. YOUR TEAM & TEAM GAP ──────────────── */}
      <section className="space-y-4">
        <div className="border-b-2 border-ink pb-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-ink/60 uppercase">// 03 SQUAD ROSTER</span>
            <h3 className="text-base font-display font-extrabold text-ink uppercase tracking-wide">
              YOUR TEAM & TEAM GAP
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/team')}
            className="font-mono text-xs"
          >
            [ TEAM HUB → ]
          </Button>
        </div>

        {activeTeam && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Active Team Block */}
            <div className="lg:col-span-7 border-2 border-ink bg-white p-5 shadow-brutal-sm space-y-4">
              <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-ink/60">[ ACTIVE SQUAD ]</span>
                  <h4 className="text-base font-display font-bold text-ink uppercase">{activeTeam.name}</h4>
                </div>
                <span className="text-xs font-mono font-bold bg-signal-yellow px-2 py-0.5 border border-ink uppercase">
                  {activeTeam.type}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-ink/70">MEMBERS ({activeTeam.members?.length}/{activeTeam.maxSize}):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTeam.members?.map((m) => (
                    <div key={m.id} className="p-2 border border-ink bg-canvas flex items-center gap-2">
                      <Avatar name={m.name} size="xs" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-ink truncate">{m.name}</p>
                        <p className="text-[10px] font-mono text-ink/60 truncate">{m.department || 'CSE'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Gap Alert Block */}
            <div className="lg:col-span-5 border-2 border-ink bg-signal-yellow p-5 shadow-brutal-sm space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-ink uppercase">[ DIAGNOSTIC ALERT ]</span>
                <h4 className="text-base font-display font-extrabold text-ink uppercase mt-1">
                  01 CRITICAL GAP DETECTED
                </h4>
                <p className="text-xs text-ink/80 font-sans mt-1">
                  Your project roster is missing <strong>UI/UX Design</strong> and <strong>Public Speaking</strong> for the upcoming hackathon jury.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/team/gap-analysis')}
                className="w-full font-mono text-xs"
              >
                [ RESOLVE TEAM GAP → ]
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
