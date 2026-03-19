'use client';
import React, { useState } from 'react';

const cardStyle: React.CSSProperties = {
  padding: '2rem',
  borderRadius: '15px',
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  color: '#F3F6E4',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  borderRadius: '0.75rem',
  background: 'rgba(0, 36, 46, 0.6)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'white',
  fontSize: '1rem',
};

const ssoButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  borderRadius: '0.75rem',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(0, 36, 46, 0.4)',
  color: 'white',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  transition: 'all 0.2s',
};

const Step1QuickStart = ({ onNext }: { onNext: (name: string) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'sso' | 'email'>('sso');
  const [loading, setLoading] = useState<string | null>(null);

  const handleSSO = (provider: string) => {
    setLoading(provider);
    setTimeout(() => {
      onNext(provider === 'google' ? 'User' : 'User');
    }, 800);
  };

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading('email');
    setTimeout(() => onNext(name.split(' ')[0]), 800);
  };

  return (
    <div style={cardStyle}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#D1EB0C' }}>
          Welcome to SunShare
        </h2>
        <p style={{ opacity: 0.7, fontSize: '0.95rem' }}>
          Create your account in seconds
        </p>
      </div>

      {mode === 'sso' ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => handleSSO('google')}
              disabled={!!loading}
              style={{
                ...ssoButtonStyle,
                background: loading === 'google' ? 'rgba(209, 235, 12, 0.1)' : 'rgba(0, 36, 46, 0.4)',
                border: loading === 'google' ? '1px solid rgba(209, 235, 12, 0.3)' : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {loading === 'google' ? (
                <span style={{ fontSize: '0.85rem', color: '#D1EB0C' }}>Signing in...</span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button
              onClick={() => handleSSO('facebook')}
              disabled={!!loading}
              style={{
                ...ssoButtonStyle,
                background: loading === 'facebook' ? 'rgba(209, 235, 12, 0.1)' : 'rgba(0, 36, 46, 0.4)',
              }}
            >
              {loading === 'facebook' ? (
                <span style={{ fontSize: '0.85rem', color: '#D1EB0C' }}>Signing in...</span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <button
            onClick={() => setMode('email')}
            style={{
              ...ssoButtonStyle,
              fontSize: '0.9rem',
              opacity: 0.7,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            Sign up with email
          </button>
        </>
      ) : (
        <form onSubmit={handleEmail}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
              Full Name
            </label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Juan dela Cruz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
              Email Address
            </label>
            <input
              type="email"
              style={inputStyle}
              placeholder="juan@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={!name || !email || !!loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '0.75rem',
              background: name && email ? '#D1EB0C' : 'rgba(209, 235, 12, 0.3)',
              border: 'none',
              color: '#00242E',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: name && email ? 'pointer' : 'not-allowed',
              marginBottom: '1rem',
            }}
          >
            {loading === 'email' ? 'Creating account...' : 'Create Account'}
          </button>
          <button
            type="button"
            onClick={() => setMode('sso')}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            &larr; Back to SSO options
          </button>
        </form>
      )}

      <p style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        opacity: 0.4,
        marginTop: '1.5rem',
        lineHeight: 1.5,
      }}>
        By continuing, you agree to SunShare's Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default Step1QuickStart;
