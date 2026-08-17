# Arquitectura — PitStop Service Status Tracker

## Visión general

```
┌─────────────────┐        HTTPS/JSON        ┌──────────────────┐        SQL        ┌──────────────┐
│  frontend/       │ ───────────────────────▶ │  backend/         │ ────────────────▶ │  PostgreSQL   │
│  React + Vite    │ ◀─────────────────────── │  Express + Prisma │ ◀──────────────── │               │
└─────────────────┘         JWT en header      └──────────────────┘                   └──────────────┘
```

- **Frontend**: SPA en React que consume la API vía `axios`. La sesión se guarda en `localStorage` (token JWT + perfil).
- **Backend**: API REST en Express. Capas: `routes → controllers (validación Zod) → services (lógica + Prisma) → PostgreSQL`.
- **Base de datos**: PostgreSQL gestionado con Prisma ORM y migraciones versionadas (`backend/prisma/schema.prisma`).

## Modelo de datos

- `User` — cuenta individual por persona (Service Advisor / Admin), administrable desde **Configuración**. `active: false` deshabilita el login sin borrar el historial asociado.
- `Customer` → tiene muchos `Vehicle`.
- `Vehicle` → pertenece a un `Customer`, tiene muchas `WorkOrder`.
- `Technician` → asignado a `WorkOrder`. `team` (`SERVICIO` | `HYP`, un solo valor fijo por técnico — casi siempre son personas distintas y especializadas, no hace falta multi-selección) determina en qué cálculo de capacidad cuenta y qué lista de técnicos ve el selector de asignación de cada módulo.
- `CapacitySettings` — parámetros de la fórmula de capacidad, uno por equipo. Servicio: `hoursPerDay`/`efficiency`/`productivity`. HYP: `unitsPerTechnician` (cupo de unidades simultáneas por técnico) — no usa horas porque sus órdenes duran días, no horas.
- `ServiceCategoryHours` — horas estándar por `serviceCategory`, usadas para convertir las órdenes en proceso de Servicio en horas de demanda.
- `WorkOrder` — entidad central del tracker. `orderType` (`SERVICIO` | `HYP`) determina qué pipeline de etapas aplica al estatus (`status`), y solo avanza dentro de ese pipeline (ver `backend/src/utils/workOrderStatus.js` / `frontend/src/constants/stages.js`):
  - **Servicio**: `RECIBIDO → EN_TALLER → LAVADO → CONTROL_CALIDAD → TERMINADO → ENTREGADO`.
  - **HYP** (hojalatería y pintura): `EN_VALUACION → PRESUPUESTO_ENVIADO → PRESUPUESTO_AUTORIZADO → PEDIDO_REFACCIONES → EN_COMPLEMENTO → REFACCIONES_SURTIDAS_PARCIAL → REFACCIONES_COMPLETAS → CONFORMADO_LAMINA → MECANICA_COLISION → PREPARACION → PINTURA → ENSAMBLE → PULIDO → CONTROL_CALIDAD → LAVADO → TERMINADO → ENTREGADO`.
  - Cambiar `orderType` (`PATCH /work-orders/:id/order-type`) reinicia `status` a la primera etapa del nuevo pipeline — el avance no es transferible entre pipelines — y registra el cambio como un `StatusEvent`.
  - `subState` es una marca **opcional dentro** de la etapa actual, no una etapa del pipeline — no avanza ni retrocede el flujo, por eso no vive en `STAGE_PIPELINES` ni genera `StatusEvent`. El mecanismo sigue existiendo (`PATCH /work-orders/:id/sub-state`) pero **`STAGE_SUB_STATES` está vacío**: sus dos únicos casos de uso se reemplazaron por indicadores automáticos que no dependen de que alguien los marque/desmarque a mano:
    - **"Pendiente por asignar"** en `RECIBIDO`: se muestra solo cuando `status = RECIBIDO` y no hay `technicianId`. Desaparece solo al asignar un técnico.
    - **"Asignado"** en `EN_TALLER`: se muestra cuando `status = EN_TALLER` y sí hay `technicianId`.
    - **"Esperando refacciones"** se reemplazó por el botón de refacciones pendientes (ver `PendingPart` abajo) — más rico que un chip binario, porque registra qué pieza se pidió y cuándo llegó.
  - Además de los campos capturados manualmente, trae campos opcionales alimentados por la importación del DMS: `dmsStatus`, `serviceType`, `partsNeeded`, `customerWaiting`, `washNeeded`, `advisorCode` (ver [DMS_IMPORT.md](DMS_IMPORT.md)).
  - `insurer`/`reportNumber`: datos de aseguradora, editables directo en la tabla "Unidades en Proceso" del módulo HYP (esas dos columnas solo aparecen ahí, Servicio no las necesita). Independientes del `InsuranceCase` de Inmovilizados/Seguros — ese expediente es 1-a-1 con una `ImmobilizedUnit` (unidad con daño reportada por el cliente), no con una `WorkOrder`; una orden HYP puede tener aseguradora capturada aquí sin pasar por ese módulo.
  - El catálogo de columnas de "Unidades en Proceso" es distinto por módulo: HYP no muestra "Tipo de servicio", "Diagnóstico" ni "Con lavado" (no aplican a hojalatería y pintura) y en cambio sí muestra "Aseguradora"/"# Reporte/Siniestro". El orden de las columnas es reordenable con las flechas del encabezado y se guarda por navegador en `localStorage` (`pitstop.inProgressColumns.<orderType>`), independiente entre Servicio y HYP — es preferencia de pantalla, no dato de negocio, así que no vive en el backend.
