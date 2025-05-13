"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type RegisterData = {
  id?: number
  productName: string
  quantity: number
  unitMeasureId: number | null
  incidentId: number
}

export async function registerAction(data: RegisterData) {
  try {
    // If we have an ID, we're updating an existing item
    if (data.id) {
      const item = await prisma.incidentItem.findUnique({
        where: { id: data.id },
      })

      if (!item) {
        return { success: false, error: "Ítem no encontrado" }
      }

      // Update the item
      await prisma.incidentItem.update({
        where: { id: data.id },
        data: {
          productName: data.productName,
          quantity: data.quantity,
          unitMeasureId: data.unitMeasureId,
          incidentId: data.incidentId,
        },
      })

      revalidatePath("/admin/incident/items")
      return { success: true }
    }

    // Creating a new item
    await prisma.incidentItem.create({
      data: {
        productName: data.productName,
        quantity: data.quantity,
        unitMeasureId: data.unitMeasureId,
        incidentId: data.incidentId,
      },
    })

    revalidatePath("/admin/incident/items")
    return { success: true }
  } catch (error) {
    console.error("Error processing item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}

// Fetch all incidents for the dropdown
export async function fetchIncidents() {
  try {
    const incidents = await prisma.incident.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        date: "desc",
      },
    })

    return incidents
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return []
  }
}

// Fetch all unit measures for the dropdown
export async function fetchUnitMeasures() {
  try {
    const unitMeasures = await prisma.unitMeasure.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return unitMeasures
  } catch (error) {
    console.error("Error fetching unit measures:", error)
    return []
  }
}
