---
stepsCompleted: [1, 2, 3, 4]
status: complete
completedAt: 2026-06-20
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-smart-ant-2026-06-19/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/briefs/brief-smart-ant-2026-06-19/brief.md
  - docs/development-standard.md
  - docs/production-readiness.md
---

# Smart Ant - Desglose de epics

## Resumen

Este documento descompone los requisitos del PRD y la arquitectura de Smart Ant en epics e historias implementables.

## Inventario de requisitos

### Requisitos funcionales

- FR-1: El usuario puede registrarse, iniciar sesión y cerrar sesión.
- FR-2: El usuario solo puede acceder a sus propios datos.
- FR-3: El usuario puede configurar moneda ISO y zona horaria.
- FR-4: La aplicación muestra estados de carga, vacío, error y éxito.
- FR-5: El usuario puede crear, editar y eliminar Ingresos.
- FR-6: El usuario puede configurar un Salario con monto, frecuencia y próxima fecha.
- FR-7: Los Ingresos confirmados actualizan el resumen del Periodo.
- FR-8: El usuario puede crear un Movimiento pendiente manual con monto, fecha, descripción y Categoría.
- FR-9: El sistema evalúa un Movimiento pendiente contra Presupuestos y Metas de ahorro.
- FR-10: Confirmar un Gasto persiste y recalcula en una operación consistente.
- FR-11: Editar o eliminar un Gasto actualiza los cálculos.
- FR-12: El usuario puede tomar o seleccionar una fotografía de un recibo.
- FR-13: El sistema crea un Movimiento pendiente con los datos detectados.
- FR-14: Los datos detectados no afectan cálculos antes de confirmarse.
- FR-15: El usuario puede completar manualmente una detección fallida.
- FR-16: El usuario puede seleccionar CSV o XLSX.
- FR-17: El usuario puede asignar columnas de importación.
- FR-18: El sistema muestra filas válidas, inválidas y posibles duplicados.
- FR-19: El usuario puede confirmar filas válidas seleccionadas.
- FR-20: Reintentar una importación no crea duplicados silenciosos.
- FR-21: El usuario puede crear Presupuestos semanales o mensuales generales o por Categoría.
- FR-22: El usuario puede crear Metas de ahorro semanales o mensuales.
- FR-23: El sistema calcula consumo, restante y porcentaje por Presupuesto.
- FR-24: El sistema calcula el Saldo gastable.
- FR-25: El Saldo gastable usa la restricción más conservadora.
- FR-26: El sistema alerta antes de confirmar un Gasto que afecta una regla.
- FR-27: La Alerta muestra monto, regla y Saldo gastable resultante.
- FR-28: Las Alertas distinguen severidad informativa, preventiva y bloqueo lógico.
- FR-29: Un incumplimiento exige confirmación explícita, pero no impide registrar el Gasto.
- FR-30: Inicio muestra Ingresos, Gastos, ahorro, Presupuesto y Saldo gastable.
- FR-31: El usuario puede cambiar entre vista semanal y mensual.
- FR-32: El usuario puede filtrar el historial por fecha, Categoría y tipo.
- FR-33: El usuario puede consultar Gastos por Categoría.

### Requisitos no funcionales

- NFR-1: Contraseñas con hash robusto; tokens y secretos mediante variables de entorno.
- NFR-2: Fotografías y datos financieros pertenecen exclusivamente al usuario autenticado.
- NFR-3: API y aplicación validan entradas en límites de confianza.
- NFR-4: El resumen responde en menos de 500 ms en local con 10 000 movimientos por usuario.
- NFR-5: Mutaciones financieras relacionadas usan transacciones.
- NFR-6: Controles con etiquetas, contraste suficiente y áreas táctiles apropiadas.
- NFR-7: Errores backend incluyen `requestId` sin exponer datos privados.
- NFR-8: TypeScript estricto, sin `any`, Biome y pruebas unitarias financieras.

### Requisitos adicionales de arquitectura

