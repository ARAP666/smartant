# Story 5.3: Revisar y confirmar recibo

Status: review

## Story

Como usuario,
quiero corregir los datos detectados,
para evitar que un error afecte mis finanzas.

## Acceptance Criteria

1. Dado un Movimiento pendiente detectado, cuando se muestra la revision, entonces todos los campos son editables y los campos faltantes pueden completarse manualmente.
2. Dado datos validos revisados, cuando el usuario solicita evaluar, entonces recibe las mismas Alertas que un Gasto manual.
3. Dado que el usuario cancela, cuando abandona la revision, entonces no se crea un Gasto.
4. Dado que el usuario confirma, cuando se procesa el Movimiento pendiente, entonces se reutilizan la transaccion y la idempotencia del Gasto manual.
5. Dado una fotografia almacenada, cuando vence la politica de retencion o el usuario solicita su eliminacion, entonces se elimina sin borrar el Gasto confirmado.

## Tasks / Subtasks

- [x] Anadir revision de Movimiento pendiente detectado.
- [x] Reusar evaluacion y alertas de gasto manual.
- [x] Reusar confirmacion idempotente existente.
- [x] Permitir cancelar revision sin crear Gasto.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- No se persisten fotografias; por tanto no hay archivo que retener o borrar.
- La revision usa `PATCH /api/v1/pending-movements/:id/review`.
- La confirmacion sigue usando `POST /api/v1/pending-movements/:id/confirm`.
- Nota temporal: esto no bloquea historias locales. Antes de EAS/APK se debe guardar la imagen en folder/storage y persistir la ruta en base de datos; ver `docs/production-readiness.md`.

### File List

- apps/api/src/features/pending-movements/pending-movements.ts
- apps/api/src/features/pending-movements/pending-movements-routes.test.ts
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/shared/api/client.ts
