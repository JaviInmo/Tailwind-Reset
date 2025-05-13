import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { ItemUpdateForm } from "../item-form"

export default async function UpdateItemPage({ params }: { params: { id: string } }) {
  await getAuth()

  // Check if the item exists before rendering the form
  const id = Number(params.id)
  const itemData = await prisma.incidentItem.findUnique({
    where: { id },
    include: {
      incident: {
        select: {
          id: true,
          title: true,
        },
      },
      unitMeasure: {
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

  return <ItemUpdateForm itemData={itemData} />
}
