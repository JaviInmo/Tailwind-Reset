import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

import TablePage from "./VarTable";

export default async function VarPage() {
    await getAuth();

    // Obtener las variables desde la base de datos
    const variables = await prisma.variable.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    // Simplemente pasa los datos a la tabla y no hace la gestión de estado aquí
    return (
        <div className="container">
            {/* <VariableForm /> */}
            <TablePage data={variables} />
        </div>
    );
}
