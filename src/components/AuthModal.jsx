import { useState } from 'react';
import { SLClose, SLMail, SLLock, SLUser, SLSystemEye, SLRefresh } from './icons/SLIcons';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%',
  padding: '11px 12px 11px 40px',
  background: 'rgba(5,8,15,0.7)',
  border: '1px solid rgba(78,154,254,0.2)',
  borderRadius: '2px',
  color: '#E8F0FF',
  fontSize: '0.82rem',
  letterSpacing: '0.05em',
  outline: 'none',
  fontFamily: 'Share Tech Mono, monospace',
  boxSizing: 'border-box',
};

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        if (!displayName.trim()) throw new Error('Please enter a display name');
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, ''));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (next) => { setMode(next); setError(''); };

  if (!isOpen) return null;

  const fieldBorder = (field) => focusedField === field
    ? '1px solid rgba(78,154,254,0.7)'
    : '1px solid rgba(78,154,254,0.2)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(5,8,15,0.88)' }}
        onClick={onClose}
      />

      {/* System Window */}
      <div
        className="relative w-full"
        style={{
          maxWidth: '420px',
          background: '#0D1E36',
          border: '1px solid rgba(78,154,254,0.28)',
          borderRadius: '4px',
          boxShadow: '0 0 60px rgba(78,154,254,0.12), inset 0 0 30px rgba(78,154,254,0.04)',
        }}
      >
        {/* Top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #4E9AFE 30%, #76FFFA 50%, #4E9AFE 70%, transparent)',
        }} />

        {/* Corner accent marks */}
        <div style={{ position: 'absolute', top: '6px', left: '6px', width: '10px', height: '10px', borderTop: '1px solid rgba(78,154,254,0.5)', borderLeft: '1px solid rgba(78,154,254,0.5)' }} />
        <div style={{ position: 'absolute', top: '6px', right: '6px', width: '10px', height: '10px', borderTop: '1px solid rgba(78,154,254,0.5)', borderRight: '1px solid rgba(78,154,254,0.5)' }} />
        <div style={{ position: 'absolute', bottom: '6px', left: '6px', width: '10px', height: '10px', borderBottom: '1px solid rgba(78,154,254,0.5)', borderLeft: '1px solid rgba(78,154,254,0.5)' }} />
        <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '10px', height: '10px', borderBottom: '1px solid rgba(78,154,254,0.5)', borderRight: '1px solid rgba(78,154,254,0.5)' }} />

        {/* Header bar */}
        <div style={{
          borderBottom: '1px solid rgba(78,154,254,0.18)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SLSystemEye size={16} style={{ color: '#4E9AFE' }} />
            <span style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              color: '#4A6FA5',
            }}>
              SYSTEM — {mode === 'login' ? 'AUTHENTICATION' : 'REGISTRATION'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#4A6FA5', padding: '4px', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#E8F0FF'}
            onMouseLeave={e => e.currentTarget.style.color = '#4A6FA5'}
          >
            <SLClose size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 24px' }}>

          {/* Title block */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '1rem',
              letterSpacing: '0.12em',
              color: '#E8F0FF',
              marginBottom: '8px',
            }}>
              {mode === 'login' ? 'WELCOME BACK, HUNTER' : 'BEGIN YOUR JOURNEY'}
            </h2>
            <p style={{ color: '#4A6FA5', fontSize: '0.78rem', letterSpacing: '0.04em' }}>
              {mode === 'login'
                ? 'Sign in to continue your ascension'
                : 'Create an account to start leveling up'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '16px',
              padding: '10px 14px',
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.28)',
              borderLeft: '2px solid #EF4444',
              borderRadius: '2px',
              color: '#FCA5A5',
              fontSize: '0.78rem',
              fontFamily: 'Share Tech Mono, monospace',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px',
              background: 'rgba(78,154,254,0.06)',
              border: '1px solid rgba(78,154,254,0.22)',
              borderRadius: '2px',
              color: '#E8F0FF',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              fontFamily: 'Orbitron, sans-serif',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              marginBottom: '20px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = 'rgba(78,154,254,0.12)'; e.currentTarget.style.borderColor = 'rgba(78,154,254,0.45)'; }}}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(78,154,254,0.06)'; e.currentTarget.style.borderColor = 'rgba(78,154,254,0.22)'; }}
          >
            {isLoading ? (
              <SLRefresh size={18} className="animate-spin" style={{ color: '#4E9AFE' }} />
            ) : (
              <>
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                CONTINUE WITH GOOGLE
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(78,154,254,0.14)' }} />
            <span style={{ color: '#4A6FA5', fontSize: '0.62rem', letterSpacing: '0.2em', fontFamily: 'Orbitron, sans-serif' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(78,154,254,0.14)' }} />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mode === 'signup' && (
              <div style={{ position: 'relative' }}>
                <SLUser size={15} style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: focusedField === 'name' ? '#4E9AFE' : '#4A6FA5', pointerEvents: 'none',
                  transition: 'color 0.2s',
                }} />
                <input
                  type="text"
                  placeholder="Hunter name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle, border: fieldBorder('name') }}
                />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <SLMail size={15} style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: focusedField === 'email' ? '#4E9AFE' : '#4A6FA5', pointerEvents: 'none',
                transition: 'color 0.2s',
              }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                style={{ ...inputStyle, border: fieldBorder('email') }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <SLLock size={15} style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: focusedField === 'password' ? '#4E9AFE' : '#4A6FA5', pointerEvents: 'none',
                transition: 'color 0.2s',
              }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                minLength={6}
                style={{ ...inputStyle, border: fieldBorder('password') }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px',
                background: 'rgba(78,154,254,0.1)',
                border: '1px solid rgba(78,154,254,0.5)',
                borderRadius: '2px',
                color: '#E8F0FF',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: '0 0 16px rgba(78,154,254,0.12)',
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = 'rgba(78,154,254,0.2)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(78,154,254,0.3)'; }}}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(78,154,254,0.1)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(78,154,254,0.12)'; }}
            >
              {isLoading
                ? <SLRefresh size={18} className="animate-spin" style={{ color: '#4E9AFE' }} />
                : mode === 'login' ? '[ SIGN IN ]' : '[ CREATE ACCOUNT ]'
              }
            </button>
          </form>

          {/* Toggle mode */}
          <p style={{ marginTop: '20px', textAlign: 'center', color: '#4A6FA5', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
            {mode === 'login' ? (
              <>
                New hunter?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  style={{ background: 'none', border: 'none', color: '#4E9AFE', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit', letterSpacing: '0.04em', padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#76FFFA'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4E9AFE'}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  onClick={() => switchMode('login')}
                  style={{ background: 'none', border: 'none', color: '#4E9AFE', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit', letterSpacing: '0.04em', padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#76FFFA'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4E9AFE'}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Bottom glow line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(78,154,254,0.4), transparent)',
        }} />
      </div>
    </div>
  );
};

export default AuthModal;
