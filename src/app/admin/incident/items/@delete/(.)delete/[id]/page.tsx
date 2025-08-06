import { getAuth } from "@/libs/auth"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { DeleteItemContent } from "../../../delete/delete-item-content" // Ruta corregida
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog" // Usando shadcn/ui Dialog

interface PageProps {
  params: {
    id: string
  }
}

export default async function ModalDeleteItemPage({ params }: PageProps) {
  await getAuth()

  const id = Number(params.id)

  const itemData = await prisma.item.findUnique({
    where: { id },
    select: { id: true, productName: true },
  })

  if (!itemData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogDescription>
          <DeleteItemContent id={itemData.id} productName={itemData.productName} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
