"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/libs/db";

type FormSchemaData = {
    subcategoryId: number; // Cambiado de categoryId a subcategoryId
    name: string;
};

// Registra una nueva segunda subcategoría
export async function registerAction(data: FormSchemaData) {
    try {
        const secondSubcategory = await prisma.secondSubcategory.create({
            data: {
                name: data.name,
                subcategoryId: data.subcategoryId, // Relación con subcategoría
            },
        });

        revalidatePath("/admin/variables/createSecondSubCat");

        return { success: true, secondSubcategory };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error al registrar la segunda subcategoría:", error);
        return { success: false, error: errorMessage };
    }
}

// Obtiene todas las subcategorías disponibles
export async function fetchSubCategories() {
    return await prisma.subcategory.findMany({
        select: {
            id: true,
            name: true,
        },
    });
}

// Obtiene las segundas subcategorías asociadas a una subcategoría específica
export async function fetchSecondSubCategoriesBySubCategory(subcategoryId: number) {
    return await prisma.secondSubcategory.findMany({
        where: {
            subcategoryId: subcategoryId,
        },
        select: {
            id: true,
            name: true,
        },
    });
}
