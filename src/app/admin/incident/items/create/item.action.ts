"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type RegisterData = {
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

export async function registerAction(data: RegisterData) {
  try {
    // Create the incident
    const incident = await prisma.incident.create({
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

    // Create the incident-unit measure relationships if any unit measures are selected
    if (data.unitMeasureIds.length > 0) {
      // Create each relationship individually instead of using createMany
      for (const unitMeasureId of data.unitMeasureIds) {
        await prisma.$executeRaw`
          INSERT INTO incident_unit_measures (incident_id, unit_measure_id)
          VALUES (${incident.id}, ${unitMeasureId})
        `
      }
    }

    revalidatePath("/admin/incident/items")
    revalidatePath("/admin/incident")
    return { success: true }
  } catch (error) {
    console.error("Error processing incident:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
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
