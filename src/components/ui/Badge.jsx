import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  onRemove,
  ...props
}) {
  const variants = {
    default: 'bg-surface-elevated text-paper-dim border-surface-border',
    primary: 'bg-accent-orange/15 text-accent-orange border-accent-orange/35',
    secondary: 'bg-accent-amber/15 text-accent-amber border-accent-amber/35',
    teal: 'bg-accent-teal/15 text-accent-teal border-accent-teal/35',
    success: 'bg-accent-teal/15 text-accent-teal border-accent-teal/35',
    warning: 'bg-accent-amber/15 text-accent-amber border-accent-amber/35',
    danger: 'bg-accent-red/15 text-accent-red border-accent-red/35',
    outline: 'bg-transparent text-paper-dim border-surface-border hover:border-accent-orange/50',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-mono uppercase tracking-wider',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5 font-mono uppercase tracking-wider',
    lg: 'text-xs px-3 py-1 gap-2 font-mono uppercase tracking-wider',
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span
      className={`inline-flex items-center rounded-sm border select-none transition-colors ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 -mr-0.5 p-0.5 hover:bg-white/10 text-text-muted hover:text-paper transition-colors"
          aria-label="Remove item"
        >
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
