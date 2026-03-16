import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    localStorage.setItem('userRole', role);
    window.location.href = `/${role}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#fff', marginBottom: '0.5rem' }}>BussCon</h1>
        <p style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}>Founder–Investor & Operations Analytics Platform</p>
      </div>

      <div style={{ width: '100%', background: 'var(--panel-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff' }}>Select Role to Demo</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <button 
            onClick={() => handleLogin('founder')}
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-primary)' }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <User size={48} color="white" style={{ marginBottom: '1rem' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>Founder</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Submit ideas & track analytics</span>
          </button>

          <button 
            onClick={() => handleLogin('investor')}
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-primary)' }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Briefcase size={48} color="white" style={{ marginBottom: '1rem' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>Investor</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Browse deals & pipeline operations</span>
          </button>

        </div>
      </div>
    </div>
  );
}
