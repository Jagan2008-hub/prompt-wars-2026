import React, { useState } from 'react';
import { X, Plus, Sparkles, Calendar, Clock, Award, Layers } from 'lucide-react';
import { ProjectCategory, RoleType, ExperienceLevel, Project } from '../types';
import { useApp } from '../context/AppContext';
import { ALL_AVAILABLE_SKILLS, ALL_ROLES } from '../data/mockData';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (project: Project) => void;
}

const CATEGORIES: ProjectCategory[] = [
  'Hackathon', 'AI / ML', 'Startup', 'Research', 'College Project', 'Open Source', 'Robotics / IoT', 'FinTech'
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { createProject, addToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Hackathon');
  const [projectType, setProjectType] = useState('Hackathon & MVP');
  const [membersNeeded, setMembersNeeded] = useState<number>(4);
  const [deadline, setDeadline] = useState('2026-09-30');
  const [commitmentHours, setCommitmentHours] = useState<number>(15);
  const [availabilityRequirement, setAvailabilityRequirement] = useState('Flexible evenings & weekends');
  const [experiencePreference, setExperiencePreference] = useState<ExperienceLevel>('Intermediate');

  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'Python', 'AI/ML']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>(['Frontend', 'AI/ML Engineer', 'UI/UX Designer']);

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const toggleRole = (role: RoleType) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast('Please enter project title and description.', 'warning');
      return;
    }
    if (selectedSkills.length === 0) {
      addToast('Please select at least 1 required skill.', 'warning');
      return;
    }

    const created = createProject({
      title,
      description,
      category,
      project_type: projectType,
      members_needed: membersNeeded,
      deadline,
      commitment_hours: commitmentHours,
      availability_requirement: availabilityRequirement,
      experience_preference: experiencePreference,
      required_skills: selectedSkills,
      required_roles: selectedRoles,
      status: 'open',
    });

    if (onCreated) {
      onCreated(created);
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
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
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
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

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '9999px', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
            <Sparkles size={14} />
            <span>AI Team Matchmaker</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Create New Project</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Publish your project requirements. Our Gemini AI engine will automatically analyze skill gaps and recommend matching teammates.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Title & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. BioVision — Real-time AI Cellular Scanner"
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
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
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
                {CATEGORIES.map(c => (
                  <option key={c} value={c} style={{ background: '#0f172a', color: '#ffffff' }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
              Project Overview & Goals *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you building? What problem does it solve and what are the milestones?"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Required Roles */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
              Required Roles to Staff
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ALL_ROLES.map(role => {
                const isSelected = selectedRoles.includes(role);
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => toggleRole(role)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border-glass)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}{role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
              Required Technical & Domain Skills
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {ALL_AVAILABLE_SKILLS.slice(0, 16).map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--border-glass)',
                      color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                placeholder="Add custom skill (e.g. OpenCV, Solidity)..."
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="btn-secondary"
                style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '0.8rem' }}
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Team Size, Commitment & Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Team Size Needed
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={membersNeeded}
                onChange={(e) => setMembersNeeded(parseInt(e.target.value) || 4)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Commitment (Hrs/Wk)
              </label>
              <input
                type="number"
                min={5}
                max={40}
                value={commitmentHours}
                onChange={(e) => setCommitmentHours(parseInt(e.target.value) || 15)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Target Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} />
              <span>Publish & Find Teammates</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
