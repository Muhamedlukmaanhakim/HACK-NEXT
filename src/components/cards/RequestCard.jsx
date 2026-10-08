import React from 'react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import SkillBadge from '../skills/SkillBadge';
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
  } = request;

  return (
    <div className={`p-6 bg-white border-2 border-ink shadow-brutal transition-all ${className}`}>
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-ink">
        <span className="font-mono text-[10px] font-bold text-ink/70 uppercase tracking-wider">
          REQUEST // {id ? `0${id}`.slice(-3) : '018'}
        </span>
        <div className="flex items-center gap-2">
          {matchScore !== undefined && (
            <span className="font-mono text-[10px] font-bold bg-signal-yellow text-ink px-2 py-0.5 border border-ink">
              {matchScore}% MATCH
            </span>
          )}
          <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 border border-ink ${
            status === 'Accepted'
              ? 'bg-campus-green text-ink'
              : status === 'Declined'
              ? 'bg-ink text-white'
              : 'bg-canvas text-ink'
          }`}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Student Header */}
      <div className="flex items-start gap-3.5 mb-4">
        <Avatar name={student?.name || 'Peer'} size="md" className="border-2 border-ink" />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-display font-black text-base sm:text-lg text-ink uppercase tracking-tight">
              {student?.name} {type === 'incoming' ? 'WANTS TO JOIN' : 'INVITED'}
            </h4>
            <span className="font-mono text-[11px] text-ink/70 uppercase">
              ({student?.department} · {student?.year})
            </span>
          </div>

          <p className="font-mono text-xs text-ink/80 mt-1 flex items-center gap-1.5 font-bold uppercase">
            {type === 'incoming' ? (
              <>
                <ArrowDownLeft className="w-3.5 h-3.5 text-brutal-red stroke-[2.5]" />
                <span>FOR: <strong className="text-ink">{opportunityTitle}</strong></span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-3.5 h-3.5 text-campus-green stroke-[2.5]" />
                <span>PROJECT: <strong className="text-ink">{opportunityTitle}</strong></span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Message Body */}
      {message && (
        <div className="p-3.5 bg-canvas border-2 border-ink text-xs font-sans text-ink leading-relaxed mb-4 font-normal">
          &ldquo;{message}&rdquo;
        </div>
      )}

      {/* Student Skills if present */}
      {student?.skills && student.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {student.skills.slice(0, 4).map((sk) => (
            <SkillBadge key={sk} skill={sk} size="xs" />
          ))}
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-3 border-t-2 border-ink flex items-center justify-end gap-2.5">
        {type === 'incoming' && status === 'Pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              icon={X}
              onClick={() => onDecline && onDecline(request)}
              className="text-xs"
            >
              DECLINE
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Check}
              onClick={() => onAccept && onAccept(request)}
              className="text-xs font-bold"
            >
              ACCEPT & ADD TO TEAM →
            </Button>
          </>
        )}

        {type === 'sent' && status === 'Pending' && onWithdraw && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWithdraw(request)}
            className="text-xs"
          >
            WITHDRAW INVITATION
          </Button>
        )}

        {status === 'Accepted' && (
          <div className="w-full p-2 bg-campus-green border-2 border-ink flex items-center justify-center gap-2 font-mono text-xs font-bold text-ink uppercase">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>CONNECTED ✓ {student?.name?.toUpperCase()} IS NOW ON YOUR TEAM</span>
          </div>
        )}

        {status === 'Declined' && (
          <span className="font-mono text-xs font-bold text-ink/60 uppercase">
            REQUEST ARCHIVED / DECLINED
          </span>
        )}
      </div>
    </div>
  );
}
