import React from 'react';
import { Cpu, Palette, Zap, Compass, BookOpen, Dna } from 'lucide-react';
import { TeamDNA } from '../types';

interface TeamDNAChartProps {
  dna: TeamDNA;
}

export const TeamDNAChart: React.FC<TeamDNAChartProps> = ({ dna }) => {
  const axes = [
    { label: 'Technical Depth', score: dna.technical, icon: Cpu, color: 'var(--accent-primary)', barGradient: 'linear-gradient(90deg, #6366f1, #8b5cf6)' },
    { label: 'Creative & UX', score: dna.creative, icon: Palette, color: 'var(--accent-cyan)', barGradient: 'linear-gradient(90deg, #06b6d4, #3b82f6)' },
    { label: 'Execution Velocity', score: dna.execution, icon: Zap, color: 'var(--accent-emerald)', barGradient: 'linear-gradient(90deg, #10b981, #059669)' },
    { label: 'Leadership & Strategy', score: dna.leadership, icon: Compass, color: 'var(--accent-amber)', barGradient: 'linear-gradient(90deg, #f59e0b, #d97706)' },
    { label: 'Learning & Adaptability', score: dna.learning, icon: BookOpen, color: '#ec4899', barGradient: 'linear-gradient(90deg, #ec4899, #8b5cf6)' },
  ];

  return (
    <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Dna size={20} color="var(--accent-cyan)" />
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Team DNA Profile</h3>
        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', fontWeight: 700, marginLeft: 'auto' }}>
          AI Synergistic Synthesis
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {axes.map(axis => {
          const Icon = axis.icon;
          return (
            <div key={axis.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} color={axis.color} />
                  <span>{axis.label}</span>
                </div>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>{axis.score}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${axis.score}%`, height: '100%', background: axis.barGradient, borderRadius: '3px', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '12px 14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        🧬 <strong style={{ color: '#ffffff' }}>DNA Interpretation:</strong> {dna.dnaSummary}
      </div>
    </div>
  );
};
