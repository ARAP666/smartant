# Story 6.2: Asignar columnas

Status: review

## Story

Como usuario,
quiero indicar que representa cada columna,
para interpretar correctamente mis datos.

## Acceptance Criteria

1. Dado un archivo leido, cuando se muestra el mapeo, entonces el usuario puede asignar fecha, monto, descripcion y Categoria.
2. Dado un mapeo, cuando falta fecha o monto, entonces no puede continuar.
3. Dado columnas ambiguas, cuando el sistema propone una asignacion, entonces requiere confirmacion antes de procesarlas.
4. Dado un mapeo confirmado, cuando se avanza, entonces se usa solo para esa importacion y se muestra una muestra previa de los valores interpretados.

## Tasks / Subtasks

- [x] Anadir propuesta de mapeo por encabezados comunes.
- [x] Validar que fecha y monto sean obligatorios.
- [x] Mostrar controles de asignacion en Anadir.
- [x] Mostrar muestra previa minima.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- El mapeo vive solo en memoria para la importacion actual.
- La lectura real de filas queda para 6.3.
- Se usan encabezados de ejemplo hasta que exista parser de archivo.

### File List

- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/features/imports/import-mapping.ts
- apps/mobile/src/features/imports/import-mapping.test.ts
