import React from 'react';
import Button from './Button';
import { ArrowRight } from 'lucide-react';

export default function EmptyState({
  title = 'NO RECORDS LOCATED.',
  description = 'YOUR TEAM IS STILL MISSING A FEW PIECES.',
  actionLabel = 'FIND PEOPLE →',
  onAction,
  className = '',
}) {
  return (
    <div className={`p-8 sm:p-12 border-2 border-ink bg-white shadow-brutal text-left sm:text-center flex flex-col items-start sm:items-center justify-center space-y-3 ${className}`}>
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 bg-canvas px-2 py-0.5 border border-ink">
        [ DIRECTORY STATUS // VACANT ]
      </span>
      <h3 className="text-xl sm:text-2xl font-display font-bold text-ink uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-ink/75 max-w-md font-sans leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
