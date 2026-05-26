# HISTORIAS DE USUARIO (USER STORIES) PARA DESARROLLO
## Sistema de Gestión de Contratos, Tareas y Evidencias (SIISWEB Contratos)

Este documento contiene la especificación de **Historias de Usuario (US)** en formato ágil para guiar el desarrollo de la nueva aplicación relacional basada en **PostgreSQL**. Cada historia de usuario incluye su descripción formal, criterios de aceptación estructurados en formato **Gherkin** y consideraciones técnicas para el equipo de desarrollo.

---

## ÉPICA 1: AUTENTICACIÓN Y APROVISIONAMIENTO DE AGENTES

### US-01: Aprovisionamiento de Administradores y Supervisores
**Como** Administrador del Sistema  
**Quiero** crear y configurar cuentas de Supervisores en la plataforma  
**Para** delegar la supervisión y administración de contratos a los jefes de área correspondientes.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** estoy autenticado con el rol de `admin` e ingreso al módulo de "Gestión de Usuarios",
    *   **Cuando** completo el formulario de registro con nombres, apellidos, un correo único, documento único, selecciono el rol de `'supervisor'`, indico su entidad/secretaría y le asigno una contraseña de alta complejidad,
    *   **Entonces** el sistema valida que el correo y número de documento no existan previamente en la tabla `usuarios`, aplica un hash criptográfico **bcrypt (costo >= 12)** a la contraseña y registra al usuario en estado `'activo'`.
    *   **Dado que** estoy completando el formulario de registro,
    *   **Cuando** ingreso una contraseña de menos de 8 caracteres o sin combinación de mayúsculas, minúsculas, números y caracteres especiales,
    *   **Entonces** el sistema rechaza la creación e indica que la contraseña no cumple con las políticas de complejidad requeridas.

*   **Detalle Técnico:** 
    *   **Tabla afectada:** `usuarios`.
    *   **Seguridad:** Las API correspondientes deben validar que la cabecera JWT contenga el rol `'admin'`. Se implementa Hashing Bcrypt nativo en el backend.

---

### US-02: Registro de Contratistas con Sincronización Externa
**Como** Supervisor o Administrador  
**Quiero** registrar a un nuevo contratista en el sistema local y sincronizarlo con la central de credenciales  
**Para** proveerle acceso automatizado a la plataforma y asignarle contratos vigentes.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** estoy autenticado como `supervisor` o `admin`,
    *   **Cuando** ingreso los datos obligatorios del contratista (nombres, apellidos, número de documento, tipo de documento, email, dirección y geolocalización) y guardo el formulario,
    *   **Entonces** el sistema abre una transacción en PostgreSQL, inserta el contratista en la tabla `contratistas` con el flag `contrato_vigente = false`, y envía de manera síncrona una petición POST a la API central `https://siisweb.com:4020/users/save/` con el documento como nick y contraseña por defecto.
    *   **Dado que** la inserción local en PostgreSQL es exitosa pero la petición HTTP a la API externa central de SIISWEB falla (caída de red o error de servidor externo),
    *   **Cuando** el backend detecta el fallo del servicio externo,
    *   **Entonces** realiza un **Rollback** automático en la base de datos de PostgreSQL para no dejar el contratista en un estado local inconsistente, y retorna un error informando que falló la sincronización externa.
    *   **Dado que** el registro local y la sincronización central se completaron exitosamente,
    *   **Cuando** finaliza la transacción en PostgreSQL,
    *   **Entonces** el sistema envía un correo electrónico formal (vía Nodemailer y SMTP cargado desde `.env`) al contratista con el enlace a la plataforma, informando sus credenciales iniciales (número de documento) y exigiéndole cambiar la clave en el primer inicio de sesión.

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `contratistas`.
    *   **Transaccionalidad:** El backend debe envolver la inserción de base de datos y la llamada de API en un bloque transaccional controlado para ejecutar rollback si la API externa falla.

---

### US-03: Inicio de Sesión Seguro y Control de Fuerza Bruta
**Como** Usuario del Sistema (Admin, Supervisor o Contratista)  
**Quiero** autenticarme en la plataforma ingresando mis credenciales  
**Para** acceder a los paneles y módulos que corresponden a mi rol de manera segura.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** estoy en la pantalla de Login del sistema y la cuenta no está bloqueada,
    *   **Cuando** ingreso mi usuario y contraseña válidos,
    *   **Entonces** el sistema genera un Token JWT (JSON Web Token) firmado con el secreto `'siellano'` (obtenido de `.env`), lo retorna en la respuesta de la API y me redirige a mi panel de control.
    *   **Dado que** intento ingresar con credenciales erróneas,
    *   **Cuando** la validación de la contraseña falla,
    *   **Entonces** el sistema incrementa el contador de intentos fallidos para mi cuenta.
    *   **Dado que** he ingresado una contraseña incorrecta en **5 intentos consecutivos**,
    *   **Cuando** realizo el quinto intento fallido,
    *   **Entonces** el sistema bloquea temporalmente mi cuenta cambiando su estado a inactivo o bloqueado durante 30 minutos, notificándome que debo esperar o solicitar el desbloqueo a un administrador.

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `usuarios` / `contratistas`.
    *   **Seguridad:** Migración opcional de autenticación híbrida: Validar primero contra hash bcrypt; si falla, verificar si coincide con el hash HMAC-SHA256 legado y, si es correcto, actualizar el registro en base de datos al nuevo hash bcrypt automáticamente.

