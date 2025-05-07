import { getAuth } from "@/libs/auth";
import { notFound } from "next/navigation"
import prisma from "@/libs/db";

import { SecondSubcategoryUpdateForm } from "../../update/cat-form";

export default async function UpdateSecondSubCatPage(props: { params: { id: string } }) {
    await getAuth();

    // Check if the second subcategory exists before rendering the form
    const id = Number(props.params.id);
    const secondSubcategoryData = await prisma.secondSubcategory.findUnique({
        where: { id },
        include: {
            subcategory: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (!secondSubcategoryData) {
        return notFound();
    }

    return <SecondSubcategoryUpdateForm secondSubcategoryData={secondSubcategoryData} />;

}
