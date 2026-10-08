import React from 'react';

export default function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full rounded',
    title: 'h-6 w-3/4 rounded',
    avatar: 'w-10 h-10 rounded-full',
    card: 'h-48 w-full rounded-2xl',
    badge: 'h-6 w-20 rounded-full',
    button: 'h-10 w-28 rounded-xl',
  };

  const variantClass = variants[variant] || '';

  return (
    <div
      className={`bg-surface-elevated/80 animate-pulse border border-surface-border/50 ${variantClass} ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" />
        <div className="space-y-2 flex-1">
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
