import { getAuth } from "@/libs/auth"
import { DeleteUnitContent } from "../delete-unit-content"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function DeleteUnitPage({ params }: PageProps) {
  await getAuth()

  // Check if unit exists on the server
  const id = Number(params.id)
  const unitData = await prisma.unitMeasure.findUnique({
    where: { id },
    include: {
      _count: {
        select: { incidents: true },
      },
    },
  })

  if (!unitData) {
    return notFound()
  }

  // Pass unit data to client component
  return <DeleteUnitContent id={id} name={unitData.name} itemCount={unitData._count.incidents} />
}
