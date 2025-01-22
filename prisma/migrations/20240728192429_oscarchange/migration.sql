/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `municipios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `provincias` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `unidades_medida` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "municipios_name_key" ON "municipios"("name");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_name_key" ON "provincias"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_medida_name_key" ON "unidades_medida"("name");
