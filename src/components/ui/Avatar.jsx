import React from 'react';
import { getInitials, getAvatarGradient } from '../../utils/format';

export default function Avatar({
  name = '',
  size = 'md',
  className = '',
  showOnline = false,
  isOnline = false
}) {
  const initials = getInitials(name);
  const { from, to } = getAvatarGradient(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
    '2xl': 'w-20 h-20 text-lg'
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <div
        className={`${currentSize} rounded-md font-mono font-bold flex items-center justify-center text-paper shadow-panel select-none border border-surface-border ring-1 ring-surface-border/40`}
        style={{
          background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`
        }}
        aria-label={name}
        role="img"
      >
        <span className="tracking-tighter drop-shadow-sm">{initials}</span>
      </div>
      {showOnline && (
        <span
          className={`absolute -top-1 -right-1 block rounded-full ring-2 ring-background ${
            isOnline ? 'bg-accent-teal shadow-teal-glow' : 'bg-text-muted'
          } ${size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
