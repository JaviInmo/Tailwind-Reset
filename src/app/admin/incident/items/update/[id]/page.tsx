import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { ItemUpdateForm } from "../item-form"

export default async function UpdateItemPage({ params }: { params: { id: string } }) {
  await getAuth()

  // Check if the incident exists before rendering the form
  const id = Number(params.id)
  const itemData = await prisma.incident.findUnique({
    where: { id },
    include: {
      variable: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      subcategory: {
        select: {
          id: true,
          name: true,
        },
      },
      secondSubcategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!itemData) {
    return notFound()
  }

  // Fetch unit measures for this incident using raw query
  const unitMeasuresData = (await prisma.$queryRaw`
    SELECT um.id, um.name 
    FROM incident_unit_measures ium
    JOIN unidades_medida um ON ium.unit_measure_id = um.id
    WHERE ium.incident_id = ${id}
  `) as { id: number; name: string }[]

  // Create a complete item data object with unit measures
  const completeItemData = {
    ...itemData,
    unitMeasures: unitMeasuresData.map((um) => ({
      unitMeasureId: um.id,
      unitMeasure: {
        id: um.id,
        name: um.name,
      },
    })),
  }

  return <ItemUpdateForm itemData={completeItemData} />
}
