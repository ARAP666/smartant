# Story 1.5: Configurar contexto financiero

Status: review

## Story

Como usuario,
quiero elegir moneda y zona horaria,
para obtener periodos y cálculos correctos.

## Acceptance Criteria

1. Cada `User` almacena `currency` ISO 4217 y `timeZone` IANA; nuevos usuarios reciben `CRC` y `America/Costa_Rica`.
2. `GET /api/v1/profile` devuelve exclusivamente el perfil del usuario autenticado.
3. `PATCH /api/v1/profile` acepta moneda y zona horaria válidas, las guarda para ese usuario y devuelve el perfil actualizado.
4. Monedas no soportadas o zonas horarias inválidas devuelven 422 `VALIDATION_ERROR` con errores por campo.
5. Una sesión ausente, expirada o revocada devuelve 401.
6. Perfil móvil carga los valores guardados, permite editarlos y representa carga, error, guardado exitoso y botón deshabilitado durante la mutación.
7. La pantalla muestra inicialmente `CRC` y `America/Costa_Rica` para una cuenta nueva y ambos valores son editables.
8. La zona horaria persistida queda disponible para historias posteriores que calculen Periodos.
9. Los scripts raíz `type-check`, `lint`, `test` y `build` terminan correctamente y la migración se aplica a `sentDB`.

## Tasks / Subtasks

- [x] Añadir contexto financiero a User (AC: 1, 8, 9)
  - [x] Añadir `currency` y `timeZone` con valores iniciales.
  - [x] Crear y aplicar migración aditiva.
- [x] Implementar perfil API (AC: 2-5)
  - [x] Crear validación Zod de moneda y zona IANA.
  - [x] Crear lectura y actualización con alcance por `userId`.
  - [x] Añadir rutas protegidas GET/PATCH `/api/v1/profile`.
- [x] Implementar configuración móvil (AC: 6, 7)
  - [x] Añadir funciones cliente para leer y guardar perfil.
  - [x] Convertir Perfil en formulario accesible, preservando logout.
  - [x] Invalidar/actualizar caché tras guardar.
- [x] Añadir pruebas (AC: 1-8)
  - [x] Probar validación de moneda/zona y rutas protegidas.
  - [x] Probar validación móvil y valores iniciales.
- [x] Ejecutar verificación local y gates (AC: 9)

## Dev Notes

### Guardrails

- Añadir los dos campos directamente a `User`; una tabla separada no aporta valor.
- Campos físicos `currency` y `time_zone`; Prisma usa `currency` y `timeZone`.
- Valores iniciales en PostgreSQL: `CRC` y `America/Costa_Rica`.
- Validar moneda mediante `Intl.NumberFormat` y formato exacto `[A-Z]{3}`.
- Validar zona horaria mediante `Intl.DateTimeFormat(..., { timeZone })`; no mantener una lista manual.
- GET/PATCH derivan `userId` de la sesión, nunca del body o URL.
- PATCH exige ambos campos para mantener un contrato pequeño y determinista.
- No calcular Periodos todavía; solo persistir el contexto.
- No instalar picker de moneda/zona. Dos `TextInput` accesibles cubren el MVP.
- Preservar cierre de sesión en Perfil.

### API Contract

`GET /api/v1/profile`

```json
{
  "data": {
    "profile": {
      "email": "ana@example.com",
      "currency": "CRC",
      "timeZone": "America/Costa_Rica"
    }
  }
}
```

`PATCH /api/v1/profile`

```json
{
  "currency": "USD",
  "timeZone": "America/New_York"
}
```

### File Structure

```text
apps/api/
  prisma/schema.prisma
  prisma/migrations/*_add_user_context/migration.sql
  src/features/profile/profile.ts
  src/features/profile/profile.test.ts
  src/features/profile/profile-routes.test.ts
  src/app.ts
  src/server.ts
apps/mobile/
  app/(tabs)/profile.tsx
  src/features/profile/profile-schema.ts
  src/features/profile/profile-schema.test.ts
  src/shared/api/client.ts
```

### Testing

- Rutas probadas con handlers inyectados.
- Validación pura probada sin PostgreSQL ni emulador.
- Verificación local crea usuario, lee defaults, actualiza y comprueba PostgreSQL.

### Previous Story Intelligence

- `authenticateSession` devuelve `{ id, email }` y ya aplica expiración/revocación.
- `createApp` agrupa handlers auth; añadir handlers profile separados evita mezclar responsabilidades.
- Perfil ya contiene logout y usa TanStack Query.
- El cliente móvil ya centraliza errores y Bearer.

### References

- [Epics: Story 1.5](../planning-artifacts/epics.md#story-15-configurar-contexto-financiero)
- [Architecture: Arquitectura de datos](../planning-artifacts/architecture.md#arquitectura-de-datos)
- [Story 1.4](./1-4-iniciar-y-cerrar-sesion.md)

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story 1.5 implemented: User context fields, protected profile endpoints, mobile profile form, migration, tests, and demo seed account.
- Applied migration `20260625000000_add_user_context` to local `sentDB`.
- Demo account ready: `demo@smartant.local` / `SmartAntDemo2026!`.

### File List

- apps/api/prisma/schema.prisma
- apps/api/prisma/migrations/20260625000000_add_user_context/migration.sql
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/api/src/features/profile/profile.ts
- apps/api/src/features/profile/profile.test.ts
- apps/api/src/features/profile/profile-routes.test.ts
- apps/api/scripts/seed-demo-user.ts
- apps/api/package.json
- apps/mobile/app/(tabs)/profile.tsx
- apps/mobile/src/features/profile/profile-schema.ts
- apps/mobile/src/features/profile/profile-schema.test.ts
- apps/mobile/src/shared/api/client.ts
- biome.json
- docs/demo-account.md
