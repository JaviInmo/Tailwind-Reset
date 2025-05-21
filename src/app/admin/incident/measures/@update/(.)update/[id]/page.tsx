import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { UnitUpdateForm } from "../../../update/unit-form"

export default async function ModalEditUnit(props: {
  params: { id: string }
}) {
  const params = props.params

  // Check if the unit exists before rendering the UnitUpdateForm
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
        <UnitUpdateForm unitData={unitData} />
      </DialogContent>
    </Dialog>
  )
}
