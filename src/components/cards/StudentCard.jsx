import React from 'react';
import Avatar from '../ui/Avatar';
import SkillBadge from '../skills/SkillBadge';
import Button from '../ui/Button';
import { UserCheck, UserPlus, Clock, ArrowUpRight } from 'lucide-react';

export default function StudentCard({
  student,
  isRequested = false,
  onConnect,
  onViewProfile,
  matchScore,
  className = '',
}) {
  const {
    id,
    name,
    department,
    year,
    bio,
    skills = [],
    availability = [],
  } = student;

  return (
    <div className={`p-5 bg-white border-2 border-ink shadow-brutal hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between group ${className}`}>
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <Avatar name={name} size="md" className="border-2 border-ink" />
            <div>
              <div className="text-[10px] font-mono text-ink/50 uppercase tracking-wider font-semibold">
                NODE // {id?.toUpperCase() || 'STU'}
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg text-ink uppercase tracking-tight leading-tight group-hover:text-brutal-red transition-colors">
                {name}
              </h3>
              <p className="text-[11px] font-mono text-ink/70 font-semibold uppercase mt-0.5">
                {department} · {year}
              </p>
            </div>
          </div>
          {matchScore !== undefined && (
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 border-2 border-ink whitespace-nowrap ${
              matchScore >= 90
                ? 'bg-signal-yellow text-ink shadow-brutal-sm'
                : 'bg-canvas text-ink'
            }`}>
              {matchScore}% MATCH
            </span>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs text-ink/80 font-sans line-clamp-2 mb-4 leading-relaxed font-normal">
          {bio || 'Ambitious builder looking to collaborate on high-impact projects.'}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="xs" />
            ))}
            {skills.length > 4 && (
              <span className="text-[10px] font-mono font-bold text-ink px-1.5 py-0.5 bg-canvas border border-ink">
                +{skills.length - 4} MORE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-3 border-t-2 border-ink flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-ink/70 font-semibold">
          <Clock className="w-3.5 h-3.5 flex-shrink-0 text-ink" />
          <span className="truncate max-w-[110px] uppercase">{availability[0] || 'Flexible'}</span>
        </div>

        <div className="flex items-center gap-2">
          {onViewProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(student)}
              className="text-xs px-2.5 py-1"
            >
              PROFILE
            </Button>
          )}

          <Button
            variant={isRequested ? 'secondary' : 'primary'}
            size="sm"
            disabled={isRequested}
            icon={isRequested ? UserCheck : UserPlus}
            onClick={() => !isRequested && onConnect && onConnect(student)}
            className="text-xs px-3 py-1"
          >
            {isRequested ? 'SENT' : 'CONNECT →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
