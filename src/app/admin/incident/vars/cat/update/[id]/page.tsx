import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

import { CatForm } from "../../create/cat-form";

export default async function CatPage({ params }: { params: { id: string } }) {
    await getAuth();

    const id = Number(params.id);

    const variableData = await prisma.variable.findUnique({
        where: { id: id },
        include: { categories: { include: { subcategories: true } } },
    });

    if (!variableData) {
        return { notFound: true };
    }

    return <CatForm variableData={variableData} />;
}
