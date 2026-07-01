# Smart Ant — Design System Philosophy Brief

## Propósito

Este documento sirve como contexto para que un diseñador proponga un sistema visual nuevo. Describe cómo está construida la aplicación y qué debe preservar. No prescribe colores, tipografías ni una dirección estética.

También define la intención del producto, sus datos, features actuales y evolución prevista. Debe permitir diseñar el sistema visual real sin confundir funcionalidades ya implementadas con conceptos futuros.

## Producto

Smart Ant es una aplicación móvil de finanzas personales. Su experiencia principal debe permitir entender el estado financiero y registrar movimientos con poca fricción, incluso durante uso frecuente y rápido.

No pretende ser únicamente un registro de gastos ni un curso de educación financiera. Su visión es funcionar como un acompañante de salud financiera que convierte acciones pequeñas —registrar, clasificar, ahorrar, respetar un presupuesto o completar una lección— en progreso visible y motivación sostenida.

La hipótesis central es:

> Si una persona puede entender su situación, completar una acción útil en pocos minutos y recibir evidencia inmediata de avance, tendrá más razones para volver y mejorar su comportamiento financiero.

El producto debe equilibrar tres capas:

1. **Utilidad inmediata:** capturar movimientos, leer recibos, visualizar dinero y tomar decisiones.
2. **Formación breve:** explicar conceptos financieros en piezas pequeñas y aplicables.
3. **Motivación:** retos, progreso, rachas, logros y recompensas vinculadas con hábitos saludables.

## Contexto de mercado aportado

La visión inicial está enfocada en San Ramón de Alajuela y parte de las siguientes señales aportadas por el proyecto:

- existe una población cantonal amplia y actividad relevante de pymes y emprendimientos;
- hay interés regional por inclusión financiera y herramientas prácticas;
- el obstáculo no es solamente falta de información, sino aburrimiento, fricción y baja constancia;
- un formato parecido a “Duolingo para finanzas” puede reducir ese rechazo mediante progreso, metas pequeñas, rachas e insignias;
- una propuesta híbrida —control de gastos, retos y beneficios visibles— tiene más potencial que una aplicación puramente educativa;
- comercios y emprendimientos locales podrían participar posteriormente mediante beneficios o alianzas.

Estas señales son hipótesis de producto que deben validarse con usuarios. El diseño debe permitir probarlas sin asumir que cashback, alianzas o premios monetarios ya están disponibles.

### Preguntas de validación prioritarias

1. ¿Cómo registran hoy sus gastos y qué fricción les impide mantener el hábito?
2. ¿Qué motiva más: ahorro demostrado, cashback, metas, rachas, insignias o beneficios locales?
3. ¿Usarían un lector de recibos si reduce trabajo y produce un beneficio tangible?
4. ¿Prefieren retos de comportamiento, microlecciones o una combinación?
5. ¿Qué tipo de recompensa genera confianza sin incentivar consumo innecesario?

La arquitectura de navegación actual tiene cinco áreas persistentes:

1. **Inicio:** resumen, balance, métricas y distribución de ingresos/gastos.
2. **Movimientos:** búsqueda, filtros, listado, edición y eliminación.
3. **Añadir:** ingresos, gastos, recibos e importación de movimientos.
4. **Plan:** salario, presupuestos y metas de ahorro.
5. **Perfil:** moneda, zona horaria, sesión y preferencias de cuenta.

Antes de ingresar existen las pantallas de inicio de sesión y registro, además de una pantalla breve de arranque.

## Alcance funcional completo

Este inventario es el contexto funcional que el futuro design system debe poder representar. Los elementos marcados como **actuales** existen en el producto; los marcados como **futuros** deben contemplarse visualmente sin asumir que ya tienen implementación.

### Acceso y cuenta — actual

- pantalla de arranque;
- registro con correo y contraseña;
- inicio de sesión y errores de credenciales;
- restauración de sesión;
- cierre de sesión;
- perfil con correo, moneda ISO y zona horaria IANA;
- estados de carga, sesión expirada, error de red y validación por campo.

### Inicio financiero — actual

- selector de periodo: semana, mes y año;
- balance total;
- total de ingresos y gastos;
- comparación visual entre ingresos y gastos;
- distribución de gastos por categoría;
- resumen del rango de fechas y zona horaria aplicados;
- refrescar datos;
- estados sin movimientos, cargando, error y datos parciales.

### Movimientos — actual