- AR-1: La primera historia inicializa npm workspaces, Expo oficial, Express 5, TypeScript, Biome y Vitest.
- AR-2: Usar Node.js 24 LTS, PostgreSQL 18 y Prisma ORM 7.
- AR-3: API REST JSON versionada bajo `/api/v1`.
- AR-4: Importes persistidos como `BigInt` y enviados como strings enteros.
- AR-5: Autenticación por correo/contraseña, Argon2id y sesiones opacas guardadas en Expo SecureStore.
- AR-6: Toda consulta financiera aplica alcance por `userId`.
- AR-7: Zod valida solicitudes y configuración.
- AR-8: Errores usan `code`, `message`, `details` y `requestId`.
- AR-9: Confirmaciones e importaciones reintentables usan idempotencia.
- AR-10: `packages/finance` contiene reglas puras sin dependencias de framework.
- AR-11: TanStack Query administra estado de servidor; no se usa Redux.
- AR-12: No se usan actualizaciones optimistas financieras.
- AR-13: PostgreSQL local en desarrollo y API/PostgreSQL en Railway para producción.
- AR-14: CI ejecuta type-check, Biome, pruebas y build.
- AR-15: Archivos `.env*.example` documentan entornos sin incluir secretos.
- AR-16: OCR e importaciones producen Movimientos pendientes antes de persistir Gastos.
- AR-17: No usar Redis, colas, microservicios ni Docker en el MVP salvo necesidad demostrada.

### Requisitos UX

- UX-DR1: Navegación primaria con Inicio, Movimientos, Añadir, Plan y Perfil.
- UX-DR2: Usar exclusivamente iconos Lucide; no usar iconos Unicode.
- UX-DR3: Una sola marca tipográfica `SmartAntWordmark` se reutiliza en splash e interior.
- UX-DR4: El splash muestra únicamente `SmartAntWordmark` con animación breve y sutil.
- UX-DR5: La animación del splash se desactiva o reduce según la preferencia del sistema.
- UX-DR6: Toda superficie asíncrona define carga, vacío, error, éxito y estado deshabilitado.
- UX-DR7: Las confirmaciones riesgosas requieren una segunda acción explícita.
- UX-DR8: El diseño debe funcionar en Expo Go y cumplir accesibilidad móvil básica.

### Mapa de cobertura FR

- FR-1: Epic 1 - Registro, inicio y cierre de sesión.
- FR-2: Epic 1 - Aislamiento de datos personales.
- FR-3: Epic 1 - Moneda y zona horaria.
- FR-4: Epic 1 - Estados asíncronos consistentes.
- FR-5: Epic 2 - Gestión de Ingresos.
- FR-6: Epic 2 - Configuración de Salario.
- FR-7: Epic 2 - Actualización del resumen por Ingresos.
- FR-8: Epic 3 - Movimiento pendiente manual.
- FR-9: Epic 3 - Evaluación previa del Gasto.
- FR-10: Epic 3 - Confirmación transaccional.
- FR-11: Epic 3 - Edición y eliminación con recálculo.
- FR-12: Epic 5 - Cámara y selección de recibos.
- FR-13: Epic 5 - Datos detectados como Movimiento pendiente.
- FR-14: Epic 5 - Revisión obligatoria.
- FR-15: Epic 5 - Captura manual ante fallo.
- FR-16: Epic 6 - Selección CSV/XLSX.
- FR-17: Epic 6 - Asignación de columnas.
- FR-18: Epic 6 - Previsualización y clasificación.
- FR-19: Epic 6 - Confirmación selectiva.
- FR-20: Epic 6 - Idempotencia y duplicados.
- FR-21: Epic 2 - Presupuestos.
- FR-22: Epic 2 - Metas de ahorro.
- FR-23: Epic 3 - Consumo y restante del Presupuesto.
- FR-24: Epic 3 - Saldo gastable.
- FR-25: Epic 3 - Restricción más conservadora.
- FR-26: Epic 3 - Alerta previa.
- FR-27: Epic 3 - Explicación monetaria.
- FR-28: Epic 3 - Severidad.
- FR-29: Epic 3 - Confirmación explícita.
- FR-30: Epic 4 - Resumen principal.
- FR-31: Epic 4 - Periodo semanal/mensual.
- FR-32: Epic 4 - Historial filtrable.
- FR-33: Epic 4 - Distribución por Categoría.

## Lista de epics

### Epic 1: Fundación y acceso personal

El usuario puede abrir Smart Ant, reconocer una identidad visual consistente, crear una cuenta, iniciar sesión y configurar su contexto financiero básico.

**FR cubiertos:** FR-1, FR-2, FR-3, FR-4.

### Epic 2: Ingresos y planificación financiera

El usuario puede registrar sus Ingresos y Salario, definir Presupuestos y proteger Metas de ahorro semanales o mensuales.

**FR cubiertos:** FR-5, FR-6, FR-7, FR-21, FR-22.

