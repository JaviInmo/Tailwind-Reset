import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { DeleteVarContent } from "@/app/admin/incident/vars/var/delete/delete-var-content"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function ModalDeleteVar({ params }: PageProps) {
  // Check if the variable exists before rendering the DeleteVarContent
  const id = Number(params.id)
  const variableData = await prisma.variable.findUnique({
    where: { id },
  })

  if (!variableData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <DeleteVarContent id={id} varName={variableData.name} />
      </DialogContent>
    </Dialog>
  )
}
