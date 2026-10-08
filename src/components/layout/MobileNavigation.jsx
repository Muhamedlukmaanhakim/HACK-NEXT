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
} from 'lucide-react';
import Avatar from '../ui/Avatar';

export default function MobileNavigation({
  user,
  pendingRequestCount = 0,
  onResetDemo,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const bottomNavItems = [
    { label: 'DISCOVER', to: '/discover/students', icon: Users },
    { label: 'PROJECTS', to: '/discover/opportunities', icon: Compass },
    { label: 'MATCHES', to: '/matches', icon: PieChart },
    { label: 'TEAM', to: '/team', icon: UserCheck },
  ];

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-canvas border-b-2 border-ink px-4 py-2.5 flex items-center justify-between font-mono">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brutal-red border-2 border-ink flex items-center justify-center text-white font-display font-extrabold text-xs shadow-brutal-sm">
            CM
          </div>
          <div className="flex flex-col font-display font-extrabold text-sm uppercase leading-none text-ink">
            <span>COLLAB</span>
            <span className="text-brutal-red">MATRIX</span>
          </div>
        </NavLink>

        <div className="flex items-center gap-2">
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
        <div className="lg:hidden fixed inset-0 z-50 bg-canvas p-6 flex flex-col justify-between font-mono animate-fade-in border-4 border-ink">
          <div>
            <div className="flex items-center justify-between pb-4 border-b-2 border-ink">
              <div className="flex items-center gap-2.5">
                <Avatar name={user?.name || 'Lukmaan'} size="sm" />
                <div>
                  <h4 className="text-sm font-bold text-ink uppercase">{user?.name}</h4>
                  <p className="text-xs text-ink/70">{user?.department} // {user?.year}</p>
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

            <nav className="mt-6 space-y-2 text-xs font-bold">
              {[
                { label: '01. DASHBOARD', to: '/dashboard', icon: LayoutDashboard },
                { label: '02. FIND STUDENTS', to: '/discover/students', icon: Users },
                { label: '03. OPPORTUNITIES', to: '/discover/opportunities', icon: Compass },
                { label: '04. CREATE PROJECT', to: '/opportunities/create', icon: PlusCircle },
                { label: '05. REQUESTS', to: '/requests', icon: Inbox, badge: pendingRequestCount },
                { label: '06. MY TEAM', to: '/team', icon: UserCheck },
                { label: '07. TEAM GAP ANALYSIS', to: '/team/gap-analysis', icon: PieChart },
                { label: '08. MY PROFILE', to: '/profile', icon: User },
                { label: '09. SETTINGS', to: '/settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 border-2 border-ink bg-white hover:bg-signal-yellow transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-ink" />
                      <span>{item.label}</span>
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

          <div className="pt-4 border-t-2 border-ink">
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
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-ink px-2 py-1 flex items-center justify-around font-mono"
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-1.5 transition-colors relative min-w-[60px] ${
                  isActive
                    ? 'text-brutal-red font-bold'
                    : 'text-ink/60 hover:text-ink'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-wider font-bold">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
