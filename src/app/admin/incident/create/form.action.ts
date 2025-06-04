"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type FormSchemaData = {
  date: Date
  provinceId: string
  municipalityId: string
  variableId: number
  categoryId: number
  subcategoryId?: number
  secondSubcategoryId?: number
  
  numberOfPeople: number
  description: string
  title: string
  items?: {
    productName: string
    quantity: number
    unitMeasureId: number | null
  }[]
}

export async function customSubmit(data: FormSchemaData) {
  return await registerAction(data)
}

export async function registerAction(data: FormSchemaData) {
  try {
    // Crea el incidente con sus ítems
    console.log("Datos a insertar:", data)
    const incident = await prisma.incident.create({
      data: {
        date: data.date,
        provinceId: data.provinceId,
        municipalityId: data.municipalityId,
        variableId: data.variableId,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        secondSubcategoryId: data.secondSubcategoryId,
       
        numberOfPeople: data.numberOfPeople,
        description: data.description,
        title: data.title,
        // Create related items if provided
        items:
          data.items && data.items.length > 0
            ? {
                create: data.items.map((item) => ({
                  productName: item.productName,
                  quantity: item.quantity,
                  unitMeasureId: item.unitMeasureId,
                })),
              }
            : undefined,
      },
    })

    revalidatePath("/admin/incident")

    return { success: true, incident }
  } catch (error) {
    let errorMessage = "An unexpected error occurred"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    console.error("Error al registrar el incidente:", error)
    return { success: false, error: errorMessage }
  }
}
