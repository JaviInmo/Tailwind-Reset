"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type RegisterData = {
  productName: string
  quantity: number
  unitMeasureId: number | null
  variableId: number
  categoryId: number
  subcategoryId?: number
  secondSubcategoryId?: number
}

export async function registerAction(data: RegisterData) {
  try {
    // Find all incidents that match the categorization
    const matchingIncidents = await prisma.incident.findMany({
      where: {
        variableId: data.variableId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId || null,
        secondSubcategoryId: data.secondSubcategoryId || null,
      },
      orderBy: {
        date: "desc",
      },
    })

    if (matchingIncidents.length === 0) {
      return {
        success: false,
        error: "No se encontraron incidentes con esta categorización. Por favor, cree un incidente primero.",
      }
    }

    // Use the most recent incident
    const incidentId = matchingIncidents[0].id

    // Create the item associated with the incident
    await prisma.incidentItem.create({
      data: {
        productName: data.productName,
        quantity: data.quantity,
        unitMeasureId: data.unitMeasureId,
        incidentId: incidentId,
      },
    })

    revalidatePath("/admin/incident/items")
    revalidatePath("/admin/incident")
    return { success: true }
  } catch (error) {
    console.error("Error processing item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}

// Fetch all variables and unit measures for the form
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

    return { variables, unitMeasures }
  } catch (error) {
    console.error("Error fetching data:", error)
    return { variables: [], unitMeasures: [] }
  }
}

// Keep these functions for backward compatibility
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
