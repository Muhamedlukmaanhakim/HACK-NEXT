import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar({ isAuthenticated = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { num: '01', label: 'DISCOVER', to: '/discover/students' },
    { num: '02', label: 'PROJECTS', to: '/discover/opportunities' },
    { num: '03', label: 'MATCHES', to: '/matches' },
    { num: '04', label: 'TEAM', to: '/team' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-canvas border-b-2 border-ink">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand: COLLAB / MATRIX ● LIVE */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group select-none">
            <div className="w-7 h-7 bg-brutal-red border-2 border-ink flex items-center justify-center text-white font-display font-black text-xs shadow-brutal-sm">
              CM
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base tracking-tight text-ink uppercase">
                COLLAB / MATRIX
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-campus-green bg-white border border-ink px-1.5 py-0.2">
                <span className="w-1.5 h-1.5 bg-campus-green inline-block" />
                LIVE
              </span>
            </div>
          </Link>
        </div>

        {/* Compact Editorial Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-bold tracking-wider">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors py-1 flex items-center gap-1 ${
                  isActive
                    ? 'text-ink font-black border-b-2 border-brutal-red'
                    : 'text-ink/65 hover:text-ink font-semibold'
                }`
              }
            >
              <span className="text-ink/40 text-[10px]">{item.num} /</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/dashboard')}
            >
              [ DASHBOARD → ]
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
              >
                SIGN IN
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/register')}
              >
                [ ENTER THE NETWORK → ]
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border-2 border-ink bg-white text-ink hover:bg-black hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-ink bg-canvas px-4 py-4 space-y-3 font-mono shadow-brutal-lg animate-fade-in">
          <div className="text-[10px] font-bold text-ink/60 uppercase tracking-widest border-b border-ink/20 pb-1.5 flex justify-between">
            <span>[ NAVIGATION DIRECTORY ]</span>
            <span className="text-brutal-red">● LIVE</span>
          </div>

          <nav className="flex flex-col space-y-2 text-xs font-bold">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 border-2 border-ink bg-white hover:bg-signal-yellow transition-colors"
              >
                <span>{item.num} / {item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-ink" />
              </NavLink>
            ))}
          </nav>

          <div className="pt-2 border-t-2 border-ink flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
              >
                [ OPEN DASHBOARD → ]
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                >
                  [ SIGN IN ]
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                >
                  [ ENTER THE NETWORK → ]
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
