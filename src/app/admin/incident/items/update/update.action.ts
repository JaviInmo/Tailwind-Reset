"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type UpdateData = {
  id: number
  productName: string
  quantity: number
  unitMeasureId: number | null
  incidentId: number
}

export async function updateItemAction(data: UpdateData) {
  try {
    // Ensure the item exists
    const existing = await prisma.incidentItem.findUnique({
      where: { id: data.id },
    })

    if (!existing) {
      return { success: false, error: "Ítem no encontrado" }
    }

    // Update the item
    const item = await prisma.incidentItem.update({
      where: { id: data.id },
      data: {
        productName: data.productName,
        quantity: data.quantity,
        unitMeasureId: data.unitMeasureId,
        incidentId: data.incidentId,
      },
    })

    // Revalidate paths
    revalidatePath("/admin/incident/items")
    revalidatePath("/admin/incident/items/update/[id]")

    return { success: true, item }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado"
    console.error("Error al actualizar el ítem:", error)
    return { success: false, error: errorMessage }
  }
}

// Fetch all incidents for the dropdown
export async function fetchIncidents() {
  return await prisma.incident.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      date: "desc",
    },
  })
}

// Fetch all unit measures for the dropdown
export async function fetchUnitMeasures() {
  return await prisma.unitMeasure.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  })
}
