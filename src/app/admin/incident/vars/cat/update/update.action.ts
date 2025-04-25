"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type UpdateData = {
  id: number
  name: string
  variableId: number
}

export async function updateCategoryAction(data: UpdateData) {
  try {
    // Asegurar que existe
    const existing = await prisma.category.findUnique({
      where: { id: data.id },
    })

    if (!existing) {
      return { success: false, error: "Categoría no encontrada" }
    }

    // Verificar si ya existe una categoría con el mismo nombre para la misma variable
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: data.name,
        variableId: data.variableId,
        id: { not: data.id }, // Excluir la categoría actual
      },
    })

    if (existingCategory) {
      return { success: false, error: "Ya existe una categoría con este nombre para esta variable" }
    }

    // Actualizar
    const category = await prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        variableId: data.variableId,
      },
    })

    // Revalida las rutas
    revalidatePath("/admin/incident/vars/cat")
    revalidatePath("/admin/incident/vars/cat/update/[id]")

    return { success: true, category }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado"
    console.error("Error al actualizar la categoría:", error)
    return { success: false, error: errorMessage }
  }
}

// Obtiene todas las variables disponibles
export async function fetchVariables() {
  return await prisma.variable.findMany({
    select: {
      id: true,
      name: true,
    },
  })
}
