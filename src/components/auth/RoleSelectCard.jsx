import React from 'react';

export default function RoleSelectCard({
  roleKey,
  selected,
  isSelected,
  title,
  subtitle,
  description,
  badgeText,
  bullets = [],
  icon: Icon,
  onSelect,
}) {
  const isCardSelected = selected || isSelected;
  const descText = subtitle || description;

  return (
    <div
      onClick={() => onSelect(roleKey)}
      className={`p-4 cursor-pointer transition-all border-2 border-ink text-left relative select-none ${
        isCardSelected
          ? 'bg-signal-yellow shadow-brutal translate-x-0.5 -translate-y-0.5'
          : 'bg-white hover:bg-canvas shadow-brutal-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div
              className={`p-2 border-2 border-ink ${
                isCardSelected ? 'bg-white text-ink' : 'bg-canvas text-ink'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.5]" />
            </div>
          )}
          <div>
            <h3 className="text-sm sm:text-base font-display font-black text-ink uppercase tracking-tight">
              {title}
            </h3>
            {descText && <p className="text-xs font-mono text-ink/75 mt-0.5">{descText}</p>}
          </div>
        </div>
        <span
          className={`text-[10px] font-mono font-bold px-2 py-0.5 border border-ink ${
            isCardSelected
              ? 'bg-ink text-canvas'
              : 'bg-white text-ink'
          }`}
        >
          {isCardSelected ? '● SELECTED' : '○ CHOOSE'}
        </span>
      </div>
      {bullets && bullets.length > 0 && (
        <ul className="text-xs text-ink/80 font-sans space-y-1 mt-2 pl-1">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-1.5 font-medium">
              <span className="text-brutal-red font-bold font-mono">›</span> {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
