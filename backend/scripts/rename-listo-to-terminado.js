/**
 * Migración de datos única: renombra el estatus interno "LISTO" a "TERMINADO" en registros
 * existentes, tras agregar la etapa "CONTROL_CALIDAD" antes de "TERMINADO" en el pipeline.
 */
const prisma = require('../src/config/prisma');

async function main() {
  const workOrders = await prisma.workOrder.updateMany({
    where: { status: 'LISTO' },
    data: { status: 'TERMINADO' },
  });
  const statusEvents = await prisma.statusEvent.updateMany({
    where: { status: 'LISTO' },
    data: { status: 'TERMINADO' },
  });
  const statusMappings = await prisma.statusMapping.updateMany({
    where: { internalStatus: 'LISTO' },
    data: { internalStatus: 'TERMINADO' },
  });

  console.log(
    `Actualizado: ${workOrders.count} orden(es), ${statusEvents.count} evento(s) de estatus, ${statusMappings.count} mapeo(s).`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
