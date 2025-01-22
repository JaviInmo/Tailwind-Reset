/*
  Warnings:

  - The primary key for the `categorias` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `categorias` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `subcategoryId` column on the `incidencias` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `unitMeasureId` column on the `incidencias` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `subcategorias` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `subcategorias` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `unidades_medida` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `unidades_medida` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `variables` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `variables` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `variableId` on the `categorias` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `variableId` on the `incidencias` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `incidencias` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `subcategorias` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "categorias" DROP CONSTRAINT "categorias_variableId_fkey";

-- DropForeignKey
ALTER TABLE "incidencias" DROP CONSTRAINT "incidencias_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "incidencias" DROP CONSTRAINT "incidencias_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "incidencias" DROP CONSTRAINT "incidencias_unitMeasureId_fkey";

-- DropForeignKey
ALTER TABLE "incidencias" DROP CONSTRAINT "incidencias_variableId_fkey";

-- DropForeignKey
ALTER TABLE "subcategorias" DROP CONSTRAINT "subcategorias_categoryId_fkey";

-- AlterTable
ALTER TABLE "categorias" DROP CONSTRAINT "categorias_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "variableId",
ADD COLUMN     "variableId" INTEGER NOT NULL,
ADD CONSTRAINT "categorias_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "incidencias" DROP COLUMN "variableId",
ADD COLUMN     "variableId" INTEGER NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
DROP COLUMN "subcategoryId",
ADD COLUMN     "subcategoryId" INTEGER,
DROP COLUMN "unitMeasureId",
ADD COLUMN     "unitMeasureId" INTEGER;

-- AlterTable
ALTER TABLE "subcategorias" DROP CONSTRAINT "subcategorias_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD CONSTRAINT "subcategorias_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "unidades_medida" DROP CONSTRAINT "unidades_medida_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "unidades_medida_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "variables" DROP CONSTRAINT "variables_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "variables_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_variableId_fkey" FOREIGN KEY ("variableId") REFERENCES "variables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_unitMeasureId_fkey" FOREIGN KEY ("unitMeasureId") REFERENCES "unidades_medida"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_variableId_fkey" FOREIGN KEY ("variableId") REFERENCES "variables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategorias" ADD CONSTRAINT "subcategorias_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
