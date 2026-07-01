---
stepsCompleted: [1, 2, 3, 4]
status: complete
completedAt: 2026-06-30
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-smart-ant-2026-06-19/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/briefs/brief-smart-ant-2026-06-19/brief.md
  - docs/development-standard.md
  - docs/production-readiness.md
  - docs/design-system-philosophy.md
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
- FR-34: El usuario puede consultar su etapa actual de salud financiera y una siguiente acción recomendada.
- FR-35: El usuario puede activar, cambiar u omitir un reto con objetivo, duración, progreso y recompensa transparentes.
- FR-36: El sistema actualiza el progreso de retos únicamente mediante acciones financieras o educativas verificables.
- FR-37: El usuario puede consultar XP, nivel, racha flexible, insignias y logros obtenidos o en progreso.
- FR-38: El sistema permite recuperar una racha sin invalidar el progreso financiero acumulado.
- FR-39: El usuario puede completar microlecciones y quizzes breves relacionados con su contexto financiero.
- FR-40: El usuario recibe un recap semanal que explica acciones completadas, ahorro demostrado y oportunidades siguientes.
- FR-41: El usuario puede consultar el historial y la explicación de cada reward obtenido, pendiente o reclamado.
- FR-42: El usuario puede configurar frecuencia, animaciones y nivel de gamificación.
- FR-43: El motor recomienda retos según onboarding, datos disponibles, metas, patrones recientes y preferencias, evitando repetición excesiva.
- FR-44: El sistema distingue XP, puntos, insignias, ahorro demostrado y beneficios con valor real.
- FR-45: Cuando existan alianzas verificadas, el usuario puede consultar y reclamar beneficios locales bajo condiciones explícitas.
- FR-46: El usuario puede adjuntar opcionalmente una imagen de recibo a un gasto manual o detectado sin exigir OCR.
- FR-47: El usuario puede consultar o eliminar la imagen adjunta sin eliminar el gasto ni alterar sus cálculos.
- FR-48: El usuario puede alternar Inicio entre Día, Semana y Mes y cada periodo recalcula sus datos.
- FR-49: La cuenta demo contiene datos abundantes y coherentes para presupuestos, gastos, ingresos, metas y estados límite.
- FR-50: El usuario puede previsualizar y adjuntar una imagen a un gasto; la API la conserva como datos binarios privados sin base64 de almacenamiento.
- FR-51: El usuario puede extraer datos útiles de un recibo mediante OCR, revisar el resultado y continuar manualmente si falla.
- FR-52: Todo campo editable muestra etiqueta persistente, propósito, estado, validación y mensaje de error comprensible.
- FR-53: Cada sección y acción visible de Plan permite consultar o modificar su dato real, o comunica por qué no está disponible.
- FR-54: La navegación, el scroll y las expansiones usan movimiento coherente, cancelable y compatible con reducción de movimiento.
- FR-55: El perfil permite administrar datos personales, moneda mediante selector y preferencias relevantes.
- FR-56: El registro requiere aceptación explícita y versionada de Términos de uso y Política de privacidad accesibles.
- FR-57: Una cuenta nueva debe confirmar su correo mediante un enlace seguro, expirable y reenviable.
- FR-58: El usuario puede activar biometría opcional para recuperar localmente una sesión previamente autenticada.
- FR-59: Splash, wordmark, icono y miniatura del dispositivo usan una misma identidad SmartAnt/SMA y activos coherentes.
- FR-60: Inicio y Perfil muestran de forma inequívoca el journey, siguiente reto, XP, nivel, racha y avance cuando estén habilitados.
- FR-61: Todo control interactivo ofrece una reacción visible y accesible y evita acciones aparentes sin comportamiento.
- FR-62: El perfil permite consultar controles de privacidad, seguridad, sesiones y eliminación o exportación de cuenta cuando estén implementados.

### Requisitos no funcionales

