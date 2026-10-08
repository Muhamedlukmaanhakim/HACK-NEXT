import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Sparkles, PieChart, Inbox, Award, ArrowRight,
  CheckCircle2, Share2, MessageSquare, AlertCircle, Cpu, Palette, Mic, BookOpen,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import SkillBadge from '../components/skills/SkillBadge';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 sm:space-y-32 pt-24 pb-16 overflow-hidden">
      {/* 1. Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-indigo/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-surface-border text-xs font-semibold text-accent-teal shadow-soft">
            <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
            <span>CollabMatrix Campus Platform</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.1]">
            Find the right people. <br />
            <span className="bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-teal bg-clip-text text-transparent">
              Build the right team.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Turn ideas into teams. Discover students whose skills, interests and strengths complete what your project needs. For hackathons, research, startups, and creative productions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')} className="w-full sm:w-auto">
              Get Started
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate(isAuthenticated ? '/discover/students' : '/login')} className="w-full sm:w-auto">
              Explore Collaborators
            </Button>
          </div>
        </div>

        {/* Hero Visual: Student Avatar Network */}
        <div className="relative mt-14 max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-surface/60 border border-surface-border shadow-elevated overflow-hidden">
          <div className="relative h-64 sm:h-72 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full stroke-surface-border" strokeWidth="1.5" strokeDasharray="4 4">
              <line x1="20%" y1="25%" x2="50%" y2="50%" />
              <line x1="80%" y1="20%" x2="50%" y2="50%" />
              <line x1="25%" y1="75%" x2="50%" y2="50%" />
              <line x1="75%" y1="80%" x2="50%" y2="50%" />
            </svg>
            <div className="relative z-20 flex flex-col items-center p-3.5 rounded-2xl bg-surface-elevated border border-accent-indigo/40 shadow-glow-indigo">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white mb-2 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-text-primary">AI Innovation Project</span>
              <span className="text-[10px] text-accent-teal font-medium">94% Team Match</span>
            </div>
            {[
              { pos: 'top-4 left-1/4 -translate-x-1/2', name: 'Sarah Rahman', label: 'Sarah R.', skill: 'UI/UX' },
              { pos: 'top-4 right-1/4 translate-x-1/2', name: 'Rahul Kumar', label: 'Rahul K.', skill: 'Backend' },
              { pos: 'bottom-6 left-1/4 -translate-x-1/2', name: 'Meera Nair', label: 'Meera N.', skill: 'Public Speaking' },
              { pos: 'bottom-6 right-1/4 translate-x-1/2', name: 'Aisha Khan', label: 'Aisha K.', skill: 'Marketing' },
            ].map((node) => (
              <div key={node.name} className={`absolute ${node.pos} flex items-center gap-2 p-2 rounded-xl bg-surface-elevated/90 border border-surface-border text-left shadow-sm`}>
                <Avatar name={node.name} size="sm" />
                <div>
                  <p className="text-xs font-semibold text-text-primary">{node.label}</p>
                  <SkillBadge skill={node.skill} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Problem */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase text-status-danger px-3 py-1 rounded-full bg-status-danger/10 border border-status-danger/20">The Campus Friction</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary">Great ideas don’t fail because of a lack of talent.</h2>
          <p className="text-sm text-text-secondary">They fail because the right people never find each other.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'WhatsApp Groups', desc: 'Buried in noisy chat feeds.', icon: MessageSquare },
            { title: 'Immediate Friends', desc: 'Limited to the same skill circle.', icon: Users },
            { title: 'Class Groups', desc: 'Siloed by department barriers.', icon: Share2 },
            { title: 'Personal Networks', desc: 'Rarely reaches outside circles.', icon: Award },
            { title: 'Random Messages', desc: 'Zero verification of real skill.', icon: AlertCircle },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-2xl bg-surface border border-surface-border/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-surface-elevated flex items-center justify-center text-status-danger border border-surface-border">
                <item.icon className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-text-primary">{item.title}</h4>
              <p className="text-xs text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Solution */}
      <section id="solution" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase text-accent-indigo px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20">The CollabMatrix Flow</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary">How CollabMatrix Powers Teams</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            { step: '01', title: 'Discover', desc: 'Filter campus students by verified technical, creative, and pitch competencies.' },
            { step: '02', title: 'Match', desc: 'AI analyzes project requirements and ranks students by skill, domain, and availability.' },
            { step: '03', title: 'Connect', desc: 'Send targeted collaboration requests with mutual project previews and direct alerts.' },
            { step: '04', title: 'Build', desc: 'Track team skill gap coverage and invite missing specialists to achieve 100% readiness.' },
          ].map((s) => (
            <div key={s.step} className="p-5 rounded-2xl bg-surface border border-surface-border group hover:border-accent-indigo/40 transition-all">
              <span className="text-3xl font-black text-surface-hover group-hover:text-accent-indigo/30 transition-colors">{s.step}</span>
              <h3 className="text-base font-bold text-text-primary mt-1 mb-1">{s.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase text-accent-teal px-3 py-1 rounded-full bg-accent-teal/10 border border-accent-teal/20">Platform Capabilities</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary">Engineered for High-Velocity Building</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: 'Smart Student Discovery', desc: 'Debounced search and multi-facet filtering across departments and proficiencies.', icon: Users },
            { title: 'AI Requirement Analysis', desc: 'Natural language parsing transforms project prompts into structured requirements.', icon: Sparkles },
            { title: 'Skill-Based Matching', desc: 'Multi-factor compatibility calculation weighting skill, domain, and availability.', icon: CheckCircle2 },
            { title: 'Team Gap Analysis', desc: 'Dynamic radar and coverage analysis identifying missing skills for project success.', icon: PieChart },
            { title: 'Collaboration Requests', desc: 'Structured incoming and outgoing request dashboards with one-click acceptance.', icon: Inbox },
            { title: 'Student Talent Profiles', desc: 'Portfolio-first student profiles displaying real projects, proficiencies, and hours.', icon: Award },
          ].map((f) => (
            <div key={f.title} className="p-5 rounded-2xl bg-surface border border-surface-border hover:border-surface-border-hover transition-all space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-surface-elevated text-accent-indigo border border-surface-border flex items-center justify-center">
                <f.icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">{f.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Ecosystem */}
      <section id="ecosystem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-surface/80 border border-surface-border">
          <h3 className="text-xl font-bold text-text-primary mb-2">Cross-Disciplinary Talent Ecosystem</h3>
          <p className="text-xs text-text-secondary mb-6">Bridges software engineers, visual designers, speakers, strategists, and researchers.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2"><div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase"><Cpu className="w-4 h-4" /> Technical</div><div className="flex flex-wrap gap-1.5">{['Python', 'React', 'AI/ML', 'Backend', 'Data Science'].map((s) => <SkillBadge key={s} skill={s} size="sm" />)}</div></div>
            <div className="space-y-2"><div className="flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase"><Palette className="w-4 h-4" /> Creative</div><div className="flex flex-wrap gap-1.5">{['UI/UX', 'Figma', 'Graphic Design', 'Video Editing'].map((s) => <SkillBadge key={s} skill={s} size="sm" />)}</div></div>
            <div className="space-y-2"><div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase"><Mic className="w-4 h-4" /> Pitch & Speech</div><div className="flex flex-wrap gap-1.5">{['Public Speaking', 'Presentation', 'Storytelling'].map((s) => <SkillBadge key={s} skill={s} size="sm" />)}</div></div>
            <div className="space-y-2"><div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase"><BookOpen className="w-4 h-4" /> Strategy</div><div className="flex flex-wrap gap-1.5">{['Research', 'Data Analysis', 'Marketing', 'Leadership'].map((s) => <SkillBadge key={s} skill={s} size="sm" />)}</div></div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-br from-surface-elevated via-surface to-surface-elevated border border-accent-indigo/30 shadow-glow-indigo space-y-4">
          <h2 className="text-3xl font-extrabold text-text-primary">Your next teammate is already on campus.</h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">Build your hackathon squad, research group, or startup team today.</p>
          <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}>
            Build Your Team
          </Button>
        </div>
      </section>
    </div>
  );
}
