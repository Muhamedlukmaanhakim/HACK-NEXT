import React from 'react';

export default function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'w-10 h-10 border-2 border-ink',
    card: 'h-48 w-full border-2 border-ink',
    badge: 'h-5 w-16 border border-ink',
    button: 'h-9 w-24 border-2 border-ink',
  };

  const variantClass = variants[variant] || '';

  return (
    <div
      className={`bg-ink/10 animate-pulse ${variantClass} ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 bg-white border-2 border-ink shadow-brutal space-y-4">
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
