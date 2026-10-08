import React from 'react';

export default function MatchScore({
  score = 0,
  size = 'md',
  showLabel = true,
  className = '',
}) {
  const rounded = Math.round(score);

  const radius = size === 'lg' ? 38 : size === 'md' ? 26 : 18;
  const stroke = size === 'lg' ? 5 : size === 'md' ? 4 : 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (rounded / 100) * circumference;

  const colorStroke =
    rounded >= 90
      ? '#FF4D2E' // Brutal red
      : rounded >= 80
      ? '#FFD43B' // Signal yellow
      : '#3FA66B'; // Campus green

  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-[11px] font-mono font-bold',
    md: 'text-xs font-mono font-bold',
    lg: 'text-xl font-display font-black',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${dimensions[size]} ${className}`}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Outer Circle */}
        <circle
          stroke="#111111"
          fill="#FFFFFF"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Score Fill */}
        <circle
          stroke={colorStroke}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          strokeLinecap="square"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className={`${textSizes[size]} text-ink tracking-tight`}>
          {rounded}%
        </span>
        {size === 'lg' && showLabel && (
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-ink/70 -mt-0.5">
            MATCH
          </span>
        )}
      </div>
    </div>
  );
}
