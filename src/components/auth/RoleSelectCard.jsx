import React from 'react';

export default function RoleSelectCard({
  roleKey,
  selected,
  title,
  subtitle,
  description,
  icon: Icon,
  onSelect,
}) {
  return (
    <div
      onClick={() => onSelect(roleKey)}
      className={`p-4 cursor-pointer transition-all border text-left relative ${
        selected
          ? 'bg-retro-surface-elevated border-retro-coral shadow-panel ring-1 ring-retro-coral/40'
          : 'bg-retro-surface border-retro-border hover:border-retro-paper/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 border ${
              selected
                ? 'border-retro-coral text-retro-coral bg-retro-surface'
                : 'border-retro-border text-retro-muted'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-display font-bold text-retro-paper uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-[10px] text-retro-muted">{subtitle}</p>
          </div>
        </div>
        <span
          className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${
            selected
              ? 'border-retro-coral text-retro-coral bg-retro-coral/10'
              : 'border-retro-border text-retro-muted'
          }`}
        >
          {selected ? '● SELECTED' : '○ SELECT'}
        </span>
      </div>
      <p className="text-xs text-retro-paper/70 font-sans leading-relaxed">
        {description}
      </p>
    </div>
  );
}
