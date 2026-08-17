-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADVISOR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "color" TEXT,
    "plate" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "logoUrl" TEXT,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicians" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT,
    "team" TEXT NOT NULL DEFAULT 'SERVICIO',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capacity_settings" (
    "id" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "hoursPerDay" DOUBLE PRECISION,
    "efficiency" DOUBLE PRECISION,
    "productivity" DOUBLE PRECISION,
    "unitsPerTechnician" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capacity_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_category_hours" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "service_category_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "orderType" TEXT NOT NULL DEFAULT 'SERVICIO',
    "status" TEXT NOT NULL DEFAULT 'RECIBIDO',
    "subState" TEXT,
    "notes" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedDeliveryAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dmsStatus" TEXT,
    "serviceType" TEXT,
    "partsNeeded" BOOLEAN,
    "customerWaiting" BOOLEAN,
    "washNeeded" BOOLEAN,
    "advisorCode" TEXT,
    "partsReady" BOOLEAN,
    "serviceCategory" TEXT,
    "diagnosisNeeded" BOOLEAN,
    "insurer" TEXT,
    "reportNumber" TEXT,
    "vehicleId" TEXT NOT NULL,
    "technicianId" TEXT,
    "technicianAssignedAt" TIMESTAMP(3),
    "advisorId" TEXT,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_parts" (
    "id" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "partNumber" TEXT NOT NULL,
    "description" TEXT,
    "orderNumber" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "received" BOOLEAN NOT NULL DEFAULT false,
    "receivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pending_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_events" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "workOrderId" TEXT NOT NULL,

    CONSTRAINT "status_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stage_comments" (
    "id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workOrderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "stage_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_mappings" (
    "id" TEXT NOT NULL,
    "dmsStatus" TEXT NOT NULL,
    "internalStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immobilized_units" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "damageDate" TIMESTAMP(3) NOT NULL,
    "treatmentType" TEXT NOT NULL,
    "dmsReportNumber" TEXT,
    "description" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "registeredById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "immobilized_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immobilized_comments" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immobilizedUnitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "immobilized_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_cases" (
    "id" TEXT NOT NULL,
    "immobilizedUnitId" TEXT NOT NULL,
    "reportNumber" TEXT,
    "insurer" TEXT,
    "policyType" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'ENVIO_PRESUPUESTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_stage_comments" (
    "id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "insuranceCaseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "insurance_stage_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_documents" (
    "id" TEXT NOT NULL,
    "insuranceCaseId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "insurance_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "vehicles_customerId_idx" ON "vehicles"("customerId");

-- CreateIndex
CREATE INDEX "vehicles_plate_idx" ON "vehicles"("plate");

-- CreateIndex
CREATE INDEX "vehicles_vin_idx" ON "vehicles"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "capacity_settings_team_key" ON "capacity_settings"("team");

-- CreateIndex
CREATE UNIQUE INDEX "service_category_hours_category_key" ON "service_category_hours"("category");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_orderNumber_key" ON "work_orders"("orderNumber");

-- CreateIndex
CREATE INDEX "work_orders_status_idx" ON "work_orders"("status");

-- CreateIndex
CREATE INDEX "work_orders_receivedAt_idx" ON "work_orders"("receivedAt");

-- CreateIndex
CREATE INDEX "pending_parts_workOrderId_idx" ON "pending_parts"("workOrderId");

-- CreateIndex
CREATE INDEX "status_events_workOrderId_idx" ON "status_events"("workOrderId");

-- CreateIndex
CREATE INDEX "stage_comments_workOrderId_idx" ON "stage_comments"("workOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "status_mappings_dmsStatus_key" ON "status_mappings"("dmsStatus");

-- CreateIndex
CREATE INDEX "immobilized_units_treatmentType_idx" ON "immobilized_units"("treatmentType");

-- CreateIndex
CREATE INDEX "immobilized_units_resolved_idx" ON "immobilized_units"("resolved");

-- CreateIndex
CREATE INDEX "immobilized_comments_immobilizedUnitId_idx" ON "immobilized_comments"("immobilizedUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_cases_immobilizedUnitId_key" ON "insurance_cases"("immobilizedUnitId");

-- CreateIndex
CREATE INDEX "insurance_stage_comments_insuranceCaseId_idx" ON "insurance_stage_comments"("insuranceCaseId");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_documents_insuranceCaseId_docType_key" ON "insurance_documents"("insuranceCaseId", "docType");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technicians"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_parts" ADD CONSTRAINT "pending_parts_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_events" ADD CONSTRAINT "status_events_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_comments" ADD CONSTRAINT "stage_comments_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_comments" ADD CONSTRAINT "stage_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobilized_units" ADD CONSTRAINT "immobilized_units_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobilized_units" ADD CONSTRAINT "immobilized_units_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobilized_comments" ADD CONSTRAINT "immobilized_comments_immobilizedUnitId_fkey" FOREIGN KEY ("immobilizedUnitId") REFERENCES "immobilized_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immobilized_comments" ADD CONSTRAINT "immobilized_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_cases" ADD CONSTRAINT "insurance_cases_immobilizedUnitId_fkey" FOREIGN KEY ("immobilizedUnitId") REFERENCES "immobilized_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_stage_comments" ADD CONSTRAINT "insurance_stage_comments_insuranceCaseId_fkey" FOREIGN KEY ("insuranceCaseId") REFERENCES "insurance_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_stage_comments" ADD CONSTRAINT "insurance_stage_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_documents" ADD CONSTRAINT "insurance_documents_insuranceCaseId_fkey" FOREIGN KEY ("insuranceCaseId") REFERENCES "insurance_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

