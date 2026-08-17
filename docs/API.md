# API Reference — PitStop Backend

Base URL: `http://localhost:4000/api`

Todas las rutas (excepto `/auth/login` y `/health`) requieren el header:

```
Authorization: Bearer <token>
```

## Auth

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | `{ email, password }` → `{ token, user }` |
| GET | `/auth/me` | Perfil del usuario autenticado |

## Work Orders (órdenes de trabajo)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/work-orders?q=` | Busca por número de orden, placas o VIN. Sin `q`, devuelve las 25 más recientes. |
| GET | `/work-orders/latest` | La orden de trabajo más reciente (para la tarjeta principal del dashboard) |
| GET | `/work-orders/in-progress?orderType=` | Todas las órdenes cuyo estatus no es `ENTREGADO`, ordenadas de más antigua a más reciente — alimenta "Unidades en Proceso". `orderType` (`SERVICIO` \| `HYP`) filtra por módulo; sin él, devuelve ambos |
| GET | `/work-orders/stats/today?orderType=` | `{ totalHoy, terminados, porEntregar }` — alimenta los 3 tiles del dashboard. Mismo filtro `orderType` opcional |
| GET | `/work-orders/capacity/:team` | Capacidad instalada vs. demanda del equipo (`SERVICIO` \| `HYP`). Servicio: `{ team, technicianCount, capacityHours, demandHours, unclassifiedCount, utilization }`. HYP: `{ team, technicianCount, capacityUnits, demandUnits, utilization }` |
| GET | `/work-orders/capacity/:team/settings` | Parámetros de capacidad del equipo (`CapacitySettings`) |
| PATCH | `/work-orders/capacity/:team/settings` | Actualiza parámetros de capacidad. Body Servicio: `{ hoursPerDay?, efficiency?, productivity? }`. Body HYP: `{ unitsPerTechnician? }` |
| GET | `/work-orders/capacity/service-category-hours` | Lista las horas estándar por `serviceCategory`, usadas para calcular la demanda de Servicio |
| PATCH | `/work-orders/capacity/service-category-hours/:category` | Actualiza las horas estándar de una categoría. Body: `{ hours }` |
| GET | `/work-orders/:id` | Detalle de una orden |
| POST | `/work-orders` | Crea una orden. Body: `{ vehicleId, technicianId?, orderNumber?, orderType?, estimatedDeliveryAt?, notes? }`. `orderType` (`SERVICIO` \| `HYP`, default `SERVICIO`) determina el pipeline y por tanto el estatus inicial |
| PATCH | `/work-orders/:id/status` | Avanza el estatus. Body: `{ status, note? }`. El estatus solo puede avanzar dentro del pipeline vigente de la orden (ver `orderType` abajo) |
| PATCH | `/work-orders/:id/sub-state` | Marca o quita un sub-estado sobre la etapa actual. Body: `{ subState }` — hoy sin catálogo activo (ver nota abajo); `null` lo quita. No altera la etapa ni registra `StatusEvent` |
| PATCH | `/work-orders/:id/order-type` | Cambia el tipo de orden (`SERVICIO` \| `HYP`). Body: `{ orderType }`. Reinicia el estatus a la primera etapa del nuevo pipeline y registra un `StatusEvent` — el avance no se transfiere entre pipelines |
| PATCH | `/work-orders/:id/parts-ready` | Marca a mano si ya llegaron todas las refacciones. Body: `{ partsReady }`. Se ignora en la práctica si la orden ya tiene `pendingParts` registradas — ver más abajo |
| POST | `/work-orders/:id/pending-parts` | Registra una refacción pedida. Body: `{ partNumber, orderNumber, orderDate }`. Pone `partsNeeded = true` y recalcula `partsReady` |
| PATCH | `/work-orders/:id/pending-parts/:partId` | Marca/desmarca una refacción como recibida. Body: `{ received }`. Recalcula `partsReady` (solo `true` cuando **todas** las piezas de la orden están recibidas) |
| DELETE | `/work-orders/:id/pending-parts/:partId` | Elimina un registro de refacción pedida (por captura errónea). Recalcula `partsReady` |
| PATCH | `/work-orders/:id/service-category` | Clasifica el trabajo ("Tipo de servicio"). Body: `{ serviceCategory }` — `MANTENIMIENTO` \| `DIAGNOSTICO_FALLA_RECLAMO` \| `PREVIA`, o `null` para dejarlo sin clasificar. Catálogo provisional (captura manual) hasta que exista el catálogo administrable desde Configuración |
| PATCH | `/work-orders/:id/diagnosis-needed` | Marca si la orden requiere diagnóstico. Body: `{ diagnosisNeeded }`. Independiente de `serviceCategory` — un correctivo pesado también puede requerir diagnóstico previo |
| PATCH | `/work-orders/:id/wash-needed` | Marca si la orden requiere lavado. Body: `{ washNeeded }`. Normalmente lo reporta el DMS, pero también se puede corregir a mano |
| PATCH | `/work-orders/:id/insurer` | Aseguradora de la orden (columna propia de HYP en "Unidades en Proceso"). Body: `{ insurer }` — string o `null` para limpiarlo |
| PATCH | `/work-orders/:id/report-number` | Número de reporte/siniestro de la aseguradora. Body: `{ reportNumber }` — string o `null` para limpiarlo. Independiente del `InsuranceCase` del módulo Seguros (ese es 1-a-1 con una `ImmobilizedUnit`, no con la `WorkOrder`) |
| PATCH | `/work-orders/:id/technician` | Asigna o desasigna al técnico. Body: `{ technicianId }` — un uuid válido, o `null` para desasignar. Estampa `technicianAssignedAt` (reloj del semáforo de avance): lo fija al asignar, lo reinicia al cambiar de técnico, lo limpia al desasignar, y no lo toca si se reasigna al mismo técnico |
| PATCH | `/work-orders/:id/estimated-delivery` | Cambia la fecha/hora promesa de entrega. Body: `{ estimatedDeliveryAt }` — un string ISO o `null` para quitarla |
| POST | `/work-orders/:id/comments` | Agrega un comentario de seguimiento a una etapa (cualquiera, no solo la actual). Body: `{ stage, comment }`. El usuario se toma del token, no del body |
| GET | `/work-orders/reports/stage-durations?orderType=` | Reporte de tiempo promedio por etapa + tiempo total de estadía (ingreso a entrega), solo sobre órdenes `ENTREGADO`. `orderType` es obligatorio (`SERVICIO` \| `HYP`). Respuesta: `{ orderType, sampleSize, avgTotalHours, stages: [{ key, avgHours, sampleSize }] }` |

