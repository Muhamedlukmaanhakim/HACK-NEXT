import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Cpu, Terminal, Users, ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-retro-bg text-retro-paper bg-retro-grid">
      {/* Left Form Container */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative">
        <div className="flex items-center justify-between border-b border-retro-border/60 pb-4 mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-sm bg-retro-surface border border-retro-coral flex items-center justify-center text-retro-coral shadow-panel">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-base font-display font-extrabold tracking-wider text-retro-paper">
              COLLAB<span className="text-retro-coral">MATRIX</span>
            </span>
          </Link>
          <span className="text-[10px] font-mono text-retro-amber border border-retro-amber/40 px-2 py-0.5 rounded-sm">
            [ TERMINAL // ACCESS ]
          </span>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-6">
          <Outlet />
        </div>

        <div className="text-[10px] font-mono text-retro-muted text-center lg:text-left pt-6 border-t border-retro-border/40">
          COLLABMATRIX CONSOLE • AUTHENTICATION PROTOCOL 1978.4 • STUDENT COLLABORATION GRID
        </div>
      </div>

      {/* Right Visual Panel (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-retro-surface border-l border-retro-border p-12 flex-col justify-between overflow-hidden shadow-panel">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-retro-coral px-2.5 py-1 rounded-sm bg-retro-surface-elevated border border-retro-border">
            <span className="w-1.5 h-1.5 rounded-full bg-retro-mint animate-pulse" />
            TELEMETRY NODE // CAMPUS GRID
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-retro-paper tracking-tight leading-snug">
            The network for complementary minds.
          </h2>
          <p className="text-xs sm:text-sm text-retro-paper/70 font-sans leading-relaxed">
            Eliminate chaotic group messaging. Connect with campus builders whose skills, availability, and project commitments directly fulfill team requirements.
          </p>
        </div>

        {/* Feature Highlights on right card */}
        <div className="relative z-10 space-y-3 my-8 font-mono">
          <div className="p-3.5 rounded-sm bg-retro-surface-elevated border border-retro-border flex items-start gap-3 shadow-panel">
            <div className="p-2 rounded-sm bg-retro-surface border border-retro-border text-retro-amber">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-retro-muted uppercase tracking-wider">[ SPEC // 01 ]</div>
              <h4 className="text-xs font-bold text-retro-paper">AI Requirement Simulation</h4>
              <p className="text-[11px] text-retro-muted font-sans mt-0.5">Parse project descriptions into structured skill vectors.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-sm bg-retro-surface-elevated border border-retro-border flex items-start gap-3 shadow-panel">
            <div className="p-2 rounded-sm bg-retro-surface border border-retro-border text-retro-orange">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-retro-muted uppercase tracking-wider">[ SPEC // 02 ]</div>
              <h4 className="text-xs font-bold text-retro-paper">Multi-Factor Compatibility</h4>
              <p className="text-[11px] text-retro-muted font-sans mt-0.5">50% Skills, 20% Interest, 15% Hours, 15% Experience weighting.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-sm bg-retro-surface-elevated border border-retro-border flex items-start gap-3 shadow-panel">
            <div className="p-2 rounded-sm bg-retro-surface border border-retro-border text-retro-teal">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-retro-muted uppercase tracking-wider">[ SPEC // 03 ]</div>
              <h4 className="text-xs font-bold text-retro-paper">Team Skill Gap Analysis</h4>
              <p className="text-[11px] text-retro-muted font-sans mt-0.5">Identify uncovered project roles and recruit exact matching candidates.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-retro-muted pt-6 border-t border-retro-border/60">
          <span>// CAMPUS HACKATHONS</span>
          <span>// CROSS-DEPARTMENT TEAMS</span>
        </div>
      </div>
    </div>
  );
}
