import React, { useEffect } from 'react';
import { X, Briefcase, GraduationCap } from 'lucide-react';

export default function ExperienceModal({ isOpen, onClose, experiences = [], education = [] }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultExperiences = [
    {
      id: 1,
      role: 'Graphics Designer',
      company: 'Adarsh ID Cards',
      location: 'Bhopal',
      period: 'Dec 2025 - Present',
      points: [
        'Designed ID cards, lanyards, business cards, & brochures with print-ready specifications.',
        'Created web banners, social media creatives, and digital assets for online platforms.',
        'Prepared graphics for both digital publishing and industrial print production.',
      ],
    },
    {
      id: 2,
      role: 'Graphic Design Intern',
      company: 'Miracle Organisation',
      location: 'Bhopal',
      period: 'Apr 2024 - July 2024',
      points: [
        'Created trend-focused social media creatives and promotional designs.',
        'Designed political campaign creatives for digital and print use.',
        'Designed banners, posters, and event materials for print and digital platforms.',
      ],
    },
  ];

  const defaultEducation = [
    {
      id: 1,
      degree: 'Diploma in Graphics',
      institution: 'Mantra Institute — Ujjain',
      period: '2020 - 2023',
      badge: 'Design Certification',
      color: '#0066FF',
    },
    {
      id: 2,
      degree: 'B.Tech — Computer Science',
      institution: 'UIT RGPV — Bhopal',
      period: '2023 - 2027',
      badge: 'Higher Education',
      color: '#10B981',
    },
  ];

  const activeExperiences = experiences && experiences.length > 0 ? experiences : defaultExperiences;
  const activeEducation = education && education.length > 0 ? education : defaultEducation;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="experience-modal-title">
      <div className="modal-content" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ padding: '36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#EFF6FF',
                color: '#0066FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Briefcase size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                Experience & Education
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Roshan Damor's professional background & design credentials
              </p>
            </div>
          </div>

          {/* Experience Timeline */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Briefcase size={16} style={{ color: '#0066FF' }} /> Work Experience
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activeExperiences.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '18px 20px',
                    background: '#F8FAFC',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                        {exp.role}
                      </h4>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0066FF' }}>
                        {exp.company}{exp.location ? ` — ${exp.location}` : ''}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', background: '#EFF6FF', color: '#1E40AF', padding: '3px 10px', borderRadius: 9999, fontWeight: 700 }}>
                      {exp.period}
                    </span>
                  </div>
                  {exp.points && exp.points.length > 0 && (
                    <ul style={{ margin: '10px 0 0 18px', fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
                      {exp.points.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <GraduationCap size={18} style={{ color: '#0066FF' }} /> Education & Training
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {activeEducation.map((edu, idx) => (
                <div key={edu.id || idx} style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px', background: '#F8FAFC' }}>
                  <span style={{ fontSize: '0.78rem', color: edu.color || (idx === 0 ? '#0066FF' : '#10B981'), fontWeight: 700, textTransform: 'uppercase' }}>
                    {edu.badge || (idx === 0 ? 'Design Certification' : 'Higher Education')}
                  </span>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                    {edu.degree}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{edu.institution}</p>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>{edu.period}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
            <button
              onClick={onClose}
              className="btn btn-primary btn-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
