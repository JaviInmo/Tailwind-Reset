import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

import TablePage from "./catTable";

export default async function CatPage() {
    await getAuth();

    // Obtener las categorías junto con sus variables
    const categorias = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            variable: {
                // Asegúrate de que el modelo esté configurado para permitir esta relación
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    // Mapear las categorías a un formato que incluya la variable como un string
    const categoriasConVariable = categorias.map((categoria) => ({
        id: categoria.id,
        name: categoria.name,
        variable: categoria.variable.name, // Asumiendo que `variable.name` es un string
    }));

    return (
        <div className="container">
            {/* <VariableForm /> */}
            <TablePage data={categoriasConVariable} />
        </div>
    );
}
