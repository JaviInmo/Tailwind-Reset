"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type CreateUnitData = {
  name: string
}

export async function createUnitAction(data: CreateUnitData) {
  try {
    // Check if a unit with the same name already exists
    const existingUnit = await prisma.unitMeasure.findUnique({
      where: { name: data.name },
    })

    if (existingUnit) {
      return {
        success: false,
        error: "Ya existe una unidad de medida con este nombre",
      }
    }

    // Create the unit
    await prisma.unitMeasure.create({
      data: {
        name: data.name,
      },
    })

    revalidatePath("/admin/unit-measures")
    return { success: true }
  } catch (error) {
    console.error("Error creating unit measure:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
