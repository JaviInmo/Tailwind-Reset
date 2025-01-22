-- AlterTable
ALTER TABLE "incidencias" ADD COLUMN     "secondSubcategoryId" INTEGER;

-- CreateTable
CREATE TABLE "secondsubcategorias" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subcategoryId" INTEGER NOT NULL,

    CONSTRAINT "secondsubcategorias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_secondSubcategoryId_fkey" FOREIGN KEY ("secondSubcategoryId") REFERENCES "secondsubcategorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secondsubcategorias" ADD CONSTRAINT "secondsubcategorias_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