### Epic 3: Gastos manuales y protección del plan

El usuario puede registrar Gastos manuales y conocer su impacto antes de confirmarlos mediante Saldo gastable y Alertas explicativas.

**FR cubiertos:** FR-8, FR-9, FR-10, FR-11, FR-23, FR-24, FR-25, FR-26, FR-27, FR-28, FR-29.

### Epic 4: Visión y seguimiento financiero

El usuario puede comprender su situación financiera mediante el panel, vistas por Periodo, historial y distribución por Categoría.

**FR cubiertos:** FR-30, FR-31, FR-32, FR-33.

### Epic 5: Captura de recibos

El usuario puede tomar o seleccionar una fotografía, revisar los datos detectados y convertirlos de forma segura en un Gasto.

**FR cubiertos:** FR-12, FR-13, FR-14, FR-15.

### Epic 6: Importación masiva

El usuario puede importar CSV/XLSX, asignar columnas, corregir problemas y confirmar movimientos sin duplicados silenciosos.

**FR cubiertos:** FR-16, FR-17, FR-18, FR-19, FR-20.

### Epic 7: Preparación para producción

El producto queda verificable y desplegable en Railway con configuración segura, migraciones, CI y observabilidad.

**FR cubiertos:** ninguno; realiza NFR-1 a NFR-8 y AR-13 a AR-15.

## Epic 1: Fundación y acceso personal

El usuario puede abrir Smart Ant, reconocer una identidad visual consistente, crear una cuenta, iniciar sesión y configurar su contexto financiero básico.

### Story 1.1: Inicializar Smart Ant

**Requisitos:** AR-1, AR-2, AR-13, AR-14, AR-15, NFR-8.

Como desarrollador,
quiero inicializar el monorepo,
para poder construir y verificar la aplicación.

**Criterios de aceptación:**

**Dado** un repositorio sin código de aplicación
**cuando** se ejecutan los comandos documentados
**entonces** Expo, Express y npm workspaces inician correctamente
**y** TypeScript estricto, Biome y Vitest quedan configurados.

**Dado** PostgreSQL local disponible
**cuando** la API carga sus variables de entorno
**entonces** Prisma conecta a la base local `sentDB` sin secretos versionados
**y** existen `.env.example`, `.env.development.example` y `.env.production.example`.

**Dado** el monorepo inicializado
**cuando** CI o un desarrollador ejecuta los scripts raíz
**entonces** type-check, lint, test y build terminan correctamente.

### Story 1.2: Mostrar identidad y navegación base

**Requisitos:** FR-4, UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR6, UX-DR8.

Como usuario,
quiero reconocer Smart Ant al abrirla y navegar por sus secciones,
para orientarme desde el primer uso.

**Criterios de aceptación:**

**Dado** que se abre la aplicación
**cuando** aparece el splash
**entonces** solo muestra `SmartAntWordmark` con una animación breve y sutil
**y** la misma marca tipográfica aparece dentro de la aplicación.

**Dado** que el sistema solicita reducir movimiento
**cuando** se muestra el splash
**entonces** la animación se desactiva o simplifica.

**Dado** que la aplicación está abierta
**cuando** el usuario consulta la navegación principal
**entonces** encuentra Inicio, Movimientos, Añadir, Plan y Perfil
**y** todos los iconos proceden de Lucide, sin iconos Unicode.

### Story 1.3: Crear una cuenta

**Requisitos:** FR-1, FR-2, NFR-1, NFR-2, NFR-3, AR-5, AR-6, AR-7.

Como usuario,
quiero registrarme,
para mantener mis finanzas privadas.

**Criterios de aceptación:**

**Dado** un correo válido y una contraseña que cumple la política
**cuando** el usuario envía el registro
**entonces** se crea la cuenta con contraseña Argon2id
**y** la sesión opaca se guarda en Expo SecureStore.

**Dado** un correo ya registrado
**cuando** se intenta crear otra cuenta
**entonces** la API devuelve un conflicto controlado
**y** no revela datos privados ni stack traces.

**Dado** una entrada inválida
**cuando** se envía el registro
**entonces** Zod rechaza la solicitud con errores de campo.

### Story 1.4: Iniciar y cerrar sesión

**Requisitos:** FR-1, FR-2, NFR-1, AR-5, AR-6.

Como usuario registrado,
quiero gestionar mi sesión,
para acceder de forma segura.

**Criterios de aceptación:**

