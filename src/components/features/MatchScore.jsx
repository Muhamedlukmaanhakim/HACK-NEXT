import React from 'react';

export default function MatchScore({
  score = 0,
  size = 'md',
  showLabel = true,
  className = '',
}) {
  const rounded = Math.round(score);

  // SVG ring properties
  const radius = size === 'lg' ? 36 : size === 'md' ? 24 : 16;
  const stroke = size === 'lg' ? 6 : size === 'md' ? 4 : 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (rounded / 100) * circumference;

  const colorStroke =
    rounded >= 90
      ? '#2DD4BF' // Teal
      : rounded >= 80
      ? '#6366F1' // Indigo
      : '#F59E0B'; // Amber

  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-xs font-bold',
    md: 'text-sm font-bold',
    lg: 'text-xl font-bold',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="rgba(255, 255, 255, 0.08)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={colorStroke}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`${textSizes[size]} text-text-primary tracking-tight`}>
          {rounded}%
        </span>
        {size === 'lg' && showLabel && (
          <span className="text-[10px] uppercase font-semibold text-text-muted -mt-1">
            Match
          </span>
        )}
      </div>
    </div>
  );
}
