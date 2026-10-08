import React from 'react';
import { Grid, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CollaborationMatrix({
  requirements = ['Python', 'AI/ML', 'Backend', 'UI/UX', 'Public Speaking', 'Marketing'],
  members = [],
  className = '',
}) {
  return (
    <div className={`p-4 sm:p-5 rounded-none bg-retro-surface border border-retro-border font-mono shadow-panel space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-retro-border/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-sm bg-retro-surface-elevated text-retro-coral border border-retro-coral/40">
            <Grid className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-widest text-retro-muted">
              // TELEMETRY MATRIX // DOT_GRID_SYSTEM
            </div>
            <h3 className="text-xs sm:text-sm font-display font-bold text-retro-paper uppercase tracking-wider">
              COLLABORATION DOT MATRIX
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-retro-muted">
          <span className="flex items-center gap-1.5">
            <span className="text-retro-mint text-xs">●</span> COVERED
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-retro-coral text-xs">○</span> OPEN GAP
          </span>
        </div>
      </div>

      {/* Responsive Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-retro-border bg-retro-surface-elevated/60 text-[10px] text-retro-muted uppercase tracking-wider">
              <th className="py-2.5 px-3 font-semibold">Competency Vector</th>
              {members.map((member) => (
                <th key={member.id} className="py-2.5 px-3 font-semibold text-center whitespace-nowrap">
                  {member.name.split(' ')[0]}
                </th>
              ))}
              <th className="py-2.5 px-3 font-semibold text-right">Roster Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-retro-border/50">
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
                  className="hover:bg-retro-surface-elevated/40 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-retro-paper">
                    <span className="text-[10px] text-retro-muted mr-1.5 font-mono">›</span>
                    {req}
                  </td>

                  {members.map((member) => {
                    const hasSkill = (member.skills || []).some(
                      (s) => s.toLowerCase() === req.toLowerCase()
                    );
                    return (
                      <td key={member.id} className="py-2.5 px-3 text-center">
                        {hasSkill ? (
                          <span
                            className="inline-block text-retro-mint text-base leading-none select-none"
                            title={`${member.name} provides ${req}`}
                          >
                            ●
                          </span>
                        ) : (
                          <span
                            className="inline-block text-retro-muted/40 text-base leading-none select-none"
                            title={`${member.name} does not cover ${req}`}
                          >
                            ○
                          </span>
                        )}
                      </td>
                    );
                  })}

                  <td className="py-2.5 px-3 text-right">
                    {isCovered ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-none bg-retro-mint/15 text-retro-mint border border-retro-mint/40 uppercase">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        COVERED ({coveringMembers.length})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-none bg-retro-coral/15 text-retro-coral border border-retro-coral/40 uppercase">
                        <AlertCircle className="w-2.5 h-2.5" />
                        OPEN GAP
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-retro-border/60 text-[10px] text-retro-muted flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>[ SCAN // MATRIX_DENSITY: {requirements.length} REQUIRED VECTORS ]</span>
        <span className="text-retro-amber font-mono">PUNCH-CARD VERIFIED TELEMETRY</span>
      </div>
    </div>
  );
}
