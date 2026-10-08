import React from 'react';
import { getSkillCategory } from '../../utils/format';

/**
 * Retro-futuristic skill category color map
 */
const CATEGORY_COLORS = {
  Technical: 'bg-accent-orange/15 text-accent-orange border-accent-orange/35 hover:border-accent-orange/60',
  Creative: 'bg-accent-amber/15 text-accent-amber border-accent-amber/35 hover:border-accent-amber/60',
  Communication: 'bg-accent-teal/15 text-accent-teal border-accent-teal/35 hover:border-accent-teal/60',
  Research: 'bg-accent-red/15 text-accent-red border-accent-red/35 hover:border-accent-red/60',
  Business: 'bg-amber-600/15 text-amber-300 border-amber-600/35 hover:border-amber-600/60',
  Leadership: 'bg-orange-700/15 text-orange-300 border-orange-700/35 hover:border-orange-700/60',
  Default: 'bg-surface-elevated text-paper-dim border-surface-border',
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
    xs: 'text-[9px] px-1.5 py-0.5 gap-1',
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2',
  };

  return (
    <span
      onClick={clickable ? onClick : undefined}
      className={`inline-flex items-center font-mono uppercase tracking-wider rounded-sm border select-none transition-all duration-150
        ${colorClass}
        ${sizeClasses[size] || sizeClasses.md}
        ${clickable ? 'cursor-pointer active:translate-y-0.5' : ''}
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
          className="ml-1 -mr-0.5 p-0.5 hover:bg-white/10 rounded-none text-text-muted hover:text-paper transition-colors"
          aria-label={`Remove ${skill}`}
        >
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
