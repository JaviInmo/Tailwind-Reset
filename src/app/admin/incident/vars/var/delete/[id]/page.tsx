import { getAuth } from "@/libs/auth"
import { DeleteVarContent } from "@/app/admin/incident/vars/var/delete/delete-var-content"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function DeleteVarPage({ params }: PageProps) {
  await getAuth()

  // Check if variable exists on the server
  const id = Number(params.id)
  const variableData = await prisma.variable.findUnique({
    where: { id },
  })

  if (!variableData) {
    return notFound()
  }

  // Pass variable data to client component
  return <DeleteVarContent id={id} varName={variableData.name} />
}
