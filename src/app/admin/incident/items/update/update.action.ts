"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type UpdateData = {
  id: number
  title: string
  description: string
  variableId: number
  categoryId: number
  subcategoryId?: number
  secondSubcategoryId?: number
  unitMeasureIds: number[]
  provinceId: string
  municipalityId: string
  numberOfPeople?: number
  date: Date
}

export async function updateItemAction(data: UpdateData) {
  try {
    // Ensure the incident exists
    const existing = await prisma.incident.findUnique({
      where: { id: data.id },
    })

    if (!existing) {
      return { success: false, error: "Incidente no encontrado" }
    }

    // Update the incident
    const incident = await prisma.incident.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        variableId: data.variableId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId || null,
        secondSubcategoryId: data.secondSubcategoryId || null,
        provinceId: data.provinceId,
        municipalityId: data.municipalityId,
        numberOfPeople: data.numberOfPeople || null,
        date: data.date,
      },
    })

    // Delete all existing unit measure relationships
    await prisma.$executeRaw`
      DELETE FROM incident_unit_measures
      WHERE incident_id = ${data.id}
    `

    // Create new unit measure relationships if any are selected
    if (data.unitMeasureIds.length > 0) {
      for (const unitMeasureId of data.unitMeasureIds) {
        await prisma.$executeRaw`
          INSERT INTO incident_unit_measures (incident_id, unit_measure_id)
          VALUES (${incident.id}, ${unitMeasureId})
        `
      }
    }

    // Revalidate paths
    revalidatePath("/admin/incident/items")
    revalidatePath("/admin/incident/items/update/[id]")

    return { success: true, incident }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado"
    console.error("Error al actualizar el incidente:", error)
    return { success: false, error: errorMessage }
  }
}

// Fetch all variables, unit measures, and provinces for the form
export async function fetchVariables() {
  try {
    const variables = await prisma.variable.findMany({
      include: {
        categories: {
          include: {
            subcategories: {
              include: {
                secondSubcategories: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    const unitMeasures = await prisma.unitMeasure.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    const provinces = await prisma.province.findMany({
      include: {
        municipalities: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return { variables, unitMeasures, provinces }
  } catch (error) {
    console.error("Error fetching data:", error)
    return { variables: [], unitMeasures: [], provinces: [] }
  }
}
