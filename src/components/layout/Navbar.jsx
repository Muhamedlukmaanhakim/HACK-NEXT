import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Menu, X, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function Navbar({ isAuthenticated = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-retro-bg/95 backdrop-blur-md border-retro-border py-2.5 shadow-panel'
          : 'bg-retro-bg/80 border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Telemetry */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-sm bg-retro-surface border border-retro-orange/80 flex items-center justify-center text-retro-orange group-hover:bg-retro-orange group-hover:text-retro-bg transition-colors shadow-panel">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-display font-extrabold tracking-wider text-retro-paper">
                COLLAB<span className="text-retro-orange">MATRIX</span>
              </span>
              <span className="text-[9px] font-mono text-retro-muted hidden sm:inline tracking-widest uppercase">
                // SYSTEM 1978.4
              </span>
            </div>
          </Link>

          {/* Coordinate Watermark (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-sm border border-retro-border/60 bg-retro-surface/50 text-[10px] font-mono text-retro-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-retro-amber animate-pulse" />
            <span>FREQ: 1420 MHZ // GRID: 28°N 77°E</span>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider">
          <a
            href="#problem"
            className="text-retro-paper/70 hover:text-retro-orange transition-colors"
          >
            01. PROBLEM
          </a>
          <a
            href="#solution"
            className="text-retro-paper/70 hover:text-retro-orange transition-colors"
          >
            02. ARCHITECTURE
          </a>
          <a
            href="#features"
            className="text-retro-paper/70 hover:text-retro-orange transition-colors"
          >
            03. CAPABILITIES
          </a>
          <a
            href="#ecosystem"
            className="text-retro-paper/70 hover:text-retro-orange transition-colors"
          >
            04. ECOSYSTEM
          </a>
        </nav>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/dashboard')}
            >
              Console Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                [ SIGN IN ]
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/register')}
              >
                [ ENTER NETWORK → ]
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-sm border border-retro-border text-retro-paper/80 hover:text-retro-paper hover:bg-retro-surface-hover focus-visible:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-retro-border bg-retro-surface/98 px-5 pt-4 pb-6 mt-2 space-y-4 shadow-panel font-mono">
          <div className="text-[10px] text-retro-muted tracking-widest border-b border-retro-border/60 pb-2 flex justify-between">
            <span>[ SYSTEM NAVIGATION ]</span>
            <span className="text-retro-amber">● ACTIVE</span>
          </div>

          <nav className="flex flex-col space-y-2 text-xs">
            <a
              href="#problem"
              onClick={() => setMobileMenuOpen(false)}
              className="text-retro-paper/80 hover:text-retro-orange py-1 flex items-center justify-between"
            >
              <span>01. PROBLEM</span>
              <span className="text-retro-muted">→</span>
            </a>
            <a
              href="#solution"
              onClick={() => setMobileMenuOpen(false)}
              className="text-retro-paper/80 hover:text-retro-orange py-1 flex items-center justify-between"
            >
              <span>02. ARCHITECTURE</span>
              <span className="text-retro-muted">→</span>
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-retro-paper/80 hover:text-retro-orange py-1 flex items-center justify-between"
            >
              <span>03. CAPABILITIES</span>
              <span className="text-retro-muted">→</span>
            </a>
            <a
              href="#ecosystem"
              onClick={() => setMobileMenuOpen(false)}
              className="text-retro-paper/80 hover:text-retro-orange py-1 flex items-center justify-between"
            >
              <span>04. ECOSYSTEM</span>
              <span className="text-retro-muted">→</span>
            </a>
          </nav>

          <div className="pt-3 border-t border-retro-border flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="primary"
                className="w-full font-mono"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full font-mono"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  [ SIGN IN ]
                </Button>
                <Button
                  variant="primary"
                  className="w-full font-mono"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                >
                  [ ENTER NETWORK ]
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
