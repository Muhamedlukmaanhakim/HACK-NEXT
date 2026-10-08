import React from 'react';
import Avatar from '../ui/Avatar';
import SkillBadge from '../skills/SkillBadge';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Mail, GraduationCap, Calendar, Award } from 'lucide-react';

export default function ProfileCard({
  student,
  isOwnProfile = false,
  onEdit,
  className = '',
}) {
  const {
    name,
    email,
    department,
    year,
    bio,
    skills = [],
    interests = [],
    achievements = [],
    availability = [],
  } = student;

  return (
    <div className={`p-5 sm:p-6 rounded-none bg-retro-surface border border-retro-border font-mono relative shadow-panel ${className}`}>
      {/* Corner crosshairs */}
      <div className="absolute top-1 left-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>
      <div className="absolute top-1 right-1 text-[8px] text-retro-muted/40 leading-none select-none">+</div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-retro-border pb-4">
        <div className="flex items-center gap-3.5">
          <Avatar name={name} size="xl" />
          <div>
            <div className="text-[10px] text-retro-muted uppercase tracking-widest">[ OPERATOR // DOSSIER ]</div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-retro-paper tracking-tight">
              {name}
            </h2>
            <div className="flex items-center gap-3 text-xs text-retro-muted mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-retro-orange" />
                {department} // {year}
              </span>
              {email && (
                <span className="flex items-center gap-1 text-retro-muted">
                  <Mail className="w-3.5 h-3.5" />
                  {email}
                </span>
              )}
            </div>
          </div>
        </div>

        {isOwnProfile && onEdit && (
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Edit Dossier
          </Button>
        )}
      </div>

      {/* Bio */}
      <div className="mb-5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-retro-muted mb-1.5">
          // BIOGRAPHICAL SUMMARY:
        </div>
        <p className="text-xs sm:text-sm text-retro-paper/80 font-sans leading-relaxed bg-retro-surface-elevated p-3 border border-retro-border">
          {bio || 'Passionate student eager to collaborate and build high-impact projects.'}
        </p>
      </div>

      {/* Skills */}
      <div className="mb-5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-retro-muted mb-2">
          // REGISTERED COMPETENCIES:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" />
          ))}
        </div>
      </div>

      {/* Interests & Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-retro-muted mb-1.5">
            // DOMAIN INTERESTS:
          </div>
          <div className="flex flex-wrap gap-1">
            {interests.map((interest) => (
              <Badge key={interest} variant="teal" size="sm">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-retro-muted mb-1.5">
            // AVAILABILITY WINDOWS:
          </div>
          <div className="flex flex-wrap gap-1">
            {availability.map((avail) => (
              <Badge key={avail} variant="default" size="sm">
                <Calendar className="w-3 h-3 mr-1 text-retro-muted" />
                {avail}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-retro-muted mb-2">
            // DOCUMENTED MILESTONES:
          </div>
          <ul className="space-y-1 text-xs text-retro-paper/80 font-sans">
            {achievements.map((ach, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-retro-amber flex-shrink-0" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
