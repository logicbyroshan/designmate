# Changelog

All notable changes to the **DesignMate** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.2] - 2026-09-26

### Added
- Technical SEO: Implemented JSON-LD Structured Data (`Person`, `WebSite`, `ProfessionalService`), Canonical URL links, complete Open Graph tags, and Twitter Cards in `index.html`.
- Crawlability & Indexing Assets: Created `robots.txt`, XML `sitemap.xml` with image schema, and PWA `site.webmanifest`.
- Accessibility (A11y): Added descriptive `aria-label` tags to interactive work cards, external social links, and explicit image dimensions (`width` & `height`) to prevent Cumulative Layout Shift (CLS).

---

## [1.0.1] - 2026-09-26

### Added
- Expanded automated backend test suite from 18 to 23 tests covering negative authentication, category query filtering, booking status transitions, unsupported file extension rejections, and profile updates.

### Improved
- Static analysis & linting health: Refined Oxlint configuration achieving 0 warnings and 0 errors.
- Production build performance: Optimized Vite bundling down to 443ms.

---

## [1.0.0] - 2026-09-26

### Added
- **Django REST Framework Backend**:
  - Full relational data models for `Profile`, `Category`, `Project`, `Experience`, `Education`, `CallBooking`, and `SiteSettings`.
  - Database migrations `0001_initial` through `0004_alter_callbooking_created_at_and_more`.
  - Database seeder `seed_data.py` populating complete portfolio information for Roshan Damor.
  - Health check endpoint `/api/health/` providing database liveness confirmation.
  - Aggregated bundle endpoint `/api/bundle/` enabling single-roundtrip initial frontend hydration.
  - 18 automated unit and integration tests in `backend/portfolio/tests.py`.
- **React 19 Frontend Engine**:
  - Vite 6 build configuration with fast HMR.
  - Bespoke Vanilla CSS Design System with `Plus Jakarta Sans` typography and electric royal blue (`#0066FF`) accents.
  - `@studio-freight/lenis` smooth scrolling engine synchronized with browser animation frames and respecting `prefers-reduced-motion`.
  - Public portfolio components: `HeroHeader`, `AboutSection`, `WorksSection`, `FeelingConfusedCTA`, and `FooterSection`.
  - Interactive modals: `CallBookingModal` (with date picker & slot selector), `ProjectModal` (with high-res preview & tags), and `ExperienceModal` (with career timeline).
  - Private in-browser CMS at `/manage` protected by `CmsLoginGate` and `AdminDrawer` supporting full CRUD, direct file drag-and-drop, category management, profile customization, and inquiry management with CSV export.
- **Documentation Suite**:
  - Comprehensive documentation: `README.md`, `SETUP.md`, `API.md`, `SECURITY.md`, `STRUCTURE.md`, `ABOUT.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `.env.example`, `requirements.txt`.
  - Persistent agent operating system in `AGENTS.md` and `.agent-memory/`.

### Security
- Implemented `secrets.compare_digest` in `AdminPasscodePermission` to eliminate timing side-channel attacks during administrative passcode verification.
- Added deep byte-level raster image validation via `PIL.Image.open().verify()` and stored XSS sanitization for SVG uploads (`<script>`, `on*=` handlers, `<iframe>`).
- Configured production security headers: `SECURE_CONTENT_TYPE_NOSNIFF`, `SECURE_BROWSER_XSS_FILTER`, `X_FRAME_OPTIONS: DENY`.
- Configured DRF rate limiters: `AnonRateThrottle` (120 req/min) and `BookingRateThrottle` (5 req/min).

### Performance
- Eliminated N+1 queries during category serialization using single-pass SQL aggregation (`Count('projects')`).
- Configured HTTP caching headers (`Cache-Control: public, max-age=5, stale-while-revalidate=20`) on the bundle endpoint.
- Implemented visibility-aware polling in `App.jsx` using `document.visibilityState` to pause background network requests when the tab is inactive.