**Dado** credenciales válidas
**cuando** el usuario inicia sesión
**entonces** recibe una sesión opaca y accede a las rutas privadas.

**Dado** credenciales inválidas
**cuando** se intenta iniciar sesión
**entonces** se muestra un error genérico sin confirmar qué campo falló.

**Dado** una sesión activa
**cuando** el usuario cierra sesión
**entonces** el token se revoca y se elimina de SecureStore.

**Dado** una sesión ausente, expirada o revocada
**cuando** se solicita una ruta privada
**entonces** la API responde 401.

### Story 1.5: Configurar contexto financiero

**Requisitos:** FR-2, FR-3, FR-4, NFR-3, NFR-6.

Como usuario,
quiero elegir moneda y zona horaria,
para obtener periodos y cálculos correctos.

**Criterios de aceptación:**

**Dado** un usuario autenticado
**cuando** guarda una moneda ISO y una zona horaria válidas
**entonces** la configuración queda asociada únicamente a su cuenta.

**Dado** el primer uso
**cuando** se presenta la configuración
**entonces** CRC y `America/Costa_Rica` aparecen como valores sugeridos editables.

**Dado** una configuración guardada
**cuando** el sistema calcula un Periodo
**entonces** utiliza la zona horaria del usuario.

**Dado** la pantalla de configuración
**cuando** carga o guarda datos
**entonces** representa carga, error, éxito y estado deshabilitado.

## Epic 2: Ingresos y planificación financiera

El usuario puede registrar sus Ingresos y Salario, definir Presupuestos y proteger Metas de ahorro semanales o mensuales.

### Story 2.1: Gestionar ingresos

**Requisitos:** FR-5, FR-7, FR-2, NFR-3, NFR-5, AR-4, AR-6.

Como usuario,
quiero registrar mis Ingresos,
para conocer mis recursos disponibles.

**Criterios de aceptación:**

**Dado** un usuario autenticado
**cuando** crea un Ingreso con monto entero positivo y fecha válida
**entonces** el Ingreso queda asociado a su cuenta
**y** el resumen del Periodo se actualiza.

**Dado** un Ingreso propio
**cuando** el usuario lo edita o elimina
**entonces** el resumen se recalcula de forma consistente.

**Dado** un identificador perteneciente a otro usuario
**cuando** se intenta consultar o modificar
**entonces** la API no expone ni altera el registro.

### Story 2.2: Configurar salario recurrente

**Requisitos:** FR-6, FR-7, AR-4, AR-9.

Como usuario,
quiero registrar mi Salario,
para incorporarlo a mi planificación.

**Criterios de aceptación:**

**Dado** un usuario autenticado
**cuando** configura monto, frecuencia semanal o mensual y próxima fecha
**entonces** se guarda un Salario recurrente válido.

**Dado** un Salario existente
**cuando** el usuario lo edita, pausa o elimina
**entonces** la recurrencia cambia sin alterar Ingresos históricos confirmados.

**Dado** una generación reintentada para el mismo Periodo
**cuando** se procesa el Salario
**entonces** no se crean Ingresos duplicados.

### Story 2.3: Crear presupuestos

**Requisitos:** FR-21, FR-2, NFR-3, AR-4, AR-6.

Como usuario,
quiero limitar mis Gastos,
para controlar cuánto puedo consumir.

**Criterios de aceptación:**

**Dado** un usuario autenticado
**cuando** crea un Presupuesto semanal o mensual con monto positivo
**entonces** puede aplicarlo de forma general o a una Categoría.

**Dado** una regla duplicada o incompatible para el mismo Periodo y alcance
**cuando** se intenta guardar
**entonces** la API devuelve un conflicto explicativo.

**Dado** un Presupuesto propio
**cuando** el usuario lo edita, activa, desactiva o elimina
**entonces** los cálculos posteriores utilizan el estado actualizado.

### Story 2.4: Crear metas de ahorro

**Requisitos:** FR-22, FR-2, NFR-3, AR-4, AR-6.

Como usuario,
quiero reservar una cantidad,
para proteger mis objetivos.

**Criterios de aceptación:**

**Dado** un usuario autenticado
**cuando** crea una Meta de ahorro semanal o mensual con monto positivo
**entonces** la Meta queda activa para el Periodo correspondiente.

**Dado** una Meta propia
**cuando** el usuario la edita, activa, desactiva o elimina
**entonces** el dinero reservado se recalcula.

**Dado** el cambio a un nuevo Periodo
**cuando** se evalúa la Meta
**entonces** no se trasladan sobrantes automáticamente.

