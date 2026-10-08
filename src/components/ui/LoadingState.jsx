import React from 'react';

export default function LoadingState({
  message = 'ANALYZING REQUIREMENTS...',
  className = '',
}) {
  return (
    <div className={`p-8 sm:p-12 border-2 border-ink bg-white shadow-brutal flex flex-col items-center justify-center text-center font-mono space-y-3 ${className}`}>
      <span className="text-[11px] font-bold text-ink uppercase tracking-widest bg-signal-yellow px-2 py-0.5 border border-ink">
        [ SYSTEM PROCESSING ]
      </span>
      <h3 className="text-base sm:text-lg font-display font-bold text-ink uppercase tracking-wide">
        {message}
      </h3>
      <div className="w-48 sm:w-64 h-5 border-2 border-ink bg-canvas relative overflow-hidden">
        <div className="h-full bg-ink w-3/4 animate-pulse" />
      </div>
      <div className="text-xs font-mono text-ink/70">
        [████████████░░░░] SYNCHRONIZING
      </div>
    </div>
  );
}
