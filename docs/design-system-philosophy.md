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