- `StatusEvent` — historial de cambios de estatus (uno por transición real); alimenta las marcas de tiempo del stepper visual. Como el estatus solo avanza, cada etapa alcanzada tiene a lo más un evento — su `occurredAt` es el inicio de esa etapa, y el fin es el `occurredAt` del evento que le sigue cronológicamente en el historial (o "ahora" si es la etapa actual). Esto es lo que alimenta el reporte de tiempos por etapa (ver más abajo): no hace falta guardar un campo de "fin" aparte, se deriva del propio historial.
- `StageComment` — historial de seguimiento libre: a diferencia de `StatusEvent.note` (un solo comentario, solo al momento de cambiar de estatus), permite **varios** comentarios por etapa, en cualquier momento, sin necesidad de cambiar el estatus. Cada uno queda ligado al `User` que lo escribió (de ahí que cada persona necesite su propia cuenta) y a su fecha de registro.
- `StatusMapping` — traduce cada valor crudo de `Estatus_Actual` del DMS a uno de los estatus internos (de cualquiera de los dos pipelines); administrable desde la página **Configuración**.
- `PendingPart` — una refacción pedida para una `WorkOrder` (`partNumber`, `orderNumber`, `orderDate`, `received`/`receivedAt`). Se captura desde el botón "Refacciones" en la tarjeta de la etapa `EN_TALLER`. Mientras haya al menos una fila sin `received`, el botón se muestra en rojo con el conteo; en cuanto se agrega o se marca/desmarca una pieza, el backend recalcula `WorkOrder.partsReady` solo (`true` únicamente cuando **todas** las piezas de la orden están recibidas) y fija `partsNeeded = true` — así una orden con piezas registradas alimenta directo el congelamiento del motor de priorización sin necesidad de la casilla manual `partsReady` (que sigue existiendo para órdenes sin este detalle, ej. importadas del DMS sin captura granular).
- `ImmobilizedUnit` — unidad con daño (módulo **Inmovilizados**). `treatmentType` (`REPARACION_INTERNA` | `GARANTIA` | `ASEGURADORA`) determina qué información adicional aplica: `GARANTIA` habilita `dmsReportNumber`; `ASEGURADORA` crea automáticamente un `InsuranceCase`. `resolved`/`resolvedAt` marcan cuándo se solucionó el daño, independiente del tratamiento. Las fotos de daño/resuelto están pendientes de implementar — por ahora solo hay un botón de cámara sin funcionalidad en el frontend.
- `InsuranceCase` — expediente de seguros (módulo **Seguros**), 1-a-1 con una `ImmobilizedUnit`. `stage` (`ENVIO_PRESUPUESTO → AUTORIZACION → EN_REPARACION → ENTREGADA`, solo avanza) + `reportNumber`/`insurer`/`policyType` (`PLAN_PISO` | `TRASLADO`). El módulo Seguros solo lista casos cuya unidad tiene `treatmentType = ASEGURADORA`; "extraer" una unidad cambia su tratamiento (no borra el caso, así se conserva el historial/checklist si se vuelve a agregar).
- `InsuranceDocument` — checklist del expediente digital de un `InsuranceCase` (6 filas fijas: ODA, deducible/demérito, declaración universal, finiquito, ID con declaración, factura marca), creadas automáticamente al abrir el caso.