---

### US-04: Actualización Obligatoria de Contraseña (Primer Ingreso)
**Como** Contratista recién creado  
**Quiero** cambiar mi contraseña temporal en mi primer inicio de sesión  
**Para** garantizar la privacidad de mis datos y habilitar el uso general de la plataforma.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** he iniciado sesión por primera vez con mis credenciales temporales generadas de forma automática (mi número de documento),
    *   **Cuando** intento navegar a cualquier pantalla (ej. Visor de Tareas, Informe),
    *   **Entonces** el sistema detecta que no he modificado mi contraseña inicial, bloquea las pantallas operativas y me redirige forzosamente al formulario "Cambiar Contraseña".
    *   **Dado que** estoy en el formulario de cambio de contraseña,
    *   **Cuando** ingreso una contraseña que no cumple con el nivel de complejidad o que es idéntica a mi número de documento (clave antigua),
    *   **Entonces** el sistema muestra un mensaje de error y me obliga a registrar una clave nueva y robusta.

*   **Detalle Técnico:** 
    *   Se requiere una bandera o flag en la tabla de usuarios/contratistas (ej. `primer_ingreso` BOOLEAN DEFAULT true). Al cambiar la contraseña por primera vez, este flag pasa a `false`.

---

## ÉPICA 2: GESTIÓN DE CONTRATOS Y PERIODOS

### US-05: Creación y Activación de Contrato con Validación de Vigencia Única
**Como** Supervisor  
**Quiero** crear un nuevo contrato para un contratista activo, distribuyendo su presupuesto y validando que no tenga otros contratos vigentes  
**Para** formalizar legal y financieramente la relación contractual sin incurrir en duplicaciones.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** estoy autenticado como `supervisor`,
    *   **Cuando** ingreso los datos del nuevo contrato (número único, año, supervisor responsable, fechas de inicio y fin, presupuesto, número de periodos y objetivos),
    *   **Entonces** el sistema ejecuta una consulta en PostgreSQL para asegurar que el contratista no tenga ningún otro contrato con `vigente = true`.
    *   **Dado que** la consulta de vigencia única retorna que el contratista ya cuenta con un contrato activo,
    *   **Cuando** intento guardar el nuevo contrato,
    *   **Entonces** el sistema detiene la transacción, deniega el guardado e informa: *"El contratista ya posee un contrato activo y vigente. Cierre el contrato actual antes de iniciar uno nuevo."*
    *   **Dado que** el contratista no posee contratos activos y el rango de fechas es lógico (periodo_inicio <= periodo_fin),
    *   **Cuando** confirmo la creación del contrato,
    *   **Entonces** el sistema abre una transacción, inserta el contrato en estado `'vigente'`, actualiza el contratista colocando `contratistas.contrato_vigente = true` y persiste los objetivos del contrato de manera normalizada.

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `contratos`, `objetivos_contrato`, `contratistas`.
    *   **Transaccionalidad:** Se debe asegurar consistencia transaccional usando sentencias preparadas de SQL de exclusión o comprobaciones atómicas en la base de datos.

---

### US-06: Distribución Equitativa y Validación Presupuestaria de Periodos
**Como** Supervisor  
**Quiero** establecer el calendario de periodos (facturas/entregas) y definir el valor presupuestado de cada uno  
**Para** asegurar que la sumatoria de los periodos sea equivalente de manera exacta al valor asignado al contrato.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** estoy registrando o editando los periodos asociados a un contrato,
    *   **Cuando** el sistema calcula la división automática del presupuesto (`valor_para_periodos / numero_periodo`) o cuando digito de manera manual el valor de cada periodo,
    *   **Entonces** el sistema valida que la sumatoria del campo `valor` de todos los periodos registrados para dicho contrato sea exactamente igual al campo `valor_para_periodos` del contrato.
    *   **Dado que** la sumatoria de los valores de los periodos es menor o mayor al presupuesto establecido del contrato,
    *   **Cuando** intento guardar la distribución o activar el contrato,
    *   **Entonces** el sistema aborta la transacción, rechaza el registro y muestra un mensaje informando el desbalance en la distribución del presupuesto de los periodos.

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `periodos`, `contratos`.
    *   **Validación:** Se puede implementar un Trigger a nivel de fila o una restricción de validación en la capa lógica del backend bajo una transacción que sume los periodos antes de consolidar.

