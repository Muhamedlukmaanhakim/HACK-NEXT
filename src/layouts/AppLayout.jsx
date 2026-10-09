import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import MobileNavigation from '../components/layout/MobileNavigation';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

export default function AppLayout() {
  const { user } = useAuth();
  const { requests, resetToSeedData } = useAppData();
  const { addToast } = useToast();

  const isFaculty = user?.role === 'faculty';

  const pendingIncomingCount = (requests || []).filter(
    (r) => r.type === 'incoming' && r.status === 'Pending'
  ).length;

  const handleResetDemo = () => {
    resetToSeedData();
    addToast({
      type: 'info',
      title: 'DEMO STATE RESET',
      message: 'All campus directories and records restored to initial baseline.',
    });
  };

  const studentTopNavShortcuts = [
    { num: '01', label: 'DISCOVER', to: '/discover/students' },
    { num: '02', label: 'PROJECTS', to: '/discover/opportunities' },
    { num: '03', label: 'MATCHES', to: '/matches' },
    { num: '04', label: 'MY TEAM', to: '/team' },
    { num: '05', label: 'TRIAL SPRINT', to: '/team/trial-sprint' },
  ];

  const facultyTopNavShortcuts = [
    { num: '01', label: 'INITIATIVES', to: '/faculty/opportunities' },
    { num: '02', label: 'SUPERVISION', to: '/faculty/supervision' },
    { num: '03', label: 'SPRINTS', to: '/faculty/trial-sprints' },
    { num: '04', label: 'EVIDENCE REVIEWS', to: '/faculty/reviews/evidence' },
    { num: '05', label: 'HEALTH RADAR', to: '/faculty/health-radar' },
  ];

  const topNavShortcuts = isFaculty ? facultyTopNavShortcuts : studentTopNavShortcuts;
  const homeRoute = isFaculty ? '/faculty/dashboard' : '/dashboard';

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar
        user={user}
        pendingRequestCount={pendingIncomingCount}
        onResetDemo={handleResetDemo}
        className="hidden lg:flex fixed top-0 bottom-0 left-0"
      />

      {/* Mobile Top Navigation & Bottom Tab Bar */}
      <MobileNavigation
        user={user}
        pendingRequestCount={pendingIncomingCount}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col pb-24 lg:pb-12 bg-canvas">
        {/* Top Publication Header & Ticker */}
        <header className="hidden lg:flex items-center justify-between px-8 py-2.5 border-b-2 border-ink bg-canvas text-xs font-mono font-bold select-none sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <NavLink to={homeRoute} className="flex items-center gap-2 border-2 border-ink bg-white px-2.5 py-0.5 shadow-brutal-sm">
              <span className="font-display font-black text-ink uppercase tracking-tight text-xs">
                COLLAB / MATRIX
              </span>
              <span className="text-brutal-red font-mono text-[10px] flex items-center gap-1 font-bold">
                <span className="w-2 h-2 bg-brutal-red inline-block" />
                LIVE
              </span>
            </NavLink>

            <nav className="flex items-center gap-4 text-[11px]">
              {topNavShortcuts.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `transition-colors py-0.5 uppercase ${
                      isActive
                        ? 'text-ink font-black border-b-2 border-brutal-red'
                        : 'text-ink/60 hover:text-ink font-semibold'
                    }`
                  }
                >
                  <span className="text-ink/40 mr-1">{item.num} /</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 text-ink/80 text-[11px]">
            <span className={`px-2 py-0.5 border border-ink font-bold ${isFaculty ? 'bg-ink text-white' : 'bg-signal-yellow text-ink'}`}>
              {isFaculty ? 'FACULTY NODE' : 'STUDENT NODE'}
            </span>
            <span className="text-ink/40">|</span>
            <span className="text-ink font-bold uppercase truncate max-w-[200px]">
              {user?.name || (isFaculty ? 'DR. ARIS THORNE' : 'LUKMAAN HAKIM')}
            </span>
          </div>
        </header>

        {/* Constrained Publication Frame */}
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
