"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

export async function handleDeleteItemAction(id: number) {
  try {
    // Check if the incident exists before attempting to delete it
    const incident = await prisma.incident.findUnique({
      where: { id },
    })

    if (!incident) {
      return { success: false, error: "Incidente no encontrado" }
    }

    // Delete all unit measure relationships first
    await prisma.$executeRaw`
  DELETE FROM incident_unit_measures
  WHERE incident_id = ${id}
`

    // Delete the incident
    await prisma.incident.delete({
      where: { id },
    })

    // Revalidate paths
    revalidatePath("/admin/incident/items")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar el incidente:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
