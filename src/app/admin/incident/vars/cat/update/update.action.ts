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
    // Ensure the category exists
    const existing = await prisma.category.findUnique({
      where: { id: data.id },
    })

    if (!existing) {
      return { success: false, error: "Categoría no encontrada" }
    }

    // Check if another category with the same name exists for this variable
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: data.name,
        variableId: data.variableId,
        id: { not: data.id }, // Exclude the current category
      },
    })

    if (existingCategory) {
      return { success: false, error: "Ya existe una categoría con este nombre para esta variable" }
    }

    // Update the category
    const category = await prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        variableId: data.variableId,
      },
    })

    // Revalidate paths
    revalidatePath("/admin/incident/vars/cat")
    revalidatePath("/admin/incident/vars/cat/update/[id]")

    return { success: true, category }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado"
    console.error("Error al actualizar la categoría:", error)
    return { success: false, error: errorMessage }
  }
}

// Fetch all variables for the dropdown
export async function fetchVariables() {
  return await prisma.variable.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  })
}
