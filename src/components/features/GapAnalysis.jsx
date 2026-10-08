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
  const missingCount = Math.max(0, totalCount - coveredCount);

  return (
    <div className={`p-6 bg-white border-2 border-ink shadow-brutal space-y-6 ${className}`}>
      {/* Top Header & Coverage Gauge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-ink">
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">
            AUDIT // SKILL GAP DIAGNOSTICS
          </div>
          <div className="flex items-center gap-3">
            <h3 className="font-display font-black text-2xl text-ink uppercase tracking-tight">
              TEAM COVERAGE METER
            </h3>
            {isFullCoverage ? (
              <span className="flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 bg-campus-green text-ink border border-ink uppercase">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" /> 100% COMPLETE
              </span>
            ) : (
              <span className="flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 bg-signal-yellow text-ink border border-ink uppercase">
                <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" /> {missingCount} GAPS DETECTED
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-ink/70 font-semibold uppercase">
            {coveredCount} SKILLS COVERED · {missingCount} CRITICAL GAPS
          </p>
        </div>

        <div className="flex items-center gap-4 self-center sm:self-auto">
          <div className="text-right">
            <div className="text-4xl sm:text-5xl font-display font-black text-ink leading-none">
              {Math.round(coveragePercentage)}%
            </div>
            <div className="text-[10px] font-mono font-bold uppercase text-ink/60 mt-1">
              ROSTER COVERAGE
            </div>
          </div>
          <MatchScore score={coveragePercentage} size="lg" />
        </div>
      </div>

      {/* Requirement Status Grid */}
      <div className="space-y-3">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
          REQUIRED ROSTER COMPETENCIES:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {requirements.map((req) => {
            const isCovered = teamSkills.some(
              (ts) => ts.toLowerCase() === req.toLowerCase()
            );

            return (
              <div
                key={req}
                className={`p-3 border-2 border-ink flex items-center justify-between transition-all ${
                  isCovered ? 'bg-canvas' : 'bg-brutal-red/10 border-brutal-red'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCovered ? (
                    <CheckSquare className="w-4 h-4 text-campus-green stroke-[2.5] flex-shrink-0" />
                  ) : (
                    <XSquare className="w-4 h-4 text-brutal-red stroke-[2.5] flex-shrink-0" />
                  )}
                  <span className="text-xs font-mono font-bold text-ink uppercase">{req}</span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 border border-ink ${
                    isCovered
                      ? 'bg-campus-green text-ink'
                      : 'bg-brutal-red text-white'
                  }`}
                >
                  {isCovered ? 'COVERED' : 'GAP'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
