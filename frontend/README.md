# PitStop Frontend

React + Vite + Tailwind. Implementa el dashboard de estatus de servicio a partir de la variante **compacta** de los mockups de Stitch (ver [docs/design](../docs/design)), conectado al backend real.

## Puesta en marcha

```bash
cp .env.example .env
npm install
npm run dev
```

Corre en `http://localhost:5173`. Requiere el backend corriendo en `http://localhost:4000` (ver [../backend/README.md](../backend/README.md)).

## Estructura

```
src/
  api/          Cliente Axios + funciones por recurso (auth, work-orders, customers, vehicles, technicians)
  context/      AuthContext (login/logout, persistencia de sesión en localStorage)
  components/
    layout/     TopNavBar, FloatingActionButton
    dashboard/  SearchBar, VehicleStatusCard, ProgressStepper, QuickActionsGrid, StatsTiles, SearchResultsList
    workorders/ NewWorkOrderModal
    common/     ProtectedRoute, Spinner
  pages/        LoginPage, DashboardPage, NotFoundPage
  hooks/        useDebounce
```

## Notas de diseño

Los tokens de color/tipografía/espaciado en `tailwind.config.js` son una copia exacta de los definidos en `docs/design/DESIGN.md` (sistema "Kinetic Precision"), para que la UI final no se desvíe del diseño aprobado en Stitch.

Los enlaces de navegación "Work Orders", "Inventory", "Scheduling" y "Reporting", así como los tiles "Inventario" y "Agenda" del bento grid, se dejaron deshabilitados (`Próximamente`) porque quedaron fuera del alcance inicial acordado — solo se implementó el tracker de estatus con órdenes de trabajo, vehículos, clientes y técnicos.
