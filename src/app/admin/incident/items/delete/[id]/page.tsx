import { getAuth } from "@/libs/auth"
import { DeleteItemContent } from "@/app/admin/incident/items/delete/delete-item-content"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function DeleteItemPage({ params }: PageProps) {
  await getAuth()

  // Check if item exists on the server
  const id = Number(params.id)
  const itemData = await prisma.incidentItem.findUnique({
    where: { id },
    include: {
      incident: {
        select: { title: true },
      },
      unitMeasure: {
        select: { name: true },
      },
    },
  })

  if (!itemData) {
    return notFound()
  }

  // Pass item data to client component
  return (
    <DeleteItemContent
      id={id}
      itemName={itemData.productName}
      incidentTitle={itemData.incident.title}
      unitMeasure={itemData.unitMeasure?.name}
      quantity={itemData.quantity}
    />
  )
}
