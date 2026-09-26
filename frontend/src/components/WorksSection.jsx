import React, { useState } from 'react';
import {
  Eye,
  Megaphone,
  CreditCard,
  Package,
  Camera,
  BookOpen,
  Sparkles,
  Video,
  Palette,
  Image as ImageIcon,
  Layers,
  Monitor,
  Layout,
  Globe,
  PenTool,
  Printer,
  Flame,
  Zap,
  Award,
  Star,
  Plus,
} from 'lucide-react';

const ICON_MAP = {
  Megaphone,
  CreditCard,
  Package,
  Camera,
  BookOpen,
  Sparkles,
  Video,
  Palette,
  Image: ImageIcon,
  Layers,
  Monitor,
  Layout,
  Globe,
  PenTool,
  Printer,
  Flame,
  Zap,
  Award,
  Star,
};

const DEFAULT_CATEGORIES = [
  {
    key: 'Advertising',
    name: 'Social Media & Advertising Design',
    subtitle: 'Trend-focused Instagram creatives, viral YouTube thumbnails & promotional campaign visuals',
    icon_name: 'Megaphone',
  },
  {
    key: 'Branding',
    name: 'ID Cards & Brand Identity Systems',
    subtitle: 'Corporate PVC security cards, custom branded lanyards & executive business stationery',
    icon_name: 'CreditCard',
  },
  {
    key: 'Packaging',
    name: 'Print, Brochures & Packaging Prepress',
    subtitle: 'Prepress CMYK tri-fold brochures, college prospectuses, outdoor event flex banners & bottle labels',
    icon_name: 'Package',
  },
  {
    key: 'Art',
    name: 'Commercial Photo Retouching & Posters',
    subtitle: 'Studio skin retouching, color grading, lighting composites & festival event posters',
    icon_name: 'Camera',
  },
  {
    key: 'Editorial',
    name: 'Editorial Publications & Book Covers',
    subtitle: 'Academic institutional prospectuses, multi-page course guides & bestselling book cover jackets',
    icon_name: 'BookOpen',
  },
  {
    key: 'UI/UX',
    name: 'Digital Graphics & Web Promos',
    subtitle: 'Google Display Network ad sets, hero sliders & e-commerce promotional banners',
    icon_name: 'Sparkles',
  },
];

export default function WorksSection({ categories = [], projects = [], onSelectProject, onOpenAdmin }) {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const activeCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="works-section" id="works">
      {/* Outer Notched Border Container */}
      <div className="works-outer-card">
        {/* Inset Main Header Badge */}
        <div className="works-header-badge">
          <h2 className="works-main-title">MY WORKS</h2>
          <span className="works-subtitle">Graphic Design & Print Production Showcase</span>
        </div>

        {/* All Work Divided by Category Blocks */}
        <div className="category-blocks-container">
          {activeCategories.map((cat, secIdx) => {
            const catKey = cat.key || cat.name;
            const catTitle = cat.name || cat.title || catKey;
            const catSubtitle = cat.subtitle || '';
            const IconComponent = ICON_MAP[cat.icon_name] || Layers;

            // Filter projects for this category (matching by key or name case-insensitively)
            const sectionProjects = projects.filter((p) => {
              const pCat = (p.category || '').trim().toLowerCase();
              const cKey = (catKey || '').trim().toLowerCase();
              const cName = (catTitle || '').trim().toLowerCase();
              return pCat === cKey || pCat === cName;
            });

            return (
              <div key={cat.id || cat.key || secIdx} className="category-group-block">
                {/* Category Header with Title & Subtitle */}
                <div className="category-group-header">
                  <div>
                    <div className="category-group-title-row">
                      <div className="category-icon-pill">
                        <IconComponent size={18} />
                      </div>
                      <h3 className="category-group-title">{catTitle}</h3>
                    </div>
                    {catSubtitle && (
                      <p className="category-group-subtitle">{catSubtitle}</p>
                    )}
                  </div>
                  <span className="category-group-badge">
                    {sectionProjects.length} {sectionProjects.length === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>

                {/* Grid for This Category */}
                {sectionProjects.length > 0 ? (
                  <div className="works-grid">
                    {sectionProjects.map((project, index) => {
                      const imgSrc = project.image_url || project.image_url_fallback;
                      const hasError = imageErrors[project.id || index];

                      return (
                        <div
                          key={project.id || index}
                          className="work-card"
                          onClick={() => onSelectProject(project)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && onSelectProject(project)}
                        >
                          {imgSrc && !hasError ? (
                            <img
                              src={imgSrc}
                              alt={project.title}
                              className="work-card-img"
                              loading="lazy"
                              onError={() => handleImageError(project.id || index)}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(135deg, ${project.accent_color || '#0066FF'} 0%, #0F172A 100%)`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '24px',
                                textAlign: 'center',
                                color: '#FFFFFF',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  textTransform: 'uppercase',
                                  letterSpacing: 1.5,
                                  opacity: 0.85,
                                  fontWeight: 700,
                                }}
                              >
                                {project.category}
                              </span>
                              <strong style={{ fontSize: '1.15rem', marginTop: 6, fontWeight: 800 }}>
                                {project.title}
                              </strong>
                              <span style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: 4 }}>
                                {project.client || 'Client Project'}
                              </span>
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="work-card-overlay">
                            <span className="work-overlay-category">{project.category}</span>
                            <h3 className="work-overlay-title">{project.title}</h3>
                            <div className="work-overlay-footer">
                              <span>{project.client || project.year}</span>
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontWeight: 700,
                                  color: '#38BDF8',
                                }}
                              >
                                <Eye size={14} /> Case Study
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Standardized Empty State for Category */
                  <div className="ui-empty-state">
                    <div className="ui-empty-icon">
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h4 className="ui-empty-title">No works published in {catTitle} yet</h4>
                      <p className="ui-empty-desc">Projects added in this category will display here automatically.</p>
                    </div>
                    {onOpenAdmin && (
                      <button onClick={onOpenAdmin} className="btn btn-primary btn-sm">
                        <Plus size={14} /> Add First Work via CMS
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
