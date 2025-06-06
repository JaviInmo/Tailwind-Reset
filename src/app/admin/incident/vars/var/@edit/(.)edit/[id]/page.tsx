import { EditVarPage } from "@/app/admin/incident/vars/var/edit/[id]/page"
import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"

export default async function ModalEditVar(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  // Check if the variable exists before rendering the EditVarPage
  const id = Number(params.id)
  const variableData = await prisma.variable.findUnique({
    where: { id },
    include: { categories: { include: { subcategories: true } } },
  })

  if (!variableData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <EditVarPage params={params} />
      </DialogContent>
    </Dialog>
  )
}
