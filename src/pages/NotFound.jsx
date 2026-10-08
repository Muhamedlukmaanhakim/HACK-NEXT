import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-surface-elevated border border-surface-border flex items-center justify-center text-accent-indigo shadow-elevated">
        <Compass className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-accent-teal">
          404 Error
        </span>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto">
          The route you navigated to doesn&apos;t exist in this campus cluster or has been moved.
        </p>
      </div>
      <Button
        variant="primary"
        size="md"
        icon={ArrowLeft}
        onClick={() => navigate('/dashboard')}
      >
        Return to Dashboard
      </Button>
    </div>
  );
}
