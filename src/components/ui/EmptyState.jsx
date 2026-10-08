import React from 'react';
import Button from './Button';
import { Terminal } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Terminal,
  title = 'No records located',
  description = 'No active telemetry data matches the specified query parameters.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-none border border-retro-border bg-retro-surface ${className}`}>
      <div className="w-10 h-10 rounded-sm bg-retro-surface-elevated border border-retro-border flex items-center justify-center text-retro-amber mb-3 shadow-panel">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-[10px] font-mono text-retro-muted uppercase tracking-wider mb-1">
        [ SYS // EMPTY_QUERY ]
      </div>
      <h4 className="text-base font-display font-bold text-retro-paper tracking-tight mb-1.5">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-retro-muted max-w-sm mb-5 font-sans leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
