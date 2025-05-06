import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { SubCategoryUpdateForm } from "../subcat-form"

export default async function UpdateSubCatPage({ params }: { params: { id: string } }) {
  await getAuth()

  // Check if the subcategory exists before rendering the form
  const id = Number(params.id)
  const subcategoryData = await prisma.subcategory.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!subcategoryData) {
    return notFound()
  }

  return <SubCategoryUpdateForm subcategoryData={subcategoryData} />
}
