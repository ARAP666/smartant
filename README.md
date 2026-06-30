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

Railway/EAS estan configurados en el repositorio pero el despliegue queda diferido hasta tener credenciales, dominio y `projectId`. Las imagenes de recibos se descartan actualmente; antes de habilitar OCR o retencion se debe aprobar storage privado y su politica de eliminacion.
