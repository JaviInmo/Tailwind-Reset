"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/libs/db";

// delete.action.ts

export async function handleDeleteSecondSubCategoryAction(id: number) {
    try {
        // Verifica si la segunda subcategoría existe antes de intentar eliminarla
        const secondSubcategory = await prisma.secondSubcategory.findUnique({
            where: { id },
        });

        if (!secondSubcategory) {
            return { success: false, error: "Segunda subcategoría no encontrada" };
        }

        // Elimina la segunda subcategoría
        await prisma.secondSubcategory.delete({
            where: { id },
        });

        // Revalida el caché de la página donde se creó/mostraba la segunda subcategoría
        revalidatePath("/admin/variables/createSecondSubCat");

        return { success: true };
    } catch (error) {
        console.error("Error al eliminar la segunda subcategoría:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Error inesperado",
        };
    }
}
