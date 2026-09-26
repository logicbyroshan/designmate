# DesignMate API Documentation

## Base URL
- **Local Development**: `http://127.0.0.1:8001/api/`
- **Default Port**: `8001`

---

## Authentication & Headers

| Header | Value | Description |
|---|---|---|
| `Content-Type` | `application/json` | Required for JSON write operations |
| `X-Admin-Passcode` | `<CMS_PASSCODE>` | Required for write operations & viewing inquiries |
| `Authorization` | `Bearer <CMS_PASSCODE>` | Alternative header for CMS authentication |

---

---

## Endpoints Inventory

### 1. Production Health Check
- **Endpoint**: `GET /api/health/`
- **Access**: Public
- **Description**: Verifies database connectivity, server time, service version, and operational health.
- **Response Format**:
```json
{
  "status": "ok",
  "database": "healthy",
  "timestamp": "2026-09-26T17:15:13.520Z",
  "service": "DesignMate Portfolio Backend",
  "version": "2.0.0"
}
```

---

### 2. Unified Portfolio Bundle
- **Endpoint**: `GET /api/bundle/`
- **Access**: Public
- **Caching**: `Cache-Control: public, max-age=5, stale-while-revalidate=20`
- **Description**: Delivers the entire portfolio state in a single fast JSON payload with single-pass category SQL aggregation.
- **Response Format**:
```json
{
  "profile": {
    "id": 1,
    "name": "Roshan Damor",
    "tagline": "Graphic Designing",
    "hero_title": "PORTFOLIO",
    "hero_year": "2026",
    "designer_sign": "Roshan Damor",
    "location": "Bhopal, Madhya Pradesh",
    "bio_heading": "Hi! I'm Roshan Damor",
    "bio_paragraph_1": "...",
    "bio_paragraph_2": "...",
    "avatar_url": "http://127.0.0.1:8001/media/avatars/MePhoto.webp",
    "email": "logicbyroshan@gmail.com",
    "alt_email": "mail@logicbyroshan.in",
    "phone": "+91 9179924975",
    "instagram_url": "https://instagram.com/logicbyroshan",
    "figma_url": "https://figma.com/@logicbyroshan",
    "behance_url": "https://behance.net/logicbyroshan",
    "linkedin_url": "https://linkedin.com/in/logicbyroshan",
    "dribbble_url": "https://dribbble.com/logicbyroshan",
    "website_url": "https://grafix.logicbyroshan.in",
    "cta_title": "Feeling Confused?",
    "cta_subtext": "I'd love to chat with you about how I can help. Get in touch at",
    "cta_bold_text": "mail@logicbyroshan.in",
    "cta_btn_text": "Contact Me"
  },
  "categories": [...],
  "tools": [...],
  "industries": [...],
  "projects": [...],
  "experiences": [...],
  "education": [...],
  "stats": {
    "total_projects": 12,
    "total_categories": 7,
    "experience_years": "3+ Years",
    "client_satisfaction": "100%"
  }
}
```

---

### 2. Categories
- **`GET /api/categories/`**: List all categories (Public).
- **`POST /api/categories/`**: Create new category (Admin Protected).
- **`PATCH /api/categories/{id}/`**: Update category (Admin Protected).
- **`DELETE /api/categories/{id}/`**: Delete category (Admin Protected).

---

### 3. Projects
- **`GET /api/projects/`**: List all projects. Supports filter: `?category=Branding` (Public).
- **`POST /api/projects/`**: Create project with multipart image or URL (Admin Protected).
- **`PATCH /api/projects/{id}/`**: Update project details or artwork (Admin Protected).
- **`DELETE /api/projects/{id}/`**: Delete project (Admin Protected).

---

### 4. Client Bookings & Inquiries
- **`POST /api/bookings/`**: Submit client contact lead (Public).
- **`GET /api/bookings/`**: List and review all leads (Admin Protected).
- **`PATCH /api/bookings/{id}/`**: Update lead status (`pending` → `contacted` → `completed` → `cancelled`) (Admin Protected).
- **`DELETE /api/bookings/{id}/`**: Remove lead record (Admin Protected).

---

### 5. Profile
- **`GET /api/profile/`**: Retrieve profile info (Public).
- **`PATCH /api/profile/1/`**: Update profile bio, contacts, or upload new avatar (Admin Protected).
