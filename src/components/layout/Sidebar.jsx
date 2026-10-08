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
      title: 'OVERVIEW',
      items: [
        { num: '01', label: 'DASHBOARD', to: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      code: '02',
      title: 'CAMPUS DIRECTORY',
      items: [
        { num: '02', label: 'FIND STUDENTS', to: '/discover/students', icon: Users },
        { num: '03', label: 'PROJECTS', to: '/discover/opportunities', icon: Compass },
      ],
    },
    {
      code: '03',
      title: 'COLLABORATION',
      items: [
        { num: '04', label: 'CREATE PROJECT', to: '/opportunities/create', icon: PlusCircle },
        {
          num: '05',
          label: 'REQUESTS',
          to: '/requests',
          icon: Inbox,
          badge: pendingRequestCount > 0 ? pendingRequestCount : null,
        },
        { num: '06', label: 'MY TEAM', to: '/team', icon: UserCheck },
        { num: '07', label: 'TEAM GAPS', to: '/team/gap-analysis', icon: PieChart },
      ],
    },
    {
      code: '04',
      title: 'ACCOUNT',
      items: [
        { num: '08', label: 'MY PROFILE', to: '/profile', icon: User },
        { num: '09', label: 'SETTINGS', to: '/settings', icon: Settings },
      ],
    },
  ];

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
              ACTIVE
            </span>
          </div>

          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brutal-red border-2 border-ink flex items-center justify-center text-white font-display font-extrabold text-sm shadow-brutal-sm">
              CM
            </div>
            <div className="flex flex-col font-display font-extrabold uppercase leading-none text-ink tracking-tight">
              <span>COLLAB</span>
              <span className="text-brutal-red">MATRIX</span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-175px)]">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono font-bold tracking-widest text-ink/60 uppercase flex items-center justify-between border-b border-ink/20 mb-1">
                <span>{group.title}</span>
                <span className="text-ink/40">/{group.code}</span>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-2 text-xs font-mono font-bold transition-all duration-150 border-2 ${
                          isActive
                            ? 'bg-ink text-canvas border-ink shadow-brutal-sm translate-x-1'
                            : 'bg-white text-ink border-transparent hover:border-ink hover:bg-canvas'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-signal-yellow' : 'text-ink'}`} />
                            <span className="truncate tracking-wide">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {item.badge && (
                              <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-brutal-red text-white border border-ink">
                                {item.badge}
                              </span>
                            )}
                            <span className={`text-[10px] font-mono ${isActive ? 'text-signal-yellow' : 'text-ink/40'}`}>
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
          to="/profile"
          className="flex items-center gap-2.5 p-2 border-2 border-ink bg-white hover:bg-signal-yellow transition-colors group mb-2"
        >
          <Avatar name={user?.name || 'Lukmaan Hakim'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-ink truncate uppercase">
              {user?.name || 'Lukmaan Hakim'}
            </p>
            <p className="text-[10px] font-mono text-ink/70 truncate">
              {user?.department || 'CSE'} / {user?.year || 'YEAR 02'}
            </p>
          </div>
        </NavLink>

        <div className="pt-2 border-t border-ink/20 flex items-center justify-between text-[10px] font-mono">
          <span className="text-ink/60 font-bold">DEMO v2.6</span>
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
