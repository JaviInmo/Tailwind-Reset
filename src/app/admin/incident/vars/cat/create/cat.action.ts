"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type RegisterData = {
  id?: number
  name: string
  variableId: number
}

export async function registerAction(data: RegisterData) {
  try {
    // If we have an ID, we're updating an existing category
    if (data.id) {
      const category = await prisma.category.findUnique({
        where: { id: data.id },
      })

      if (!category) {
        return { success: false, error: "Categoría no encontrada" }
      }

      // Check if another category with the same name exists for this variable
      if (data.name !== category.name || data.variableId !== category.variableId) {
        const exists = await prisma.category.findFirst({
          where: {
            name: data.name,
            variableId: data.variableId,
            id: { not: data.id }, // Exclude the current category
          },
        })

        if (exists) {
          return { success: false, error: "Ya existe una categoría con este nombre para esta variable" }
        }
      }

      // Update the category
      await prisma.category.update({
        where: { id: data.id },
        data: {
          name: data.name,
          variableId: data.variableId,
        },
      })

      revalidatePath("/admin/incident/vars/cat")
      return { success: true }
    }

    // Creating a new category
    // Check if a category with the same name already exists for this variable
    const exists = await prisma.category.findFirst({
      where: {
        name: data.name,
        variableId: data.variableId,
      },
    })

    if (exists) {
      return { success: false, error: "Ya existe una categoría con este nombre para esta variable" }
    }

    // Create the new category
    await prisma.category.create({
      data: {
        name: data.name,
        variableId: data.variableId,
      },
    })

    revalidatePath("/admin/incident/vars/cat")
    return { success: true }
  } catch (error) {
    console.error("Error processing category:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}

// Fetch all variables for the dropdown
export async function fetchVariables() {
  try {
    const variables = await prisma.variable.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return variables
  } catch (error) {
    console.error("Error fetching variables:", error)
    return []
  }
}
