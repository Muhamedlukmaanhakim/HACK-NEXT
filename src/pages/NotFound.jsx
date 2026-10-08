import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="text-7xl sm:text-9xl font-display font-black text-ink leading-none">
        404
      </div>
      <div className="space-y-1">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-brutal-red">
          ROUTE UNRESOLVED // NOT FOUND
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-ink uppercase tracking-tight">
          YOU'VE GONE OFF THE GRID.
        </h1>
        <p className="text-xs sm:text-sm font-mono text-ink/70 max-w-sm mx-auto uppercase font-semibold">
          THE REQUESTED PAGE DOES NOT EXIST IN THE COLLABMATRIX NETWORK.
        </p>
      </div>
      <Button
        variant="primary"
        size="lg"
        icon={ArrowLeft}
        onClick={() => navigate('/dashboard')}
        className="text-xs font-bold uppercase tracking-wider"
      >
        RETURN TO DASHBOARD →
      </Button>
    </div>
  );
}
