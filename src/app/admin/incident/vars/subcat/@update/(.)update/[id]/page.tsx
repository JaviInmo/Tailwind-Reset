import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { SubCategoryUpdateForm } from "../../../update/subcat-form"

export default async function ModalEditSubCat(props: {
  params: { id: string }
}) {
  const params = props.params

  // Check if the subcategory exists before rendering the SubCategoryUpdateForm
  const id = Number(params.id)
  const subcategoryData = await prisma.subcategory.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!subcategoryData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <SubCategoryUpdateForm subcategoryData={subcategoryData} />
      </DialogContent>
    </Dialog>
  )
}
