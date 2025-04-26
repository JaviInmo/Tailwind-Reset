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
        console.log("Registering category with data:", data);

        const existingCategory = await prisma.category.findFirst({
            where: {
                name: data.name,
                variableId: data.variableId,
            },
        });

        if (existingCategory) {
            console.log("Category already exists:", existingCategory);
            return { success: false, error: "La categoría ya existe para esta variable." };
        }

        const category = await prisma.category.create({
            data: {
                name: data.name,
                variableId: data.variableId,
            },
        });

        console.log("Category created successfully:", category);

        revalidatePath("/admin/incident/vars/cat");

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
    try {
        const variables = await prisma.variable.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        console.log("Variables from database:", variables);
        return variables;
    } catch (error) {
        console.error("Error fetching variables:", error);
        return [];
    }
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
