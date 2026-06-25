---
baseline_commit: b67271c629dfd55e852b6bda244eb8d0f4e68de0
---

# Story 1.4: Iniciar y cerrar sesión

Status: review

## Story

Como usuario registrado,
quiero gestionar mi sesión,
para acceder de forma segura.

## Acceptance Criteria

1. `POST /api/v1/auth/login` acepta correo y contraseña, normaliza el correo y devuelve `{ data: { user, sessionToken } }` cuando son válidos.
2. Correo inexistente y contraseña incorrecta devuelven el mismo 401 `INVALID_CREDENTIALS`, sin identificar qué campo falló.
3. Cada login crea una sesión opaca de 30 días y PostgreSQL persiste únicamente el hash SHA-256 del token.
4. `GET /api/v1/auth/session` acepta `Authorization: Bearer <token>` y devuelve el usuario de una sesión activa.
5. Una sesión ausente, expirada o revocada devuelve 401 `UNAUTHORIZED`.
6. `POST /api/v1/auth/logout` revoca la sesión activa y responde 204; el mismo token deja de autorizar.
7. La app ofrece un formulario accesible de login con estados inicial, carga y error; guarda el token en SecureStore y navega a Inicio.
8. Al iniciar la app, un token válido abre Inicio; un token ausente o inválido se elimina y abre Login.
9. Perfil permite cerrar sesión; después de revocar se elimina el token de SecureStore y se navega a Login.
10. Los scripts raíz `type-check`, `lint`, `test` y `build` terminan correctamente y la migración se aplica a `sentDB`.

## Tasks / Subtasks

- [x] Añadir revocación de sesiones (AC: 5, 6, 10)
  - [x] Añadir `revokedAt` opcional a `Session`.
  - [x] Crear y aplicar migración aditiva.
- [x] Implementar autenticación API (AC: 1-6)
  - [x] Extraer creación y hash de tokens para reutilizar registro/login.
  - [x] Implementar login con Argon2id y error genérico.
  - [x] Implementar resolución de sesión Bearer y logout.
  - [x] Añadir rutas login, session y logout con errores seguros.
- [x] Implementar sesión móvil (AC: 7-9)
  - [x] Ampliar SecureStore con lectura y eliminación.
  - [x] Añadir cliente API para login, sesión y logout.
  - [x] Crear pantalla Login y enlace desde Registro.
  - [x] Proteger tabs y añadir cierre de sesión en Perfil.
- [x] Añadir pruebas (AC: 1-9)
  - [x] Probar login genérico, autorización y revocación API.
  - [x] Probar helpers de token y validación móvil.
- [x] Ejecutar verificación local y gates (AC: 10)

## Dev Notes

### Guardrails

- Reutilizar `User`, `Session`, Argon2id, SecureStore y TanStack Query existentes.
- Añadir únicamente `revokedAt`; no crear refresh tokens, JWT, roles ni rotación en esta historia.
- Mantener sesiones opacas. Comparar siempre el SHA-256 del token recibido con `tokenHash`.
- Considerar válida solo una sesión con `revokedAt = null` y `expiresAt > now`.
- Login debe responder exactamente igual para correo inexistente y contraseña incorrecta.
- Logout revoca solo la sesión presentada, no todas las sesiones del usuario.
- `GET /auth/session` es la primera ruta privada y demuestra el 401 requerido.
- Al recibir 401 en mobile, eliminar el token local; no reintentar indefinidamente.
- No crear un contexto global de autenticación si TanStack Query y SecureStore cubren el flujo.
- Preservar splash, registro, navegación y health check.

### API Contract

- `POST /api/v1/auth/login` → 200 con usuario y token.
- `GET /api/v1/auth/session` → 200 con usuario; 401 sin sesión válida.
- `POST /api/v1/auth/logout` → 204; 401 sin sesión válida.
- Bearer header obligatorio para session/logout.

### File Structure

