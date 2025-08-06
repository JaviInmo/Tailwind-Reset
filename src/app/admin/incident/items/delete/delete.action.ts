"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

export async function handleDeleteItemAction(id: number) { // Eliminado currentIds
  try {
    // Elimina el ítem
    await prisma.item.delete({
      where: { id },
    })

    // Revalidar la ruta de la lista de ítems
    revalidatePath("/admin/items")

    // Retornamos solo el éxito
    return { success: true }
  } catch (error) {
    let errorMessage = "Ocurrió un error inesperado"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error al eliminar el ítem:", error)
    return { success: false, error: errorMessage }
  }
}
