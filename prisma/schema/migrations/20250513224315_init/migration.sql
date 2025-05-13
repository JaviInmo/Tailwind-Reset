-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SIMPLE', 'ADVANCED', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SIMPLE',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "id" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "expires" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "incidencias" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "provinceId" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "variableId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "subcategoryId" INTEGER,
    "secondSubcategoryId" INTEGER,
    "numberOfPeople" INTEGER,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "incidencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_items" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitMeasureId" INTEGER,
    "incidentId" INTEGER NOT NULL,

    CONSTRAINT "incident_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "variableId" INTEGER NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategorias" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "subcategorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secondsubcategorias" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subcategoryId" INTEGER NOT NULL,

    CONSTRAINT "secondsubcategorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades_medida" (
    "id" SERIAL NOT NULL,
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

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "personalPhone" TEXT NOT NULL,
    "statePhone" TEXT NOT NULL,
    "landlinePhone" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "workplace" TEXT NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_medida_name_key" ON "unidades_medida"("name");

-- CreateIndex
CREATE UNIQUE INDEX "provincias_name_key" ON "provincias"("name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_secondSubcategoryId_fkey" FOREIGN KEY ("secondSubcategoryId") REFERENCES "secondsubcategorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_items" ADD CONSTRAINT "incident_items_unitMeasureId_fkey" FOREIGN KEY ("unitMeasureId") REFERENCES "unidades_medida"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_items" ADD CONSTRAINT "incident_items_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_variableId_fkey" FOREIGN KEY ("variableId") REFERENCES "variables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategorias" ADD CONSTRAINT "subcategorias_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secondsubcategorias" ADD CONSTRAINT "secondsubcategorias_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipios" ADD CONSTRAINT "municipios_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
