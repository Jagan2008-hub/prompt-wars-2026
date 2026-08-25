import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  CheckSquare, 
  ListTodo, 
  Trash2, 
  X, 
  AlertCircle, 
  Activity, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkspaceTask } from '../types';

interface WorkspacePageProps {
  projectId: string;
  navigate: (route: string) => void;
  openProfileModal: (profile: any) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ projectId, navigate, openProfileModal }) => {
  const { projects, tasks, addTask, updateTaskStatus, currentUser } = useApp();

  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.project_id === projectId);

  const [filterMode, setFilterMode] = useState<'all' | 'my' | 'high' | 'done'>('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(currentUser?.id || '');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [taskDueDate, setTaskDueDate] = useState('2026-09-10');

  if (!project) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', padding: '24px' }}>
        <h2>Project Workspace Not Found</h2>
        <button onClick={() => navigate('/projects')} className="btn-primary" style={{ marginTop: '16px' }}>
          Back to Projects
        </button>
      </div>
    );
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const assigneeMember = project.members.find(m => m.user_id === taskAssignee);

    addTask({
      project_id: project.id,
      title: taskTitle,
      description: taskDesc,
      assigned_to_id: taskAssignee,
      assigned_to_name: assigneeMember?.profile?.full_name || currentUser?.full_name || 'Team Member',
      status: 'todo',
      priority: taskPriority,
      due_date: taskDueDate,
    });

    setTaskTitle('');
    setTaskDesc('');
    setIsTaskModalOpen(false);
  };

  // Filter tasks
  const displayedTasks = projectTasks.filter(t => {
    if (filterMode === 'my') return t.assigned_to_id === currentUser?.id;
    if (filterMode === 'high') return t.priority === 'high';
    if (filterMode === 'done') return t.status === 'done';
    return true;
  });

  const todoTasks = displayedTasks.filter(t => t.status === 'todo');
  const inProgressTasks = displayedTasks.filter(t => t.status === 'in_progress');
  const doneTasks = displayedTasks.filter(t => t.status === 'done');

  // Compute Project Health Metrics
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(t => t.status === 'done').length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 50;
  const projectHealthScore = Math.round((taskProgress * 0.4) + 52);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Back Link */}
      <button
        onClick={() => navigate(`/projects/${project.id}`)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Project Overview</span>
      </button>

      {/* Workspace Header */}
      <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', fontSize: '0.75rem', fontWeight: 600 }}>
                {project.category}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                ● Active Sprint
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>{project.title} · Team Workspace</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6ee7b7' }}>93%</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Team Fit</div>
            </div>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <Plus size={16} />
              <span>Add Sprint Task</span>
            </button>
          </div>
        </div>

        {/* Team Members Roster Strip */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '10px' }}>
            Sprint Roster & Assigned Roles ({project.members.length}):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {project.members.map(m => (
              <div
                key={m.user_id}
                onClick={() => m.profile && openProfileModal(m.profile)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-glass)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#ffffff' }}>
                  {m.profile?.full_name?.charAt(0) || 'M'}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>{m.profile?.full_name || 'Member'}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>({m.role})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Project Health & AI Insight Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project Health</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{projectHealthScore}%</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Task Progress</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{taskProgress}% ({completedTasks}/{totalTasks} Done)</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skill Coverage</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>91% Covered</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deadline Risk</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>Low · On Track</div>
          </div>
        </div>

        {/* AI Project Health Insight Card */}
        <div style={{ marginTop: '16px', padding: '14px 18px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={20} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: '#ffffff' }}>AI Sprint Health Insight:</strong> Your team exhibits high frontend and design velocity. Ensure backend API interfaces are finalized before moving Sprint tasks to production integration.
          </div>
        </div>

      </div>

      {/* Task Filters Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setFilterMode('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: filterMode === 'all' ? 'var(--gradient-primary)' : 'transparent',
              color: filterMode === 'all' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            All Tasks ({projectTasks.length})
          </button>
          <button
            onClick={() => setFilterMode('my')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: filterMode === 'my' ? 'var(--gradient-primary)' : 'transparent',
              color: filterMode === 'my' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            My Tasks
          </button>
          <button
            onClick={() => setFilterMode('high')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: filterMode === 'high' ? 'var(--gradient-primary)' : 'transparent',
              color: filterMode === 'high' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            High Priority
          </button>
          <button
            onClick={() => setFilterMode('done')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: filterMode === 'done' ? 'var(--gradient-primary)' : 'transparent',
              color: filterMode === 'done' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            Completed
          </button>
        </div>

        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          <Plus size={14} />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Task Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* COLUMN 1: TO DO */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></span>
              <span>To Do</span>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.06)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {todoTasks.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '120px' }}>
            {todoTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No pending tasks in backlog.
              </div>
            ) : (
              todoTasks.map(task => (
                <div key={task.id} style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>{task.title}</h4>
                    <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: task.priority === 'high' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: task.priority === 'high' ? '#fda4af' : '#fbbf24' }}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.description}</p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Assignee: {task.assigned_to_name || 'Unassigned'}</span>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: 'none', cursor: 'pointer' }}
                    >
                      Start →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: IN PROGRESS */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }}></span>
              <span>In Progress</span>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.06)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {inProgressTasks.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '120px' }}>
            {inProgressTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active tasks in development.
              </div>
            ) : (
              inProgressTasks.map(task => (
                <div key={task.id} style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>{task.title}</h4>
                    <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.description}</p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Assignee: {task.assigned_to_name || 'Unassigned'}</span>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'done')}
                      style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: 'none', cursor: 'pointer' }}
                    >
                      Complete ✓
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: DONE */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></span>
              <span>Completed</span>
            </div>
            <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.06)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {doneTasks.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '120px' }}>
            {doneTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No completed tasks yet.
              </div>
            ) : (
              doneTasks.map(task => (
                <div key={task.id} style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#34d399" />
                    <h4 style={{ fontSize: '0.9rem', color: '#ffffff', textDecoration: 'line-through' }}>{task.title}</h4>
                  </div>
                  {task.description && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.description}</p>
                  )}
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                    Completed by {task.assigned_to_name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Task Creation Modal */}
      {isTaskModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1200,
          background: 'rgba(3, 7, 18, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '28px', background: 'rgba(15, 23, 42, 0.96)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Add Sprint Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Integrate Gemini prompt schemas"
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task details & test criteria..."
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                    Assign To
                  </label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                  >
                    {project.members.map(m => (
                      <option key={m.user_id} value={m.user_id} style={{ background: '#0f172a' }}>
                        {m.profile?.full_name || 'Member'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem' }}
                  >
                    <option value="high" style={{ background: '#0f172a' }}>High Priority</option>
                    <option value="medium" style={{ background: '#0f172a' }}>Medium Priority</option>
                    <option value="low" style={{ background: '#0f172a' }}>Low Priority</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
