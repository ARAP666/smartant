---
title: "Addendum técnico: Smart Ant"
status: draft
created: 2026-06-19
updated: 2026-06-19
---

# Restricciones técnicas aportadas

- Monorepo mínimo con aplicación móvil y API.
- React Native, Expo, TypeScript y Lucide.
- Express y PostgreSQL.
- Biome para formato y análisis estático.
- Pruebas unitarias para cálculos financieros.
- Desarrollo inicial compatible con Expo Go.
- Configuración de entorno preparada para local y Railway.
- Sin secretos en archivos versionados.
- Sin `any`.

# Supuestos que requieren validación

- La moneda inicial será CRC, pero el modelo almacenará código ISO de moneda.
- El salario se modelará como ingreso recurrente configurable.
- El usuario podrá escoger periodo semanal o mensual por presupuesto.
- Una meta de ahorro reservará dinero antes de calcular el saldo gastable.
- Los importes se almacenarán como enteros en la unidad monetaria mínima.
- OCR será una integración reemplazable, pero no se abstraerá hasta elegir proveedor.
