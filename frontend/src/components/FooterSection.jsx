import React from 'react';

export default function FooterSection({ profile, isConnected, onOpenPrivacy }) {
  const instagramUrl = profile?.instagram_url || "https://instagram.com/logicbyroshan";
  const figmaUrl = profile?.figma_url || "https://figma.com/@logicbyroshan";
  const behanceUrl = profile?.behance_url || "https://behance.net/logicbyroshan";
  const linkedinUrl = profile?.linkedin_url || "https://linkedin.com/in/logicbyroshan";
  const dribbbleUrl = profile?.dribbble_url || "https://dribbble.com/logicbyroshan";

  return (
    <footer className="portfolio-footer">
      {/* Centered Socials Line */}
      <div className="footer-socials">
        <span>Checkout my socials at</span>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Visit Roshan Damor's Instagram profile">
          Instagram
        </a>
        <span style={{ color: '#CBD5E1' }}>|</span>
        <a href={figmaUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Visit Roshan Damor's Figma community profile">
          Figma
        </a>
        <span style={{ color: '#CBD5E1' }}>|</span>
        <a href={behanceUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Visit Roshan Damor's Behance portfolio">
          Behance
        </a>
        <span style={{ color: '#CBD5E1' }}>|</span>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Connect with Roshan Damor on LinkedIn">
          LinkedIn
        </a>
        <span style={{ color: '#CBD5E1' }}>|</span>
        <a href={dribbbleUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="View Roshan Damor's Dribbble shots">
          Dribbble
        </a>
        <span style={{ color: '#CBD5E1' }}>|</span>
        <a href="mailto:mail@logicbyroshan.in" className="footer-social-link" style={{ color: '#0066FF' }} aria-label="Send direct email to Roshan Damor">
          mail@logicbyroshan.in
        </a>
      </div>

      {/* API Status & Privacy Notice bar */}
      <div className="footer-backend-bar">
        <div className="status-indicator">
          <span
            className="status-dot"
            style={{ background: isConnected ? '#10B981' : '#EF4444' }}
          />
          <span>
            {isConnected ? '● Live — Roshan Damor Portfolio 2026' : 'Loading portfolio data...'}
          </span>
        </div>

        {/* DPDP Privacy Notice Link & Copyright */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.76rem', color: '#94A3B8' }}>
          <button
            type="button"
            onClick={onOpenPrivacy}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: 'inherit',
              padding: 0,
              textDecoration: 'underline',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.target.style.color = '#94A3B8'; }}
            aria-label="Open Digital Personal Data Protection Privacy Notice"
          >
            Privacy Notice (DPDP)
          </button>
          <span>•</span>
          <span>© 2026 Roshan Damor · All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
