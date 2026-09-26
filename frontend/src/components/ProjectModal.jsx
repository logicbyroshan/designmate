import React, { useEffect } from 'react';
import { X, Calendar, User, Tag, ArrowUpRight, Sparkles } from 'lucide-react';

export default function ProjectModal({ project, onClose, onOpenBooking }) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const imgSrc = project.image_url || project.image_url_fallback;
  const tagsList = project.tags
    ? project.tags.split(',').map(t => t.trim())
    : ['Graphic Design', 'Art Direction'];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Project Image */}
        {imgSrc && (
          <div style={{ width: '100%', height: 320, overflow: 'hidden', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <img
              src={imgSrc}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <div style={{ padding: '32px' }}>
          {/* Header & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span
              style={{
                background: '#EFF6FF',
                color: '#0066FF',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 9999,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {project.category}
            </span>
            {project.year && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.85rem',
                  color: '#64748B',
                }}
              >
                <Calendar size={14} /> {project.year}
              </span>
            )}
            {project.client && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.85rem',
                  color: '#64748B',
                }}
              >
                <User size={14} /> {project.client}
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
            {project.title}
          </h2>

          {project.subtitle && (
            <h4 style={{ fontSize: '1.05rem', color: '#64748B', fontWeight: 500, marginBottom: 20 }}>
              {project.subtitle}
            </h4>
          )}

          {/* Description */}
          <div style={{ marginBottom: 24, lineHeight: 1.7, color: '#334155', fontSize: '1rem' }}>
            <p>{project.description}</p>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {tagsList.map((tag, i) => (
              <span key={i} className="badge badge-neutral">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: 18, flexWrap: 'wrap' }}>
            {project.external_url && (
              <a
                href={project.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-md"
              >
                Live Preview <ArrowUpRight size={15} />
              </a>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="btn btn-primary btn-md"
            >
              <Sparkles size={16} /> Request Similar Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
