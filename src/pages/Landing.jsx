import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Check, AlertCircle, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import SkillBadge from '../components/skills/SkillBadge';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 sm:space-y-32 pt-20 pb-20 overflow-hidden font-sans bg-canvas text-ink">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
        <div className="border-b-2 border-ink pb-6 mb-8 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink bg-white border-2 border-ink px-2.5 py-1 shadow-brutal-sm">
            CAMPUS COLLABORATION NETWORK / 01
          </span>
          <span className="text-xs font-mono text-ink/70 hidden sm:inline font-bold">
            FOR HACKATHONS • RESEARCH • STARTUPS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold uppercase tracking-tight leading-[0.92] text-ink">
              FIND<br />
              <span className="text-brutal-red">YOUR</span><br />
              PEOPLE.
            </h1>

            <p className="text-base sm:text-xl text-ink/80 font-sans max-w-xl leading-relaxed">
              Stop building teams from whoever happens to be around in WhatsApp groups. Find people with the skills your project actually needs.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              >
                [ FIND MY TEAM → ]
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/discover/opportunities')}
              >
                [ EXPLORE PROJECTS ]
              </Button>
            </div>
          </div>

          {/* Geometric Formula Area: PEOPLE + SKILLS + PROJECTS = TEAMS */}
          <div className="lg:col-span-5 border-2 border-ink bg-white p-5 sm:p-6 shadow-brutal space-y-4">
            <div className="flex items-center justify-between text-xs font-mono font-bold border-b-2 border-ink pb-2">
              <span>COLLABORATION FORMULA</span>
              <span className="text-brutal-red font-bold">100% RAW</span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 border-2 border-ink bg-canvas flex items-center justify-between">
                <span className="font-bold text-ink uppercase">01 / PEOPLE</span>
                <span className="text-ink/60">Cross-department creators</span>
              </div>
              <div className="text-center font-display font-extrabold text-base text-ink">+</div>
              <div className="p-3 border-2 border-ink bg-canvas flex items-center justify-between">
                <span className="font-bold text-ink uppercase">02 / SKILLS</span>
                <span className="text-ink/60">UI/UX, Backend, Stage Pitch</span>
              </div>
              <div className="text-center font-display font-extrabold text-base text-ink">+</div>
              <div className="p-3 border-2 border-ink bg-canvas flex items-center justify-between">
                <span className="font-bold text-ink uppercase">03 / PROJECTS</span>
                <span className="text-ink/60">Clear goals & commitments</span>
              </div>
              <div className="text-center font-display font-extrabold text-base text-ink">=</div>
              <div className="p-3.5 border-2 border-ink bg-signal-yellow text-ink shadow-brutal-sm flex items-center justify-between">
                <span className="font-display font-bold uppercase text-sm">BALANCED TEAMS</span>
                <span className="font-mono text-xs font-bold text-ink bg-white px-2 py-0.5 border border-ink">94% MATCH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 01: THE PROBLEM */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t-2 border-ink pt-8 space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60">
            01 / THE PROBLEM
          </div>

          <div className="max-w-4xl space-y-3">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold uppercase text-ink tracking-tight leading-tight">
              "GOOD IDEAS DON'T FAIL BECAUSE PEOPLE AREN'T TALENTED."
            </h2>
            <h3 className="text-xl sm:text-3xl font-display font-extrabold uppercase text-brutal-red tracking-tight leading-tight">
              "THEY FAIL BECAUSE THE RIGHT PEOPLE NEVER FOUND EACH OTHER."
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {[
              { num: '01', title: 'CHAT SILOS', desc: 'Hackathon requests get drowned in massive unorganized college groups.' },
              { num: '02', title: 'SAME-DISCIPLINE TRAP', desc: 'Coders team up only with coders; nobody designs or presents the pitch.' },
              { num: '03', title: 'HIDDEN CAMPUS TALENT', desc: 'Brilliant student designers in adjacent blocks remain invisible.' },
              { num: '04', title: 'LAST-MINUTE CHAOS', desc: 'Squads assemble 2 hours before the deadline with random skill overlaps.' },
            ].map((p) => (
              <div key={p.num} className="p-4 border-2 border-ink bg-white shadow-brutal-sm space-y-2">
                <span className="text-xs font-mono font-bold text-brutal-red">[{p.num}]</span>
                <h4 className="text-sm font-display font-bold text-ink uppercase">{p.title}</h4>
                <p className="text-xs text-ink/75 font-sans">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION 02: THE SOLUTION */}
      <section id="solution" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t-2 border-ink pt-8 space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60">
            02 / THE SOLUTION
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-ink tracking-tight">
              COLLAB<span className="text-brutal-red">MATRIX.</span>
            </h2>
            <p className="text-sm font-mono text-ink/80 max-w-md">
              Find students based on structured compatibility factors rather than social randomness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
            {[
              { label: 'SKILLS', desc: 'Technical, visual design, and oral presentation competencies.' },
              { label: 'INTERESTS', desc: 'Healthcare, fintech, web3, AI, and creative technology domains.' },
              { label: 'AVAILABILITY', desc: 'Weekend sprints, evening hack sessions, and 10+ hrs/wk.' },
              { label: 'EXPERIENCE', desc: 'Hackathon champions, beginners, and production builders.' },
              { label: 'DOMAIN', desc: 'Computer science, mechanical, design school, business cohorts.' },
            ].map((col, idx) => (
              <div key={col.label} className="p-4 border-2 border-ink bg-canvas hover:bg-white transition-all shadow-brutal-sm">
                <span className="text-[10px] font-mono font-bold text-ink/50">0{idx + 1}</span>
                <h3 className="text-sm font-display font-extrabold text-ink uppercase tracking-wide mt-1 mb-1">{col.label}</h3>
                <p className="text-xs text-ink/70 font-sans leading-relaxed">{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION 03: HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t-2 border-ink pt-8 space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60">
            03 / HOW IT WORKS
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-ink tracking-tight">
            THE FIVE-STEP TEAM PROTOCOL.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {[
              { num: '01', title: 'CREATE', desc: 'Publish your hackathon project manifesto and required skills.' },
              { num: '02', title: 'DISCOVER', desc: 'Scan the campus student directory filtered by proven capabilities.' },
              { num: '03', title: 'MATCH', desc: 'Inspect 94% compatibility scores with clear metric breakdown.' },
              { num: '04', title: 'CONNECT', desc: 'Transmit direct collaboration requests without awkward chat DMs.' },
              { num: '05', title: 'BUILD', desc: 'Audit team skill gaps and ship your complete submission.' },
            ].map((step) => (
              <div key={step.num} className="p-4 border-2 border-ink bg-white shadow-brutal space-y-2">
                <div className="text-2xl font-display font-extrabold text-brutal-red">{step.num}</div>
                <h4 className="text-sm font-display font-extrabold text-ink uppercase tracking-wider">{step.title}</h4>
                <p className="text-xs text-ink/75 font-sans">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION 04: TEAM GAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-2 border-ink bg-white p-6 sm:p-10 shadow-brutal space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-ink/60 uppercase tracking-widest">
                04 / SIGNATURE FEATURE // TEAM GAP ANALYSIS
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-ink tracking-tight mt-1">
                AUDIT YOUR SQUAD BEFORE THE DEADLINE.
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-ink uppercase">YOUR TEAM</span>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-brutal-red">82% COMPLETE</div>
            </div>
          </div>

          {/* Brutalist Coverage Bar */}
          <div className="space-y-1.5 font-mono">
            <div className="w-full h-6 border-2 border-ink bg-canvas relative overflow-hidden">
              <div className="h-full bg-ink w-[82%]" />
            </div>
            <div className="flex justify-between text-xs text-ink/70">
              <span>COVERED: PYTHON, BACKEND, SYSTEM DESIGN</span>
              <span>82% FULFILLED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { num: '01', role: 'UI / UX DESIGN', note: 'Figma prototypes & design system' },
              { num: '02', role: 'MACHINE LEARNING', note: 'Model evaluation & fine-tuning' },
              { num: '03', role: 'PUBLIC SPEAKING', note: 'Final jury pitch deck narration' },
            ].map((gap) => (
              <div key={gap.num} className="p-3 border-2 border-ink bg-canvas space-y-1">
                <span className="text-[10px] font-mono font-bold text-brutal-red">MISSING // {gap.num}</span>
                <p className="text-xs font-display font-bold text-ink uppercase">{gap.role}</p>
                <p className="text-[11px] text-ink/60 font-sans">{gap.note}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-2 border-ink">
            <p className="text-xs text-ink/75 font-sans">
              CollabMatrix scans campus candidates whose skills fit these exact empty slots.
            </p>
            <Button
              variant="accent"
              size="md"
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
