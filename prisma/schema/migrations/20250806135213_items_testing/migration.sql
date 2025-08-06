/*
  Warnings:

  - You are about to drop the column `productName` on the `incident_items` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `incident_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[incidentId,itemId]` on the table `incident_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `incident_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "incident_items" DROP COLUMN "productName",
DROP COLUMN "quantity",
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD COLUMN     "quantityUsed" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitMeasureId" INTEGER,
    "variableId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "subcategoryId" INTEGER NOT NULL,
    "secondSubcategoryId" INTEGER,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_productName_variableId_categoryId_subcategoryId_secon_key" ON "items"("productName", "variableId", "categoryId", "subcategoryId", "secondSubcategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "incident_items_incidentId_itemId_key" ON "incident_items"("incidentId", "itemId");

-- AddForeignKey
ALTER TABLE "incident_items" ADD CONSTRAINT "incident_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_unitMeasureId_fkey" FOREIGN KEY ("unitMeasureId") REFERENCES "unidades_medida"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_variableId_fkey" FOREIGN KEY ("variableId") REFERENCES "variables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_secondSubcategoryId_fkey" FOREIGN KEY ("secondSubcategoryId") REFERENCES "secondsubcategorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
