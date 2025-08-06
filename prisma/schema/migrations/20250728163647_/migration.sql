-- CreateTable
CREATE TABLE "incident_unit_measures" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "unitMeasureId" INTEGER NOT NULL,

    CONSTRAINT "incident_unit_measures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "incident_unit_measures_incidentId_unitMeasureId_key" ON "incident_unit_measures"("incidentId", "unitMeasureId");

-- AddForeignKey
ALTER TABLE "incident_unit_measures" ADD CONSTRAINT "incident_unit_measures_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_unit_measures" ADD CONSTRAINT "incident_unit_measures_unitMeasureId_fkey" FOREIGN KEY ("unitMeasureId") REFERENCES "unidades_medida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
