import React, { useState, useEffect } from 'react';
import { X, Copy, Check, FileText, FolderGit2, ArrowRight } from 'lucide-react';
import { Project, DreamTeamResult } from '../types';

interface AITeamBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  dreamTeam: DreamTeamResult;
  onOpenWorkspace: () => void;
}

export const AITeamBriefModal: React.FC<AITeamBriefModalProps> = ({
  isOpen,
  onClose,
  project,
  dreamTeam,
  onOpenWorkspace,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const briefText = `📋 PROJECTMATCH TEAM BRIEF
==================================================
Project: ${project.title} (${project.category})
Team Compatibility Score: ${dreamTeam.teamCompatibilityScore}%
Skill Coverage: ${dreamTeam.skillCoverageScore}%
==================================================

👥 RECOMMENDED TEAM:
${dreamTeam.recommendedTeam.map((m, idx) => `${idx + 1}. ${m.profile.full_name} — ${m.assignedRole} (${m.matchScore}% Match)
   • Skills Contributed: ${m.contributedSkills.join(', ')}
   • Selection Note: "${m.selectionReason}"`).join('\n\n')}

🧬 TEAM DNA PROFILE:
• Technical Depth: ${dreamTeam.dna.technical}%
• Creative & UX: ${dreamTeam.dna.creative}%
• Execution Velocity: ${dreamTeam.dna.execution}%
• Leadership & Strategy: ${dreamTeam.dna.leadership}%
• Learning & Adaptability: ${dreamTeam.dna.learning}%
• Synthesis: "${dreamTeam.dna.dnaSummary}"

⚡ KEY TEAM STRENGTHS:
${dreamTeam.strengths.map(s => `✓ ${s}`).join('\n')}

⚠️ OPERATIONAL CAVEATS & RISKS:
${dreamTeam.potentialRisks.map(r => `• ${r}`).join('\n')}

🚀 RECOMMENDED ACTION:
Kick off Sprint 1 by scoping API interfaces in the Team Workspace and distributing initial Kanban tasks.
==================================================
Generated via ProjectMatch · Prompt Wars 2026`;

  const handleCopy = () => {
    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="glass-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-brief-title"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          background: 'rgba(15, 23, 42, 0.97)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close brief modal"
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <FileText size={22} color="var(--accent-cyan)" />
          <h2 id="team-brief-title" style={{ fontSize: '1.4rem', color: '#ffffff' }}>Team Executive Brief</h2>
          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700, marginLeft: 'auto' }}>
            Ready to Share
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Executive summary generated for <strong>{project.title}</strong> to share with mentors, judges, and teammates.
        </p>

        {/* Formatted Preview Box */}
        <div style={{
          padding: '18px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '10px',
          border: '1px solid var(--border-glass)',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          color: '#cbd5e1',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          maxHeight: '360px',
          overflowY: 'auto',
          marginBottom: '24px',
        }}>
          {briefText}
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={handleCopy}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.85rem' }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Team Brief'}</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenWorkspace();
              }}
              className="btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}
            >
              <FolderGit2 size={15} />
              <span>Go to Workspace</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
