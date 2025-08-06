import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { ItemEditForm } from "../item-edit-form" // Ruta corregida

export default async function UpdateItemPage({ params }: { params: { id: string } }) {
  await getAuth()

  const id = Number(params.id)

  // Obtener los datos del ítem, incluyendo sus relaciones de profundidad y unidades de medida
  const itemData = await prisma.item.findUnique({
    where: { id },
    include: {
      variable: true,
      category: true,
      subcategory: true,
      secondSubcategory: true,
      availableUnitMeasures: {
        include: {
          unitMeasure: true,
        },
      },
    },
  })

  if (!itemData) {
    return notFound()
  }

  // Obtener todas las variables, categorías, subcategorías y segundas subcategorías para los selects
  const variableData = await prisma.variable.findMany({
    include: {
      categories: {
        include: {
          subcategories: {
            include: {
              secondSubcategories: true,
            },
          },
        },
      },
    },
  })

  // Obtener todas las unidades de medida para los checkboxes
  const unitMeasures = await prisma.unitMeasure.findMany({
    select: { id: true, name: true },
  })

  return (
    <ItemEditForm
      itemData={itemData}
      variableData={variableData}
      unitMeasures={unitMeasures}
    />
  )
}
