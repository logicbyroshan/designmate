# AGENTS.md — Agent Operating System & Instruction Manual

> **DesignMate**: Full-stack Modern Portfolio & Headless In-Browser CMS  
> **Client / Portfolio Subject**: Roshan Damor — Graphic Designer & Creative Director (Bhopal, MP, India)  
> **Target Production Quality**: 10/10 across Architecture, Security, UI/UX, Performance, and Maintainability

---

## 1. Project Overview & Architecture

DesignMate is a decoupled, production-grade web application:
- **Backend**: Django 5.1 + Django REST Framework (DRF) running on Python 3.11+. Serves REST APIs with SQLite in Write-Ahead Logging (`WAL`) mode, rate limiting, and timing-safe passcode security.
- **Frontend**: React 19 + Vite 6 + Vanilla CSS Design System. Includes `@studio-freight/lenis` smooth scrolling, `Plus Jakarta Sans` typography, and single-pass bundle data hydration.
- **Public View (`/`)**: High-performance portfolio showing Roshan Damor's creative work, interactive modals, client booking scheduler, and experience history. Completely clean with NO exposed admin buttons or public management triggers.
- **In-Browser CMS (`/manage`)**: Passcode-protected administrative dashboard (`superadmin` by default). Provides full CRUD for Projects, dynamic Categories, Profile details, Site Settings, and Client Inquiries with CSV export.

---

## 2. Important Directories & File Map

```text
DesignMate/
├── .agent-memory/              # Persistent memory for AI agent sessions (DO NOT DELETE)
│   ├── PROJECT.md              # High-level overview, dependencies, constraints
│   ├── ARCHITECTURE.md         # Data flow, schema, backend & frontend design
│   ├── CONVENTIONS.md          # Naming, styling, coding, and API patterns
│   ├── DECISIONS.md            # Architecture Decision Records (ADRs)
│   ├── CURRENT_STATE.md        # Current snapshot of implemented features
│   ├── KNOWN_ISSUES.md         # Tracked technical debt and non-breaking warnings
│   ├── SECURITY.md             # Security architecture, constant-time auth, media checks
│   ├── TASK_HISTORY.md         # Chronological log of agent tasks
│   └── sessions/               # Extended session-specific notes
├── AGENTS.md                   # This instruction manual
├── CHANGELOG.md                # Human-readable change log
├── README.md, SETUP.md, ...    # Complete public production documentation suite
├── backend/
│   ├── core/
│   │   ├── settings.py         # Django settings (WAL mode, CORS, DRF throttles, security headers)
│   │   ├── urls.py             # Root URL configuration (admin, api, media serving)
│   │   ├── wsgi.py / asgi.py   # WSGI/ASGI entrypoints
│   ├── portfolio/
│   │   ├── models.py           # Profile, Category, Project, Experience, Education, CallBooking, SiteSettings
│   │   ├── permissions.py      # AdminPasscodePermission (secrets.compare_digest)
│   │   ├── serializers.py      # PIL image validation, SVG script stripping, single-pass N+1 aggregation
│   │   ├── views.py            # PortfolioBundleView, ModelViewSets, HealthCheckView
│   │   ├── urls.py             # API Router + /api/bundle/ + /api/health/
│   │   ├── tests.py            # 18 automated unit & integration tests
│   │   └── management/commands/
│   │       └── seed_data.py    # Database seeder with Roshan Damor's creative portfolio
│   └── media/                  # Uploaded project images and avatars
└── frontend/
    ├── index.html              # HTML entry with Plus Jakarta Sans preloading
    ├── vite.config.js          # Vite configuration
    ├── package.json            # React 19, Lucide-React, Lenis
    ├── public/
    │   ├── favicon.svg         # Brand favicon
    │   ├── icons.svg           # Unified SVG icon sprite
    │   └── MePhoto.webp        # Default profile avatar
    └── src/
        ├── main.jsx            # React root with Lenis smooth-scroll RAF loop
        ├── index.css           # Vanilla CSS design system tokens, components, breakpoints
        ├── App.jsx             # Root layout, routing (/ vs /manage), visibility-aware polling
        ├── config/api.js       # Axios/fetch configuration with baseURL and passcode headers
        └── components/
            ├── HeroHeader.jsx          # Public hero with availability tag & quick links
            ├── AboutSection.jsx        # Public bio tabs, experience, education, skills
            ├── WorksSection.jsx        # Public categorized projects grid with filter tabs
            ├── FeelingConfusedCTA.jsx  # Consultation booking call-to-action
            ├── FooterSection.jsx       # Public footer with social links & copyright
            ├── CallBookingModal.jsx    # Client consultation booking popup
            ├── ProjectModal.jsx        # Deep project showcase modal
            ├── ExperienceModal.jsx     # Career milestone modal
            ├── CmsLoginGate.jsx        # Passcode protection at /manage
            └── AdminDrawer.jsx         # In-browser CMS (Projects, Categories, Profile, Inquiries)
```

