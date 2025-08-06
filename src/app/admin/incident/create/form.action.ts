"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

type FormSchemaData = {
  date: Date
  provinceId: string
  municipalityId: string
  variableId: number
  categoryId: number
  subcategoryId?: number | null // Puede ser nulo
  secondSubcategoryId?: number | null // Puede ser nulo

  numberOfPeople: number
  description: string
  title: string
  items?: {
    itemId: number // Cambiado de productName a itemId
    quantityUsed: number // Cambiado de quantity a quantityUsed
    unitMeasureId: number // Cambiado a number
  }[]
}

export async function customSubmit(data: FormSchemaData) {
  return await registerAction(data)
}

export async function registerAction(data: FormSchemaData) {
  try {
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
        items:
          data.items && data.items.length > 0
            ? {
                create: data.items.map((item) => ({
                  itemId: item.itemId, // Usar itemId
                  quantityUsed: item.quantityUsed, // Usar quantityUsed
                  unitMeasureId: item.unitMeasureId, // Usar unitMeasureId
                })),
              }
            : undefined,
      },
    })
    revalidatePath("/admin/incident") // Revalidar la ruta principal de incidentes
    return { success: true, incident }
  } catch (error) {
    let errorMessage = "Ocurrió un error inesperado"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error al registrar el incidente:", error)
    return { success: false, error: errorMessage }
  }
}
