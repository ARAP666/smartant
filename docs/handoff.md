# Smart Ant Handoff

## Estado

- Historias: 27/27 en review.
- Backlog de historias: vacio.
- Rama local: `master`.
- Ultimo gate local: aprobado.

## Cuenta Demo

- Email: `demo@smartant.local`
- Password: `SmartAntDemo2026!`

## Comandos

```bash
npm run start
npm run dev:lan
npm run lint
npm run type-check
npm test
npm run build
```

`npm run start` usa la base local por defecto:

```bash
postgresql://postgres:postgres@localhost:5432/sentDB
```

En produccion `DATABASE_URL` sigue siendo obligatorio.

Para Expo Go usa `npm run dev:lan`; detecta la IP LAN, arranca API y abre Expo con `EXPO_PUBLIC_API_URL` correcto para el telefono.

## EAS

Ejecutar EAS desde `apps/mobile`, no desde la raiz del repositorio. La app usa
`com.smartant.app` como identificador nativo; cambiarlo requiere una decision
explicita porque los identificadores publicados son durables.

```bash
cd apps/mobile
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest config --platform android --profile preview
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform all --profile production
```

`eas init` escribe el `projectId` autenticado; esta ausente hasta conocer la
cuenta propietaria. Preview genera APK interno. Production usa distribucion de
tienda y versionado remoto incremental. Ambos perfiles consumen
`EXPO_PUBLIC_API_URL` de su ambiente EAS y usan Node 24.17.0.

## Railway

Seguir [railway-deployment.md](railway-deployment.md). La migracion es un comando
pre-deploy; el arranque del contenedor ya no ejecuta migraciones.

## Pendientes Reales Antes De Produccion

- Entregar credenciales Railway y crear servicios API + PostgreSQL.
- Configurar `DATABASE_URL` como referencia al servicio Railway, generar el
  dominio HTTPS y crear `EXPO_PUBLIC_API_URL` en EAS preview y production.
- Ejecutar deploy Railway y health check real.
- Ejecutar `eas init` con la cuenta propietaria y revisar `com.smartant.app` antes
  de la primera build firmada.
- Antes de habilitar OCR/retencion en produccion, decidir proveedor, politica y
  storage privado. Actualmente los bytes se descartan despues del request.
- Revisar periodicamente advisories moderados transitivos; no usar correcciones
  `--force` que degraden Expo o Prisma.
- Importacion XLSX queda diferida hasta tener parser seguro o procesamiento backend; el cliente acepta CSV.
