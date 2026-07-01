# Despliegue en Railway

Estado: repositorio preparado; recursos externos no creados.

## Contrato del repositorio

Railway construye desde la raiz del repositorio. Detecta `Dockerfile`;
`railway.json` define la migracion previa, el health check `/api/v1/health`, un
timeout de 300 segundos y reinicio ante fallos.

La imagen usa Node 24 LTS e instala solo dependencias de produccion. Prisma y
`tsx` son dependencias de runtime porque Railway necesita Prisma CLI en el
pre-deploy y la API todavia ejecuta TypeScript directamente.

## Crear los servicios

1. Crear un proyecto Railway vacio y agregar su plantilla PostgreSQL.
2. Agregar un servicio API conectado al repositorio y mantener `/` como root;
   la API comparte el lockfile raiz y el workspace `packages/finance`.
3. Generar un dominio publico para la API.
4. Confirmar que Railway detecto `Dockerfile` y `railway.json` en la raiz.
5. Activar backups de PostgreSQL antes de almacenar datos de produccion.

## Variables de la API

Conectar PostgreSQL al servicio API desde Railway. Railway inyecta
`DATABASE_URL` y `PORT`; no copiarlos al archivo local ni exponerlos a EAS. La
imagen ya define `NODE_ENV=production`.

## Ciclo de despliegue

Railway construye la imagen y ejecuta desde `railway.json`:

```bash
npm run db:migrate --workspace @smart-ant/api
```

Una migracion con salida distinta de cero cancela el despliegue. Solo despues de
una migracion exitosa Railway inicia el `CMD` de Docker:

```bash
npm run start --workspace @smart-ant/api
```

Railway activa el despliegue solo cuando `GET /api/v1/health` devuelve `200`. El
endpoint devuelve `503` si PostgreSQL no responde. Este health check protege la
activacion; para monitoreo continuo se requiere un servicio separado.

## Conectar EAS

Despues de obtener el dominio HTTPS final, crear la misma variable publica en
los ambientes EAS preview y production desde `apps/mobile`:

```bash
npx eas-cli@latest env:create --name EXPO_PUBLIC_API_URL --value https://<railway-domain> --environment preview --visibility plaintext
npx eas-cli@latest env:create --name EXPO_PUBLIC_API_URL --value https://<railway-domain> --environment production --visibility plaintext
```

Los valores `EXPO_PUBLIC_` se incluyen en el binario y no son secretos.

## Limite de recibos

El endpoint actual recibe una imagen en memoria, deriva datos del movimiento
pendiente y descarta los bytes. No habilitar OCR real ni retencion hasta aprobar
proveedor, politica de retencion y almacenamiento privado durable.
