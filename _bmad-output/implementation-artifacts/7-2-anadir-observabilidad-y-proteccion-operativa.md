# Story 7.2: Anadir observabilidad y proteccion operativa

Status: review

## Story

Como equipo,
quiero trazas basicas y protecciones operativas,
para detectar problemas y reducir abuso antes del handoff de produccion.

## Acceptance Criteria

1. Dado cualquier request, cuando la API responde, entonces incluye un request id trazable.
2. Dado trafico HTTP, cuando termina un request, entonces se registra una linea JSON sin cuerpos ni secretos.
3. Dado intentos repetidos de auth, cuando exceden el limite local, entonces la API responde `429`.
4. Dado la API publica, cuando responde, entonces expone headers basicos de hardening y no expone `X-Powered-By`.

## Tasks / Subtasks

- [x] Anadir request id y headers operativos.
- [x] Anadir logs JSON por request sin datos privados.
- [x] Limitar intentos de login/register.
- [x] Limitar payload JSON.
- [x] Documentar operacion y trabajo diferido a produccion.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- Se implemento proteccion sin dependencias externas.
- El rate limit es en memoria y suficiente para local/staging; en produccion se debe reforzar con el proveedor edge/Railway si aplica.
- La salida de logs esta lista para redireccionarse a un sink cuando existan credenciales/servicios finales.

### File List

- apps/api/src/app.ts
- apps/api/src/app.test.ts
- docs/operations.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
