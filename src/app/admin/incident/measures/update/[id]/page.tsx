import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { UnitUpdateForm } from "../unit-form"

export default async function UpdateUnitPage({ params }: { params: { id: string } }) {
  await getAuth()

  // Check if the unit exists before rendering the form
  const id = Number(params.id)
  const unitData = await prisma.unitMeasure.findUnique({
    where: { id },
  })

  if (!unitData) {
    return notFound()
  }

  return <UnitUpdateForm unitData={unitData} />
}
