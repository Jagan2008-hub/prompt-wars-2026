import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthPageProps {
  navigate: (route: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ navigate }) => {
  const { login, signup, profiles, switchDemoUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          navigate('/dashboard');
        } else {
          setErrorMsg(res.error || 'Failed to login');
        }
      } else {
        const res = await signup(email, password, fullName);
        if (res.success) {
          navigate('/onboarding');
        } else {
          setErrorMsg(res.error || 'Failed to sign up');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    switchDemoUser(userId);
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        
        {/* Auth Form Card */}
        <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '24px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--gradient-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            }}>
              <Sparkles size={24} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#ffffff', marginBottom: '6px' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isLogin ? 'Sign in to access your matched teams and projects' : 'Join ProjectMatch to find high-synergy teammates'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-glass)',
            marginBottom: '24px',
          }}>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: isLogin ? 'var(--gradient-primary)' : 'transparent',
                color: isLogin ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: !isLogin ? 'var(--gradient-primary)' : 'transparent',
                color: !isLogin ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              Sign Up
            </button>
          </div>

          {errorMsg && (
            <div style={{ padding: '10px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', color: '#fda4af', fontSize: '0.85rem', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Arjun Mehta"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px' }}
            >
              <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Builder Profile'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* 1-Click Demo Personas for Quick Hackathon Showcase */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 700 }}>
            ⚡ Quick 1-Click Demo Personas
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {profiles.slice(0, 4).map(p => (
              <button
                key={p.id}
                onClick={() => handleQuickDemoLogin(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  textAlign: 'left',
                }}
              >
                <UserCheck size={14} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontWeight: 600 }}>{p.full_name.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.preferred_roles[0]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
