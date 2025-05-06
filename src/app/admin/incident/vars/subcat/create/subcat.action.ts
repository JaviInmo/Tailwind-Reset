"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type RegisterData = {
  id?: number
  name: string
  categoryId: number
}

export async function registerAction(data: RegisterData) {
  try {
    // If we have an ID, we're updating an existing subcategory
    if (data.id) {
      const subcategory = await prisma.subcategory.findUnique({
        where: { id: data.id },
      })

      if (!subcategory) {
        return { success: false, error: "Subcategoría no encontrada" }
      }

      // Check if another subcategory with the same name exists for this category
      if (data.name !== subcategory.name || data.categoryId !== subcategory.categoryId) {
        const exists = await prisma.subcategory.findFirst({
          where: {
            name: data.name,
            categoryId: data.categoryId,
            id: { not: data.id }, // Exclude the current subcategory
          },
        })

        if (exists) {
          return { success: false, error: "Ya existe una subcategoría con este nombre para esta categoría" }
        }
      }

      // Update the subcategory
      await prisma.subcategory.update({
        where: { id: data.id },
        data: {
          name: data.name,
          categoryId: data.categoryId,
        },
      })

      revalidatePath("/admin/incident/vars/subcat")
      return { success: true }
    }

    // Creating a new subcategory
    // Check if a subcategory with the same name already exists for this category
    const exists = await prisma.subcategory.findFirst({
      where: {
        name: data.name,
        categoryId: data.categoryId,
      },
    })

    if (exists) {
      return { success: false, error: "Ya existe una subcategoría con este nombre para esta categoría" }
    }

    // Create the new subcategory
    await prisma.subcategory.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
      },
    })

    revalidatePath("/admin/incident/vars/subcat")
    return { success: true }
  } catch (error) {
    console.error("Error processing subcategory:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}

// Fetch all categories for the dropdown
export async function fetchCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}