```text
apps/api/
  prisma/schema.prisma
  prisma/migrations/*_revoke_sessions/migration.sql
  src/features/auth/login.ts
  src/features/auth/session.ts
  src/features/auth/auth-routes.test.ts
  src/features/auth/register.ts
  src/app.ts
  src/server.ts
apps/mobile/
  app/index.tsx
  app/(auth)/login.tsx
  app/(auth)/register.tsx
  app/(tabs)/_layout.tsx
  app/(tabs)/profile.tsx
  src/features/auth/login-schema.ts
  src/shared/api/client.ts
  src/shared/auth/session.ts
```

### Testing

- Probar rutas mediante handlers inyectados, sin PostgreSQL.
- Probar helpers puros de Bearer/hash y validación de login.
- Verificación local: registrar, logout, confirmar 401, login y confirmar sesión.
- Build Android valida Router, SecureStore y Query.

### Previous Story Intelligence

- Registro ya crea sesiones de 30 días y persiste solo SHA-256.
- `createApp` recibe health y registro inyectados; agrupar handlers auth para evitar más argumentos posicionales.
- `app/index.tsx` actualmente redirige siempre a Registro.
- Perfil es placeholder y tabs no están protegidos.
- SecureStore solo implementa escritura.

### References

- [Epics: Story 1.4](../planning-artifacts/epics.md#story-14-iniciar-y-cerrar-sesión)
- [Architecture: Autenticación y seguridad](../planning-artifacts/architecture.md#autenticación-y-seguridad)
- [Story 1.3](./1-3-crear-una-cuenta.md)
- https://docs.expo.dev/versions/v54.0.0/sdk/securestore/
- https://github.com/ranisalt/node-argon2

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- RED: helpers de sesión/login no existían y las nuevas rutas respondían 404.
- Prisma aplicó `20260621233047_revoke_sessions` a `sentDB`.
- Flujo local verificado: registro 201, sesión 200, logout 204, token revocado 401, credenciales erróneas 401 genérico y nuevo login 200.
- El usuario de verificación local fue eliminado al terminar.

### Implementation Plan

- Añadir solo `revokedAt` a Session.
- Reutilizar creación/hash de tokens entre registro y login.
- Agrupar handlers auth inyectados en `createApp`.
- Usar SecureStore + Query para restaurar, proteger tabs y cerrar sesión.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Login API usa Argon2id y respuesta genérica para credenciales inválidas.
- Sesiones Bearer se validan por SHA-256, expiración y revocación.
- Logout revoca únicamente el token presentado.
- Mobile restaura sesión, elimina tokens inválidos y protege los tabs.
- Login y Perfil implementan almacenamiento y cierre de sesión con estados accesibles.
- Verificaciones finales: type-check, Biome, 27/27 pruebas, build Android y migraciones pasan.

### File List

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260621233047_revoke_sessions/migration.sql`
- `apps/api/src/app.ts`
- `apps/api/src/server.ts`
- `apps/api/src/features/auth/register.ts`
- `apps/api/src/features/auth/login.ts`
- `apps/api/src/features/auth/login.test.ts`
- `apps/api/src/features/auth/session.ts`
- `apps/api/src/features/auth/session.test.ts`
- `apps/api/src/features/auth/auth-routes.test.ts`
- `apps/mobile/app/index.tsx`
- `apps/mobile/app/(auth)/login.tsx`
- `apps/mobile/app/(auth)/register.tsx`
- `apps/mobile/app/(tabs)/_layout.tsx`
- `apps/mobile/app/(tabs)/profile.tsx`
- `apps/mobile/src/features/auth/login-schema.ts`
- `apps/mobile/src/features/auth/login-schema.test.ts`
- `apps/mobile/src/shared/api/client.ts`
- `apps/mobile/src/shared/auth/session.ts`
- `apps/mobile/src/shared/auth/current-session.ts`

### Change Log

- 2026-06-21: Story 1.4 implementada y validada; estado movido a review.
