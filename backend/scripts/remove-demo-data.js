/**
 * Elimina las 4 órdenes de demostración creadas por prisma/seed.js (Nissan Sentra/Versa/Kicks/
 * X-Trail para "Ricardo Morales") y, en cascada, los vehículos y el cliente que solo existían
 * para sostener esas órdenes. Las órdenes reales importadas del DMS usan números de orden
 * puramente numéricos, así que el patrón "WO-" identifica de forma segura solo a las de demo.
 */
const prisma = require('../src/config/prisma');

async function main() {
  const demoOrders = await prisma.workOrder.findMany({
    where: { orderNumber: { startsWith: 'WO-' } },
    include: { vehicle: true },
  });

  if (demoOrders.length === 0) {
    console.log('No se encontraron órdenes de demostración (orderNumber que empiece con "WO-").');
    return;
  }

  const vehicleIds = [...new Set(demoOrders.map((o) => o.vehicleId))];
  const customerIds = [...new Set(demoOrders.map((o) => o.vehicle.customerId))];

  await prisma.workOrder.deleteMany({ where: { id: { in: demoOrders.map((o) => o.id) } } });
  console.log(`Eliminadas ${demoOrders.length} orden(es) de demostración:`, demoOrders.map((o) => o.orderNumber));

  let vehiclesRemoved = 0;
  for (const vehicleId of vehicleIds) {
    const remaining = await prisma.workOrder.count({ where: { vehicleId } });
    if (remaining === 0) {
      const v = await prisma.vehicle.delete({ where: { id: vehicleId } });
      vehiclesRemoved += 1;
      console.log(`Vehículo eliminado (sin más órdenes): ${v.brand} ${v.model} — ${v.plate}`);
    }
  }

  let customersRemoved = 0;
  for (const customerId of customerIds) {
    const remaining = await prisma.vehicle.count({ where: { customerId } });
    if (remaining === 0) {
      const c = await prisma.customer.delete({ where: { id: customerId } });
      customersRemoved += 1;
      console.log(`Cliente eliminado (sin más vehículos): ${c.name}`);
    }
  }

  console.log(`\nListo: ${demoOrders.length} orden(es), ${vehiclesRemoved} vehículo(s) y ${customersRemoved} cliente(s) de demostración eliminados.`);
  console.log('Nota: el técnico de demostración ("Ing. Javier S.") no se tocó — bórralo desde Configuración si ya no lo necesitas.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
