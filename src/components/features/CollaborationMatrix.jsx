import React from 'react';
import { Grid, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CollaborationMatrix({
  requirements = ['Python', 'AI/ML', 'Backend', 'UI/UX', 'Public Speaking', 'Marketing'],
  members = [],
  className = '',
}) {
  return (
    <div className={`p-6 bg-white border-2 border-ink shadow-brutal space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-ink stroke-[2.5]" />
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">
              PUNCH-CARD MATRIX // COLLABORATION GRID
            </div>
            <h3 className="font-display font-black text-base text-ink uppercase tracking-tight">
              TEAM COMPETENCY DOT MATRIX
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono font-bold text-ink">
          <span className="flex items-center gap-1.5">
            <span className="text-campus-green text-lg leading-none">●</span> PRESENT
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-brutal-red text-lg leading-none">○</span> MISSING GAP
          </span>
        </div>
      </div>

      {/* Responsive Matrix Table */}
      <div className="overflow-x-auto border-2 border-ink">
        <table className="w-full text-left text-xs font-mono border-collapse bg-white">
          <thead>
            <tr className="border-b-2 border-ink bg-canvas text-[11px] font-bold text-ink uppercase">
              <th className="py-3 px-4">REQUIRED COMPETENCY</th>
              {members.map((member) => (
                <th key={member.id} className="py-3 px-3 text-center whitespace-nowrap">
                  {member.name.split(' ')[0].toUpperCase()}
                </th>
              ))}
              <th className="py-3 px-4 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink">
            {requirements.map((req) => {
              const coveringMembers = members.filter((m) =>
                (m.skills || []).some(
                  (s) => s.toLowerCase() === req.toLowerCase()
                )
              );
              const isCovered = coveringMembers.length > 0;

              return (
                <tr
                  key={req}
                  className={`transition-colors ${
                    isCovered ? 'hover:bg-canvas' : 'bg-brutal-red/10'
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-ink uppercase">
                    <span className="text-ink/60 mr-2 font-mono">›</span>
                    {req}
                  </td>

                  {members.map((member) => {
                    const hasSkill = (member.skills || []).some(
                      (s) => s.toLowerCase() === req.toLowerCase()
                    );
                    return (
                      <td key={member.id} className="py-3 px-3 text-center text-lg leading-none">
                        {hasSkill ? (
                          <span
                            className="inline-block text-campus-green font-bold select-none"
                            title={`${member.name} covers ${req}`}
                          >
                            ●
                          </span>
                        ) : (
                          <span
                            className="inline-block text-ink/30 select-none"
                            title={`${member.name} does not cover ${req}`}
                          >
                            ○
                          </span>
                        )}
                      </td>
                    );
                  })}

                  <td className="py-3 px-4 text-right">
                    {isCovered ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-campus-green text-ink border border-ink uppercase">
                        <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                        COVERED ({coveringMembers.length})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-brutal-red text-white border border-ink uppercase animate-pulse">
                        <AlertCircle className="w-3 h-3 stroke-[2.5]" />
                        CRITICAL GAP
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono font-bold text-ink/70">
        <span>MATRIX DENSITY: {requirements.length} VECTORS EVALUATED</span>
        <span className="uppercase text-ink">SYSTEM STATUS: OPTIMIZING</span>
      </div>
    </div>
  );
}
