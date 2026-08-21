const API_URL = process.env.API_URL || 'https://pitstop-backend-67zd.onrender.com/api';

async function list() {
  const login = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'asesor@pitstop.mx', password: 'pitstop123' }),
  }).then((r) => r.json());

  const orders = await fetch(`${API_URL}/work-orders/in-progress?orderType=SERVICIO`, {
    headers: { Authorization: `Bearer ${login.token}` },
  }).then((r) => r.json());

  console.log(`\nTotal de órdenes en proceso en el sistema: ${orders.length}\n`);
  for (const o of orders) {
    const isToday = new Date(o.receivedAt).toDateString() === new Date().toDateString();
    const section = isToday ? 'INGRESADAS HOY' : 'REZAGADAS';
    console.log(
      `[${section}] #${o.orderNumber} - ${o.vehicle.brand} ${o.vehicle.model} (${o.vehicle.plate}) | Cliente: ${o.vehicle.customer?.name} | Estatus: ${o.status}`
    );
  }
}

list().catch(console.error);
