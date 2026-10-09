import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

export default function MatchCard({
  match,
  isRequested = false,
  onConnect,
  onViewProfile,
  className = '',
}) {
  const {
    student,
    score = 94,
    matchedSkills = ['UI/UX', 'Research', 'Presentation'],
  } = match;

  // Animated 0 -> score counter (Section 21 & 29)
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.round(score);
    const duration = 500;
    const startTime = performance.now();

    function update(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const current = Math.floor(progress === 1 ? end : (1 - Math.pow(2, -10 * progress)) * end);
      setAnimatedScore(current);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setAnimatedScore(end);
      }
    }
    const rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [score]);

  return (
    <div
      className={`p-5 bg-white border-2 border-ink shadow-brutal hover:shadow-brutal-lg transition-all flex flex-col justify-between font-mono group ${className}`}
    >
      <div className="space-y-4">
        {/* MATCH / 94% Header */}
        <div className="flex items-center justify-between border-b-2 border-ink pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-brutal-red uppercase">
              MATCH /
            </span>
            <span className="text-2xl sm:text-3xl font-display font-black text-ink">
              {animatedScore}%
            </span>
          </div>

          <span className="px-2 py-0.5 border border-ink bg-signal-yellow text-ink text-[11px] font-bold uppercase">
            BEST CANDIDATE
          </span>
        </div>

        {/* Candidate Identity */}
        <div>
          <h3 className="font-display font-black text-xl text-ink uppercase tracking-tight group-hover:text-brutal-red transition-colors">
            {student.name}
          </h3>
          <p className="text-xs font-bold text-ink/70 uppercase mt-0.5">
            {student.department} / {student.year}
          </p>
        </div>

        <div className="editorial-separator" />

        {/* MATCH REASONS */}
        <div className="space-y-1.5 bg-canvas p-3 border border-ink">
          <div className="text-[10px] font-bold text-ink/50 uppercase">
            MATCH REASONS:
          </div>
          <ul className="text-xs font-bold text-ink space-y-1 uppercase">
            <li className="flex items-center gap-1.5 text-campus-green">
              <span>●</span> 03 / 03 REQUIRED SKILLS
            </li>
            <li className="flex items-center gap-1.5 text-ink/80">
              <span>●</span> 02 / 03 SHARED INTERESTS
            </li>
            <li className="flex items-center gap-1.5 text-ink/80">
              <span>●</span> AVAILABLE WEEKENDS
            </li>
          </ul>
        </div>

        {/* SKILLS */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-ink/50 uppercase">
            SKILLS:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(matchedSkills.length > 0 ? matchedSkills : student.skills || []).map((sk) => (
              <span
                key={sk}
                className="px-2 py-0.5 border border-ink bg-white text-xs font-bold text-ink uppercase shadow-brutal-sm"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 mt-4 border-t-2 border-ink flex items-center justify-between gap-3">
        {onViewProfile && (
          <button
            type="button"
            onClick={() => onViewProfile(student)}
            className="text-xs font-bold text-ink hover:text-brutal-red uppercase"
          >
            [ VIEW PROFILE ]
          </button>
        )}

        <Button
          variant={isRequested ? 'secondary' : 'accent'}
          size="sm"
          disabled={isRequested}
          onClick={() => !isRequested && onConnect && onConnect(student)}
          className="ml-auto text-xs px-3 py-1.5"
        >
          {isRequested ? 'CONNECTED ✓' : '[ ESTABLISH CONNECTION → ]'}
        </Button>
      </div>
    </div>
  );
}
