"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/libs/db";

type FormSchemaData = {
    name: string;
};

export async function registerAction(data: FormSchemaData) {
    try {
        // Verificar si la variable ya existe
        const existingVar = await prisma.variable.findFirst({
            where: {
                name: data.name,
            },
        });

        if (existingVar) {
            return { success: false, error: "La Variable ya existe" };
        }

        // Crear la variable si no existe
        const variable = await prisma.variable.create({
            data: {
                name: data.name,
            },
        });

        revalidatePath("/admin/incident/vars/var/create");
        return { success: true, variable };
    } catch (error) {
        console.error("Error al registrar la variable:", error);
        return { success: false, error: error instanceof Error ? error.message : "Error inesperado" };
    }
}

export async function updateVariableAction(id: number, name: string) {
    try {
        // Verificar si la variable ya existe con otro ID
        const existingVar = await prisma.variable.findFirst({
            where: {
                name,
                NOT: {
                    id,
                },
            },
        });

        if (existingVar) {
            return { success: false, error: "Ya existe otra variable con este nombre" };
        }

        // Actualizar la variable
        const updatedVariable = await prisma.variable.update({
            where: { id },
            data: { name },
        });

        revalidatePath("/admin/incident/vars/var/create");
        return { success: true, variable: updatedVariable };
    } catch (error) {
        console.error("Error al actualizar la variable:", error);
        return { success: false, error: error instanceof Error ? error.message : "Error inesperado" };
    }
}
