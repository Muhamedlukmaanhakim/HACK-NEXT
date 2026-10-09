import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Compass,
  PlusCircle,
  Inbox,
  UserCheck,
  PieChart,
  User,
  Settings,
  RotateCcw,
  Zap,
  BookOpen,
  Activity,
  FileCheck2,
  Briefcase,
  Sliders,
  Award,
  GraduationCap,
  Building,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import Avatar from '../ui/Avatar';

export default function Sidebar({
  user,
  pendingRequestCount = 0,
  onResetDemo,
  className = '',
}) {
  const isFaculty = user?.role === 'faculty';

  // Student Navigation Architecture
  const studentNavGroups = [
    {
      code: '01',
      title: 'OVERVIEW',
      items: [
        { num: '01', label: 'DASHBOARD', to: '/dashboard', icon: LayoutDashboard },
        { num: '02', label: 'MY MATCHES', to: '/matches', icon: Zap },
      ],
    },
    {
      code: '02',
      title: 'CAMPUS DIRECTORY',
      items: [
        { num: '03', label: 'DISCOVER STUDENTS', to: '/discover/students', icon: Users },
        { num: '04', label: 'EXPLORE PROJECTS', to: '/discover/opportunities', icon: Compass },
      ],
    },
    {
      code: '03',
      title: 'COLLABORATION & TEAM',
      items: [
        { num: '05', label: 'CREATE PROJECT', to: '/opportunities/create', icon: PlusCircle },
        {
          num: '06',
          label: 'REQUESTS',
          to: '/requests',
          icon: Inbox,
          badge: pendingRequestCount > 0 ? pendingRequestCount : null,
        },
        { num: '07', label: 'MY TEAM ROSTER', to: '/team', icon: UserCheck },
        { num: '08', label: 'TEAM READINESS & GAPS', to: '/team/gap-analysis', icon: PieChart },
        { num: '09', label: 'TRIAL SPRINT', to: '/team/trial-sprint', icon: Zap },
        { num: '10', label: 'CONTRIBUTION LEDGER', to: '/team/contributions', icon: BookOpen },
        { num: '11', label: 'TEAM HEALTH RADAR', to: '/team/health', icon: Activity },
        { num: '12', label: 'WHAT-IF SIMULATOR', to: '/team/simulator', icon: Sliders },
        { num: '13', label: 'TEAM AGREEMENT', to: '/team/agreement', icon: FileCheck2 },
      ],
    },
    {
      code: '04',
      title: 'EVIDENCE & PASSPORT',
      items: [
        { num: '14', label: 'SKILL EVIDENCE', to: '/skills/evidence', icon: ShieldCheck },
        { num: '15', label: 'PROJECT PASSPORT', to: '/passport', icon: Award },
      ],
    },
    {
      code: '05',
      title: 'ACCOUNT',
      items: [
        { num: '16', label: 'MY PROFILE', to: '/profile', icon: User },
        { num: '17', label: 'SETTINGS', to: '/settings', icon: Settings },
      ],
    },
  ];

  // Faculty Navigation Architecture
  const facultyNavGroups = [
    {
      code: '01',
      title: 'FACULTY OVERVIEW',
      items: [
        { num: '01', label: 'FACULTY DASHBOARD', to: '/faculty/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      code: '02',
      title: 'OPPORTUNITIES & LAB',
      items: [
        { num: '02', label: 'MANAGE INITIATIVES', to: '/faculty/opportunities', icon: Briefcase },
        { num: '03', label: 'POST OPPORTUNITY', to: '/faculty/opportunities/create', icon: PlusCircle },
      ],
    },
    {
      code: '03',
      title: 'SUPERVISION & REVIEWS',
      items: [
        { num: '04', label: 'PROJECT SUPERVISION', to: '/faculty/supervision', icon: UserCheck },
        { num: '05', label: 'TRIAL SPRINT OVERSIGHT', to: '/faculty/trial-sprints', icon: Zap },
        { num: '06', label: 'CONTRIBUTION REVIEWS', to: '/faculty/reviews/contributions', icon: BookOpen },
        { num: '07', label: 'SKILL EVIDENCE REVIEWS', to: '/faculty/reviews/evidence', icon: ShieldCheck },
        { num: '08', label: 'TEAM HEALTH RADAR', to: '/faculty/health-radar', icon: Activity },
      ],
    },
    {
      code: '04',
      title: 'STUDENT NETWORK',
      items: [
        { num: '09', label: 'STUDENT DIRECTORY', to: '/faculty/students', icon: Users },
        { num: '10', label: 'MENTORING & ADVISING', to: '/faculty/mentoring', icon: HelpCircle },
      ],
    },
    {
      code: '05',
      title: 'ACCOUNT',
      items: [
        { num: '11', label: 'FACULTY PROFILE', to: '/faculty/profile', icon: User },
        { num: '12', label: 'SETTINGS', to: '/faculty/settings', icon: Settings },
      ],
    },
  ];

  const navGroups = isFaculty ? facultyNavGroups : studentNavGroups;
  const profileRoute = isFaculty ? '/faculty/profile' : '/profile';
  const dashboardRoute = isFaculty ? '/faculty/dashboard' : '/dashboard';

  return (
    <aside
      className={`w-64 h-screen flex-shrink-0 flex flex-col justify-between border-r-2 border-ink bg-white text-ink z-30 select-none ${className}`}
    >
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b-2 border-ink bg-canvas">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-ink/70 mb-2 tracking-wider">
            <span>CAMPUS NETWORK</span>
            <span className="flex items-center gap-1.5 text-campus-green font-bold">
              <span className="w-2 h-2 bg-campus-green inline-block border border-ink" />
              {isFaculty ? 'FACULTY' : 'STUDENT'}
            </span>
          </div>

          <NavLink to={dashboardRoute} className="flex items-center gap-2.5 group">
            <div className={`w-8 h-8 border-2 border-ink flex items-center justify-center text-white font-display font-extrabold text-sm shadow-brutal-sm ${isFaculty ? 'bg-ink' : 'bg-brutal-red'}`}>
              CM
            </div>
            <div className="flex flex-col font-display font-extrabold uppercase leading-none text-ink tracking-tight">
              <span>COLLAB</span>
              <span className={isFaculty ? 'text-ink' : 'text-brutal-red'}>MATRIX</span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-175px)]">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest text-ink/60 uppercase flex items-center justify-between border-b border-ink/20 mb-1">
                <span>{group.title}</span>
                <span className="text-ink/40">/{group.code}</span>
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-1.5 text-xs font-mono font-bold transition-all duration-150 border-2 ${
                          isActive
                            ? 'bg-ink text-canvas border-ink shadow-brutal-sm translate-x-1'
                            : 'bg-white text-ink border-transparent hover:border-ink hover:bg-canvas'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-signal-yellow' : 'text-ink'}`} />
                            <span className="truncate tracking-wide text-[11px]">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {item.badge && (
                              <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-brutal-red text-white border border-ink">
                                {item.badge}
                              </span>
                            )}
                            <span className={`text-[9px] font-mono ${isActive ? 'text-signal-yellow' : 'text-ink/40'}`}>
                              .{item.num}
                            </span>
                          </div>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile & Reset Demo Footer */}
      <div className="p-3 border-t-2 border-ink bg-canvas">
        <NavLink
          to={profileRoute}
          className="flex items-center gap-2.5 p-2 border-2 border-ink bg-white hover:bg-signal-yellow transition-colors group mb-2"
        >
          <Avatar name={user?.name || (isFaculty ? 'Dr. Aris' : 'Student')} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-ink truncate uppercase">
              {user?.name || (isFaculty ? 'Dr. Aris Thorne' : 'Student Node')}
            </p>
            <p className="text-[10px] font-mono text-ink/70 truncate">
              {isFaculty
                ? `${user?.designation || 'Faculty'} // ${user?.department || 'CSE'}`
                : `${user?.department || 'Unassigned'} // ${user?.year || '1st Year'}`}
            </p>
          </div>
        </NavLink>

        <div className="pt-2 border-t border-ink/20 flex items-center justify-between text-[10px] font-mono">
          <span className="text-ink/60 font-bold">{isFaculty ? 'FACULTY v2' : 'STUDENT v2'}</span>
          <button
            type="button"
            onClick={onResetDemo}
            className="text-ink hover:text-brutal-red flex items-center gap-1 transition-colors uppercase font-mono font-bold"
            title="Reset to initial seed data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>[RESET DATA]</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
