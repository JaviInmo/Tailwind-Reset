import { getAuth } from "@/libs/auth"
import { DeleteSubCatContent } from "@/app/admin/incident/vars/subcat/delete/delete-subcat-content"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function DeleteSubCatPage({ params }: PageProps) {
  await getAuth()

  // Check if subcategory exists on the server
  const id = Number(params.id)
  const subcategoryData = await prisma.subcategory.findUnique({
    where: { id },
    include: {
      category: {
        select: { name: true },
      },
    },
  })

  if (!subcategoryData) {
    return notFound()
  }

  // Pass subcategory data to client component
  return <DeleteSubCatContent id={id} subcatName={subcategoryData.name} categoryName={subcategoryData.category.name} />
}
