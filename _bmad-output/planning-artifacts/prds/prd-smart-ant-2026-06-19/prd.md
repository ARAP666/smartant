---
title: "PRD: Smart Ant"
status: final
created: 2026-06-19
updated: 2026-06-19
---

# PRD: Smart Ant

## 0. Propósito

Este documento define el MVP móvil de Smart Ant y sus requisitos funcionales verificables. UX, arquitectura y epics deben conservar los identificadores FR y los términos del glosario.

## 1. Visión

Smart Ant ayuda a una persona a decidir cuánto puede gastar sin comprometer sus presupuestos ni sus metas de ahorro. Consolida ingresos y gastos, recalcula el dinero disponible y explica el impacto de cada movimiento.

El MVP debe reducir la fricción de registro mediante tres entradas: manual, fotografía e importación CSV/XLSX. La aplicación no toma decisiones financieras por el usuario; aplica reglas configuradas por él y muestra resultados trazables.

## 2. Usuario objetivo

Persona que administra finanzas personales, recibe uno o más ingresos y necesita controlar gastos semanales o mensuales.

### Trabajos por realizar

- Registrar gastos con poco esfuerzo.
- Saber cuánto queda disponible en el periodo.
- Proteger una cantidad destinada al ahorro.
- Detectar un gasto riesgoso antes o inmediatamente después de confirmarlo.
- Corregir movimientos importados o detectados incorrectamente.

### Recorridos principales

- **UJ-1. Configuración inicial:** Ana crea su cuenta, elige CRC, registra su salario, define un presupuesto mensual y una meta de ahorro. El inicio muestra cuánto puede gastar sin afectar ambos.
- **UJ-2. Gasto manual:** Ana introduce monto, categoría y fecha. Antes de confirmar ve si el gasto excede o acerca un límite; después, el saldo gastable se actualiza.
- **UJ-3. Fotografía de recibo:** Ana fotografía o selecciona un recibo, revisa comercio, fecha, monto y categoría detectados, corrige lo necesario y confirma.
- **UJ-4. Importación:** Ana selecciona un CSV/XLSX, asigna columnas, revisa filas inválidas o duplicadas y confirma únicamente las filas válidas.
- **UJ-5. Seguimiento:** Ana abre el panel y consulta ingresos, gastos, ahorro protegido, presupuesto consumido y saldo gastable del periodo.

## 3. Glosario

- **Ingreso:** entrada monetaria confirmada.
- **Salario:** Ingreso recurrente configurado por el usuario.
- **Gasto:** salida monetaria confirmada.
- **Movimiento pendiente:** dato manual, detectado o importado que aún no afecta cálculos.
- **Presupuesto:** límite de gasto para un periodo y, opcionalmente, una Categoría.
- **Meta de ahorro:** cantidad que debe reservarse durante un periodo.
- **Saldo gastable:** dinero que puede gastarse sin exceder Presupuestos ni reducir la Meta de ahorro.
- **Alerta:** mensaje explicativo producido al evaluar un Gasto frente a reglas activas.
- **Periodo:** intervalo semanal o mensual calculado con la zona horaria del usuario.

## 4. Funcionalidades

### 4.1 Cuenta y configuración

- **FR-1:** El usuario puede registrarse, iniciar sesión y cerrar sesión.
- **FR-2:** El usuario solo puede acceder a sus propios datos.
- **FR-3:** El usuario puede configurar moneda ISO y zona horaria.
- **FR-4:** La aplicación muestra estados de carga, vacío, error y éxito en operaciones asíncronas.

### 4.2 Ingresos y salario

- **FR-5:** El usuario puede crear, editar y eliminar Ingresos.
- **FR-6:** El usuario puede configurar un Salario con monto, frecuencia y próxima fecha.
- **FR-7:** Los Ingresos confirmados actualizan el resumen del Periodo.

### 4.3 Gastos manuales

- **FR-8:** El usuario puede crear un Movimiento pendiente con monto positivo, fecha, descripción y Categoría.
- **FR-9:** Antes de confirmar, el sistema evalúa el Movimiento pendiente contra Presupuestos y Metas de ahorro.
- **FR-10:** Al confirmar, el sistema guarda un Gasto y recalcula los indicadores afectados en una única operación consistente.
- **FR-11:** El usuario puede editar o eliminar un Gasto y obtener cálculos actualizados.

### 4.4 Captura por fotografía

- **FR-12:** El usuario puede tomar o seleccionar una fotografía de un recibo desde Expo Go.
- **FR-13:** El sistema crea un Movimiento pendiente con los campos que logre detectar.
- **FR-14:** Ningún dato detectado afecta cálculos hasta que el usuario lo revise y confirme.
- **FR-15:** Si la detección falla, el usuario puede completar el Movimiento pendiente manualmente.

### 4.5 Importación CSV/XLSX

- **FR-16:** El usuario puede seleccionar un archivo CSV o XLSX.
- **FR-17:** El sistema permite asignar columnas de fecha, monto, descripción y Categoría.
- **FR-18:** El sistema presenta una previsualización con filas válidas, inválidas y posibles duplicados.
- **FR-19:** El usuario puede confirmar únicamente filas válidas seleccionadas.
- **FR-20:** Reintentar la misma importación no crea duplicados silenciosos.

### 4.6 Presupuestos y ahorro

