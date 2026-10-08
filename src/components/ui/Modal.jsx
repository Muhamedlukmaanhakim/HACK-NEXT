import React, { useEffect, useRef } from 'react';
import { X, Terminal } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'max-w-lg',
  className = '',
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-retro-bg/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidth} bg-retro-surface border border-retro-border-strong rounded-none shadow-terminal z-10 overflow-hidden transform animate-slide-up ${className}`}
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-retro-surface-elevated border-b border-retro-border font-mono">
          <div className="flex items-center gap-2 text-xs text-retro-amber">
            <Terminal className="w-3.5 h-3.5" />
            <span className="tracking-wider text-[11px]">[ SYS // DIALOG_WINDOW ]</span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-retro-muted hover:text-retro-paper transition-colors focus-visible:outline-none"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Title & Subtitle Banner */}
        {(title || description) && (
          <div className="px-5 pt-4 pb-2 border-b border-retro-border/40">
            {title && (
              <h3 id="modal-title" className="text-base font-display font-bold text-retro-paper tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p id="modal-description" className="text-xs text-retro-muted mt-1 font-sans">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-5 max-h-[calc(85vh-130px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 bg-retro-surface-elevated/60 border-t border-retro-border flex items-center justify-end gap-3 font-mono">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
