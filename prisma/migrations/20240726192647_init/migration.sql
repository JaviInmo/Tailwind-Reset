-- CreateTable
CREATE TABLE "incidencias" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "provinceId" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "variableId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "unitMeasureId" TEXT,
    "amount" DOUBLE PRECISION,
    "description" TEXT NOT NULL,

    CONSTRAINT "incidencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variables" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variableId" TEXT NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategorias" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "subcategorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades_medida" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "unidades_medida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provincias" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "municipios" ADD CONSTRAINT "municipios_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
