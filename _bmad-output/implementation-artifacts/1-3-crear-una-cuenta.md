---
baseline_commit: b67271c629dfd55e852b6bda244eb8d0f4e68de0
---

# Story 1.3: Crear una cuenta

Status: review

## Story

Como usuario,
quiero registrarme,
para mantener mis finanzas privadas.

## Acceptance Criteria

1. `POST /api/v1/auth/register` acepta un correo válido y una contraseña de 12 a 128 caracteres.
2. El correo se normaliza a minúsculas y queda protegido por una restricción única en PostgreSQL.
3. La contraseña se persiste únicamente como hash Argon2id.
4. Al crear la cuenta se genera una sesión opaca aleatoria; PostgreSQL guarda solo el hash SHA-256 del token y una fecha de expiración.
5. La respuesta 201 usa `{ data: { user, sessionToken } }`; nunca devuelve hashes.
6. Un correo registrado devuelve 409 con `code`, `message`, `details` y `requestId`, sin stack trace ni confirmar información adicional.
7. Una entrada inválida devuelve 422 con errores por campo producidos por Zod.
8. La app ofrece un formulario accesible de registro, representa estado inicial, carga, error y éxito, deshabilita el envío mientras procesa y guarda `sessionToken` mediante Expo SecureStore.
9. Tras registro exitoso la app navega a Inicio.
10. Los scripts raíz `type-check`, `lint`, `test` y `build` terminan correctamente y la migración se aplica a `sentDB`.

## Tasks / Subtasks

- [x] Añadir persistencia de usuarios y sesiones (AC: 2, 3, 4, 10)
  - [x] Crear modelos Prisma `User` y `Session` con nombres físicos `snake_case`.
  - [x] Crear y aplicar una migración aditiva en `sentDB`.
- [x] Implementar registro en la API (AC: 1-7)
  - [x] Añadir esquema Zod de registro.
  - [x] Añadir servicio mínimo que use Argon2id, token opaco y hash SHA-256.
  - [x] Añadir ruta `POST /api/v1/auth/register` y errores seguros 409/422.
  - [x] Mantener `/api/v1/health` sin regresiones.
- [x] Implementar registro móvil (AC: 8, 9)
  - [x] Instalar SecureStore y TanStack Query.
  - [x] Añadir cliente API configurable con `EXPO_PUBLIC_API_URL`.
  - [x] Crear formulario controlado con validación Zod y estados accesibles.
  - [x] Guardar el token en SecureStore y navegar a Inicio.
- [x] Añadir pruebas (AC: 1-9)
  - [x] Probar validación, normalización y contrato de errores API.
  - [x] Probar generación y hash de sesión sin exponer el token persistido.
  - [x] Probar validación móvil y clave de almacenamiento.
- [x] Ejecutar verificación local y gates (AC: 10)

## Dev Notes

### Guardrails

- Esta historia crea únicamente `User` y `Session`; no añadir preferencias financieras ni otros modelos.
- Usar `argon2` con `type: argon2id`; no implementar criptografía propia.
- Generar el token con `randomBytes(32).toString("base64url")`; persistir `sha256(token)`, nunca el token.
- Duración inicial de sesión: 30 días. Story 1.4 implementará lectura, revocación y cierre de sesión.
- Normalizar el correo con `trim().toLowerCase()` antes de validar/persistir.
- Contraseña: 12–128 caracteres. No imponer reglas arbitrarias de símbolos.
- No devolver un modelo Prisma directamente. Seleccionar solo `id` y `email`.
- El conflicto único debe traducirse a 409 sin filtrar detalles de PostgreSQL o Prisma.
- Mantener inyección mínima en `createApp` para probar sin PostgreSQL; no crear repositorios, factories ni interfaces de una sola implementación.
- Usar TanStack Query para la mutación móvil, según arquitectura; sin Redux.
- SecureStore SDK 54 está incluido en Expo Go. Guardar solo el token bajo una constante estable.
- No implementar login, restauración de sesión, middleware de rutas privadas ni logout; pertenecen a Story 1.4.

### API Contract

`POST /api/v1/auth/register`

```json
{
  "email": "ana@example.com",
  "password": "una contraseña larga"
}
```

