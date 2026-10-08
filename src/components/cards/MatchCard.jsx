import React from 'react';
import Avatar from '../ui/Avatar';
import MatchScore from '../features/MatchScore';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { UserCheck, UserPlus, Check, Sparkles } from 'lucide-react';

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
    <div className={`p-6 bg-white border-2 border-ink shadow-brutal hover:shadow-brutal-lg transition-all flex flex-col justify-between group ${className}`}>
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b-2 border-ink">
          <div className="flex items-start gap-3">
            <Avatar name={student.name} size="lg" className="border-2 border-ink" />
            <div>
              <div className="text-[10px] font-mono text-ink/50 uppercase tracking-wider font-semibold">
                NODE // {student.id?.toUpperCase() || 'STU'}
              </div>
              <h3 className="font-display font-black text-xl text-ink uppercase tracking-tight leading-tight group-hover:text-brutal-red transition-colors">
                {student.name}
              </h3>
              <p className="text-[11px] font-mono text-ink/70 font-semibold uppercase mt-0.5">
                {student.department} · {student.year}
              </p>
              <p className="text-xs text-ink/80 font-sans mt-1 line-clamp-1 font-normal">
                {student.bio}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 border-2 border-ink whitespace-nowrap ${
              score >= 90
                ? 'bg-signal-yellow text-ink shadow-brutal-sm'
                : 'bg-canvas text-ink'
            }`}>
              {Math.round(score)}% MATCH
            </span>
            <MatchScore score={score} size="md" />
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-canvas border-2 border-ink mb-4">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase text-ink/70">SKILL 50%</div>
            <div className="text-xs font-mono font-bold text-ink mt-0.5">{subScores.skill || 90}%</div>
            <ProgressBar value={subScores.skill || 90} size="sm" variant="coral" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase text-ink/70">INTEREST 20%</div>
            <div className="text-xs font-mono font-bold text-ink mt-0.5">{subScores.interest || 85}%</div>
            <ProgressBar value={subScores.interest || 85} size="sm" variant="yellow" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase text-ink/70">AVAILABILITY 15%</div>
            <div className="text-xs font-mono font-bold text-ink mt-0.5">{subScores.availability || 80}%</div>
            <ProgressBar value={subScores.availability || 80} size="sm" variant="mint" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase text-ink/70">EXPERIENCE 15%</div>
            <div className="text-xs font-mono font-bold text-ink mt-0.5">{subScores.experience || 85}%</div>
            <ProgressBar value={subScores.experience || 85} size="sm" variant="coral" />
          </div>
        </div>

        {/* Matched Skills */}
        <div className="mb-4 space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
            OVERLAPPING COMPETENCIES:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-bold bg-white text-ink border border-ink"
              >
                <Check className="w-3 h-3 stroke-[2.5] text-campus-green" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Why this match box */}
        <div className="p-3.5 bg-canvas border-2 border-ink mb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-brutal-red uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WHY THIS MATCH:</span>
          </div>
          <p className="text-xs font-sans text-ink/80 leading-relaxed font-normal">
            {reason || `Matches core project competencies with verified experience and aligned availability.`}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t-2 border-ink flex items-center justify-between gap-3">
        {onViewProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile(student)}
            className="text-xs"
          >
            VIEW PROFILE
          </Button>
        )}
        <Button
          variant={isRequested ? 'secondary' : 'primary'}
          size="md"
          disabled={isRequested}
          icon={isRequested ? UserCheck : UserPlus}
          onClick={() => !isRequested && onConnect && onConnect(student)}
          className="ml-auto text-xs"
        >
          {isRequested ? 'INVITATION SENT' : 'SEND INVITATION →'}
        </Button>
      </div>
    </div>
  );
}
