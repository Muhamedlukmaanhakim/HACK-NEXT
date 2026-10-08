import React from 'react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Check, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function RequestCard({
  request,
  type = 'incoming', // 'incoming' | 'sent'
  onAccept,
  onDecline,
  onWithdraw,
  className = '',
}) {
  const {
    id,
    student,
    opportunityTitle,
    message,
    matchScore,
    status = 'Pending',
    createdAt,
  } = request;

  const statusVariants = {
    Pending: 'warning',
    Accepted: 'success',
    Declined: 'danger',
  };

  return (
    <div className={`p-4 sm:p-5 rounded-none bg-retro-surface border border-retro-border hover:border-retro-orange/60 transition-all duration-150 shadow-panel relative font-mono ${className}`}>
      {/* Corner crosshairs */}
      <div className="absolute top-1 left-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>
      <div className="absolute top-1 right-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <Avatar name={student?.name || 'Peer'} size="md" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-bold text-retro-paper">
                {student?.name}
              </h4>
              <span className="text-[10px] text-retro-muted">
                ({student?.department} // {student?.year})
              </span>
              {matchScore !== undefined && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-none bg-retro-orange/15 text-retro-orange border border-retro-orange/40">
                  {matchScore}% MATCH
                </span>
              )}
            </div>

            <p className="text-[11px] text-retro-muted mt-1 flex items-center gap-1.5">
              {type === 'incoming' ? (
                <>
                  <ArrowDownLeft className="w-3.5 h-3.5 text-retro-teal" />
                  <span>WANTS TO JOIN: <strong className="text-retro-paper font-semibold">{opportunityTitle}</strong></span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-3.5 h-3.5 text-retro-orange" />
                  <span>TRANSMITTED TO: <strong className="text-retro-paper font-semibold">{opportunityTitle}</strong></span>
                </>
              )}
            </p>
          </div>
        </div>

        <Badge variant={statusVariants[status] || 'default'} size="sm">
          {status}
        </Badge>
      </div>

      {/* Message Body */}
      {message && (
        <div className="p-3 rounded-none bg-retro-surface-elevated border border-retro-border/80 text-xs text-retro-paper/80 font-sans leading-relaxed mb-3">
          &ldquo;{message}&rdquo;
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2.5 border-t border-retro-border/60 flex items-center justify-end gap-2 text-xs">
        {type === 'incoming' && status === 'Pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              icon={X}
              onClick={() => onDecline && onDecline(request)}
              className="text-retro-muted hover:text-retro-red hover:border-retro-red/60"
            >
              Decline
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Check}
              onClick={() => onAccept && onAccept(request)}
            >
              Accept Roster
            </Button>
          </>
        )}

        {type === 'sent' && status === 'Pending' && onWithdraw && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWithdraw(request)}
            className="text-retro-muted hover:text-retro-red"
          >
            Withdraw Request
          </Button>
        )}

        {status === 'Accepted' && (
          <span className="text-xs text-retro-teal font-mono font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> COLLABORATION CONFIRMED
          </span>
        )}

        {status === 'Declined' && (
          <span className="text-xs text-retro-muted font-mono">
            REQUEST ARCHIVED / DECLINED
          </span>
        )}
      </div>
    </div>
  );
}
