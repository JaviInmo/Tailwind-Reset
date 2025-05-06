import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { DeleteSubCatContent } from "@/app/admin/incident/vars/subcat/delete/delete-subcat-content"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function ModalDeleteSubCat({ params }: PageProps) {
  // Check if the subcategory exists before rendering the DeleteSubCatContent
  const id = Number(params.id)
  const subcategoryData = await prisma.subcategory.findUnique({
    where: { id },
    include: {
      category: {
        select: { name: true },
      },
    },
  })

  if (!subcategoryData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <DeleteSubCatContent id={id} subcatName={subcategoryData.name} categoryName={subcategoryData.category.name} />
      </DialogContent>
    </Dialog>
  )
}
