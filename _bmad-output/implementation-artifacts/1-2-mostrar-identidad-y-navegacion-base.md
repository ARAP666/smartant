---
baseline_commit: b67271c629dfd55e852b6bda244eb8d0f4e68de0
---

# Story 1.2: Mostrar identidad y navegación base

Status: review

## Story

Como usuario,
quiero reconocer Smart Ant al abrirla y navegar por sus secciones,
para orientarme desde el primer uso.

## Acceptance Criteria

1. Al abrir la aplicación se muestra una pantalla de splash que contiene únicamente `SmartAntWordmark`, con una animación breve y sutil.
2. Si `AccessibilityInfo.isReduceMotionEnabled()` devuelve `true`, el splash no ejecuta animación y su duración se reduce.
3. La misma implementación de `SmartAntWordmark` aparece dentro de la aplicación; no se duplica la marca.
4. La navegación principal usa Expo Router y ofrece exactamente cinco destinos: Inicio, Movimientos, Añadir, Plan y Perfil.
5. Cada destino usa un icono importado directamente desde `lucide-react-native`; no se usan iconos Unicode ni un import dinámico de toda la biblioteca.
6. Los tabs tienen etiquetas accesibles, área táctil nativa y contraste legible, y la app compila para Android con Expo SDK 54.
7. Los scripts raíz `type-check`, `lint`, `test` y `build` terminan correctamente.

## Tasks / Subtasks

- [x] Configurar Expo Router y Lucide (AC: 4, 5, 6)
  - [x] Instalar dependencias compatibles con Expo SDK 54 mediante `expo install`.
  - [x] Cambiar el entry point a `expo-router/entry` y habilitar typed routes.
- [x] Crear identidad compartida y splash accesible (AC: 1, 2, 3)
  - [x] Crear `src/shared/components/SmartAntWordmark.tsx`.
  - [x] Crear splash de aplicación que solo renderice el wordmark.
  - [x] Consultar y escuchar la preferencia de reducción de movimiento.
- [x] Crear navegación principal (AC: 3, 4, 5, 6)
  - [x] Crear layout raíz y grupo `(tabs)`.
  - [x] Crear Inicio, Movimientos, Añadir, Plan y Perfil como pantallas mínimas.
  - [x] Mostrar `SmartAntWordmark` en Inicio reutilizando el componente compartido.
- [x] Añadir comprobaciones mínimas (AC: 2, 4, 5, 7)
  - [x] Probar la duración de splash con y sin reducción de movimiento.
  - [x] Probar que la configuración contiene exactamente los cinco tabs y sus iconos Lucide.
- [x] Ejecutar y registrar verificaciones (AC: 6, 7)

## Dev Notes

### Guardrails

- Extender `apps/mobile`; no tocar API, Prisma ni `packages/finance`.
- Usar Expo Router porque ya está decidido en arquitectura. No instalar otra biblioteca de navegación.
- Usar `Animated` y `AccessibilityInfo` de React Native; no añadir una dependencia de animación.
- `SmartAntWordmark` es texto tipográfico, no un logo gráfico ni una imagen generada.
- El splash de esta historia es una vista React inicial. El splash nativo de Expo permanece estático y no debe intentar importar un componente React.
- Las pantallas son placeholders navegables; no añadir datos, formularios, autenticación ni TanStack Query antes de sus historias.
- Importar los cinco iconos por nombre desde `lucide-react-native`; importar el paquete completo aumenta el bundle.
- No crear un sistema de diseño. Mantener colores y espaciado locales hasta que exista un segundo uso real.

### Files to Update

- `apps/mobile/package.json`: entry point, dependencias y scripts existentes; preservar Expo SDK 54.
- `apps/mobile/app.json`: añadir `scheme`, plugin de Expo Router y typed routes; preservar iconos/configuración actual.
- `apps/mobile/tsconfig.json`: añadir alias `@/*` e includes requeridos por Expo Router.
- Eliminar `App.tsx` e `index.ts` cuando Expo Router sea el único entry point.

### Files to Create

