import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { DeleteUnitContent } from "@/app/admin/incident/measures/delete/delete-unit-content"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function ModalDeleteUnit({ params }: PageProps) {
  // Check if the unit exists before rendering the DeleteUnitContent
  const id = Number(params.id)
  const unitData = await prisma.unitMeasure.findUnique({
    where: { id },
  })

  if (!unitData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <DeleteUnitContent id={id} name={unitData.name} />
      </DialogContent>
    </Dialog>
  )
}
