# Story 8.1: Investigar patrones de motivación financiera

Status: ready-for-dev

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

- [ ] Crear una matriz de evidencia y fuentes (AC: 1)
  - [ ] Priorizar publicaciones oficiales, papers revisados por pares, organismos públicos y documentación primaria.
  - [ ] Registrar fecha, tipo de evidencia, población, resultado, limitaciones y aplicabilidad a Smart Ant.
  - [ ] Separar claramente hechos, inferencias e hipótesis.
- [ ] Analizar patrones de productos de referencia (AC: 1, 4)
  - [ ] Duolingo: onboarding, objetivo diario, rachas, quests, ligas, XP, recuperación y celebraciones.
  - [ ] Candy Crush: mapa de progreso, niveles cortos, feedback, dificultad, objetivos visibles y retorno; excluir monetización coercitiva, vidas artificiales y presión de compra.
  - [ ] Productos financieros gamificados: ahorro, presupuestos, retos, educación breve y rewards.
- [ ] Investigar ciencia de comportamiento y riesgos (AC: 1, 4)
  - [ ] Revisar metas pequeñas, feedback inmediato, hábitos, autonomía, motivación intrínseca/extrínseca y efectos de pérdida.
  - [ ] Revisar efectos adversos: culpa, ansiedad financiera, dark patterns, sesgo por ingreso, sobreuso y confusión entre puntos y dinero.
- [ ] Investigar contexto aplicable a Costa Rica y San Ramón (AC: 2)
  - [ ] Buscar datos oficiales sobre inclusión, alfabetización y uso de servicios financieros digitales.
  - [ ] Convertir señales locales en hipótesis que requieran validación, no en conclusiones no demostradas.
- [ ] Sintetizar la estrategia de Smart Ant (AC: 2, 3, 4)
  - [ ] Definir patrones recomendados, patrones prohibidos y condiciones de uso.
  - [ ] Proponer un journey adaptativo y una taxonomía de retos sin implementar reglas todavía.
  - [ ] Definir métricas de comportamiento financiero y guardrails éticos.
  - [ ] Preparar preguntas y pruebas de campo para San Ramón.
- [ ] Guardar y validar entregables (AC: 1-4)
  - [ ] Crear `docs/research/financial-motivation-research.md` con citas cercanas a cada afirmación.
  - [ ] Actualizar `docs/design-system-philosophy.md` solamente con conclusiones respaldadas y requisitos de diseño.
  - [ ] Verificar que todos los enlaces sean directos, las fuentes soporten la afirmación y no existan citas inventadas.

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

### Completion Notes List

### File List

