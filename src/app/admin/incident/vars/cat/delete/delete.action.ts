"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/libs/db"

// delete.action.ts

export async function handleDeleteCategoryAction(id: number) {
  try {
    // Verifica si la variable existe antes de intentar eliminarla
    const variable = await prisma.category.findUnique({
      where: { id },
    })

    if (!variable) {
      return { success: false, error: "Categoría no encontrada" }
    }

    // Elimina la variable
    await prisma.category.delete({
      where: { id },
    })

    // Update the revalidation path to include the main listing page
    revalidatePath("/admin/incident/vars/cat")

    return { success: true }
  } catch (error) {
    let errorMessage = "An unexpected error occurred"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    console.error("Error al eliminar la categoría:", error)
    return { success: false, error: errorMessage }
  }
}
