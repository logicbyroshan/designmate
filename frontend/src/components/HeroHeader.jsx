import React from 'react';

export default function HeroHeader({ profile }) {
  const currentYear = profile?.hero_year || '2026';
  const tagline = profile?.tagline || 'Graphic Designing';
  const mainTitle = profile?.hero_title || 'PORTFOLIO';
  const designerSign = profile?.designer_sign || 'Roshan Damor';

  return (
    <header className="hero-wrapper" id="hero">
      {/* Topographic Liquid Contour SVG Waves */}
      <svg
        className="hero-svg-bg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 450"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00358E" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0052D4" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0077E6" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0099FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#003399" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#00C6FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0072FF" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Deep background contours */}
        <path
          d="M0,120 C180,60 320,180 500,100 C680,20 840,160 1020,90 C1110,55 1160,80 1200,110 L1200,450 L0,450 Z"
          fill="url(#waveGrad1)"
        />
        
        {/* Mid flowing curves */}
        <path
          d="M0,220 C150,140 290,270 480,190 C670,110 820,290 1010,210 C1100,170 1150,210 1200,240 L1200,450 L0,450 Z"
          fill="url(#waveGrad2)"
        />

        {/* Topographic contour lines */}
        <path
          d="M-50,80 C200,20 350,190 560,110 C770,30 920,200 1150,100 C1220,70 1250,90 1280,120"
          fill="none"
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="1.8"
        />
        <path
          d="M-20,160 C220,90 380,260 600,170 C820,80 970,260 1180,180"
          fill="none"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.5"
        />
        <path
          d="M0,280 C240,210 410,360 660,250 C910,140 1020,330 1220,270"
          fill="none"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="1.2"
        />
        <path
          d="M50,370 C280,290 460,420 720,330 C980,240 1080,390 1250,340"
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
        />
        
        <ellipse cx="600" cy="225" rx="450" ry="180" fill="url(#glowGrad)" />
      </svg>

      {/* Top Header Row / Badge */}
      <div className="hero-top-row">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <span>Available for Graphic Design & Creative Direction</span>
        </div>
      </div>

      {/* Center Main Hero Typography */}
      <div className="hero-content">
        <div className="hero-tagline">{tagline}</div>
        <div className="hero-title-group">
          <h1 className="hero-title-main">{mainTitle}</h1>
          <span className="hero-year-rotated">{currentYear}</span>
        </div>
      </div>

      {/* Bottom Row: Designer Signature */}
      <div className="hero-footer">
        <div className="hero-signature">{designerSign}</div>
        <div className="hero-subservices">
          Brand Identity • Packaging • Editorial • Marketing Visuals
        </div>
      </div>
    </header>
  );
}
