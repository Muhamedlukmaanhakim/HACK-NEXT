import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Inbox,
  User,
  Menu,
  X,
  Compass,
  PieChart,
  UserCheck,
  Settings,
  Cpu,
} from 'lucide-react';
import Avatar from '../ui/Avatar';

export default function MobileNavigation({
  user,
  pendingRequestCount = 0,
  onResetDemo,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const bottomNavItems = [
    { label: 'DASH', to: '/dashboard', icon: LayoutDashboard },
    { label: 'NODES', to: '/discover/students', icon: Users },
    { label: 'POST', to: '/opportunities/create', icon: PlusCircle, isHighlight: true },
    {
      label: 'INBOX',
      to: '/requests',
      icon: Inbox,
      badge: pendingRequestCount > 0 ? pendingRequestCount : null,
    },
    { label: 'USER', to: '/profile', icon: User },
  ];

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-retro-bg/95 backdrop-blur-md border-b border-retro-border px-4 py-3 flex items-center justify-between font-mono">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-retro-surface border border-retro-orange flex items-center justify-center text-retro-orange">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-xs font-display font-bold text-retro-paper tracking-wider">
            COLLAB<span className="text-retro-orange">MATRIX</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-retro-muted">[ SYS: OK ]</span>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-sm border border-retro-border text-retro-paper hover:bg-retro-surface-hover"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide-out Full Mobile Menu Drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-retro-bg/98 backdrop-blur-md p-5 flex flex-col justify-between font-mono animate-fade-in">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-retro-border">
              <div className="flex items-center gap-2.5">
                <Avatar name={user?.name || 'Lukmaan'} size="sm" />
                <div>
                  <h4 className="text-xs font-semibold text-retro-paper">{user?.name}</h4>
                  <p className="text-[10px] text-retro-muted">{user?.department} // {user?.year}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-sm border border-retro-border text-retro-muted hover:text-retro-paper"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="mt-5 space-y-1.5 text-xs">
              <NavLink
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-sm border border-transparent hover:border-retro-border hover:bg-retro-surface"
              >
                <LayoutDashboard className="w-4 h-4 text-retro-amber" />
                <span>01. DASHBOARD CONSOLE</span>
              </NavLink>
              <NavLink
                to="/discover/students"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-sm border border-transparent hover:border-retro-border hover:bg-retro-surface"
              >
                <Users className="w-4 h-4 text-retro-orange" />
                <span>02. FIND STUDENTS</span>
              </NavLink>
              <NavLink
                to="/discover/opportunities"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-sm border border-transparent hover:border-retro-border hover:bg-retro-surface"
              >
                <Compass className="w-4 h-4 text-retro-amber" />
                <span>03. OPPORTUNITIES</span>
              </NavLink>
              <NavLink
                to="/opportunities/create"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-sm border border-transparent hover:border-retro-border hover:bg-retro-surface"
              >
                <PlusCircle className="w-4 h-4 text-retro-orange" />
                <span>04. CREATE PROJECT</span>
              </NavLink>
              <NavLink
                to="/requests"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-sm border border-transparent hover:border-retro-border hover:bg-retro-surface"
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-4 h-4 text-retro-amber" />
                  <span>05. REQUESTS</span>
                </div>
                {pendingRequestCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-retro-orange text-retro-bg">
                    {pendingRequestCount}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/team"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-sm border border-transparent hover:border-retro-border hover:bg-retro-surface"
              >
                <UserCheck className="w-4 h-4 text-retro-teal" />
                <span>06. MY TEAM</span>
              </NavLink>
              <NavLink
                to="/team/gap-analysis"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-sm border border-transparent hover:border-retro-border hover:bg-retro-surface"
              >
                <PieChart className="w-4 h-4 text-retro-teal" />
                <span>07. TEAM GAP ANALYSIS</span>
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-sm border border-transparent hover:border-retro-border hover:bg-retro-surface"
              >
                <User className="w-4 h-4 text-retro-muted" />
                <span>08. OPERATOR PROFILE</span>
              </NavLink>
              <NavLink
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-sm border border-transparent hover:border-retro-border hover:bg-retro-surface"
              >
                <Settings className="w-4 h-4 text-retro-muted" />
                <span>09. SETTINGS</span>
              </NavLink>
            </nav>
          </div>

          <div className="pt-4 border-t border-retro-border">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onResetDemo && onResetDemo();
              }}
              className="w-full py-2 text-xs font-mono text-retro-amber hover:text-retro-orange border border-retro-border rounded-sm transition-colors uppercase"
            >
              [ RESET SEED STATE ]
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sticky Telemetry Strip */}
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-retro-surface border-t border-retro-border px-2 py-1 flex items-center justify-around font-mono"
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-1.5 transition-colors relative min-w-[50px] ${
                  isActive
                    ? 'text-retro-orange font-bold'
                    : 'text-retro-muted hover:text-retro-paper'
                } ${item.isHighlight ? 'text-retro-amber' : ''}`
              }
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${item.isHighlight ? 'scale-110 text-retro-orange' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 text-[8px] font-bold bg-retro-orange text-retro-bg">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] mt-0.5 tracking-wider">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
