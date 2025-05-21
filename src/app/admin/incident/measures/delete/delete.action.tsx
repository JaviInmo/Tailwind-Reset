"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

export async function deleteUnitAction(id: number) {
  try {
    // Check if the unit exists
    const unit = await prisma.unitMeasure.findUnique({
      where: { id },
    })

    if (!unit) {
      return { success: false, error: "Unidad de medida no encontrada" }
    }

    // Delete the unit
    await prisma.unitMeasure.delete({
      where: { id },
    })

    // Revalidate paths
    revalidatePath("/admin/unit-measures")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar la unidad de medida:", error)

    // Check if it's a foreign key constraint error
    if (error instanceof Error && error.message.includes("Foreign key constraint failed")) {
      return {
        success: false,
        error: "No se puede eliminar esta unidad porque está siendo utilizada por uno o más ítems",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
