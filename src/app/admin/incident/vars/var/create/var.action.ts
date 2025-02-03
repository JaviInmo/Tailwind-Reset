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
        
        // Retornamos un error si la variable ya existe
        if (existingVar) {
            return { success: false, error: "La Variable ya existe" };
        }
        
        // Crea la variable si no existe ya
        const variable = await prisma.variable.create({
            data: {
                name: data.name,
            },
        });

        revalidatePath("/admin/incident/vars/var/create");
        return { success: true, variable };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error al registrar la variable:", error);
    
        return { success: false, error: errorMessage };
    }
}