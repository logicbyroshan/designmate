# Known Issues & Technical Debt Memory

## 1. Tracked Non-Breaking Warnings

### ISSUE-001: Oxlint `set-state-in-effect` Advisory Warnings
- **File**: `frontend/src/App.jsx` (L145), `frontend/src/components/AdminDrawer.jsx` (L169, L176)
- **Status**: Monitored (Non-breaking)
- **Description**: Oxlint flags `setState` calls inside top-level `useEffect` hooks during initial data fetching and drawer initialization.
- **Impact**: Zero runtime errors; the effects are standard React data-fetching patterns.
- **Remediation Plan**: Can refactor to dedicated custom query hooks or state transitions if React Compiler optimization is strictly enabled in future builds.

---

## 2. Infrastructure Considerations

### ISSUE-002: SQLite in Multi-Instance Ephemeral Serverless Environments
- **File**: `backend/core/settings.py`
- **Status**: Documented
- **Description**: The default configuration uses SQLite with WAL mode and 20s busy timeout, which is optimal for single-instance VPS, Docker, or bare-metal deployments. In multi-container ephemeral serverless environments (e.g., AWS Lambda, multi-replica Kubernetes), SQLite files cannot be shared across pods.
- **Resolution**: Use PostgreSQL (`psycopg2-binary` + `dj-database-url`) when deploying to distributed multi-node clusters.

---

## 3. Resolved Historical Issues

| ID | Issue | Resolution | Date Resolved |
|---|---|---|---|
| **RESOLVED-001** | Category count N+1 query loop during serialization | Replaced per-item counts with single-pass SQL aggregation in `views.py` passed through context | 2026-09-26 |
| **RESOLVED-002** | Administrative passcode string comparison timing attack vulnerability | Replaced standard string comparison with `secrets.compare_digest` in `permissions.py` | 2026-09-26 |
| **RESOLVED-003** | Corrupt/polyglot image upload vulnerability | Added byte-level `PIL.Image.open().verify()` in `serializers.py` | 2026-09-26 |
| **RESOLVED-004** | Stored XSS vulnerability in uploaded SVG files | Added SVG script and handler sanitization in `serializers.py` | 2026-09-26 |
| **RESOLVED-005** | Inactive tab battery/network drain from background polling | Integrated `document.visibilityState` listener to pause polling in inactive tabs | 2026-09-26 |
