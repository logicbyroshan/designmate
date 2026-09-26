# Security Memory — Architecture, Threat Modeling & Protection Policies

## 1. Authentication & Passcode Architecture

- **Passcode-Protected CMS**: Access to write/admin endpoints (`/api/projects/`, `/api/categories/`, `/api/profile/`, `/api/settings/`, and `/api/bookings/` GET) is guarded by `AdminPasscodePermission`.
- **Constant-Time Verification**: All passcode checks use `secrets.compare_digest` to neutralize timing side-channel attacks:
  ```python
  import secrets
  from django.conf import settings

  def has_permission(self, request, view):
      expected = getattr(settings, 'ADMIN_PASSCODE', '')
      # Extract from X-Admin-Passcode or Authorization: Bearer <passcode>
      provided = request.headers.get('X-Admin-Passcode') or ...
      return secrets.compare_digest(provided, expected)
  ```
- **Public Surface Isolation**: The public route (`/`) contains zero client-side logic, buttons, or links referring to `/manage`.

---

## 2. Media Upload Sanitization & Validation

- **Raster Image Byte Verification**:
  - File extension checking alone is insufficient.
  - Every uploaded PNG, JPG, JPEG, and WebP is opened and verified byte-by-byte using `PIL.Image.open(file).verify()`.
  - Catches corrupt payloads, polyglots, and disguised binaries.
- **SVG Stored-XSS Sanitization**:
  - SVG uploads are converted to UTF-8 strings and parsed.
  - Any occurrence of `<script>`, `onload=`, `onerror=`, `onclick=`, `javascript:`, or `<iframe>` triggers immediate validation rejection.

---

## 3. Rate Limiting & Abuse Prevention

- **General API Throttle**: `AnonRateThrottle` limits anonymous requests to `120 requests/minute`.
- **Consultation Booking Throttle**: Custom `BookingRateThrottle` limits POST `/api/bookings/` to `5 requests/minute` per IP address to eliminate form spam and email bombing abuse.

---

## 4. HTTP Headers & CORS Security

- `SECURE_CONTENT_TYPE_NOSNIFF = True`: Prevents MIME-sniffing vulnerabilities.
- `SECURE_BROWSER_XSS_FILTER = True`: Enables browser-level cross-site scripting filters.
- `X_FRAME_OPTIONS = 'DENY'`: Protects against clickjacking.
- **CORS Configuration**: Controlled via `CORS_ALLOWED_ORIGINS` in `.env`. Defaults to local development origins in debug mode.

---

## 5. Security Rules for Future Agents

1. **NEVER** use standard `==` string equality for passwords or passcodes in backend code.
2. **NEVER** disable `PIL.Image.verify()` or SVG sanitization in serializers.
3. **NEVER** expose the `/manage` route or CMS credentials on the public homepage.
4. **NEVER** hardcode production secret keys or passcodes in source files or memory.
