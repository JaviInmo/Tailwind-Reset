import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

import TablePage from "./subcatTable";

export default async function SubCatPage() {
    await getAuth();

    const subcategorias = await prisma.subcategory.findMany({
        select: {
            id: true,
            name: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    const subCategoriasConVariable = subcategorias.map((subcategoria) => ({
        id: subcategoria.id,
        name: subcategoria.name,
        categoria: subcategoria.category.name,
    }));

    return (
        <div className="container">
            {/* <VariableForm /> */}
            <TablePage data={subCategoriasConVariable} />
        </div>
    );
}
