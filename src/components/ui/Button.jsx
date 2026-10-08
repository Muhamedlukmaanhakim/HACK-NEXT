import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-gradient-primary text-white shadow-soft hover:shadow-glow-indigo hover:brightness-110 border border-white/10',
    secondary: 'bg-surface-elevated text-text-primary hover:bg-surface-hover border border-surface-border hover:border-surface-border-hover shadow-sm',
    outline: 'bg-transparent text-text-primary border border-surface-border hover:border-accent-indigo/50 hover:bg-white/5',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent',
    danger: 'bg-status-danger/15 text-status-danger border border-status-danger/30 hover:bg-status-danger/25',
    teal: 'bg-accent-teal/15 text-accent-teal border border-accent-teal/30 hover:bg-accent-teal/25 shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 h-10 gap-2 min-h-[40px]',
    lg: 'text-base px-6 py-2.5 h-12 gap-2.5 min-h-[48px]',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
        </>
      )}
    </button>
  );
}
