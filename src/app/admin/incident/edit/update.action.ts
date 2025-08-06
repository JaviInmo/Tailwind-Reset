"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/libs/db"

// Definir el tipo de datos para la actualización de un incidente
type UpdateIncidentData = {
  id: number
  date: Date
  provinceId: string
  municipalityId: string
  variableId: number
  categoryId: number
  subcategoryId?: number | null
  secondSubcategoryId?: number | null
  numberOfPeople: number
  description: string
  title: string
  items?: {
    id?: number // Opcional para ítems existentes que se actualizan
    itemId: number
    quantityUsed: number
    unitMeasureId: number
  }[]
}

export async function updateIncidentAction(data: UpdateIncidentData) {
  try {
    // 1. Verificar si el incidente existe
    const existingIncident = await prisma.incident.findUnique({
      where: { id: data.id },
      include: { items: true }, // Incluir ítems para gestionar la relación
    })

    if (!existingIncident) {
      return {
        success: false,
        error: "Incidente no encontrado.",
      }
    }

    // 2. Preparar la actualización de los ítems
    const itemsToUpdate = data.items || []
    const existingItemIds = existingIncident.items.map(item => item.id)
    const newItemIds = itemsToUpdate.filter(item => item.id).map(item => item.id as number)

    // Ítems a eliminar (los que estaban y ya no están en la lista enviada)
    const itemsToDelete = existingItemIds.filter(id => !newItemIds.includes(id))

    // Ítems a crear o actualizar
    const itemOperations = itemsToUpdate.map(item => {
      if (item.id) {
        // Si tiene ID, es un ítem existente que se actualiza
        return prisma.incidentItem.update({
          where: { id: item.id },
          data: {
            itemId: item.itemId,
            quantityUsed: item.quantityUsed,
            unitMeasureId: item.unitMeasureId,
          },
        })
      } else {
        // Si no tiene ID, es un nuevo ítem a crear
        return prisma.incidentItem.create({
          data: {
            incidentId: data.id, // Conectar al incidente actual
            itemId: item.itemId,
            quantityUsed: item.quantityUsed,
            unitMeasureId: item.unitMeasureId,
          },
        })
      }
    })

    // Ejecutar todas las operaciones de ítems en una transacción
    await prisma.$transaction([
      prisma.incidentItem.deleteMany({
        where: {
          id: { in: itemsToDelete },
          incidentId: data.id, // Asegurarse de eliminar solo ítems de este incidente
        },
      }),
      ...itemOperations,
    ])

    // 3. Actualizar el incidente principal
    await prisma.incident.update({
      where: { id: data.id },
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
      },
    })

    revalidatePath("/admin/incident") // Revalidar la lista de incidentes
    revalidatePath(`/admin/incident/edit/${data.id}`) // Revalidar la página de edición del incidente
    return { success: true }
  } catch (error) {
    console.error("Error al actualizar el incidente:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado",
    }
  }
}
