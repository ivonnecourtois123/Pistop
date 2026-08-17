# PitStop Backend

API REST (Node.js + Express + Prisma) para el rastreador de estatus de servicio automotriz PitStop.

Base de datos: **PostgreSQL** (local vía Docker Compose en desarrollo, administrada en producción — ver `render.yaml` en la raíz del repo para desplegar en Render).

## Requisitos

- Node.js 18+
- PostgreSQL local — la forma más simple es Docker: `docker compose -f ../config/docker-compose.yml up -d` (o usa `scripts/dev.ps1` desde la raíz, que hace esto automáticamente)

## Puesta en marcha

```bash
docker compose -f ../config/docker-compose.yml up -d
cp .env.example .env
npm install
npm run prisma:migrate
npm run seed
npm run dev
```

El servidor queda disponible en `http://localhost:4000`. Usuario de prueba creado por el seed:

- **Email:** asesor@pitstop.mx
- **Password:** pitstop123

## Estructura

```
src/
  config/       Variables de entorno y cliente de Prisma
  middleware/   Autenticación JWT y manejo de errores
  routes/       Definición de endpoints por recurso
  controllers/  Validación (Zod) y orquestación de cada request
  services/     Lógica de negocio y acceso a datos (Prisma)
  utils/        Helpers (JWT, ApiError, orden de estatus)
prisma/
  schema.prisma Modelo de datos
  seed.js       Datos de ejemplo (coinciden con los mockups de Stitch)
tests/          Pruebas con Jest + Supertest
```

Ver [docs/API.md](../docs/API.md) para la referencia completa de endpoints.

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor con recarga automática (nodemon) |
| `npm run prisma:migrate` | Aplica migraciones en desarrollo |
| `npm run prisma:studio` | Explorador visual de la base de datos |
| `npm run seed` | Carga datos de ejemplo |
| `npm test` | Corre las pruebas |
