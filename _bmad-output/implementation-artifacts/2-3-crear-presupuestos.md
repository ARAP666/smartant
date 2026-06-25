# Story 2.3: Crear presupuestos

Status: review

## Story

Como usuario,
quiero limitar mis Gastos,
para controlar cuánto puedo consumir.

## Acceptance Criteria

1. El usuario autenticado puede crear Presupuestos semanales o mensuales con monto positivo.
2. Un Presupuesto puede ser general o por Categoría.
3. Una regla activa duplicada para el mismo periodo y alcance devuelve conflicto.
4. El usuario puede editar, activar, desactivar o eliminar Presupuestos propios.
5. Rutas sin sesión devuelven 401 y entradas inválidas devuelven 422.

## Tasks / Subtasks

- [x] Añadir modelo y migración `Budget`.
- [x] Añadir validación y CRUD protegido en API.
- [x] Añadir control de duplicados activos.
- [x] Añadir UI móvil para crear, activar/desactivar y eliminar.
- [x] Añadir pruebas de validación y rutas.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- Presupuestos editables vía API; UI móvil cubre crear, activar/desactivar y eliminar.
- Applied migration `20260625030000_add_budgets` to local `sentDB`.

### File List

- apps/api/prisma/schema.prisma
- apps/api/prisma/migrations/20260625030000_add_budgets/migration.sql
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/api/src/features/budgets/budgets.ts
- apps/api/src/features/budgets/budgets.test.ts
- apps/api/src/features/budgets/budgets-routes.test.ts
- apps/mobile/app/(tabs)/plan.tsx
- apps/mobile/src/features/budgets/budget-schema.ts
- apps/mobile/src/features/budgets/budget-schema.test.ts
- apps/mobile/src/shared/api/client.ts
