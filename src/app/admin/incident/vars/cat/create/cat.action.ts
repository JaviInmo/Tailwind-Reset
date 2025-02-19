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
        // Verificar si ya existe una categoría con el mismo nombre para la misma variable
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: data.name,
                variableId: data.variableId,
            },
        });

        if (existingCategory) {
            return { success: false, error: "La categoría ya existe para esta variable." };
        }

        // Crear la categoría si no existe
        const category = await prisma.category.create({
            data: {
                name: data.name,
                variableId: data.variableId,
            },
        });

        revalidatePath("/admin/incident/vars/cat/create");

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

export async function updateCategoryAction(id: number, name: string) {
    try{
        // Verificar si ya existe una categoría con el mismo nombre para la misma variable
        const existingCategory = await prisma.category.findFirst({
            where: {
                name,
                NOT: {
                    id,
                },
            },
        });
        if (existingCategory) {
            return { success: false, error: "Ya existe otra categoría con este nombre" };
        }
        // Actualizar la categoría
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name },
        });
        revalidatePath("/admin/incident/vars/cat/create");
        return { success: true, category: updatedCategory };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error("Error al actualizar la categoría:", error);
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