- NFR-1: Contraseñas con hash robusto; tokens y secretos mediante variables de entorno.
- NFR-2: Fotografías y datos financieros pertenecen exclusivamente al usuario autenticado.
- NFR-3: API y aplicación validan entradas en límites de confianza.
- NFR-4: El resumen responde en menos de 500 ms en local con 10 000 movimientos por usuario.
- NFR-5: Mutaciones financieras relacionadas usan transacciones.
- NFR-6: Controles con etiquetas, contraste suficiente y áreas táctiles apropiadas.
- NFR-7: Errores backend incluyen `requestId` sin exponer datos privados.
- NFR-8: TypeScript estricto, sin `any`, Biome y pruebas unitarias financieras.
- NFR-9: La gamificación no recompensa gastar más, endeudarse ni el nivel absoluto de ingreso.
- NFR-10: Toda recompensa explica su origen, condiciones, estado y si posee o no valor monetario.
- NFR-11: El motor usa la cantidad mínima de datos personales necesaria y conserva el aislamiento por usuario.
- NFR-12: Rachas, celebraciones y progreso cumplen reducción de movimiento, lector de pantalla y alternativas no cromáticas.
- NFR-13: Los eventos que otorgan progreso son idempotentes y auditables para evitar duplicación o fraude.
- NFR-14: Las reglas de rewards son deterministas y versionadas para poder explicar resultados históricos.
- NFR-15: Calcular el siguiente reto y el resumen de progreso no degrada perceptiblemente la carga normal de Inicio.
- NFR-16: Las imágenes de recibos usan bytes privados, límite de tamaño, tipo validado, autorización por propietario y una política explícita de retención.
- NFR-17: Las animaciones mantienen interacción fluida y respetan la preferencia del sistema de reducir movimiento.
- NFR-18: Formularios y controles cumplen etiquetas accesibles, foco, contraste, tamaño táctil y mensajes no dependientes del color.
- NFR-19: Consentimientos legales registran versión, fecha y usuario y los textos quedan sujetos a revisión legal costarricense antes de producción.
- NFR-20: Verificación de correo usa tokens de un solo uso almacenados de forma no reversible, expiración y respuestas que no permiten enumerar cuentas.

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
- AR-18: El dominio de motivación consume eventos verificados de funcionalidades existentes sin duplicar reglas financieras.
- AR-19: El otorgamiento y reclamación de rewards usa un ledger persistente e idempotente por usuario, evento y regla.
- AR-20: Las reglas de retos, XP y logros tienen identificador y versión; no se dispersan como constantes de UI.
- AR-21: XP, puntos virtuales, ahorro demostrado y beneficios reales usan tipos y presentación separados.
- AR-22: Beneficios locales, cashback y canjes permanecen desactivados mediante feature flag hasta existir soporte operativo y legal.
- AR-23: La primera versión del recomendador usa reglas simples y explicables; no requiere ML, colas ni servicios adicionales.
- AR-24: El entorno demo se prepara con un seed idempotente de datos realistas que nunca se ejecuta para usuarios reales.

### Requisitos UX