- historial unificado de ingresos y gastos;
- filtros por fecha inicial, fecha final, categoría y tipo;
- paginación;
- identificación visual del tipo de movimiento;
- descripción, fecha, categoría y monto;
- edición y eliminación;
- acciones destructivas y confirmación;
- estados vacíos, sin resultados, cargando más y error.

### Añadir y capturar — actual

- ingreso manual;
- gasto manual en estado pendiente;
- evaluación del gasto antes de confirmarlo;
- revisión y corrección de monto, fecha, descripción y categoría;
- advertencia financiera antes de aceptar cuando corresponda;
- confirmación idempotente para evitar duplicados;
- fotografía o selección de recibo;
- detección de datos desde recibo y revisión posterior;
- importación CSV;
- mapeo de columnas de fecha, monto, descripción y categoría;
- preview de filas válidas, inválidas y duplicadas;
- selección y confirmación de importación;
- resumen de creados, omitidos y fallidos.

### Plan financiero — actual

- configuración de salario con monto, frecuencia semanal o mensual y próxima fecha;
- generar el siguiente ingreso salarial;
- pausar, reanudar, editar y eliminar salario;
- presupuestos generales o por categoría, periodo y estado activo;
- crear, editar y eliminar presupuestos;
- metas de ahorro por monto, periodo y estado activo;
- crear, editar y eliminar metas;
- estados cuando todavía no existe salario, presupuesto o meta.

### Rewards y progreso — futuro requerido por el brief

Rewards no existe todavía en el código ni tiene contrato definitivo de backend. El design system sí debe reservar un lenguaje coherente para incorporarlo sin rediseñar la aplicación.

Debe poder expresar:

- puntos o progreso acumulado;
- nivel financiero;
- racha de hábitos;
- logro bloqueado, disponible, en progreso y completado;
- recompensa reclamada o pendiente de reclamar;
- progreso numérico y porcentual hacia una meta;
- hitos por registrar movimientos, respetar presupuestos, ahorrar o mantener actividad;
- celebración no invasiva al completar un logro;
- historial de recompensas;
- explicación transparente de por qué se obtuvo o perdió progreso;
- accesibilidad de insignias y celebraciones sin depender de color o animación.

Modelo conceptual mínimo para diseñar esta feature — sujeto a validación antes de implementarlo:

```ts
type Reward = {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "LOCKED" | "IN_PROGRESS" | "AVAILABLE" | "CLAIMED";
  progress: number;
  target: number;
  points: number;
  earnedAt: string | null;
  claimedAt: string | null;
};

type RewardProfile = {
  points: number;
  level: number;
  streakDays: number;
  nextLevelAt: number;
};
```

El diseñador puede cuestionar la forma visual de rewards, pero no debe inventar reglas económicas, premios monetarios ni mecánicas manipulativas.

## Sistema dinámico de motivación y rewards

Rewards debe ser un sistema de acompañamiento, no una colección decorativa de insignias. Su objetivo es ayudar a la persona a repetir acciones financieramente útiles y mostrarle resultados reales.

### Principios de comportamiento

- premiar acciones bajo control del usuario, no su nivel de ingreso;
- reconocer constancia, aprendizaje y mejora relativa;
- nunca recompensar gastar más, endeudarse o abrir la app sin propósito;
- evitar castigos severos por perder una racha;
- explicar qué acción generó progreso y qué beneficio produjo;
- relacionar la recompensa con datos reales: dinero ahorrado, presupuesto respetado, gastos clasificados o metas avanzadas;
- permitir pausar, silenciar o reducir gamificación;
- diferenciar con claridad puntos virtuales, descuentos, cashback y dinero real;
- no prometer recompensas patrocinadas hasta que exista una alianza confirmada.

### Roadmap dinámico

El roadmap no debe ser una secuencia rígida para todos. La aplicación debe recomendar el siguiente paso según los datos y el comportamiento disponible.

#### Etapa 0 — Activación

Objetivo: llevar a la primera evidencia de valor.

- completar perfil financiero;
- registrar o importar el primer movimiento;
- clasificar gastos iniciales;
- mostrar el primer resumen;
- elegir una meta sencilla.

La interfaz debe mostrar pocas acciones, progreso claro y una salida evidente hacia el uso normal.

#### Etapa 1 — Crear conciencia

Objetivo: lograr que la persona vea patrones reales.

- registrar movimientos durante varios días;
- escanear o importar recibos;
- revisar categorías;
- completar un reto corto de observación;
- recibir una microlección relacionada con sus datos.

Ejemplos: “Clasifica tres movimientos”, “Revisa tus gastos hormiga” o “Completa tu primera semana de registro”.

#### Etapa 2 — Construir control

Objetivo: pasar de observar a decidir.

