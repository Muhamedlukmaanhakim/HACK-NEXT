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
    <div className={`p-6 bg-white border-2 border-ink shadow-brutal font-mono ${className}`}>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b-2 border-ink">
        <div className="flex items-center gap-4">
          <Avatar name={name} size="xl" className="border-2 border-ink" />
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">
              DOSSIER // NODE
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-ink uppercase tracking-tight">
              {name}
            </h2>
            <div className="flex items-center gap-3 text-xs text-ink/70 font-bold uppercase mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-ink stroke-[2.5]" />
                {department} · {year}
              </span>
              {email && (
                <span className="flex items-center gap-1 text-ink/50">
                  <Mail className="w-3.5 h-3.5 stroke-[2.5]" />
                  {email}
                </span>
              )}
            </div>
          </div>
        </div>

        {isOwnProfile && onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit} className="text-xs font-bold">
            EDIT DOSSIER
          </Button>
        )}
      </div>

      {/* Bio */}
      <div className="mb-5 space-y-1.5">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
          BIOGRAPHICAL SUMMARY:
        </div>
        <p className="text-xs sm:text-sm text-ink/80 font-sans leading-relaxed bg-canvas p-3.5 border-2 border-ink font-normal">
          {bio || 'Passionate student eager to collaborate and build high-impact projects.'}
        </p>
      </div>

      {/* Skills */}
      <div className="mb-5 space-y-2">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
          REGISTERED COMPETENCIES:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" />
          ))}
        </div>
      </div>

      {/* Interests & Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
            DOMAIN INTERESTS:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {interests.map((interest) => (
              <Badge key={interest} variant="secondary" size="sm">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
            AVAILABILITY WINDOWS:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availability.map((avail) => (
              <Badge key={avail} variant="default" size="sm">
                <Calendar className="w-3 h-3 mr-1 text-ink" />
                {avail}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
            DOCUMENTED MILESTONES:
          </div>
          <ul className="space-y-1 text-xs text-ink/80 font-mono">
            {achievements.map((ach, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-brutal-red flex-shrink-0" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
