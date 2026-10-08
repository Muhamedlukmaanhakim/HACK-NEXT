import React from 'react';

export default function RoleSelectCard({
  roleKey,
  selected,
  title,
  subtitle,
  bullets = [],
  icon: Icon,
  onSelect,
}) {
  return (
    <div
      onClick={() => onSelect(roleKey)}
      className={`p-5 cursor-pointer transition-all border-2 border-ink text-left relative ${
        selected
          ? 'bg-signal-yellow shadow-brutal translate-x-1 -translate-y-1'
          : 'bg-white hover:bg-canvas shadow-brutal-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 border-2 border-ink ${
              selected ? 'bg-white text-ink' : 'bg-canvas text-ink'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-display font-extrabold text-ink uppercase tracking-tight">
              {title}
            </h3>
            <p className="text-xs font-mono text-ink/70">{subtitle}</p>
          </div>
        </div>
        <span
          className={`text-xs font-mono font-bold px-2.5 py-1 border-2 border-ink ${
            selected
              ? 'bg-ink text-white'
              : 'bg-white text-ink'
          }`}
        >
          {selected ? '● ACTIVE' : '○ CHOOSE'}
        </span>
      </div>
      <ul className="text-xs text-ink/80 font-sans space-y-1 mt-3 pl-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-1.5 font-medium">
            <span className="text-brutal-red font-bold font-mono">›</span> {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
