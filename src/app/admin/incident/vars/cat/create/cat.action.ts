"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/libs/db";

type FormSchemaData = {
    variableId: number;
    name: string;
};

// Registra una nueva categoría
export async function registerAction(data: FormSchemaData) {
    try {
        const category = await prisma.category.create({
            data: {
                name: data.name,
                variableId: data.variableId,
            },
        });

        revalidatePath("/admin/variables/createCateg");

        return { success: true, category };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error al registrar la categoría:", error);
        return { success: false, error: errorMessage };
    }
}

// Obtiene todas las variables disponibles
export async function fetchVariables() {
    return await prisma.variable.findMany({
        select: {
            id: true,
            name: true,
        },
    });
}

// Obtiene las categorías asociadas a una variable específica
export async function fetchCategoriesByVariable(variableId: number) {
    return await prisma.category.findMany({
        where: {
            variableId: variableId,
        },
        select: {
            id: true,
            name: true,
        },
    });
}
