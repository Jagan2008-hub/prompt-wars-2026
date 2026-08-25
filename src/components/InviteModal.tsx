import React, { useState, useEffect } from 'react';
import { X, Send, FolderGit2 } from 'lucide-react';
import { UserProfile, RoleType } from '../types';
import { useApp } from '../context/AppContext';
import { ALL_ROLES } from '../data/mockData';

interface InviteModalProps {
  candidate: UserProfile | null;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ candidate, onClose }) => {
  const { projects, currentUser, inviteUserToProject, addToast } = useApp();
  const userProjects = projects.filter(p => p.creator_id === currentUser?.id || p.members.some(m => m.user_id === currentUser?.id));

  const [selectedProjectId, setSelectedProjectId] = useState<string>(userProjects[0]?.id || projects[0]?.id || '');
  const [selectedRole, setSelectedRole] = useState<RoleType>(candidate?.preferred_roles[0] || 'Developer');
  const [message, setMessage] = useState<string>(
    candidate ? `Hey ${candidate.full_name}, we'd love to invite you to join our project team!` : ''
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (candidate) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [candidate, onClose]);

  if (!candidate) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      addToast('Please select a project to invite this member to.', 'warning');
      return;
    }

    inviteUserToProject(selectedProjectId, candidate.id, selectedRole, message);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(3, 7, 18, 0.8)',
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
        aria-labelledby="invite-modal-title"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '28px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 id="invite-modal-title" style={{ fontSize: '1.3rem', color: '#ffffff' }}>
              Invite <span className="gradient-text">{candidate.full_name}</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Send an official team invite to collaborate on your project.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close invite modal"
            style={{
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
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Target Project Selector */}
          <div>
            <label htmlFor="invite-proj-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
              Select Project
            </label>
            <select
              id="invite-proj-select"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {p.title} ({p.category})
                </option>
              ))}
            </select>
          </div>

          {/* Role Offered */}
          <div>
            <label htmlFor="invite-role-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
              Offered Role
            </label>
            <select
              id="invite-role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as RoleType)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            >
              {ALL_ROLES.map(r => (
                <option key={r} value={r} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="invite-note-textarea" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
              Invitation Note
            </label>
            <textarea
              id="invite-note-textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why this candidate is a great fit..."
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Send size={16} />
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
