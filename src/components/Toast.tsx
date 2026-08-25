import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: '100%',
    }}>
      {toasts.map(toast => {
        let Icon = Info;
        let border = 'rgba(99, 102, 241, 0.4)';
        let iconColor = 'var(--accent-primary)';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          border = 'rgba(16, 185, 129, 0.4)';
          iconColor = 'var(--accent-emerald)';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          border = 'rgba(245, 158, 11, 0.4)';
          iconColor = 'var(--accent-amber)';
        }

        return (
          <div
            key={toast.id}
            className="glass-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              border: `1px solid ${border}`,
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.95)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              animation: 'slideIn 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon size={20} color={iconColor} />
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#ffffff' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
