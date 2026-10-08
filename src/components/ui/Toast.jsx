import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ id, type = 'info', message, title, onClose }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-status-success flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-status-warning flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-status-danger flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-accent-indigo flex-shrink-0" />,
  };

  const borderColors = {
    success: 'border-status-success/30 bg-surface-elevated/95',
    warning: 'border-status-warning/30 bg-surface-elevated/95',
    error: 'border-status-danger/30 bg-surface-elevated/95',
    info: 'border-accent-indigo/30 bg-surface-elevated/95',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-elevated backdrop-blur-md transition-all duration-300 animate-slide-up w-80 sm:w-96 ${borderColors[type] || borderColors.info}`}
    >
      <div className="mt-0.5">{icons[type] || icons.info}</div>
      <div className="flex-1 min-w-0">
        {title && <h5 className="text-sm font-semibold text-text-primary mb-0.5">{title}</h5>}
        <p className="text-xs text-text-secondary leading-relaxed">{message}</p>
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors focus-visible:outline-none"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
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
