import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Terminal, PieChart, Inbox, Award, ArrowRight,
  CheckSquare, Share2, MessageSquare, AlertCircle, Cpu, Palette, Mic, BookOpen,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import SkillBadge from '../components/skills/SkillBadge';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-20 sm:space-y-28 pt-20 pb-16 overflow-hidden font-mono">
      {/* 1. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 text-center">
        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-retro-surface border border-retro-border text-xs text-retro-amber shadow-panel">
            <span className="w-1.5 h-1.5 rounded-full bg-retro-amber animate-pulse" />
            <span>[ SYS // TELEMETRY NETWORK ACTIVE ]</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-retro-paper leading-[1.1] uppercase">
            FIND THE PEOPLE <br />
            <span className="text-retro-orange">
              BEHIND THE POSSIBILITY.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-retro-paper/75 font-sans max-w-2xl mx-auto leading-relaxed">
            A high-precision campus collaboration grid. Connecting technical builders, visual designers, and communicators through multi-variable telemetry and requirement matching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              className="w-full sm:w-auto"
            >
              Enter Network
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(isAuthenticated ? '/discover/students' : '/login')}
              className="w-full sm:w-auto"
            >
              Inspect Collaborators
            </Button>
          </div>
        </div>

        {/* Hero Visual: Retro Scientific Instrument Schematic */}
        <div className="relative mt-12 max-w-4xl mx-auto p-4 sm:p-8 rounded-none bg-retro-surface border border-retro-border-strong shadow-terminal overflow-hidden">
          {/* Schematic Telemetry Header */}
          <div className="flex items-center justify-between text-[10px] text-retro-muted border-b border-retro-border/60 pb-2 mb-6">
            <span>[ SCHEMATIC // VECTOR_GRAPH_01 ]</span>
            <span className="text-retro-amber">FREQ: 1420 MHZ // SIGNAL: 94%</span>
          </div>

          <div className="relative h-64 sm:h-72 flex items-center justify-center">
            {/* SVG Vector Circuit Lines */}
            <svg className="absolute inset-0 w-full h-full stroke-retro-border-strong" strokeWidth="1.5" strokeDasharray="3 3">
              <line x1="20%" y1="25%" x2="50%" y2="50%" />
              <line x1="80%" y1="20%" x2="50%" y2="50%" />
              <line x1="22%" y1="78%" x2="50%" y2="50%" />
              <line x1="78%" y1="80%" x2="50%" y2="50%" />
            </svg>

            {/* Central Node: AI Innovation Project */}
            <div className="relative z-20 flex flex-col items-center p-3.5 bg-retro-surface-elevated border border-retro-orange shadow-panel">
              <div className="w-9 h-9 rounded-none bg-retro-surface border border-retro-orange flex items-center justify-center text-retro-orange mb-1.5">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-retro-paper">AI Innovation Project</span>
              <span className="text-[10px] text-retro-teal font-bold uppercase tracking-wider">94% Team Match</span>
            </div>

            {/* Surrounding Nodes */}
            {[
              { pos: 'top-2 left-1/4 -translate-x-1/2', name: 'Sarah Rahman', label: 'Sarah R.', skill: 'UI/UX', tag: 'DESIGN' },
              { pos: 'top-2 right-1/4 translate-x-1/2', name: 'Rahul Kumar', label: 'Rahul K.', skill: 'Backend', tag: 'CORE' },
              { pos: 'bottom-4 left-1/4 -translate-x-1/2', name: 'Meera Nair', label: 'Meera N.', skill: 'Public Speaking', tag: 'PITCH' },
              { pos: 'bottom-4 right-1/4 translate-x-1/2', name: 'Aisha Khan', label: 'Aisha K.', skill: 'Marketing', tag: 'GROWTH' },
            ].map((node) => (
              <div key={node.name} className={`absolute ${node.pos} flex items-center gap-2 p-2 bg-retro-surface border border-retro-border text-left shadow-panel`}>
                <Avatar name={node.name} size="sm" />
                <div>
                  <div className="text-[8px] text-retro-muted uppercase">[{node.tag}]</div>
                  <p className="text-xs font-bold text-retro-paper">{node.label}</p>
                  <SkillBadge skill={node.skill} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Problem: The Campus Friction */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-2 mb-8">
          <span className="text-[10px] font-bold uppercase text-retro-red px-2.5 py-0.5 bg-retro-red/10 border border-retro-red/30">
            [ DIAGNOSTIC // CAMPUS_FRICTION ]
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-retro-paper uppercase tracking-tight">
            THE TALENT EXISTS. THE CONNECTION DOESN'T.
          </h2>
          <p className="text-xs sm:text-sm text-retro-muted font-sans">
            Exceptional projects stumble when team formation depends on arbitrary social chat feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            { code: '01', title: 'Chat Feeds', desc: 'Lost in noisy message channels.', icon: MessageSquare },
            { code: '02', title: 'Immediate Peers', desc: 'Confined to identical disciplines.', icon: Users },
            { code: '03', title: 'Department Silos', desc: 'Zero visibility across faculties.', icon: Share2 },
            { code: '04', title: 'Personal Networks', desc: 'Excludes complementary creators.', icon: Award },
            { code: '05', title: 'Unverified Claims', desc: 'No calibrated competency data.', icon: AlertCircle },
          ].map((item) => (
            <div key={item.title} className="p-3.5 rounded-none bg-retro-surface border border-retro-border space-y-1.5 shadow-panel">
              <div className="flex items-center justify-between text-retro-muted text-[10px]">
                <span>// ERR_{item.code}</span>
                <item.icon className="w-3.5 h-3.5 text-retro-red" />
              </div>
              <h4 className="text-xs font-bold text-retro-paper uppercase">{item.title}</h4>
              <p className="text-xs text-retro-muted font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The System Architecture */}
      <section id="solution" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-2 mb-8">
          <span className="text-[10px] font-bold uppercase text-retro-orange px-2.5 py-0.5 bg-retro-orange/10 border border-retro-orange/30">
            [ PROTOCOL // COLLABORATION_PIPELINE ]
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-retro-paper uppercase tracking-tight">
            HOW COLLABMATRIX POWERS TEAMS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'DISCOVER', desc: 'Filter campus students by verified technical, creative, and pitch competencies.' },
            { step: '02', title: 'MATCH', desc: 'Simulate requirements and rank candidates by skills, domain alignment, and available hours.' },
            { step: '03', title: 'CONNECT', desc: 'Dispatch structured collaboration invitations with explicit project context.' },
            { step: '04', title: 'BUILD', desc: 'Run live Team Gap Analysis to locate missing disciplines and achieve 100% readiness.' },
          ].map((s) => (
            <div key={s.step} className="p-4 rounded-none bg-retro-surface border border-retro-border hover:border-retro-orange transition-colors shadow-panel space-y-2">
              <div className="text-xl font-display font-black text-retro-orange">
                // {s.step}
              </div>
              <h3 className="text-sm font-bold text-retro-paper tracking-wider uppercase">{s.title}</h3>
              <p className="text-xs text-retro-muted font-sans leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features & Capabilities */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-2 mb-8">
          <span className="text-[10px] font-bold uppercase text-retro-teal px-2.5 py-0.5 bg-retro-teal/10 border border-retro-teal/30">
            [ TELEMETRY // SYSTEM_CAPABILITIES ]
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-retro-paper uppercase tracking-tight">
            ENGINEERED FOR PRECISE TEAM FORMATION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Student Discovery Grid', desc: 'Debounced search and multi-facet filtering across departments and proficiencies.', icon: Users },
            { title: 'Requirement Simulation', desc: 'Natural language parsing transforms project prompts into structured requirements.', icon: Terminal },
            { title: 'Multi-Factor Matching', desc: 'Compatibility calculation weighting skill (50%), domain (20%), and hours (15%).', icon: CheckSquare },
            { title: 'Team Gap Analysis', desc: 'Dynamic radar and coverage analysis identifying missing skills for project success.', icon: PieChart },
            { title: 'Request Dispatch', desc: 'Structured incoming and outgoing request dashboards with one-click acceptance.', icon: Inbox },
            { title: 'Talent Profiles', desc: 'Portfolio-first student dossiers displaying verified competencies and availability.', icon: Award },
          ].map((f) => (
            <div key={f.title} className="p-4 rounded-none bg-retro-surface border border-retro-border hover:border-retro-amber transition-colors shadow-panel space-y-2">
              <div className="w-8 h-8 rounded-none bg-retro-surface-elevated text-retro-amber border border-retro-border flex items-center justify-center">
                <f.icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-retro-paper tracking-wider uppercase">{f.title}</h3>
              <p className="text-xs text-retro-muted font-sans leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Ecosystem: Constellation Matrix */}
      <section id="ecosystem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-none bg-retro-surface border border-retro-border-strong shadow-terminal">
          <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">[ CONSTELLATION // MATRIX ]</div>
          <h3 className="text-lg font-display font-bold text-retro-paper uppercase mb-2">
            CROSS-DISCIPLINARY TALENT CONSTELLATION
          </h3>
          <p className="text-xs text-retro-muted font-sans mb-6">
            Bridges software engineers, visual designers, speakers, strategists, and researchers into unified project crews.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-retro-surface-elevated border border-retro-border space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-retro-orange uppercase">
                <Cpu className="w-3.5 h-3.5" /> Technical
              </div>
              <div className="flex flex-wrap gap-1">
                {['Python', 'React', 'AI/ML', 'Backend', 'Data Science'].map((s) => (
                  <SkillBadge key={s} skill={s} size="xs" />
                ))}
              </div>
            </div>

            <div className="p-3 bg-retro-surface-elevated border border-retro-border space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-retro-amber uppercase">
                <Palette className="w-3.5 h-3.5" /> Creative
              </div>
              <div className="flex flex-wrap gap-1">
                {['UI/UX', 'Figma', 'Graphic Design', 'Video Editing'].map((s) => (
                  <SkillBadge key={s} skill={s} size="xs" />
                ))}
              </div>
            </div>

            <div className="p-3 bg-retro-surface-elevated border border-retro-border space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-retro-teal uppercase">
                <Mic className="w-3.5 h-3.5" /> Communication
              </div>
              <div className="flex flex-wrap gap-1">
                {['Public Speaking', 'Presentation', 'Pitch Deck'].map((s) => (
                  <SkillBadge key={s} skill={s} size="xs" />
                ))}
              </div>
            </div>

            <div className="p-3 bg-retro-surface-elevated border border-retro-border space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-retro-paper uppercase">
                <BookOpen className="w-3.5 h-3.5" /> Strategy
              </div>
              <div className="flex flex-wrap gap-1">
                {['Marketing', 'Product Management', 'Research'].map((s) => (
                  <SkillBadge key={s} skill={s} size="xs" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
