# Story 2.4: Crear metas de ahorro

Status: review

## Story

Como usuario,
quiero reservar una cantidad,
para proteger mis objetivos.

## Acceptance Criteria

1. El usuario autenticado puede crear Metas semanales o mensuales con monto positivo.
2. La Meta queda activa para el periodo configurado.
3. El usuario puede editar, activar, desactivar o eliminar Metas propias.
4. Las Metas no trasladan sobrantes automáticamente entre periodos.
5. Plan muestra Metas activas/inactivas con monto y periodo.
6. Rutas sin sesión devuelven 401 y entradas inválidas devuelven 422.

## Tasks / Subtasks

- [x] Añadir modelo y migración `SavingsGoal`.
- [x] Añadir validación y CRUD protegido en API.
- [x] Añadir UI móvil para crear, activar/desactivar y eliminar.
- [x] Añadir pruebas de validación y rutas.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- Sin rollover automático; cada meta conserva su periodo configurado.
- Applied migration `20260625040000_add_savings_goals` to local `sentDB`.

### File List

- apps/api/prisma/schema.prisma
- apps/api/prisma/migrations/20260625040000_add_savings_goals/migration.sql
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/api/src/features/savings-goals/savings-goals.ts
- apps/api/src/features/savings-goals/savings-goals.test.ts
- apps/api/src/features/savings-goals/savings-goals-routes.test.ts
- apps/mobile/app/(tabs)/plan.tsx
- apps/mobile/src/features/savings-goals/savings-goal-schema.ts
- apps/mobile/src/features/savings-goals/savings-goal-schema.test.ts
- apps/mobile/src/shared/api/client.ts
