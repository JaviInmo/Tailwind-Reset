import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

import { VariableForm } from "../../createvar/var-form";

export default async function VarPage({ params }: { params: { id: string } }) {
    await getAuth();

    const id = Number(params.id); // Convierte el id a número

    // Recupera la variable que contiene el id desde la base de datos
    const variableData = await prisma.variable.findUnique({
        where: { id: id },
        include: { categories: { include: { subcategories: true } } },
    });

    if (!variableData) {
        // Maneja el caso donde la variable no existe
        return { notFound: true };
    }

    return (
        <VariableForm
            variableData={variableData} // Cambiado de `incidentData` a `variableData`
            // No se pasan datos de provincia
        />
    );
}
