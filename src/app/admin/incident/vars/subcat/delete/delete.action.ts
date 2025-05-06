"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

export async function handleDeleteSubcategoryAction(id: number) {
  try {
    // Check if the subcategory exists before attempting to delete it
    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
    })

    if (!subcategory) {
      return { success: false, error: "Subcategoría no encontrada" }
    }

    // Delete the subcategory
    await prisma.subcategory.delete({
      where: { id },
    })

    // Revalidate paths
    revalidatePath("/admin/incident/vars/subcat")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar la subcategoría:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
