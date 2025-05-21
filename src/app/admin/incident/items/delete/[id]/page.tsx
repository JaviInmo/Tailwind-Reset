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

  // Check if incident exists on the server
  const id = Number(params.id)
  const itemData = await prisma.incident.findUnique({
    where: { id },
    include: {
      variable: {
        select: { name: true },
      },
      category: {
        select: { name: true },
      },
    },
  })

  if (!itemData) {
    return notFound()
  }

  // Pass incident data to client component
  return (
    <DeleteItemContent
      id={id}
      title={itemData.title}
      variableName={itemData.variable?.name}
      categoryName={itemData.category?.name}
    />
  )
}
