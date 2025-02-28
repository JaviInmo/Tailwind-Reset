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

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