- **FR-21:** El usuario puede crear Presupuestos semanales o mensuales generales o por Categoría.
- **FR-22:** El usuario puede crear Metas de ahorro semanales o mensuales.
- **FR-23:** El sistema calcula consumo, restante y porcentaje para cada Presupuesto.
- **FR-24:** El sistema calcula el Saldo gastable considerando Ingresos, Gastos, Presupuestos y Metas de ahorro activos.
- **FR-25:** Cuando varias reglas aplican, el Saldo gastable usa la restricción más conservadora.

### 4.7 Alertas

- **FR-26:** Antes de confirmar un Gasto, el sistema muestra una Alerta si reduce el margen definido o incumple una regla.
- **FR-27:** La Alerta identifica el monto del Gasto, la regla afectada y el Saldo gastable resultante.
- **FR-28:** Las Alertas distinguen entre informativa, preventiva y bloqueo lógico.
- **FR-29:** El MVP no impide guardar un Gasto real; exige confirmación explícita cuando el resultado incumple una regla.

### 4.8 Panel e historial

- **FR-30:** El inicio muestra Ingresos, Gastos, Meta de ahorro, Presupuesto y Saldo gastable del Periodo.
- **FR-31:** El usuario puede cambiar entre vista semanal y mensual.
- **FR-32:** El usuario puede consultar y filtrar el historial por fecha, Categoría y tipo.
- **FR-33:** El usuario puede consultar la distribución de Gastos por Categoría.

## 5. Reglas de cálculo

- Todo importe se representa como entero en la unidad monetaria mínima.
- Un Movimiento pendiente nunca participa en cálculos.
- El Saldo base es `Ingresos confirmados - Gastos confirmados`.
- El margen de ahorro es `Saldo base - Meta de ahorro pendiente`.
- El margen de Presupuesto es el mínimo restante entre los Presupuestos aplicables.
- El Saldo gastable es el menor valor no negativo entre margen de ahorro, margen de Presupuesto y Saldo base.
- Las fechas se almacenan de forma inequívoca y los Periodos se resuelven con la zona horaria del usuario.

## 6. Requisitos no funcionales

- **NFR-1 Seguridad:** contraseñas con hash robusto; tokens y secretos solo mediante variables de entorno.
- **NFR-2 Privacidad:** fotografías y datos financieros pertenecen exclusivamente al usuario autenticado.
- **NFR-3 Validación:** API y aplicación validan entradas en límites de confianza.
- **NFR-4 Rendimiento:** el resumen normal debe responder en menos de 500 ms en entorno local con 10 000 movimientos por usuario.
- **NFR-5 Fiabilidad:** confirmación de movimientos y actualización de datos relacionados usan transacciones.
- **NFR-6 Accesibilidad:** controles con etiquetas, contraste suficiente y áreas táctiles apropiadas.
- **NFR-7 Observabilidad:** errores del backend incluyen identificador correlacionable sin exponer datos privados.
- **NFR-8 Calidad:** TypeScript estricto, sin `any`, Biome y pruebas unitarias para cálculos financieros.

## 7. Alcance MVP

Incluye FR-1 a FR-33, aplicación móvil Expo Go, API Express, PostgreSQL local y configuración preparada para Railway.

No incluye integración bancaria, pagos, cuentas compartidas, inversiones, administración web, notificaciones push ni asesoría financiera.

## 8. Diseño y plataforma

- Navegación primaria: Inicio, Movimientos, Añadir, Plan y Perfil.
- Marca inicial: texto “Smart Ant” con tipografía moderna; sin logo gráfico.
- Splash: muestra únicamente la misma marca tipográfica usada dentro de la aplicación, con una animación breve y sutil.
- La animación del splash respeta la preferencia del sistema para reducir movimiento.
- Iconos: Lucide exclusivamente; no se aceptan iconos Unicode.
- La captura y selección de archivos deben usar capacidades compatibles con Expo Go.
- La migración a EAS se realizará cuando notificaciones push o módulos nativos la justifiquen.

## 9. Criterios de éxito

- **SM-1:** El 95 % de gastos manuales confirmados actualiza el panel sin reintento.
- **SM-2:** El 100 % de movimientos detectados o importados requiere revisión previa.
- **SM-3:** El 100 % de Alertas muestra la regla y el Saldo gastable resultante.
- **SM-4:** Los casos unitarios de cálculo monetario y límites pasan sin errores.
- **SM-C1:** No se optimiza la cantidad de Alertas; se prioriza que sean correctas y accionables.

## 10. Preguntas abiertas

1. ¿El lanzamiento inicial será únicamente para Costa Rica y CRC?
2. ¿Qué proveedor procesará recibos y bajo qué política de retención?
3. ¿La autenticación inicial usará correo/contraseña o un proveedor administrado?
4. ¿Los gastos recurrentes forman parte del primer incremento o de una iteración posterior?
5. ¿Una alerta de “bloqueo lógico” debe requerir motivo escrito para continuar?

## 11. Supuestos

- [ASSUMPTION] CRC será la moneda inicial.
- [ASSUMPTION] El usuario puede registrar más de un Ingreso.
- [ASSUMPTION] Los Presupuestos y Metas de ahorro no trasladan sobrantes al siguiente Periodo en el MVP.
- [ASSUMPTION] Las alertas push se aplazan hasta EAS.
