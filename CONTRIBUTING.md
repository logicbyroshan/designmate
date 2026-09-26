# Contributing Guidelines

Thank you for your interest in contributing to the **DesignMate Portfolio & CMS** project! We welcome contributions to enhance security, performance, design fidelity, and architectural robustness.

---

## 🛠️ Development Workflow

1. **Fork & Branch**:
   Create a descriptive branch for your feature or fix from `main`:
   ```bash
   git checkout -b feature/category-drag-and-drop
   # or
   git checkout -b fix/booking-validation
   ```

2. **Backend Standards (Django/DRF)**:
   - Always run migrations when modifying models (`python manage.py makemigrations`).
   - Add database indexes (`db_index=True`) on frequently queried/sorted fields.
   - Enforce security permissions via `IsAdminOrReadOnly` / `IsAdminOrBookingCreationOnly` in `portfolio/permissions.py`.
   - Validate uploaded file extensions and sizes in serializers.
   - Write automated test cases in `backend/portfolio/tests.py` for new models, viewsets, or validation rules.
   - Run tests before committing:
     ```bash
     python backend/manage.py test portfolio
     ```

3. **Frontend Standards (React/Vite)**:
   - Keep the bespoke Vanilla CSS design system consistent across all components.
   - Do not declare component sub-wrappers inside component render bodies to avoid React unmounting/remounting cycles.
   - Use centralized API endpoints and authorization headers from `src/config/api.js`.
   - Test production build and linting before submitting:
     ```bash
     cd frontend
     npm run lint
     npm run build
     ```

4. **Security & Privacy**:
   - Never commit API keys, `.env` files, or production secrets.
   - Keep the CMS login gate protected at `/manage`.
   - Ensure contact inquiry customer data is never exposed to unauthenticated public endpoints.

---

## 🧪 Testing Checklist Before Pull Request

- [ ] All 13+ Django backend tests pass (`python backend/manage.py test portfolio`).
- [ ] Frontend builds cleanly (`npm run build`).
- [ ] Zero lint errors with `oxlint` (`npm run lint`).
- [ ] No regression in mobile/responsive layouts (viewports tested: 375px, 768px, 1200px+).
- [ ] Documentation updated if API contracts or environment variables changed.

---

## 📝 Commit Convention

Please use conventional commit messages:
- `feat: add animated image gallery lightbox`
- `fix: sanitize booking input strings`
- `perf: optimize category query ordering`
- `docs: update API contract in API.md`
- `test: add permission unit test for delete endpoint`
