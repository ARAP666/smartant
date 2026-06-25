# Story 6.3: Revisar resultados

Status: review

## Story

Como usuario,
quiero distinguir filas validas y problematicas,
para decidir cuales importar.

## Acceptance Criteria

1. Dado un archivo procesado, cuando se presenta la previsualizacion, entonces cada fila se clasifica como valida, invalida o posible duplicado.
2. Dado una fila invalida, cuando el usuario la consulta, entonces ve que campo impide importarla.
3. Dado un posible duplicado, cuando el usuario lo consulta, entonces ve la coincidencia detectada.
4. Dado la previsualizacion, cuando el usuario selecciona filas, entonces solo puede confirmar filas validas y ninguna fila afecta todavia los calculos.

## Tasks / Subtasks

- [x] Anadir clasificador de filas de importacion.
- [x] Mostrar filas validas, invalidas y duplicadas.
- [x] Mostrar razon de invalidez o coincidencia.
- [x] Permitir seleccionar solo filas validas.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- La previsualizacion usa filas reales de CSV con encabezados.
- Ninguna seleccion crea movimientos ni afecta calculos.
- La confirmacion real queda para 6.4.

### File List

- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/features/imports/import-preview.ts
- apps/mobile/src/features/imports/import-preview.test.ts
