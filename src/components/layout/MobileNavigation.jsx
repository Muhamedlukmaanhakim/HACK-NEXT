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
  Layers,
} from 'lucide-react';
import Avatar from '../ui/Avatar';

export default function MobileNavigation({
  user,
  pendingRequestCount = 0,
  onResetDemo,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const bottomNavItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Discover', to: '/discover/students', icon: Users },
    { label: 'Create', to: '/opportunities/create', icon: PlusCircle, isHighlight: true },
    {
      label: 'Requests',
      to: '/requests',
      icon: Inbox,
      badge: pendingRequestCount > 0 ? pendingRequestCount : null,
    },
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="lg:hidden sticky top-0 z-40 glass-nav px-4 py-3 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-text-primary tracking-tight">
            COLLAB<span className="text-accent-teal">MATRIX</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Slide-out Full Mobile Menu Drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-6 flex flex-col justify-between animate-fade-in">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <Avatar name={user?.name || 'Lukmaan'} size="sm" />
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">{user?.name}</h4>
                  <p className="text-xs text-text-secondary">{user?.department} • {user?.year}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 text-text-muted hover:text-text-primary"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-6 space-y-2">
              <NavLink
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-white/5"
              >
                <LayoutDashboard className="w-5 h-5 text-accent-indigo" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/discover/students"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-white/5"
              >
                <Users className="w-5 h-5 text-accent-teal" />
                <span>Find Students</span>
              </NavLink>
              <NavLink
                to="/discover/opportunities"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-white/5"
              >
                <Compass className="w-5 h-5 text-accent-indigo" />
                <span>Opportunities</span>
              </NavLink>
              <NavLink
                to="/opportunities/create"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-white/5"
              >
                <PlusCircle className="w-5 h-5 text-accent-violet" />
                <span>Create Project</span>
              </NavLink>
              <NavLink
                to="/requests"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-sm font-medium hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-5 h-5 text-status-warning" />
                  <span>Requests</span>
                </div>
                {pendingRequestCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent-teal text-background">
                    {pendingRequestCount}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/team"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-white/5"
              >
                <UserCheck className="w-5 h-5 text-status-success" />
                <span>My Team</span>
              </NavLink>
              <NavLink
                to="/team/gap-analysis"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-white/5"
              >
                <PieChart className="w-5 h-5 text-accent-teal" />
                <span>Team Gap Analysis</span>
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-white/5"
              >
                <User className="w-5 h-5 text-text-secondary" />
                <span>Profile</span>
              </NavLink>
              <NavLink
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-white/5"
              >
                <Settings className="w-5 h-5 text-text-secondary" />
                <span>Settings</span>
              </NavLink>
            </nav>
          </div>

          <div className="pt-4 border-t border-surface-border">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onResetDemo && onResetDemo();
              }}
              className="w-full py-2.5 text-xs text-text-muted hover:text-accent-teal border border-surface-border rounded-xl transition-colors"
            >
              Reset Demo to Initial State
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sticky Navigation */}
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-surface-border/80 px-2 py-1.5 flex items-center justify-around"
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-xl transition-colors relative min-w-[56px] min-h-[48px] ${
                  isActive
                    ? 'text-accent-indigo'
                    : 'text-text-muted hover:text-text-primary'
                } ${item.isHighlight ? 'text-accent-teal' : ''}`
              }
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.isHighlight ? 'scale-110 text-accent-teal' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-accent-teal text-background">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
