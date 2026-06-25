# Story 7.1: Desplegar API y PostgreSQL en Railway

Status: review

## Story

Como equipo,
quiero tener preparado el despliegue de API y PostgreSQL en Railway,
para poder publicar el backend cuando esten las credenciales finales.

## Acceptance Criteria

1. Dado el repositorio, cuando Railway construya desde la raiz, entonces existe un Dockerfile para levantar la API.
2. Dado una base PostgreSQL en Railway, cuando la API inicie, entonces aplica migraciones Prisma antes de servir trafico.
3. Dado un operador, cuando configure el despliegue, entonces tiene documentadas las variables requeridas y el health check.
4. Dado que no hay credenciales finales todavia, cuando se revise la historia, entonces queda claro que el despliegue real se hace en el handoff EAS/APK/produccion.

## Tasks / Subtasks

- [x] Anadir Dockerfile de API para Railway.
- [x] Excluir artefactos locales con `.dockerignore`.
- [x] Anadir scripts de migracion e inicio para Railway.
- [x] Documentar variables, servicios y health check.
- [x] Mantener la nota temporal de storage de recibos para produccion.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- No se intento desplegar porque Railway, dominio y credenciales finales se entregaran hasta el handoff de produccion/EAS/APK.
- El contenedor usa `tsx src/server.ts` porque `@smart-ant/finance` aun exporta TypeScript fuente para desarrollo local.
- `GET /api/v1/health` valida conectividad con PostgreSQL y puede usarse como health check.

### File List

- Dockerfile
- .dockerignore
- apps/api/package.json
- docs/railway-deployment.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
