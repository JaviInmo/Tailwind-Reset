import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

import TablePage from "./secondsubcatTable";

export default async function SecondSubCatPage() {
    await getAuth();

    // Obtener las subcategorías junto con sus segundas subcategorías
    const subcategorias = await prisma.subcategory.findMany({
        select: {
            id: true,
            name: true,
            secondSubcategories: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    // Mapear las subcategorías a un formato que incluya la segunda subcategoría como un string
    const subCategoriasConSegundaSubcategoria = subcategorias.flatMap((subcategoria) =>
        subcategoria.secondSubcategories.map((ssc) => ({
            id: ssc.id, // ID de la segunda subcategoría
            name: ssc.name, // Nombre de la segunda subcategoría
            subcategoria: subcategoria.name, // Nombre de la subcategoría padre
        })),
    );

    return (
        <div className="container">
            {/* <VariableForm /> */}
            <TablePage data={subCategoriasConSegundaSubcategoria} />
        </div>
    );
}
