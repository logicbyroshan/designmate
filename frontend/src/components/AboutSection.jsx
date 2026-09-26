import React from 'react';
import { Briefcase, GraduationCap, MapPin, Phone } from 'lucide-react';

export default function AboutSection({ profile, industries = [], onOpenExperience }) {
  const bioHeading = profile?.bio_heading || "Hi! I'm Roshan Damor";
  const bioP1 = profile?.bio_paragraph_1 || "I'm a graphic designer based in Bhopal, Madhya Pradesh with a Diploma in Graphics from Mantra Institute and expertise in digital branding, advertising creatives, and industrial print production. Whether you need trend-focused social media visuals, print-ready brochures, corporate ID card systems, or photo retouching, I craft designs that command attention.";
  const bioP2 = profile?.bio_paragraph_2 || "With hands-on experience at Adarsh ID Cards and Miracle Organisation, I work seamlessly across Adobe Photoshop, CorelDRAW, Lightroom, and Canva — turning marketing ideas into pixel-perfect digital visuals and print-ready deliverables.";
  
  const avatarUrl = profile?.avatar_url || "/MePhoto.webp";
  const location = profile?.location || "Bhopal, Madhya Pradesh";
  const phone = profile?.phone || "+91 9179924975";

  return (
    <section className="about-section" id="about">
      {/* Top Part: Portrait + Bio */}
      <div className="about-grid">
        {/* Left Column: Portrait */}
        <div className="about-avatar-container">
          <img
            src={avatarUrl}
            alt={profile?.name ? `${profile.name} — Graphic Designer & Creative Director` : "Roshan Damor — Graphic Designer Portrait"}
            className="about-avatar-img"
            width="160"
            height="160"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/MePhoto.webp";
            }}
          />
        </div>

        {/* Right Column: Bio Content */}
        <div className="about-text-content">
          <div className="about-header-row">
            <h2 className="about-heading">{bioHeading}</h2>
            <div className="about-contact-badges">
              <span className="about-location-pill">
                <MapPin size={14} style={{ color: '#0066FF' }} /> {location}
              </span>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="about-phone-pill"
              >
                <Phone size={13} style={{ color: '#0066FF' }} /> {phone}
              </a>
            </div>
          </div>

          <p className="about-paragraph">{bioP1}</p>
          <p className="about-paragraph">{bioP2}</p>

          {/* Quick Experience Pills */}
          <div className="about-experience-pills">
            <div
              className="about-exp-pill about-exp-pill-work"
              onClick={onOpenExperience}
              style={{ cursor: 'pointer' }}
              title="Click to view full experience details"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onOpenExperience && onOpenExperience()}
            >
              <Briefcase size={14} style={{ color: '#0066FF' }} />
              <span>Adarsh ID Cards (Graphics Designer)</span>
            </div>

            <div
              className="about-exp-pill about-exp-pill-work"
              onClick={onOpenExperience}
              style={{ cursor: 'pointer' }}
              title="Click to view full experience details"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onOpenExperience && onOpenExperience()}
            >
              <Briefcase size={14} style={{ color: '#0066FF' }} />
              <span>Miracle Organisation (Design Intern)</span>
            </div>

            <div
              className="about-exp-pill about-exp-pill-edu"
              onClick={onOpenExperience}
              style={{ cursor: 'pointer' }}
              title="Click to view education & credentials"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onOpenExperience && onOpenExperience()}
            >
              <GraduationCap size={15} style={{ color: '#1D4ED8' }} />
              <span>Diploma in Graphics (Mantra Institute)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Part: Notched Cards for Tools & Industries */}
      <div className="skills-industries-grid">
        {/* Tools Notched Card - Extracted from Resume */}
        <div className="notched-card">
          <div className="notched-label">Design Software</div>
          <div className="tools-icons-row">
            {/* Photoshop Icon */}
            <div className="tool-badge-item tool-ps" title="Adobe Photoshop — Photo Manipulation & Social Graphics">
              <span>Ps</span>
            </div>

            {/* CorelDRAW Icon */}
            <div
              className="tool-badge-item"
              style={{
                background: '#1F3A1B',
                color: '#4ADE80',
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '1.2rem',
                border: '1px solid #2d5a27',
              }}
              title="CorelDRAW — Vector Illustration, ID Cards & Flex Banners"
            >
              <span>Cd</span>
            </div>

            {/* Lightroom Icon */}
            <div
              className="tool-badge-item"
              style={{
                background: '#001D2E',
                color: '#38BDF8',
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '1.2rem',
                border: '1px solid #003657',
              }}
              title="Adobe Lightroom — Photo Editing & Color Grading"
            >
              <span>Lr</span>
            </div>

            {/* Canva Icon */}
            <div
              className="tool-badge-item"
              style={{
                background: 'linear-gradient(135deg, #00C4CC 0%, #7D2AE8 100%)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '1.15rem',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
              title="Canva — Quick Social Creatives & Promotional Art"
            >
              <span>Cv</span>
            </div>

            {/* Premiere Pro Icon */}
            <div
              className="tool-badge-item"
              style={{
                background: '#2B003B',
                color: '#EA77FF',
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '1.2rem',
                border: '1px solid #4a0066',
              }}
              title="Adobe Premiere Pro — Video Editing & Reels"
            >
              <span>Pr</span>
            </div>

            {/* Figma Icon */}
            <div className="tool-badge-item tool-figma" title="Figma — UI/UX & Digital Layouts">
              <svg width="20" height="30" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
                <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
                <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
                <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
                <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Industries & Specializations Notched Card */}
        <div className="notched-card">
          <div className="notched-label">Skills & Production Specializations</div>
          <div className="industries-text-content">
            {industries.length > 0 ? (
              industries.map((ind, index) => (
                <React.Fragment key={ind.id || index}>
                  <span className={ind.is_highlighted ? "industry-item-bold" : "industry-item-normal"}>
                    {ind.name}
                  </span>
                  {index < industries.length - 1 && <span className="industry-separator">|</span>}
                </React.Fragment>
              ))
            ) : (
              <>
                <span className="industry-item-bold">Social Media & Digital Ads</span>
                <span className="industry-separator">|</span>
                <span className="industry-item-bold">Print Production & CMYK</span>
                <span className="industry-separator">|</span>
                <span className="industry-item-bold">ID Cards & Corporate Lanyards</span>
                <span className="industry-separator">|</span>
                <span className="industry-item-bold">Brochures & Prospectuses</span>
                <span className="industry-separator">|</span>
                <span className="industry-item-normal">Photo Retouching & Manipulation</span>
                <span className="industry-separator">|</span>
                <span className="industry-item-bold">Event Banners & Posters</span>
                <span className="industry-separator">|</span>
                <span className="industry-item-normal">Political Campaign Creatives</span>
                <span className="industry-separator">|</span>
                <span className="industry-item-bold">Thumbnails & Content Graphics</span>
                <span className="industry-separator">|</span>
                <span className="industry-item-normal">Book Covers & Marketing Kits</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
