import React from 'react';
import ProgressBar from '../ui/ProgressBar';

export default function SkillCoverage({ coverage = {}, className = '' }) {
  const categories = [
    { key: 'Technical', label: 'Technical & Engineering', variant: 'orange' },
    { key: 'Creative', label: 'Design & Visual Arts', variant: 'amber' },
    { key: 'Communication', label: 'Communication & Pitch', variant: 'teal' },
    { key: 'Business', label: 'Business & Strategy', variant: 'amber' },
    { key: 'Research', label: 'Research & Analysis', variant: 'orange' },
  ];

  return (
    <div className={`space-y-3.5 p-4 sm:p-5 rounded-none bg-retro-surface border border-retro-border font-mono ${className}`}>
      <div className="flex items-center justify-between border-b border-retro-border pb-2">
        <div>
          <div className="text-[10px] text-retro-muted uppercase tracking-widest">[ METRICS // COVERAGE ]</div>
          <h4 className="text-xs font-bold text-retro-paper tracking-wider uppercase">
            Domain Competency Gauge
          </h4>
        </div>
        <span className="text-[10px] text-retro-amber uppercase tracking-wider">● LIVE</span>
      </div>

      <div className="space-y-3 pt-1">
        {categories.map((cat) => {
          const val = coverage[cat.key] !== undefined ? coverage[cat.key] : 0;
          return (
            <div key={cat.key} className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-retro-paper/80">{cat.label}</span>
                <span className="font-bold text-retro-paper">{val}%</span>
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
