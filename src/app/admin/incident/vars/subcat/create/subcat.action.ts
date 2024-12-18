"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/libs/db";

type FormSchemaData = {
    categoryId: number;
    name: string;
};

// Registra una nueva categoría
export async function registerAction(data: FormSchemaData) {
    try {
        const subcategory = await prisma.subcategory.create({
            data: {
                name: data.name,
                categoryId: data.categoryId,
            },
        });

        revalidatePath("/admin/variables/createSubCat");

        return { success: true, subcategory };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error al registrar la subcategoría:", error);
        return { success: false, error: errorMessage };
    }
}

// Obtiene todas las categorias disponibles
export async function fetchCategory() {
    return await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
    });
}

// Obtiene las subcategorías asociadas a una variable específica
export async function fetchSubCategoriesByCategory(categoryId: number) {
    return await prisma.subcategory.findMany({
        where: {
            categoryId: categoryId,
        },
        select: {
            id: true,
            name: true,
        },
    });
}
