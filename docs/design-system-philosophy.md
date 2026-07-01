# Smart Ant — Design System Philosophy Brief

## Propósito

Este documento sirve como contexto para que un diseñador proponga un sistema visual nuevo. Describe cómo está construida la aplicación y qué debe preservar. No prescribe colores, tipografías ni una dirección estética.

## Producto

Smart Ant es una aplicación móvil de finanzas personales. Su experiencia principal debe permitir entender el estado financiero y registrar movimientos con poca fricción, incluso durante uso frecuente y rápido.

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
