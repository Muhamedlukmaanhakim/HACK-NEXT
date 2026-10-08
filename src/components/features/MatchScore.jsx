import React from 'react';

export default function MatchScore({
  score = 0,
  size = 'md',
  showLabel = true,
  className = '',
}) {
  const rounded = Math.round(score);

  const radius = size === 'lg' ? 38 : size === 'md' ? 26 : 18;
  const stroke = size === 'lg' ? 4 : size === 'md' ? 3 : 2.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (rounded / 100) * circumference;

  const colorStroke =
    rounded >= 90
      ? '#F26A2E' // Retro Orange
      : rounded >= 80
      ? '#F5B544' // Retro Amber
      : '#4D8B83'; // Retro Teal

  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-[11px] font-mono font-bold',
    md: 'text-xs font-mono font-bold',
    lg: 'text-lg font-mono font-bold',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${dimensions[size]} ${className}`}>
      {/* Scope Grid & Circular Gauge */}
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Outer Scope Border Ring */}
        <circle
          stroke="rgba(233, 223, 201, 0.12)"
          fill="#1B1915"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Active Telemetry Ring */}
        <circle
          stroke={colorStroke}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          strokeLinecap="butt"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* Scope Center Crosshair & Telemetry Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className={`${textSizes[size]} text-retro-paper tracking-tight`}>
          {rounded}%
        </span>
        {size === 'lg' && showLabel && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-retro-amber -mt-0.5">
            MATCH
          </span>
        )}
      </div>
    </div>
  );
}