- UX-DR1: Navegación primaria con Inicio, Movimientos, Añadir, Plan y Perfil.
- UX-DR2: Usar exclusivamente iconos Lucide; no usar iconos Unicode.
- UX-DR3: Una sola marca tipográfica `SmartAntWordmark` se reutiliza en splash e interior.
- UX-DR4: El splash muestra únicamente `SmartAntWordmark` con animación breve y sutil.
- UX-DR5: La animación del splash se desactiva o reduce según la preferencia del sistema.
- UX-DR6: Toda superficie asíncrona define carga, vacío, error, éxito y estado deshabilitado.
- UX-DR7: Las confirmaciones riesgosas requieren una segunda acción explícita.
- UX-DR8: El diseño debe funcionar en Expo Go y cumplir accesibilidad móvil básica.
- UX-DR9: Inicio muestra progreso financiero y un solo siguiente reto prioritario sin desplazar el resumen monetario principal.
- UX-DR10: Cada reto muestra acción, razón, duración, criterio de finalización, progreso y reward.
- UX-DR11: XP, nivel, racha, insignia, ahorro real y beneficio monetario nunca comparten una representación ambigua.
- UX-DR12: Logros y rewards contemplan estados bloqueado, disponible, activo, completado, expirado, reclamable y reclamado.
- UX-DR13: Perder una racha usa lenguaje neutral y ofrece recuperación; no utiliza culpa ni patrones manipulativos.
- UX-DR14: Las celebraciones son breves, interrumpibles y compatibles con reducción de movimiento.
- UX-DR15: El usuario puede entender por qué se recomendó un reto y cambiarlo u omitirlo.
- UX-DR16: Microlecciones duran aproximadamente un minuto y conectan el concepto con una acción aplicable.
- UX-DR17: El recap semanal prioriza impacto financiero real sobre puntos virtuales.
- UX-DR18: El design system incluye componentes y estados para journey, retos, progreso, rewards, lecciones y beneficios locales.
- UX-DR19: Añadir gasto ofrece por separado captura manual, escaneo para prellenar y adjunto opcional de imagen.

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
- FR-34: Epic 8 - Etapa financiera y siguiente acción recomendada.
- FR-35: Epic 8 - Activación, cambio u omisión de retos transparentes.
- FR-36: Epic 8 - Progreso basado en acciones verificables.
- FR-37: Epic 8 - XP, nivel, racha, insignias y logros.
- FR-38: Epic 8 - Recuperación flexible de racha.
- FR-39: Epic 8 - Microlecciones y quizzes contextuales.
- FR-40: Epic 8 - Recap semanal con impacto financiero.
- FR-41: Epic 8 - Historial y explicación de rewards.
- FR-42: Epic 8 - Preferencias de gamificación y movimiento.
- FR-43: Epic 8 - Recomendación explicable y no repetitiva de retos.
- FR-44: Epic 8 - Separación entre progreso virtual, ahorro y valor real.
- FR-45: Epic 9 - Beneficios locales verificados y reclamables.
- FR-46: Epic 5 - Imagen de recibo opcional para gastos manuales o detectados.
- FR-47: Epic 5 - Consulta y eliminación independiente del adjunto.
- FR-48 a FR-54: Epic 10 - Periodos, demo, captura, formularios, Plan y movimiento.
- FR-55 a FR-59: Epic 11 - Perfil, consentimiento, correo, biometría e identidad.
- FR-60: Epic 10 - Journey de gamificación visible.
- FR-61: Epic 10 - Reacción de controles interactivos.
- FR-62: Epic 11 - Privacidad y seguridad de cuenta.

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

**FR cubiertos:** FR-12, FR-13, FR-14, FR-15, FR-46, FR-47.

### Epic 6: Importación masiva

El usuario puede importar CSV/XLSX, asignar columnas, corregir problemas y confirmar movimientos sin duplicados silenciosos.

**FR cubiertos:** FR-16, FR-17, FR-18, FR-19, FR-20.

### Epic 7: Preparación para producción

El producto queda verificable y desplegable en Railway con configuración segura, migraciones, CI y observabilidad.

**FR cubiertos:** ninguno; realiza NFR-1 a NFR-8 y AR-13 a AR-15.

### Epic 8: Progreso financiero guiado

El usuario puede convertir acciones financieras y educativas verificables en un journey adaptativo con retos, microlecciones, XP, niveles, rachas flexibles, logros y recaps que muestran progreso real sin recurrir a patrones manipulativos.

**FR cubiertos:** FR-34, FR-35, FR-36, FR-37, FR-38, FR-39, FR-40, FR-41, FR-42, FR-43, FR-44.

### Epic 9: Beneficios financieros locales

El usuario puede consultar y reclamar beneficios reales de comercios aliados cuando existan acuerdos verificados, con condiciones transparentes, trazabilidad y controles contra duplicación o fraude.

**FR cubiertos:** FR-45.

### Epic 10: Experiencia financiera completa y expresiva

El usuario entiende y controla sus finanzas desde una interfaz consistente, accesible, animada con moderación y sin controles ambiguos.

**FR cubiertos:** FR-48, FR-49, FR-50, FR-51, FR-52, FR-53, FR-54, FR-60, FR-61.

### Epic 11: Identidad, cuenta y confianza

El usuario reconoce una identidad consistente y administra acceso, preferencias, consentimiento y seguridad.

**FR cubiertos:** FR-55, FR-56, FR-57, FR-58, FR-59, FR-62.

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

### Story 5.4: Adjuntar una imagen opcional al gasto

