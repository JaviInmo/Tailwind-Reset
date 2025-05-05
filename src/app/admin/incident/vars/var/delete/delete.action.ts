"use server"

import prisma from "@/libs/db"
import { revalidatePath } from "next/cache"

export async function handleDeleteVariableAction(id: number) {
  try {
    // Check if the variable exists before attempting to delete it
    const variable = await prisma.variable.findUnique({
      where: { id },
    })

    if (!variable) {
      return { success: false, error: "Variable no encontrada" }
    }

    // Delete the variable
    await prisma.variable.delete({
      where: { id },
    })

    // Revalidate the paths where variables are displayed
    revalidatePath("/admin/incident/vars/var")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar la variable:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
