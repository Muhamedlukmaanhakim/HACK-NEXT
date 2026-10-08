import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4 font-mono">
      <div className="w-12 h-12 rounded-none bg-retro-surface-elevated border border-retro-border flex items-center justify-center text-retro-orange shadow-panel">
        <Compass className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-retro-red">
          [ FAULT // 404_ROUTE_UNRESOLVED ]
        </div>
        <h1 className="text-2xl font-display font-bold text-retro-paper uppercase tracking-wide">
          Target Route Not Found
        </h1>
        <p className="text-xs text-retro-muted max-w-sm mx-auto font-sans">
          The requested coordinate or cluster node does not exist in this campus collaboration grid.
        </p>
      </div>
      <Button
        variant="primary"
        size="md"
        icon={ArrowLeft}
        onClick={() => navigate('/dashboard')}
      >
        Return to Dashboard Console
      </Button>
    </div>
  );
}
