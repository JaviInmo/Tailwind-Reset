"use server"

import prisma from "@/libs/db"

type GetItemsByDepthParams = {
  variableId: number
  categoryId: number
  subcategoryId: number
  secondSubcategoryId: number | null
}

export async function getItemsByDepthAction(params: GetItemsByDepthParams) {
  try {
    const items = await prisma.item.findMany({
      where: {
        variableId: params.variableId,
        categoryId: params.categoryId,
        subcategoryId: params.subcategoryId,
        secondSubcategoryId: params.secondSubcategoryId,
      },
      include: {
        availableUnitMeasures: {
          include: {
            unitMeasure: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { productName: "asc" }
    })
    return { success: true, items }
  } catch (error) {
    console.error("Error fetching items by depth:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error inesperado" }
  }
}
