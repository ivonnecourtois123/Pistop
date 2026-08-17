# Levanta Postgres (Docker), aplica migraciones/seed y arranca backend + frontend en ventanas separadas.
# Uso: pwsh ./scripts/dev.ps1

$root = Split-Path -Parent $PSScriptRoot

Write-Host "Levantando PostgreSQL con Docker Compose..."
docker compose -f "$root/config/docker-compose.yml" up -d

Write-Host "Instalando dependencias del backend..."
Push-Location "$root/backend"
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm run prisma:migrate
npm run seed
Pop-Location

Write-Host "Instalando dependencias del frontend..."
Push-Location "$root/frontend"
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
Pop-Location

Write-Host "Iniciando backend (puerto 4000) y frontend (puerto 5173) en nuevas ventanas..."
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$root/backend'; npm run dev"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$root/frontend'; npm run dev"
