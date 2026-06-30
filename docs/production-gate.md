# Gate de produccion

Date: 2026-06-29
Estado: gate local de migracion aprobado; despliegue externo pendiente.

## Matriz de runtime

- Expo SDK 56.0.12.
- React Native 0.85.3 and React/React DOM 19.2.3.
- Expo Router 56.2.11; el codigo no importa `@react-navigation/*`, afectado por
  el cambio de Router en SDK 56.
- TypeScript 6.0.3.
- Node.js 24 LTS para CI, EAS y Railway. La terminal local reporta Node 22.22.2,
  por eso npm muestra un warning; satisface el minimo de Expo 56, pero produccion
  permanece fijada a Node 24.
- Prisma 7.8.0.

## Revision de dependencias

`expo install --check` confirma la matriz SDK. SDK 56 activa la New Architecture
obligatoria. No existen usos directos de `expo-file-system`,
`@expo/vector-icons` ni APIs externas de React Navigation afectadas por SDK 56.

`npm audit` reporta solo advisories transitivos low/moderate. Se prohiben fixes
forzados porque proponen cambios incompatibles de Prisma o Expo. Hallazgos high
o critical bloquean un release.

## Resultados locales

- `npm ci`: aprobado; lockfile reproducible.
- `expo install --check`: aprobado.
- `expo-doctor`: 19/21 checks aprobados. El schema de app-config y React Native
  Directory no alcanzaron las APIs remotas; `expo config`, alineacion, type-check
  y export Android locales pasan.
- Biome y TypeScript: aprobados.
- Vitest: 44 archivos y 110 pruebas aprobadas.
- Builds de API, paquete finance y export Android: aprobados.
- `npm audit --audit-level=high`: aprobado con 1 low y 13 moderate transitivos.
- Docker: no ejecutado porque no esta instalado localmente.
- EAS config: carga perfiles y luego exige correctamente `eas init` autenticado.

## Verificacion externa pendiente

- Vincular `apps/mobile` con `eas init` y ejecutar builds cloud preview/production.
- Construir y probar la imagen donde Docker este disponible.
- Crear servicios Railway API/PostgreSQL, verificar migracion y health publico.
- Activar backups antes de almacenar datos de produccion.
- Aprobar OCR/storage/retencion antes de retener imagenes de recibos.

## Comandos del gate

```bash
npm ci
npx expo install --check
npx expo-doctor@latest
npm run lint
npm run type-check
npm test
npm run build
npm audit --audit-level=high
docker build -t smart-ant-api .
```
