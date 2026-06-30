---
title: 'Preparar despliegues EAS y Railway'
type: 'chore'
created: '2026-06-29'
status: 'in-review'
baseline_commit: '2422f4fcfb03f3b118f05e191b94e8b8c15331fc'
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture.md'
  - '{project-root}/docs/production-readiness.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** El móvil sigue en Expo SDK 54 y carece de configuración EAS; Railway tiene una preparación parcial cuyo contenedor puede omitir `prisma` y `tsx` al instalar con `NODE_ENV=production`, y ejecuta migraciones dentro del arranque. La configuración actual también permite compilar el móvil sin una URL de API válida.

**Approach:** Actualizar el móvil de forma incremental al Expo SDK estable 56, añadir perfiles EAS reproducibles y endurecer la configuración de API. Corregir la imagen Railway con el menor cambio posible y mover migraciones al pre-deploy declarativo antes de validar todo el monorepo.

## Boundaries & Constraints

**Always:** Mantener npm workspaces, Node 24 LTS, Prisma 7, Expo managed/CNG y la API Express existente. Usar versiones de paquetes Expo elegidas por `expo install`, no combinaciones manuales. Tratar `EXPO_PUBLIC_API_URL` como dato público pero obligatorio para builds EAS. Conservar secretos fuera de Git.

**Ask First:** Cambiar el identificador propuesto `com.smartant.app`; vincular el proyecto a una cuenta EAS y escribir su `projectId`; desplegar o modificar recursos reales en Railway/EAS; elegir proveedor OCR o almacenamiento persistente de recibos.

**Never:** Añadir Docker Compose, Kubernetes, otro package manager, EAS Update, CI de despliegue, nuevas abstracciones de configuración o ejecutar `npm audit fix --force`. No inventar credenciales, dominios, IDs de cuenta ni secretos.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Build EAS preview | Ambiente `preview` con URL Railway HTTPS | APK interno usa esa API | Falla antes del build si falta o no es URL HTTPS |
| Build EAS production | Ambiente `production` configurado | AAB/IPA con versión remota incremental | No usa fallback localhost |
| Deploy Railway | Imagen construida y PostgreSQL disponible | Migración termina antes de iniciar; health responde 200 | Migración fallida impide activar el deploy |
| Base no disponible | API inicia o recibe health check | Health responde 503 | Railway conserva el deploy anterior |

</frozen-after-approval>

## Code Map

- `apps/mobile/package.json` — matriz Expo/React Native y scripts de validación.
- `apps/mobile/app.json` — identificadores nativos y metadatos EAS.
- `apps/mobile/eas.json` — perfiles preview/production dentro de la raíz de la app del monorepo.
- `apps/mobile/src/shared/api/client.ts` — selección y validación del endpoint público.
- `apps/api/package.json` — dependencias necesarias durante pre-deploy y runtime.
- `Dockerfile` — imagen usada desde la raíz compartida del monorepo.
- `railway.json` — migración, health check y política de reinicio como código.
- `docs/railway-deployment.md` y `docs/handoff.md` — procedimiento operativo y bloqueos externos.

## Tasks & Acceptance

**Execution:**
- [x] `apps/mobile/package.json`, `package.json`, `package-lock.json` — migrar SDK 54→55→56 con `expo install --fix` en cada salto; alinear React 19.2.3, React Native 0.85 y módulos Expo; ejecutar doctor y resolver incompatibilidades reales sin reemplazar Lucide.
- [x] `apps/mobile/app.json`, `apps/mobile/eas.json` — añadir `android.package`/`ios.bundleIdentifier`, perfiles preview APK y production store, ambientes EAS explícitos y versionado remoto; dejar `projectId` para `eas init` autenticado.
- [x] `apps/mobile/src/shared/api/client.ts` — validar `EXPO_PUBLIC_API_URL`; permitir HTTP local solo en desarrollo y exigir HTTPS fuera de desarrollo; añadir prueba mínima de la configuración.
- [x] `apps/api/package.json`, `Dockerfile`, `railway.json` — asegurar que Prisma/tsx existan en la imagen, separar `prisma migrate deploy` al pre-deploy y declarar `/api/v1/health` sin reestructurar el backend.
- [x] `docs/railway-deployment.md`, `docs/handoff.md`, `.env.production.example` — documentar vinculación EAS desde `apps/mobile`, ambientes, variables Railway por referencia, dominio, backups, comandos y los bloqueos de credenciales/OCR-storage.
- [x] `docs/production-gate.md` — registrar versiones resultantes, auditoría, compatibilidad y resultados de gates.

**Acceptance Criteria:**
- Given una instalación limpia con Node 24, when se ejecutan los gates raíz y `expo-doctor`, then no existen errores de versiones Expo ni regresiones.
- Given `apps/mobile`, when se inspecciona EAS config, then preview produce APK interno y production usa distribución store sin secretos versionados.
- Given la imagen Railway, when se instala en modo producción, then están disponibles el comando de migración y el runtime configurado.
- Given una migración fallida, when Railway ejecuta pre-deploy, then la versión nueva no inicia ni reemplaza la activa.
- Given que no hay cuentas autenticadas, when termina este trabajo, then el repositorio queda preparado pero ningún recurso externo es creado o modificado.

## Spec Change Log

## Design Notes

Expo SDK 56 exige React Native 0.85, React 19.2.3 y Node >=22.13; el proyecto mantiene Node 24 LTS. SDK 55+ usa exclusivamente New Architecture, por lo que `expo-doctor` es gate obligatorio. EAS se ejecuta desde `apps/mobile` porque Expo requiere que `eas.json` viva en la raíz de la app dentro del monorepo. Railway debe usar pre-deploy para migraciones: un exit no-cero cancela el despliegue antes de iniciar tráfico.

No se persistirán imágenes como parte de esta tarea: hoy Multer procesa en memoria y descarta bytes. Elegir retención/OCR/storage cambia privacidad y arquitectura, por lo que queda como bloqueo explícito antes de habilitar detección real en producción.

## Verification

**Commands:**
- `npm ci` — instalación reproducible.
- `npx expo install --check` y `npx expo-doctor@latest` desde `apps/mobile` — matriz SDK y módulos nativos válida.
- `npx eas-cli@latest config --platform android --profile preview` desde `apps/mobile` — configuración EAS resoluble sin iniciar build.
- `npm run lint && npm run type-check && npm test && npm run build` — gate completo verde.
- `npm audit --audit-level=high` — cero vulnerabilidades high/critical; moderadas se documentan sin upgrades destructivos.
- `docker build -t smart-ant-api .` — imagen construye; ejecutar cuando Docker esté disponible.
