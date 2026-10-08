import React from 'react';
import { getSkillCategory } from '../../utils/format';

const CATEGORY_COLORS = {
  Technical: 'bg-white text-ink border-2 border-ink hover:bg-signal-yellow',
  Creative: 'bg-signal-yellow/30 text-ink border-2 border-ink',
  Communication: 'bg-campus-green/20 text-ink border-2 border-ink',
  Research: 'bg-brutal-red/15 text-ink border-2 border-ink',
  Business: 'bg-canvas text-ink border-2 border-ink',
  Leadership: 'bg-signal-yellow text-ink border-2 border-ink font-bold',
  Default: 'bg-white text-ink border border-ink',
};

export { getSkillCategory };

export default function SkillBadge({
  skill,
  category,
  size = 'md',
  onRemove,
  clickable = false,
  onClick,
  className = '',
}) {
  const resolvedCategory = category || getSkillCategory(skill) || 'Default';
  const colorClass = CATEGORY_COLORS[resolvedCategory] || CATEGORY_COLORS.Default;

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 font-bold',
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-bold',
    lg: 'text-xs px-3 py-1.5 font-bold',
  };

  return (
    <span
      onClick={clickable ? onClick : undefined}
      className={`inline-flex items-center font-mono uppercase tracking-wider select-none transition-all duration-150 rounded-none
        ${colorClass}
        ${sizeClasses[size] || sizeClasses.md}
        ${clickable ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-brutal-sm' : ''}
        ${className}`}
    >
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(skill);
          }}
          className="ml-1.5 p-0.5 hover:bg-brutal-red hover:text-white text-ink/70 transition-colors"
          aria-label={`Remove ${skill}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