**Dado** una Meta activa
**cuando** el usuario consulta el Plan
**entonces** ve cuánto ha reservado y cuánto falta.

## Epic 3: Gastos manuales y protección del plan

El usuario puede registrar Gastos manuales y conocer su impacto antes de confirmarlos mediante Saldo gastable y Alertas explicativas.

### Story 3.1: Calcular saldo gastable

**Requisitos:** FR-23, FR-24, FR-25, NFR-8, AR-4, AR-10.

Como usuario,
quiero un cálculo confiable,
para saber cuánto puedo gastar sin afectar mi plan.

**Criterios de aceptación:**

**Dado** Ingresos, Gastos, Presupuestos y Metas de ahorro confirmados
**cuando** el motor financiero calcula el Periodo
**entonces** devuelve saldo base, márgenes aplicables y Saldo gastable
**y** usa la restricción más conservadora sin devolver un valor menor que cero.

**Dado** reglas generales y por Categoría
**cuando** se evalúa un Gasto categorizado
**entonces** solo se aplican las reglas correspondientes.

**Dado** casos límite de montos y límites de Periodo
**cuando** se ejecutan las pruebas unitarias
**entonces** los resultados son deterministas
**y** el paquete no depende de Expo, Express ni Prisma.

### Story 3.2: Evaluar un gasto manual

**Requisitos:** FR-8, FR-9, FR-14, NFR-3, AR-7, AR-16.

Como usuario,
quiero conocer el impacto de un Gasto antes de guardarlo,
para decidir con información suficiente.

**Criterios de aceptación:**

**Dado** monto positivo, fecha, descripción y Categoría válidos
**cuando** el usuario solicita evaluar
**entonces** se crea un Movimiento pendiente que no afecta los cálculos confirmados.

**Dado** un Movimiento pendiente
**cuando** la API lo evalúa
**entonces** devuelve el Saldo gastable resultante y las reglas afectadas.

**Dado** campos inválidos
**cuando** el usuario intenta evaluar
**entonces** se muestran errores de campo sin persistir un Gasto.

### Story 3.3: Mostrar alertas financieras

**Requisitos:** FR-26, FR-27, FR-28, FR-29, UX-DR7.

Como usuario,
quiero una explicación clara cuando un Gasto afecta mi plan,
para entender la consecuencia antes de confirmar.

**Criterios de aceptación:**

**Dado** un Movimiento pendiente evaluado
**cuando** afecta o se acerca a una regla
**entonces** se muestra una Alerta informativa, preventiva o de bloqueo lógico.

**Dado** una Alerta
**cuando** el usuario la consulta
**entonces** identifica monto, regla afectada y Saldo gastable resultante
**y** puede expresar “Solo puedes gastar ₡13 000 este mes sin afectar tu ahorro” cuando esos datos correspondan.

**Dado** una Alerta de bloqueo lógico
**cuando** el usuario decide continuar
**entonces** debe realizar una segunda acción explícita.

**Dado** cualquier Alerta
**cuando** se presenta
**entonces** no promete resultados ni se expresa como asesoría financiera garantizada.

### Story 3.4: Confirmar un gasto

**Requisitos:** FR-10, FR-29, NFR-5, AR-6, AR-9, AR-12.

Como usuario,
quiero guardar un Gasto real aunque exceda mi plan,
para mantener un historial fiel.

**Criterios de aceptación:**

**Dado** un Movimiento pendiente válido
**cuando** el usuario lo confirma
**entonces** el Gasto se crea y los datos relacionados se recalculan en una transacción.

**Dado** una confirmación reintentada con la misma clave de idempotencia
**cuando** la API la recibe
**entonces** no crea un segundo Gasto.

**Dado** un incumplimiento de regla
**cuando** el usuario confirma explícitamente después de la Alerta
**entonces** el Gasto se guarda asociado únicamente a su cuenta.

### Story 3.5: Editar o eliminar gastos

**Requisitos:** FR-11, FR-2, FR-9, NFR-5, AR-6, AR-12.

Como usuario,
quiero corregir mi historial,
para mantener cálculos precisos.

**Criterios de aceptación:**

**Dado** un Gasto propio
**cuando** el usuario propone una edición
**entonces** el sistema reevalúa las reglas antes de confirmar el cambio.

**Dado** una edición o eliminación confirmada
**cuando** se procesa
**entonces** el Gasto y los cálculos se actualizan en una transacción.

