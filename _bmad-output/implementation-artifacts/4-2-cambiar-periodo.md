# Story 4.2: Cambiar periodo

Status: review

## Story

Como usuario,
quiero alternar entre semana y mes,
para revisar distintos horizontes financieros.

## Acceptance Criteria

1. Dado la pantalla de Inicio, cuando el usuario selecciona semana o mes, entonces fechas, indicadores y graficos cambian al mismo Periodo.
2. Dado un Periodo activo, cuando se muestran los datos, entonces sus limites son visibles y respetan la zona horaria configurada.
3. Dado una seleccion realizada, cuando el usuario navega entre secciones durante la sesion, entonces el Periodo seleccionado se conserva.

## Tasks / Subtasks

- [x] Anadir soporte `WEEKLY | MONTHLY` al resumen API.
- [x] Validar `period` en `GET /api/v1/summary`.
- [x] Mostrar selector semana/mes en Inicio.
- [x] Actualizar indicadores, rango y grafico simple por periodo.
- [x] Conservar seleccion durante la sesion.
- [x] Ejecutar gates y mover a review.

## Dev Agent Record

### Completion Notes List

- La seleccion se conserva en memoria de modulo durante la sesion mobile.
- El resumen devuelve `period.timeZone` desde el perfil del usuario.
- El grafico es una barra nativa simple de ingresos/gastos; sin dependencia nueva.

### File List

- apps/api/src/features/summary/summary.ts
- apps/api/src/features/summary/summary.test.ts
- apps/api/src/features/summary/summary-routes.test.ts
- apps/api/src/app.ts
- apps/api/src/server.ts
- apps/mobile/app/(tabs)/index.tsx
- apps/mobile/src/features/summary/summary-schema.ts
- apps/mobile/src/shared/api/client.ts
