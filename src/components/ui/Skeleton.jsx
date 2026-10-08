import React from 'react';

export default function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-3.5 w-full rounded-none',
    title: 'h-5 w-3/4 rounded-none',
    avatar: 'w-9 h-9 rounded-none',
    card: 'h-44 w-full rounded-none',
    badge: 'h-5 w-16 rounded-none',
    button: 'h-8 w-24 rounded-none',
  };

  const variantClass = variants[variant] || '';

  return (
    <div
      className={`bg-retro-surface-elevated/80 animate-pulse border border-retro-border/40 ${variantClass} ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-none bg-retro-surface border border-retro-border space-y-3 font-mono">
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" />
        <div className="space-y-1.5 flex-1">
          <Skeleton variant="title" className="w-1/2" />
          <Skeleton variant="text" className="w-1/3" />
        </div>
      </div>
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="badge" />
        <Skeleton variant="badge" />
        <Skeleton variant="badge" />
      </div>
    </div>
  );
}
