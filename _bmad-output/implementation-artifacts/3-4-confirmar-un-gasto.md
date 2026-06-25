# Story 3.4: Confirmar un gasto

Status: review

## Story

Como usuario,
quiero guardar un Gasto real aunque exceda mi plan,
para mantener un historial fiel.

## Acceptance Criteria

1. Dado un Movimiento pendiente valido, cuando el usuario lo confirma, entonces el Gasto se crea y los datos relacionados se recalculan en una transaccion.
2. Dado una confirmacion reintentada con la misma clave de idempotencia, cuando la API la recibe, entonces no crea un segundo Gasto.
3. Dado un incumplimiento de regla, cuando el usuario confirma explicitamente despues de la Alerta, entonces el Gasto se guarda asociado unicamente a su cuenta.

## Tasks / Subtasks

- [x] Anadir modelo y migracion de gastos confirmados.
- [x] Anadir endpoint de confirmacion idempotente.
- [x] Incluir gastos confirmados en la evaluacion financiera.
- [x] Mostrar accion de confirmar gasto en la app movil.
- [x] Cubrir validacion, confirmacion e idempotencia con pruebas.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- La clave idempotente queda unica en `expenses.idempotency_key`.
- Un `PendingMovement` confirmado queda ligado a un solo `Expense`.
- La UI movil usa una clave estable `confirm-<pendingMovementId>` para reintentos.

### File List

- apps/api/prisma/schema.prisma
- apps/api/prisma/migrations/20260625060000_add_expenses/migration.sql
- apps/api/src/features/pending-movements/pending-movements.ts
- apps/api/src/features/pending-movements/pending-movements.test.ts
- apps/api/src/features/pending-movements/pending-movements-routes.test.ts
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/features/pending-movements/pending-movement-schema.ts
- apps/mobile/src/shared/api/client.ts
