# Architecture Memory — Detailed System Design

## 1. High-Level Architecture Diagram

```text
[ Browser Client ]
       │
       ├───► GET /                (Public Portfolio View)
       │        └──► Single GET /api/bundle/ (Instant Hydration)
       │
       └───► GET /manage          (In-Browser Passcode Gate)
                └──► POST /api/projects/, PATCH /api/profile/, etc.
                         (Protected by X-Admin-Passcode)
                                 │
                                 ▼
                    [ Django REST Backend (8001) ]
                                 │
                         ┌───────┴───────┐
                         ▼               ▼
                 [ SQLite (WAL) ]   [ Media Storage ]
                 (Database Layer)   (Avatars & Works)
```

---

## 2. Backend Architecture (`backend/`)

### A. Settings & Database Layer (`backend/core/settings.py`)
- **Database Engine**: SQLite 3 with Write-Ahead Logging (`PRAGMA journal_mode=WAL;`) and a `20000ms` busy timeout to handle concurrent read/write operations without table lock contention.
- **Middleware Pipeline**:
  1. `SecurityMiddleware` (XSS filter, nosniff, frame denial)
  2. `CorsMiddleware` (Configurable `CORS_ALLOWED_ORIGINS` / `CORS_ALLOW_ALL_ORIGINS`)
  3. `SessionMiddleware` & `CommonMiddleware`
  4. `CsrfViewMiddleware` (Exempt on stateless API routes)
  5. `AuthenticationMiddleware` & `MessageMiddleware`
  6. `XFrameOptionsMiddleware`
- **Rate Throttles**:
  - `AnonRateThrottle`: `120/min` for general read endpoints.
  - `BookingRateThrottle`: `5/min` for POST `/api/bookings/` to prevent spam abuse.

### B. Relational Data Models (`backend/portfolio/models.py`)
- **`Profile`**: Singleton record for Roshan Damor. Stores bio, contact channels, experience counters, social URLs, and avatar image.
- **`Category`**: Project classification categories (`key`, `label`, `icon`, `order`, `is_active`). Indexed on `key` and `order`.
- **`Project`**: Portfolio items (`title`, `slug`, `category` FK with CASCADE, `description`, `full_details`, `client`, `year`, `live_url`, `github_url`, `image`, `tech_stack` JSON list, `is_featured`, `is_active`, `order`).
- **`Experience`**: Career history milestones (`company`, `role`, `period`, `description`, `order`, `is_current`).
- **`Education`**: Academic credentials (`institution`, `degree`, `field_of_study`, `period`, `order`).
- **`CallBooking`**: Client inquiry appointments (`client_name`, `email`, `phone`, `requested_date`, `requested_time`, `project_type`, `project_budget`, `message`, `status`). Indexed on `status` and `created_at`.
- **`SiteSettings`**: Site-wide toggles (`site_title`, `meta_description`, `open_for_work`, `maintenance_mode`).

### C. Security & Permissions (`backend/portfolio/permissions.py`)
- **`AdminPasscodePermission`**:
  - Checks incoming `X-Admin-Passcode` header or `Authorization: Bearer <passcode>`.
  - Uses `secrets.compare_digest(provided_passcode, settings.ADMIN_PASSCODE)` for constant-time comparison, neutralizing timing side-channel attacks.

### D. Serializers & Optimizations (`backend/portfolio/serializers.py`)
- **Single-Pass SQL Category Aggregation**: Category serializer fetches pre-calculated project counts from context (`Project.objects.values('category').annotate(count=Count('id'))`) to eliminate N+1 queries.
- **Deep PIL Validation**: Raster uploads are verified byte-by-byte via `PIL.Image.open(file).verify()`.
- **SVG Stored-XSS Sanitization**: Strips `<script>`, `<iframe>`, and `on*=` event handlers from uploaded SVG assets before saving.

### E. API Endpoints & Routes (`backend/portfolio/urls.py`)
- `GET /api/bundle/`: Single-roundtrip aggregated portfolio data with caching headers (`Cache-Control: public, max-age=5, stale-while-revalidate=20`).
- `GET /api/health/`: Liveness health check verifying database connectivity and timestamp.
- ViewSets at `/api/categories/`, `/api/projects/`, `/api/profile/`, `/api/experiences/`, `/api/educations/`, `/api/bookings/`, and `/api/settings/`.

---

## 3. Frontend Architecture (`frontend/`)

### A. Core Engine & Smooth Scrolling (`frontend/src/main.jsx`)
- Initializes `@studio-freight/lenis` smooth scrolling attached to `requestAnimationFrame`.
- Detects `window.matchMedia('(prefers-reduced-motion: reduce)')` to disable animated smooth scrolling for users requesting reduced motion.

### B. Route Management & Polling (`frontend/src/App.jsx`)
- Inspects `window.location.pathname` to render either the public portfolio (`/`) or the private CMS gate (`/manage`).
- Implements **visibility-aware polling**: attaches to `document.addEventListener('visibilitychange')` to halt background polling when the browser tab is hidden and trigger an immediate refresh when the user refocuses the tab.

### C. Public UI Component Hierarchy
```text
App.jsx
 ├── HeroHeader.jsx          (Hero, Availability Badge, Quick Links, Statistics)
 ├── AboutSection.jsx        (Bio Paragraphs, Experience Timeline, Education, Skills)
 ├── WorksSection.jsx        (Category Tabs with Counts, Dynamic Project Grid, Tags)
 ├── FeelingConfusedCTA.jsx  (Direct Consultation Booking Trigger)
 └── FooterSection.jsx       (Social Links, Copyright, Year)
```

### D. Modal System
- `CallBookingModal.jsx`: Interactive date-picker, time-slot selection grid, form validation, and instant feedback.
- `ProjectModal.jsx`: Full-screen work presentation with responsive layout, high-res previews, and tech badges.
- `ExperienceModal.jsx`: Deep timeline review of career milestones and impact metrics.
- All modals implement global `Escape` key close listeners and `aria-modal="true"`.

### E. CMS Management System (`frontend/src/components/`)
- `CmsLoginGate.jsx`: Renders a minimal passcode input at `/manage`. Validates passcode and transitions to the management interface upon success.
- `AdminDrawer.jsx`: Full-featured tabbed CMS dashboard:
  1. **Projects Tab**: Create, edit, and delete projects; direct drag-and-drop image uploader; tag manager; featured status toggle.
  2. **Categories Tab**: Dynamic category creation, slug generator, SVG icon picker, cascade delete protection warning.
  3. **Profile & Settings Tab**: Live profile info editor, stat counters, social URLs, open-for-work toggle.
  4. **Inquiries Tab**: Review client consultation requests, filter by status (Pending, Confirmed, Completed, Cancelled), and export to CSV.
