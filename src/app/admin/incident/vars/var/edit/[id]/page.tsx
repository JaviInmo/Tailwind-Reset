import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { EditVarForm } from "../edit-var-form"

export default async function FormPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  await getAuth()

  return <EditVarPage params={params} />
}

export async function EditVarPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)

  const variableData = await prisma.variable.findUnique({
    where: { id },
    include: { categories: { include: { subcategories: true } } },
  })

  if (!variableData) {
    return notFound()
  }

  return <EditVarForm variableData={variableData} />
}