**Requisitos:** FR-46, FR-47, NFR-2, NFR-16, UX-DR19.

Como usuario,
quiero adjuntar opcionalmente una imagen de recibo a un gasto,
para conservar evidencia aunque prefiera llenar el formulario manualmente.

**Criterios de aceptación:**

**Dado** el formulario de gasto manual
**cuando** el usuario decide no escanear un recibo
**entonces** puede completar y confirmar el gasto sin imagen
**y** también puede adjuntar una imagen como dato opcional.

**Dado** una imagen elegida para OCR
**cuando** se detectan campos completos o parciales
**entonces** el formulario se prellena y permanece editable antes de confirmar
**y** la imagen puede conservarse como adjunto si el usuario lo elige.

**Dado** que OCR falla o no se solicita
**cuando** el usuario continúa
**entonces** puede llenar monto, fecha, descripción y categoría manualmente
**y** la imagen opcional no bloquea ni sustituye la validación del gasto.

**Dado** un gasto con imagen adjunta
**cuando** el usuario consulta o elimina el adjunto
**entonces** solo el propietario puede acceder a la imagen
**y** eliminarla no borra el gasto ni altera cálculos financieros.

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

### Story 7.4: Preparar datos realistas para la cuenta demo

**Requisitos:** AR-24.

Como responsable de revisión,
quiero una cuenta demo con datos financieros realistas,
para recorrer, editar y ampliar todas las funciones sin configuración manual inicial.

**Criterios de aceptación:**

**Dado** la cuenta demo conocida
**cuando** se ejecuta el seed
**entonces** existen perfil, ingresos, salario, gastos, categorías, presupuestos y metas representativos
**y** los datos cubren estados activos, pausados, cercanos al límite y vacíos cuando sea útil.

**Dado** que el seed se ejecuta varias veces
**cuando** termina
**entonces** no duplica registros ni cambia identificadores de referencia innecesariamente
**y** restaura credenciales demo válidas.

**Dado** la cuenta demo preparada
**cuando** el revisor usa la app
**entonces** puede consultar, editar, eliminar y agregar datos
**y** ninguna operación afecta cuentas reales.

## Epic 8: Progreso financiero guiado

El usuario convierte acciones financieras y educativas verificables en un journey adaptativo con retos, microlecciones, XP, niveles, rachas flexibles, logros y recaps, sin patrones manipulativos.

### Story 8.1: Investigar patrones de motivación financiera

**Requisitos:** FR-34 a FR-44, NFR-9 a NFR-15, UX-DR9 a UX-DR18.

Como responsable de producto,
quiero una investigación trazable sobre gamificación, hábitos y ahorro,
para adoptar patrones eficaces sin copiar interfaces ni introducir mecánicas perjudiciales.

**Criterios de aceptación:**

**Dado** que no existe una estrategia validada de rewards
**cuando** se investigan fuentes oficiales, académicas y productos como Duolingo y Candy Crush
**entonces** se documentan patrones aplicables, evidencia, límites y riesgos con fuentes directas
**y** se distingue evidencia experimental, correlación e inferencia.

**Dado** el contexto de San Ramón
**cuando** se sintetizan los hallazgos
**entonces** se generan hipótesis verificables para retos, microlecciones, recibos y beneficios locales
**y** no se presentan cashback o alianzas como funciones disponibles.

### Story 8.2: Definir el contrato del journey y rewards

**Requisitos:** FR-36, FR-41, FR-44, NFR-10, NFR-13, NFR-14, AR-18 a AR-21.

Como usuario,
quiero que mi progreso tenga reglas claras y consistentes,
para confiar en lo que significa cada reto, punto, nivel o recompensa.

**Criterios de aceptación:**

**Dado** las acciones financieras actuales
**cuando** se define el dominio de motivación
**entonces** existen contratos versionados para journey, reto, evento, reward, perfil y ledger
**y** no se duplican las reglas financieras existentes.

**Dado** un evento repetido por reintento
**cuando** se procesa
**entonces** no duplica progreso ni rewards
**y** XP, puntos, ahorro demostrado y valor real permanecen separados y auditables.

### Story 8.3: Recibir un siguiente reto adaptativo

