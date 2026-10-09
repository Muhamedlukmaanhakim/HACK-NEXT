import React from 'react';
import { getInitials } from '../../utils/format';

const BG_PALETTE = ['#D93620', '#F1C83B', '#111111', '#687A55', '#222222'];
const TEXT_PALETTE = ['#FFFFFF', '#111111', '#FFFFFF', '#FFFFFF', '#FFFFFF'];

export default function Avatar({
  name = '',
  size = 'md',
  className = '',
  showOnline = false,
  isOnline = false,
}) {
  const initials = getInitials(name);
  
  // Deterministic flat color selection
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % BG_PALETTE.length;
  const bgColor = BG_PALETTE[colorIndex];
  const textColor = TEXT_PALETTE[colorIndex];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs sm:text-sm',
    lg: 'w-12 h-12 text-sm sm:text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl font-black',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <div
        className={`${currentSize} rounded-none font-mono font-bold flex items-center justify-center select-none border-2 border-ink`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
        aria-label={name}
        role="img"
      >
        <span className="tracking-tight">{initials}</span>
      </div>
      {showOnline && (
        <span
          className={`absolute -top-1 -right-1 block border border-ink ${
            isOnline ? 'bg-campus-green' : 'bg-canvas'
          } ${size === 'xs' || size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
