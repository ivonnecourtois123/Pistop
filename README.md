# PitStop — Rastreador de Estatus de Servicio Automotriz

**PitStop** es una aplicación full-stack diseñada para dar seguimiento y control en tiempo real al flujo y ciclo de vida de las órdenes de servicio en un taller automotriz:

$$\text{Recibido} \longrightarrow \text{En Taller} \longrightarrow \text{Lavado} \longrightarrow \text{Control de Calidad} \longrightarrow \text{Terminado} \longrightarrow \text{Entregado}$$

---

## 👩‍💻 Autoría y Desarrollo

- **Desarrolladora / Autora:** Ivonne Courtois ([@ivonnecourtois123](https://github.com/ivonnecourtois123))
- **Correo de contacto:** `mejora.continua2@chesa.mx`
- **Organización / Proyecto:** PitStop Tracker

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios.
- **Backend:** Node.js, Express, Prisma ORM, JWT, Zod, Helmet, Morgan.
- **Base de Datos:** PostgreSQL (Docker en desarrollo, Render en producción).
- **Despliegue:** Netlify (Frontend) + Render (Backend & PostgreSQL).

---

## 📁 Estructura del Repositorio

```
PitStop/
├── backend/            # API REST (Node.js, Express, Prisma, PostgreSQL)
│   ├── prisma/         # Esquema Prisma, migraciones y seed
│   ├── src/            # Controladores, rutas, servicios y middlewares
│   └── tests/          # Pruebas unitarias y de integración (Jest)
├── frontend/           # SPA (React, Vite, Tailwind CSS)
│   └── src/            # Componentes, vistas, hooks y API client
├── docs/               # Documentación técnica y sistema de diseño
│   ├── API.md          # Referencia completa de endpoints REST
│   ├── ARCHITECTURE.md # Arquitectura del sistema y modelos
│   ├── DMS_IMPORT.md   # Guía de importación de órdenes DMS
│   └── design/         # Mockups de Stitch y especificación de diseño
├── config/             # docker-compose.yml para PostgreSQL local
├── scripts/            # Scripts utilitarios y de automatización
├── netlify.toml        # Configuración de despliegue en Netlify
└── render.yaml         # Blueprint de infraestructura en Render
```

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Requisitos previos
- **Node.js** v18 o superior
- **Docker & Docker Compose** (para PostgreSQL local) o un servidor PostgreSQL activo

### 1. Iniciar Base de Datos
```bash
docker compose -f config/docker-compose.yml up -d
```

### 2. Configurar y Levantar Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run seed
npm run dev
```
*El backend se ejecutará en: `http://localhost:4000`*  
*Usuario de prueba (generado por el seed):* `asesor@pitstop.mx` / `pitstop123`

### 3. Configurar y Levantar Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```
*El frontend se ejecutará en: `http://localhost:5173`*

---

## 📚 Documentación

- [Referencia de API REST](docs/API.md)
- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Importación desde DMS](docs/DMS_IMPORT.md)
- [Guía de Backend](backend/README.md)
- [Guía de Frontend](frontend/README.md)

---

## 📄 Licencia

Desarrollado y mantenido por **Ivonne Courtois** (@ivonnecourtois123). Todos los derechos reservados.
