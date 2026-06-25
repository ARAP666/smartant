# Story 6.4: Confirmar importacion

Status: review

## Story

Como usuario,
quiero confirmar las filas validas seleccionadas,
para que se registren como gastos y afecten mi saldo.

## Acceptance Criteria

1. Dado filas validas seleccionadas, cuando confirmo la importacion, entonces el sistema crea los gastos correspondientes.
2. Dado una confirmacion repetida, cuando se reintenta con la misma llave, entonces las filas ya registradas se omiten de forma idempotente.
3. Dado cada fila confirmada, cuando se guarda, entonces se evalua contra las reglas financieras activas.
4. Dado el resultado de la importacion, cuando termina el proceso, entonces veo cuantas filas fueron creadas, omitidas o fallidas.

## Tasks / Subtasks

- [x] Anadir contrato y endpoint para confirmar importaciones.
- [x] Crear movimientos pendientes confirmados y gastos por fila valida.
- [x] Usar idempotencia por archivo y fila para reintentos.
- [x] Conectar el boton de confirmacion en mobile.
- [x] Mostrar resumen de filas creadas y omitidas.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- La importacion confirmada reutiliza `expenses` y `pending_movements` sin agregar tablas nuevas.
- Cada fila se evalua con `calculateSpendableBalance` y reporta la severidad de alerta obtenida.
- La confirmacion usa filas validas leidas desde CSV.
- XLSX queda diferido hasta incorporar parser seguro o procesamiento backend.

### File List

- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/api/src/features/imports/imports.ts
- apps/api/src/features/imports/imports.test.ts
- apps/api/src/features/imports/imports-routes.test.ts
- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/features/imports/import-preview.ts
- apps/mobile/src/shared/api/client.ts
