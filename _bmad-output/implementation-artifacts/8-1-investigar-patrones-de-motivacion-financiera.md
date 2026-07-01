---
baseline_commit: d51086d
---

# Story 8.1: Investigar patrones de motivación financiera

Status: review

## Story

Como responsable de producto,
quiero una investigación trazable sobre gamificación, hábitos y ahorro,
para adoptar patrones eficaces sin copiar interfaces ni introducir mecánicas perjudiciales.

## Acceptance Criteria

1. Dado que no existe una estrategia validada de rewards, cuando se investigan fuentes oficiales, académicas y productos como Duolingo y Candy Crush, entonces se documentan patrones aplicables, evidencia, límites y riesgos con enlaces directos, distinguiendo evidencia experimental, correlación e inferencia.
2. Dado el contexto de San Ramón, cuando se sintetizan los hallazgos, entonces se generan hipótesis verificables para retos, microlecciones, captura de recibos y beneficios locales, sin presentar cashback o alianzas como funciones disponibles.
3. Dado que la investigación será insumo del diseño, cuando se entrega el resultado, entonces incluye principios, anti-patrones, métricas, preguntas de validación y recomendaciones priorizadas, sin modificar código funcional ni definir la estética final.
4. Toda recomendación diferencia progreso virtual, ahorro demostrado y beneficio con valor real; no recompensa mayor gasto, deuda, nivel absoluto de ingreso ni tiempo vacío dentro de la app.

## Tasks / Subtasks

- [x] Crear una matriz de evidencia y fuentes (AC: 1)
  - [x] Priorizar publicaciones oficiales, papers revisados por pares, organismos públicos y documentación primaria.
  - [x] Registrar fecha, tipo de evidencia, población, resultado, limitaciones y aplicabilidad a Smart Ant.
  - [x] Separar claramente hechos, inferencias e hipótesis.
- [x] Analizar patrones de productos de referencia (AC: 1, 4)
  - [x] Duolingo: onboarding, objetivo diario, rachas, quests, ligas, XP, recuperación y celebraciones.
  - [x] Candy Crush: mapa de progreso, niveles cortos, feedback, dificultad, objetivos visibles y retorno; excluir monetización coercitiva, vidas artificiales y presión de compra.
  - [x] Productos financieros gamificados: ahorro, presupuestos, retos, educación breve y rewards.
- [x] Investigar ciencia de comportamiento y riesgos (AC: 1, 4)
  - [x] Revisar metas pequeñas, feedback inmediato, hábitos, autonomía, motivación intrínseca/extrínseca y efectos de pérdida.
  - [x] Revisar efectos adversos: culpa, ansiedad financiera, dark patterns, sesgo por ingreso, sobreuso y confusión entre puntos y dinero.
- [x] Investigar contexto aplicable a Costa Rica y San Ramón (AC: 2)
  - [x] Buscar datos oficiales sobre inclusión, alfabetización y uso de servicios financieros digitales.
  - [x] Convertir señales locales en hipótesis que requieran validación, no en conclusiones no demostradas.
- [x] Sintetizar la estrategia de Smart Ant (AC: 2, 3, 4)
  - [x] Definir patrones recomendados, patrones prohibidos y condiciones de uso.
  - [x] Proponer un journey adaptativo y una taxonomía de retos sin implementar reglas todavía.
  - [x] Definir métricas de comportamiento financiero y guardrails éticos.
  - [x] Preparar preguntas y pruebas de campo para San Ramón.
- [x] Guardar y validar entregables (AC: 1-4)
  - [x] Crear `docs/research/financial-motivation-research.md` con citas cercanas a cada afirmación.
  - [x] Actualizar `docs/design-system-philosophy.md` solamente con conclusiones respaldadas y requisitos de diseño.
  - [x] Verificar que todos los enlaces sean directos, las fuentes soporten la afirmación y no existan citas inventadas.

## Dev Notes

- Esta historia produce investigación y requisitos; no implementa base de datos, API, componentes, rewards ni rediseño visual.
- “Inspirado en” significa extraer principios de interacción. No copiar branding, assets, textos, layouts ni código de Duolingo, King u otros productos.
- Tratar “Sugar Crush” como referencia a Candy Crush salvo que aparezca evidencia de otro producto distinto.
- La experiencia financiera existente sigue siendo la fuente de verdad. Rewards debe apoyarse en acciones confirmadas y nunca duplicar cálculos de `packages/finance`.
- No asumir que cashback, puntos canjeables o comercios aliados existen. Esas capacidades pertenecen al Epic 9 y requieren validación comercial, legal y antifraude.
- Favorecer una solución explicable y mínima: reglas simples antes que ML, personalización basada en datos disponibles y opción de omitir o reducir gamificación.
- La investigación debe contemplar las features existentes: ingresos, salario, presupuestos generales o por categoría, metas, gastos manuales, OCR de recibos, adjuntos opcionales, importación, alertas, resumen e historial.
- Identidad solicitada para la fase posterior de diseño: `SMA` en formatos pequeños, `SmartAnt` en formatos grandes, lettering original y dos tonos entre palabras. No generar el icono en esta historia.

### Project Structure Notes

- Entregable principal nuevo: `docs/research/financial-motivation-research.md`.
- Entregable actualizado: `docs/design-system-philosophy.md`.
- No añadir dependencias ni modificar `apps/`, `packages/`, Prisma, Railway o EAS.
- Mantener Markdown en español y enlaces directos a la fuente original.

### Testing Requirements

- Comprobar manualmente cada enlace utilizado.
- Para cada recomendación, identificar al menos una fuente o marcarla explícitamente como hipótesis.
- Evitar citas textuales extensas; resumir y atribuir.
- Confirmar cobertura de los cuatro criterios de aceptación mediante una checklist final dentro del informe.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-81-Investigar-patrones-de-motivación-financiera]
- [Source: docs/design-system-philosophy.md#Sistema-dinámico-de-motivación-y-rewards]
- [Source: _bmad-output/planning-artifacts/architecture.md#Aplicación-móvil]
- [Source: docs/development-standard.md#Philosophy]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd test`: 44 archivos, 110 pruebas aprobadas.
- `npm.cmd run lint`: aprobado después de normalizar `railway.json` con Biome.

### Completion Notes List

- Investigación comparativa completada con fuentes oficiales, académicas, públicas y de producto.
- Estrategia sintetizada para Smart Ant con métricas, guardrails, hipótesis locales y anti-patrones.
- Brief de diseño actualizado con fundamento de evidencia, presupuestos por categoría e identidad `SMA`/`SmartAnt`.

### File List

- docs/research/financial-motivation-research.md
- docs/design-system-philosophy.md
- railway.json
- _bmad-output/implementation-artifacts/8-1-investigar-patrones-de-motivacion-financiera.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log

- 2026-06-30: Investigación de motivación financiera completada y preparada para revisión.
