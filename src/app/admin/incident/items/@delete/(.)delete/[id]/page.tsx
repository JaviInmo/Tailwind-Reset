import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { DeleteItemContent } from "@/app/admin/incident/items/delete/delete-item-content"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function ModalDeleteItem({ params }: PageProps) {
  // Check if the item exists before rendering the DeleteItemContent
  const id = Number(params.id)
  const itemData = await prisma.incidentItem.findUnique({
    where: { id },
    include: {
      incident: {
        select: { title: true },
      },
      unitMeasure: {
        select: { name: true },
      },
    },
  })

  if (!itemData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <DeleteItemContent
          id={id}
          itemName={itemData.productName}
          incidentTitle={itemData.incident.title}
          unitMeasure={itemData.unitMeasure?.name}
          quantity={itemData.quantity}
        />
      </DialogContent>
    </Dialog>
  )
}
