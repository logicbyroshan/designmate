import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { API_ENDPOINTS } from './config/api';
import HeroHeader from './components/HeroHeader';
import AboutSection from './components/AboutSection';
import WorksSection from './components/WorksSection';
import FeelingConfusedCTA from './components/FeelingConfusedCTA';
import FooterSection from './components/FooterSection';
import ProjectModal from './components/ProjectModal';
import CallBookingModal from './components/CallBookingModal';
import ExperienceModal from './components/ExperienceModal';
import PrivacyModal from './components/PrivacyModal';
import CmsLoginGate from './components/CmsLoginGate';

const FALLBACK_PROFILE = {
  name: 'Roshan Damor',
  tagline: 'Graphic Designing',
  hero_title: 'PORTFOLIO',
  hero_year: '2026',
  designer_sign: 'Roshan Damor',
  location: 'Bhopal, Madhya Pradesh',
  bio_heading: "Hi! I'm Roshan Damor",
  bio_paragraph_1: "I'm a graphic designer based in Bhopal, Madhya Pradesh with a Diploma in Graphics from Mantra Institute and expertise in digital branding, advertising creatives, and industrial print production. Whether you need trend-focused social media visuals, print-ready brochures, corporate ID card systems, or photo retouching, I craft designs that command attention.",
  bio_paragraph_2: "With hands-on experience at Adarsh ID Cards and Miracle Organisation, I work seamlessly across Adobe Photoshop, CorelDRAW, Lightroom, and Canva — turning marketing ideas into pixel-perfect digital visuals and print-ready deliverables.",
  avatar_url: '/MePhoto.webp',
  instagram_url: 'https://instagram.com/logicbyroshan',
  figma_url: 'https://figma.com/@logicbyroshan',
  behance_url: 'https://behance.net/logicbyroshan',
  linkedin_url: 'https://linkedin.com/in/logicbyroshan',
  dribbble_url: 'https://dribbble.com/logicbyroshan',
  website_url: 'https://grafix.logicbyroshan.in',
  phone: '+91 9179924975',
  email: 'logicbyroshan@gmail.com',
  alt_email: 'mail@logicbyroshan.in',
  cta_title: 'Feeling Confused?',
  cta_subtext: "I'd love to chat with you about how I can help. Get in touch at",
  cta_bold_text: 'mail@logicbyroshan.in',
  cta_btn_text: 'Contact Me',
};

const FALLBACK_INDUSTRIES = [
  { id: 1, name: 'Social Media & Digital Ads', is_highlighted: true, order: 1 },
  { id: 2, name: 'Print Production & CMYK', is_highlighted: true, order: 2 },
  { id: 3, name: 'ID Cards & Corporate Lanyards', is_highlighted: true, order: 3 },
  { id: 4, name: 'Brochures & Prospectuses', is_highlighted: true, order: 4 },
  { id: 5, name: 'Photo Retouching & Manipulation', is_highlighted: false, order: 5 },
  { id: 6, name: 'Event Banners & Posters', is_highlighted: true, order: 6 },
  { id: 7, name: 'Political Campaign Creatives', is_highlighted: false, order: 7 },
  { id: 8, name: 'Thumbnails & Content Graphics', is_highlighted: true, order: 8 },
  { id: 9, name: 'Book Covers & Marketing Kits', is_highlighted: false, order: 9 },
  { id: 10, name: 'Brand Identity & Badges', is_highlighted: true, order: 10 },
];

// ── Portfolio page (main public view) ──────────────────────────────────────
function PortfolioPage({
  profile, categories, tools, industries, projects,
  experiences, education, isConnected,
}) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className="portfolio-container">
      <HeroHeader profile={profile} />

      <AboutSection
        profile={profile}
        tools={tools}
        industries={industries}
        onOpenExperience={() => setIsExperienceOpen(true)}
      />

      <WorksSection
        categories={categories}
        projects={projects}
        onSelectProject={setSelectedProject}
      />

      <FeelingConfusedCTA
        profile={profile}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      <FooterSection
        profile={profile}
        isConnected={isConnected}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      <CallBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      <ExperienceModal
        isOpen={isExperienceOpen}
        onClose={() => setIsExperienceOpen(false)}
        experiences={experiences}
        education={education}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}

// ── Root app with routing ──────────────────────────────────────────────────
export default function App() {
  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [categories, setCategories] = useState([]);
  const [tools, setTools] = useState([]);
  const [industries, setIndustries] = useState(FALLBACK_INDUSTRIES);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const fetchPortfolioData = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.bundle);
      if (response.ok) {
        const data = await response.json();
        if (data.profile) setProfile(data.profile);
        if (data.categories && data.categories.length > 0) setCategories(data.categories);
        if (data.tools && data.tools.length > 0) setTools(data.tools);
        if (data.industries && data.industries.length > 0) setIndustries(data.industries);
        if (data.projects && data.projects.length > 0) setProjects(data.projects);
        if (data.experiences) setExperiences(data.experiences);
        if (data.education) setEducation(data.education);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (err) {
      console.warn('Django API not reachable yet, using local state.', err);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();

    // Only poll when page is visible to conserve battery & network
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchPortfolioData();
      }
    }, 12000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchPortfolioData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchPortfolioData]);

  const sharedProps = {
    profile, categories, tools, industries,
    projects, experiences, education,
    isConnected, fetchPortfolioData,
  };

  return (
    <Router>
      <Routes>
        {/* Public portfolio */}
        <Route path="/" element={<PortfolioPage {...sharedProps} />} />

        {/* Password-protected CMS — accessible only at /manage */}
        <Route
          path="/manage"
          element={
            <CmsLoginGate
              profile={profile}
              categories={categories}
              projects={projects}
              onRefresh={fetchPortfolioData}
            />
          }
        />

        {/* 404 fallback → redirect to portfolio */}
        <Route path="*" element={<PortfolioPage {...sharedProps} />} />
      </Routes>
    </Router>
  );
}
