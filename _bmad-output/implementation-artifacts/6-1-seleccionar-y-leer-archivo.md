# Story 6.1: Seleccionar y leer archivo

Status: review

## Story

Como usuario,
quiero cargar CSV,
para registrar varios movimientos.

## Acceptance Criteria

1. Dado la pantalla Anadir, cuando el usuario selecciona importar, entonces puede elegir un archivo mediante APIs compatibles con Expo Go.
2. Dado un archivo seleccionado, cuando se valida, entonces solo se acepta CSV dentro de los limites configurados de tamano y filas.
3. Dado un archivo invalido, cuando se rechaza, entonces no se crean Movimientos pendientes ni Gastos.
4. Dado un archivo valido, cuando se procesa, entonces la importacion queda asociada al usuario autenticado.

## Tasks / Subtasks

- [x] Instalar `expo-document-picker`.
- [x] Anadir accion Importar CSV en Anadir.
- [x] Validar extension, MIME y tamano.
- [x] Requerir sesion antes de seleccionar archivo.
- [x] No crear movimientos en esta etapa.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- Limite local: 2 MB.
- El parseo de filas y mapeo de columnas queda para 6.2/6.3.
- No se persiste archivo en esta historia.
- XLSX queda diferido: la libreria disponible trae vulnerabilidad alta sin fix, asi que se evitó agregarla al cliente.

### File List

- apps/mobile/package.json
- package-lock.json
- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/features/imports/import-file.ts
- apps/mobile/src/features/imports/import-file.test.ts
