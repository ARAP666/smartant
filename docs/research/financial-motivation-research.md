# Investigación de motivación financiera para Smart Ant

Fecha: 2026-06-30  
Estado: base de producto para validación; no es evidencia de que todas las mecánicas funcionarán en San Ramón.

## Conclusión ejecutiva

Smart Ant debe gamificar progreso financiero útil, no uso de la aplicación. La combinación con mejor fundamento es:

1. tareas pequeñas y claras;
2. feedback inmediato sobre una acción real;
3. progreso acumulado visible;
4. libertad para elegir, cambiar u omitir retos;
5. recuperación amable después de interrupciones;
6. medición de resultados financieros, no solo engagement.

Duolingo aporta un principio especialmente útil: la métrica de producto debe favorecer la actividad que produce el resultado buscado. Su métrica *Time Spent Learning Well* asigna mayor peso al trabajo que avanza el aprendizaje y la empresa reconoce que XP y rankings pueden incentivar “grinding” improductivo. Para Smart Ant, el equivalente no es “tiempo dentro de la app”, sino acciones financieras útiles verificadas: revisar datos, clasificar movimientos, crear un presupuesto, respetar un límite o avanzar una meta. [Duolingo: Time Spent Learning Well](https://blog.duolingo.com/time-spent-learning-well/)

Candy Crush aporta sesiones breves, objetivos visibles, variación y feedback expresivo. No debe aportar vidas artificiales, urgencia, frustración monetizada ni *near misses*. Un estudio con 60 jugadores encontró que los resultados cercanos a ganar aumentaron frustración, activación y deseo de seguir jugando; ese mecanismo es inadecuado en una herramienta financiera. [Larche, Musielak y Dixon, 2017](https://link.springer.com/article/10.1007/s10899-016-9633-7)

## Calidad de la evidencia

| Fuente | Tipo | Qué permite afirmar | Limitación |
|---|---|---|---|
| Duolingo Product Blog | Datos internos y experimentación del producto | Cómo Duolingo diseña y mide streaks, quests y progreso | No es revisión independiente ni trata finanzas |
| Estudios de Candy Crush | Estudios observacionales/experimentales y análisis crítico | Cómo feedback, sesiones cortas y *near misses* afectan experiencia | Muestras y contexto de juego no equivalen a salud financiera |
| Revisiones sistemáticas de gamificación | Síntesis académica | Mecanismos teóricos frecuentes y condiciones de diseño | Alta heterogeneidad entre dominios |
| Estudios de ahorro y leaderboards | Experimentos sobre intención | La comparación puede cambiar intención declarada de ahorro | Intención hipotética no demuestra ahorro real |
| Organismos oficiales CR/OECD | Datos poblacionales, infraestructura y protección al consumidor | Contexto local y riesgos de diseño | No valida demanda específica de Smart Ant |
| Sitios de productos financieros | Evidencia de patrones existentes | Qué ofrece el mercado | Marketing; no demuestra eficacia |

## Patrones de Duolingo aplicables

### 1. Camino y siguiente acción

Un camino reduce la pregunta “¿qué hago ahora?”. Smart Ant debe mostrar una sola recomendación principal, pero conservar navegación libre hacia todas las herramientas financieras. El journey orienta; no bloquea.

Aplicación propuesta:

- etapa visible: activación, conciencia, control, hábito u optimización;
- siguiente reto con motivo explícito;
- objetivo medible y duración estimada;
- posibilidad de cambiarlo u omitirlo.

### 2. Quests de dificultad gradual

Duolingo describe Daily Quests ordenadas desde una tarea fácil de activación hacia acciones de mayor valor. También cambió retos mensuales basados en XP por retos basados en quests para reducir acumulación oportunista de puntos. [Duolingo: Time Spent Learning Well](https://blog.duolingo.com/time-spent-learning-well/)

Aplicación propuesta:

- primer reto: menos de dos minutos;
- segundo reto: ordenar o revisar información;
- reto de mayor valor: crear presupuesto, avanzar meta o completar recap;
- límites diarios/semanales para impedir farming de XP.

### 3. Racha como evidencia, no como castigo

Duolingo usa una cifra sencilla y tangible para representar repetición, y ofrece protección ante interrupciones. La investigación de hábitos muestra variación individual grande: alcanzar alta automaticidad tomó entre 18 y 254 días en el estudio de Lally et al.; omitir una oportunidad no afectó materialmente el proceso. Esto contradice una racha que destruye todo el progreso por un día perdido. [Duolingo: habit and streak](https://blog.duolingo.com/how-duolingo-streak-builds-habit/), [Lally et al., 2010](https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674)

Aplicación propuesta:

- racha semanal flexible, no obligación diaria universal;
- días de gracia automáticos y transparentes;
- XP, nivel y ahorro jamás se reinician;
- regreso con lenguaje neutral: “Retomemos”, no “Perdiste todo”.

### 4. Métrica de calidad junto con crecimiento

Duolingo usa una métrica de calidad para no optimizar únicamente actividad. Smart Ant necesita una métrica equivalente: `Acciones Financieras Útiles Verificadas`.

Eventos elegibles iniciales:

- completar perfil;
- registrar y revisar un movimiento válido;
- clasificar información pendiente;
- crear un presupuesto o meta;
- revisar el recap;
- completar una microlección contextual;
- confirmar ahorro demostrado al cierre del periodo.

No elegibles por sí solos:

- abrir la app;
- navegar pantallas;
- registrar más gasto;
- generar solicitudes repetidas;
- permanecer más tiempo conectado.

### 5. Cohesión visual

Duolingo documenta que tabs creados independientemente terminaron con jerarquías, tipografías y espacios inconsistentes, y posteriormente los unificó. Smart Ant debe diseñar la familia completa de componentes antes de multiplicar superficies. [Duolingo: core tabs redesign](https://blog.duolingo.com/core-tabs-redesign/)

## Patrones de Candy Crush aplicables

### Usar

- sesiones breves e interrumpibles;
- objetivo único visible por reto;
- mapa de progreso que muestre posición y próximo hito;
- variación sobre un núcleo estable;
- feedback claro y agradable después de completar una acción;
- dificultad escalonada con descansos, no crecimiento continuo.

Candy Crush ha sido descrito como accesible, interrumpible y organizado alrededor de una estructura extensa de niveles con variaciones del mismo núcleo. [Nieborg, 2015](https://journals.sagepub.com/doi/10.1177/2056305115621932)

### Rechazar

- vidas que bloquean funciones;
- temporizadores de urgencia;
- *near misses* diseñados para provocar reintento;
- dificultad manipulada para vender ayuda;
- recompensa variable tipo apuesta;
- confirmaciones engañosas o cierre difícil;
- pérdida total de progreso.

La OECD define los patrones oscuros como prácticas que pueden dirigir, engañar, coaccionar o manipular decisiones contra el interés del consumidor, con posibles daños financieros, de privacidad y psicológicos. [OECD: Dark commercial patterns](https://www.oecd.org/en/publications/dark-commercial-patterns_44f5e846-en.html)

## Ciencia de motivación aplicada

Una revisión sistemática de fundamentos teóricos de gamificación identifica como mecanismos comunes: aclarar metas, guiar caminos, ofrecer feedback inmediato, reforzar buen desempeño, reducir tareas a unidades manejables, permitir elección y adaptar complejidad. También advierte que distintos elementos operan mediante mecanismos distintos; “gamificación” no es un tratamiento uniforme. [Krath, Schürmann y von Korflesch, 2021](https://doi.org/10.1016/j.chb.2021.106963)

La teoría de autodeterminación aporta tres guardrails:

- **Autonomía:** elegir, cambiar, omitir y desactivar.
- **Competencia:** objetivo claro, progreso comprensible y feedback accionable.
- **Relación:** apoyo opcional, nunca exposición pública del dinero.

Una revisión y meta-análisis de intervenciones educativas basadas en esta teoría encontró mejoras en autonomía y competencia, aunque el contexto educativo no garantiza el mismo efecto en finanzas personales. [Wang et al., 2024](https://doi.org/10.1016/j.lmot.2024.102015)

## Evidencia específica sobre ahorro

Dos estudios experimentales encontraron que mostrar leaderboards competitivos elevó la intención de ahorro en escenarios hipotéticos, especialmente con comparaciones altas y entre participantes que ya ahorraban regularmente. La propia investigación reconoce la brecha entre intención y conducta real. Por equidad, Smart Ant no debe ordenar personas por monto ahorrado: favorecería a quien tiene mayor ingreso y expondría información sensible. [Increasing saving intentions through leaderboards](https://pmc.ncbi.nlm.nih.gov/articles/PMC8046219/)

Alternativa propuesta:

- comparación solo contra la meta propia;
- progreso relativo personal;
- retos cooperativos opcionales sin revelar montos;
- métricas como porcentaje de constancia o acciones completadas;
- ninguna liga pública basada en patrimonio, gasto o ahorro absoluto.

Qapital demuestra un patrón de producto útil —metas visibles y reglas elegidas para ahorrar—, pero implica movimiento real de dinero y servicios regulados que Smart Ant no posee. [Qapital Savings](https://www.qapital.com/saving/)

Zogo muestra el patrón “microcontenido + puntos + rewards”, junto con la necesidad de antifraude cuando los puntos tienen valor. Para Smart Ant, microlecciones pueden entrar en Epic 8; canjes reales pertenecen al Epic 9. [Zogo en App Store](https://apps.apple.com/us/app/zogo-get-paid-to-learn/id1474636588)

## Contexto de Costa Rica y San Ramón

El INEC estimó 93 264 habitantes en el cantón de San Ramón en 2022. Esto prueba tamaño poblacional, no intención de adoptar la app. [INEC: Estimación de Población y Vivienda 2022, Alajuela](https://admin.inec.cr/sites/default/files/2023-07/INFOGRAFIA_ESTIM_POB_VIV_2022_ALAJUELA_0.pdf)

El BCCR describe SINPE Móvil como un mecanismo de pagos minoristas interoperable, accesible y de amplia cobertura. Esto respalda familiaridad regional con interacciones financieras móviles, pero no autoriza a Smart Ant a presentarse como banco, procesador de pagos o producto SINPE. [BCCR: SINPE Móvil](https://www.bccr.fi.cr/sistema-de-pagos/servicios-brindados-a-clientes/sinpe-m%C3%B3vil)

El MEIC ha incluido empresas de San Ramón en programas para pymes, y junto al INA ha ofrecido formación financiera para pymes y emprendedores. Esto apoya explorar alianzas y educación práctica; no demuestra que comercios aceptarán rewards. [MEIC: pymes sostenibles](https://www.meic.go.cr/pymes-costarricenses-se-capacitan-para-ser-sostenibles-y-competitivas/), [MEIC/INA: educación financiera](https://www.meic.go.cr/meic-e-ina-anuncian-curso-gratuito-de-educacion-financiera-para-pymes-y-emprendedores/)

## Estrategia recomendada para Smart Ant

### Journey

1. **Activación:** perfil, primer movimiento, primer resumen.
2. **Conciencia:** clasificar movimientos, detectar patrones, revisar categorías.
3. **Control:** presupuesto por categoría, salario y meta de ahorro.
4. **Hábito:** recap semanal, racha flexible y retos variables.
5. **Optimización:** corregir desviaciones y avanzar metas.
6. **Beneficios locales:** solo después de validar socios, soporte y antifraude.

### Taxonomía de retos

- Captura: registrar, escanear o importar.
- Orden: clasificar y corregir.
- Conciencia: revisar patrón o recap.
- Control: crear o respetar presupuesto.
- Ahorro: avanzar meta o cerrar periodo positivo.
- Aprendizaje: microlección y quiz.
- Constancia: repetir una acción útil en contexto estable.
- Local: cumplir condiciones de un beneficio confirmado.

### Presupuestos por categoría

La capacidad actual admite una categoría opcional. El diseño debe hacer visible la separación entre comida, ocio, transporte, servicios y otras categorías configurables, sin convertir presets visuales en reglas rígidas de dominio. El usuario conserva capacidad de nombrar categorías propias.

### Rewards iniciales

- XP por acciones verificadas, con límite por tipo y periodo.
- Niveles que resumen constancia, no riqueza.
- Logros por hitos reales y explicables.
- Racha semanal flexible.
- Progreso hacia metas propias.
- Celebración breve, interrumpible y con alternativa estática.

No incluir inicialmente:

- ranking público;
- loot boxes o reward aleatorio;
- puntos canjeables;
- cashback;
- presión social;
- pérdida punitiva;
- recomendaciones basadas en ML.

## Métricas y guardrails

### Métrica primaria

Porcentaje de usuarios activos que completa al menos una acción financiera útil verificable por semana.

### Métricas secundarias

- tiempo hasta primer resumen útil;
- porcentaje que crea un presupuesto por categoría;
- porcentaje que avanza una meta;
- semanas con recap revisado;
- retención de 4 y 8 semanas segmentada por gamificación activa/reducida;
- correcciones de OCR antes de confirmar;
- ahorro demostrado, únicamente cuando puede calcularse sin inferencias falsas.

### Guardrails

- aumento de gasto promedio;
- frecuencia de alertas de ansiedad o soporte;
- abandono después de perder racha;
- farming de eventos;
- desigualdad de outcomes por nivel de ingreso;
- confusión entre XP y dinero;
- notificaciones desactivadas;
- uso sin acciones útiles.

## Hipótesis para validar en San Ramón

1. El escaneo de recibos mejora registro semanal frente a captura manual únicamente.
2. Presupuestos separados para comida y ocio son más comprensibles que un límite global.
3. Un recap con colones ahorrados motiva más que XP aislado.
4. Una racha semanal flexible retiene mejor que una diaria punitiva.
5. Microlecciones contextuales convierten mejor que un catálogo educativo separado.
6. Beneficios locales interesan, pero confianza y claridad pesan más que valor nominal.

### Propuesta de prueba de campo

- 12–20 entrevistas breves con diversidad de edad e ingreso.
- prototipo de tres variantes: progreso real, racha flexible y beneficio local hipotético claramente rotulado.
- prueba de tareas: registrar gasto, escanear recibo, crear presupuesto de comida/ocio y entender un reward.
- medir comprensión, preferencia, confianza y capacidad de explicar qué tiene valor monetario.
- no pedir credenciales bancarias ni datos financieros reales durante investigación temprana.

## Checklist de aceptación

- [x] Fuentes oficiales, académicas y de producto enlazadas directamente.
- [x] Evidencia, limitaciones e inferencias diferenciadas.
- [x] Hipótesis específicas para San Ramón declaradas como hipótesis.
- [x] Patrones recomendados y prohibidos documentados.
- [x] Métricas y guardrails definidos.
- [x] Progreso virtual, ahorro y valor real separados.
- [x] Sin implementación de código ni estética final.
