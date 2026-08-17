/**
 * Devuelve las 3 órdenes de prueba (WO-TEST-01..03) a su estado inicial limpio y las re-fecha
 * como ingresadas hoy.
 *
 * Útil de forma recurrente: como el grupo "Ingresadas Hoy" filtra por `receivedAt`, al cambiar
 * el día las órdenes de prueba caen a "Rezagadas" y dejan de servir para probar el tablero.
 *
 * Escribe directo en la base porque el API solo permite avanzar el estatus, nunca retroceder.
 */
const prisma = require('../src/config/prisma');

const now = new Date();
function todayAt(hour, minute = 0) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
}

// Horas de ingreso escalonadas para que "Hace X" y el desempate FIFO se distingan entre sí.
const BASELINE = [
  { orderNumber: 'WO-TEST-01', status: 'RECIBIDO', receivedAt: todayAt(8, 0) },
  { orderNumber: 'WO-TEST-02', status: 'EN_TALLER', receivedAt: todayAt(8, 30) },
  { orderNumber: 'WO-TEST-03', status: 'LAVADO', receivedAt: todayAt(9, 0) },
];

async function main() {
  for (const { orderNumber, status, receivedAt } of BASELINE) {
    const existing = await prisma.workOrder.findUnique({ where: { orderNumber } });
    if (!existing) {
      console.log(`${orderNumber}: no existe, se omite (corre add-test-orders.js primero).`);
      continue;
    }

    // Historial: se rehace desde cero para que las marcas de tiempo del stepper coincidan
    // con el estatus al que estamos regresando la orden.
    await prisma.statusEvent.deleteMany({ where: { workOrderId: existing.id } });
    await prisma.stageComment.deleteMany({ where: { workOrderId: existing.id } });

    await prisma.workOrder.update({
      where: { id: existing.id },
      data: {
        status,
        receivedAt,
        subState: null,
        estimatedDeliveryAt: null,
        deliveredAt: null,
        customerWaiting: null,
        partsNeeded: null,
        partsReady: null,
        serviceCategory: null,
        orderType: 'SERVICIO',
        statusEvents: { create: { status, occurredAt: receivedAt } },
      },
    });

    console.log(`${orderNumber}: ${status}, ingresada ${receivedAt.toLocaleTimeString('es-MX')} — campos de priorización limpios.`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
