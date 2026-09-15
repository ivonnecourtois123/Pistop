-- AlterTable
ALTER TABLE "immobilized_units" ADD COLUMN "agency" TEXT;

-- CreateIndex
CREATE INDEX "immobilized_units_agency_idx" ON "immobilized_units"("agency");
