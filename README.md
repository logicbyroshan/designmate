# Roshan Damor — Graphic Designer Portfolio 2026

A modern, high-performance, fullstack graphic designer portfolio application featuring a custom design system, dynamic categories architecture, and a secured private CMS.

- **Public Portfolio URL**: `http://localhost:5173/`
- **Private CMS URL**: `http://localhost:5173/manage` *(Protected by passcode `superadmin`)*
- **Backend API**: `http://127.0.0.1:8001/api/`

---

## 🎨 Key Features & Architecture

### 1. 🌟 Public Showcase (`/`)
- **Topographic Contour Hero**: Dynamic typography (`PORTFOLIO 2026`), designer signature (`Roshan Damor`), and electric royal gradient waves.
- **About & Credentials**:
  - High-res designer portrait (`MePhoto.webp`) with bottom gradient blend.
  - Interactive experience pills (`Adarsh ID Cards`, `Miracle Organisation`, `Diploma in Graphics from Mantra Institute`) that trigger a credentials modal.
  - **Design Software**: Adobe Photoshop (`Ps`), CorelDRAW (`Cd`), Adobe Lightroom (`Lr`), Canva (`Cv`), Adobe Premiere Pro (`Pr`), Figma.
  - **Skills & Production Specializations**: Social Media & Digital Ads, Print Production & CMYK, ID Cards & Corporate Lanyards, Brochures, Photo Retouching, Event Banners, Political Campaign Creatives, Thumbnails, Book Covers.
- **Divided Category Showcase ("MY WORKS")**:
  - Works dynamically grouped under their respective categories with subtitles & category badge counts.
  - Interactive Case Study lightboxes with tags, client information, and external links.
- **Contact CTA ("Feeling Confused?")**:
  - Email: [`mail@logicbyroshan.in`](mailto:mail@logicbyroshan.in) & [`logicbyroshan@gmail.com`](mailto:logicbyroshan@gmail.com).
  - Phone: `+91 9179924975`.
  - Interactive **Contact & Inquiries Modal** that submits directly to Django backend + celebration confetti!
- **Socials & Footer**:
  - Direct links to `@logicbyroshan` across **Instagram**, **Figma**, **Behance**, **LinkedIn**, and **Dribbble**.
  - Live backend connection status indicator without any public admin triggers.

### 2. 🔐 Secured In-Browser CMS (`/manage`)
- **Secret URL**: Only reachable by entering `/manage` in the browser address bar.
- **Passcode Gate**: Dark glassmorphic login gate protected with attempt throttling and session persistence.
- **Tab Navigation**:
  - 🖼️ **Works & Projects**: Full CRUD — upload project images or URLs, assign categories, define accent colors, tags, and case studies.
  - 🗂️ **Categories Architecture**: Create, reorder, edit, and delete portfolio categories with custom Lucide icons.
  - 👤 **Designer Profile**: Edit bio text, phone, email, alternative email, and upload new avatar photo.
  - 📬 **Inquiries & Leads**: Review and update incoming client inquiries (`Pending` → `Contacted` → `Completed` → `Cancelled`).
- **CMS Header Controls**:
  - Live Django API indicator
  - Fast data refresher
  - **Exit / Log Out** button (clears session and returns to public portfolio)
  - **View Site** link

---

## 🚀 Running Locally

### 1. Start Django Backend Server (Port 8001)
```bash
# From workspace root
backend\venv\Scripts\python backend\manage.py runserver 0.0.0.0:8001
```

### 2. Start React Frontend Server (Port 5173)
```bash
cd frontend
npm run dev -- --port 5173 --host
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/bundle/` | `GET` | Complete portfolio bundle in a single fast JSON payload |
| `/api/profile/1/` | `GET`, `PATCH` | Update designer profile, avatar image, and contacts |
| `/api/categories/` | `GET`, `POST`, `PATCH`, `DELETE` | Manage categories, icons, and display ordering |
| `/api/projects/` | `GET`, `POST`, `PATCH`, `DELETE` | Manage portfolio artwork and case studies |
| `/api/bookings/` | `GET`, `POST`, `PATCH`, `DELETE` | Submit and manage client contact inquiries |
| `/api/experiences/` | `GET`, `POST` | Work experience credentials |
| `/api/education/` | `GET`, `POST` | Educational background and diploma credentials |

---

## 📁 Tech Stack
- **Frontend**: React, React Router v7, Lucide Icons, Canvas Confetti, Vite, Vanilla CSS Design System.
- **Backend**: Python 3.11, Django 5.2, Django REST Framework, django-cors-headers, Pillow (50MB high-res asset support).
