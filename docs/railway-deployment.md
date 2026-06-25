# Railway Deployment

Status: prepared, not deployed.

This is the temporary Railway handoff for API + PostgreSQL. Credentials and the real Railway project are intentionally deferred until the production/EAS/APK handoff.

## Required Railway Services

- PostgreSQL service.
- API service built from the repository root using `Dockerfile`.

## Required Variables

Set these on the API service:

```bash
DATABASE_URL=<Railway PostgreSQL connection string>
NODE_ENV=production
PORT=3000
```

Set this for the mobile build when the public API URL exists:

```bash
EXPO_PUBLIC_API_URL=https://<railway-api-domain>
```

## Deploy Behavior

The API container runs:

```bash
npm run start:railway --workspace @smart-ant/api
```

That applies Prisma migrations with `prisma migrate deploy` and then starts `tsx src/server.ts`.

## Health Check

Use:

```bash
GET /api/v1/health
```

The endpoint returns `503` until the API can reach PostgreSQL.

## Temporary Production Note

Receipt image handling remains local/dev only. Before EAS/APK or production use, switch to durable image storage by saving files in a controlled folder or storage service and persisting only the path/reference in the database.
