# Story 3.5: Editar o eliminar gastos

Status: review

## Story

Como usuario,
quiero corregir mi historial,
para mantener calculos precisos.

## Acceptance Criteria

1. Dado un Gasto propio, cuando el usuario propone una edicion, entonces el sistema reevalua las reglas antes de confirmar el cambio.
2. Dado una edicion o eliminacion confirmada, cuando se procesa, entonces el Gasto y los calculos se actualizan en una transaccion.
3. Dado un Gasto ajeno, cuando se intenta modificar o eliminar, entonces la API no expone ni altera el registro.
4. Dado un error durante la mutacion, cuando la transaccion falla, entonces se conserva el estado anterior.

## Tasks / Subtasks

- [x] Anadir validacion de edicion de gasto.
- [x] Anadir endpoint transaccional de actualizar gasto.
- [x] Anadir endpoint transaccional de eliminar gasto.
- [x] Proteger edicion/eliminacion por `userId`.
- [x] Exponer acciones moviles sobre el gasto confirmado.
- [x] Cubrir rutas y validacion con pruebas.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- La edicion reevalua el saldo con el gasto propuesto antes de persistir.
- La eliminacion revierte el movimiento pendiente relacionado a `PENDING`.
- La API devuelve 404 para gastos ajenos o inexistentes.

### File List

- apps/api/src/features/pending-movements/pending-movements.ts
- apps/api/src/features/pending-movements/pending-movements.test.ts
- apps/api/src/features/pending-movements/pending-movements-routes.test.ts
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/shared/api/client.ts
