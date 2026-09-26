# Decisions Memory — Architecture Decision Records (ADR)

## ADR-001: Decoupled Django REST Backend + React 19 / Vite Frontend
- **Date**: 2026-09-26
- **Status**: Accepted
- **Context**: The portfolio requires a high-performance modern UI with instant reactivity, smooth scrolling, and dynamic filtering, backed by a robust database and secure administrative API.
- **Decision**: Decouple the frontend (React 19 + Vite 6) and backend (Django 5.1 + DRF).
- **Consequences**: Enables lightning-fast client-side routing and animation while leveraging Django's ORM, admin, and security ecosystem.

---

## ADR-002: In-Browser CMS at `/manage` with Zero Public Admin Triggers
- **Date**: 2026-09-26
- **Status**: Accepted
- **Context**: The client wanted an integrated way to update portfolio works and categories in the browser, but the public portfolio view (`/`) must feel 100% clean and professional without any exposed admin buttons or login triggers.
- **Decision**: Mount a secret passcode gate strictly at `/manage`. The public root `/` contains no references, buttons, or links to the CMS.
- **Consequences**: Public visitors enjoy a distraction-free portfolio showcase; the owner can manage content by directly visiting `/manage`.

---

## ADR-003: Constant-Time Passcode Comparison via `secrets.compare_digest`
- **Date**: 2026-09-26
- **Status**: Accepted
- **Context**: Passcode authentication using standard `==` string equality leaks timing information that could allow character-by-character side-channel discovery.
- **Decision**: Use Python's built-in `secrets.compare_digest` in `AdminPasscodePermission` for validating `X-Admin-Passcode` and `Authorization: Bearer <passcode>` headers.
- **Consequences**: Constant-time execution prevents timing side-channel attacks.

---

## ADR-004: Bespoke Vanilla CSS Design System with Single Font Family
- **Date**: 2026-09-26
- **Status**: Accepted
- **Context**: Third-party CSS frameworks (TailwindCSS, Bootstrap, Material UI) introduce bundle bloat, override complexity, and generic styling.
- **Decision**: Build a custom design system in pure Vanilla CSS (`frontend/src/index.css`) utilizing tokens, unified 18–20px SVG icons, and a single font family (`Plus Jakarta Sans`).
- **Consequences**: Zero framework dependencies, minimal CSS payload (~27kB uncompressed / 5.9kB gzipped), and complete control over responsive layout and micro-interactions.

---

## ADR-005: Deep Byte-Level Image Validation and SVG Stored-XSS Sanitization
- **Date**: 2026-09-26
- **Status**: Accepted
- **Context**: Relying purely on file extensions or MIME headers permits polyglot payloads, corrupt files, and stored XSS vectors via SVG `<script>` tags.
- **Decision**: Verify raster uploads byte-by-byte using `PIL.Image.open().verify()`, and parse/sanitize SVG uploads by stripping `<script>`, `<iframe>`, and `on*=` event handlers.
- **Consequences**: Guarantees uploaded media is safe and valid before saving to storage.

---

## ADR-006: Single-Pass SQL Category Project Count Aggregation
- **Date**: 2026-09-26
- **Status**: Accepted
- **Context**: Calling `category.projects.count()` inside a `SerializerMethodField` triggers N separate SQL queries when serializing category lists or bundles.
- **Decision**: Pre-aggregate project counts in a single SQL query (`Project.objects.values('category').annotate(count=Count('id'))`) and inject into serializer context.
- **Consequences**: Completely eliminates N+1 query overhead.

---

## ADR-007: Tab Visibility-Aware Polling in React Engine
- **Date**: 2026-09-26
- **Status**: Accepted
- **Context**: Unconditional setInterval polling consumes unnecessary CPU, battery, and server bandwidth when the tab is backgrounded.
- **Decision**: Check `document.visibilityState === 'visible'` in `App.jsx` to suspend polling when hidden and immediately fetch fresh data upon tab focus.
- **Consequences**: Preserves client and server resources while guaranteeing up-to-date data when the user returns to the tab.
