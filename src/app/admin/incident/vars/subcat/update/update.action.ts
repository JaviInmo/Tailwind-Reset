"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type UpdateData = {
  id: number
  name: string
  categoryId: number
}

export async function updateSubcategoryAction(data: UpdateData) {
  try {
    // Ensure the subcategory exists
    const existing = await prisma.subcategory.findUnique({
      where: { id: data.id },
    })

    if (!existing) {
      return { success: false, error: "Subcategoría no encontrada" }
    }

    // Check if another subcategory with the same name exists for this category
    const existingSubcategory = await prisma.subcategory.findFirst({
      where: {
        name: data.name,
        categoryId: data.categoryId,
        id: { not: data.id }, // Exclude the current subcategory
      },
    })

    if (existingSubcategory) {
      return { success: false, error: "Ya existe una subcategoría con este nombre para esta categoría" }
    }

    // Update the subcategory
    const subcategory = await prisma.subcategory.update({
      where: { id: data.id },
      data: {
        name: data.name,
        categoryId: data.categoryId,
      },
    })

    // Revalidate paths
    revalidatePath("/admin/incident/vars/subcat")
    revalidatePath("/admin/incident/vars/subcat/update/[id]")

    return { success: true, subcategory }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error inesperado"
    console.error("Error al actualizar la subcategoría:", error)
    return { success: false, error: errorMessage }
  }
}

// Fetch all categories for the dropdown
export async function fetchCategories() {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  })
}