**Requisitos:** FR-34, FR-35, FR-43, AR-23, UX-DR9, UX-DR10, UX-DR15.

Como usuario,
quiero recibir una acción pequeña y relevante para mi situación,
para saber qué hacer después para mejorar mi salud financiera.

**Criterios de aceptación:**

**Dado** el onboarding, datos, metas y actividad disponibles
**cuando** se solicita el siguiente reto
**entonces** reglas simples y explicables eligen una acción elegible y no repetitiva
**y** nunca inventan información financiera.

**Dado** un reto recomendado
**cuando** se consulta
**entonces** muestra acción, razón, duración, objetivo, progreso y reward
**y** el usuario puede activarlo, cambiarlo u omitirlo.

### Story 8.4: Obtener XP, niveles, rachas y logros

**Requisitos:** FR-36, FR-37, FR-38, FR-41, NFR-9, NFR-13, UX-DR11 a UX-DR13.

Como usuario,
quiero reconocimiento por mantener hábitos financieros útiles,
para percibir continuidad sin sentir castigo cuando interrumpo el uso.

**Criterios de aceptación:**

**Dado** una acción elegible verificada
**cuando** se completa
**entonces** el progreso se registra una sola vez y explica su origen
**y** el perfil muestra XP, nivel, próxima meta, racha y logros.

**Dado** una interrupción de racha
**cuando** el usuario regresa
**entonces** conserva XP, nivel y logros
**y** puede recuperar la racha con lenguaje neutral cuando aplique.

### Story 8.5: Completar microlecciones contextuales

**Requisitos:** FR-39, NFR-11, UX-DR16.

Como usuario,
quiero aprender un concepto financiero en aproximadamente un minuto,
para aplicarlo a una decisión real.

**Criterios de aceptación:**

**Dado** una necesidad contextual
**cuando** se recomienda una microlección
**entonces** se explica su relevancia usando el mínimo de datos personales
**y** se distingue educación general de asesoría personalizada.

**Dado** una lección activa
**cuando** se completa o abandona
**entonces** el quiz explica las respuestas y registra progreso idempotente
**y** abandonar nunca bloquea funciones financieras.

### Story 8.6: Consultar el recap financiero semanal

**Requisitos:** FR-40, FR-44, UX-DR17.

Como usuario,
quiero entender qué logré durante la semana,
para relacionar mis hábitos con resultados financieros concretos.

**Criterios de aceptación:**

**Dado** una semana con datos suficientes
**cuando** se genera el recap
**entonces** muestra acciones, evolución, ahorro demostrado y retos relevantes
**y** diferencia resultados monetarios de XP o insignias.

**Dado** una semana sin datos suficientes
**cuando** se abre el recap
**entonces** muestra un estado honesto y una siguiente acción alcanzable
**y** no interpreta ausencia de datos como ahorro.

### Story 8.7: Controlar la experiencia de gamificación

**Requisitos:** FR-42, NFR-12, UX-DR13, UX-DR14.

Como usuario,
quiero ajustar retos, frecuencia y animaciones,
para adaptar la motivación a mis preferencias y accesibilidad.

**Criterios de aceptación:**

**Dado** las preferencias de gamificación
**cuando** se modifican
**entonces** persisten por usuario y controlan frecuencia, animación y presencia de retos
**y** desactivarlas no elimina progreso ni funciones financieras.

**Dado** reducción de movimiento o lector de pantalla
**cuando** aparece una celebración
**entonces** existe una alternativa estática y anunciable
**y** su significado no depende únicamente del color.

### Story 8.8: Diseñar las superficies de motivación

**Requisitos:** FR-34 a FR-44, UX-DR9 a UX-DR18.

Como usuario,
quiero una experiencia coherente para retos y progreso,
para entenderla sin confundir rewards con dinero.

**Criterios de aceptación:**

**Dado** el design system aprobado
**cuando** se especifican superficies de motivación
**entonces** cubre journey, reto, progreso, XP, nivel, racha, logro, lección, recap y celebración
**y** documenta todos sus estados interactivos y asíncronos.

**Dado** las features actuales y futuras
**cuando** se aplica el diseño
**entonces** se preservan datos, acciones y flujos existentes
**y** no se representa como disponible ninguna funcionalidad futura.

