import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Compass,
  PieChart,
  UserCheck,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  Inbox,
  User,
  Settings,
  Zap,
  BookOpen,
  Activity,
  ShieldCheck,
  Briefcase,
  Award,
} from 'lucide-react';
import Avatar from '../ui/Avatar';

export default function MobileNavigation({
  user,
  pendingRequestCount = 0,
  onResetDemo,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isFaculty = user?.role === 'faculty';

  const studentBottomNav = [
    { num: '01', label: 'DASHBOARD', to: '/dashboard' },
    { num: '02', label: 'TEAM', to: '/team' },
    { num: '03', label: 'SPRINT', to: '/team/trial-sprint' },
    { num: '04', label: 'LEDGER', to: '/team/contributions' },
  ];

  const facultyBottomNav = [
    { num: '01', label: 'DASHBOARD', to: '/faculty/dashboard' },
    { num: '02', label: 'PROJECTS', to: '/faculty/supervision' },
    { num: '03', label: 'SPRINTS', to: '/faculty/trial-sprints' },
    { num: '04', label: 'REVIEWS', to: '/faculty/reviews/evidence' },
  ];

  const bottomNavItems = isFaculty ? facultyBottomNav : studentBottomNav;
  const dashboardRoute = isFaculty ? '/faculty/dashboard' : '/dashboard';

  const studentDrawerItems = [
    { label: '01. DASHBOARD', to: '/dashboard', icon: LayoutDashboard },
    { label: '02. MY MATCHES', to: '/matches', icon: Zap },
    { label: '03. FIND STUDENTS', to: '/discover/students', icon: Users },
    { label: '04. EXPLORE PROJECTS', to: '/discover/opportunities', icon: Compass },
    { label: '05. CREATE PROJECT', to: '/opportunities/create', icon: PlusCircle },
    { label: '06. REQUESTS', to: '/requests', icon: Inbox, badge: pendingRequestCount },
    { label: '07. MY TEAM', to: '/team', icon: UserCheck },
    { label: '08. TEAM READINESS & GAPS', to: '/team/gap-analysis', icon: PieChart },
    { label: '09. TRIAL SPRINT', to: '/team/trial-sprint', icon: Zap },
    { label: '10. CONTRIBUTION LEDGER', to: '/team/contributions', icon: BookOpen },
    { label: '11. TEAM HEALTH RADAR', to: '/team/health', icon: Activity },
    { label: '12. WHAT-IF SIMULATOR', to: '/team/simulator', icon: PieChart },
    { label: '13. SKILL EVIDENCE', to: '/skills/evidence', icon: ShieldCheck },
    { label: '14. PROJECT PASSPORT', to: '/passport', icon: Award },
    { label: '15. MY PROFILE', to: '/profile', icon: User },
    { label: '16. SETTINGS', to: '/settings', icon: Settings },
  ];

  const facultyDrawerItems = [
    { label: '01. FACULTY DASHBOARD', to: '/faculty/dashboard', icon: LayoutDashboard },
    { label: '02. MANAGE INITIATIVES', to: '/faculty/opportunities', icon: Briefcase },
    { label: '03. POST OPPORTUNITY', to: '/faculty/opportunities/create', icon: PlusCircle },
    { label: '04. PROJECT SUPERVISION', to: '/faculty/supervision', icon: UserCheck },
    { label: '05. TRIAL SPRINT OVERSIGHT', to: '/faculty/trial-sprints', icon: Zap },
    { label: '06. CONTRIBUTION REVIEWS', to: '/faculty/reviews/contributions', icon: BookOpen },
    { label: '07. SKILL EVIDENCE REVIEWS', to: '/faculty/reviews/evidence', icon: ShieldCheck },
    { label: '08. TEAM HEALTH RADAR', to: '/faculty/health-radar', icon: Activity },
    { label: '09. STUDENT DIRECTORY', to: '/faculty/students', icon: Users },
    { label: '10. FACULTY PROFILE', to: '/faculty/profile', icon: User },
    { label: '11. SETTINGS', to: '/faculty/settings', icon: Settings },
  ];

  const drawerItems = isFaculty ? facultyDrawerItems : studentDrawerItems;

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-canvas border-b-2 border-ink px-4 py-2.5 flex items-center justify-between font-mono">
        <NavLink to={dashboardRoute} className="flex items-center gap-2">
          <div className={`w-7 h-7 border-2 border-ink flex items-center justify-center text-white font-display font-extrabold text-xs shadow-brutal-sm ${isFaculty ? 'bg-ink' : 'bg-brutal-red'}`}>
            CM
          </div>
          <div className="flex flex-col font-display font-extrabold text-sm uppercase leading-none text-ink">
            <span>COLLAB</span>
            <span className={isFaculty ? 'text-ink' : 'text-brutal-red'}>MATRIX</span>
          </div>
        </NavLink>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] font-bold text-campus-green bg-white border border-ink px-1.5 py-0.5">
            <span className="w-1.5 h-1.5 bg-campus-green inline-block" />
            {isFaculty ? 'FACULTY' : 'STUDENT'}
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 border-2 border-ink bg-white text-ink hover:bg-black hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide-out Full Mobile Menu Drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-canvas p-6 flex flex-col justify-between font-mono animate-fade-in border-4 border-ink overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b-2 border-ink">
              <div className="flex items-center gap-2.5">
                <Avatar name={user?.name || (isFaculty ? 'Dr. Aris' : 'Student')} size="sm" />
                <div>
                  <h4 className="text-sm font-bold text-ink uppercase">{user?.name}</h4>
                  <p className="text-xs text-ink/70">
                    {isFaculty ? `${user?.designation || 'Faculty'}` : `${user?.department || 'Student'} // ${user?.year || ''}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1.5 border-2 border-ink bg-white text-ink hover:bg-brutal-red hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-4 space-y-1.5 text-xs font-bold">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between p-2 border-2 border-ink bg-white hover:bg-signal-yellow transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-ink flex-shrink-0" />
                      <span className="text-[11px]">{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className="px-1.5 py-0.2 text-[9px] font-bold bg-brutal-red text-white border border-ink">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t-2 border-ink mt-4">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onResetDemo && onResetDemo();
              }}
              className="w-full py-2.5 text-xs font-mono font-bold text-ink bg-white hover:bg-signal-yellow border-2 border-ink transition-colors uppercase shadow-brutal-sm"
            >
              [ RESET DEMO DATA ]
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sticky Editorial Navigation Strip */}
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas border-t-2 border-ink grid grid-cols-4 divide-x-2 divide-ink font-mono"
      >
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2.5 px-1 transition-all text-center select-none ${
                isActive
                  ? 'bg-ink text-canvas font-black'
                  : 'bg-canvas text-ink/80 hover:bg-white font-bold'
              }`
            }
          >
            <span className="text-[10px] tracking-wider uppercase leading-none">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
