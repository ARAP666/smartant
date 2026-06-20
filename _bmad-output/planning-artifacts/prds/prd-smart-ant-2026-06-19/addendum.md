---
title: "Addendum técnico del PRD: Smart Ant"
status: final
created: 2026-06-19
updated: 2026-06-19
---

# Restricciones técnicas

- React Native con Expo Go y TypeScript.
- Express con TypeScript.
- PostgreSQL local; backend desplegable en Railway.
- La base de datos PostgreSQL local se llama `sentDB`.
- Biome para lint y formato.
- Lucide para iconografía.
- Variables de entorno documentadas mediante archivos `.env.example`; secretos reales fuera del repositorio.

# Riesgos para arquitectura

- La extracción de recibos depende de un proveedor todavía no elegido.
- XLSX necesita límites de tamaño y cantidad de filas.
- La fórmula de Saldo gastable debe tener una única implementación de dominio reutilizable por API y pruebas.
- Los cambios de zona horaria pueden alterar la pertenencia de movimientos a un Periodo.
