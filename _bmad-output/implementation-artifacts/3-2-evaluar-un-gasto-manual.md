# Story 3.2: Evaluar un gasto manual

Status: review

## Story

Como usuario,
quiero conocer el impacto de un Gasto antes de guardarlo,
para decidir con información suficiente.

## Acceptance Criteria

1. El usuario autenticado puede evaluar monto positivo, fecha, descripción y categoría.
2. La API crea un Movimiento pendiente que no confirma un Gasto.
3. La respuesta devuelve Saldo gastable resultante y márgenes/reglas afectadas.
4. Entradas inválidas devuelven 422 sin persistir.
5. Sesión ausente devuelve 401.

## Tasks / Subtasks

- [x] Añadir modelo y migración `PendingMovement`.
- [x] Añadir validación y endpoint protegido de evaluación.
- [x] Reusar motor `@smart-ant/finance`.
- [x] Añadir UI móvil mínima para evaluar gasto manual.
- [x] Añadir pruebas de validación y rutas.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- No confirma gastos; solo persiste movimiento pendiente.
- Applied migration `20260625050000_add_pending_movements` to local `sentDB`.

### File List

- apps/api/package.json
- apps/api/prisma/schema.prisma
- apps/api/prisma/migrations/20260625050000_add_pending_movements/migration.sql
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/api/src/features/pending-movements/pending-movements.ts
- apps/api/src/features/pending-movements/pending-movements.test.ts
- apps/api/src/features/pending-movements/pending-movements-routes.test.ts
- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/features/pending-movements/pending-movement-schema.ts
- apps/mobile/src/features/pending-movements/pending-movement-schema.test.ts
- apps/mobile/src/shared/api/client.ts
- packages/finance/package.json
- package-lock.json
