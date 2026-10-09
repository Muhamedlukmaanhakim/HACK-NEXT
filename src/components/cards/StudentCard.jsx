import React from 'react';
import Button from '../ui/Button';
import { ArrowRight, UserCheck, UserPlus } from 'lucide-react';

export default function StudentCard({
  student,
  isRequested = false,
  onConnect,
  onViewProfile,
  matchScore,
  index = 1,
  className = '',
}) {
  const {
    id,
    name,
    department,
    year,
    skills = [],
    interests = [],
    availability = [],
  } = student;

  const isHighMatch = (matchScore || 0) >= 90;
  const numStr = index < 10 ? `0${index}` : `${index}`;

  return (
    <div
      className={`p-4 bg-white border-2 transition-all duration-150 flex flex-col justify-between group ${
        isHighMatch
          ? 'border-brutal-red shadow-brutal hover:shadow-brutal-lg'
          : 'border-ink shadow-brutal-sm hover:shadow-brutal'
      } hover:-translate-x-0.5 hover:-translate-y-0.5 ${className}`}
    >
      <div className="space-y-3">
        {/* Top Technical Header: 01 / STUDENT */}
        <div className="flex items-center justify-between border-b border-ink/20 pb-2 text-[10px] font-mono font-bold">
          <span className="text-ink/60 uppercase">
            {numStr} / STUDENT
          </span>
          {matchScore !== undefined && (
            <span
              className={`px-1.5 py-0.5 border border-ink font-bold ${
                isHighMatch
                  ? 'bg-signal-yellow text-ink shadow-brutal-sm'
                  : 'bg-canvas text-ink/80'
              }`}
            >
              MATCH {matchScore}%
            </span>
          )}
        </div>

        {/* Student Name & Academic Year */}
        <div>
          <h3 className="font-display font-black text-base sm:text-lg text-ink uppercase tracking-tight leading-tight group-hover:text-brutal-red transition-colors">
            {name}
          </h3>
          <p className="text-[11px] font-mono text-ink/70 uppercase font-bold mt-0.5">
            {department} / {year}
          </p>
        </div>

        {/* Thin Divider */}
        <div className="editorial-separator" />

        {/* Skills Section: Editorial dot format */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-bold text-ink/50 uppercase">
            COMPETENCIES
          </div>
          <p className="text-xs font-mono font-bold text-ink uppercase tracking-wide leading-relaxed">
            {skills.slice(0, 3).join(' · ')}
            {skills.length > 3 && ` · +${skills.length - 3}`}
          </p>
        </div>

        {/* Interests */}
        {interests && interests.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold text-ink/50 uppercase">
              INTERESTS
            </div>
            <p className="text-xs font-mono text-ink/80 uppercase">
              {interests.slice(0, 2).join(' · ')}
            </p>
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="pt-3 mt-4 border-t-2 border-ink flex items-center justify-between gap-2">
        {onViewProfile ? (
          <button
            type="button"
            onClick={() => onViewProfile(student)}
            className="text-[11px] font-mono font-bold text-ink hover:text-brutal-red uppercase transition-colors"
          >
            [ PROFILE ]
          </button>
        ) : (
          <span className="text-[10px] font-mono text-ink/60 uppercase">
            {availability[0] || 'WEEKENDS'}
          </span>
        )}

        <Button
          variant={isRequested ? 'secondary' : isHighMatch ? 'accent' : 'primary'}
          size="sm"
          disabled={isRequested}
          onClick={() => !isRequested && onConnect && onConnect(student)}
          className="text-xs px-2.5 py-1"
        >
          {isRequested ? 'SENT ✓' : '[ CONNECT → ]'}
        </Button>
      </div>
    </div>
  );
}
