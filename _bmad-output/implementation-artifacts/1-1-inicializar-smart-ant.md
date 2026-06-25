---
baseline_commit: b67271c629dfd55e852b6bda244eb8d0f4e68de0
---

# Story 1.1: Inicializar Smart Ant

Status: review

## Story

Como desarrollador,
quiero inicializar el monorepo,
para poder construir y verificar la aplicación.

## Acceptance Criteria

1. Expo SDK 54, Express 5 y npm workspaces inician correctamente con Node.js 24 LTS.
2. TypeScript estricto, Biome y Vitest quedan configurados desde la raíz.
3. Prisma 7 conecta a PostgreSQL local usando la base `sentDB`.
4. Existen `.env.example`, `.env.development.example` y `.env.production.example` sin secretos.
5. Los scripts raíz `type-check`, `lint`, `test` y `build` terminan correctamente.
6. GitHub Actions ejecuta los mismos cuatro scripts.
7. No se crean todavía entidades de negocio; cada historia añadirá solo sus modelos necesarios.

## Tasks / Subtasks

- [x] Inicializar npm workspaces y configuración raíz (AC: 1, 2, 5)
  - [x] Crear `apps/mobile` con el starter oficial compatible con Expo Go físico.
  - [x] Crear `apps/api` Express 5 ESM.
  - [x] Configurar scripts raíz y TypeScript estricto.
- [x] Configurar calidad automática (AC: 2, 5, 6)
  - [x] Añadir Biome y Vitest.
  - [x] Crear workflow CI con Node.js 24.
- [x] Configurar PostgreSQL y Prisma (AC: 3, 7)
  - [x] Añadir Prisma 7, `@prisma/adapter-pg`, `pg` y `dotenv`.
  - [x] Crear schema sin modelos de negocio y cliente generado fuera de `node_modules`.
  - [x] Añadir endpoint `/api/v1/health` que compruebe API y base de datos.
- [x] Documentar entornos (AC: 3, 4)
  - [x] Añadir ejemplos con `DATABASE_URL` apuntando a `sentDB`.
  - [x] Mantener `.env*` reales ignorados.
- [x] Ejecutar y registrar verificaciones (AC: 5)

## Dev Notes

### Guardrails

- No crear modelos `User`, `Income`, `Expense` ni otras tablas en esta historia.
- No añadir Docker, Redis, colas, Redux ni boilerplates externos.
- Usar ESM; Prisma 7 lo requiere.
- Prisma 7 requiere `prisma.config.ts`, salida explícita del cliente y driver adapter PostgreSQL.
- Mantener la API mínima: configuración validada, conexión y health check.
- No cambiar los documentos BMAD salvo estado y registro de esta historia.

### Stack verificado el 2026-06-20

- Node.js `24.x` LTS.
- Expo SDK 54 para Expo Go en dispositivo físico durante la transición a SDK 56.
- Express 5.
- Prisma ORM 7.
- PostgreSQL 18.
- Biome, Vitest y TypeScript en versiones estables compatibles con Node 24.

### Project Structure

```text
apps/
  mobile/
  api/
    prisma/schema.prisma
    prisma.config.ts
    src/app.ts
    src/server.ts
    src/config.ts
    src/shared/db.ts
packages/
  finance/
.github/workflows/ci.yml
biome.json
package.json
tsconfig.json
```

`packages/finance` puede inicializarse como workspace vacío y tipado; no debe contener lógica hasta Story 3.1.

### API Contract

`GET /api/v1/health`

```json
{
  "data": {
    "status": "ok",
    "database": "ok"
  }
}
```

Un fallo de base devuelve 503 con el formato de error arquitectónico y `requestId`.

### Testing

- Unit test mínimo para validación de configuración.
- Integration test del health check con la conexión sustituida; no requiere PostgreSQL en CI.
- Verificación manual local contra `sentDB`.

### References

- [Architecture](../planning-artifacts/architecture.md)
- [Epics](../planning-artifacts/epics.md)
- [Readiness](../planning-artifacts/implementation-readiness-report-2026-06-20.md)
- Expo: https://docs.expo.dev/get-started/create-a-project/
- Node releases: https://nodejs.org/en/about/previous-releases
- Prisma 7: https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7
- Biome: https://biomejs.dev/guides/getting-started/

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- RED: `npm test` falló porque `app.ts` y `config.ts` aún no existían.
- GREEN: 4 pruebas pasan tras implementar configuración y health check.
- PostgreSQL local respondió `3D000`; se creó `sentDB` vacía y el health check devolvió 200.
- El runtime local es Node.js 22.22.2; Node.js 24 queda fijado en `engines` y GitHub Actions.

### Implementation Plan

- Inicializar workspaces mínimos para mobile, API y finance.
- Probar primero configuración y health check.
- Generar Prisma fuera de `node_modules`, validar los cuatro scripts raíz y PostgreSQL local.

### Completion Notes List

- Ultimate context engine analysis completed.
- Monorepo npm inicializado con Expo SDK 54, Express 5 ESM y workspace finance vacío.
- TypeScript estricto, Biome, Vitest y CI con Node.js 24 configurados.
- Prisma 7 configurado con adapter PostgreSQL, schema sin modelos y cliente generado fuera de `node_modules`.
- `GET /api/v1/health` probado para respuestas 200 y 503 seguras.
- `sentDB` creada y verificada localmente con la credencial guardada solo en `apps/api/.env`, ignorado por Git.
- Verificaciones finales: `type-check`, `lint`, `test` (4/4) y `build` pasan.

### File List

- `.env.example`
- `.env.development.example`
- `.env.production.example`
- `.github/workflows/ci.yml`
- `.gitignore`
- `apps/api/.env` (local, ignorado)
- `apps/api/package.json`
- `apps/api/prisma.config.ts`
- `apps/api/prisma/schema.prisma`
- `apps/api/src/app.test.ts`
- `apps/api/src/app.ts`
- `apps/api/src/config.test.ts`
- `apps/api/src/config.ts`
- `apps/api/src/server.ts`
- `apps/api/src/shared/db.ts`
- `apps/api/tsconfig.build.json`
- `apps/api/tsconfig.json`
- `apps/mobile/.gitignore`
- `apps/mobile/App.tsx`
- `apps/mobile/app.json`
- `apps/mobile/assets/*.png`
- `apps/mobile/index.ts`
- `apps/mobile/package.json`
- `apps/mobile/tsconfig.json`
- `biome.json`
- `package-lock.json`
- `package.json`
- `packages/finance/package.json`
- `packages/finance/src/index.ts`
- `packages/finance/tsconfig.json`
- `tsconfig.json`
- `vitest.config.ts`

### Change Log

- 2026-06-21: Story 1.1 implementada y validada; estado movido a review.
