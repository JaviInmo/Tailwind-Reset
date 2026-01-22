import { PrismaClient } from "@prisma/client";
import { readExcelColumn } from "./readexcel.ts";

const prisma = new PrismaClient();

async function main() {
  console.log("[seed] Iniciando proceso de seed...");

  // Leer provincias y municipios desde el Excel
  const provincias = await readExcelColumn();
  console.log("[seed] Provincias leídas del Excel:", provincias);

  // Buscar provincias ya existentes en la base de datos
  const dbProvinces = await prisma.province.findMany({
    where: { name: { in: provincias.map(({ provincia }) => provincia) } },
  });
  console.log("[seed] Provincias ya existentes en la base de datos:", dbProvinces);

  const dbProvincesNames = dbProvinces.map((p) => p.name);

  // Filtrar provincias nuevas que no están en la base de datos
  const newProvinces = provincias.filter(
    (p) => !dbProvincesNames.includes(p.provincia)
  );
  console.log("[seed] Provincias nuevas a insertar:", newProvinces);

  // Insertar nuevas provincias y sus municipios
  await Promise.all(
    newProvinces.map(({ municipios, provincia }) =>
      prisma.province.create({
        data: {
          name: provincia,
          municipalities: {
            createMany: {
              data: municipios.map((municipio) => ({ name: municipio })),
            },
          },
        },
      })
    )
  );

  console.log(
    `[seed] Provincias y municipios insertados correctamente: ${newProvinces.length}`
  );

  // Puedes descomentar estas secciones si quieres insertar variables y unidades de medida también
  /*
  console.log("[seed] Insertando variables y categorías...");
  await prisma.variable.create({
    data: {
      name: "Reclamos Sociales",
      categories: {
        create: {
          name: "Transporte",
          subcategories: { create: { name: "something" } },
        },
      },
    },
  });

  await prisma.variable.create({
    data: {
      name: "Proyecto",
      categories: {
        create: {
          name: "Animalista",
          subcategories: { create: { name: "another subcategory" } },
        },
      },
    },
  });

  console.log("[seed] Insertando unidad de medida...");
  await prisma.unitMeasure.create({ data: { name: "price" } });
  */
}

main()
  .then(async () => {
    console.log("[seed] Seed ejecutado con éxito.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("[seed] Error durante el seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
