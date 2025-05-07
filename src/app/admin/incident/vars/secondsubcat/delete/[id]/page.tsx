import {getAuth} from "@/libs/auth"
import {DeleteSecondSubCatContent} from "@/app/admin/incident/vars/secondsubcat/delete/delete-cat-content"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function DeleteSecondSubCatPage({ params }: PageProps) {
  await getAuth()

  // Check if subcategory exists on the server
  const id = Number(params.id)
  const secondSubcategoryData = await prisma.secondSubcategory.findUnique({
    where: { id },
    include: {
      subcategory: {
        select: { name: true, category: { select: { name: true } } },
      },
    },
  })

  if (!secondSubcategoryData) {
    return notFound()
  }

  // Pass subcategory data to client component
  return (
    <DeleteSecondSubCatContent
      id={id}
      SecondSubcatName={secondSubcategoryData.name}
      SubCategoryName={secondSubcategoryData.subcategory.name} 
      
     
    />
  )
}