---

## 3. Essential Commands

### Development
```bash
# Backend (from backend/ directory or root)
python backend/manage.py runserver 8001

# Frontend (from frontend/ directory)
cd frontend
npm run dev
```

### Testing & Validation
```bash
# Backend test suite (23 automated tests)
python backend/manage.py test portfolio

# Frontend linting
cd frontend
npm run lint

# Frontend production build
cd frontend
npm run build
```

### Database & Migrations
```bash
# Make migrations
python backend/manage.py makemigrations portfolio

# Apply migrations
python backend/manage.py migrate

# Seed sample data
python backend/manage.py seed_data --reset
```

---

## 4. Agent Operating Rules & Constraints

### A. Things an Agent MUST DO
1. **Check Memory First**: Always consult `AGENTS.md` and `.agent-memory/` before beginning research or making code modifications.
2. **Preserve Single-Pass Aggregation**: Ensure all category queries aggregate counts in a single SQL query (`Count('projects')`) rather than per-row queries.
3. **Use Constant-Time Comparison**: Any passcode/auth logic must strictly use `secrets.compare_digest` to prevent timing attacks.
4. **Deep-Verify Media**: Uploaded raster images must be checked using `PIL.Image.open().verify()`, and SVG uploads must have `<script>`, `on*=` handlers, and `<iframe>` stripped.
5. **Maintain Secret CMS Route**: Never expose admin buttons, edit triggers, or CMS links on the public homepage (`/`). CMS is strictly accessible at `/manage`.
6. **Maintain Vanilla CSS Token Hierarchy**: Use the CSS variables defined in `frontend/src/index.css` (e.g., `--bg-canvas: #0B0F17;`, `--accent: #0066FF;`, `--font-main: 'Plus Jakarta Sans', sans-serif;`). Do NOT introduce TailwindCSS or arbitrary inline styles.
7. **Run Tests After Changes**: Execute `python backend/manage.py test portfolio` and `npm run build` after making modifications.
8. **Keep Memory Synchronized**: Update `CHANGELOG.md`, `CURRENT_STATE.md`, and `TASK_HISTORY.md` after completing meaningful work.

### B. Things an Agent MUST NOT DO
1. **DO NOT modify files outside the requested task scope** (Minimal Change Principle).
2. **DO NOT commit secrets, passcodes, or credentials** into git or documentation.
3. **DO NOT switch to TailwindCSS or external UI component libraries** (e.g., Material UI, AntD, Chakra) unless explicitly instructed by the user.
4. **DO NOT delete or truncate `.agent-memory/` records**.
5. **DO NOT disable security headers or CORS protection** in `backend/core/settings.py`.
6. **DO NOT use standard `==` string equality** for password/passcode comparison in backend views or permissions.
7. **DO NOT introduce N+1 queries** in serializers or views.

---

## 5. Coding & Style Conventions

- **Python / Django**: PEP 8 compliant, 4-space indentation, explicit type annotations where beneficial, descriptive docstrings.
- **JavaScript / React**: ES6+ modules, functional components with hooks, PascalCase for component filenames (`WorksSection.jsx`), camelCase for utility functions.
- **CSS**: Pure Vanilla CSS organized by `:root` tokens, base elements, layout utilities, reusable component primitives (`.btn-primary`, `.form-input`, `.ui-badge`), and responsive media queries (320px to 1920px).
- **Icons**: Standardized SVG icons referencing `frontend/public/icons.svg` or `lucide-react` icons with uniform 18–20px sizing and 1.75 stroke width.

---

## 6. How to Update Documentation & Memory

Whenever you complete a task:
1. Record human-facing changes in `CHANGELOG.md` under `[Unreleased]` or a new version header.
2. Record the task summary in `.agent-memory/TASK_HISTORY.md`.
3. If architecture, endpoints, or schema changed, update `.agent-memory/ARCHITECTURE.md` and `.agent-memory/CURRENT_STATE.md`.
4. If an architectural tradeoff or decision was made, document it in `.agent-memory/DECISIONS.md`.
