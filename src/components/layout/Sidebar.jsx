import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Avatar from '../ui/Avatar';

export default function Sidebar({
  user,
  pendingRequestCount = 0,
  onResetDemo,
  className = '',
}) {
  const navigate = useNavigate();

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Discover',
      items: [
        { label: 'Find Students', to: '/discover/students', icon: Users },
        { label: 'Opportunities', to: '/discover/opportunities', icon: Compass },
      ],
    },
    {
      title: 'Collaboration',
      items: [
        { label: 'Create Project', to: '/opportunities/create', icon: PlusCircle },
        {
          label: 'Requests',
          to: '/requests',
          icon: Inbox,
          badge: pendingRequestCount > 0 ? pendingRequestCount : null,
        },
        { label: 'My Team', to: '/team', icon: UserCheck },
        { label: 'Team Gap Analysis', to: '/team/gap-analysis', icon: PieChart },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { label: 'My Profile', to: '/profile', icon: User },
        { label: 'Settings', to: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`w-64 h-screen flex-shrink-0 flex flex-col justify-between glass-panel border-r border-surface-border bg-surface/90 text-text-primary z-30 ${className}`}
    >
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-surface-border/80 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-soft group-hover:shadow-glow-indigo transition-all">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-text-primary">
                COLLAB<span className="text-accent-teal">MATRIX</span>
              </span>
              <span className="text-[10px] text-text-muted font-medium -mt-1 tracking-wide">
                Campus Team Matrix
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? 'bg-accent-indigo text-white shadow-sm font-semibold'
                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-accent-teal text-background">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section: User Profile & Reset Demo */}
      <div className="p-3 border-t border-surface-border/80 bg-surface-elevated/40">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group mb-2"
        >
          <Avatar name={user?.name || 'Lukmaan Hakim'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-primary truncate group-hover:text-accent-teal transition-colors">
              {user?.name || 'Lukmaan Hakim'}
            </p>
            <p className="text-[11px] text-text-muted truncate">
              {user?.department || 'CSE'} • {user?.year || '2nd Year'}
            </p>
          </div>
        </NavLink>

        {/* Reset Demo button link */}
        <div className="px-2 pt-1 border-t border-surface-border/40 flex items-center justify-between text-[11px]">
          <span className="text-[10px] text-text-muted">Demo Mode</span>
          <button
            type="button"
            onClick={onResetDemo}
            className="text-[11px] text-text-muted hover:text-accent-teal flex items-center gap-1 transition-colors"
            title="Reset to initial seed data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
