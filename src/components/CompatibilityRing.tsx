import React from 'react';

interface CompatibilityRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
}

export const CompatibilityRing: React.FC<CompatibilityRingProps> = ({
  score,
  size = 64,
  strokeWidth = 6,
  showLabel = true,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = 'var(--accent-emerald)'; // > 85
  if (score < 70) color = 'var(--accent-amber)';
  if (score < 50) color = 'var(--accent-rose)';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>

        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size > 70 ? '1.1rem' : '0.85rem',
          fontWeight: 800,
          color: '#ffffff',
        }}>
          {score}%
        </div>
      </div>
      {showLabel && (
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>
          {label || 'Match'}
        </span>
      )}
    </div>
  );
};
