import React from 'react';
import Avatar from '../ui/Avatar';
import MatchScore from '../features/MatchScore';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { UserCheck, UserPlus, Check, Terminal } from 'lucide-react';

export default function MatchCard({
  match,
  isRequested = false,
  onConnect,
  onViewProfile,
  className = '',
}) {
  const {
    student,
    score = 90,
    subScores = { skill: 95, interest: 90, availability: 85, experience: 85 },
    matchedSkills = [],
    reason = '',
  } = match;

  return (
    <div className={`p-5 sm:p-6 rounded-none bg-retro-surface border border-retro-border hover:border-retro-orange/60 transition-all duration-150 flex flex-col justify-between shadow-panel relative font-mono ${className}`}>
      {/* Corner crosshairs */}
      <div className="absolute top-1 left-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>
      <div className="absolute top-1 right-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>

      <div>
        {/* Top Header with Avatar and Big Match Gauge */}
        <div className="flex items-start justify-between gap-4 mb-3 border-b border-retro-border pb-3">
          <div className="flex items-center gap-3">
            <Avatar name={student.name} size="lg" />
            <div>
              <div className="text-[9px] text-retro-muted uppercase tracking-widest">
                [ CANDIDATE // {student.id?.toUpperCase() || 'NODE'} ]
              </div>
              <h3 className="text-sm sm:text-base font-display font-bold text-retro-paper tracking-tight">
                {student.name}
              </h3>
              <p className="text-[10px] text-retro-muted">
                {student.department} // {student.year}
              </p>
              <p className="text-xs text-retro-paper/70 font-sans mt-0.5 line-clamp-1">
                {student.bio}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-none bg-retro-orange/20 text-retro-orange border border-retro-orange/50 uppercase tracking-wider">
              {score >= 90 ? `${Math.round(score)}% — STRONG MATCH` : `${Math.round(score)}% — MATCH SIGNAL`}
            </span>
            <MatchScore score={score} size="md" />
          </div>
        </div>

        {/* Sub-scores Grid (50%, 20%, 15%, 15%) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-none bg-retro-surface-elevated border border-retro-border mb-3.5">
          <div>
            <div className="text-[9px] text-retro-muted uppercase font-bold tracking-wider">Skill (50%)</div>
            <div className="text-xs font-bold text-retro-paper mt-0.5">{subScores.skill || 90}%</div>
            <ProgressBar value={subScores.skill || 90} size="sm" variant="orange" />
          </div>
          <div>
            <div className="text-[9px] text-retro-muted uppercase font-bold tracking-wider">Interest (20%)</div>
            <div className="text-xs font-bold text-retro-paper mt-0.5">{subScores.interest || 85}%</div>
            <ProgressBar value={subScores.interest || 85} size="sm" variant="amber" />
          </div>
          <div>
            <div className="text-[9px] text-retro-muted uppercase font-bold tracking-wider">Availability (15%)</div>
            <div className="text-xs font-bold text-retro-paper mt-0.5">{subScores.availability || 80}%</div>
            <ProgressBar value={subScores.availability || 80} size="sm" variant="teal" />
          </div>
          <div>
            <div className="text-[9px] text-retro-muted uppercase font-bold tracking-wider">Experience (15%)</div>
            <div className="text-xs font-bold text-retro-paper mt-0.5">{subScores.experience || 85}%</div>
            <ProgressBar value={subScores.experience || 85} size="sm" variant="orange" />
          </div>
        </div>

        {/* Matched Skills */}
        <div className="mb-3.5 space-y-1">
          <div className="text-[9px] font-mono uppercase tracking-widest text-retro-muted">
            // OVERLAPPING CAPABILITY VECTORS:
          </div>
          <div className="flex flex-wrap gap-1">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-medium bg-retro-teal/15 text-retro-teal border border-retro-teal/40"
              >
                <Check className="w-2.5 h-2.5" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Why this match box */}
        <div className="p-3 rounded-none bg-retro-surface-elevated border border-retro-border/80 mb-4 font-mono">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-retro-amber uppercase tracking-wider mb-1">
            <Terminal className="w-3 h-3 text-retro-amber" />
            <span>// TELEMETRY RATIONALE:</span>
          </div>
          <p className="text-xs text-retro-paper/80 font-sans leading-relaxed">
            {reason || `Matches key requirements with strong background and aligned availability.`}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2.5 border-t border-retro-border flex items-center justify-between gap-3 text-xs">
        {onViewProfile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewProfile(student)}
          >
            Full Profile
          </Button>
        )}
        <Button
          variant={isRequested ? 'secondary' : 'primary'}
          size="md"
          disabled={isRequested}
          icon={isRequested ? UserCheck : UserPlus}
          onClick={() => !isRequested && onConnect && onConnect(student)}
          className="ml-auto"
        >
          {isRequested ? 'Request Sent' : 'Connect'}
        </Button>
      </div>
    </div>
  );
}
