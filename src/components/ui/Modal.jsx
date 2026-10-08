import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

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
        className="fixed inset-0 bg-ink/70 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidth} bg-white border-2 border-ink rounded-none shadow-brutal-lg z-10 overflow-hidden transform animate-slide-up ${className}`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-canvas border-b-2 border-ink">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60">
              [ COLLABMATRIX // ACTION ]
            </span>
            {title && (
              <h3 id="modal-title" className="text-base sm:text-lg font-display font-bold uppercase text-ink tracking-tight mt-0.5">
                {title}
              </h3>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 border-2 border-ink bg-white text-ink hover:bg-brutal-red hover:text-white transition-colors focus-visible:outline-none"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {description && (
          <div className="px-5 pt-3 pb-1 text-xs text-ink/70 font-sans border-b border-ink/20">
            {description}
          </div>
        )}

        {/* Body */}
        <div className="p-5 max-h-[calc(85vh-130px)] overflow-y-auto bg-white">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 bg-canvas border-t-2 border-ink flex items-center justify-end gap-3 font-display">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
