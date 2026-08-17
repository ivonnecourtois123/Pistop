# Importación de órdenes desde el DMS

`backend/scripts/import-dms.js` carga las órdenes en proceso reales exportadas del DMS a la base
de datos de PitStop. Es **idempotente**: se puede volver a correr con un export más reciente y
actualizará las órdenes existentes (por número de orden) en vez de duplicarlas — este es el mismo
script que debe automatizarse para la sincronización periódica.

## Uso

```bash
cd backend
node scripts/import-dms.js "<ruta-OrdenesProceso.xlsx>" ["<ruta-TablaOrdenes.xlsx>"]
# o, usando el atajo de npm:
npm run import:dms -- "<ruta-OrdenesProceso.xlsx>" "<ruta-TablaOrdenes.xlsx>"
```

## Los dos archivos

| Archivo | Rol | Columnas usadas |
|---|---|---|
| **OrdenesProceso** (obligatorio) | Fuente principal — trae todo lo necesario para crear cliente, vehículo y orden | `Orden`, `Recep`, `Entrada`, `Num.Serie` (VIN), `Placas`, `Linea` (marca/modelo), `Cliente`, `Hora_Entrega`, `Cliente_Espera`, `Estatus_Actual`, `Técnico`, `Servicio`, `Diagnóstico`, `Lavado` |
| **TablaOrdenes** (opcional) | Solo enriquece órdenes que ya existen en el archivo principal (no trae placas/VIN/cliente, así que no puede crear órdenes por sí solo) | `No_Orden`, `Tipo_Servicio`, `Refacciones` |

Si una orden aparece en TablaOrdenes pero no en OrdenesProceso, el script la reporta como omitida
al final (no se puede crear un vehículo sin placa/VIN/cliente).

## Mapeo de campos

| Columna del DMS | Campo en PitStop | Notas |
|---|---|---|
| `Orden` | `WorkOrder.orderNumber` | Se limpia el apóstrofe y los ceros a la izquierda (`'0094293` → `94293`) |
| `Entrada` | `WorkOrder.receivedAt` | Formato `M/D/YY` |
| `Hora_Entrega` | `WorkOrder.estimatedDeliveryAt` | Se combina con la fecha de `Entrada`. Si ya pasó, se muestra como entrega vencida — es información válida, no un error |
| `Num.Serie` | `Vehicle.vin` | **Sin restricción de unicidad** — ver "Vehículos internos de la agencia" abajo |
| `Placas` | `Vehicle.plate` | Tampoco es única por el mismo motivo |
| `Linea` | `Vehicle.brand` + `Vehicle.model` | `RENAULT` → marca Renault; `OTRO...`/`OTRA...` → "Otra marca"; cualquier otro valor → marca Nissan, modelo = el valor tal cual |
| `Cliente` | `Customer.name` | Se normaliza a Title Case; se busca coincidencia exacta antes de crear un cliente nuevo |
| `Estatus_Actual` | `WorkOrder.status` (vía `StatusMapping`) | Ver [Configuración](#configuración-mapeo-de-estatus) |
| `Cliente_Espera`, `Lavado` | `WorkOrder.customerWaiting`, `WorkOrder.washNeeded` | `SI`/`NO` → booleano |
| `Técnico` | `Technician` (find-or-create por nombre) | Se asigna a la orden si viene informado |
| `Recep` | `WorkOrder.advisorCode` | Código/iniciales del asesor en el DMS; no se cruza con usuarios de PitStop |
| `Servicio`, `Diagnóstico` | `WorkOrder.notes` | Se concatenan si ambos vienen informados |

**Columnas ignoradas a propósito** (significado no documentado): `Ant` (antigüedad — se puede
derivar de `receivedAt`) y `T` (código numérico sin explicación conocida). Si sabes qué representan,
agrégalas al esquema y al importador.

## Vehículos internos de la agencia (VINs "dummy")

El DMS reutiliza VINs de marcador de posición para las unidades propias de la agencia — por ejemplo
`TMT3MMMMMSCVENTAS` para demos de ventas o `TMT3MMMSCSERVICIO` para la unidad de servicio — a veces
para vehículos físicamente distintos. Por eso `Vehicle.plate` y `Vehicle.vin` **no** tienen
restricción de unicidad en el esquema: el importador identifica un vehículo por la combinación
`(plate, vin)`, no por uno solo. Dos órdenes con el mismo VIN dummy pero placas distintas se tratan
como vehículos distintos; la misma placa y VIN se tratan como el mismo vehículo (visitas repetidas).

## Configuración: mapeo de estatus

Todas las órdenes de un mismo export suelen compartir el mismo `Estatus_Actual` crudo (p. ej. "Por
asignar" cuando aún no se asigna técnico). El importador traduce cada valor usando la tabla
`StatusMapping`; si encuentra uno que no conoce, lo crea automáticamente apuntando a `RECIBIDO` para
no interrumpir la importación. Ve a **Configuración → Mapeo de Estatus del DMS** en la aplicación
para corregir esos mapeos en cuanto el DMS reporte un valor distinto (p. ej. "En proceso", "Terminada",
"Entregada").

## Próximo paso: sincronización automática

Este script está listo para ejecutarse en automático (tarea programada / cron) apuntando a la
ubicación donde el DMS deja sus exports. Falta definir **cómo** el DMS entrega los archivos de forma
recurrente (carpeta compartida con export programado, correo, API, acceso de solo lectura a su base
de datos) para conectar ese mecanismo con este importador.
