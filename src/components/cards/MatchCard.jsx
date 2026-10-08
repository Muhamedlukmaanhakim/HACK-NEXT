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
    <div className={`p-6 rounded-2xl bg-surface border border-surface-border hover:border-surface-border-hover transition-all duration-200 flex flex-col justify-between ${className}`}>
      <div>
        {/* Top Header with Avatar and Big Match Gauge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={student.name} size="lg" />
            <div>
              <h3 className="text-base font-semibold text-text-primary tracking-tight">
                {student.name}
              </h3>
              <p className="text-xs text-text-secondary">
                {student.department} • {student.year}
              </p>
              <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                {student.bio}
              </p>
            </div>
          </div>
          <MatchScore score={score} size="md" />
        </div>

        {/* Sub-scores Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-surface-elevated/70 border border-surface-border mb-4">
          <div>
            <div className="text-[10px] text-text-muted uppercase font-semibold">Skill (50%)</div>
            <div className="text-xs font-semibold text-text-primary mt-0.5">{subScores.skill || 90}%</div>
            <ProgressBar value={subScores.skill || 90} size="sm" variant="indigo" />
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase font-semibold">Interest (20%)</div>
            <div className="text-xs font-semibold text-text-primary mt-0.5">{subScores.interest || 85}%</div>
            <ProgressBar value={subScores.interest || 85} size="sm" variant="teal" />
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase font-semibold">Availability (15%)</div>
            <div className="text-xs font-semibold text-text-primary mt-0.5">{subScores.availability || 80}%</div>
            <ProgressBar value={subScores.availability || 80} size="sm" variant="warning" />
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase font-semibold">Experience (15%)</div>
            <div className="text-xs font-semibold text-text-primary mt-0.5">{subScores.experience || 85}%</div>
            <ProgressBar value={subScores.experience || 85} size="sm" variant="success" />
          </div>
        </div>

        {/* Matched Skills */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
            Skill Overlap:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-success/15 text-status-success border border-status-success/30"
              >
                <Check className="w-3 h-3" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Why this match box */}
        <div className="p-3.5 rounded-xl bg-accent-indigo/10 border border-accent-indigo/20 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-accent-indigo" />
            <span>Why this match?</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {reason || `Matches key requirements with strong background and aligned availability.`}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
        {onViewProfile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewProfile(student)}
          >
            View Full Profile
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
