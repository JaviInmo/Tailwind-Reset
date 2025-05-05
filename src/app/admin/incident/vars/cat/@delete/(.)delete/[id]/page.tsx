import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { DeleteCatContent } from "@/app/admin/incident/vars/cat/delete/delete-cat-content"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function ModalDeleteCat({ params }: PageProps) {
  // Check if the category exists before rendering the DeleteCatContent
  const id = Number(params.id)
  const categoryData = await prisma.category.findUnique({
    where: { id },
    include: {
      variable: {
        select: { name: true },
      },
    },
  })

  if (!categoryData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <DeleteCatContent id={id} catName={categoryData.name} variableName={categoryData.variable.name} />
      </DialogContent>
    </Dialog>
  )
}
