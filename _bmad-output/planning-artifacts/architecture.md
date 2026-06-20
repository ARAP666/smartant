---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/planning-artifacts/briefs/brief-smart-ant-2026-06-19/brief.md
  - _bmad-output/planning-artifacts/briefs/brief-smart-ant-2026-06-19/addendum.md
  - _bmad-output/planning-artifacts/prds/prd-smart-ant-2026-06-19/prd.md
  - _bmad-output/planning-artifacts/prds/prd-smart-ant-2026-06-19/addendum.md
  - docs/development-standard.md
  - docs/production-readiness.md
  - docs/process/bmad-method.md
workflowType: architecture
project_name: Smart Ant
user_name: Carlo
date: 2026-06-19
lastStep: 8
status: complete
completedAt: 2026-06-19
---

# Architecture Decision Document

Este documento se construye mediante decisiones arquitectónicas trazables para Smart Ant.

## Análisis del contexto del proyecto

### Resumen de requisitos

**Requisitos funcionales:**

El PRD define 33 requisitos organizados en cuenta y configuración, ingresos, gastos manuales, captura por fotografía, importación CSV/XLSX, presupuestos y ahorro, alertas, panel e historial. La arquitectura debe soportar una aplicación móvil, una API, persistencia relacional y un motor financiero determinista.

**Requisitos no funcionales:**

La solución requiere aislamiento de datos por usuario, validación en límites de confianza, operaciones financieras transaccionales, TypeScript estricto, accesibilidad básica, observabilidad sin datos privados y respuestas normales inferiores a 500 ms en local con 10 000 movimientos por usuario.

**Escala y complejidad:**

- Dominio principal: aplicación móvil financiera personal con API.
- Complejidad: media.
- Componentes arquitectónicos estimados: aplicación móvil, API, PostgreSQL, motor financiero, importador de archivos y procesamiento de recibos.
- No requiere tiempo real, cuentas compartidas, pagos ni infraestructura empresarial en el MVP.

### Restricciones técnicas y dependencias

- React Native con Expo Go durante la primera etapa.
- Express y TypeScript para la API.
- PostgreSQL local y backend preparado para Railway.
- Importes almacenados como enteros en la unidad monetaria mínima.
- Movimientos pendientes excluidos de todos los cálculos.
- Confirmaciones financieras ejecutadas mediante transacciones.
- Biome para formato y análisis estático.
- Lucide como única biblioteca de iconos; sin iconos Unicode.
- Secretos reales fuera del repositorio y archivos de ejemplo para variables de entorno.
- El proveedor OCR y su política de retención siguen pendientes.

### Preocupaciones transversales

- Autenticación, autorización y propiedad de datos.
- Privacidad de información financiera y fotografías.
- Zonas horarias y límites de periodos.
- Idempotencia y detección de duplicados.
- Una única definición verificable del cálculo de Saldo gastable.
- Validación, errores y observabilidad.
- Estados asíncronos y accesibilidad.

## Evaluación del starter

### Dominio tecnológico principal

Aplicación móvil React Native con API Node.js y PostgreSQL.

### Opciones consideradas

- Starter oficial de Expo: mantenido, compatible con Expo Go y con Expo Router y TypeScript.
- Boilerplates full-stack de terceros: descartados porque añaden decisiones y dependencias no requeridas.
- Generador de Express: descartado porque su estructura y vistas no aportan valor a una API JSON pequeña.

### Starter seleccionado

Se usarán starters oficiales mínimos:

```bash
npx create-expo-app@latest apps/mobile
mkdir apps/api
cd apps/api
npm init -y
npm install express
```

Durante la transición vigente de Expo, se usará la versión de SDK compatible con Expo Go en dispositivos físicos indicada por la documentación oficial al ejecutar la historia de inicialización.

### Decisiones proporcionadas

- Expo Router y TypeScript para navegación y aplicación móvil.
- Express 5 sobre Node.js para la API.
- Monorepo simple mediante npm workspaces con `apps/mobile` y `apps/api`.
- Biome compartido desde la raíz.
- Vitest para pruebas unitarias.
- Railway construirá la API Node directamente.
- Docker se añadirá únicamente si una restricción real de despliegue lo exige.

La inicialización del proyecto será la primera historia de implementación.

## Decisiones arquitectónicas principales

### Prioridad

**Críticas:**

- PostgreSQL 18 y Prisma ORM 7.
- Autenticación por correo y contraseña con sesiones opacas.
- API REST JSON versionada.
- Una única implementación del motor financiero.
- Transacciones para mutaciones financieras.

**Importantes:**

- Expo Router y TanStack Query.
- Zod en límites de confianza.
- PostgreSQL local y Railway en producción.
- Logs JSON correlacionables.

**Diferidas:**

- Redis, colas, microservicios y caché distribuida.
- Notificaciones push y EAS.
- Docker, salvo que una restricción de despliegue lo exija.
- Proveedor OCR definitivo.

### Arquitectura de datos

