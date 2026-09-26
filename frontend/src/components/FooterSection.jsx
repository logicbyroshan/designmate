import React from 'react';

export default function FooterSection({ profile, isConnected }) {
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
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link">
          Instagram
        </a>
        <span style={{ color: '#CBD5E1' }}>|</span>
        <a href={figmaUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link">
          Figma
        </a>
        <span style={{ color: '#CBD5E1' }}>|</span>
        <a href={behanceUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link">
          Behance
        </a>
        <span style={{ color: '#CBD5E1' }}>|</span>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link">
          LinkedIn
        </a>
        <span style={{ color: '#CBD5E1' }}>|</span>
        <a href={dribbbleUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link">
          Dribbble
        </a>
        <span style={{ color: '#CBD5E1' }}>|</span>
        <a href="mailto:mail@logicbyroshan.in" className="footer-social-link" style={{ color: '#0066FF' }}>
          mail@logicbyroshan.in
        </a>
      </div>

      {/* API Status only — no admin button visible to public */}
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

        {/* Copyright */}
        <span style={{ fontSize: '0.76rem', color: '#94A3B8' }}>
          © 2026 Roshan Damor · All rights reserved
        </span>
      </div>
    </footer>
  );
}
