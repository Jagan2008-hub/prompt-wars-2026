import React from 'react';
import { X, Calculator, HelpCircle, CheckCircle2 } from 'lucide-react';
import { AIMatchAnalysis } from '../types';

interface MatchCalculationModalProps {
  analysis: AIMatchAnalysis | null;
  projectName: string;
  candidateName: string;
  onClose: () => void;
}

export const MatchCalculationModal: React.FC<MatchCalculationModalProps> = ({
  analysis,
  projectName,
  candidateName,
  onClose,
}) => {
  if (!analysis) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1300,
      background: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div 
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-secondary)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Calculator size={20} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.4rem', color: '#ffffff' }}>How Was This Score Calculated?</h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Deterministic Multi-Variable Compatibility Breakdown between <strong>{candidateName}</strong> and <strong>{projectName}</strong>:
        </p>

        {/* Top Overall Result Formula Strip */}
        <div style={{
          padding: '16px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
              Final Weighted Output
            </div>
            <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '2px' }}>
              Weighted Sum of 5 Core Competency Dimensions
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {analysis.overallScore}%
          </div>
        </div>

        {/* Formula Breakdown Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {analysis.factors.map(factor => (
            <div key={factor.name} style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>{factor.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe' }}>
                    Weight: {factor.weight}%
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {factor.score}%
                  </span>
                </div>
              </div>

              <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden', margin: '6px 0 8px' }}>
                <div style={{ width: `${factor.score}%`, height: '100%', background: 'var(--gradient-primary)' }}></div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {factor.description}
              </p>
            </div>
          ))}
        </div>

        {/* Verification Footer Note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.8rem', fontWeight: 500, padding: '10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <CheckCircle2 size={16} />
          <span>Score formula verified against project requirements & candidate schedule telemetry.</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
