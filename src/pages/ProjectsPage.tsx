import React, { useState } from 'react';
import { Search, Plus, Sparkles, FolderGit2, Calendar, Clock, Users, Zap, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectCategory, Project } from '../types';
import { CompatibilityRing } from '../components/CompatibilityRing';
import { calculateLocalMatch } from '../lib/gemini';

interface ProjectsPageProps {
  navigate: (route: string) => void;
  openCreateModal: () => void;
}

const CATEGORIES: (ProjectCategory | 'All')[] = [
  'All', 'Hackathon', 'AI / ML', 'Startup', 'Research', 'FinTech', 'Robotics / IoT', 'College Project'
];

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ navigate, openCreateModal }) => {
  const { projects, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.required_skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.required_roles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '9999px', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
            <Sparkles size={14} />
            <span>Project Marketplace</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: '#ffffff' }}>Explore Open Projects</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Join groundbreaking hackathon teams, research labs, and startups seeking your exact skill set.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.95rem' }}
        >
          <Plus size={18} />
          <span>Create Project</span>
        </button>
      </div>

      {/* Search & Category Pills */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by keywords, required skills (e.g. AI/ML, React, Hardware)..."
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: isSelected ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid transparent' : '1px solid var(--border-glass)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 700 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            No projects found matching your search criteria.
          </p>
          <button onClick={openCreateModal} className="btn-primary">
            Create First Project in This Category
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredProjects.map(project => {
            const match = currentUser ? calculateLocalMatch(project, currentUser) : { overallScore: 85 };
            const isUserMember = project.members.some(m => m.user_id === currentUser?.id);

            return (
              <div
                key={project.id}
                className="glass-card"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Category & Compatibility Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#c7d2fe',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      {project.category}
                    </span>

                    <CompatibilityRing score={match.overallScore} size={48} strokeWidth={4} showLabel={false} />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '8px', lineHeight: 1.3 }}>
                    {project.title}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {project.description}
                  </p>

                  {/* Required Roles */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                      Roles Needed:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {project.required_roles.map(r => (
                        <span
                          key={r}
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(6, 182, 212, 0.12)',
                            color: 'var(--accent-cyan)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                          }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Required Skills Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
                    {project.required_skills.slice(0, 4).map(skill => (
                      <span
                        key={skill}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-glass)',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {project.required_skills.length > 4 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '2px 4px' }}>
                        +{project.required_skills.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Specs Strip */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', padding: '10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users size={14} color="var(--accent-primary)" />
                      <span>{project.members.length} / {project.members_needed} Members</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} color="var(--accent-cyan)" />
                      <span>{project.commitment_hours}h / week</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '9px', fontSize: '0.85rem', justifyContent: 'center' }}
                  >
                    <span>View & Match</span>
                    <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => navigate(`/projects/${project.id}/ai-team`)}
                    className="btn-secondary"
                    style={{ padding: '9px 14px', fontSize: '0.85rem' }}
                    title="AI Dream Team Lab"
                  >
                    <Zap size={15} color="var(--accent-cyan)" />
                    <span>AI Team</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
