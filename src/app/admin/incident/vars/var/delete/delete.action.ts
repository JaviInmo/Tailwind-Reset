"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/libs/db";

// delete.action.ts

export async function handleDeleteVariableAction(id: number) {
    try {
        // Verifica si la variable existe antes de intentar eliminarla
        const variable = await prisma.variable.findUnique({
            where: { id },
        });

        if (!variable) {
            return { success: false, error: "Variable no encontrada" };
        }

        // Elimina la variable
        await prisma.variable.delete({
            where: { id },
        });

        revalidatePath("/admin/variables/createVars");

        return { success: true };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error al eliminar la variable:", error);
        return { success: false, error: errorMessage };
    }
}