### Story 8.9: Medir motivación sin patrones manipulativos

**Requisitos:** NFR-9 a NFR-15.

Como responsable de producto,
quiero medir si la motivación mejora hábitos reales,
para retirar mecánicas que solo aumentan uso vacío.

**Criterios de aceptación:**

**Dado** una feature motivacional
**cuando** se define su medición
**entonces** prioriza activación útil, constancia, presupuestos, metas y ahorro demostrado
**y** no considera más gasto, deuda o tiempo vacío como éxito.

**Dado** un experimento
**cuando** se activa
**entonces** posee hipótesis, métrica primaria, guardrails, duración y criterio de salida
**y** puede desactivarse sin afectar datos financieros.

## Epic 9: Beneficios financieros locales

El usuario puede consultar y reclamar beneficios reales de comercios aliados cuando existan acuerdos verificados, con condiciones transparentes, trazabilidad y controles contra duplicación o fraude.

### Story 9.1: Validar el modelo de beneficios locales

**Requisitos:** FR-45, NFR-10, NFR-13, AR-22.

Como responsable de producto,
quiero validar las reglas operativas de beneficios locales,
para no ofrecer recompensas que el producto o el comercio no puedan cumplir.

**Criterios de aceptación:**

**Dado** un beneficio propuesto
**cuando** se evalúa para publicación
**entonces** tiene comercio responsable, tipo, valor, elegibilidad, vigencia, límites y proceso de soporte
**y** existe un acuerdo confirmado y trazable.

**Dado** que faltan condiciones legales, operativas o antifraude
**cuando** se revisa el beneficio
**entonces** permanece desactivado
**y** no aparece en la aplicación ni en comunicaciones al usuario.

### Story 9.2: Consultar beneficios disponibles

**Requisitos:** FR-45, NFR-10, NFR-11, AR-21, AR-22.

Como usuario,
quiero consultar beneficios locales realmente disponibles,
para entender qué puedo obtener y bajo cuáles condiciones.

**Criterios de aceptación:**

**Dado** beneficios activos y elegibles
**cuando** se abre el catálogo
**entonces** se muestran comercio, tipo, valor, costo, condiciones, vigencia y disponibilidad
**y** se pueden distinguir descuento, cashback y reward virtual.

**Dado** un beneficio inactivo, vencido o no elegible
**cuando** se consulta el catálogo
**entonces** no se presenta como reclamable
**y** cualquier estado visible explica la razón sin revelar reglas antifraude sensibles.

### Story 9.3: Reclamar un beneficio

**Requisitos:** FR-45, NFR-13, NFR-14, AR-19, AR-21, AR-22.

Como usuario,
quiero reclamar un beneficio de forma segura,
para recibir exactamente lo ofrecido sin cobros o descuentos ambiguos.

**Criterios de aceptación:**

**Dado** un beneficio elegible y disponible
**cuando** el usuario confirma el reclamo
**entonces** se registra una sola operación en el ledger y se entrega una referencia verificable
**y** la respuesta explica el valor, condiciones y siguiente paso.

**Dado** un reintento, saldo insuficiente, límite alcanzado o beneficio vencido
**cuando** se procesa el reclamo
**entonces** no se duplica ni deja un estado parcial
**y** el usuario recibe un error seguro y accionable.

### Story 9.4: Consultar historial y resolver incidencias

**Requisitos:** FR-45, NFR-10, NFR-11, NFR-13.

Como usuario,
quiero consultar el historial de mis beneficios,
para verificar qué gané, reclamé, utilicé, venció o fue revertido.

**Criterios de aceptación:**

**Dado** operaciones de beneficios existentes
**cuando** se abre el historial
**entonces** cada entrada muestra estado, fecha, comercio, valor y referencia
**y** los estados ganado, reclamado, usado, vencido y revertido son inequívocos.

**Dado** una incidencia
**cuando** el usuario solicita ayuda
**entonces** puede compartir una referencia sin exponer secretos ni datos financieros innecesarios
**y** una reversión conserva el historial auditable.

## Epic 10: Experiencia financiera completa y expresiva

El usuario entiende y controla sus finanzas desde una interfaz consistente, accesible, animada con moderación y sin controles decorativos o ambiguos.

