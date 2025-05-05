"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

export async function handleDeleteCategoryAction(id: number) {
  try {
    // Check if the category exists before attempting to delete it
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return { success: false, error: "Categoría no encontrada" }
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    })

    // Revalidate paths
    revalidatePath("/admin/incident/vars/cat")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar la categoría:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
