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

- Current receipt-photo handling is temporary and must not block feature stories while the app is still local/dev.
- For production, replace in-memory receipt handling with durable image storage: save the image in a controlled folder or storage service and persist only the image path/reference in the database.
- Do this before EAS/APK release work. When the project moves to EAS, APK generation, or production deployment, collect Railway credentials and any required storage/config values, then switch receipts to the production-safe storage method.
- Do not treat missing production storage/OCR/provider details as a blocker for current app stories; those details are intentionally deferred until the production handoff.

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