- PostgreSQL 18.
- Prisma ORM 7 con migraciones aditivas.
- Importes como `BigInt` en unidad monetaria mínima.
- Fechas persistidas de forma inequívoca; periodos calculados con la zona horaria del usuario.
- Sin caché inicial.
- Transacciones para confirmar, editar, eliminar o importar movimientos.
- Restricciones e índices PostgreSQL para propiedad, unicidad e idempotencia.

### Autenticación y seguridad

- Registro e inicio de sesión mediante correo y contraseña.
- Contraseñas con Argon2id.
- Sesiones opacas aleatorias; solo el hash del token se almacena en PostgreSQL.
- Token móvil guardado mediante Expo SecureStore.
- Toda consulta de datos incluye alcance por `userId`.
- Helmet, CORS restringido y rate limiting para autenticación e importaciones.
- Fotografías privadas y eliminables según política de retención pendiente.

### API y comunicación

- REST JSON bajo `/api/v1`.
- Zod valida solicitudes y variables de entorno.
- Errores con `code`, `message`, `details` y `requestId`.
- Clave de idempotencia para importaciones y confirmaciones reintentables.
- Fotografías mediante multipart.
- El proveedor OCR se integra directamente cuando se elija; no se crea una abstracción especulativa.

### Aplicación móvil

- Expo Router para rutas y navegación.
- TanStack Query para estado del servidor.
- Estado local con APIs de React; sin Redux.
- Formularios controlados con Zod donde exista validación de negocio.
- Componentes compartidos solo después del segundo uso real.
- Estados de carga, vacío, error, éxito y deshabilitado en superficies asíncronas.
- Un componente compartido `SmartAntWordmark` renderiza la misma marca tipográfica en el splash y dentro de la aplicación.
- El splash muestra únicamente `SmartAntWordmark`; la animación usa APIs compatibles con Expo Go, es breve y se desactiva cuando el sistema solicita reducir movimiento.

### Infraestructura y despliegue

- Node.js 24 LTS.
- PostgreSQL local en desarrollo y PostgreSQL administrado en Railway.
- La base de datos PostgreSQL local se llama `sentDB`.
- API desplegada como servicio Node directo en Railway.
- `.env.example`, `.env.development.example` y `.env.production.example` sin secretos.
- Logs JSON con `requestId`.
- GitHub Actions ejecuta type-check, Biome, pruebas y build.

### Secuencia de implementación

1. Monorepo y herramientas.
2. Base de datos y autenticación.
3. Motor financiero con pruebas unitarias.
4. Ingresos, Presupuestos y Metas de ahorro.
5. Gastos manuales y Alertas.
6. Panel e historial.
7. Captura por fotografía.
8. Importación CSV/XLSX.
9. Railway y endurecimiento de producción.

### Dependencias cruzadas

- Alertas, panel e importaciones dependen del motor financiero.
- Toda persistencia depende de autenticación y alcance por usuario.
- Fotografía e importación producen Movimientos pendientes antes de confirmar.
- El despliegue depende de migraciones repetibles y variables de entorno validadas.

## Patrones de implementación y consistencia

### Convenciones de nombres

- PostgreSQL: tablas y columnas `snake_case`; tablas en plural.
- Prisma: modelos `PascalCase`, propiedades `camelCase` y `@map` para nombres físicos.
- API: recursos plurales y parámetros `:id`.
- JSON: campos `camelCase`.
- React: componentes y archivos de componente `PascalCase.tsx`.
- Otros archivos TypeScript: `kebab-case.ts`.
- Funciones y variables: `camelCase`.

### Organización

- Código agrupado por funcionalidad.
- Pruebas unitarias junto al archivo probado: `balance.test.ts`.
- `shared/` solo contiene elementos usados por más de una funcionalidad.
- Rutas Express validan, llaman un servicio y responden.
- Reglas financieras son funciones puras independientes de Express y Prisma.
- No se crean interfaces, repositorios ni factories con una sola implementación.

### Formato de API

Respuesta exitosa:

```json
{ "data": {} }
```

Respuesta de error:

```json
{
  "error": {
    "code": "BUDGET_EXCEEDED",
    "message": "El gasto supera el presupuesto",
    "details": {},
    "requestId": "..."
  }
}
```

- Fechas en ISO 8601.
- Dinero transmitido como string entero.
- `null` representa ausencia conocida; un campo omitido significa “no modificar”.
- Códigos HTTP permitidos según caso: 200, 201, 204, 400, 401, 403, 404, 409, 422 y 500.

### Procesos

- Zod valida antes de ejecutar lógica.
- Un middleware global traduce errores.
- TanStack Query administra carga, error, caché e invalidación.
- No hay actualizaciones optimistas para operaciones financieras.
- Una confirmación riesgosa requiere una segunda acción explícita.
- Los logs técnicos nunca se muestran directamente al usuario.

### Reglas obligatorias

- Nunca usar `number` para importes persistidos.
- Nunca calcular saldos en componentes móviles.
- Nunca consultar datos financieros sin alcance por `userId`.
- Nunca persistir OCR o importaciones sin revisión.
- Nunca usar iconos Unicode.
- Cada regla financiera nueva incluye una prueba mínima ejecutable.

