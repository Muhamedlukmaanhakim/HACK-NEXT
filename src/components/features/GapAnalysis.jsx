import React from 'react';
import { CheckSquare, XSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import MatchScore from './MatchScore';

export default function GapAnalysis({
  requirements = [],
  teamSkills = [],
  coveragePercentage = 0,
  coveredCount = 0,
  totalCount = 0,
  className = '',
}) {
  const isFullCoverage = coveredCount === totalCount && totalCount > 0;

  return (
    <div className={`p-5 sm:p-6 rounded-none bg-retro-surface border border-retro-border space-y-5 font-mono ${className}`}>
      {/* Top Header & Coverage Gauge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-5 border-b border-retro-border">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-[10px] text-retro-muted uppercase tracking-widest">
            [ AUDIT // VECTOR_COVERAGE_MATRIX ]
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="text-lg font-display font-bold text-retro-paper tracking-wide">
              Skill Coverage Breakdown
            </h3>
            {isFullCoverage ? (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-none bg-retro-teal/20 text-retro-teal border border-retro-teal/50 uppercase">
                <ShieldCheck className="w-3.5 h-3.5" /> OPTIMAL
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-none bg-retro-amber/20 text-retro-amber border border-retro-amber/50 uppercase">
                <AlertTriangle className="w-3.5 h-3.5" /> GAPS DETECTED
              </span>
            )}
          </div>
          <p className="text-xs text-retro-muted max-w-md font-sans leading-relaxed">
            Comparing project technical and creative requirements against the collective competencies of current team members.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono uppercase tracking-wider text-retro-muted">
              METRIC STATUS
            </div>
            <div className="text-xs font-bold text-retro-paper font-mono">
              {coveredCount} / {totalCount} ROLES COVERED
            </div>
          </div>
          <MatchScore score={coveragePercentage} size="lg" />
        </div>
      </div>

      {/* Requirement Status Grid */}
      <div className="space-y-2.5">
        <div className="text-[10px] font-mono uppercase tracking-widest text-retro-muted">
          // COMPETENCY VECTOR TELEMETRY:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {requirements.map((req) => {
            const isCovered = teamSkills.some(
              (ts) => ts.toLowerCase() === req.toLowerCase()
            );

            return (
              <div
                key={req}
                className={`p-2.5 rounded-none border flex items-center justify-between transition-all ${
                  isCovered
                    ? 'bg-retro-surface-elevated/70 border-retro-teal/40 text-retro-paper'
                    : 'bg-retro-surface-elevated/70 border-retro-red/40 text-retro-paper'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCovered ? (
                    <CheckSquare className="w-3.5 h-3.5 text-retro-teal flex-shrink-0" />
                  ) : (
                    <XSquare className="w-3.5 h-3.5 text-retro-red flex-shrink-0" />
                  )}
                  <span className="text-xs font-mono font-medium">{req}</span>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 ${
                    isCovered
                      ? 'bg-retro-teal/20 text-retro-teal'
                      : 'bg-retro-red/20 text-retro-red'
                  }`}
                >
                  {isCovered ? '[COVERED]' : '[MISSING]'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