**Dado** un Gasto ajeno
**cuando** se intenta modificar o eliminar
**entonces** la API no expone ni altera el registro.

**Dado** un error durante la mutación
**cuando** la transacción falla
**entonces** se conserva el estado anterior.

## Epic 4: Visión y seguimiento financiero

El usuario puede comprender su situación financiera mediante el panel, vistas por Periodo, historial y distribución por Categoría.

### Story 4.1: Consultar resumen financiero

**Requisitos:** FR-30, FR-4, NFR-4, AR-6, AR-11.

Como usuario,
quiero ver mi situación actual al abrir la aplicación,
para saber cuánto puedo gastar.

**Criterios de aceptación:**

**Dado** un usuario autenticado
**cuando** abre Inicio
**entonces** ve Ingresos, Gastos, Meta de ahorro, Presupuesto y Saldo gastable del mismo Periodo.

**Dado** hasta 10 000 movimientos del usuario en el entorno de prueba local
**cuando** se solicita el resumen normal
**entonces** la respuesta se completa en menos de 500 ms.

**Dado** la consulta del resumen
**cuando** está cargando, vacía, falla o se actualiza
**entonces** la pantalla representa cada estado de forma diferenciada.

**Dado** un usuario autenticado
**cuando** consulta el resumen
**entonces** no recibe datos de otras cuentas.

### Story 4.2: Cambiar periodo

**Requisitos:** FR-31, FR-3.

Como usuario,
quiero alternar entre semana y mes,
para revisar distintos horizontes financieros.

**Criterios de aceptación:**

**Dado** la pantalla de Inicio
**cuando** el usuario selecciona semana o mes
**entonces** fechas, indicadores y gráficos cambian al mismo Periodo.

**Dado** un Periodo activo
**cuando** se muestran los datos
**entonces** sus límites son visibles y respetan la zona horaria configurada.

**Dado** una selección realizada
**cuando** el usuario navega entre secciones durante la sesión
**entonces** el Periodo seleccionado se conserva.

### Story 4.3: Consultar historial

**Requisitos:** FR-32, FR-11, FR-4, AR-6.

Como usuario,
quiero revisar mis movimientos,
para entender y corregir mis finanzas.

**Criterios de aceptación:**

**Dado** movimientos confirmados
**cuando** el usuario abre Movimientos
**entonces** ve Ingresos y Gastos ordenados por fecha y paginados.

**Dado** filtros de intervalo, Categoría o tipo
**cuando** el usuario los aplica
**entonces** la lista muestra únicamente los movimientos correspondientes.

**Dado** que no existen resultados
**cuando** se muestra el historial
**entonces** aparece un estado vacío claro.

**Dado** un Gasto propio seleccionado
**cuando** el usuario abre su detalle
**entonces** puede iniciar edición o eliminación.

### Story 4.4: Ver gastos por categoría

**Requisitos:** FR-33, FR-31, NFR-6.

Como usuario,
quiero conocer dónde gasto más,
para comprender mis hábitos.

**Criterios de aceptación:**

**Dado** Gastos en el Periodo activo
**cuando** se solicita la distribución
**entonces** se muestra total y porcentaje por Categoría
**y** la suma coincide con el total de Gastos filtrados.

**Dado** Categorías sin Gastos
**cuando** se calculan porcentajes
**entonces** no distorsionan el resultado.

**Dado** la visualización por Categoría
**cuando** se presenta
**entonces** puede comprenderse sin depender únicamente del color.

**Dado** un cambio de Periodo o filtros
**cuando** se actualiza la consulta
**entonces** la distribución cambia de forma consistente.

## Epic 5: Captura de recibos

El usuario puede tomar o seleccionar una fotografía, revisar los datos detectados y convertirlos de forma segura en un Gasto.

### Story 5.1: Tomar o seleccionar una fotografía

**Requisitos:** FR-12, FR-15, NFR-2, NFR-6, UX-DR8.

Como usuario,
quiero usar un recibo,
para reducir el registro manual.

**Criterios de aceptación:**

**Dado** la pantalla Añadir
**cuando** el usuario elige fotografía
**entonces** puede usar cámara o galería mediante APIs compatibles con Expo Go.

**Dado** que cámara o galería requieren permiso
**cuando** se intenta acceder por primera vez
**entonces** la aplicación solicita únicamente el permiso necesario.

**Dado** un permiso rechazado
**cuando** el usuario vuelve al flujo
**entonces** se explica el problema y se ofrece registro manual.

