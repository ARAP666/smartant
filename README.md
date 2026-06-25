# Smart Ant

App movil + API para registrar ingresos, gastos, presupuestos, metas de ahorro, recibos e importaciones CSV.

## Stack

- API: Express, Prisma, PostgreSQL.
- Mobile: Expo React Native.
- Shared finance logic: `packages/finance`.

## Setup Local

```bash
npm install
npm run start
```

`npm run start` levanta la API. En local usa por defecto:

```bash
postgresql://postgres:postgres@localhost:5432/sentDB
```

En produccion `DATABASE_URL` es obligatorio.

## Cuenta Demo

Ver [docs/demo-account.md](docs/demo-account.md).

```bash
npm run seed:demo --workspace @smart-ant/api
```

## Checks

```bash
npm run lint
npm run type-check
npm test
npm run build
```

## Estado

- Historias: 27/27 en review.
- Handoff: [docs/handoff.md](docs/handoff.md).
- Gate local: [docs/production-gate.md](docs/production-gate.md).

## Produccion

Railway/EAS/APK estan preparados pero diferidos hasta tener credenciales y valores finales. Antes de APK/EAS, cambiar recibos a storage durable y guardar la ruta en base de datos.