`Vehicle.plate` y `Vehicle.vin` no tienen restricción de unicidad a nivel de base de datos (a diferencia de un diseño "de libro de texto") porque el DMS real reutiliza VINs de marcador de posición para vehículos internos de la agencia. La identidad de un vehículo se resuelve por la combinación `(plate, vin)` en la capa de aplicación, no por una única columna. `Vehicle.year` y `Vehicle.color` son opcionales porque el DMS no siempre los reporta.

## Por qué esta estructura de carpetas

Se adoptaron convenciones de higiene de repositorio (top-level `docs/`, `config/`, `scripts/`, separación estricta de "producto" vs. artefactos de diseño) inspiradas en la organización modular de referencia. A diferencia de un proyecto de "skills" (donde el núcleo es un conjunto de capacidades invocables), aquí el dominio es una aplicación web clásica, así que el núcleo se divide en `backend/` y `frontend/` como dos paquetes independientes y desplegables por separado, cada uno con su propio `package.json`, tests y README.

```
├── backend/    API REST (Node/Express/Prisma/PostgreSQL)
├── frontend/   SPA (React/Vite/Tailwind)
├── docs/       Documentación de producto, arquitectura y diseño
│   └── design/ Mockups originales de Stitch + sistema de diseño (fuente de verdad visual)
├── config/     Configuración compartida de infraestructura (docker-compose de Postgres)
└── scripts/    Scripts operativos de desarrollo
```

## Flujo principal (dashboard de estatus)

1. El Service Advisor inicia sesión (`POST /auth/login`) → recibe JWT.
2. El dashboard carga la orden de trabajo más reciente (`GET /work-orders/latest`) y las estadísticas del día (`GET /work-orders/stats/today`).
3. Al buscar por orden/placas/VIN (`GET /work-orders?q=`), se filtra sobre las 3 columnas simultáneamente.
4. El advisor puede avanzar el estatus de una orden (`PATCH /work-orders/:id/status`), lo que registra un `StatusEvent` y actualiza el stepper visual en tiempo real.
5. "Nueva Orden de Trabajo" crea vehículo/cliente si no existen y una `WorkOrder` en estatus `RECIBIDO`.

## Motor de priorización (cola de asignación)

Aplica **solo al grupo "Ingresadas Hoy"** de Unidades en Proceso: es la cola que el controlista
asigna a reparación. "Rezagadas" conserva su orden cronológico, donde el criterio útil es la
antigüedad, no la urgencia. La lógica vive en `frontend/src/utils/priority.js`.

**Solo dos reglas: hora de promesa y cliente espera.** El motor tuvo antes un término por tipo de
servicio y otro anti-inanición por antigüedad; se quitaron a petición explícita — el taller
decidió que solo estos dos criterios deben mover el orden. `serviceCategory` sigue siendo un
dato capturado y visible en la tabla, pero ya no influye en el ranking.

**Por qué un puntaje ponderado y no una jerarquía estricta de reglas.** Si la hora de promesa
mandara siempre, "cliente espera" nunca se aplicaría: las promesas son timestamps y casi nunca
empatan al minuto, así que desempatar por cliente-espera sería letra muerta. En vez de eso ese
criterio se expresa en **horas equivalentes de adelanto** sobre la promesa, lo que permite que
rebase una promesa cercana, pero no una que vence en minutos.

```
score = horas hasta la promesa       (sin promesa → al final)
        − 3 h   si el cliente espera en agencia
```

Menor score = más urgente. El peso es política del taller, no una constante técnica: se ajusta
en el mismo archivo (`WEIGHT_CUSTOMER_WAITING`).

**Congelamiento por refacciones.** Una orden con `partsNeeded = true` y `partsReady ≠ true` no es
asignable: sale del ranking y se muestra al final marcada como congelada. `partsNeeded = null`
(desconocido, típico de órdenes capturadas a mano) **no** congela — asumir lo contrario
paralizaría el tablero con órdenes que quizá ni requieren piezas. Esto es una regla de
elegibilidad, no de orden, así que no se tocó al simplificar el puntaje.

