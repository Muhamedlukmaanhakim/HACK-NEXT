import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'SYSTEM ANOMALY DETECTED',
  message = 'An unexpected error occurred while processing this request.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border-2 border-ink shadow-brutal ${className}`}>
      <div className="w-12 h-12 bg-brutal-red text-white border-2 border-ink flex items-center justify-center mb-3 shadow-brutal-sm">
        <AlertCircle className="w-6 h-6 stroke-[2.5]" />
      </div>
      <div className="text-xs font-mono font-bold text-brutal-red uppercase tracking-wider mb-1">
        ERROR // SYSTEM FAULT
      </div>
      <h4 className="font-display font-black text-lg text-ink uppercase tracking-tight mb-2">
        {title}
      </h4>
      <p className="text-xs sm:text-sm font-sans text-ink/80 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="primary" size="sm" icon={RotateCcw} onClick={onRetry} className="text-xs font-bold uppercase">
          RETRY ACTION
        </Button>
      )}
    </div>
  );
}
