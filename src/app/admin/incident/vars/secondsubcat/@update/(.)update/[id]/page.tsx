import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { SecondSubcategoryUpdateForm } from "../../../update/cat-form"

export default async function ModalEditSubCat(props: {
  params: { id: string }
}) {
  const params = props.params

  // Check if the subcategory exists before rendering the SubCategoryUpdateForm
  const id = Number(params.id)
  const secondSubcategoryData = await prisma.secondSubcategory.findUnique({
    where: { id },
    include: {
      subcategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!secondSubcategoryData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <SecondSubcategoryUpdateForm secondSubcategoryData={secondSubcategoryData} />
      </DialogContent>
    </Dialog>
  )
}