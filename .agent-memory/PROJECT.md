# Project Memory — High-Level Overview

## 1. Executive Summary
- **Project Name**: DesignMate
- **Repository**: [https://github.com/logicbyroshan/designmate](https://github.com/logicbyroshan/designmate)
- **Subject / Owner**: Roshan Damor — Graphic Designer & Creative Director (Bhopal, MP, India)
- **Contact Details**: `mail@logicbyroshan.in` / `logicbyroshan@gmail.com`, `+91 9179924975`, Socials: `@logicbyroshan`
- **Primary Objective**: Provide a blazing fast, visually stunning portfolio showcasing graphic design, branding, and digital illustration projects, paired with a secret in-browser CMS for instant content updates without exposing admin UI to public visitors.

---

## 2. Core User Personas & Use Cases

1. **Prospective Clients & Recruiters**:
   - Visit `http://localhost:5173/` (or production domain).
   - Browse graphic design works filtered by category (Branding, Social Media, Posters, UI/UX, etc.).
   - View high-resolution work samples, project context, and tools used.
   - Schedule consultation calls via the interactive `CallBookingModal`.
   - Contact Roshan directly via email, phone, or social links.

2. **Portfolio Owner (Roshan Damor)**:
   - Navigate to `/manage`.
   - Enter secret passcode (`superadmin`).
   - Create, edit, and reorder projects with direct image uploads.
   - Add and manage categories with custom SVG icons.
   - Update bio, contact information, social links, and open-for-work status in real time.
   - Review and export client booking inquiries as CSV.

---

## 3. Technology Stack

| Layer | Technology | Purpose / Notes |
|---|---|---|
| **Backend Framework** | Django 5.1.1 + Django REST Framework 3.15.2 | High-performance REST API, model management, security |
| **Database** | SQLite 3 (WAL mode) / PostgreSQL compatible | Local zero-config WAL SQLite with 20s busy timeout |
| **Image Processing** | Pillow (PIL) 10.4.0 | Byte-level image verification and processing |
| **CORS & Headers** | django-cors-headers 4.4.0 | Controlled cross-origin access |
| **Frontend Framework** | React 19.0.0 + Vite 6.0.0 | High-performance reactive UI |
| **Styling** | Vanilla CSS Design System | Bespoke design tokens, zero external CSS framework overhead |
| **Typography** | Google Fonts: `Plus Jakarta Sans` | Single unified typography family across all screens |
| **Smooth Scrolling** | `@studio-freight/lenis` / `lenis` | 60fps RAF smooth scrolling engine |
| **Icons** | SVG Sprite (`icons.svg`) + `lucide-react` | Standardized 18-20px stroke icons |
| **Linter** | Oxlint (`.oxlintrc.json`) | Ultra-fast JS/JSX static analysis |

---

## 4. Key Constraints & Non-Negotiables

- **No Public CMS Links**: The public portfolio (`/`) must remain 100% clean of admin edit buttons or login hints. Access is strictly at `/manage`.
- **Vanilla CSS Exclusivity**: All styling must adhere to the design system in `frontend/src/index.css`. Do NOT introduce TailwindCSS.
- **Single Font Family**: Only `Plus Jakarta Sans` is permitted throughout the entire application.
- **Timing-Safe Authentication**: Administrative authorization must use `secrets.compare_digest`.
- **Automated Test Integrity**: All 18 automated tests in `backend/portfolio/tests.py` must maintain a 100% pass rate.
