# Production Readiness

## Environment

- Required env vars documented.
- Secrets are not committed.
- Production, staging and local targets are clear.
- Public client env vars are safe to expose.

## Database

- Migrations apply cleanly.
- Rollback/recovery plan exists for risky changes.
- Backups exist before production data changes.
- Seed data is idempotent and non-destructive.

## Receipt Images

- Current receipt-photo handling is in-memory and discards image bytes after deriving pending-movement data.
- Discarding bytes is production-safe while image retention and real OCR remain disabled.
- Before enabling OCR or retention, approve the provider, retention/deletion policy and private durable storage; persist only the controlled reference in PostgreSQL.
- Missing OCR/storage details do not block EAS or Railway deployment while those capabilities remain disabled.

## Security

- Auth verified.
- Role/permission gates verified.
- Rate limits planned for auth and expensive endpoints.
- Admin/destructive actions confirmed and auditable.
- No stack traces or private data leak to users.

## Frontend

- Responsive states verified.
- Loading, empty, error and success states verified.
- Forms validate field-level errors.
- Navigation only exposes working routes.
- SEO/social metadata reviewed for public sites.

## Tests

Run project-specific checks:

```bash
npm run type-check
npm run lint
npm test
npm run build
```

Add Playwright/E2E for the primary money/auth/admin workflows when risk warrants it.