- crear el primer presupuesto;
- configurar salario o ingresos frecuentes;
- definir una meta de ahorro;
- completar retos semanales;
- comparar el periodo actual con el anterior.

#### Etapa 3 — Sostener el hábito

Objetivo: mantener constancia sin volver repetitiva la experiencia.

- rachas flexibles basadas en acciones útiles;
- retos adaptados al historial;
- recuperación amable de racha;
- logros por consistencia y mejora;
- recap semanal con impacto concreto.

#### Etapa 4 — Optimizar

Objetivo: ayudar a mejorar decisiones específicas.

- detectar categorías fuera de presupuesto;
- sugerir retos ajustados a patrones;
- avanzar metas con mayor intención;
- ofrecer microlecciones contextuales;
- mostrar escenarios y progreso acumulado.

#### Etapa 5 — Beneficios externos

Objetivo: conectar hábitos saludables con valor local verificable.

- catálogo de beneficios de comercios aliados;
- descuentos o recompensas con condiciones transparentes;
- cashback solamente cuando exista soporte operativo real;
- campañas locales limitadas;
- historial de beneficio ganado y utilizado.

Esta etapa depende de validación, acuerdos comerciales, prevención de fraude y reglas legales. No forma parte del producto actual.

### Selección del siguiente reto

El futuro motor puede ordenar retos usando señales simples antes de introducir algoritmos complejos:

1. onboarding incompleto;
2. datos insuficientes para producir un resumen útil;
3. presupuesto o meta inexistente;
4. acción pendiente de revisión;
5. patrón reciente que puede mejorarse;
6. preferencia declarada por ahorro, control o aprendizaje;
7. reto repetido recientemente, que debe perder prioridad.

La recomendación debe incluir siempre:

- acción concreta;
- duración estimada;
- progreso y criterio de finalización;
- razón de la recomendación;
- beneficio financiero esperado;
- reward otorgado;
- opción de cambiar o rechazar el reto.

### Tipos de retos

- **Captura:** registrar, escanear o importar movimientos.
- **Orden:** clasificar, corregir o revisar información pendiente.
- **Conciencia:** identificar gastos, revisar un resumen o comparar periodos.
- **Control:** crear o respetar un presupuesto.
- **Ahorro:** avanzar una meta o completar un periodo con ahorro positivo.
- **Aprendizaje:** microlección o quiz de aproximadamente un minuto.
- **Constancia:** repetir una acción útil durante un periodo razonable.
- **Local:** actividad asociada a un beneficio confirmado de un aliado.

### Economía de rewards

El sistema debe distinguir:

- **XP:** representa aprendizaje y progreso general; no tiene valor monetario.
- **Puntos:** unidad canjeable solamente si existe un catálogo y reglas definidas.
- **Insignias:** reconocimiento permanente de un hito.
- **Racha:** continuidad flexible de hábitos útiles.
- **Ahorro demostrado:** resultado financiero real, separado de cualquier punto.
- **Beneficio local:** descuento, premio o cashback provisto por un aliado y sujeto a condiciones.

No deben mezclarse visualmente estas unidades. El usuario debe saber siempre qué tiene valor real y qué es progreso dentro de la aplicación.

### Estados del journey

```ts
type FinancialJourney = {
  stage: "ACTIVATION" | "AWARENESS" | "CONTROL" | "HABIT" | "OPTIMIZATION";
  completedActions: string[];
  recommendedChallengeId: string | null;
  weeklyProgress: number;
  savedAmountMinor: string;
};

type Challenge = {
  id: string;
  type: "CAPTURE" | "ORGANIZE" | "AWARENESS" | "CONTROL" | "SAVING" | "LEARNING" | "CONSISTENCY" | "LOCAL";
  title: string;
  description: string;
  reason: string;
  estimatedMinutes: number;
  progress: number;
  target: number;
  status: "AVAILABLE" | "ACTIVE" | "COMPLETED" | "EXPIRED" | "SKIPPED";
  rewardIds: string[];
  startsAt: string | null;
  endsAt: string | null;
};
```

Estos tipos son contratos conceptuales para diseñar pantallas y componentes. No representan todavía modelos persistidos ni autorización para implementarlos.

### Superficies de producto para motivación

- resumen de progreso en Inicio;
- siguiente reto recomendado;
- detalle y progreso del reto activo;
- recap semanal con ahorro y acciones completadas;
- perfil de nivel, XP y racha;
- colección de logros;
- historial de rewards;
- microlección contextual;
- celebración breve al completar un hito;
- catálogo y detalle de beneficio local futuro;
- ajustes para frecuencia, animación y gamificación.

