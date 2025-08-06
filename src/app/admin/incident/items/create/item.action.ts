"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type CreateItemData = {
  productName: string
  variableId: number
  categoryId: number
  subcategoryId: number
  secondSubcategoryId: number | null
  unitMeasureIds: number[] // Nuevo campo para las unidades de medida disponibles
}

export async function createItemAction(data: CreateItemData) {
  try {
    await prisma.item.create({
      data: {
        productName: data.productName,
        variableId: data.variableId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        secondSubcategoryId: data.secondSubcategoryId,
        availableUnitMeasures: { // Conectar múltiples unidades de medida
          create: data.unitMeasureIds.map(unitMeasureId => ({
            unitMeasure: {
              connect: { id: unitMeasureId }
            }
          }))
        }
      },
    })

    revalidatePath("/admin/items")
    return { success: true }
  } catch (error) {
    console.error("Error creating item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
