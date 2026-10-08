import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'System Fault Detected',
  message = 'Telemetry interface encountered an anomaly. Check connection or reload console.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-none border border-retro-red/60 bg-retro-surface ${className}`}>
      <div className="w-10 h-10 rounded-sm bg-retro-red/10 border border-retro-red/40 flex items-center justify-center text-retro-red mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="text-[10px] font-mono text-retro-red uppercase tracking-wider mb-1">
        [ FAULT // CODE_ERR ]
      </div>
      <h4 className="text-base font-display font-bold text-retro-paper tracking-tight mb-1.5">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-retro-muted max-w-sm mb-5 font-sans leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" icon={RotateCcw} onClick={onRetry}>
          Re-initialize Telemetry
        </Button>
      )}
    </div>
  );
}
