import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { ItemUpdateForm } from "../../../update/item-form"

export default async function ModalEditItem(props: {
  params: { id: string }
}) {
  const params = props.params

  // Check if the item exists before rendering the ItemUpdateForm
  const id = Number(params.id)
  const itemData = await prisma.incidentItem.findUnique({
    where: { id },
    include: {
      incident: {
        select: {
          id: true,
          title: true,
        },
      },
      unitMeasure: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!itemData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <ItemUpdateForm itemData={itemData} />
      </DialogContent>
    </Dialog>
  )
}
