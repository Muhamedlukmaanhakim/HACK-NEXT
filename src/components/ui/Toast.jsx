import React from 'react';
import { CheckSquare, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ id, type = 'info', message, title, onClose }) {
  const icons = {
    success: <CheckSquare className="w-4 h-4 text-retro-teal flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-retro-amber flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-retro-red flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-retro-orange flex-shrink-0" />,
  };

  const borderColors = {
    success: 'border-retro-teal/60 bg-retro-surface',
    warning: 'border-retro-amber/60 bg-retro-surface',
    error: 'border-retro-red/60 bg-retro-surface',
    info: 'border-retro-orange/60 bg-retro-surface',
  };

  const typeLabels = {
    success: 'SYS // SUCCESS',
    warning: 'SYS // WARN',
    error: 'SYS // ERROR',
    info: 'SYS // TELEMETRY',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 p-3.5 rounded-none border shadow-terminal backdrop-blur-md transition-all duration-300 animate-slide-up w-80 sm:w-96 font-mono text-xs ${borderColors[type] || borderColors.info}`}
    >
      <div className="mt-0.5">{icons[type] || icons.info}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] uppercase tracking-wider text-retro-muted mb-0.5">
          [{typeLabels[type] || 'SYS // INFO'}]
        </div>
        {title && <h5 className="text-xs font-bold text-retro-paper mb-0.5">{title}</h5>}
        <p className="text-[11px] text-retro-paper/70 font-sans leading-relaxed">{message}</p>
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        className="p-1 text-retro-muted hover:text-retro-paper transition-colors focus-visible:outline-none"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts = [], onClose }) {
  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-auto"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
