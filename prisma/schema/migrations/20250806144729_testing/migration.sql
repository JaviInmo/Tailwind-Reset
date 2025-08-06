/*
  Warnings:

  - You are about to drop the column `quantity` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `unitMeasureId` on the `items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_unitMeasureId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "quantity",
DROP COLUMN "unitMeasureId";

-- CreateTable
CREATE TABLE "item_unit_measures" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "unitMeasureId" INTEGER NOT NULL,

    CONSTRAINT "item_unit_measures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_unit_measures_itemId_unitMeasureId_key" ON "item_unit_measures"("itemId", "unitMeasureId");

-- AddForeignKey
ALTER TABLE "item_unit_measures" ADD CONSTRAINT "item_unit_measures_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_unit_measures" ADD CONSTRAINT "item_unit_measures_unitMeasureId_fkey" FOREIGN KEY ("unitMeasureId") REFERENCES "unidades_medida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
