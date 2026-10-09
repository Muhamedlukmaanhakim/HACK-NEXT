import React from 'react';
import Button from '../ui/Button';

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
    opportunityTitle = 'HEALTHCARE AI',
    role = 'UI / UX',
    message,
    status = 'Pending',
  } = request;

  const numId = id ? String(id).replace(/\D/g, '') || '018' : '018';
  const paddedId = numId.length < 3 ? `00${numId}`.slice(-3) : numId;
  const firstName = student?.name?.split(' ')[0]?.toUpperCase() || 'SARAH';

  return (
    <div
      className={`p-4 bg-white border-2 border-ink shadow-brutal font-mono space-y-3 ${className}`}
    >
      {/* Top Header: REQUEST / 018 */}
      <div className="flex items-center justify-between border-b border-ink/20 pb-2 text-[10px] font-bold">
        <span className="text-ink/60 uppercase">
          REQUEST / {paddedId}
        </span>
        <span
          className={`px-1.5 py-0.5 border border-ink text-[10px] uppercase font-bold ${
            status === 'Accepted'
              ? 'bg-campus-green text-ink'
              : status === 'Declined'
              ? 'bg-ink text-white'
              : 'bg-signal-yellow text-ink'
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      {/* SARAH WANTS TO JOIN: HEALTHCARE AI */}
      <div>
        <h4 className="text-xs font-bold text-ink/70 uppercase">
          {type === 'incoming' ? `${firstName} WANTS TO JOIN:` : `INVITED TO JOIN:`}
        </h4>
        <h3 className="font-display font-black text-base sm:text-lg text-ink uppercase tracking-tight">
          {opportunityTitle.toUpperCase()}
        </h3>
      </div>

      {/* ROLE: UI / UX */}
      <div className="space-y-0.5">
        <span className="text-[10px] font-bold text-ink/50 uppercase block">ROLE:</span>
        <span className="text-xs font-black text-ink uppercase">
          {student?.skills?.[0] || role || 'UI / UX'}
        </span>
      </div>

      {message && (
        <p className="text-xs font-sans text-ink/80 bg-canvas p-2.5 border border-ink leading-relaxed">
          "{message}"
        </p>
      )}

      {/* Action Block / CONNECTED ✓ Status */}
      <div className="pt-2 border-t-2 border-ink flex items-center justify-between">
        {status === 'Accepted' ? (
          <div className="w-full py-1.5 px-3 bg-campus-green text-ink border border-ink text-center text-xs font-bold uppercase tracking-wider">
            CONNECTED ✓
          </div>
        ) : status === 'Declined' ? (
          <div className="w-full py-1.5 px-3 bg-canvas text-ink/60 border border-ink text-center text-xs font-bold uppercase">
            DECLINED / ARCHIVED
          </div>
        ) : (
          <div className="w-full flex items-center justify-end gap-2">
            {type === 'incoming' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDecline && onDecline(request)}
                  className="text-xs"
                >
                  [ DECLINE ]
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => onAccept && onAccept(request)}
                  className="text-xs font-bold"
                >
                  [ ACCEPT ]
                </Button>
              </>
            )}

            {type === 'sent' && onWithdraw && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWithdraw(request)}
                className="text-xs"
              >
                [ WITHDRAW ]
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
