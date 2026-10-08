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
    default: 'bg-surface-elevated text-text-secondary border-surface-border',
    primary: 'bg-accent-indigo/15 text-indigo-300 border-accent-indigo/30',
    secondary: 'bg-accent-violet/15 text-violet-300 border-accent-violet/30',
    teal: 'bg-accent-teal/15 text-accent-teal border-accent-teal/30',
    success: 'bg-status-success/15 text-status-success border-status-success/30',
    warning: 'bg-status-warning/15 text-status-warning border-status-warning/30',
    danger: 'bg-status-danger/15 text-status-danger border-status-danger/30',
    outline: 'bg-transparent text-text-secondary border-surface-border hover:border-surface-border-hover',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors select-none ${variantClass} ${sizeClass} ${className}`}
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
          className="ml-0.5 -mr-0.5 rounded-full p-0.5 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
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