**Dado** un archivo seleccionado
**cuando** se prepara la carga
**entonces** se validan tipo y tamaño
**y** la fotografía queda asociada únicamente al usuario autenticado.

### Story 5.2: Detectar datos del recibo

**Requisitos:** FR-13, FR-14, NFR-2, NFR-7, AR-8, AR-16.

Como usuario,
quiero obtener una propuesta de Gasto desde una fotografía,
para ahorrar tiempo.

**Criterios de aceptación:**

**Dado** una fotografía válida
**cuando** se envía mediante multipart
**entonces** el procesamiento intenta detectar comercio, fecha, monto y descripción.

**Dado** datos detectados total o parcialmente
**cuando** termina el procesamiento
**entonces** se crea un Movimiento pendiente, nunca un Gasto confirmado.

**Dado** un fallo parcial
**cuando** algunos campos sí fueron detectados
**entonces** se conservan para revisión.

**Dado** un error de procesamiento
**cuando** la API responde
**entonces** incluye un `requestId` sin exponer datos privados.

**Dado** el entorno de producción
**cuando** se habilita OCR
**entonces** proveedor, almacenamiento y retención están configurados explícitamente.

### Story 5.3: Revisar y confirmar recibo

**Requisitos:** FR-14, FR-15, FR-9, FR-10, AR-9, AR-16.

Como usuario,
quiero corregir los datos detectados,
para evitar que un error afecte mis finanzas.

**Criterios de aceptación:**

**Dado** un Movimiento pendiente detectado
**cuando** se muestra la revisión
**entonces** todos los campos son editables
**y** los campos faltantes pueden completarse manualmente.

**Dado** datos válidos revisados
**cuando** el usuario solicita evaluar
**entonces** recibe las mismas Alertas que un Gasto manual.

**Dado** que el usuario cancela
**cuando** abandona la revisión
**entonces** no se crea un Gasto.

**Dado** que el usuario confirma
**cuando** se procesa el Movimiento pendiente
**entonces** se reutilizan la transacción y la idempotencia del Gasto manual.

**Dado** una fotografía almacenada
**cuando** vence la política de retención o el usuario solicita su eliminación
**entonces** se elimina sin borrar el Gasto confirmado.

## Epic 6: Importación masiva

El usuario puede importar CSV/XLSX, asignar columnas, corregir problemas y confirmar movimientos sin duplicados silenciosos.

### Story 6.1: Seleccionar y leer archivo

**Requisitos:** FR-16, FR-20, NFR-2, NFR-3, UX-DR8.

Como usuario,
quiero cargar CSV o XLSX,
para registrar varios movimientos.

**Criterios de aceptación:**

**Dado** la pantalla Añadir
**cuando** el usuario selecciona importar
**entonces** puede elegir un archivo mediante APIs compatibles con Expo Go.

**Dado** un archivo seleccionado
**cuando** se valida
**entonces** solo se aceptan CSV y XLSX dentro de los límites configurados de tamaño y filas.

**Dado** un archivo inválido
**cuando** se rechaza
**entonces** no se crean Movimientos pendientes ni Gastos.

**Dado** un archivo válido
**cuando** se procesa
**entonces** la importación queda asociada al usuario autenticado.

### Story 6.2: Asignar columnas

**Requisitos:** FR-17, NFR-3, AR-7.

Como usuario,
quiero indicar qué representa cada columna,
para interpretar correctamente mis datos.

**Criterios de aceptación:**

**Dado** un archivo leído
**cuando** se muestra el mapeo
**entonces** el usuario puede asignar fecha, monto, descripción y Categoría.

**Dado** un mapeo
**cuando** falta fecha o monto
**entonces** no puede continuar.

**Dado** columnas ambiguas
**cuando** el sistema propone una asignación
**entonces** requiere confirmación antes de procesarlas.

**Dado** un mapeo confirmado
**cuando** se avanza
**entonces** se usa solo para esa importación
**y** se muestra una muestra previa de los valores interpretados.

### Story 6.3: Revisar resultados

**Requisitos:** FR-18, FR-19, FR-20, AR-16.

Como usuario,
quiero distinguir filas válidas y problemáticas,
para decidir cuáles importar.

**Criterios de aceptación:**

**Dado** un archivo procesado
**cuando** se presenta la previsualización
**entonces** cada fila se clasifica como válida, inválida o posible duplicado.

