import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { EditUserForm } from "../edit-user-form"

export default async function FormPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  await getAuth()

  return <EditUserPage params={params} />
}

export async function EditUserPage({ params }: { params: { id: string } }) {
  // Usamos el id como string, ya que Prisma espera un string
  const id = params.id

  const userData = await prisma.user.findUnique({
    where: { id },
  })

  if (!userData) {
    return notFound()
  }

  return (
    <EditUserForm
      userData={{
        id: userData.id,
        name: userData.name,
        role: userData.role,
      }}
    />
  )
}
