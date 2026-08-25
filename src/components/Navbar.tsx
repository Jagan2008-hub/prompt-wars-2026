import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Users, FolderGit2, LayoutDashboard, User, LogIn, LogOut, Menu, X, Bell, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const { currentUser, isAuthenticated, logout, profiles, switchDemoUser, notifications, markNotificationRead } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { label: 'Home', route: '/', icon: Sparkles, publicOnly: false },
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard, requiresAuth: true },
    { label: 'Community', route: '/community', icon: Users, publicOnly: false },
    { label: 'Projects', route: '/projects', icon: FolderGit2, publicOnly: false },
    { label: 'My Profile', route: '/profile', icon: User, requiresAuth: true },
  ];

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDemoMenuOpen(false);
        setNotifOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav
      aria-label="Main Navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '12px 24px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <button 
          onClick={() => navigate('/')}
          aria-label="ProjectMatch Home"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', padding: 0, textAlign: 'left' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
          }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Project<span className="gradient-text">Match</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--accent-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 700,
              marginTop: '-3px'
            }}>
              Smart Team Formation
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div style={{ alignItems: 'center', gap: '6px' }} className="nav-desktop-links" role="menubar">
          {navLinks.map(link => {
            if (link.requiresAuth && !isAuthenticated) return null;
            const isActive = currentRoute === link.route;
            const Icon = link.icon;
            return (
              <button
                key={link.route}
                onClick={() => navigate(link.route)}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section: Demo Switcher + Notifications + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Demo User Persona Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              aria-expanded={demoMenuOpen}
              aria-haspopup="true"
              aria-label="Switch demo student persona"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 500,
              }}
              title="Switch demo student persona"
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
              <span>{currentUser ? currentUser.full_name.split(' ')[0] : 'Demo User'}</span>
              <ChevronDown size={14} />
            </button>

            {demoMenuOpen && (
              <div 
                className="glass-card" 
                role="menu"
                aria-label="Demo Personas"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '240px',
                  padding: '8px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  SWITCH DEMO PERSONA:
                </div>
                {profiles.slice(0, 5).map(p => (
                  <button
                    key={p.id}
                    role="menuitem"
                    onClick={() => {
                      switchDemoUser(p.id);
                      setDemoMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: currentUser?.id === p.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      color: currentUser?.id === p.id ? '#ffffff' : 'var(--text-secondary)',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.full_name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.preferred_roles[0]} · {p.skills[0]}</div>
                    </div>
                    {currentUser?.id === p.id && <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem' }}>Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Popover */}
          {isAuthenticated && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                aria-expanded={notifOpen}
                aria-haspopup="true"
                aria-label={`Notifications (${unreadCount} unread)`}
                style={{
                  position: 'relative',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span 
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent-rose)',
                    }}
                  ></span>
                )}
              </button>

              {notifOpen && (
                <div 
                  className="glass-card" 
                  role="region"
                  aria-label="Notifications"
                  style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '300px',
                    padding: '12px',
                    zIndex: 200,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Notifications</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{unreadCount} new</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <button 
                        key={n.id}
                        type="button"
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.link) navigate(n.link);
                          setNotifOpen(false);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: n.read ? 'transparent' : 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid var(--border-glass)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>{n.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>{n.timestamp}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auth State Button */}
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              aria-label="Logout"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: '#fda4af',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <LogOut size={16} />
              <span className="hide-on-mobile">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              aria-label="Login"
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              padding: '6px',
            }}
            className="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          marginTop: '12px',
          padding: '16px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {navLinks.map(link => {
            if (link.requiresAuth && !isAuthenticated) return null;
            const isActive = currentRoute === link.route;
            const Icon = link.icon;
            return (
              <button
                key={link.route}
                onClick={() => {
                  navigate(link.route);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  textAlign: 'left',
                  fontSize: '0.95rem',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