**Dado** una fila inválida
**cuando** el usuario la consulta
**entonces** ve qué campo impide importarla.

**Dado** un posible duplicado
**cuando** el usuario lo consulta
**entonces** ve la coincidencia detectada.

**Dado** la previsualización
**cuando** el usuario selecciona filas
**entonces** solo puede confirmar filas válidas
**y** ninguna fila afecta todavía los cálculos.

### Story 6.4: Confirmar importación

**Requisitos:** FR-19, FR-20, FR-9, FR-10, NFR-5, AR-9, AR-16.

Como usuario,
quiero guardar únicamente los movimientos correctos,
para mantener datos consistentes.

**Criterios de aceptación:**

**Dado** filas válidas seleccionadas
**cuando** el usuario confirma
**entonces** se crean los Gastos dentro de una transacción controlada.

**Dado** filas no seleccionadas, inválidas o no confirmadas
**cuando** termina la operación
**entonces** no se guardan.

**Dado** la misma clave de idempotencia
**cuando** se reintenta la importación
**entonces** no se duplican Gastos.

**Dado** cada Gasto importado
**cuando** se confirma
**entonces** se evalúa contra las reglas activas.

**Dado** el resultado de la importación
**cuando** se responde al usuario
**entonces** se informa cuántos movimientos fueron creados, omitidos o fallaron
**y** no quedan datos parciales inconsistentes.

## Epic 7: Preparación para producción

El producto queda verificable y desplegable en Railway con configuración segura, migraciones, CI y observabilidad.

### Story 7.1: Desplegar API y PostgreSQL en Railway

**Requisitos:** AR-2, AR-13, AR-15, NFR-5.

Como equipo,
queremos un entorno desplegable y reproducible,
para operar el backend fuera del equipo local.

**Criterios de aceptación:**

**Dado** el proyecto configurado en Railway
**cuando** se despliega
**entonces** Railway construye `apps/api` y valida todas las variables requeridas.

**Dado** una nueva versión
**cuando** se inicia el despliegue
**entonces** las migraciones Prisma se aplican antes de iniciar la API.

**Dado** el servicio iniciado
**cuando** se consulta salud
**entonces** se verifica API y conexión PostgreSQL.

**Dado** desarrollo local
**cuando** se ejecuta la API
**entonces** utiliza PostgreSQL local con la base `sentDB`.

**Dado** el MVP
**cuando** se despliega
**entonces** no requiere Docker salvo una necesidad demostrada.

### Story 7.2: Añadir observabilidad y protección operativa

**Requisitos:** NFR-1, NFR-2, NFR-7, AR-3, AR-8.

Como equipo,
queremos diagnosticar fallos sin exponer datos privados,
para operar el sistema con seguridad.

**Criterios de aceptación:**

**Dado** cualquier solicitud
**cuando** entra a la API
**entonces** recibe un `requestId`
**y** el log JSON incluye ruta, estado y duración.

**Dado** información sensible
**cuando** se registran eventos
**entonces** no aparecen tokens, contraseñas, imágenes ni datos financieros privados.

**Dado** la API de producción
**cuando** inicia
**entonces** Helmet, CORS restringido y rate limits están activos.

**Dado** un error inesperado
**cuando** se responde 500
**entonces** el usuario recibe un mensaje seguro con `requestId`.

### Story 7.3: Ejecutar gate de producción

**Requisitos:** NFR-1, NFR-2, NFR-3, NFR-4, NFR-5, NFR-6, NFR-7, NFR-8, AR-13, AR-15.

Como responsable del producto,
quiero comprobar que el MVP es seguro y verificable,
para habilitarlo con riesgo controlado.

**Criterios de aceptación:**

**Dado** una base PostgreSQL vacía
**cuando** se aplican migraciones
**entonces** terminan correctamente.

**Dado** el candidato a producción
**cuando** se ejecutan las verificaciones
**entonces** pasan pruebas financieras, autenticación e idempotencia
**y** se revisan estados UI y accesibilidad básica.

**Dado** Expo Go conectado a Railway
**cuando** se recorre el flujo principal
**entonces** registro, planificación, Gasto, Alerta y panel funcionan de extremo a extremo.

**Dado** que se habilitará fotografía en producción
**cuando** se aprueba el gate
**entonces** proveedor OCR, almacenamiento privado y retención están definidos.

**Dado** el repositorio y PostgreSQL de producción
**cuando** se revisa preparación
**entonces** no hay secretos versionados
**y** respaldo y recuperación están documentados.
