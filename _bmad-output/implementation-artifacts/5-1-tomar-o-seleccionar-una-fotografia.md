# Story 5.1: Tomar o seleccionar una fotografia

Status: review

## Story

Como usuario,
quiero usar un recibo,
para reducir el registro manual.

## Acceptance Criteria

1. Dado la pantalla Anadir, cuando el usuario elige fotografia, entonces puede usar camara o galeria mediante APIs compatibles con Expo Go.
2. Dado que camara o galeria requieren permiso, cuando se intenta acceder por primera vez, entonces la aplicacion solicita unicamente el permiso necesario.
3. Dado un permiso rechazado, cuando el usuario vuelve al flujo, entonces se explica el problema y se ofrece registro manual.
4. Dado un archivo seleccionado, cuando se prepara la carga, entonces se validan tipo y tamano y la fotografia queda asociada unicamente al usuario autenticado.

## Tasks / Subtasks

- [x] Instalar `expo-image-picker`.
- [x] Anadir acciones de camara y galeria en Anadir.
- [x] Solicitar permiso especifico por origen.
- [x] Validar JPG/PNG y tamano maximo.
- [x] Requerir sesion antes de seleccionar imagen.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- La carga real/OCR queda para 5.2.
- El flujo manual existente queda disponible cuando hay permiso rechazado.
- Limite de foto: 5 MB, JPG o PNG.

### File List

- apps/mobile/package.json
- package-lock.json
- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/features/receipts/receipt-photo.ts
- apps/mobile/src/features/receipts/receipt-photo.test.ts
