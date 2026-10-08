import React from 'react';
import ProgressBar from '../ui/ProgressBar';

export default function SkillCoverage({ coverage = {}, className = '' }) {
  const categories = [
    { key: 'Technical', label: 'Technical & Engineering', variant: 'coral' },
    { key: 'Creative', label: 'Design & Visual Arts', variant: 'yellow' },
    { key: 'Communication', label: 'Communication & Pitch', variant: 'mint' },
    { key: 'Business', label: 'Business & Strategy', variant: 'yellow' },
    { key: 'Research', label: 'Research & Analysis', variant: 'coral' },
  ];

  return (
    <div className={`space-y-4 p-5 bg-white border-2 border-ink shadow-brutal font-mono ${className}`}>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <div>
          <div className="text-[10px] font-mono font-bold text-brutal-red uppercase tracking-wider">
            COVERAGE METRICS
          </div>
          <h4 className="font-display font-black text-xs text-ink uppercase tracking-wider">
            DOMAIN COMPETENCY GAUGE
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-campus-green text-ink border border-ink uppercase">
          LIVE
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {categories.map((cat) => {
          const val = coverage[cat.key] !== undefined ? coverage[cat.key] : 0;
          return (
            <div key={cat.key} className="space-y-1">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-ink">
                <span>{cat.label}</span>
                <span>{val}%</span>
              </div>
              <ProgressBar
                value={val}
                variant={cat.variant}
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