### Story 10.1: Completar la experiencia demo y presupuestos

**Requisitos:** FR-49, FR-53, NFR-18.

Como evaluador, quiero datos demo variados y presupuestos visibles, para recorrer Plan e Inicio sin configuración manual.

**Criterios de aceptación:**

**Dado** el usuario demo **cuando** inicia sesión después del seed **entonces** ve varios meses de ingresos, gastos y presupuestos por Comida, Ocio, Transporte y categorías adicionales **y** existen estados saludables, cercanos al límite y excedidos.

**Dado** que el seed se ejecuta otra vez **cuando** finaliza **entonces** conserva identificadores estables y no duplica datos.

### Story 10.2: Corregir captura visual y OCR de recibos

**Requisitos:** FR-46, FR-47, FR-50, FR-51, FR-52, NFR-16, NFR-18.

Como usuario, quiero ver la imagen del recibo y obtener datos editables, para guardar un gasto con OCR o completarlo manualmente.

**Criterios de aceptación:**

**Dado** una imagen JPEG o PNG válida **cuando** se selecciona **entonces** aparece una previsualización removible **y** Importe, Fecha, Comercio y Categoría muestran etiquetas, ejemplos y errores.

**Dado** que se solicita lectura **cuando** OCR encuentra texto **entonces** propone valores con confianza sin confirmar el gasto automáticamente.

**Dado** OCR ausente o fallido **cuando** termina **entonces** la imagen permanece disponible y el formulario manual sigue funcionando.

**Dado** un gasto confirmado con imagen **cuando** la API lo guarda **entonces** persiste bytes binarios privados asociados al propietario, no base64, **y** permite leer o eliminar el adjunto con autorización.

### Story 10.3: Estandarizar formularios y espaciado

**Requisitos:** FR-52, FR-61, NFR-18.

Como usuario, quiero controles claros y separaciones consistentes, para completar tareas sin adivinar el propósito de un campo.

**Criterios de aceptación:**

**Dado** cualquier formulario **cuando** muestra un input, selector o checkbox **entonces** tiene etiqueta visible, placeholder útil, ayuda cuando aplica y error asociado **y** el teclado no cubre el control activo ni la acción principal.

**Dado** Movimientos y las demás listas **cuando** se renderizan **entonces** respetan safe areas, escala común de padding y blancos consistentes.

### Story 10.4: Hacer Plan completamente interactivo

**Requisitos:** FR-53, FR-61, NFR-18.

Como usuario, quiero administrar cada parte de mi plan, para cambiar ingresos, salario, presupuestos y metas desde una sola superficie.

**Criterios de aceptación:**

**Dado** Plan **cuando** se expande una sección **entonces** un acordeón muestra resumen y controles reales de crear, editar, pausar o eliminar según corresponda.

**Dado** un importe ajustable **cuando** se usa slider o campo numérico **entonces** ambos permanecen sincronizados, accesibles y validados.

**Dado** cualquier botón visible **cuando** se pulsa **entonces** produce navegación, cambio de estado, confirmación, error o explicación perceptible.

### Story 10.5: Añadir periodos y movimiento de interfaz

**Requisitos:** FR-48, FR-54, FR-61, NFR-17, NFR-18.

Como usuario, quiero alternar Día, Semana y Mes con transiciones útiles, para comprender cómo cambia mi situación sin perder contexto.

**Criterios de aceptación:**

**Dado** Inicio **cuando** se selecciona Día, Semana o Mes **entonces** resumen, categorías y movimientos presentan exactamente ese periodo **y** el selector anuncia selección y carga.

**Dado** navegación, scroll, acordeones o cambios de datos **cuando** ocurre una transición **entonces** usa animaciones breves que explican continuidad y no bloquean interacción.

**Dado** reducción de movimiento activa **cuando** se usa la app **entonces** las transformaciones se sustituyen por cambios discretos sin perder información.

### Story 10.6: Exponer gamificación como journey

**Requisitos:** FR-60, FR-34 a FR-44, NFR-9 a NFR-15.

Como usuario, quiero ver claramente mi siguiente reto y progreso, para saber qué acción financiera útil tomar hoy.

