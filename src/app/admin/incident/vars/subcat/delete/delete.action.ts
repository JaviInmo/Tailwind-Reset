"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/libs/db";

// delete.action.ts

export async function handleDeleteSubCategoryAction(id: number) {
    try {
        // Verifica si la subcategoria existe antes de intentar eliminarla
        const subcategoria = await prisma.subcategory.findUnique({
            where: { id },
        });

        if (!subcategoria) {
            return { success: false, error: "Subcategoría no encontrada" };
        }

        // Elimina la subcategoria
        await prisma.subcategory.delete({
            where: { id },
        });

        revalidatePath("/admin/variables/createSubCat");

        return { success: true };
    } catch (error) {
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Error al eliminar la subcategoría:", error);
        return { success: false, error: errorMessage };
    }
}
