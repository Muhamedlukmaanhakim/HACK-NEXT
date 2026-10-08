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
  Cpu,
  RotateCcw,
} from 'lucide-react';
import Avatar from '../ui/Avatar';

export default function Sidebar({
  user,
  pendingRequestCount = 0,
  onResetDemo,
  className = '',
}) {
  const navGroups = [
    {
      code: '01',
      title: 'CONSOLE OVERVIEW',
      items: [
        { num: '01', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      code: '02',
      title: 'DISCOVERY MATRIX',
      items: [
        { num: '02', label: 'Find Students', to: '/discover/students', icon: Users },
        { num: '03', label: 'Opportunities', to: '/discover/opportunities', icon: Compass },
      ],
    },
    {
      code: '03',
      title: 'COLLABORATION',
      items: [
        { num: '04', label: 'Create Project', to: '/opportunities/create', icon: PlusCircle },
        {
          num: '05',
          label: 'Requests',
          to: '/requests',
          icon: Inbox,
          badge: pendingRequestCount > 0 ? pendingRequestCount : null,
        },
        { num: '06', label: 'My Team', to: '/team', icon: UserCheck },
        { num: '07', label: 'Team Gap Analysis', to: '/team/gap-analysis', icon: PieChart },
      ],
    },
    {
      code: '04',
      title: 'STATION CONFIG',
      items: [
        { num: '08', label: 'My Profile', to: '/profile', icon: User },
        { num: '09', label: 'Settings', to: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`w-64 h-screen flex-shrink-0 flex flex-col justify-between border-r border-retro-border bg-retro-surface text-retro-paper z-30 select-none ${className}`}
    >
      {/* Flight Console Header */}
      <div>
        <div className="p-4 border-b border-retro-border bg-retro-surface-elevated/40">
          <div className="flex items-center justify-between text-[10px] font-mono text-retro-muted mb-2 tracking-wider">
            <span>[ SYS // CONSOLE-01 ]</span>
            <span className="flex items-center gap-1.5 text-retro-amber">
              <span className="w-1.5 h-1.5 rounded-full bg-retro-amber animate-pulse" />
              ONLINE
            </span>
          </div>

          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-sm bg-retro-surface border border-retro-orange/60 flex items-center justify-center text-retro-orange group-hover:bg-retro-orange group-hover:text-retro-bg transition-colors shadow-panel">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-display font-extrabold tracking-wider text-retro-paper">
                COLLAB<span className="text-retro-orange">MATRIX</span>
              </span>
              <span className="text-[9px] font-mono text-retro-muted tracking-widest uppercase">
                TELEMETRY & MATCH GRID
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Sections */}
        <div className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-175px)] scrollbar-none">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-2.5 py-1 text-[9px] font-mono tracking-widest text-retro-muted/80 uppercase flex items-center justify-between border-b border-retro-border/40 mb-1">
                <span>{group.title}</span>
                <span className="text-retro-amber/60">{group.code}</span>
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-2 rounded-sm text-xs font-mono transition-all duration-150 border ${
                          isActive
                            ? 'bg-retro-surface-elevated border-retro-coral text-retro-paper shadow-panel font-semibold'
                            : 'border-transparent text-retro-paper/70 hover:text-retro-paper hover:bg-retro-surface-hover hover:border-retro-border'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-retro-coral' : 'text-retro-amber'}`} />
                            <span className="truncate tracking-wide">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {item.badge && (
                              <span className="px-1.5 py-0.2 rounded-none text-[9px] font-mono font-bold bg-retro-coral text-retro-bg">
                                {item.badge}
                              </span>
                            )}
                            <span className={`text-[9px] font-mono ${isActive ? 'text-retro-coral font-bold' : 'text-retro-muted opacity-50'}`}>
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

      {/* Operator Telemetry Footer */}
      <div className="p-3 border-t border-retro-border bg-retro-surface-elevated/60">
        <NavLink
          to="/profile"
          className="flex items-center gap-2.5 p-2 rounded-sm border border-retro-border/60 hover:border-retro-orange/50 hover:bg-retro-surface transition-colors group mb-2"
        >
          <Avatar name={user?.name || 'Lukmaan Hakim'} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-mono text-retro-muted uppercase tracking-wider">
              OPERATOR //
            </div>
            <p className="text-xs font-semibold text-retro-paper truncate group-hover:text-retro-amber transition-colors">
              {user?.name || 'Lukmaan Hakim'}
            </p>
            <p className="text-[10px] font-mono text-retro-muted truncate">
              {user?.department || 'CSE'} // {user?.year || 'YR-02'}
            </p>
          </div>
        </NavLink>

        <div className="px-1 pt-1 border-t border-retro-border/40 flex items-center justify-between text-[10px] font-mono">
          <span className="text-retro-muted tracking-wide">SEED: v2.4</span>
          <button
            type="button"
            onClick={onResetDemo}
            className="text-retro-amber hover:text-retro-orange flex items-center gap-1 transition-colors uppercase font-mono tracking-wider"
            title="Reset to initial seed data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>[RESET SEED]</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
