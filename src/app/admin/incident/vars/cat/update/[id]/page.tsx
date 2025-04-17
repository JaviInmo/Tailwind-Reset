import { getAuth } from "@/libs/auth";
import prisma from "@/libs/db";

import { CatForm } from "../../create/cat-form";

export default async function CatPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
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
