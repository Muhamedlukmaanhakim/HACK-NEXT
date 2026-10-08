import React from 'react';
import { CheckSquare, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ id, type = 'info', message, title, onClose }) {
  const icons = {
    success: <CheckSquare className="w-4 h-4 text-campus-green stroke-[2.5] flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-signal-yellow stroke-[2.5] flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-brutal-red stroke-[2.5] flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-ink stroke-[2.5] flex-shrink-0" />,
  };

  const badgeColors = {
    success: 'bg-campus-green text-ink',
    warning: 'bg-signal-yellow text-ink',
    error: 'bg-brutal-red text-white',
    info: 'bg-canvas text-ink',
  };

  const typeLabels = {
    success: 'STATUS // SUCCESS',
    warning: 'STATUS // WARNING',
    error: 'STATUS // ERROR',
    info: 'STATUS // NOTIFICATION',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 p-4 bg-white border-2 border-ink shadow-brutal transition-all duration-300 animate-slide-up w-80 sm:w-96 font-mono text-xs"
    >
      <div className="mt-0.5">{icons[type] || icons.info}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 border border-ink ${badgeColors[type] || badgeColors.info}`}>
            {typeLabels[type] || 'STATUS // INFO'}
          </span>
        </div>
        {title && <h5 className="font-display font-black text-xs text-ink uppercase tracking-tight mb-0.5">{title}</h5>}
        <p className="text-xs text-ink/80 font-sans leading-relaxed font-normal">{message}</p>
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        className="p-1 border border-ink hover:bg-signal-yellow text-ink transition-colors"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5 stroke-[2.5]" />
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
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-auto"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
