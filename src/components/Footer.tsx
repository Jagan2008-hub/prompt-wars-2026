import React from 'react';
import { Sparkles, Heart, Shield, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-glass)',
      background: 'rgba(9, 13, 22, 0.95)',
      padding: '48px 24px 24px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
          
          <div style={{ maxWidth: '360px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Sparkles size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Project<span className="gradient-text">Match</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              AI-powered team formation platform matching skills, availability, and complementary abilities with real-time skill gap detection.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff', marginBottom: '12px' }}>
                Platform
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>AI Matching Engine</span>
                <span>Skill Gap Detector</span>
                <span>AI Dream Team</span>
                <span>Team Workspaces</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff', marginBottom: '12px' }}>
                Built For
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Hackathons</span>
                <span>Research Teams</span>
                <span>Student Startups</span>
                <span>Competitions</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#ffffff', marginBottom: '12px' }}>
                Stack
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={14} color="var(--accent-cyan)" /> Google Gemini API</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={14} color="var(--accent-emerald)" /> Supabase Database</span>
                <span>React + Vite SPA</span>
                <span>Vercel Edge Ready</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            © {new Date().getFullYear()} ProjectMatch · Prompt Wars Hackathon
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted with</span>
            <Heart size={14} color="#f43f5e" fill="#f43f5e" />
            <span>for high-synergy builders</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
