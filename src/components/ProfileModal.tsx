import React from 'react';
import { X, UserPlus, Clock, Award, BookOpen, ExternalLink, Calendar, MapPin, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  profile: UserProfile | null;
  onClose: () => void;
  onInvite: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose, onInvite }) => {
  if (!profile) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(3, 7, 18, 0.8)',
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
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          position: 'relative',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Close Button */}
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
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#ffffff',
            flexShrink: 0,
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
          }}>
            {profile.full_name.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '4px' }}>
              {profile.full_name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
              <MapPin size={15} color="var(--accent-cyan)" />
              <span>{profile.college} · {profile.course} ({profile.year_of_study})</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {profile.preferred_roles.map(role => (
                <span
                  key={role}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#c7d2fe',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {role}
                </span>
              ))}
              <span style={{
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#6ee7b7',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                {profile.experience_level} Level
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
            About
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {profile.bio || 'No bio provided yet.'}
          </p>
        </div>

        {/* Experience Summary */}
        {profile.experience_summary && (
          <div style={{ marginBottom: '24px', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
              <Award size={16} />
              <span>Track Record & Experience</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {profile.experience_summary}
            </p>
          </div>
        )}

        {/* Skills & Proficiencies */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.05em' }}>
            Technical & Soft Skills
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.skills.map(skill => (
              <span
                key={skill}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={12} color="var(--accent-primary)" />
                {skill}
                {profile.skill_proficiencies?.[skill] && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', opacity: 0.8 }}>
                    • {profile.skill_proficiencies[skill]}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Availability & Commitment */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <Clock size={14} color="var(--accent-primary)" />
              <span>Weekly Commitment</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              {profile.hours_per_week} hrs / week
            </div>
          </div>

          <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <Calendar size={14} color="var(--accent-emerald)" />
              <span>Schedule Preference</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              {profile.schedule_preference}
            </div>
          </div>
        </div>

        {/* Learning Goals */}
        {profile.learning_goals && profile.learning_goals.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.05em' }}>
              <BookOpen size={14} color="var(--accent-secondary)" />
              <span>Skills Wanting to Learn (Complementary Growth)</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {profile.learning_goals.map(goal => (
                <span
                  key={goal}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    color: '#ddd6fe',
                    fontSize: '0.8rem',
                  }}
                >
                  🎯 {goal}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {profile.portfolio_url && (
            <a
              href={profile.portfolio_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: 'var(--accent-cyan)',
                textDecoration: 'underline',
              }}
            >
              <ExternalLink size={14} />
              <span>Portfolio</span>
            </a>
          )}
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <ExternalLink size={14} />
              <span>GitHub</span>
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <ExternalLink size={14} />
              <span>LinkedIn</span>
            </a>
          )}
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button
            onClick={() => {
              onInvite(profile);
              onClose();
            }}
            className="btn-primary"
          >
            <UserPlus size={16} />
            <span>Invite to Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