## Datos que maneja la interfaz

Los montos viajan como enteros en unidad mínima representados por `string` —por ejemplo, céntimos— y se formatean según la moneda del perfil. Nunca deben tratarse visualmente como texto genérico ni perder signo, moneda o escala.

### Entidades actuales

| Entidad | Datos visibles o relevantes |
|---|---|
| Usuario | `id`, correo, moneda, zona horaria |
| Sesión | usuario autenticado, expiración y estado revocado |
| Ingreso | `id`, monto, fecha, descripción |
| Gasto | `id`, monto, fecha, descripción, categoría |
| Movimiento pendiente | monto, fecha, descripción, categoría, estado y evaluación |
| Salario | monto, frecuencia, próxima fecha, pausado/activo |
| Presupuesto | monto, periodo, categoría opcional, activo/inactivo |
| Meta de ahorro | monto, periodo, activa/inactiva |
| Resumen | periodo, rango, zona horaria, ingresos, gastos y balance |
| Categoría de gasto | nombre, monto total y proporción del total |
| Importación | fila, valores mapeados, estado, motivo y posible duplicado |
| Recibo | imagen local, datos detectados y resultado de revisión |

### Estados semánticos de datos

Todo componente de datos debe contemplar:

- desconocido o todavía no cargado;
- cargando inicial y actualizando sin borrar información previa;
- vacío legítimo;
- éxito;
- advertencia que permite continuar conscientemente;
- error de validación local;
- error de API recuperable;
- error bloqueante;
- elemento pendiente de confirmación;
- elemento confirmado;
- elemento duplicado u omitido;
- activo, pausado e inactivo;
- acción en progreso y protección contra doble envío.

## Inventario de componentes que el sistema debe cubrir

### Fundaciones y primitives

- texto semántico: display, título, sección, cuerpo, label, caption, monto y dato tabular;
- icono con label accesible;
- superficie, tarjeta, divisor y contenedor de sección;
- stack vertical, fila, grid y espaciador;
- safe-area screen, scroll screen y keyboard-safe form screen;
- skeleton, spinner y progress indicator.

### Navegación

- splash;
- barra inferior de cinco destinos con icono, label, seleccionado y badge;
- encabezado de pantalla y encabezado de sección;
- back action;
- enlace inline;
- tabs o segmentos internos;
- modal, bottom sheet y diálogo de confirmación cuando el patrón lo requiera.

### Acciones

- botón primario, secundario, terciario, icon-only y destructivo;
- botón flotante o acción prominente para captura, si la propuesta lo justifica;
- estados normal, pressed, focused, disabled y loading;
- menu de acciones y swipe action, si se proponen para movimientos.

### Formularios

- text field, password field, money field, date field y search field;
- selector de categoría, moneda, zona horaria, frecuencia y periodo;
- checkbox, radio, switch y segmented control;
- upload/select de archivo e imagen;
- label, helper text, error text y contador;
- formulario con acciones visibles mientras aparece el teclado;
- revisión editable de datos detectados o importados.

### Finanzas y visualización de datos

- money value con variantes positiva, negativa y neutral;
- balance hero;
- metric card;
- income/expense comparison;
- category distribution y leyenda;
- budget progress;
- savings goal progress;
- salary summary;
- movement row;
- pending movement review;
- date range y period selector;
- filtros activos como chips removibles.

### Feedback y estados

- inline validation;
- banner de información, éxito, advertencia y error;
- toast o snackbar para confirmación breve;
- empty state contextual;
- error state con retry;
- loading y stale-data state;
- confirmación destructiva;
- resultado de importación;
- celebración accesible de reward o meta.

### Rewards — futuro

- reward profile summary;
- points y level indicator;
- streak indicator;
- reward/achievement card;
- badge bloqueado, en progreso, disponible y reclamado;
- progress track;
- reward detail;
- claim action;
- reward history row;
- celebration overlay con alternativa sin movimiento.

## Matriz pantalla–componentes

| Pantalla/flujo | Componentes esenciales |
|---|---|
| Splash | marca, loading/progreso |
| Login/registro | keyboard-safe screen, fields, primary button, link, inline errors |
| Inicio | period selector, balance hero, metric cards, comparación, categorías, estados |
| Movimientos | filtros, chips, movement rows, paginación, edit/delete actions |
| Añadir manual | selector de tipo, money/date/text/category fields, evaluación, confirmación |
| Recibo | image picker, preview, loading de detección, review form, confirmación |
| Importación | file picker, column mapping, tabla/lista de preview, estados por fila, resumen |
| Plan | salary summary/form, budget cards/forms, goal cards/forms, progress |
| Perfil | datos de cuenta, selectors, guardar, cerrar sesión |
| Rewards futuro | profile summary, achievements, progreso, detalle, claim, historial |

