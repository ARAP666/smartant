# Story 4.1: Consultar resumen financiero

Status: review

## Story

Como usuario,
quiero ver mi situacion actual al abrir la aplicacion,
para saber cuanto puedo gastar.

## Acceptance Criteria

1. Dado un usuario autenticado, cuando abre Inicio, entonces ve Ingresos, Gastos, Meta de ahorro, Presupuesto y Saldo gastable del mismo Periodo.
2. Dado hasta 10 000 movimientos del usuario en el entorno de prueba local, cuando se solicita el resumen normal, entonces la respuesta se completa en menos de 500 ms.
3. Dado la consulta del resumen, cuando esta cargando, vacia, falla o se actualiza, entonces la pantalla representa cada estado de forma diferenciada.
4. Dado un usuario autenticado, cuando consulta el resumen, entonces no recibe datos de otras cuentas.

## Tasks / Subtasks

- [x] Anadir servicio de resumen financiero mensual.
- [x] Anadir endpoint autenticado `GET /api/v1/summary`.
- [x] Mostrar resumen en Inicio con estados de carga, vacio, error y actualizacion.
- [x] Cubrir calculo y ruta con pruebas.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- El periodo inicial es mensual; la seleccion semana/mes queda para Story 4.2.
- La consulta filtra por `userId` y por limites del mes actual.
- El calculo reutiliza `calculateSpendableBalance`.

### File List

- apps/api/src/features/summary/summary.ts
- apps/api/src/features/summary/summary.test.ts
- apps/api/src/features/summary/summary-routes.test.ts
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/mobile/app/(tabs)/index.tsx
- apps/mobile/src/features/summary/summary-schema.ts
- apps/mobile/src/shared/api/client.ts
