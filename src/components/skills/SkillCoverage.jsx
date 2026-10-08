import React from 'react';
import ProgressBar from '../ui/ProgressBar';

export default function SkillCoverage({ coverage = {}, className = '' }) {
  // coverage: { Technical: 85, Creative: 60, Communication: 100, Research: 40, Business: 75 }
  const categories = [
    { key: 'Technical', label: 'Technical & Engineering', variant: 'indigo' },
    { key: 'Creative', label: 'Design & Creative', variant: 'warning' },
    { key: 'Communication', label: 'Communication & Pitch', variant: 'teal' },
    { key: 'Business', label: 'Business & Marketing', variant: 'success' },
    { key: 'Research', label: 'Research & Strategy', variant: 'indigo' },
  ];

  return (
    <div className={`space-y-4 p-5 rounded-2xl bg-surface border border-surface-border ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-primary tracking-tight">
          Domain Skill Coverage
        </h4>
        <span className="text-xs text-text-muted">Dynamic Team Metrics</span>
      </div>

      <div className="space-y-3.5">
        {categories.map((cat) => {
          const val = coverage[cat.key] !== undefined ? coverage[cat.key] : 0;
          return (
            <div key={cat.key} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">{cat.label}</span>
                <span className="font-semibold text-text-primary">{val}%</span>
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
