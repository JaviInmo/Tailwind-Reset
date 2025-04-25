import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { VariableForm } from "@/app/admin/incident/vars/var/create/var-form"

export default async function EditVarPage(props: {
  params: { id: string }
}) {
  const params = props.params
  await getAuth()

  const id = Number(params.id)
  const variableData = await prisma.variable.findUnique({
    where: { id },
    include: { categories: { include: { subcategories: true } } },
  })

  if (!variableData) {
    return <div>Variable not found</div>
  }

  return <VariableForm variableData={variableData} />
}
