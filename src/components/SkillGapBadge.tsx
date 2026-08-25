import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface SkillGapBadgeProps {
  status: 'Covered' | 'Partial' | 'Missing';
  skill: string;
  coveredBy?: string[];
}

export const SkillGapBadge: React.FC<SkillGapBadgeProps> = ({ status, skill, coveredBy }) => {
  let bg = 'rgba(16, 185, 129, 0.12)';
  let border = 'rgba(16, 185, 129, 0.3)';
  let color = '#34d399';
  let Icon = CheckCircle2;

  if (status === 'Partial') {
    bg = 'rgba(245, 158, 11, 0.12)';
    border = 'rgba(245, 158, 11, 0.3)';
    color = '#fbbf24';
    Icon = AlertTriangle;
  } else if (status === 'Missing') {
    bg = 'rgba(244, 63, 94, 0.12)';
    border = 'rgba(244, 63, 94, 0.3)';
    color = '#f87171';
    Icon = XCircle;
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '5px 10px',
      borderRadius: '8px',
      background: bg,
      border: `1px solid ${border}`,
      color: color,
      fontSize: '0.8rem',
      fontWeight: 600,
    }}>
      <Icon size={14} />
      <span>{skill}</span>
      <span style={{
        fontSize: '0.65rem',
        textTransform: 'uppercase',
        opacity: 0.85,
        marginLeft: '2px',
        padding: '1px 5px',
        borderRadius: '4px',
        background: 'rgba(0,0,0,0.2)'
      }}>
        {status}
      </span>
      {coveredBy && coveredBy.length > 0 && status === 'Covered' && (
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          ({coveredBy[0]})
        </span>
      )}
    </div>
  );
};