**Transparencia.** Cada fila muestra el desglose que produjo su posición ("Promesa en 4 h ·
Cliente espera"). Sin esa justificación un tablero que ordena solo genera desconfianza y se
termina ignorando.

## Dashboards Servicio / HYP y capacidad instalada

El dashboard único se separó en dos módulos (`/` Servicio, `/hyp` HYP) porque comparar ambos en
una sola vista mezclaba dos negocios con ritmos distintos: Servicio se agenda por hora del día,
HYP por días de reparación. Ambos reusan el mismo componente
(`frontend/src/components/dashboard/WorkOrderTypeDashboard.jsx`), parametrizado por `orderType`.
Cada uno tiene su propio tablero de entregas arriba de los tiles, porque el ritmo de agendado es
distinto: Servicio usa el magnetoplano por hora (`PromiseTimeBoard`, matriz técnico × hora del
día seleccionado); HYP usa una agenda simple ordenada por fecha (`HypDeliveryAgenda`) — sin
agrupar por técnico ni por hora, porque lo único que le importa al controlista de HYP es en qué
día tiene programada cada entrega.

**Capacidad instalada**, un panel adicional entre los tiles de estadísticas y la lista de
unidades en proceso (`GET /work-orders/capacity/:team`):

- **Servicio** (horas/día): `capacidad = técnicos activos del equipo × hoursPerDay × efficiency
  × productivity`, contra la demanda en horas = suma de `ServiceCategoryHours` de las órdenes en
  proceso clasificadas por `serviceCategory`. Las sin clasificar se cuentan y muestran aparte
  (no se asume una categoría para no sesgar el número).
- **HYP** (cupo de unidades): `capacidad = técnicos activos del equipo × unitsPerTechnician`,
  contra la cantidad de órdenes HYP en proceso. No se usa la fórmula de horas porque una orden
  HYP puede tardar varios días — "horas disponibles hoy" no es una medida útil ahí.

Los parámetros (`hoursPerDay`, `efficiency`, `productivity`, `unitsPerTechnician`,
`ServiceCategoryHours`) se ajustan desde **Configuración** — son política del taller, no
constantes técnicas.

## Semáforo de avance contra el tiempo estándar (Servicio)

Indicador de "va atrasada" en `frontend/src/utils/workProgress.js`. Es una **regla
determinística sobre datos ya capturados**, no una predicción estadística: se descartó un
modelo probabilístico ("80% de probabilidad de no entregarse a tiempo") porque no hay volumen
histórico para entrenarlo, y una regla auditable es más útil para el taller — cualquiera puede
verificar por qué una orden se pintó de rojo.

```
avance = horas desde technicianAssignedAt ÷ horas estándar del serviceCategory
```

Las horas estándar son las de `ServiceCategoryHours`, configurables desde **Configuración →
Capacidad instalada** (las mismas que alimentan el cálculo de demanda). Umbrales: verde < 70%,
ámbar 70–100%, rojo ≥ 100%, gris cuando falta un dato.

**Por qué el reloj arranca en `technicianAssignedAt` y no en `receivedAt`.** El tiempo estándar
mide trabajo de taller; contar la espera previa a que alguien tome la unidad pintaría de rojo
órdenes que ni siquiera han empezado — sería ruido, no una alerta. El campo se estampa solo al
asignar técnico (`PATCH /work-orders/:id/technician`), se reinicia al cambiar de técnico (el
trabajo vuelve a empezar) y se limpia al desasignar; reasignar al *mismo* técnico no lo toca,
para que un guardado accidental no reinicie el reloj.

**Gris no es un estado de alarma, es ausencia de dato**: sin técnico asignado (el reloj no ha
iniciado) o sin `serviceCategory` clasificado (no hay contra qué comparar). No se asume una
categoría por defecto — inventar un tiempo estándar produciría un semáforo que miente.

**Solo aplica a Servicio.** HYP no captura `serviceCategory` (esa columna no existe en su
tabla, ver `DEFAULT_COLUMN_KEYS`), así que ahí el semáforo sería siempre gris; se omite en vez
de mostrar una fila de puntos sin significado.

Se pinta en tres lugares, todos alimentados por la misma función:

- **Magnetoplano** (`PromiseTimeBoard`), la vista de referencia del tablero: franja lateral de
  color en cada tarjeta + punto con el desglose en tooltip, y una leyenda de los cuatro niveles
  arriba de la matriz. La franja existe porque un punto de 10 px se pierde al escanear el
  tablero completo de un vistazo; el color tiene que leerse a distancia. Al hacer clic en una
  tarjeta se abre un detalle **de solo consulta** (estatus, técnico, promesa y la interpretación
  escrita del semáforo) — el magnetoplano sigue sin abrir edición, que vive únicamente en
  Unidades en Proceso. Solo una tarjeta abierta a la vez: dos popovers simultáneos se
  encimarían dentro de la matriz.
- **Columna Estatus** de Unidades en Proceso: punto de color con el desglose en el tooltip.
- **Modal de detalle**: borde y porcentaje en la tarjeta de la **etapa actual** únicamente — el
  avance es de la orden, repetirlo en las 6 tarjetas sería el mismo dato seis veces.

## Corte de mediodía (Servicio)

Botón en el dashboard de Servicio (`MiddayCutoffFilter.jsx`) que filtra "Unidades en Proceso" a
las órdenes con hora promesa **hoy antes de las 3:00 p.m.**, y resalta con borde rojo las que
todavía no llegan a una etapa seguras para cumplir (`CONTROL_CALIDAD`, `LAVADO`, `TERMINADO` o
`ENTREGADO`). Es un filtro de consulta, no depende de la hora real del reloj — un asesor puede
revisarlo antes o después de mediodía, el criterio siempre es la hora promesa de cada orden, no
el momento en que se activa el filtro. Cálculo 100% en el frontend con datos ya cargados, sin
endpoint nuevo.

## Reportes (tiempo de estadía por etapa)

La pantalla **Reportes** (`/reportes`) calcula, por tipo de orden, el tiempo promedio en cada
etapa del pipeline y el tiempo total de estadía (ingreso a entrega). Solo considera órdenes ya
`ENTREGADO` con `deliveredAt` fijo — una orden todavía en proceso no tiene un tiempo de etapa
cerrado, mezclarla sesgaría el promedio hacia abajo sin que signifique nada real.

El cálculo (`backend/src/services/reports.service.js`) usa el historial de `StatusEvent` de cada
orden ordenado por fecha: la duración de una etapa es la diferencia entre su evento y el
siguiente evento *cronológico* de esa orden — no el siguiente del pipeline, porque una orden
puede saltarse etapas al avanzar (el modal de detalle permite avanzar directo a cualquier etapa
futura, no solo a la inmediata). Una etapa saltada nunca tuvo `StatusEvent` propio, así que
simplemente no aporta una muestra al promedio de esa etapa, en vez de contarse con duración cero.

En el modal de detalle (`OrderStageDetailModal.jsx`), la etapa actual tiene una flecha de avance
directo a la siguiente etapa del pipeline (sin necesidad de abrir la tarjeta futura y hacer clic
en su ícono) y cada tarjeta alcanzada muestra su hora de inicio y, si ya no es la actual, su hora
de fin — el mismo dato que alimenta el reporte.

## Flujo Inmovilizados → Seguros

1. Se registra una `ImmobilizedUnit` desde **Inmovilizados** (`POST /immobilized`), eligiendo un vehículo existente o capturando uno nuevo (crea `Vehicle`/`Customer` si hace falta, mismo patrón que la creación de órdenes).
2. Si `treatmentType = ASEGURADORA`, el backend crea el `InsuranceCase` (con las 6 filas del checklist en `false`) en la misma transacción — la unidad aparece de inmediato en **Seguros**.
3. Desde **Seguros** se administra el expediente: datos del caso (`PATCH /insurance-cases/:id`), avance de etapa forward-only (`PATCH /insurance-cases/:id/stage`) y checklist (`PATCH /insurance-cases/:id/documents/:docType`).
4. "Agregar Unidad" en Seguros reutiliza unidades ya registradas en Inmovilizados (cambia su `treatmentType` a `ASEGURADORA`); "Extraer de Seguros" hace lo inverso (`PATCH /immobilized/:id/treatment-type`) sin borrar el `InsuranceCase` — si se vuelve a agregar, recupera su historial y checklist tal como estaban.

## Fuera de alcance (decisión explícita del usuario)

Inventario, Agenda y Reportes avanzados quedaron como enlaces/placeholders deshabilitados en la UI — no tienen modelo de datos ni endpoints. Ver [../frontend/README.md](../frontend/README.md).
