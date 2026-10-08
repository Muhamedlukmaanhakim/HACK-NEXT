import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layers, Sparkles, Users, Award, ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-text-primary">
      {/* Left Form Container */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-soft group-hover:shadow-glow-indigo transition-all">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-text-primary">
              COLLAB<span className="text-accent-teal">MATRIX</span>
            </span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-6">
          <Outlet />
        </div>

        <div className="text-xs text-text-muted text-center lg:text-left pt-6 border-t border-surface-border/40">
          CollabMatrix Demo • Student-to-Student Innovation Matrix
        </div>
      </div>

      {/* Right Visual Panel (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-surface border-l border-surface-border p-12 flex-col justify-between overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent-indigo/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent-teal/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-teal px-3 py-1 rounded-full bg-accent-teal/10 border border-accent-teal/20 inline-block">
            Campus Collaboration
          </span>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight leading-tight">
            Your next great collaboration starts here.
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Stop asking randomly in messaging groups. Discover students with complementary skills, clear availability, and matched project interests.
          </p>
        </div>

        {/* Feature Highlights on right card */}
        <div className="relative z-10 space-y-3 my-8">
          <div className="p-4 rounded-xl bg-surface-elevated/80 border border-surface-border/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent-indigo/20 text-accent-indigo">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-primary">AI Requirement Extraction</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">Translate natural project descriptions into precise skill tags.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/80 border border-surface-border/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent-teal/20 text-accent-teal">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-primary">Multi-Factor Compatibility</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">Match by skill competency, availability windows, and domain interest.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/80 border border-surface-border/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-status-success/20 text-status-success">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-primary">Team Skill Gap Analysis</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">Identify missing disciplines and recruit the exact missing pieces.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-text-muted pt-6 border-t border-surface-border/50">
          <span>Campus Hackathons & Projects</span>
          <span>Cross-Department Teams</span>
        </div>
      </div>
    </div>
  );
}
