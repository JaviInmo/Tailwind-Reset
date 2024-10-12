import { PrismaClient } from "@prisma/client";

import { readExcelColumn } from "./readexcel";

const prisma = new PrismaClient();

async function main() {
  // Province and Municipality
  const provincias = await readExcelColumn();

  const dbProvinces = await prisma.province.findMany({
    where: { name: { in: provincias.map(({ provincia }) => provincia) } },
  });

  const dbProvincesNames = dbProvinces.map((p) => p.name);

  const newProvinces = provincias.filter(
    (p) => !dbProvincesNames.includes(p.provincia)
  );

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
    "[seed] New provinces and municipalities created: ",
    newProvinces.length
  );
  // // Variable, category and subcategory
  // await prisma.variable.create({
  //     data: {
  //         name: "Reclamos Sociales",
  //         categories: {
  //             create: {
  //                 name: "Transporte",
  //                 subcategories: { create: { name: "something" } },
  //             },
  //         },
  //     },
  // });

  // await prisma.variable.create({
  //     data: {
  //         name: "Proyecto",
  //         categories: {
  //             create: {
  //                 name: "Animalista",
  //                 subcategories: { create: { name: "another subcategory" } },
  //             },
  //         },
  //     },
  // });

  // // variables
  // await prisma.unitMeasure.create({ data: { name: "price" } });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
