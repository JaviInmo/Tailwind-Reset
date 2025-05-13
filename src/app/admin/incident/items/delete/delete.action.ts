"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

export async function handleDeleteItemAction(id: number) {
  try {
    // Check if the item exists before attempting to delete it
    const item = await prisma.incidentItem.findUnique({
      where: { id },
    })

    if (!item) {
      return { success: false, error: "Ítem no encontrado" }
    }

    // Delete the item
    await prisma.incidentItem.delete({
      where: { id },
    })

    // Revalidate paths
    revalidatePath("/admin/incident/items")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar el ítem:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