## Cómo está implementada hoy

- Expo SDK 56, React Native y Expo Router.
- Navegación inferior nativa mediante `Tabs`.
- Iconografía con Lucide React Native.
- Componentes funcionales y estilos locales con `StyleSheet.create`.
- Los estilos visuales están repetidos por pantalla; aún no existen tokens ni primitives compartidos.
- La jerarquía actual suele usar título de pantalla, formulario o contenido, estados de error y acciones primarias/secundarias.
- Los formularios usan controles nativos, objetivos táctiles mínimos y mensajes de validación junto al campo.
- La aplicación trabaja en modo vertical y pantalla completa; las barras del sistema permanecen ocultas.
- Android usa ajuste de ventana `resize` y la raíz protege el contenido frente al teclado.

## Filosofía que debe guiar el sistema

### Claridad financiera

Los números, estados y consecuencias de una acción deben entenderse antes que la decoración. Ingresos, gastos, saldos, progreso y alertas necesitan jerarquías inequívocas sin depender únicamente del color.

### Acción rápida

Registrar o editar un movimiento es una tarea de alta frecuencia. El sistema debe reducir decisiones, mantener acciones principales fáciles de alcanzar y evitar que el teclado cubra campos o botones necesarios.

### Consistencia semántica

El mismo rol debe verse y comportarse igual en todas las áreas: acción primaria, acción secundaria, acción destructiva, campo, filtro, tarjeta, métrica, mensaje de error, estado vacío y confirmación.

### Densidad controlada

La pantalla debe aprovechar bien un teléfono sin sentirse saturada. Los resúmenes deben ser escaneables y los formularios deben conservar espacio suficiente para tocar, leer y corregir.

### Confianza y calma

El lenguaje visual debe sentirse preciso y estable. Las acciones financieras destructivas o irreversibles requieren diferenciación y confirmación proporcional al riesgo.

### Accesibilidad desde el sistema

El diseño debe considerar contraste, texto ampliado, etiquetas legibles, objetivos táctiles de al menos 44–48 puntos, estados que no dependan solo del color y navegación con lector de pantalla.

## Qué debe diseñarse como sistema

La propuesta debe definir, como mínimo:

- tokens semánticos de color, tipografía, espacio, radio, borde, elevación y movimiento;
- escalas y reglas de composición, no valores aislados por pantalla;
- primitives para texto, superficies, divisores, iconos y espaciado;
- componentes para botones, campos, selects, segmentos, chips/filtros, tarjetas, métricas, filas de movimiento, alertas, estados vacíos y feedback;
- estados de cada componente: normal, presionado, enfocado, deshabilitado, cargando, error y éxito;
- patrones para formularios con teclado, contenido desplazable y acciones visibles;
- estructura de las cinco áreas principales y de autenticación;
- reglas para gráficas y datos financieros;
- adaptación a distintos tamaños de Android y iPhone;
- estrategia de tema y modo oscuro, aunque su implementación pueda ser posterior.

## Restricciones técnicas

- Debe poder implementarse con React Native y Expo sin depender de CSS web.
- Debe funcionar con navegación inferior y orientación vertical.
- Debe respetar safe areas aunque las barras del sistema estén ocultas.
- Debe evitar librerías pesadas salvo que aporten una ventaja demostrable.
- Los componentes deben admitir estados asincrónicos y errores provenientes de API.
- La API, los flujos funcionales y la arquitectura de rutas no forman parte del rediseño.

## Entrega solicitada al diseñador

Propón una dirección visual distintiva para Smart Ant y conviértela en un sistema implementable. Puedes elegir libremente paleta, tipografía, forma, ilustración, iconografía complementaria y lenguaje de movimiento.

Entrega:

1. concepto y principios visuales;
2. tokens semánticos completos;
3. catálogo de componentes y estados;
4. reglas de layout y responsive móvil;
5. especificación de las pantallas clave;
6. ejemplos de jerarquía para datos financieros;
7. guía de accesibilidad;
8. estructura recomendada de archivos y componentes para React Native;
9. plan incremental para migrar desde estilos locales sin detener el desarrollo.

No conserves los valores visuales existentes por inercia. Úsalos solamente para comprender la implementación actual y justifica la nueva dirección por su capacidad para mejorar claridad, velocidad, consistencia y confianza.