**Criterios de aceptación:**

**Dado** un usuario con progreso **cuando** abre Inicio **entonces** ve siguiente reto, motivo, progreso y recompensa junto con nivel, XP y racha **y** distingue puntos virtuales de dinero real.

**Dado** que el backend motivacional no está habilitado **cuando** se muestra una superficie futura **entonces** usa un estado demo o “Próximamente” inequívoco y no simula rewards reclamables.

## Epic 11: Identidad, cuenta y confianza

El usuario reconoce una identidad consistente y administra acceso, preferencias, consentimiento y seguridad con controles comprensibles.

### Story 11.1: Unificar splash, wordmark e iconos

**Requisitos:** FR-59, NFR-18.

Como usuario, quiero reconocer SmartAnt antes y después de abrir la app, para confiar en que splash, icono y producto pertenecen a la misma identidad.

**Criterios de aceptación:**

**Dado** los activos aprobados **cuando** se genera Android **entonces** splash, icono adaptativo, miniatura, favicon y wordmark usan la misma geometría SMA/SmartAnt, proporciones y dos tonos **y** no quedan activos de Expo.

**Dado** diferentes máscaras Android **cuando** el launcher recorta el icono **entonces** el símbolo conserva zona segura y legibilidad.

### Story 11.2: Ampliar perfil y preferencias

**Requisitos:** FR-55, FR-62, NFR-18.

Como usuario, quiero administrar identidad y preferencias, para adaptar SmartAnt sin editar valores técnicos.

**Criterios de aceptación:**

**Dado** Perfil **cuando** se consulta **entonces** agrupa datos personales, localización, moneda, notificaciones, gamificación, seguridad, privacidad y soporte.

**Dado** Moneda **cuando** se modifica **entonces** usa un selector de opciones soportadas y nunca un input libre.

**Dado** una acción sensible o no implementada **cuando** se pulsa **entonces** solicita confirmación o comunica disponibilidad; nunca queda inerte.

### Story 11.3: Publicar y aceptar documentos legales

**Requisitos:** FR-56, FR-62, NFR-19.

Como usuario, quiero leer y aceptar los documentos aplicables, para conocer cómo funciona el servicio y cómo trata mis datos.

**Criterios de aceptación:**

**Dado** el registro **cuando** no se aceptan Términos y Privacidad mediante checkbox no preseleccionado **entonces** no se crea la cuenta y ambos documentos se pueden abrir.

**Dado** una aceptación válida **cuando** se registra **entonces** conserva versión y fecha del consentimiento de forma auditable.

**Dado** Perfil **cuando** se abre Legal y privacidad **entonces** muestra los textos y controles vigentes **y** los borradores indican revisión legal pendiente antes de producción.

### Story 11.4: Confirmar correo de cuentas nuevas

**Requisitos:** FR-57, NFR-20.

Como usuario, quiero confirmar que controlo mi correo, para proteger mi cuenta y recuperar acceso con seguridad.

**Criterios de aceptación:**

**Dado** un registro válido **cuando** se crea la cuenta **entonces** envía un enlace de un solo uso con expiración y muestra estado pendiente.

**Dado** un enlace válido, usado o vencido **cuando** se abre **entonces** confirma una sola vez o permite solicitar otro sin enumerar cuentas.

**Dado** que no hay proveedor de correo **cuando** inicia producción **entonces** falla explícitamente o deshabilita registro; nunca finge el envío.

### Story 11.5: Activar desbloqueo biométrico opcional

**Requisitos:** FR-58, NFR-18.

Como usuario, quiero desbloquear una sesión existente con biometría, para entrar con menos fricción sin reemplazar credenciales del servidor.

**Criterios de aceptación:**

**Dado** dispositivo compatible y sesión válida **cuando** se activa biometría explícitamente **entonces** el secreto queda en almacenamiento seguro y cada desbloqueo solicita autenticación local.

**Dado** biometría cancelada, bloqueada o no disponible **cuando** se intenta entrar **entonces** ofrece credenciales normales sin bloquear la cuenta.

**Dado** cerrar sesión **cuando** termina **entonces** revoca la sesión remota y elimina el acceso biométrico local.
