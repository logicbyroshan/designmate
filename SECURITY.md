# Security Policy & Architecture

## Security Model Overview
DesignMate implements defense-in-depth principles across backend APIs, frontend authentication gates, database interactions, and asset uploads.

---

## 1. Authentication & Authorization
- **Public API Access**: Safe read methods (`GET`, `HEAD`, `OPTIONS`) on showcase endpoints and `POST` on `/api/bookings/` are public.
- **Admin Endpoints**: Write operations (`POST`, `PUT`, `PATCH`, `DELETE`) across all models and inquiry read operations (`GET /api/bookings/`) are protected by DRF permission classes (`IsAdminOrReadOnly` and `IsAdminOrBookingCreationOnly`).
- **Constant-Time Verification**: The backend verifies `X-Admin-Passcode` or `Authorization: Bearer <token>` using `secrets.compare_digest` to neutralize timing side-channel attacks.
- **Rate-Limiting & Throttling**: DRF `AnonRateThrottle` and custom `BookingRateThrottle` limits anonymous submission velocity to 30 requests/minute to prevent spamming.
- **Brute-Force Rate Limiting**: Frontend CMS login gate enforces a lockout period (30s) after 5 consecutive failed passcode attempts.
- **Session Persistence**: Authentication state is maintained in `sessionStorage` (scoped to browser tab lifetime) and cleared immediately upon explicit "Exit / Log Out".

---

## 2. Input Validation & Deep Upload Sanitization
- **File Upload Limits**: Restricted to 50MB per file (`DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800`).
- **Pillow Image Verification**: All uploaded raster images (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`) are parsed and verified using `PIL.Image.verify()` to reject corrupt payloads, polyglots, and executable wrappers.
- **SVG XSS Sanitization**: Vector graphics (`.svg`) are inspected for dangerous script vectors (`<script>`, `javascript:`, `on*=` handlers, `<iframe>`, `<embed>`, `<object>`) and rejected with `400 Bad Request` if suspicious.
- **String Sanitization**: Names, emails, URLs, and text fields are validated, trimmed, and length-bounded in DRF serializers.
- **SQL Injection Prevention**: All queries utilize Django's ORM parameterized queries.

---

## 3. Reporting Security Vulnerabilities
If you discover a security vulnerability in this project:
1. Do not file a public GitHub issue.
2. Email full vulnerability details to **`mail@logicbyroshan.in`** with the subject `[Security Disclosure] DesignMate`.
3. We will acknowledge receipt within 24 hours and issue a fix promptly.
