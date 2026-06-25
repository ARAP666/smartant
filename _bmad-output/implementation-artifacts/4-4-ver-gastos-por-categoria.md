# Story 4.4: Ver gastos por categoria

Status: review

## Story

Como usuario,
quiero conocer donde gasto mas,
para comprender mis habitos.

## Acceptance Criteria

1. Dado Gastos en el Periodo activo, cuando se solicita la distribucion, entonces se muestra total y porcentaje por Categoria y la suma coincide con el total de Gastos filtrados.
2. Dado Categorias sin Gastos, cuando se calculan porcentajes, entonces no distorsionan el resultado.
3. Dado la visualizacion por Categoria, cuando se presenta, entonces puede comprenderse sin depender unicamente del color.
4. Dado un cambio de Periodo o filtros, cuando se actualiza la consulta, entonces la distribucion cambia de forma consistente.

## Tasks / Subtasks

- [x] Anadir calculo de gastos por categoria en el resumen.
- [x] Anadir endpoint `GET /api/v1/summary/categories`.
- [x] Mostrar monto y porcentaje por categoria en Inicio.
- [x] Reusar el periodo activo semana/mes.
- [x] Cubrir calculo y ruta con pruebas.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- La distribucion omite categorias sin gasto.
- El porcentaje se calcula sobre el total del periodo activo.
- No se agrego libreria de graficos; se muestra texto con monto y porcentaje.

### File List

- apps/api/src/features/summary/summary.ts
- apps/api/src/features/summary/summary.test.ts
- apps/api/src/features/summary/summary-routes.test.ts
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/mobile/app/(tabs)/index.tsx
- apps/mobile/src/features/summary/summary-schema.ts
- apps/mobile/src/shared/api/client.ts
