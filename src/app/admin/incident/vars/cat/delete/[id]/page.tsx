import { getAuth } from "@/libs/auth"
import { DeleteCatContent } from "@/app/admin/incident/vars/cat/delete/delete-cat-content"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function DeleteCatPage({ params }: PageProps) {
  await getAuth()

  // Check if category exists on the server
  const id = Number(params.id)
  const categoryData = await prisma.category.findUnique({
    where: { id },
    include: {
      variable: {
        select: { name: true },
      },
    },
  })

  if (!categoryData) {
    return notFound()
  }

  // Pass category data to client component
  return <DeleteCatContent id={id} catName={categoryData.name} variableName={categoryData.variable.name} />
}
