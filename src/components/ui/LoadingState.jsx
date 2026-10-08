import React from 'react';
import { Cpu } from 'lucide-react';

export default function LoadingState({
  message = 'Processing telemetry...',
  className = '',
  size = 'md',
}) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center font-mono ${className}`}>
      <div className="w-9 h-9 rounded-none border border-retro-orange/60 bg-retro-surface flex items-center justify-center text-retro-orange mb-3 animate-pulse">
        <Cpu className={`${sizeMap[size] || sizeMap.md}`} />
      </div>
      <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
        [ SYS // COMPUTING ]
      </div>
      <p className="text-xs text-retro-paper/80 font-mono tracking-wider">{message}</p>
    </div>
  );
}
