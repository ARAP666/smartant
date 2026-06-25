# Story 5.2: Detectar datos del recibo

Status: review

## Story

Como usuario,
quiero obtener una propuesta de Gasto desde una fotografia,
para ahorrar tiempo.

## Acceptance Criteria

1. Dado una fotografia valida, cuando se envia mediante multipart, entonces el procesamiento intenta detectar comercio, fecha, monto y descripcion.
2. Dado datos detectados total o parcialmente, cuando termina el procesamiento, entonces se crea un Movimiento pendiente, nunca un Gasto confirmado.
3. Dado un fallo parcial, cuando algunos campos si fueron detectados, entonces se conservan para revision.
4. Dado un error de procesamiento, cuando la API responde, entonces incluye un `requestId` sin exponer datos privados.
5. Dado el entorno de produccion, cuando se habilita OCR, entonces proveedor, almacenamiento y retencion estan configurados explicitamente.

## Tasks / Subtasks

- [x] Anadir endpoint multipart `POST /api/v1/receipts/detect`.
- [x] Validar tipo y tamano de fotografia.
- [x] Intentar deteccion simple de monto, fecha y comercio desde texto opcional.
- [x] Crear Movimiento pendiente, no Gasto confirmado.
- [x] Conectar deteccion desde la pantalla Anadir.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- OCR real queda fuera hasta configurar proveedor, almacenamiento y retencion.
- La deteccion actual usa texto multipart opcional; si faltan campos crea valores revisables.
- Los archivos se procesan en memoria y no se persisten.
- Nota temporal: esto no bloquea historias locales. Antes de EAS/APK se debe guardar la imagen en folder/storage y persistir la ruta en base de datos; ver `docs/production-readiness.md`.

### File List

- apps/api/package.json
- package-lock.json
- apps/api/src/features/receipts/receipts.ts
- apps/api/src/features/receipts/receipts.test.ts
- apps/api/src/features/receipts/receipts-routes.test.ts
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/mobile/app/(tabs)/add.tsx
- apps/mobile/src/features/receipts/receipt-photo.ts
- apps/mobile/src/shared/api/client.ts
