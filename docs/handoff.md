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

## Pendientes Reales Antes De Produccion

- Entregar credenciales Railway y crear servicios API + PostgreSQL.
- Configurar `DATABASE_URL`, dominio API y `EXPO_PUBLIC_API_URL`.
- Ejecutar deploy Railway y health check real.
- Antes de EAS/APK, cambiar recibos a storage durable: guardar imagen en carpeta/storage y persistir ruta en DB.
- Revisar advisories moderados transitivos cuando se haga upgrade de Expo/Prisma/React Native.
