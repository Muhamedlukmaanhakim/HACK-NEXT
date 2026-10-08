import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-canvas text-ink">
      {/* Left / Form Section */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16 border-b-2 lg:border-b-0 lg:border-r-2 border-ink bg-canvas">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b-2 border-ink pb-4 mb-8">
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-8 h-8 bg-brutal-red border-2 border-ink flex items-center justify-center text-white font-display font-extrabold text-sm shadow-brutal-sm">
              CM
            </div>
            <div className="flex flex-col font-display font-extrabold text-sm sm:text-base leading-none tracking-tight text-ink">
              <span>COLLAB</span>
              <span className="text-brutal-red">MATRIX</span>
            </div>
          </Link>
          <span className="text-[10px] font-mono font-bold border-2 border-ink px-2 py-0.5 bg-signal-yellow text-ink uppercase">
            CAMPUS ACCESS
          </span>
        </div>

        {/* Auth Outlet Form Box */}
        <div className="max-w-md w-full mx-auto my-auto py-4">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-[10px] font-mono text-ink/60 text-center lg:text-left pt-6 border-t-2 border-ink">
          COLLABMATRIX • DIGITAL BRUTALISM × EDITORIAL DESIGN • STUDENT COLLABORATION NETWORK
        </div>
      </div>

      {/* Right Editorial Manifesto Section (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-white p-12 flex-col justify-between">
        <div className="space-y-6">
          <div className="inline-block px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white bg-ink border border-ink">
            THE MANIFESTO / 01
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink uppercase tracking-tight leading-tight">
            RAW STRUCTURE.
            <br />
            <span className="text-brutal-red">HUMAN</span> CONNECTION.
          </h2>

          <p className="text-sm text-ink/80 font-sans leading-relaxed">
            Stop assembling teams from whoever happens to be around in WhatsApp groups. Connect with campus builders whose skills, commitment, and domain experience directly fulfill project requirements.
          </p>

          <div className="space-y-3 pt-4">
            {[
              { num: '01', title: 'VERIFIED SKILLS', desc: 'Discover teammates by proven technical, design, and pitch abilities.' },
              { num: '02', title: 'COMPLEMENTARY MINDS', desc: 'Pair software developers with stage orators and UX researchers.' },
              { num: '03', title: 'TEAM GAP ANALYSIS', desc: 'Audit missing competencies before entering hackathon deadlines.' },
            ].map((spec) => (
              <div key={spec.num} className="p-3.5 border-2 border-ink bg-canvas shadow-brutal-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-brutal-red">[{spec.num}]</span>
                  <h4 className="text-xs font-display font-bold text-ink uppercase tracking-wide">{spec.title}</h4>
                </div>
                <p className="text-xs text-ink/70 font-sans">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t-2 border-ink flex items-center justify-between text-[10px] font-mono font-bold text-ink/60">
          <span>PEOPLE → SKILLS</span>
          <span>PROJECTS → TEAMS</span>
        </div>
      </div>
    </div>
  );
}
