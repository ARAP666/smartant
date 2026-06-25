# Story 2.1: Gestionar ingresos

Status: review

## Story

Como usuario,
quiero registrar mis Ingresos,
para conocer mis recursos disponibles.

## Acceptance Criteria

1. Crear Ingresos con monto entero positivo, fecha y descripción.
2. Listar únicamente Ingresos del usuario autenticado.
3. Editar o eliminar únicamente Ingresos propios.
4. Guardar importes como `BigInt` y responderlos como string.
5. Rutas sin sesión devuelven 401 y entradas inválidas devuelven 422.

## Tasks / Subtasks

- [x] Añadir modelo y migración `Income`.
- [x] Añadir validación y CRUD protegido en API.
- [x] Añadir formulario móvil para crear ingresos.
- [x] Añadir listado móvil con eliminación.
- [x] Añadir pruebas de validación y rutas.
- [x] Exponer edición en UI móvil.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- Corte mínimo implementado sin nuevas dependencias.
- CRUD completo implementado en API y UI móvil.
- Applied migration `20260625010000_add_incomes` to local `sentDB`.

### File List

- apps/api/prisma/schema.prisma
- apps/api/prisma/migrations/20260625010000_add_incomes/migration.sql
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/api/src/features/incomes/incomes.ts
- apps/api/src/features/incomes/incomes.test.ts
- apps/api/src/features/incomes/incomes-routes.test.ts
- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/app/(tabs)/movements.tsx
- apps/mobile/src/features/incomes/income-schema.ts
- apps/mobile/src/features/incomes/income-schema.test.ts
- apps/mobile/src/shared/api/client.ts
