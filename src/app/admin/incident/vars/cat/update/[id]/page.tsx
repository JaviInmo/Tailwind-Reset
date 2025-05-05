import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { notFound } from "next/navigation"
import { CategoryUpdateForm } from "../../../cat/update/cat-form"

export default async function ModalEditCat(props: {
  params: { id: string }
}) {
  const params = props.params

  // Check if the category exists before rendering the CategoryUpdateForm
  const id = Number(params.id)
  const categoryData = await prisma.category.findUnique({
    where: { id },
    include: {
      variable: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!categoryData) {
    return notFound()
  }

  return (
    <Dialog open={true}>
      <DialogContent>
        <CategoryUpdateForm categoryData={categoryData} />
      </DialogContent>
    </Dialog>
  )
}