---

### US-07: Configuración de Catálogos Geográficos Relacionales
**Como** Desarrollador  
**Quiero** migrar los catálogos geográficos del frontend (ficheros JSON locales) a tablas estructuradas en PostgreSQL  
**Para** garantizar la integridad referencial espacial de las ubicaciones registradas de contratistas y tareas.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** el contratista o supervisor selecciona un país, departamento, municipio o barrio en el formulario de la interfaz,
    *   **Cuando** el frontend envía la petición al backend,
    *   **Entonces** el backend valida que los identificadores de ubicación existan como llaves primarias en las tablas de catálogos (`paises`, `departamentos`, `municipios`, `barrios`).
    *   **Dado que** se elimina o modifica un registro geográfico (ej. un municipio),
    *   **Cuando** tiene contratistas o tareas vinculadas a él,
    *   **Entonces** la base de datos de PostgreSQL impide la eliminación arrojando una restricción de integridad referencial (`ON DELETE RESTRICT`).

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `paises`, `departamentos`, `municipios`, `barrios`, `contratistas`, `tareas`.
    *   **Migración:** Cargar los antiguos archivos `.json` del frontend a PostgreSQL mediante scripts de siembra (seeds) durante el despliegue inicial.

---

## ÉPICA 3: GESTIÓN Y CONTROL DE TAREAS

### US-08: Asignación de Tareas con Tope de Peso Acumulado (100%)
**Como** Supervisor  
**Quiero** registrar obligaciones y tareas específicas para un contrato estableciendo su porcentaje de peso  
**Para** programar de forma controlada el cumplimiento de las metas del contratista sin exceder el límite establecido del 100%.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** estoy en el formulario de creación de una nueva tarea para un contrato,
    *   **Cuando** el sistema realiza la sumatoria del campo `porcentaje_avance_programado` de todas las tareas ya creadas para dicho contrato,
    *   **Entonces** calcula dinámicamente el `porcentaje_restante` disponible para el contrato actual (Meta Restante = 100% - Total Programado).
    *   **Dado que** el supervisor intenta guardar una nueva tarea con un `porcentaje_avance_programado` mayor que la meta restante disponible,
    *   **Cuando** presiona "Guardar Tarea",
    *   **Entonces** el sistema bloquea la creación, muestra una alerta y le indica al supervisor el porcentaje exacto disponible que puede asignar (ej. *"No puede exceder el 100%. Porcentaje restante disponible: 30%"*).

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `tareas`, `contratos`.
    *   **Cálculo:** Implementar una consulta agregada `SUM(porcentaje_avance_programado)` filtrada por `id_contrato` dentro de la transacción de creación de tareas.

---

### US-09: Monitoreo de Tareas y Progreso Programado vs. Real
**Como** Contratista  
**Quiero** visualizar mi panel de tareas con su estado de avance  
**Para** conocer cuáles actividades he completado, cuáles están en ejecución y el porcentaje de cumplimiento real respecto a las metas programadas.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** he iniciado sesión como `contratista`,
    *   **Cuando** accedo a mi "Visor de Actividades" o Dashboard principal,
    *   **Entonces** el sistema me lista de forma clara y ordenada todas las tareas correspondientes a mi contrato vigente, mostrando para cada una su nombre, rango de fechas (fecha_inicio y fecha_finalizacion), la meta cuantitativa y el estado actual (`'NO INICIADA'`, `'EN EJECUCIÓN'`, `'FINALIZADA'`).
    *   **Dado que** visualizo el detalle de una tarea específica,
    *   **Cuando** consulto las métricas de rendimiento,
    *   **Entonces** el sistema calcula y me muestra de forma contrastada el `porcentaje_avance_programado` (teórico), el `porcentaje_avance_alcanzado` (real aprobado por el supervisor) y el `porcentaje_avance_no_alcanzado_acumulado` (brecha).

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `tareas`.
    *   **UI:** La vista debe renderizarse de forma responsiva mediante el sistema de grids de Bootstrap y las tarjetas visuales de AdminLTE.

---

## ÉPICA 4: GESTIÓN DE SOPORTES Y WORKFLOW DE EVIDENCIAS

