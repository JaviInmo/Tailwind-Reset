"use server"
import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type UpdateData = {
  id: number
  name: string
  subcategoryId: number
}

export async function updateSecondSubcategoryAction(data: UpdateData) {
    try {
        // Ensure the second subcategory exists
        const existing = await prisma.secondSubcategory.findUnique({
        where: { id: data.id },
        })
    
        if (!existing) {
        return { success: false, error: "Subcategoría no encontrada" }
        }
    
        // Check if another second subcategory with the same name exists for this subcategory
        const existingSecondSubcategory = await prisma.secondSubcategory.findFirst({
        where: {
            name: data.name,
            subcategoryId: data.subcategoryId,
            id: { not: data.id }, // Exclude the current second subcategory
        },
        })
    
        if (existingSecondSubcategory) {
        return { success: false, error: "Ya existe una subcategoría con este nombre para esta categoría" }
        }
    
        // Update the second subcategory
        const secondSubcategory = await prisma.secondSubcategory.update({
        where: { id: data.id },
        data: {
            name: data.name,
            subcategoryId: data.subcategoryId,
        },
        })
    
        // Revalidate paths
        revalidatePath("/admin/incident/vars/secondsubcat")
        revalidatePath("/admin/incident/vars/secondsubcat/update/[id]")
    
        return { success: true, secondSubcategory }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error inesperado"
        console.error("Error al actualizar la subcategoría:", error)
        return { success: false, error: errorMessage }
    }
    }
    

    export async function fetchSubcategories() {
        return await prisma.subcategory.findMany({
            select: {
                id: true,
                name: true,
            },
        })
    }