# Conventions Memory — Established Coding & Style Guidelines

## 1. File & Directory Naming

- **React Components**: `PascalCase.jsx` (e.g., `WorksSection.jsx`, `CallBookingModal.jsx`).
- **React Utility / Config Files**: `camelCase.js` (e.g., `api.js`).
- **Python Modules**: `snake_case.py` (e.g., `permissions.py`, `serializers.py`, `seed_data.py`).
- **CSS Files**: `kebab-case.css` or standard entry `index.css`, `App.css`.
- **Static Assets**: `kebab-case.ext` or `PascalCase.webp` for personal avatars (e.g., `MePhoto.webp`, `favicon.svg`, `icons.svg`).

---

## 2. Python & Django Conventions

- **PEP 8 Compliance**: 4 spaces per indentation level. Maximum line length ~100 characters.
- **Model Design**:
  - Always specify `related_name` on ForeignKeys.
  - Define `ordering` in `Meta` to prevent inconsistent pagination.
  - Include explicit database indexes for frequently filtered/sorted fields (`db_index=True` or `indexes = [models.Index(...)]`).
  - Implement `__str__()` returning human-readable identifiers on every model.
- **Serializer Design**:
  - Perform field-level and object-level validation inside `validate_<field>()` or `validate()`.
  - For nested counts or heavy operations, aggregate at the queryset level and pass through `context` rather than running queries inside `SerializerMethodField`.
- **View Design**:
  - Use DRF `ModelViewSet` for standard CRUD operations.
  - Protect write/admin actions with `AdminPasscodePermission`.
  - Keep public read views fast and cache-friendly.

---

## 3. JavaScript & React Conventions

- **React 19 Functional Components**: Use standard hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`).
- **Prop Drilling vs State**: For global portfolio data, state lives in `App.jsx` and is passed down to sections. Modals are controlled via `selectedProject`, `selectedExperience`, and `isBookingModalOpen` states in `App.jsx`.
- **Keyboard & Accessibility**:
  - Interactive modals must include `onKeyDown` listeners for `Escape` key dismissal.
  - Modals must have `role="dialog"` and `aria-modal="true"`.
  - Icon-only buttons must have descriptive `aria-label` attributes.
- **Network Requests**:
  - Make API calls using the centralized `api` helper in `frontend/src/config/api.js`.
  - Pass the admin passcode in the `X-Admin-Passcode` header or `Authorization: Bearer <passcode>` for administrative operations.

---

## 4. CSS & Design System Conventions

All styling must use the tokens defined in `frontend/src/index.css`:

```css
:root {
  --bg-canvas: #0B0F17;
  --bg-surface: #121824;
  --bg-card: #182030;
  --bg-card-hover: #1E293B;
  --accent: #0066FF;
  --accent-hover: #0052CC;
  --accent-glow: rgba(0, 102, 255, 0.25);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(0, 102, 255, 0.3);
  --text-primary: #FFFFFF;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 25px rgba(0, 102, 255, 0.3);
}
```

- **Buttons**: Use `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-ghost`.
- **Forms**: Use `.form-group`, `.form-label`, `.form-input`, `.form-select`, `.form-textarea`.
- **Badges**: Use `.ui-badge`, `.ui-badge-accent`, `.ui-badge-muted`.
- **Empty States**: Use `.ui-empty-state`.

---

## 5. Git & Commit Conventions

Follow **Conventional Commits**:
- `feat(scope): ...` — New feature or major capability
- `fix(scope): ...` — Bug fix or error resolution
- `chore(scope): ...` — Tooling, dependencies, or repository hygiene
- `test(scope): ...` — Adding or updating test suites
- `docs(scope): ...` — Documentation updates or additions
