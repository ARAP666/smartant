---
title: "Product Brief: Smart Ant"
status: draft
created: 2026-06-19
updated: 2026-06-19
---

# Product Brief: Smart Ant

## Resumen ejecutivo

Smart Ant es una aplicación móvil de control financiero personal para registrar ingresos y gastos, entender cuánto dinero queda disponible y recibir alertas antes de comprometer el presupuesto o el ahorro planificado.

El usuario podrá registrar gastos manualmente, importarlos desde Excel o capturarlos mediante una fotografía. La aplicación comparará esos movimientos con el salario, los presupuestos y las metas de ahorro configuradas para responder preguntas concretas como: “¿Cuánto puedo gastar todavía este mes sin afectar mi ahorro?”.

La primera versión prioriza precisión, claridad y una operación local sencilla. Se construirá con React Native y Expo Go, una API Express y PostgreSQL local; el backend quedará preparado para Railway y la aplicación móvil para una migración posterior a EAS.

## Problema

Las personas suelen registrar gastos tarde, de forma incompleta o en herramientas que muestran totales sin explicar el impacto de una compra nueva. Esto dificulta:

- Saber cuánto dinero queda realmente disponible.
- Respetar presupuestos semanales o mensuales.
- Proteger una meta de ahorro.
- Consolidar gastos provenientes de distintas fuentes.
- Recibir una advertencia útil antes de que sea demasiado tarde.

## Solución

Smart Ant centraliza ingresos, gastos, presupuestos y metas de ahorro. Cada gasto nuevo recalcula el dinero disponible del periodo y muestra su efecto inmediato.

La experiencia principal será:

1. Configurar moneda, salario, periodo presupuestario y ahorro objetivo.
2. Registrar gastos manualmente, por fotografía o por importación de archivo.
3. Revisar y confirmar datos detectados antes de guardarlos.
4. Consultar progreso, distribución por categorías y dinero disponible.
5. Recibir alertas accionables cuando un gasto amenace un límite o una meta.

## Usuarios

El usuario principal es una persona que administra sus finanzas personales y necesita una guía simple para controlar gastos sin comprometer sus planes.

No se incluyen roles administrativos ni finanzas compartidas en la primera versión.

## Criterios de éxito

- El usuario conoce su saldo gastable del periodo desde la pantalla principal.
- Cada gasto confirmado actualiza presupuestos y metas inmediatamente.
- Las importaciones permiten revisar errores y duplicados antes de confirmar.
- Las alertas explican el impacto monetario y la regla afectada.
- Los cálculos monetarios son deterministas y están cubiertos por pruebas unitarias.
- La aplicación funciona en Expo Go durante la primera etapa.

## Alcance inicial

Incluye:

- Cuenta personal y autenticación.
- Configuración de moneda y zona horaria.
- Registro de salario e ingresos adicionales.
- Gastos manuales.
- Captura de recibos mediante fotografía con revisión.
- Importación de CSV/XLSX con previsualización y detección de duplicados.
- Categorías de gasto.
- Presupuestos semanales y mensuales.
- Metas de ahorro.
- Cálculo de dinero disponible.
- Alertas dentro de la aplicación.
- Panel de progreso e historial.
- React Native, Expo Go, TypeScript y Lucide.
- Express, PostgreSQL, validación de entrada, Biome y pruebas unitarias.
- Variables de entorno separadas para desarrollo y producción.
- PostgreSQL local y despliegue posterior del backend en Railway.

## Fuera de alcance inicial

- Integración bancaria automática.
- Transferencias o pagos desde la aplicación.
- Finanzas familiares o cuentas compartidas.
- Inversiones, crédito o asesoría financiera automatizada.
- Notificaciones push; se evaluarán al migrar de Expo Go a EAS.
- Administración web.
- Logo gráfico; se usará una única marca tipográfica “Smart Ant” tanto en el splash como dentro de la aplicación.

## Decisiones pendientes

- Estrategia exacta de autenticación.
- Proveedor para extracción de datos de recibos.
- Formatos y plantilla de importación definitivos.
- Política para gastos recurrentes y salario variable.
- Países y monedas soportados después del lanzamiento inicial.

## Visión

Smart Ant debe convertirse en una guía financiera personal preventiva: no solo explicar en qué se gastó el dinero, sino advertir cuánto puede gastarse todavía sin dañar los compromisos elegidos por el usuario.