## Customers / Vehicles / Technicians

CRUD estándar en `/customers`, `/vehicles`, `/technicians`:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/{recurso}` | Lista |
| GET | `/{recurso}/:id` | Detalle |
| POST | `/{recurso}` | Crea |
| PATCH | `/{recurso}/:id` | Actualiza parcialmente |
| DELETE | `/{recurso}/:id` | Elimina |

Esquemas de creación (ver `src/controllers/*.controller.js` para la validación Zod completa):

```jsonc
// POST /customers
{ "name": "Ricardo Morales", "phone": "+52 961 123 4567", "email": "ricardo@example.com" }

// POST /vehicles
{ "brand": "Nissan", "model": "Sentra", "year": 2023, "color": "Plata", "plate": "ABC-1234", "vin": "1N4AL3AP0DC123456", "customerId": "<uuid>" }

// POST /technicians
{ "name": "Ing. Javier S.", "specialty": "Diagnóstico y afinación", "team": "SERVICIO" }
```

## Status Mappings (mapeo de estatus del DMS)

CRUD estándar en `/status-mappings` (mismo patrón GET/POST/PATCH/DELETE). Traduce cada valor crudo
que reporta el DMS en `Estatus_Actual` a uno de los estatus internos de cualquiera de los dos
pipelines — Servicio (`RECIBIDO`, `EN_TALLER`, `LAVADO`, `CONTROL_CALIDAD`, `TERMINADO`,
`ENTREGADO`) o HYP (`EN_VALUACION`, `PRESUPUESTO_ENVIADO`, `PRESUPUESTO_AUTORIZADO`,
`PEDIDO_REFACCIONES`, `EN_COMPLEMENTO`, `REFACCIONES_SURTIDAS_PARCIAL`, `REFACCIONES_COMPLETAS`,
`CONFORMADO_LAMINA`, `MECANICA_COLISION`, `PREPARACION`, `PINTURA`, `ENSAMBLE`, `PULIDO`, y las 4
compartidas con Servicio). El importador (`scripts/import-dms.js`) crea automáticamente una
entrada nueva (mapeada a `RECIBIDO` por defecto) la primera vez que encuentra un valor de estatus
que no está en la tabla — se administra desde la página **Configuración** del frontend.

```jsonc
// POST /status-mappings
{ "dmsStatus": "En proceso", "internalStatus": "EN_TALLER" }

// PATCH /status-mappings/:id
{ "internalStatus": "LAVADO" }
```

## Immobilized (unidades inmovilizadas — módulo Inmovilizados)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/immobilized?resolved=` | Lista unidades. `resolved` (`true`\|`false`) filtra opcionalmente |
| GET | `/immobilized/:id` | Detalle |
| POST | `/immobilized` | Crea. Body: `{ vehicleId, damageDate, treatmentType, dmsReportNumber?, description? }`. `treatmentType`: `REPARACION_INTERNA` \| `GARANTIA` \| `ASEGURADORA`. Si es `ASEGURADORA`, crea automáticamente el `InsuranceCase` + checklist de 6 documentos |
| PATCH | `/immobilized/:id` | Actualiza `damageDate`/`description`/`dmsReportNumber` (este último solo aplica si el tratamiento vigente es `GARANTIA`) |
| PATCH | `/immobilized/:id/treatment-type` | Cambia el tratamiento. Body: `{ treatmentType }`. Pasar a `ASEGURADORA` crea el `InsuranceCase` si no existe; salir de `GARANTIA` limpia `dmsReportNumber` |
| PATCH | `/immobilized/:id/resolved` | Marca/desmarca como resuelta. Body: `{ resolved }` |
| POST | `/immobilized/:id/comments` | Agrega un comentario de seguimiento (un solo hilo por unidad, sin etapa). Body: `{ comment }`. El usuario se toma del token |

## Insurance Cases (expedientes de seguro — módulo Seguros)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/insurance-cases` | Lista solo los casos cuya `ImmobilizedUnit` tiene `treatmentType = ASEGURADORA` (los "extraídos" no aparecen, pero conservan su historial) |
| GET | `/insurance-cases/:id` | Detalle (incluye `documents`) |
| PATCH | `/insurance-cases/:id` | Actualiza `reportNumber`/`insurer`/`policyType` (`PLAN_PISO` \| `TRASLADO`) |
| PATCH | `/insurance-cases/:id/stage` | Avanza la etapa. Body: `{ stage }`. Solo avanza: `ENVIO_PRESUPUESTO → AUTORIZACION → EN_REPARACION → ENTREGADA` |
| PATCH | `/insurance-cases/:id/documents/:docType` | Marca/desmarca un documento del checklist. Body: `{ completed }`. `docType`: `ODA` \| `DEDUCIBLE` \| `DECLARACION_UNIVERSAL` \| `FINIQUITO` \| `ID_DECLARACION` \| `FACTURA_MARCA` |
| POST | `/insurance-cases/:id/comments` | Agrega un comentario de seguimiento a una etapa (cualquiera, no solo la actual). Body: `{ stage, comment }`. El usuario se toma del token |

Para "extraer" una unidad de Seguros no hay un endpoint dedicado: se llama a
`PATCH /immobilized/:id/treatment-type` con un tratamiento distinto a `ASEGURADORA` — el
`InsuranceCase` no se borra, así que si la unidad se vuelve a agregar recupera su expediente completo.

## Users (cuentas de usuario)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/users` | Lista (sin `passwordHash`) |
| POST | `/users` | Crea. Body: `{ name, email, password, role? }` |
| PATCH | `/users/:id` | Actualiza `name`/`email`/`active`/`role`, y opcionalmente `password` para restablecerla |

No hay borrado duro — solo `active: false` para deshabilitar el acceso, ya que un usuario puede
tener comentarios de seguimiento asociados (`StageComment.userId`, `onDelete: Restrict`). El login
verifica `active`; una cuenta deshabilitada no puede iniciar sesión.

## Errores

Formato uniforme:

```json
{ "error": "Descripción legible", "details": { "...": "opcional, p. ej. errores de validación Zod" } }
```

Códigos usados: `400` (validación), `401` (sin token / credenciales inválidas), `403` (rol insuficiente), `404` (no encontrado), `409` (conflicto de unicidad — email/placa/VIN/orden duplicados), `500` (error interno).
