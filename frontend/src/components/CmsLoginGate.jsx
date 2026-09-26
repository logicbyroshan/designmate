import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, AlertTriangle, ArrowLeft } from 'lucide-react';
import AdminDrawer from './AdminDrawer';

// ─── CMS PASSCODE ──────────────────────────────────────────────────────────
const CMS_PASSCODE = 'superadmin';
// ───────────────────────────────────────────────────────────────────────────

export default function CmsLoginGate({ profile, categories, projects, onRefresh }) {
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('cms_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const inputRef = useRef(null);
  const lockIntervalRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !isAuthenticated) {
      inputRef.current.focus();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      if (lockIntervalRef.current) clearInterval(lockIntervalRef.current);
    };
  }, []);

  const handleLogin = () => {
    if (isLocked) return;

    if (passcode === CMS_PASSCODE) {
      setError('');
      try {
        sessionStorage.setItem('cms_authenticated', 'true');
        sessionStorage.setItem('cms_passcode', passcode);
      } catch (e) {
        console.warn('Session storage not available', e);
      }
      setIsAuthenticated(true);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      setPasscode('');

      if (newAttempts >= 5) {
        setIsLocked(true);
        setError('Too many attempts. Locked for 30 seconds.');
        let t = 30;
        setLockTimer(t);
        lockIntervalRef.current = setInterval(() => {
          t -= 1;
          setLockTimer(t);
          if (t <= 0) {
            clearInterval(lockIntervalRef.current);
            setIsLocked(false);
            setAttempts(0);
            setError('');
          }
        }, 1000);
      } else {
        setError(`Incorrect passcode. ${5 - newAttempts} attempt${5 - newAttempts === 1 ? '' : 's'} remaining.`);
      }
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('cms_authenticated');
      sessionStorage.removeItem('cms_passcode');
    } catch (e) {
      console.warn('Session storage error', e);
    }
    setIsAuthenticated(false);
    setPasscode('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  if (isAuthenticated) {
    return (
      <AdminDrawer
        isOpen={true}
        onClose={handleLogout}
        profile={profile}
        categories={categories}
        projects={projects}
        onRefresh={onRefresh}
        isFullPage={true}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="cms-gate-wrapper">
      {/* Animated dark background */}
      <div className="cms-gate-bg">
        <div className="cms-gate-grid" />
        <div className="cms-gate-glow cms-gate-glow-1" />
        <div className="cms-gate-glow cms-gate-glow-2" />
      </div>

      <div className={`cms-gate-card ${isShaking ? 'cms-gate-shake' : ''}`}>
        {/* Logo / Brand */}
        <div className="cms-gate-logo">
          <div className="cms-gate-icon-ring">
            <ShieldCheck size={28} color="#FFFFFF" />
          </div>
        </div>

        <div className="cms-gate-header">
          <h1 className="cms-gate-title">Portfolio CMS</h1>
          <p className="cms-gate-subtitle">
            Restricted access. Enter your passcode to manage content.
          </p>
        </div>

        {/* Login Form */}
        <div className="cms-gate-form">
          <label className="cms-gate-label">
            <Lock size={14} style={{ marginRight: 5, opacity: 0.7 }} />
            Admin Passcode
          </label>
          <div className="cms-gate-input-row">
            <input
              ref={inputRef}
              type={showPass ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter passcode..."
              className="cms-gate-input"
              disabled={isLocked}
              autoComplete="current-password"
            />
            <button
              className="cms-gate-eye-btn"
              onClick={() => setShowPass((v) => !v)}
              type="button"
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="cms-gate-error">
              <AlertTriangle size={14} />
              <span>{error}</span>
              {isLocked && <span className="cms-gate-lock-timer"> ({lockTimer}s)</span>}
            </div>
          )}

          <button
            className="cms-gate-submit"
            onClick={handleLogin}
            disabled={isLocked || !passcode.trim()}
          >
            {isLocked ? `Locked (${lockTimer}s)` : 'Access CMS'}
          </button>
        </div>

        {/* Back to portfolio & note */}
        <div style={{ marginTop: 20, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#94A3B8',
              fontSize: '0.84rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#38BDF8')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            <ArrowLeft size={14} /> Return to Public Portfolio
          </Link>
          <p className="cms-gate-footer-note" style={{ marginTop: 10 }}>
            🔒 Private area for Roshan Damor. Unauthorized access is not permitted.
          </p>
        </div>
      </div>
    </div>
  );
}
