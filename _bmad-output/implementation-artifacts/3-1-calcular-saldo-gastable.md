# Story 3.1: Calcular saldo gastable

Status: review

## Story

Como usuario,
quiero un cálculo confiable,
para saber cuánto puedo gastar sin afectar mi plan.

## Acceptance Criteria

1. El motor financiero calcula ingresos, gastos, saldo base y saldo gastable.
2. Usa la restricción más conservadora entre saldo base, presupuestos y metas de ahorro.
3. Nunca devuelve saldo gastable menor que cero.
4. Las reglas por categoría solo aplican a gastos de esa categoría; las generales aplican siempre.
5. El paquete no depende de Expo, Express ni Prisma.

## Tasks / Subtasks

- [x] Implementar cálculo puro con `bigint`.
- [x] Devolver márgenes aplicables para explicar restricciones.
- [x] Añadir pruebas de restricción conservadora y categorías.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- Motor puro agregado en `packages/finance`; sin dependencias nuevas.

### File List

- packages/finance/src/index.ts
- packages/finance/src/spendable-balance.test.ts
- vitest.config.ts
