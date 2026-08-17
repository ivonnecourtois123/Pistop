/**
 * Deja solo un puñado de órdenes de ejemplo (por orderNumber) y elimina el resto, junto con
 * los vehículos/clientes que queden sin ninguna orden asociada tras la limpieza.
 */
const prisma = require('../src/config/prisma');

const KEEP_ORDER_NUMBERS = ['98986', '94293', '97347'];

async function main() {
  const allOrders = await prisma.workOrder.findMany({ include: { vehicle: true } });
  const toDelete = allOrders.filter((o) => !KEEP_ORDER_NUMBERS.includes(o.orderNumber));

  const vehicleIds = [...new Set(toDelete.map((o) => o.vehicleId))];

  await prisma.workOrder.deleteMany({ where: { id: { in: toDelete.map((o) => o.id) } } });
  console.log(`Eliminadas ${toDelete.length} orden(es). Conservadas: ${KEEP_ORDER_NUMBERS.join(', ')}`);

  let vehiclesRemoved = 0;
  const customerIdsToCheck = new Set();
  for (const vehicleId of vehicleIds) {
    const remaining = await prisma.workOrder.count({ where: { vehicleId } });
    if (remaining === 0) {
      const v = await prisma.vehicle.delete({ where: { id: vehicleId } });
      customerIdsToCheck.add(v.customerId);
      vehiclesRemoved += 1;
    }
  }

  let customersRemoved = 0;
  for (const customerId of customerIdsToCheck) {
    const remaining = await prisma.vehicle.count({ where: { customerId } });
    if (remaining === 0) {
      await prisma.customer.delete({ where: { id: customerId } });
      customersRemoved += 1;
    }
  }

  console.log(`Vehículos huérfanos eliminados: ${vehiclesRemoved}. Clientes huérfanos eliminados: ${customersRemoved}.`);

  const remainingOrders = await prisma.workOrder.findMany({
    include: { vehicle: { include: { customer: true } } },
  });
  console.log('\nÓrdenes que quedaron:');
  remainingOrders.forEach((o) =>
    console.log(`#${o.orderNumber} | ${o.vehicle.brand} ${o.vehicle.model} ${o.vehicle.plate} | ${o.vehicle.customer.name} | status=${o.status}`)
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