### US-10: Carga de Evidencias con Control de Peso y Estado Inicial
**Como** Contratista  
**Quiero** cargar archivos de soporte (evidencias) vinculados a una tarea y un periodo específico  
**Para** justificar mi avance ante el supervisor y solicitar su correspondiente revisión.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** mi contrato se encuentra en estado `'vigente'`,
    *   **Cuando** selecciono una tarea, elijo el periodo actual de cobro y subo un archivo (PDF, Imagen, Zip),
    *   **Entonces** el backend valida que el archivo no supere el peso máximo establecido de **50 Megabytes**.
    *   **Dado que** el archivo cumple con las validaciones de peso y formato,
    *   **Cuando** confirmo la subida de la evidencia,
    *   **Entonces** el sistema almacena físicamente el archivo de forma segura, registra su metadata en la tabla `soportes` y establece su estado inicial de revisión en **Pendiente** (`revisado = false`, `rechazado = false`).

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `soportes`.
    *   **Storage:** El backend almacena temporalmente en el sistema de archivos local (`public/storage/soportes/`) pero se aconseja en su transición delegar a almacenamiento en la nube (AWS S3) registrando su URL.

---

### US-11: Revisión, Aprobación y Rechazo de Evidencias
**Como** Supervisor  
**Quiero** evaluar los soportes subidos por los contratistas para aprobarlos o rechazarlos  
**Para** certificar el avance de las actividades y justificar los desembolsos financieros.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** estoy autenticado como `supervisor` y reviso el módulo de evidencias pendientes,
    *   **Cuando** evalúo un soporte de evidencia y presiono "Aprobar",
    *   **Entonces** el sistema actualiza el registro en la tabla `soportes` marcando `revisado = true` y `rechazado = false`, fija la fecha de revisión actual y de manera automática **recalcula y actualiza el avance real alcanzado en la tarea correspondiente**.
    *   **Dado que** analizo un soporte y considero que no cumple con los requisitos,
    *   **Cuando** presiono "Rechazar" y redacto las observaciones detalladas del rechazo,
    *   **Entonces** el sistema marca en la tabla `soportes` `revisado = false` y `rechazado = true`, y despacha inmediatamente un correo electrónico al contratista informándole del rechazo, el nombre de la evidencia y las observaciones de corrección que debe realizar.

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `soportes`, `tareas`.
    *   **Automatización:** Al marcar `revisado = true`, un proceso o trigger de base de datos actualiza `tareas.porcentaje_avance_alcanzado` basándose en el peso de los soportes validados.

---

### US-12: Corrección y Sustitución de Evidencias Rechazadas
**Como** Contratista  
**Quiero** sustituir un soporte que ha sido rechazado por el supervisor por un archivo corregido  
**Para** someter nuevamente a revisión mi avance de la tarea y subsanar las observaciones.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** tengo un soporte en estado `'rechazado'`,
    *   **Cuando** ingreso a la interfaz de corrección y subo el archivo con las enmiendas correspondientes,
    *   **Entonces** el backend local de forma automática **elimina físicamente el archivo anterior del servidor (`fs.unlink`)** para no acumular basura de almacenamiento, y almacena el nuevo soporte físico.
    *   **Dado que** el nuevo archivo ha sido almacenado exitosamente,
    *   **Cuando** el sistema actualiza el registro de base de datos local restableciendo el estado a pendiente (`revisado = false`, `rechazado = false`),
    *   **Entonces** despacha un correo de alerta automático al Supervisor informándole que el contratista ha corregido y sustituido el soporte, detallando el nombre del archivo corregido y dejándolo listo para una nueva evaluación.

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `soportes`.
    *   **Procesamiento:** El backend requiere acceder a `pathAnterior` para invocar la función de eliminación de archivos antes de renombrar y guardar el nuevo soporte.

---

## ÉPICA 5: CALIFICACIÓN Y CIERRE PERIÓDICO

### US-13: Evaluación Cuantitativa del Periodo de Ejecución
**Como** Supervisor  
**Quiero** emitir una calificación de desempeño y observaciones cualitativas para el periodo de un contratista  
**Para** consolidar el avance periódico y generar las correspondientes notificaciones y liquidaciones.

*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** ha finalizado un periodo de ejecución de un contrato activo y vigente,
    *   **Cuando** completo el formulario de evaluación de periodo registrando la calificación numérica (`porcentaje_evaluado` entre 0 y 100) y mis observaciones cualitativas,
    *   **Entonces** el sistema persiste la información en la tabla `evaluaciones` de PostgreSQL y calcula de forma automática el `valor_periodo` a liquidar basado en el porcentaje evaluado aprobado.
    *   **Dado que** la evaluación ha sido registrada de forma exitosa en la base de datos,
    *   **Cuando** se consolida la transacción,
    *   **Entonces** el sistema envía una alerta de calificación por correo electrónico al contratista detallando el número de periodo evaluado, las fechas de rango del periodo, la calificación numérica obtenida y las observaciones emitidas por el supervisor.

*   **Detalle Técnico:** 
    *   **Tablas afectadas:** `evaluaciones`.
    *   **Matemáticas:** `valor_periodo` se liquida multiplicando el valor base del periodo por el porcentaje calificado (e.g. `periodos.valor * (evaluacion.porcentaje_evaluado / 100)`).
