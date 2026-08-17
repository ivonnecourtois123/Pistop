# PitStop — Rastreador de Estatus de Servicio Automotriz

Aplicación full-stack que da seguimiento en tiempo real al ciclo de vida de una orden de trabajo en un taller automotriz: **Recibido → En Taller → Lavado → Control de Calidad → Terminado → Entregado**.

Este repositorio nació a partir de mockups estáticos generados con Google Stitch (ver [docs/design](docs/design)) y fue convertido en una aplicación real con backend y frontend funcionales.

## Estructura del repositorio

```
├── backend/    API REST — Node.js + Express + Prisma + PostgreSQL
├── frontend/   SPA — React + Vite + Tailwind CSS
├── docs/
│   ├── API.md          Referencia de endpoints
│   ├── ARCHITECTURE.md Arquitectura y modelo de datos
│   └── design/          Mockups originales de Stitch + sistema de diseño (DESIGN.md)
├── config/     docker-compose.yml (PostgreSQL para desarrollo local)
└── scripts/    Scripts de desarrollo
```

Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para el razonamiento detrás de esta organización de carpetas.

## Inicio rápido

Requisitos: Node.js 18+ y PostgreSQL (la forma más simple es Docker).

```bash
# 0. Base de datos (PostgreSQL vía Docker Compose)
docker compose -f config/docker-compose.yml up -d

# 1. Backend
cd backend
cp .env.example .env
npm install
npm run prisma:migrate   # aplica el esquema contra Postgres
npm run seed
npm run dev              # http://localhost:4000

# 2. Frontend (en otra terminal)
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

En Windows con PowerShell también puedes usar `scripts/dev.ps1`, que hace los 3 pasos anteriores automáticamente.

**Usuario de prueba** (creado por el seed): `asesor@pitstop.mx` / `pitstop123`

## Despliegue

- **Frontend** (Netlify): `netlify.toml` en la raíz ya deja listo el build (`frontend` como base, `dist` como publish) y el redirect de SPA para React Router. Solo falta definir la variable de entorno `VITE_API_URL` en Netlify apuntando a la URL pública del backend.
- **Backend** (Render): `render.yaml` en la raíz define un Blueprint que crea el web service y una base PostgreSQL administrada juntos. Al importar el repo en Render, solo falta fijar `CORS_ORIGIN` con la URL del sitio de Netlify (el resto de variables se generan/enlazan automáticamente).

## Documentación

- [Backend](backend/README.md)
- [Frontend](frontend/README.md)
- [API Reference](docs/API.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Importación de órdenes desde el DMS](docs/DMS_IMPORT.md)
- [Sistema de diseño (Kinetic Precision)](docs/design/DESIGN.md)

## Alcance actual

Implementado: autenticación de Service Advisor, órdenes de trabajo con stepper de estatus, búsqueda por orden/placas/VIN, clientes, vehículos, técnicos, estadísticas del día, lista de "Unidades en Proceso", importación idempotente de órdenes reales desde el DMS ([docs/DMS_IMPORT.md](docs/DMS_IMPORT.md)), y una página de **Configuración** para administrar técnicos y el mapeo de estatus del DMS.

Fuera de alcance por ahora (decisión explícita, ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)): Inventario, Agenda y Reportes avanzados — quedan como enlaces deshabilitados en la UI. La sincronización *automática* con el DMS (sin correr el importador a mano) también queda pendiente hasta definir cómo el DMS entrega sus exports de forma recurrente.
