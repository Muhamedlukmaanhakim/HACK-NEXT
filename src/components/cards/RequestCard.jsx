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
    <div className={`p-5 rounded-2xl bg-surface border border-surface-border hover:border-surface-border-hover transition-all duration-200 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3.5">
          <Avatar name={student?.name || 'Peer'} size="md" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-text-primary">
                {student?.name}
              </h4>
              <span className="text-xs text-text-secondary">
                ({student?.department} • {student?.year})
              </span>
              {matchScore !== undefined && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-teal/15 text-accent-teal border border-accent-teal/30">
                  {matchScore}% Match
                </span>
              )}
            </div>

            <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
              {type === 'incoming' ? (
                <>
                  <ArrowDownLeft className="w-3.5 h-3.5 text-accent-teal" />
                  <span>Wants to join: <strong className="text-text-primary">{opportunityTitle}</strong></span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-3.5 h-3.5 text-accent-indigo" />
                  <span>Request to join: <strong className="text-text-primary">{opportunityTitle}</strong></span>
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
        <div className="p-3.5 rounded-xl bg-surface-elevated/80 border border-surface-border text-xs text-text-secondary leading-relaxed mb-4">
          &ldquo;{message}&rdquo;
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-3 border-t border-surface-border/60 flex items-center justify-end gap-2.5">
        {type === 'incoming' && status === 'Pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              icon={X}
              onClick={() => onDecline && onDecline(request)}
              className="text-text-muted hover:text-status-danger hover:border-status-danger/40"
            >
              Decline
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Check}
              onClick={() => onAccept && onAccept(request)}
            >
              Accept into Team
            </Button>
          </>
        )}

        {type === 'sent' && status === 'Pending' && onWithdraw && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWithdraw(request)}
            className="text-text-muted hover:text-status-danger"
          >
            Withdraw Request
          </Button>
        )}

        {status === 'Accepted' && (
          <span className="text-xs text-status-success font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Collaboration Confirmed
          </span>
        )}

        {status === 'Declined' && (
          <span className="text-xs text-text-muted font-medium">
            Request Declined
          </span>
        )}
      </div>
    </div>
  );
}
