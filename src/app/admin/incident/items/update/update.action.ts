"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type UpdateItemData = {
  id: number
  productName: string
  variableId: number
  categoryId: number
  subcategoryId: number
  secondSubcategoryId: number | null
  unitMeasureIds: number[]
}

export async function updateItemAction(data: UpdateItemData) {
  try {
    // 1. Verificar si el ítem existe
    const existingItem = await prisma.item.findUnique({
      where: { id: data.id },
      include: { availableUnitMeasures: true }, // Incluir para gestionar la relación
    })

    if (!existingItem) {
      return {
        success: false,
        error: "Ítem no encontrado",
      }
    }

    // 2. Verificar duplicados (nombre de producto + profundidad) excluyendo el ítem actual
    const duplicateItem = await prisma.item.findFirst({
      where: {
        productName: data.productName,
        variableId: data.variableId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        secondSubcategoryId: data.secondSubcategoryId,
        id: { not: data.id }, // Excluir el ítem que estamos actualizando
      },
    })

    if (duplicateItem) {
      return {
        success: false,
        error: "Ya existe un ítem con el mismo nombre y profundidad.",
      }
    }

    // 3. Actualizar el ítem y sus unidades de medida asociadas
    await prisma.item.update({
      where: { id: data.id },
      data: {
        productName: data.productName,
        variableId: data.variableId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        secondSubcategoryId: data.secondSubcategoryId,
        availableUnitMeasures: {
          // Desconectar las unidades de medida que ya no están seleccionadas
          deleteMany: {
            itemId: data.id,
            unitMeasureId: {
              notIn: data.unitMeasureIds,
            },
          },
          // Conectar las nuevas unidades de medida seleccionadas
          connectOrCreate: data.unitMeasureIds.map((unitMeasureId) => ({
            where: {
              itemId_unitMeasureId: {
                itemId: data.id,
                unitMeasureId: unitMeasureId,
              },
            },
            create: {
              unitMeasureId: unitMeasureId,
            },
          })),
        },
      },
    })

    revalidatePath("/admin/items") // Revalidar la lista de ítems
    revalidatePath(`/admin/items/edit/${data.id}`) // Revalidar la página de edición del ítem
    return { success: true }
  } catch (error) {
    console.error("Error al actualizar el ítem:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