```text
apps/mobile/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      movements.tsx
      add.tsx
      plan.tsx
      profile.tsx
  src/
    navigation/tabs.ts
    shared/components/SmartAntWordmark.tsx
    shared/components/AppSplash.tsx
    shared/components/app-splash.test.ts
    navigation/tabs.test.ts
```

### Testing

- Mantener Vitest en la raíz; las pruebas no deben requerir emulador.
- Extraer decisiones puras (`getSplashDuration`, configuración de tabs) para probarlas sin renderizar React Native.
- El build Android de Expo es la comprobación de integración de rutas, iconos y bundle.

### Previous Story Intelligence

- Expo está fijado en `54.0.35`, React Native `0.81.5` y React `19.1.0`.
- Los cuatro scripts raíz ya pasan; no romper workspaces ni CI.
- Biome solo analiza código de aplicación y configuración raíz.
- El entorno local usa Node 22; CI y `engines` exigen Node 24.

### Latest Technical Notes

- La instalación manual oficial de Expo Router exige dependencias compatibles con el SDK, `main: expo-router/entry`, `scheme` y typed routes.
- Lucide React Native depende de `react-native-svg`; instalar la versión compatible mediante Expo.
- React Native expone `isReduceMotionEnabled()` y el evento `reduceMotionChanged`.

### References

- [Epics: Story 1.2](../planning-artifacts/epics.md#story-12-mostrar-identidad-y-navegación-base)
- [Architecture: Aplicación móvil](../planning-artifacts/architecture.md#aplicación-móvil)
- [Architecture: Estructura](../planning-artifacts/architecture.md#estructura)
- [PRD: Diseño y plataforma](../planning-artifacts/prds/prd-smart-ant-2026-06-19/prd.md#8-diseño-y-plataforma)
- https://docs.expo.dev/router/installation/
- https://lucide.dev/guide/packages/lucide-react-native
- https://reactnative.dev/docs/accessibilityinfo

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- RED: las dos suites móviles fallaron porque `tabs.ts` y la decisión de splash todavía no existían.
- GREEN: 4 pruebas móviles y 4 pruebas API pasan.
- TypeScript detectó que `SvgProps` no modela `size`; se usó el tipo `LucideIcon` exportado por Lucide.
- `expo config` confirmó SDK 54, scheme `smart-ant`, plugin Router y typed routes.

### Implementation Plan

- Configurar Expo Router y Lucide con dependencias compatibles con SDK 54.
- Mantener decisiones comprobables en funciones/configuración puras.
- Renderizar un splash React mínimo y reutilizar el wordmark en Inicio.
- Crear los cinco tabs sin lógica futura ni sistema de diseño.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Expo Router quedó como único entry point; `App.tsx` e `index.ts` fueron retirados.
- `SmartAntWordmark` se reutiliza en splash e Inicio.
- El splash consulta y escucha reducción de movimiento; usa 900 ms o 0 ms.
- La navegación expone exactamente Inicio, Movimientos, Añadir, Plan y Perfil con imports Lucide directos.
- Verificaciones finales: type-check, Biome, 8/8 pruebas y build Android pasan.

### File List

- `apps/mobile/App.tsx` (eliminado)
- `apps/mobile/index.ts` (eliminado)
- `apps/mobile/app.json`
- `apps/mobile/package.json`
- `apps/mobile/tsconfig.json`
- `apps/mobile/app/_layout.tsx`
- `apps/mobile/app/(tabs)/_layout.tsx`
- `apps/mobile/app/(tabs)/index.tsx`
- `apps/mobile/app/(tabs)/movements.tsx`
- `apps/mobile/app/(tabs)/add.tsx`
- `apps/mobile/app/(tabs)/plan.tsx`
- `apps/mobile/app/(tabs)/profile.tsx`
- `apps/mobile/src/navigation/tabs.ts`
- `apps/mobile/src/navigation/tabs.test.ts`
- `apps/mobile/src/shared/components/AppSplash.tsx`
- `apps/mobile/src/shared/components/SmartAntWordmark.tsx`
- `apps/mobile/src/shared/components/splash-motion.ts`
- `apps/mobile/src/shared/components/app-splash.test.ts`
- `package-lock.json`

### Change Log

- 2026-06-21: Story 1.2 implementada y validada; estado movido a review.
