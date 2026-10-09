import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 sm:space-y-20 pt-16 pb-20 font-sans bg-canvas text-ink">
      {/* 1. Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="border-b-2 border-ink pb-4 mb-8 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink bg-white border-2 border-ink px-2.5 py-1 shadow-brutal-sm">
            CAMPUS COLLABORATION NETWORK / 01
          </span>
          <span className="text-xs font-mono text-ink/70 hidden sm:inline font-bold">
            EDITION // 2026 · PHYSICAL DIRECTORY TRANSFORMED
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black uppercase tracking-tight leading-[0.9] text-ink">
              FIND<br />
              <span className="bg-signal-yellow text-ink px-3 inline-block border-2 border-ink shadow-brutal-sm my-1">
                YOUR
              </span><br />
              <span className="text-brutal-red">PEOPLE.</span>
            </h1>

            <p className="text-sm sm:text-base text-ink/80 font-sans max-w-lg leading-relaxed font-medium">
              Stop building teams from whoever happens to be around. Find people with the skills your project actually needs.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              >
                [ FIND MY TEAM → ]
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/discover/opportunities')}
              >
                [ EXPLORE PROJECTS ]
              </Button>
            </div>
          </div>

          {/* Quick Technical Summary Block */}
          <div className="lg:col-span-5 border-2 border-ink bg-white p-5 shadow-brutal space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs font-bold border-b-2 border-ink pb-2">
              <span className="uppercase">NETWORK METRICS</span>
              <span className="text-brutal-red font-bold">LIVE SPEC</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 border-2 border-ink bg-canvas flex items-center justify-between">
                <span className="font-bold text-ink uppercase">STUDENT NODES</span>
                <span className="font-bold bg-white px-2 py-0.5 border border-ink">126 ACTIVE</span>
              </div>
              <div className="p-2.5 border-2 border-ink bg-canvas flex items-center justify-between">
                <span className="font-bold text-ink uppercase">SKILL MAPPINGS</span>
                <span className="font-bold bg-white px-2 py-0.5 border border-ink">42 DOMAINS</span>
              </div>
              <div className="p-2.5 border-2 border-ink bg-canvas flex items-center justify-between">
                <span className="font-bold text-ink uppercase">ACTIVE PROJECTS</span>
                <span className="font-bold bg-white px-2 py-0.5 border border-ink">14 TEAMS</span>
              </div>
              <div className="p-2.5 border-2 border-ink bg-signal-yellow text-ink shadow-brutal-sm flex items-center justify-between font-bold">
                <span className="uppercase">PEAK MATCH ACCURACY</span>
                <span className="bg-white px-2 py-0.5 border border-ink text-brutal-red">94%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Compact Bordered Blocks: COLLABORATION NETWORK (Section 13) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="border-2 border-ink bg-white shadow-brutal-sm">
          <div className="px-4 py-2 border-b-2 border-ink bg-canvas flex items-center justify-between text-xs font-mono font-bold">
            <span className="uppercase text-ink">COLLABORATION NETWORK</span>
            <span className="text-ink/60 uppercase">CORE ARCHITECTURE</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x-2 divide-ink font-mono text-center">
            <div className="p-4 hover:bg-canvas transition-colors">
              <div className="text-[10px] text-ink/50 font-bold mb-1">01 // LAYER</div>
              <div className="font-display font-extrabold text-base uppercase text-ink">PEOPLE</div>
              <p className="text-[11px] text-ink/70 mt-1 font-sans">Cross-campus verified students</p>
            </div>
            <div className="p-4 hover:bg-canvas transition-colors">
              <div className="text-[10px] text-ink/50 font-bold mb-1">02 // LAYER</div>
              <div className="font-display font-extrabold text-base uppercase text-ink">SKILLS</div>
              <p className="text-[11px] text-ink/70 mt-1 font-sans">Hard tech, design & pitch</p>
            </div>
            <div className="p-4 hover:bg-canvas transition-colors">
              <div className="text-[10px] text-ink/50 font-bold mb-1">03 // LAYER</div>
              <div className="font-display font-extrabold text-base uppercase text-ink">PROJECTS</div>
              <p className="text-[11px] text-ink/70 mt-1 font-sans">Hackathons, research & startups</p>
            </div>
            <div className="p-4 hover:bg-canvas transition-colors bg-signal-yellow/30">
              <div className="text-[10px] text-brutal-red font-bold mb-1">04 // OUTCOME</div>
              <div className="font-display font-extrabold text-base uppercase text-ink">TEAMS</div>
              <p className="text-[11px] text-ink/70 mt-1 font-sans">Zero skill gaps & 100% covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 01: THE PROBLEM (Section 13) */}
      <section id="problem" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="border-t-2 border-ink pt-8 space-y-5">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60">
            01 / THE PROBLEM
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-display font-black uppercase text-ink tracking-tight leading-tight">
              "GOOD IDEAS DON'T FAIL BECAUSE PEOPLE AREN'T TALENTED."
            </h2>
            <h3 className="text-xl sm:text-3xl font-display font-black uppercase text-brutal-red tracking-tight leading-tight">
              "THEY FAIL BECAUSE THE RIGHT PEOPLE NEVER FOUND EACH OTHER."
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {[
              { num: '01', title: 'CHAT SILOS', desc: 'Hackathon requests get drowned in massive unorganized college groups.' },
              { num: '02', title: 'SAME-DISCIPLINE TRAP', desc: 'Coders team up only with coders; nobody designs or presents the pitch.' },
              { num: '03', title: 'HIDDEN TALENT', desc: 'Brilliant student designers in adjacent blocks remain completely invisible.' },
              { num: '04', title: 'LAST-MINUTE CHAOS', desc: 'Squads assemble 2 hours before the deadline with random skill overlaps.' },
            ].map((p) => (
              <div key={p.num} className="p-4 border-2 border-ink bg-white shadow-brutal-sm space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-brutal-red">[{p.num}]</span>
                <h4 className="text-xs font-display font-extrabold text-ink uppercase tracking-wide">{p.title}</h4>
                <p className="text-xs text-ink/75 font-sans leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION 02: SOLUTION MATRIX (Section 13) */}
      <section id="solution" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="border-t-2 border-ink pt-8 space-y-5">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60">
            02 / SOLUTION MATRIX
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="text-2xl sm:text-4xl font-display font-black uppercase text-ink tracking-tight">
              MULTI-DIMENSIONAL MATCHING.
            </h2>
            <p className="text-xs font-mono text-ink/70">
              [ WEIGHTED COMPATIBILITY CRITERIA ]
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
            {[
              { label: 'SKILLS', weight: '50%', desc: 'Python, Figma, ML, Pitch Deck' },
              { label: 'INTERESTS', weight: '20%', desc: 'Healthcare, Startups, Web3' },
              { label: 'AVAILABILITY', weight: '15%', desc: 'Weekends, Evenings, 15h+' },
              { label: 'DOMAIN', weight: '15%', desc: 'CSE, Design, Management' },
            ].map((col) => (
              <div key={col.label} className="p-3.5 border-2 border-ink bg-white shadow-brutal-sm space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="uppercase text-ink">{col.label}</span>
                  <span className="text-brutal-red">{col.weight}</span>
                </div>
                <p className="text-[11px] text-ink/70 font-sans">{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION 03: PROTOCOL (Section 13) */}
      <section id="protocol" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="border-t-2 border-ink pt-8 space-y-5">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60">
            03 / PROTOCOL
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-ink tracking-tight">
            THE FIVE-STEP EXECUTION PROTOCOL.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
            {[
              { num: '01', title: 'CREATE', desc: 'Initialize project & define needed roles.' },
              { num: '02', title: 'DISCOVER', desc: 'Scan student directory by verified skills.' },
              { num: '03', title: 'MATCH', desc: 'Inspect calculated compatibility scores.' },
              { num: '04', title: 'CONNECT', desc: 'Send structured invitations instantly.' },
              { num: '05', title: 'BUILD', desc: 'Analyze skill gaps and ship on time.' },
            ].map((step) => (
              <div key={step.num} className="p-3.5 border-2 border-ink bg-white shadow-brutal-sm space-y-1 font-mono">
                <div className="text-xl font-display font-black text-brutal-red">{step.num}</div>
                <div className="text-xs font-display font-black text-ink uppercase tracking-wider">{step.title}</div>
                <p className="text-[11px] text-ink/70 font-sans">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SIGNATURE TEAM GAP AUDIT */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="border-2 border-ink bg-white p-5 sm:p-7 shadow-brutal space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-ink/60 uppercase tracking-widest">
                SIGNATURE DIAGNOSTIC // TEAM GAP ANALYSIS
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-ink tracking-tight">
                HEALTHCARE AI COMPANION SQUAD
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono font-bold text-ink/60 uppercase">COVERAGE STATUS</span>
              <div className="text-xl sm:text-2xl font-display font-black text-brutal-red">82% COVERAGE</div>
            </div>
          </div>

          {/* Brutalist Coverage Bar */}
          <div className="space-y-1 font-mono text-xs">
            <div className="w-full h-5 border-2 border-ink bg-canvas overflow-hidden">
              <div className="h-full bg-ink w-[82%]" />
            </div>
            <div className="flex justify-between text-[11px] text-ink/70 font-bold">
              <span>COVERED: PYTHON, RESEARCH, VIDEO</span>
              <span className="text-brutal-red font-bold">MISSING: ML, UI/UX, SPEECH</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-2 border-ink">
            <p className="text-xs text-ink/75 font-sans">
              Instant matching pinpoints students who specifically fulfill your unfilled slots.
            </p>
            <Button
              variant="accent"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/team/gap-analysis')}
            >
              [ FIND THE MISSING PIECE → ]
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
