# Story 3.3: Mostrar alertas financieras

Status: review

## Story

Como usuario,
quiero una explicación clara cuando un Gasto afecta mi plan,
para entender la consecuencia antes de confirmar.

## Acceptance Criteria

1. La evaluación de gasto devuelve una alerta con severidad informativa, preventiva o bloqueo lógico.
2. La alerta identifica monto, regla afectada y saldo gastable resultante.
3. La UI móvil muestra la alerta evaluada.
4. La alerta no promete resultados ni se expresa como asesoría financiera.

## Tasks / Subtasks

- [x] Añadir cálculo puro de alertas financieras.
- [x] Añadir alertas a la respuesta de evaluación.
- [x] Mostrar alertas en Añadir.
- [x] Añadir prueba de severidad/regla limitante.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- Sin tabla nueva; alertas derivadas del cálculo.

### File List

- packages/finance/src/index.ts
- packages/finance/src/spendable-balance.test.ts
- apps/api/src/features/pending-movements/pending-movements.ts
- apps/api/src/features/pending-movements/pending-movements-routes.test.ts
- apps/api/src/app.ts
- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/features/pending-movements/pending-movement-schema.ts
