"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type UpdateUnitData = {
  id: number
  name: string
}

export async function updateUnitAction(data: UpdateUnitData) {
  try {
    // Check if the unit exists
    const existingUnit = await prisma.unitMeasure.findUnique({
      where: { id: data.id },
    })

    if (!existingUnit) {
      return {
        success: false,
        error: "Unidad de medida no encontrada",
      }
    }

    // Check if another unit with the same name already exists
    const duplicateUnit = await prisma.unitMeasure.findFirst({
      where: {
        name: data.name,
        id: { not: data.id },
      },
    })

    if (duplicateUnit) {
      return {
        success: false,
        error: "Ya existe otra unidad de medida con este nombre",
      }
    }

    // Update the unit
    await prisma.unitMeasure.update({
      where: { id: data.id },
      data: {
        name: data.name,
      },
    })

    revalidatePath("/admin/unit-measures")
    return { success: true }
  } catch (error) {
    console.error("Error updating unit measure:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
