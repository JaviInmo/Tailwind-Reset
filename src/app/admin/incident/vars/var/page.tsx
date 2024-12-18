import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

import TablePage from "./VarTable";

export default async function VarPage() {
    await getAuth();

    const variables = await prisma.variable.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    return (
        <div className="container">
            {/* <VariableForm /> */}
            <TablePage data={variables} />
        </div>
    );
}