Biome, TypeScript y las pruebas son los mecanismos automáticos de cumplimiento. Una excepción debe documentarse en la historia y en la arquitectura si cambia un patrón global.

## Estructura y límites del proyecto

### Estructura

```text
SMARTANT/
├── apps/
│   ├── mobile/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (tabs)/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── movements.tsx
│   │   │   │   ├── add.tsx
│   │   │   │   ├── plan.tsx
│   │   │   │   └── profile.tsx
│   │   │   └── _layout.tsx
│   │   └── src/
│   │       ├── features/
│   │       │   ├── auth/
│   │       │   ├── dashboard/
│   │       │   ├── movements/
│   │       │   ├── planning/
│   │       │   ├── receipts/
│   │       │   └── imports/
│   │       └── shared/
│   │           ├── api/
│   │           ├── components/
│   │           │   └── SmartAntWordmark.tsx
│   │           ├── theme/
│   │           └── validation/
│   └── api/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       └── src/
│           ├── app.ts
│           ├── server.ts
│           ├── config.ts
│           ├── features/
│           │   ├── auth/
│           │   ├── incomes/
│           │   ├── expenses/
│           │   ├── planning/
│           │   ├── dashboard/
│           │   ├── receipts/
│           │   └── imports/
│           └── shared/
│               ├── db.ts
│               ├── errors.ts
│               ├── auth.ts
│               └── request-id.ts
├── packages/
│   └── finance/
│       └── src/
│           ├── calculate-balance.ts
│           └── calculate-balance.test.ts
├── docs/
├── _bmad-output/
├── .github/workflows/ci.yml
├── biome.json
├── package.json
├── tsconfig.json
├── .env.example
├── .env.development.example
└── .env.production.example
```

### Límites arquitectónicos

- Mobile consume únicamente `/api/v1` y no conoce Prisma.
- API controla autenticación, autorización, persistencia y transacciones.
- `packages/finance` contiene cálculo financiero puro sin dependencias de Expo, Express o Prisma.
- OCR e importación solo producen Movimientos pendientes.
- Cada funcionalidad mantiene rutas, esquemas, servicios y pruebas juntos.
- Fotografías se almacenan fuera de PostgreSQL; la base conserva referencia y metadatos.

### Mapeo de requisitos

- FR-1 a FR-4: `auth`.
- FR-5 a FR-7: `incomes`.
- FR-8 a FR-11: `expenses`.
- FR-12 a FR-15: `receipts`.
- FR-16 a FR-20: `imports`.
- FR-21 a FR-29: `planning` y `packages/finance`.
- FR-30 a FR-33: `dashboard`.

### Flujo de datos

1. La pantalla valida forma y envía JSON o multipart.
2. La API autentica, valida el contrato y aplica alcance por usuario.
3. El servicio ejecuta lógica de dominio y persistencia transaccional.
4. La respuesta vuelve en el formato estándar.
5. TanStack Query invalida los recursos afectados.

### Desarrollo y despliegue

- npm workspaces ejecuta herramientas desde la raíz.
- Mobile y API tienen servidores de desarrollo independientes.
- CI valida todos los workspaces.
- Railway despliega `apps/api` y ejecuta migraciones antes de iniciar.

## Resultados de validación

### Coherencia

- Expo, Express, Prisma y PostgreSQL son compatibles con los límites definidos.
- Los patrones de validación, errores y dinero son consistentes entre API y mobile.
- La estructura física soporta las decisiones sin capas o servicios duplicados.
- La marca tipográfica compartida evita divergencia entre splash e identidad interna.

### Cobertura de requisitos

- FR-1 a FR-33 tienen una ubicación y un límite arquitectónico.
- NFR-1 a NFR-8 están cubiertos por autenticación, transacciones, validación, pruebas, observabilidad y patrones UI.
- El splash tipográfico usa un componente compartido, APIs compatibles con Expo Go y reduce movimiento cuando corresponde.

### Brechas

No existen brechas críticas.

Brechas no bloqueantes:

- Elegir proveedor OCR.
- Elegir almacenamiento privado y política de retención para fotografías.
- Confirmar CRC como moneda inicial.
- Definir límites de tamaño y filas para importaciones.

### Checklist

- [x] Contexto del proyecto analizado.
- [x] Escala y complejidad evaluadas.
- [x] Restricciones técnicas identificadas.
- [x] Preocupaciones transversales mapeadas.
- [x] Decisiones críticas documentadas con versiones.
- [x] Stack tecnológico especificado.
- [x] Patrones de integración definidos.
- [x] Rendimiento considerado.
- [x] Convenciones de nombres establecidas.
- [x] Patrones estructurales definidos.
- [x] Comunicación especificada.
- [x] Procesos documentados.
- [x] Estructura completa definida.
- [x] Límites establecidos.
- [x] Integraciones mapeadas.
- [x] Requisitos mapeados a estructura.

### Evaluación

**Estado:** READY FOR IMPLEMENTATION

**Confianza:** alta

Primera prioridad: inicializar el monorepo con el starter oficial de Expo y la API Express mínima.
