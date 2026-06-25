# Story 2.2: Configurar salario recurrente

Status: review

## Story

Como usuario,
quiero registrar mi Salario,
para incorporarlo a mi planificación.

## Acceptance Criteria

1. El usuario autenticado puede guardar monto, frecuencia semanal o mensual y próxima fecha.
2. Editar el salario no altera Ingresos históricos confirmados.
3. El usuario puede pausar, reanudar o eliminar la recurrencia.
4. Procesar el salario crea un Ingreso confirmado.
5. Reintentar el mismo periodo no crea Ingresos duplicados.
6. Rutas sin sesión devuelven 401 y entradas inválidas devuelven 422.

## Tasks / Subtasks

- [x] Añadir modelos `Salary` y `SalaryRun` con idempotencia por periodo.
- [x] Añadir validación y rutas protegidas de salario.
- [x] Añadir generación idempotente de Ingreso desde salario.
- [x] Añadir UI móvil en Plan para guardar, pausar, generar y eliminar.
- [x] Añadir pruebas de validación y rutas.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- Corte mínimo: generación explícita, no scheduler.
- CRUD de salario, pausa/reanudación, eliminación y generación idempotente implementados.
- Applied migration `20260625020000_add_salary` to local `sentDB`.

### File List

- apps/api/prisma/schema.prisma
- apps/api/prisma/migrations/20260625020000_add_salary/migration.sql
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/api/src/features/salary/salary.ts
- apps/api/src/features/salary/salary.test.ts
- apps/api/src/features/salary/salary-routes.test.ts
- apps/mobile/app/(tabs)/plan.tsx
- apps/mobile/src/features/salary/salary-schema.ts
- apps/mobile/src/features/salary/salary-schema.test.ts
- apps/mobile/src/shared/api/client.ts
