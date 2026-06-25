# Story 4.3: Consultar historial

Status: review

## Story

Como usuario,
quiero revisar mis movimientos,
para entender y corregir mis finanzas.

## Acceptance Criteria

1. Dado movimientos confirmados, cuando el usuario abre Movimientos, entonces ve Ingresos y Gastos ordenados por fecha y paginados.
2. Dado filtros de intervalo, Categoria o tipo, cuando el usuario los aplica, entonces la lista muestra unicamente los movimientos correspondientes.
3. Dado que no existen resultados, cuando se muestra el historial, entonces aparece un estado vacio claro.
4. Dado un Gasto propio seleccionado, cuando el usuario abre su detalle, entonces puede iniciar edicion o eliminacion.

## Tasks / Subtasks

- [x] Anadir servicio de historial de movimientos.
- [x] Anadir endpoint autenticado `GET /api/v1/history`.
- [x] Mostrar ingresos y gastos paginados en Movimientos.
- [x] Anadir filtros por intervalo, categoria y tipo.
- [x] Permitir iniciar edicion/eliminacion desde gastos listados.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- El historial une ingresos y gastos en memoria tras filtrar por usuario.
- `category` filtra gastos; no devuelve ingresos sin categoria cuando se aplica.
- Paginacion por `offset` y `limit`, maximo 50.

### File List

- apps/api/src/features/history/history.ts
- apps/api/src/features/history/history.test.ts
- apps/api/src/features/history/history-routes.test.ts
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/mobile/app/(tabs)/movements.tsx
- apps/mobile/src/features/history/history-schema.ts
- apps/mobile/src/shared/api/client.ts
