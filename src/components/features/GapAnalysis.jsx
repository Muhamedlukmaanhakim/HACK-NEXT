import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import SkillBadge from '../skills/SkillBadge';
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
    <div className={`p-6 rounded-2xl bg-surface border border-surface-border space-y-6 ${className}`}>
      {/* Top Header & Coverage Gauge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-surface-border">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="text-lg font-bold text-text-primary tracking-tight">
              Skill Coverage Breakdown
            </h3>
            {isFullCoverage ? (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-status-success/15 text-status-success border border-status-success/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Optimal
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-status-warning/15 text-status-warning border border-status-warning/30">
                <AlertTriangle className="w-3.5 h-3.5" /> Gaps Detected
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary max-w-md">
            Comparing project technical and creative requirements against the collective competencies of current team members.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Covered
            </div>
            <div className="text-sm font-bold text-text-primary">
              {coveredCount} of {totalCount} Skills
            </div>
          </div>
          <MatchScore score={coveragePercentage} size="lg" />
        </div>
      </div>

      {/* Requirement Status Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Required Competency Status
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {requirements.map((req) => {
            const isCovered = teamSkills.some(
              (ts) => ts.toLowerCase() === req.toLowerCase()
            );

            return (
              <div
                key={req}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isCovered
                    ? 'bg-status-success/5 border-status-success/20 text-text-primary'
                    : 'bg-status-danger/5 border-status-danger/25 text-text-primary'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isCovered ? (
                    <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-status-danger flex-shrink-0" />
                  )}
                  <span className="text-xs font-medium">{req}</span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isCovered
                      ? 'bg-status-success/15 text-status-success'
                      : 'bg-status-danger/15 text-status-danger'
                  }`}
                >
                  {isCovered ? 'Covered' : 'Missing'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
