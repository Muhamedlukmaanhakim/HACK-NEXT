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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark: Two Lines with Red Block */}
        <Link to="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-8 h-8 bg-brutal-red border-2 border-ink flex items-center justify-center text-white font-display font-bold text-sm shadow-brutal-sm">
            CM
          </div>
          <div className="flex flex-col font-display font-extrabold text-sm sm:text-base leading-none tracking-tight text-ink">
            <span>COLLAB</span>
            <span className="text-brutal-red">MATRIX</span>
          </div>
          <span className="hidden xl:inline-block text-[10px] font-mono border border-ink px-1.5 py-0.2 bg-white text-ink uppercase ml-2">
            EDITION // 2026
          </span>
        </Link>

        {/* Desktop Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-bold tracking-wider">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 transition-colors relative py-1 ${
                  isActive
                    ? 'text-ink font-bold border-b-2 border-brutal-red'
                    : 'text-ink/60 hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="text-[10px] text-ink/40">{item.num}</span>
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 bg-brutal-red inline-block ml-0.5" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
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
                variant="ghost"
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
        <div className="md:hidden border-t-2 border-ink bg-white px-5 py-6 space-y-4 font-mono shadow-brutal-lg animate-fade-in">
          <div className="text-[10px] font-bold text-ink/60 uppercase tracking-widest border-b border-ink/20 pb-2 flex justify-between">
            <span>[ NAVIGATION DIRECTORY ]</span>
            <span className="text-brutal-red">● ONLINE</span>
          </div>

          <nav className="flex flex-col space-y-3 text-sm font-bold">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 border-2 border-ink bg-canvas hover:bg-signal-yellow transition-colors"
              >
                <span>{item.num} / {item.label}</span>
                <ArrowRight className="w-4 h-4 text-ink" />
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t-2 border-ink flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
              >
                [ OPEN DASHBOARD → ]
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                >
                  [ SIGN IN ]
                </Button>
                <Button
                  variant="primary"
                  size="md"
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