Respuesta 201:

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "ana@example.com"
    },
    "sessionToken": "opaco"
  }
}
```

Errores:

- 409 `EMAIL_ALREADY_REGISTERED`
- 422 `VALIDATION_ERROR`, con `details.fieldErrors`

### File Structure

```text
apps/api/
  prisma/schema.prisma
  prisma/migrations/*_add_auth/migration.sql
  src/app.ts
  src/server.ts
  src/features/auth/register.ts
  src/features/auth/register.test.ts
  src/shared/errors.ts
apps/mobile/
  app/index.tsx
  app/(auth)/register.tsx
  app/_layout.tsx
  src/features/auth/register-schema.ts
  src/features/auth/register-schema.test.ts
  src/shared/api/client.ts
  src/shared/auth/session.ts
```

### Testing

- API route tests sustituyen la función de registro; no requieren PostgreSQL.
- Pruebas de servicio validan Argon2id y que el hash de sesión difiere del token.
- La comprobación manual local aplica migración, registra un correo único y verifica que la tabla almacene hashes.
- El build Android valida Router, SecureStore y TanStack Query.

### Previous Story Intelligence

- Expo Router 6.0.24 y Expo SDK 54.0.35 ya están configurados.
- El layout raíz muestra el splash antes del `Slot`; debe preservarse.
- Los tabs están bajo `/(tabs)` y el destino Inicio es `/(tabs)`.
- La API usa `createApp` y un callback de health; extender esa firma sin romper sus pruebas.
- Prisma Client se genera fuera de `node_modules`.

### Latest Technical Notes

- Expo SDK 54 incluye `expo-secure-store` ~15.0.8 y permite `setItemAsync` en Expo Go.
- `argon2` usa Argon2id por configuración explícita y ofrece binarios precompilados para plataformas soportadas.
- Prisma modela la relación User→Session como uno-a-muchos con clave foránea en `Session`.

### References

- [Epics: Story 1.3](../planning-artifacts/epics.md#story-13-crear-una-cuenta)
- [Architecture: Autenticación y seguridad](../planning-artifacts/architecture.md#autenticación-y-seguridad)
- [Architecture: API y comunicación](../planning-artifacts/architecture.md#api-y-comunicación)
- [Architecture: Aplicación móvil](../planning-artifacts/architecture.md#aplicación-móvil)
- https://docs.expo.dev/versions/v54.0.0/sdk/securestore/
- https://github.com/ranisalt/node-argon2
- https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations
- https://tanstack.com/query/latest/docs/framework/react/react-native

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- RED: cuatro suites nuevas fallaron porque registro, errores, validación móvil y sesión todavía no existían.
- Prisma aplicó `20260621231920_add_auth` a `sentDB`.
- Vitest no puede parsear el módulo nativo de React Native; la clave pura se separó en `session-key.ts`.
- Registro local real verificado: Argon2id=true, hash de token correcto y expiración futura; el usuario de prueba se eliminó.

### Implementation Plan

- Añadir solo tablas `users` y `sessions`.
- Mantener la ruta Express probada mediante callback inyectado, sin repositorio abstracto.
- Usar Argon2id, token aleatorio y SHA-256 antes de persistir.
- Implementar formulario móvil con Zod, TanStack Query y SecureStore.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Registro API implementado con respuestas 201, 409 y 422 seguras.
- Correo normalizado y único; contraseña y token solo se persisten como hashes.
- Migración de autenticación aplicada correctamente a PostgreSQL local.
- Formulario móvil accesible guarda la sesión en SecureStore y navega a Inicio.
- `EXPO_PUBLIC_API_URL` documentado para local, LAN y producción.
- Verificaciones finales: type-check, Biome, 17/17 pruebas y build Android pasan.

### File List

- `.env.example`
- `.env.development.example`
- `.env.production.example`
- `apps/api/package.json`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260621231920_add_auth/migration.sql`
- `apps/api/prisma/migrations/migration_lock.toml`
- `apps/api/src/app.ts`
- `apps/api/src/server.ts`
- `apps/api/src/features/auth/register.ts`
- `apps/api/src/features/auth/register.test.ts`
- `apps/api/src/features/auth/register-route.test.ts`
- `apps/api/src/shared/errors.ts`
- `apps/mobile/app.json`
- `apps/mobile/package.json`
- `apps/mobile/app/_layout.tsx`
- `apps/mobile/app/index.tsx`
- `apps/mobile/app/(auth)/register.tsx`
- `apps/mobile/src/features/auth/register-schema.ts`
- `apps/mobile/src/features/auth/register-schema.test.ts`
- `apps/mobile/src/shared/api/client.ts`
- `apps/mobile/src/shared/auth/session.ts`
- `apps/mobile/src/shared/auth/session-key.ts`
- `apps/mobile/src/shared/auth/session.test.ts`
- `package-lock.json`

### Change Log

- 2026-06-21: Story 1.3 implementada y validada; estado movido a review.
