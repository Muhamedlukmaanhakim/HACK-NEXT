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
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-medium',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-16 h-16 text-xl font-bold',
    '2xl': 'w-20 h-20 text-2xl font-bold'
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <div
        className={`${currentSize} rounded-full flex items-center justify-center text-white shadow-sm select-none border border-white/10`}
        style={{
          background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`
        }}
        aria-label={name}
        role="img"
      >
        <span>{initials}</span>
      </div>
      {showOnline && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-surface ${
            isOnline ? 'bg-status-success' : 'bg-text-muted'
          } ${size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
